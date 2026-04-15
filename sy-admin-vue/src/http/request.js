import { http } from './client';
import { createFormData, downloadBlobFile, resolveFileNameFromHeaders } from './utils';

export function request(config) {
  return http.request(config);
}

request.get = function get(url, config = {}) {
  return request({
    ...config,
    url,
    method: 'get',
  });
};

request.post = function post(url, data, config = {}) {
  return request({
    ...config,
    url,
    data,
    method: 'post',
  });
};

request.put = function put(url, data, config = {}) {
  return request({
    ...config,
    url,
    data,
    method: 'put',
  });
};

request.patch = function patch(url, data, config = {}) {
  return request({
    ...config,
    url,
    data,
    method: 'patch',
  });
};

request.delete = function remove(url, config = {}) {
  return request({
    ...config,
    url,
    method: 'delete',
  });
};

request.text = function text(url, config = {}) {
  return request({
    ...config,
    url,
    method: config.method || 'get',
    responseType: 'text',
  });
};

request.upload = function upload(url, payload, config = {}) {
  const data =
    payload instanceof FormData ? payload : createFormData(payload, config.fileFieldName || 'file');

  return request({
    ...config,
    url,
    data,
    method: config.method || 'post',
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

request.download = async function download(url, config = {}) {
  const response = await request({
    ...config,
    url,
    method: config.method || 'get',
    responseType: 'blob',
    returnRawResponse: true,
  });

  return {
    blob: response.data,
    fileName: resolveFileNameFromHeaders(response.headers) || config.fileName || 'download',
    headers: response.headers,
    response,
  };
};

request.downloadToFile = async function downloadToFile(url, config = {}) {
  const result = await request.download(url, config);

  downloadBlobFile(result.blob, result.fileName);

  return result;
};
