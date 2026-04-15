import { request } from '@/http';

export function getCaptcha(params, config = {}) {
  return request.get('/admin/base/open/captcha', {
    ...config,
    params,
    skipAuthRedirect: true,
    withToken: false,
  });
}

export function login(data, config = {}) {
  return request.post('/admin/base/open/login', data, {
    ...config,
    skipAuthRedirect: true,
    withToken: false,
  });
}

export function refreshToken(params, config = {}) {
  return request.get('/admin/base/open/refreshToken', {
    ...config,
    params,
    skipAuthRedirect: true,
    withToken: false,
  });
}

export function logout(config = {}) {
  return request.post('/admin/base/comm/logout', {}, config);
}
