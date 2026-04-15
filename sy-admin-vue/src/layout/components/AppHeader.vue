<script setup>
import { useRouter } from 'vue-router';
import { appConfig } from '@/config';
import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';

const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

function handleLogout() {
  authStore.clearAuth();
  router.push('/login');
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
        <div class="app-header__subtitle">Step 2: 工程初始化骨架</div>
      </div>
    </div>

    <div class="app-header__right">
      <el-tooltip content="切换明暗主题" placement="bottom">
        <el-button class="app-header__icon" text @click="appStore.toggleTheme">
          <IconEpMoon v-if="appStore.theme === 'light'" />
          <IconEpSunny v-else />
        </el-button>
      </el-tooltip>
      <el-button class="app-header__logout" text @click="handleLogout">
        <IconEpSwitchButton />
        <span>退出</span>
      </el-button>
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

.app-header__icon,
.app-header__logout {
  color: var(--app-text-primary);
}

.app-header__logout span {
  margin-left: 6px;
}
</style>
