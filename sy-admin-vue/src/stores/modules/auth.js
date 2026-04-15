import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { STORAGE_KEYS } from '@/constants/app';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getStorage(STORAGE_KEYS.token, ''));
  const refreshToken = ref(getStorage(STORAGE_KEYS.refreshToken, ''));

  const hasToken = computed(() => Boolean(token.value));

  function setTokens(payload = {}) {
    token.value = payload.token || '';
    refreshToken.value = payload.refreshToken || '';

    if (token.value) {
      setStorage(STORAGE_KEYS.token, token.value);
    } else {
      removeStorage(STORAGE_KEYS.token);
    }

    if (refreshToken.value) {
      setStorage(STORAGE_KEYS.refreshToken, refreshToken.value);
    } else {
      removeStorage(STORAGE_KEYS.refreshToken);
    }
  }

  function clearAuth() {
    setTokens({
      token: '',
      refreshToken: '',
    });
  }

  return {
    token,
    refreshToken,
    hasToken,
    setTokens,
    clearAuth,
  };
});
