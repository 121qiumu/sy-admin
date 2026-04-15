import { http } from '@/http';

export function getCaptcha(params) {
  return http.get('/admin/base/open/captcha', { params });
}

export function login(data) {
  return http.post('/admin/base/open/login', data);
}

export function refreshToken(params) {
  return http.get('/admin/base/open/refreshToken', { params });
}

export function logout() {
  return http.post('/admin/base/comm/logout');
}
