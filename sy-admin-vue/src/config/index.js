function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return value === 'true';
}

function toNumber(value, fallback) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

const env = import.meta.env;

export const appConfig = {
  title: env.VITE_APP_TITLE || 'Sy Admin',
  apiBaseUrl: env.VITE_API_BASE_URL || '/',
  enableAuthGuard: toBoolean(env.VITE_ENABLE_AUTH_GUARD, false),
  visualizerEnabled: toBoolean(env.VITE_USE_VISUALIZER, false),
};

export const requestConfig = {
  baseURL: env.VITE_API_BASE_URL || '/',
  timeout: toNumber(env.VITE_HTTP_TIMEOUT, 15000),
  successCode: toNumber(env.VITE_API_SUCCESS_CODE, 1000),
  tokenHeaderKey: env.VITE_TOKEN_HEADER_KEY || 'Authorization',
  enableGlobalErrorMessage: toBoolean(env.VITE_ENABLE_HTTP_ERROR_MESSAGE, true),
  loginPath: env.VITE_LOGIN_PATH || '/login',
};

export function isHttpSuccessCode(code) {
  return code === requestConfig.successCode;
}
