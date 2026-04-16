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
    isMobile: false,
    sidebarDrawerVisible: false,
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
    setDeviceMode(isMobile) {
      this.isMobile = Boolean(isMobile);

      if (!this.isMobile) {
        this.sidebarDrawerVisible = false;
        return;
      }

      this.sidebarDrawerVisible = false;
    },
    setSidebarCollapsed(collapsed) {
      this.sidebarCollapsed = Boolean(collapsed);
      setStorage(STORAGE_KEYS.sidebarCollapsed, String(this.sidebarCollapsed));
    },
    setSidebarDrawerVisible(visible) {
      this.sidebarDrawerVisible = Boolean(visible);
    },
    closeSidebarDrawer() {
      this.sidebarDrawerVisible = false;
    },
    toggleSidebar() {
      if (this.isMobile) {
        this.sidebarDrawerVisible = !this.sidebarDrawerVisible;
        return;
      }

      this.setSidebarCollapsed(!this.sidebarCollapsed);
    },
  },
});
