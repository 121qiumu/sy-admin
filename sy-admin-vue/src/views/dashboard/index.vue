<template>
  <section class="dashboard-page">
    <div class="dashboard-page__hero">
      <p class="dashboard-page__eyebrow">Project Bootstrap</p>
      <h1 class="dashboard-page__title">前端工程骨架已初始化</h1>
      <p class="dashboard-page__desc">
        当前阶段只完成工程化配置、主题体系、基础布局、路由与状态管理底座，业务模块会在后续步骤逐步接入。
      </p>
      <div class="dashboard-page__tags">
        <el-tag>Vue 3</el-tag>
        <el-tag type="success">Vite</el-tag>
        <el-tag type="warning">Pinia</el-tag>
        <el-tag type="info">Axios</el-tag>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :md="12" :xl="8">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>已接入能力</template>
          <ul class="dashboard-list">
            <li>基础布局壳子</li>
            <li>路由与守卫骨架</li>
            <li>Pinia 状态模块</li>
            <li>Axios 请求封装</li>
            <li>Element Plus 按需加载</li>
            <li>明暗主题切换</li>
          </ul>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="12" :xl="8">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>下一步建议</template>
          <ul class="dashboard-list">
            <li>接入真实登录与验证码</li>
            <li>打通当前用户与权限菜单</li>
            <li>完成基础 Layout 与动态菜单</li>
            <li>落首批系统管理模块</li>
          </ul>
        </el-card>
      </el-col>

      <el-col :xs="24" :xl="8">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>联调约定</template>
          <el-alert title="Authorization 直接传原始 token，不带 Bearer 前缀。" type="info" :closable="false" />
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<style scoped lang="less">
.dashboard-page {
  display: grid;
  gap: 16px;
}

.dashboard-page__hero {
  padding: 28px;
  border: 1px solid var(--app-border-color);
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.08), transparent 46%),
    linear-gradient(160deg, rgba(15, 118, 110, 0.12), transparent 62%),
    var(--app-surface-color);
  box-shadow: var(--app-card-shadow);
}

.dashboard-page__eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--app-text-secondary);
}

.dashboard-page__title {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.1;
  color: var(--app-text-primary);
}

.dashboard-page__desc {
  max-width: 720px;
  margin: 14px 0 0;
  color: var(--app-text-secondary);
  line-height: 1.7;
}

.dashboard-page__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.dashboard-card {
  height: 100%;
  border-radius: 20px;
}

.dashboard-list {
  margin: 0;
  padding-left: 18px;
  color: var(--app-text-secondary);
  line-height: 1.9;
}
</style>
