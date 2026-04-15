<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import { getCaptcha } from '@/api/modules/auth';
import { HOME_PATH, normalizeRedirectPath } from '@/utils/auth';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const authStore = useAuthStore();

const formRef = ref();
const captchaImage = ref('');
const captchaLoading = ref(false);
const submitLoading = ref(false);

const loginForm = reactive({
  username: '',
  password: '',
  verifyCode: '',
  captchaId: '',
});

const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
  verifyCode: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
  ],
};

const captchaColor = computed(() => {
  return appStore.theme === 'dark' ? '#f8fafc' : '#0f172a';
});

async function loadCaptcha(options = {}) {
  captchaLoading.value = true;

  try {
    const captcha = await getCaptcha(
      {
        width: 160,
        height: 52,
        color: captchaColor.value,
      },
      {
        showErrorMessage: options.showErrorMessage !== false,
      }
    );

    captchaImage.value = captcha.data;
    loginForm.captchaId = captcha.captchaId;

    if (options.keepCode !== true) {
      loginForm.verifyCode = '';
    }
  } finally {
    captchaLoading.value = false;
  }
}

async function handleSubmit() {
  if (!formRef.value) {
    return;
  }

  await formRef.value.validate();
  submitLoading.value = true;

  try {
    await authStore.loginByPassword({
      username: loginForm.username.trim(),
      password: loginForm.password,
      verifyCode: loginForm.verifyCode.trim(),
      captchaId: loginForm.captchaId,
    });

    ElMessage.success('登录成功');

    await router.replace(normalizeRedirectPath(route.query.redirect, HOME_PATH));
  } catch {
    loginForm.password = '';
    await loadCaptcha({
      keepCode: false,
      showErrorMessage: false,
    });
  } finally {
    submitLoading.value = false;
  }
}

watch(captchaColor, () => {
  if (loginForm.captchaId) {
    loadCaptcha({
      keepCode: true,
      showErrorMessage: false,
    });
  }
});

onMounted(() => {
  loadCaptcha();
});
</script>

<template>
  <section class="login-page">
    <div class="login-page__content">
      <div class="login-page__intro">
        <div class="login-page__badge">Sy Admin</div>
        <h1 class="login-page__title">企业后台认证入口</h1>
        <p class="login-page__desc">
          当前已基于真实后端接口接入验证码、登录、当前用户信息获取、登录失效处理与退出登录。
        </p>

        <div class="login-page__tips">
          <el-tag type="success" effect="light">Vue 3 + Vite</el-tag>
          <el-tag type="info" effect="light">Element Plus</el-tag>
          <el-tag type="warning" effect="light">Pinia + Axios</el-tag>
        </div>

        <el-card class="login-page__notice" shadow="never">
          <template #header>当前接入范围</template>
          <ul class="login-page__notice-list">
            <li>登录接口：`/admin/base/open/login`</li>
            <li>验证码接口：`/admin/base/open/captcha`</li>
            <li>用户信息接口：`/admin/base/comm/person`</li>
            <li>路由白名单：登录页、404</li>
          </ul>
        </el-card>
      </div>

      <div class="login-page__panel">
        <div class="login-page__panel-header">
          <div>
            <p class="login-page__eyebrow">Step 4</p>
            <h2 class="login-page__panel-title">登录系统</h2>
          </div>

          <el-tooltip content="切换明暗主题" placement="left">
            <el-button circle @click="appStore.toggleTheme">
              <IconEpMoon v-if="appStore.theme === 'light'" />
              <IconEpSunny v-else />
            </el-button>
          </el-tooltip>
        </div>

        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          class="login-page__form"
          label-position="top"
          @keyup.enter="handleSubmit"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              size="large"
              placeholder="请输入用户名"
              clearable
            >
              <template #prefix>
                <IconEpUser />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              size="large"
              type="password"
              show-password
              placeholder="请输入密码"
              clearable
            >
              <template #prefix>
                <IconEpLock />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="verifyCode">
            <div class="login-page__captcha">
              <el-input
                v-model="loginForm.verifyCode"
                size="large"
                maxlength="10"
                placeholder="请输入验证码"
                clearable
              >
                <template #prefix>
                  <IconEpKey />
                </template>
              </el-input>

              <button
                class="login-page__captcha-image"
                type="button"
                :disabled="captchaLoading"
                @click="loadCaptcha({ keepCode: false })"
              >
                <span v-if="captchaLoading" class="login-page__captcha-loading">
                  <el-icon class="is-loading"><IconEpLoading /></el-icon>
                </span>
                <img v-else :src="captchaImage" alt="验证码" />
              </button>
            </div>
          </el-form-item>

          <div class="login-page__helper">
            <span>验证码不区分大小写，点击图片可刷新</span>
            <el-link type="primary" :underline="false" @click="loadCaptcha({ keepCode: false })">
              换一张
            </el-link>
          </div>

          <el-button
            class="login-page__submit"
            type="primary"
            size="large"
            :loading="submitLoading || authStore.loginLoading"
            @click="handleSubmit"
          >
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.login-page {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 28%),
    radial-gradient(circle at bottom right, rgba(15, 118, 110, 0.16), transparent 26%),
    linear-gradient(180deg, var(--app-bg), var(--app-surface-muted));
}

.login-page__content {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(360px, 440px);
  align-items: center;
  gap: 28px;
  width: min(1180px, 100%);
  min-height: calc(100vh - 64px);
  margin: 0 auto;
}

.login-page__intro,
.login-page__panel {
  border: 1px solid var(--app-border-color);
  background: color-mix(in srgb, var(--app-surface-color) 92%, transparent);
  box-shadow: var(--app-card-shadow);
  backdrop-filter: blur(14px);
}

.login-page__intro {
  padding: 36px;
  border-radius: 32px;
}

.login-page__badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-page__title {
  margin: 20px 0 0;
  font-size: clamp(34px, 4vw, 52px);
  line-height: 1.08;
  color: var(--app-text-primary);
}

.login-page__desc {
  max-width: 640px;
  margin: 18px 0 0;
  font-size: 16px;
  line-height: 1.9;
  color: var(--app-text-secondary);
}

.login-page__tips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.login-page__notice {
  margin-top: 30px;
  border-radius: 24px;
  background: transparent;
}

.login-page__notice-list {
  margin: 0;
  padding-left: 18px;
  color: var(--app-text-secondary);
  line-height: 2;
}

.login-page__panel {
  padding: 28px;
  border-radius: 28px;
}

.login-page__panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.login-page__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--app-text-secondary);
}

.login-page__panel-title {
  margin: 0;
  font-size: 30px;
  color: var(--app-text-primary);
}

.login-page__form {
  margin-top: 24px;
}

.login-page__captcha {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  gap: 12px;
  width: 100%;
}

.login-page__captcha-image {
  display: grid;
  place-items: center;
  width: 100%;
  height: 52px;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--app-border-color);
  border-radius: 14px;
  background: var(--app-surface-muted);
  cursor: pointer;
}

.login-page__captcha-image:disabled {
  cursor: wait;
}

.login-page__captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-page__captcha-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-secondary);
}

.login-page__helper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 4px 0 20px;
  font-size: 13px;
  color: var(--app-text-secondary);
}

.login-page__submit {
  width: 100%;
  height: 46px;
  border-radius: 14px;
}

@media (max-width: 960px) {
  .login-page {
    padding: 20px;
  }

  .login-page__content {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}

@media (max-width: 640px) {
  .login-page__intro,
  .login-page__panel {
    padding: 22px;
    border-radius: 24px;
  }

  .login-page__captcha {
    grid-template-columns: 1fr;
  }

  .login-page__helper {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
