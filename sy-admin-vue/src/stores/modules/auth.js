import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { STORAGE_KEYS } from '@/constants/app';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';

let profilePromise = null;

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getStorage(STORAGE_KEYS.token, ''));
  const refreshToken = ref(getStorage(STORAGE_KEYS.refreshToken, ''));
  const userInfo = ref(null);
  const profileLoaded = ref(false);
  const profileLoading = ref(false);
  const loginLoading = ref(false);

  const hasToken = computed(() => Boolean(token.value));
  const displayName = computed(() => {
    return userInfo.value?.nickName || userInfo.value?.name || userInfo.value?.username || '未登录';
  });
  const avatarText = computed(() => {
    const source = displayName.value?.trim();

    return source ? source.slice(0, 1).toUpperCase() : 'U';
  });

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

  function setUserInfo(payload) {
    userInfo.value = payload || null;
    profileLoaded.value = Boolean(payload);
  }

  function clearUserInfo() {
    userInfo.value = null;
    profileLoaded.value = false;
  }

  function clearAuth() {
    setTokens({
      token: '',
      refreshToken: '',
    });
    clearUserInfo();
  }

  async function fetchProfile(requestOptions = {}) {
    if (!hasToken.value) {
      clearUserInfo();
      return null;
    }

    if (profilePromise) {
      return profilePromise;
    }

    profileLoading.value = true;
    const currentToken = token.value;

    profilePromise = (async () => {
      const { getProfile } = await import('@/api/modules/app');
      const profile = await getProfile(requestOptions);

      if (!token.value || token.value !== currentToken) {
        return null;
      }

      setUserInfo(profile);

      return profile;
    })()
      .catch((error) => {
        clearUserInfo();
        throw error;
      })
      .finally(() => {
        profileLoading.value = false;
        profilePromise = null;
      });

    return profilePromise;
  }

  async function ensureProfileLoaded(requestOptions = {}) {
    if (!hasToken.value) {
      return null;
    }

    if (profileLoaded.value && userInfo.value) {
      return userInfo.value;
    }

    return fetchProfile(requestOptions);
  }

  async function bootstrap() {
    if (!hasToken.value) {
      return null;
    }

    try {
      return await ensureProfileLoaded({
        showErrorMessage: false,
      });
    } catch {
      return null;
    }
  }

  async function loginByPassword(payload) {
    loginLoading.value = true;

    try {
      const { login } = await import('@/api/modules/auth');
      const result = await login(payload);

      setTokens(result);
      await fetchProfile();

      return result;
    } catch (error) {
      clearAuth();
      throw error;
    } finally {
      loginLoading.value = false;
    }
  }

  async function logoutAction() {
    try {
      if (hasToken.value) {
        const { logout } = await import('@/api/modules/auth');

        await logout({
          showErrorMessage: false,
          skipAuthRedirect: true,
        });
      }
    } catch {
      // Ignore logout request errors and always clear local auth state.
    } finally {
      clearAuth();
    }
  }

  return {
    token,
    refreshToken,
    userInfo,
    hasToken,
    profileLoaded,
    profileLoading,
    loginLoading,
    displayName,
    avatarText,
    setTokens,
    setUserInfo,
    clearUserInfo,
    clearAuth,
    fetchProfile,
    ensureProfileLoaded,
    bootstrap,
    loginByPassword,
    logoutAction,
  };
});
