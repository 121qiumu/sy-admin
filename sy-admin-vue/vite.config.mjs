import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { visualizer } from 'rollup-plugin-visualizer';

function createProxyConfig(env) {
  if (env.VITE_USE_PROXY !== 'true' || !env.VITE_PROXY_TARGET) {
    return undefined;
  }

  return {
    '/admin': {
      target: env.VITE_PROXY_TARGET,
      changeOrigin: true,
    },
    '/upload': {
      target: env.VITE_PROXY_TARGET,
      changeOrigin: true,
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useVisualizer = env.VITE_USE_VISUALIZER === 'true';
  const proxy = createProxyConfig(env);

  const plugins = [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'css',
        }),
      ],
      dts: './auto-imports.d.ts',
      vueTemplate: true,
    }),
    Components({
      dts: true,
      dirs: ['src/components'],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'css',
        }),
        IconsResolver({
          prefix: 'Icon',
          enabledCollections: ['ep'],
        }),
      ],
    }),
    Icons({
      autoInstall: false,
    }),
  ];

  if (useVisualizer) {
    plugins.push(
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      })
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy,
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
  };
});
