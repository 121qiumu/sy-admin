<script setup>
import PageContainer from '@/components/PageContainer.vue';
import { useAuthStore } from '@/stores/modules/auth';
import { usePermissionStore } from '@/stores/modules/permission';
import { hasPermission } from '@/utils/permission';

const authStore = useAuthStore();
const permissionStore = usePermissionStore();

const profileItems = computed(() => {
  return [
    {
      label: '用户名',
      value: authStore.userInfo?.username || '-',
    },
    {
      label: '显示名称',
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

const capabilityItems = computed(() => {
  return [
    '真实菜单接口对接',
    '动态路由按权限注入',
    '路由守卫区分 403 / 404',
    '按钮权限指令与权限判断函数',
    '侧边栏按菜单树动态渲染',
  ];
});

function handlePermissionDemo(title, requiredPermission) {
  if (!hasPermission(requiredPermission)) {
    ElMessage.warning(`缺少权限：${requiredPermission}`);
    return;
  }

  ElMessage.success(`权限校验通过：${title}`);
}
</script>

<template>
  <PageContainer
    eyebrow="Admin Workspace"
    title="企业后台基础布局已就绪"
    description="
        当前项目已经从“登录认证”推进到“菜单、路由、按钮权限”阶段。业务页面暂时仍用占位页承接，但权限链路已经是真实可扩展的。
      "
  >
    <template #meta>
      <div class="dashboard-page__summary">
        <div class="dashboard-page__summary-item">
          <span class="dashboard-page__summary-label">当前用户</span>
          <strong>{{ authStore.displayName }}</strong>
        </div>
        <div class="dashboard-page__summary-item">
          <span class="dashboard-page__summary-label">权限点数量</span>
          <strong>{{ permissionStore.perms.length }}</strong>
        </div>
        <div class="dashboard-page__summary-item">
          <span class="dashboard-page__summary-label">侧边菜单数量</span>
          <strong>{{ permissionStore.navigationMenus.length }}</strong>
        </div>
      </div>
    </template>

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
          <template #header>当前权限能力</template>

          <ul class="dashboard-list">
            <li v-for="item in capabilityItems" :key="item">{{ item }}</li>
          </ul>

          <el-divider content-position="left">按钮权限示例</el-divider>

          <div class="dashboard-page__button-demo">
            <el-button
              v-permission="'base:sys:user:page'"
              type="primary"
              @click="handlePermissionDemo('用户列表查询', 'base:sys:user:page')"
            >
              用户列表查询
            </el-button>
            <el-button
              v-permission="'base:sys:role:add'"
              @click="handlePermissionDemo('角色新增', 'base:sys:role:add')"
            >
              角色新增
            </el-button>
            <el-button @click="ElMessage.info('这个按钮对所有已登录用户可见')">
              通用操作
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<style scoped lang="less">
.dashboard-page {
  display: grid;
  gap: 16px;
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
  background: color-mix(in srgb, var(--app-surface-raised) 88%, transparent);
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

.dashboard-page__button-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 960px) {
  .dashboard-page__summary-item {
    min-width: calc(50% - 8px);
  }
}

@media (max-width: 640px) {
  .dashboard-page__summary-item {
    min-width: 100%;
  }
}
</style>
