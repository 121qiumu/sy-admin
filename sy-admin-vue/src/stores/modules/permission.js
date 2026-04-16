import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { getPermMenu } from '@/api/modules/app';
import { HOME_MENU_ITEM } from '@/layout/menu';
import {
  KNOWN_PERMISSION_PATHS,
  buildPermissionMenuTree,
  buildPermissionRoutes,
  buildSidebarMenus,
  extractAccessiblePaths,
  hasMenuPath,
  normalizePermissionCodes,
  resolveOpenMenuKeys,
} from '@/permission';
import { ROOT_ROUTE_NAME } from '@/router/routes';

let permissionPromise = null;

function cloneHomeMenu() {
  return {
    ...HOME_MENU_ITEM,
    children: [],
    buttonMenus: [],
  };
}

export const usePermissionStore = defineStore('permission', () => {
  const perms = ref([]);
  const rawMenus = ref([]);
  const menuTree = ref([]);
  const sidebarMenus = ref([]);
  const accessiblePaths = ref(['/dashboard']);
  const dynamicRouteNames = ref([]);
  const routesLoaded = ref(false);

  const permissionSet = computed(() => new Set(perms.value));
  const accessiblePathSet = computed(() => new Set(accessiblePaths.value));

  const navigationMenus = computed(() => {
    const homeMenu = cloneHomeMenu();

    if (hasMenuPath(sidebarMenus.value, homeMenu.routePath)) {
      return sidebarMenus.value;
    }

    return [homeMenu, ...sidebarMenus.value];
  });

  function setPermissionData(payload = {}) {
    const menuList = Array.isArray(payload.menus) ? payload.menus : [];

    rawMenus.value = menuList;
    perms.value = normalizePermissionCodes(payload.perms || []);
    menuTree.value = buildPermissionMenuTree(menuList);
    sidebarMenus.value = buildSidebarMenus(menuTree.value);
    accessiblePaths.value = extractAccessiblePaths(menuTree.value);
  }

  function removeDynamicRoutes(router) {
    dynamicRouteNames.value.forEach((routeName) => {
      if (router.hasRoute(routeName)) {
        router.removeRoute(routeName);
      }
    });

    dynamicRouteNames.value = [];
  }

  function resetPermissionState(router) {
    if (router) {
      removeDynamicRoutes(router);
    }

    perms.value = [];
    rawMenus.value = [];
    menuTree.value = [];
    sidebarMenus.value = [];
    accessiblePaths.value = ['/dashboard'];
    routesLoaded.value = false;
    permissionPromise = null;
  }

  async function ensurePermissionRoutes(router) {
    if (routesLoaded.value) {
      return {
        added: false,
      };
    }

    if (permissionPromise) {
      return permissionPromise;
    }

    permissionPromise = (async () => {
      const permissionData = await getPermMenu({
        showErrorMessage: false,
      });

      setPermissionData(permissionData);
      removeDynamicRoutes(router);

      const dynamicRoutes = buildPermissionRoutes(menuTree.value);

      dynamicRoutes.forEach((route) => {
        if (!route.name || router.hasRoute(route.name)) {
          return;
        }

        router.addRoute(ROOT_ROUTE_NAME, route);
        dynamicRouteNames.value.push(route.name);
      });

      routesLoaded.value = true;

      return {
        added: dynamicRoutes.length > 0,
      };
    })()
      .catch((error) => {
        resetPermissionState(router);
        throw error;
      })
      .finally(() => {
        permissionPromise = null;
      });

    return permissionPromise;
  }

  function hasPermission(required, mode = 'some') {
    const requiredPermissions = normalizePermissionCodes(required);

    if (requiredPermissions.length === 0) {
      return true;
    }

    if (mode === 'every') {
      return requiredPermissions.every((permission) => permissionSet.value.has(permission));
    }

    return requiredPermissions.some((permission) => permissionSet.value.has(permission));
  }

  function canAccessPath(path = '') {
    return accessiblePathSet.value.has(path);
  }

  function isKnownProtectedPath(path = '') {
    return accessiblePathSet.value.has(path) || KNOWN_PERMISSION_PATHS.has(path);
  }

  function resolveOpenKeys(path = '') {
    return resolveOpenMenuKeys(path, navigationMenus.value);
  }

  return {
    perms,
    rawMenus,
    menuTree,
    sidebarMenus,
    accessiblePaths,
    dynamicRouteNames,
    routesLoaded,
    navigationMenus,
    setPermissionData,
    resetPermissionState,
    ensurePermissionRoutes,
    hasPermission,
    canAccessPath,
    isKnownProtectedPath,
    resolveOpenKeys,
  };
});
