function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function appendFormDataValue(formData, key, value) {
  if (value === undefined || value === null || value === '') {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => appendFormDataValue(formData, key, item));
    return;
  }

  if (value instanceof Date) {
    formData.append(key, value.toISOString());
    return;
  }

  if (value instanceof Blob) {
    formData.append(key, value);
    return;
  }

  if (isPlainObject(value)) {
    formData.append(key, JSON.stringify(value));
    return;
  }

  formData.append(key, value);
}

export function isResponseEnvelope(data) {
  return isPlainObject(data) && Object.hasOwn(data, 'code') && Object.hasOwn(data, 'message');
}

export function createBusinessError(payload = {}, requestOptions = {}) {
  const businessError = new Error(payload.message || '业务请求失败');

  businessError.name = 'BusinessError';
  businessError.code = payload.code;
  businessError.payload = payload;
  businessError.requestOptions = requestOptions;
  businessError.isBusinessError = true;

  return businessError;
}

export function getResponseMessage(data) {
  if (isResponseEnvelope(data) && typeof data.message === 'string') {
    return data.message;
  }

  if (isPlainObject(data) && typeof data.message === 'string') {
    return data.message;
  }

  return '';
}

export function createFormData(payload = {}, fileFieldName = 'file') {
  if (payload instanceof FormData) {
    return payload;
  }

  const formData = new FormData();

  if (payload instanceof Blob) {
    formData.append(fileFieldName, payload);
    return formData;
  }

  Object.entries(payload).forEach(([key, value]) => {
    appendFormDataValue(formData, key, value);
  });

  return formData;
}

export function resolveFileNameFromHeaders(headers = {}) {
  const contentDisposition =
    headers['content-disposition'] || headers['Content-Disposition'] || '';

  if (!contentDisposition) {
    return '';
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const defaultMatch = contentDisposition.match(/filename="?([^"]+)"?/i);

  return defaultMatch?.[1] || '';
}

export function downloadBlobFile(blob, fileName = 'download') {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = blobUrl;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
