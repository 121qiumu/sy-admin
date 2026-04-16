import { appConfig, requestConfig } from '@/config';
import { useAuthStore } from '@/stores/modules/auth';
import { usePermissionStore } from '@/stores/modules/permission';
import { HOME_PATH, isAuthWhiteListRoute, normalizeRedirectPath } from '@/utils/auth';
import { CATCH_ALL_ROUTE_NAME, FORBIDDEN_PATH, NOT_FOUND_PATH } from './routes';

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

function resolveCatchAllNavigation(to, permissionStore) {
  if (permissionStore.canAccessPath(to.path)) {
    return {
      path: to.fullPath,
      replace: true,
    };
  }

  if (permissionStore.isKnownProtectedPath(to.path)) {
    return {
      path: FORBIDDEN_PATH,
      replace: true,
      query: {
        path: to.fullPath,
      },
    };
  }

  return {
    path: NOT_FOUND_PATH,
    replace: true,
    query: {
      path: to.fullPath,
    },
  };
}

export function setupRouterGuards(router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    const permissionStore = usePermissionStore();
    const isWhiteRoute = to.meta?.public || isAuthWhiteListRoute(to.path);

    document.title = resolveDocumentTitle(to.meta?.title);

    if (!appConfig.enableAuthGuard) {
      return true;
    }

    if (!authStore.hasToken) {
      permissionStore.resetPermissionState(router);

      if (isWhiteRoute) {
        return true;
      }

      return resolveLoginRedirect(to);
    }

    try {
      await authStore.ensureProfileLoaded({
        showErrorMessage: false,
      });
      await permissionStore.ensurePermissionRoutes(router);
    } catch {
      if (!authStore.hasToken) {
        permissionStore.resetPermissionState(router);

        if (isWhiteRoute) {
          return true;
        }

        return resolveLoginRedirect(to);
      }

      if (to.meta?.requiresAuth && to.path !== HOME_PATH) {
        return {
          path: HOME_PATH,
          replace: true,
        };
      }

      return true;
    }

    if (to.path === requestConfig.loginPath) {
      return normalizeRedirectPath(to.query.redirect);
    }

    if (to.name === CATCH_ALL_ROUTE_NAME) {
      return resolveCatchAllNavigation(to, permissionStore);
    }

    if (to.meta?.requiresAuth && to.path !== '/dashboard' && !permissionStore.canAccessPath(to.path)) {
      return {
        path: FORBIDDEN_PATH,
        replace: true,
        query: {
          path: to.fullPath,
        },
      };
    }

    return true;
  });
}
