<script setup>
import { useRouter } from 'vue-router';
import { appConfig, requestConfig } from '@/config';
import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';

const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();
const logoutLoading = ref(false);

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确认退出当前登录账号吗？', '退出登录', {
      type: 'warning',
      confirmButtonText: '退出',
      cancelButtonText: '取消',
    });
  } catch {
    return;
  }

  logoutLoading.value = true;

  try {
    await authStore.logoutAction();
    ElMessage.success('已退出登录');
    await router.replace(requestConfig.loginPath);
  } finally {
    logoutLoading.value = false;
  }
}
</script>

<template>
  <div class="app-header">
    <div class="app-header__left">
      <el-button class="app-header__icon" text @click="appStore.toggleSidebar">
        <IconEpExpand v-if="appStore.sidebarCollapsed" />
        <IconEpFold v-else />
      </el-button>
      <div>
        <div class="app-header__title">{{ appConfig.title }}</div>
        <div class="app-header__subtitle">Step 4: 登录认证闭环</div>
      </div>
    </div>

    <div class="app-header__right">
      <el-tooltip content="切换明暗主题" placement="bottom">
        <el-button class="app-header__icon" text @click="appStore.toggleTheme">
          <IconEpMoon v-if="appStore.theme === 'light'" />
          <IconEpSunny v-else />
        </el-button>
      </el-tooltip>

      <el-dropdown trigger="click">
        <button class="app-header__user" type="button">
          <el-avatar class="app-header__avatar" :size="34">
            {{ authStore.avatarText }}
          </el-avatar>
          <div class="app-header__user-meta">
            <div class="app-header__user-name">{{ authStore.displayName }}</div>
            <div class="app-header__user-desc">
              {{ authStore.userInfo?.username || '已登录用户' }}
            </div>
          </div>
          <IconEpArrowDown />
        </button>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :disabled="true">
              {{ authStore.userInfo?.email || '暂未设置邮箱' }}
            </el-dropdown-item>
            <el-dropdown-item divided :disabled="logoutLoading" @click="handleLogout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="less">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
  gap: 16px;
}

.app-header__left,
.app-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-header__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--app-text-primary);
}

.app-header__subtitle {
  font-size: 12px;
  color: var(--app-text-secondary);
}

.app-header__icon {
  color: var(--app-text-primary);
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--app-text-primary);
  cursor: pointer;
}

.app-header__avatar {
  background: linear-gradient(135deg, #0f766e, #2563eb);
  color: #fff;
  font-weight: 700;
}

.app-header__user-meta {
  text-align: left;
}

.app-header__user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text-primary);
}

.app-header__user-desc {
  font-size: 12px;
  color: var(--app-text-secondary);
}
</style>
