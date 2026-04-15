import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { setupRouterGuards } from './guard';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

setupRouterGuards(router);
