import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';

const autoImportGlobals = {
  computed: 'readonly',
  defineStore: 'readonly',
  ElLoading: 'readonly',
  ElMessage: 'readonly',
  ElMessageBox: 'readonly',
  ElNotification: 'readonly',
  nextTick: 'readonly',
  onMounted: 'readonly',
  onUnmounted: 'readonly',
  reactive: 'readonly',
  readonly: 'readonly',
  ref: 'readonly',
  shallowRef: 'readonly',
  storeToRefs: 'readonly',
  toRefs: 'readonly',
  unref: 'readonly',
  useRoute: 'readonly',
  useRouter: 'readonly',
  watch: 'readonly',
  watchEffect: 'readonly',
};

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.husky/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...autoImportGlobals,
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...autoImportGlobals,
        ...globals.browser,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
  },
  eslintConfigPrettier,
];
