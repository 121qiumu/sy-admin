import { ElMessage } from 'element-plus';
import { http } from './client';
import { useAuthStore } from '@/stores/modules/auth';

http.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();

    if (authStore.token) {
      config.headers.Authorization = authStore.token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => {
    const { data } = response;

    if (data?.code === 1000) {
      return data.data;
    }

    if (typeof data?.message === 'string' && data.message) {
      ElMessage.error(data.message);
    }

    return Promise.reject(data);
  },
  (error) => {
    const authStore = useAuthStore();
    const status = error?.response?.status;

    if (status === 401) {
      authStore.clearAuth();
      ElMessage.error('登录状态已失效，请重新登录');
    } else if (status === 403) {
      ElMessage.error('当前账号没有访问权限');
    } else if (error?.message) {
      ElMessage.error(error.message);
    }

    return Promise.reject(error);
  }
);
