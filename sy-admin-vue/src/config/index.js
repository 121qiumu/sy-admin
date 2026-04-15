export const appConfig = {
  title: import.meta.env.VITE_APP_TITLE || 'Sy Admin',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/',
  enableAuthGuard: import.meta.env.VITE_ENABLE_AUTH_GUARD === 'true',
  visualizerEnabled: import.meta.env.VITE_USE_VISUALIZER === 'true',
};
