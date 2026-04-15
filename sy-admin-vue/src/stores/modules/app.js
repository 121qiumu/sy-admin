import { defineStore } from 'pinia';
import { appConfig } from '@/config';
import { DEFAULT_THEME, STORAGE_KEYS } from '@/constants/app';
import { getStorage, setStorage } from '@/utils/storage';
import { applyTheme } from '@/utils/theme';

export const useAppStore = defineStore('app', {
  state: () => ({
    title: appConfig.title,
    theme: getStorage(STORAGE_KEYS.theme, DEFAULT_THEME),
    sidebarCollapsed: getStorage(STORAGE_KEYS.sidebarCollapsed, 'false') === 'true',
  }),
  actions: {
    bootstrap() {
      applyTheme(this.theme);
    },
    setTheme(theme) {
      this.theme = theme;
      setStorage(STORAGE_KEYS.theme, theme);
      applyTheme(theme);
    },
    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      setStorage(STORAGE_KEYS.sidebarCollapsed, String(this.sidebarCollapsed));
    },
  },
});
