import { request } from '@/http';

export function getProfile() {
  return request.get('/admin/base/comm/person');
}

export function getPermMenu() {
  return request.get('/admin/base/comm/permmenu');
}

export function uploadFile(data) {
  return request.upload('/admin/base/comm/upload', data);
}

export function getUploadMode() {
  return request.get('/admin/base/comm/uploadMode');
}
