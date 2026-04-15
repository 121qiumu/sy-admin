export function getStorage(key, fallback = '') {
  const value = window.localStorage.getItem(key);
  return value ?? fallback;
}

export function setStorage(key, value) {
  window.localStorage.setItem(key, value);
}

export function removeStorage(key) {
  window.localStorage.removeItem(key);
}
