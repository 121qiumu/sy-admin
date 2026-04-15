import { appConfig, requestConfig } from '@/config';
import { useAuthStore } from '@/stores/modules/auth';
import { isAuthWhiteListRoute, normalizeRedirectPath } from '@/utils/auth';

function resolveDocumentTitle(routeTitle) {
  return `${routeTitle || '后台管理'} - ${appConfig.title}`;
}

function resolveLoginRedirect(to) {
  return {
    path: requestConfig.loginPath,
    query: {
      redirect: to.fullPath,
    },
  };
}

export function setupRouterGuards(router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    const isWhiteRoute = to.meta?.public || isAuthWhiteListRoute(to.path);

    document.title = resolveDocumentTitle(to.meta?.title);

    if (!appConfig.enableAuthGuard) {
      return true;
    }

    if (authStore.hasToken) {
      if (to.path === requestConfig.loginPath) {
        try {
          await authStore.ensureProfileLoaded({
            showErrorMessage: false,
          });

          return normalizeRedirectPath(to.query.redirect);
        } catch {
          return true;
        }
      }

      return true;
    }

    if (isWhiteRoute) {
      return true;
    }

    return resolveLoginRedirect(to);
  });
}
