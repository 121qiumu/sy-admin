const permissionWorkspaceView = () => import('@/views/permission/workspace.vue');

export const KNOWN_PERMISSION_PATHS = new Set([
  '/dashboard',
  '/sys',
  '/sys/menu',
  '/test/aa',
  '/sys/role',
  '/sys/user',
  '/sys/param',
  '/sys/log',
  '/task/list',
  '/tutorial',
  '/tutorial/doc',
  '/upload/list',
  '/recycle/data',
  '/user/list',
  '/helper/plugins',
]);

export function normalizePermissionCodes(value) {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.flatMap((item) => normalizePermissionCodes(item))));
  }

  if (typeof value !== 'string') {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

export function isExternalUrl(value = '') {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function sortMenus(list = []) {
  return [...list].sort((prev, next) => {
    const orderDiff = Number(prev.orderNum || 0) - Number(next.orderNum || 0);

    if (orderDiff !== 0) {
      return orderDiff;
    }

    return String(prev.id).localeCompare(String(next.id));
  });
}

function normalizeMenuRecord(item = {}) {
  const router = typeof item.router === 'string' ? item.router.trim() : '';
  const viewPath = typeof item.viewPath === 'string' ? item.viewPath.trim() : '';
  const externalLink = isExternalUrl(viewPath) ? viewPath : isExternalUrl(router) ? router : '';

  return {
    id: String(item.id),
    parentId: item.parentId == null ? null : String(item.parentId),
    name: item.name || '未命名菜单',
    router,
    routePath: externalLink && !router.startsWith('/') ? '' : router,
    perms: item.perms ?? null,
    permissionCodes: normalizePermissionCodes(item.perms),
    type: Number(item.type ?? 0),
    icon: item.icon || '',
    orderNum: Number(item.orderNum ?? 0),
    viewPath,
    keepAlive: item.keepAlive !== false,
    isShow: item.isShow !== false,
    hiddenInMenu: item.isShow === false,
    externalLink,
    menuKey: `menu-${item.id}`,
    children: [],
  };
}

export function buildPermissionMenuTree(menuList = []) {
  const normalizedMenus = sortMenus(menuList).map((item) => normalizeMenuRecord(item));
  const menuMap = new Map();

  normalizedMenus.forEach((item) => {
    menuMap.set(item.id, {
      ...item,
      children: [],
    });
  });

  const roots = [];

  menuMap.forEach((item) => {
    const parentMenu = item.parentId ? menuMap.get(item.parentId) : null;

    if (parentMenu) {
      parentMenu.children.push(item);
    } else {
      roots.push(item);
    }
  });

  const visit = (nodes) => {
    return sortMenus(nodes).map((node) => ({
      ...node,
      children: visit(node.children || []),
    }));
  };

  return visit(roots);
}

export function collectButtonMenus(menuNode) {
  const buttons = [];

  const visit = (children = []) => {
    children.forEach((child) => {
      if (child.type === 2 && child.permissionCodes.length > 0) {
        buttons.push({
          id: child.id,
          name: child.name,
          rawPerms: child.perms,
          permissionCodes: child.permissionCodes,
          orderNum: child.orderNum,
        });
      }

      if (child.children?.length) {
        visit(child.children);
      }
    });
  };

  visit(menuNode.children || []);

  return sortMenus(buttons);
}

function resolveFirstRoutePath(menuNode) {
  const children = sortMenus(menuNode.children || []).filter((item) => item.type !== 2);

  for (const child of children) {
    if (child.type === 1 && child.routePath && child.isShow !== false) {
      return child.routePath;
    }

    const nestedPath = resolveFirstRoutePath(child);

    if (nestedPath) {
      return nestedPath;
    }
  }

  return '';
}

export function buildSidebarMenus(menuTree = []) {
  const visit = (nodes = []) => {
    return sortMenus(nodes)
      .filter((item) => item.type !== 2)
      .map((item) => ({
        ...item,
        children: visit(item.children || []),
      }))
      .filter((item) => {
        if (item.hiddenInMenu) {
          return false;
        }

        if (item.type === 1) {
          return Boolean(item.routePath || item.externalLink);
        }

        return item.children.length > 0 || Boolean(item.routePath);
      });
  };

  return visit(menuTree);
}

export function buildPermissionRoutes(menuTree = []) {
  const dynamicRoutes = [];

  const visit = (nodes = [], ancestors = []) => {
    sortMenus(nodes).forEach((node) => {
      if (node.type === 0) {
        const redirectPath = resolveFirstRoutePath(node);

        if (node.routePath && redirectPath) {
          dynamicRoutes.push({
            path: node.routePath,
            name: `permission-group-${node.id}`,
            redirect: redirectPath,
            meta: {
              title: node.name,
              dynamicRoute: true,
              hiddenInMenu: true,
              requiresAuth: true,
            },
          });
        }

        visit(node.children || [], [...ancestors, node]);
        return;
      }

      if (node.type === 1 && node.routePath) {
        const buttonMenus = collectButtonMenus(node);

        dynamicRoutes.push({
          path: node.routePath,
          name: `permission-page-${node.id}`,
          component: permissionWorkspaceView,
          meta: {
            title: node.name,
            icon: node.icon,
            dynamicRoute: true,
            requiresAuth: true,
            keepAlive: node.keepAlive,
            hiddenInMenu: node.hiddenInMenu,
            menuId: node.id,
            menuName: node.name,
            menuPath: node.routePath,
            viewPath: node.viewPath,
            externalLink: node.externalLink,
            breadcrumbTitles: [...ancestors.map((item) => item.name), node.name],
            buttonMenus,
            permissionCodes: Array.from(
              new Set(buttonMenus.flatMap((button) => button.permissionCodes))
            ),
          },
        });
      }

      if (node.children?.length) {
        visit(node.children, [...ancestors, node]);
      }
    });
  };

  visit(menuTree);

  return dynamicRoutes;
}

export function extractAccessiblePaths(menuTree = []) {
  const paths = new Set(['/dashboard']);

  const visit = (nodes = []) => {
    nodes.forEach((node) => {
      if (node.type === 0) {
        const redirectPath = resolveFirstRoutePath(node);

        if (node.routePath && redirectPath) {
          paths.add(node.routePath);
        }
      }

      if (node.type === 1 && node.routePath) {
        paths.add(node.routePath);
      }

      if (node.children?.length) {
        visit(node.children);
      }
    });
  };

  visit(menuTree);

  return Array.from(paths);
}

export function resolveOpenMenuKeys(path, menus = []) {
  const openKeys = [];

  const visit = (nodes = [], ancestors = []) => {
    for (const node of nodes) {
      if (node.routePath === path) {
        openKeys.push(...ancestors);
        return true;
      }

      if (node.children?.length) {
        const nextAncestors = node.type === 0 ? [...ancestors, node.menuKey] : ancestors;

        if (visit(node.children, nextAncestors)) {
          return true;
        }
      }
    }

    return false;
  };

  visit(menus);

  return openKeys;
}

export function hasMenuPath(menus = [], path = '') {
  return menus.some((item) => {
    if (item.routePath === path) {
      return true;
    }

    return item.children?.length ? hasMenuPath(item.children, path) : false;
  });
}
