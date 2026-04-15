<script setup>
import { useRoute, useRouter } from 'vue-router';
import { appConfig } from '@/config';
import { getCaptcha } from '@/api/modules/auth';
import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import { HOME_PATH, normalizeRedirectPath } from '@/utils/auth';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const authStore = useAuthStore();

const formRef = ref();
const captchaImage = ref('');
const captchaLoading = ref(false);
const submitLoading = ref(false);

const isDarkTheme = computed(() => appStore.theme === 'dark');


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
  return isDarkTheme.value ? '#d7e3ff' : '#344054';
});

async function loadCaptcha(options = {}) {
  captchaLoading.value = true;

  try {
    const captcha = await getCaptcha(
      {
        width: 168,
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

function handleThemeToggle() {
  appStore.toggleTheme();
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
  <section class="login-page" :class="{ 'login-page--dark': isDarkTheme }">
    <div class="login-page__hero">
      <div class="login-page__hero-glow login-page__hero-glow--one"></div>
      <div class="login-page__hero-glow login-page__hero-glow--two"></div>
    </div>

    <div class="login-page__panel">
      <div class="login-page__panel-card">
        <div class="login-page__panel-head">
          <div>
            <p class="login-page__panel-tag">Secure Access</p>
            <h2 class="login-page__panel-title">欢迎登录</h2>
          </div>

          <el-tooltip content="切换明暗主题" placement="left">
            <el-button class="login-page__theme-switch" circle @click="handleThemeToggle">
              <IconEpMoon v-if="!isDarkTheme" />
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
              autocomplete="username"
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
              autocomplete="current-password"
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

          <el-button
            class="login-page__submit"
            type="primary"
            size="large"
            :loading="submitLoading || authStore.loginLoading"
            @click="handleSubmit"
          >
            登录系统
          </el-button>
        </el-form>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.login-page {
  --login-shell-bg: #f3f5f9;
  --login-panel-bg: rgba(255, 255, 255, 0.92);
  --login-panel-border: rgba(15, 23, 42, 0.08);
  --login-panel-shadow: 0 24px 60px rgba(15, 23, 42, 0.1);
  --login-text-primary: #23304a;
  --login-text-secondary: #667085;
  --login-text-muted: #8b95a7;
  --login-hero-bg: linear-gradient(145deg, #2f3444 0%, #3d4357 52%, #2b3141 100%);
  --login-hero-overlay: rgba(255, 255, 255, 0.06);
  --login-accent: #4c69da;
  --login-accent-strong: #3959d6;
  --login-input-bg: rgba(15, 23, 42, 0.04);
  --login-input-border: rgba(76, 105, 218, 0.2);
  --login-captcha-bg: rgba(15, 23, 42, 0.04);
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(420px, 0.9fr);
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(76, 105, 218, 0.1), transparent 26%),
    radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.08), transparent 22%),
    var(--login-shell-bg);
}

.login-page--dark {
  --login-shell-bg: #07111f;
  --login-panel-bg: rgba(9, 17, 31, 0.88);
  --login-panel-border: rgba(148, 163, 184, 0.14);
  --login-panel-shadow: 0 30px 70px rgba(2, 6, 23, 0.42);
  --login-text-primary: #edf2ff;
  --login-text-secondary: #9cafc7;
  --login-text-muted: #7f93ae;
  --login-hero-bg: linear-gradient(160deg, #0c1729 0%, #17243b 52%, #081120 100%);
  --login-hero-overlay: rgba(148, 163, 184, 0.08);
  --login-accent: #7c9bff;
  --login-accent-strong: #5f82ff;
  --login-input-bg: rgba(148, 163, 184, 0.08);
  --login-input-border: rgba(124, 155, 255, 0.26);
  --login-captcha-bg: rgba(148, 163, 184, 0.06);
}

.login-page__hero {
  position: relative;
  overflow: hidden;
  background: var(--login-hero-bg);
  color: #f8fafc;
}

.login-page__hero::before,
.login-page__hero::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: var(--login-hero-overlay);
  filter: blur(4px);
}

.login-page__hero::before {
  top: -12%;
  left: -10%;
  width: 320px;
  height: 320px;
  animation: heroFloat 18s ease-in-out infinite;
}

.login-page__hero::after {
  right: -8%;
  bottom: -18%;
  width: 380px;
  height: 380px;
  animation: heroFloat 22s ease-in-out infinite reverse;
}

.login-page__hero-wave {
  position: absolute;
  top: -8%;
  right: -110px;
  width: 240px;
  height: 116%;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 58% 0 0 42% / 48% 0 0 52%;
  opacity: 0.85;
}

.login-page__hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(12px);
  pointer-events: none;
}

.login-page__hero-glow--one {
  top: 14%;
  left: 10%;
  width: 220px;
  height: 220px;
  background: rgba(120, 144, 255, 0.18);
  animation: glowMove 14s ease-in-out infinite alternate;
}

.login-page__hero-glow--two {
  right: 18%;
  bottom: 14%;
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.12);
  animation: glowMove 16s ease-in-out infinite alternate-reverse;
}

.login-page__hero-content {
  position: relative;
  z-index: 1;
  display: grid;
  align-content: center;
  gap: 28px;
  min-height: 100%;
  padding: 56px 64px;
}

.login-page__brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
}

.login-page__brand-mark {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.login-page__brand-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.login-page__brand-desc {
  margin: 4px 0 0;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.68);
}

.login-page__hero-copy {
  max-width: 620px;
}

.login-page__eyebrow,
.login-page__panel-tag {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.26em;
  text-transform: uppercase;
}

.login-page__eyebrow {
  color: rgba(255, 255, 255, 0.72);
}

.login-page__hero-title {
  margin: 0;
  font-size: clamp(34px, 4vw, 54px);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.login-page__hero-text {
  max-width: 560px;
  margin: 16px 0 0;
  font-size: 15px;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.74);
}

.login-page__hero-visual {
  max-width: 620px;
}

.login-page__preview-card {
  position: relative;
  overflow: hidden;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04)),
    rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(14px);
  box-shadow: 0 22px 56px rgba(8, 15, 30, 0.22);
}

.login-page__preview-card::after {
  content: '';
  position: absolute;
  bottom: -22%;
  left: -10%;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.login-page__preview-chip {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 1;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.login-page__preview-image {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  max-width: 420px;
  margin: 10px auto 0;
  filter: drop-shadow(0 26px 40px rgba(10, 18, 32, 0.28));
  animation: previewFloat 9s ease-in-out infinite;
}

.login-page__feature-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  max-width: 760px;
}

.login-page__feature {
  display: flex;
  gap: 12px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
}

.login-page__feature-dot {
  width: 10px;
  height: 10px;
  margin-top: 7px;
  border-radius: 50%;
  background: #dfe6ff;
  box-shadow: 0 0 0 6px rgba(223, 230, 255, 0.14);
  flex: none;
}

.login-page__feature-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.login-page__feature-desc {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.72);
}

.login-page__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
}

.login-page__panel-card {
  width: min(100%, 430px);
  padding: 32px 32px 26px;
  border: 1px solid var(--login-panel-border);
  border-radius: 28px;
  background: var(--login-panel-bg);
  box-shadow: var(--login-panel-shadow);
  backdrop-filter: blur(18px);
}

.login-page__panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.login-page__panel-tag {
  color: #8090a8;
}

.login-page__panel-title {
  margin: 0;
  font-size: 38px;
  line-height: 1.06;
  letter-spacing: -0.04em;
  color: var(--login-text-primary);
}

.login-page__panel-subtitle {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.8;
  color: var(--login-text-secondary);
}

.login-page__theme-switch {
  border-color: var(--login-panel-border);
  color: var(--login-text-primary);
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.login-page--dark .login-page__theme-switch {
  background: rgba(15, 23, 42, 0.78);
}

.login-page__form {
  margin-top: 30px;
}

.login-page__form :deep(.el-form-item) {
  margin-bottom: 22px;
}

.login-page__form :deep(.el-form-item__label) {
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--login-text-secondary);
}

.login-page__form :deep(.el-input__wrapper) {
  height: 56px;
  border-radius: 16px;
  background: var(--login-input-bg);
  box-shadow: inset 0 0 0 1px transparent;
  transition:
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.login-page__form :deep(.el-input__wrapper.is-focus) {
  box-shadow: inset 0 0 0 1px var(--login-input-border);
}

.login-page__form :deep(.el-input__inner) {
  font-size: 15px;
  color: var(--login-text-primary);
}

.login-page__form :deep(.el-input__prefix),
.login-page__form :deep(.el-input__suffix) {
  color: var(--login-text-muted);
}

.login-page__captcha {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 168px;
  gap: 12px;
  width: 100%;
}

.login-page__captcha-image {
  display: grid;
  place-items: center;
  width: 100%;
  height: 56px;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--login-panel-border);
  border-radius: 16px;
  background: var(--login-captcha-bg);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.login-page__captcha-image:hover {
  transform: translateY(-1px);
  border-color: var(--login-input-border);
}

.login-page__captcha-image:disabled {
  cursor: wait;
}

.login-page__captcha-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-page__captcha-loading {
  color: var(--login-text-muted);
}

.login-page__helper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -2px 0 24px;
  font-size: 13px;
  color: var(--login-text-muted);
}

.login-page__submit {
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--login-accent), var(--login-accent-strong));
  box-shadow: 0 20px 36px rgba(76, 105, 218, 0.28);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.login-page__panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  font-size: 12px;
  color: var(--login-text-muted);
}

@media (max-width: 1180px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-page__hero {
    min-height: auto;
  }

  .login-page__hero-wave {
    display: none;
  }

  .login-page__hero-content {
    padding: 40px 28px 28px;
  }

  .login-page__feature-list {
    grid-template-columns: 1fr;
  }

  .login-page__panel {
    padding: 0 20px 28px;
  }
}

@media (max-width: 640px) {
  .login-page__hero-copy {
    max-width: none;
  }

  .login-page__panel-card {
    padding: 24px 20px 22px;
    border-radius: 24px;
  }

  .login-page__panel-title {
    font-size: 32px;
  }

  .login-page__captcha {
    grid-template-columns: 1fr;
  }

  .login-page__panel-footer,
  .login-page__helper {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-page *,
  .login-page::before,
  .login-page::after {
    animation: none !important;
    transition: none !important;
  }
}

@keyframes heroFloat {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(18px, 20px, 0) scale(1.04);
  }
}

@keyframes glowMove {
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(22px, -16px, 0);
  }
}

@keyframes previewFloat {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, -12px, 0);
  }
}
</style>
