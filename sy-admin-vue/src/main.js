import { createApp } from 'vue';
import 'element-plus/theme-chalk/dark/css-vars.css';
import App from './App.vue';
import { router } from '@/router';
import { pinia } from '@/stores';
import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import '@/styles/index.less';

const app = createApp(App);

app.use(pinia);
app.use(router);

const appStore = useAppStore();
appStore.bootstrap();

const authStore = useAuthStore();
authStore.bootstrap();

app.mount('#app');
