import { appConfig } from '@/config';
import { useAuthStore } from '@/stores/modules/auth';

export function setupRouterGuards(router) {
  router.beforeEach((to) => {
    const authStore = useAuthStore();

    document.title = `${to.meta?.title || '后台'} - ${appConfig.title}`;

    if (!appConfig.enableAuthGuard) {
      return true;
    }

    if (to.meta?.public) {
      return true;
    }

    if (authStore.hasToken) {
      return true;
    }

    return {
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    };
  });
}
