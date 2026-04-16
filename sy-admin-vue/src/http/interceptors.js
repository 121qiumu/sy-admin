import { isHttpSuccessCode, requestConfig } from '@/config';
import { router } from '@/router';
import { pinia } from '@/stores';
import { useAuthStore } from '@/stores/modules/auth';
import {
  getBusinessErrorMessage,
  getHttpStatusMessage,
  isCancelRequest,
  isTimeoutError,
} from './status';
import { createBusinessError, getResponseMessage, isResponseEnvelope } from './utils';

let isRedirectingToLogin = false;

function shouldShowErrorMessage(config = {}) {
  return requestConfig.enableGlobalErrorMessage && config.showErrorMessage !== false;
}

function getAuthStore() {
  return useAuthStore(pinia);
}

async function resetPermissionSession() {
  const { usePermissionStore } = await import('@/stores/modules/permission');
  const permissionStore = usePermissionStore(pinia);

  permissionStore.resetPermissionState(router);
}

function redirectToLogin() {
  const currentRoute = router.currentRoute.value;
  const currentPath = currentRoute?.fullPath || `${window.location.pathname}${window.location.search}`;

  if (
    currentRoute?.path === requestConfig.loginPath ||
    window.location.pathname === requestConfig.loginPath ||
    isRedirectingToLogin
  ) {
    return;
  }

  isRedirectingToLogin = true;

  router
    .replace({
      path: requestConfig.loginPath,
      query: currentPath ? { redirect: currentPath } : {},
    })
    .finally(() => {
      isRedirectingToLogin = false;
    });
}

function handleBusinessResponse(response) {
  const { config, data } = response;

  if (config.returnRawResponse) {
    return response;
  }

  if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
    return data;
  }

  if (typeof data === 'string' || !isResponseEnvelope(data)) {
    return data;
  }

  if (isHttpSuccessCode(data.code)) {
    return config.returnFullResponseData ? data : data.data;
  }

  const message = getBusinessErrorMessage(data.code, data.message);
  const businessError = createBusinessError(
    {
      ...data,
      message,
    },
    config
  );

  if (shouldShowErrorMessage(config)) {
    ElMessage.error(message);
  }

  return Promise.reject(businessError);
}

async function handleHttpError(error) {
  if (isCancelRequest(error)) {
    return Promise.reject(error);
  }

  const requestOptions = error.config || {};
  const response = error.response;
  const authStore = getAuthStore();
  let message;

  if (isTimeoutError(error)) {
    message = `请求超时，请在 ${Math.ceil(requestConfig.timeout / 1000)} 秒后重试`;
  } else if (!response) {
    message = '网络连接异常，请检查后端服务或代理配置';
  } else {
    const { status, data } = response;
    const responseMessage = getResponseMessage(data);

    if (status === 401) {
      authStore.clearAuth();
      await resetPermissionSession();
      message = responseMessage || getHttpStatusMessage(status);

      if (requestOptions.skipAuthRedirect !== true) {
        if (shouldShowErrorMessage(requestOptions) && !isRedirectingToLogin) {
          ElMessage.error(message);
        }

        redirectToLogin();
        error.normalizedMessage = message;
        return Promise.reject(error);
      }
    } else {
      message = responseMessage || getHttpStatusMessage(status);
    }
  }

  error.normalizedMessage = message;

  if (message && shouldShowErrorMessage(requestOptions)) {
    ElMessage.error(message);
  }

  return Promise.reject(error);
}

export function setupInterceptors(http) {
  http.interceptors.request.use(
    (config) => {
      const finalConfig = config;
      const authStore = getAuthStore();

      finalConfig.headers = finalConfig.headers || {};

      if (finalConfig.withToken !== false && authStore.token) {
        finalConfig.headers[requestConfig.tokenHeaderKey] = authStore.token;
      }

      return finalConfig;
    },
    (error) => Promise.reject(error)
  );

  http.interceptors.response.use(handleBusinessResponse, handleHttpError);
}
