import { request } from '@/http';

export function getCaptcha(params) {
  return request.get('/admin/base/open/captcha', {
    params,
    skipAuthRedirect: true,
    withToken: false,
  });
}

export function login(data) {
  return request.post('/admin/base/open/login', data, {
    skipAuthRedirect: true,
    withToken: false,
  });
}

export function refreshToken(params) {
  return request.get('/admin/base/open/refreshToken', {
    params,
    skipAuthRedirect: true,
    withToken: false,
  });
}

export function logout() {
  return request.post('/admin/base/comm/logout');
}
