<script setup>
import { useAuthStore } from '@/stores/modules/auth';

const authStore = useAuthStore();

const profileItems = computed(() => {
  return [
    {
      label: '用户名',
      value: authStore.userInfo?.username || '-',
    },
    {
      label: '昵称',
      value: authStore.userInfo?.nickName || authStore.userInfo?.name || '-',
    },
    {
      label: '手机号',
      value: authStore.userInfo?.phone || '-',
    },
    {
      label: '邮箱',
      value: authStore.userInfo?.email || '-',
    },
  ];
});
</script>

<template>
  <section class="dashboard-page">
    <div class="dashboard-page__hero">
      <p class="dashboard-page__eyebrow">Authenticated Session</p>
      <h1 class="dashboard-page__title">登录认证闭环已接入</h1>
      <p class="dashboard-page__desc">
        当前已完成基于真实后端接口的登录、验证码、token 存储、当前用户信息获取、退出登录与登录失效处理。
      </p>

      <div class="dashboard-page__summary">
        <div class="dashboard-page__summary-item">
          <span class="dashboard-page__summary-label">当前用户</span>
          <strong>{{ authStore.displayName }}</strong>
        </div>
        <div class="dashboard-page__summary-item">
          <span class="dashboard-page__summary-label">登录状态</span>
          <strong>{{ authStore.hasToken ? '已登录' : '未登录' }}</strong>
        </div>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>当前用户信息</template>

          <el-descriptions :column="1" border>
            <el-descriptions-item
              v-for="item in profileItems"
              :key="item.label"
              :label="item.label"
            >
              {{ item.value }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>当前认证能力</template>

          <ul class="dashboard-list">
            <li>登录页表单校验</li>
            <li>验证码接口联调</li>
            <li>token 与 refreshToken 本地持久化</li>
            <li>当前用户信息初始化</li>
            <li>退出登录与登录失效跳转</li>
            <li>路由白名单基础处理</li>
          </ul>

          <el-alert
            class="dashboard-alert"
            title="菜单权限与动态路由仍留在后续步骤处理，本步只完成认证闭环。"
            type="info"
            :closable="false"
          />
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
  max-width: 760px;
  margin: 14px 0 0;
  color: var(--app-text-secondary);
  line-height: 1.8;
}

.dashboard-page__summary {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 22px;
}

.dashboard-page__summary-item {
  min-width: 180px;
  padding: 14px 16px;
  border: 1px solid var(--app-border-color);
  border-radius: 18px;
  background: color-mix(in srgb, var(--app-surface-color) 86%, transparent);
}

.dashboard-page__summary-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--app-text-secondary);
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

.dashboard-alert {
  margin-top: 20px;
}
</style>
