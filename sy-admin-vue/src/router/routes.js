import AdminLayout from '@/layout/AdminLayout.vue';

export const ROOT_ROUTE_NAME = 'RootLayout';
export const CATCH_ALL_ROUTE_NAME = 'PathFallback';
export const FORBIDDEN_PATH = '/403';
export const NOT_FOUND_PATH = '/404';

export const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      public: true,
    },
  },
  {
    path: '/',
    name: ROOT_ROUTE_NAME,
    component: AdminLayout,
    redirect: '/dashboard',
    meta: {
      title: '后台工作台',
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '工作台',
          icon: 'home',
          keepAlive: true,
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: FORBIDDEN_PATH,
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '无权限访问',
      public: true,
    },
  },
  {
    path: NOT_FOUND_PATH,
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      public: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: CATCH_ALL_ROUTE_NAME,
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      requiresAuth: true,
    },
  },
];
