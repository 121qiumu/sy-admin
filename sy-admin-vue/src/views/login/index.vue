<template>
  <section class="login-page">
    <div class="login-page__panel">
      <p class="login-page__eyebrow">Step 2</p>
      <h1 class="login-page__title">登录页占位</h1>
      <p class="login-page__desc">
        当前步骤只初始化工程骨架，真实登录、验证码、token 刷新与权限菜单会在后续步骤接入。
      </p>

      <el-alert
        title="已预留 auth store、axios 拦截器和路由守卫基础能力。"
        type="success"
        :closable="false"
      />

      <div class="login-page__actions">
        <RouterLink to="/dashboard">
          <el-button type="primary">查看骨架首页</el-button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.login-page {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.15), transparent 24%),
    radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.16), transparent 28%),
    linear-gradient(180deg, var(--app-bg), var(--app-surface-muted));
}

.login-page__panel {
  width: min(100%, 560px);
  padding: 32px;
  border: 1px solid var(--app-border-color);
  border-radius: 28px;
  background: var(--app-surface-color);
  box-shadow: var(--app-card-shadow);
}

.login-page__eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--app-text-secondary);
}

.login-page__title {
  margin: 0;
  font-size: 34px;
  color: var(--app-text-primary);
}

.login-page__desc {
  margin: 12px 0 20px;
  line-height: 1.8;
  color: var(--app-text-secondary);
}

.login-page__actions {
  margin-top: 20px;
}
</style>
