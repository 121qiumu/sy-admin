import { requestConfig } from '@/config';

export const HOME_PATH = '/dashboard';
export const FORBIDDEN_PATH = '/403';
export const NOT_FOUND_PATH = '/404';
export const AUTH_WHITE_LIST = [requestConfig.loginPath, FORBIDDEN_PATH, NOT_FOUND_PATH];

export function isAuthWhiteListRoute(path = '') {
  return AUTH_WHITE_LIST.includes(path);
}

export function normalizeRedirectPath(path, fallback = HOME_PATH) {
  if (typeof path !== 'string') {
    return fallback;
  }

  if (!path.startsWith('/') || path.startsWith('//') || path === requestConfig.loginPath) {
    return fallback;
  }

  return path;
}
