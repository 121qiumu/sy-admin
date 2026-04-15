import { http } from '@/http';

export function getProfile() {
  return http.get('/admin/base/comm/person');
}

export function getPermMenu() {
  return http.get('/admin/base/comm/permmenu');
}

export function uploadFile(data) {
  return http.post('/admin/base/comm/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function getUploadMode() {
  return http.get('/admin/base/comm/uploadMode');
}
