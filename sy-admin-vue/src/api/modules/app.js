import { request } from '@/http';

export function getProfile(config = {}) {
  return request.get('/admin/base/comm/person', config);
}

export function getPermMenu(config = {}) {
  return request.get('/admin/base/comm/permmenu', config);
}

export function uploadFile(data, config = {}) {
  return request.upload('/admin/base/comm/upload', data, config);
}

export function getUploadMode(config = {}) {
  return request.get('/admin/base/comm/uploadMode', config);
}
