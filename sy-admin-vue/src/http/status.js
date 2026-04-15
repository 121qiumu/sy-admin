const HTTP_STATUS_MESSAGE_MAP = {
  400: '请求参数错误',
  401: '登录状态已失效，请重新登录',
  403: '当前账号没有访问权限',
  404: '请求资源不存在',
  408: '请求超时，请稍后重试',
  500: '服务异常，请稍后重试',
  502: '网关异常，请稍后重试',
  503: '服务不可用，请稍后重试',
  504: '网关超时，请稍后重试',
};

const BUSINESS_CODE_MESSAGE_MAP = {
  1001: '业务处理失败',
  1002: '请求参数校验失败',
  1003: '服务处理失败',
};

export function getHttpStatusMessage(status) {
  return HTTP_STATUS_MESSAGE_MAP[status] || `请求异常（HTTP ${status || 'UNKNOWN'}）`;
}

export function getBusinessErrorMessage(code, message) {
  return message || BUSINESS_CODE_MESSAGE_MAP[code] || `请求失败（业务码：${code}）`;
}

export function isTimeoutError(error) {
  return error?.code === 'ECONNABORTED' || error?.message?.includes('timeout');
}

export function isCancelRequest(error) {
  return error?.code === 'ERR_CANCELED';
}
