<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { appConfig, requestConfig } from '@/config';
import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import AppBreadcrumb from './AppBreadcrumb.vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();
const logoutLoading = ref(false);

const currentPageTitle = computed(() => {
  return route.meta?.title || appConfig.title;
});

function handleThemeToggle() {
  appStore.toggleTheme();
}

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
      <el-button class="app-header__icon" text @click="appStore.toggleSidebar()">
        <IconEpExpand v-if="appStore.isMobile || appStore.sidebarCollapsed" />
        <IconEpFold v-else />
      </el-button>

      <div class="app-header__context">
        <div class="app-header__context-top">
          <span class="app-header__workspace">{{ appConfig.title }}</span>
          <span class="app-header__divider"></span>
          <h2 class="app-header__title">{{ currentPageTitle }}</h2>
        </div>

        <AppBreadcrumb />
      </div>
    </div>

    <div class="app-header__right">
      <span class="app-header__theme-indicator">
        {{ appStore.theme === 'dark' ? 'Dark' : 'Light' }}
      </span>

      <el-tooltip content="切换明暗主题" placement="bottom">
        <el-button class="app-header__icon" text @click="handleThemeToggle">
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
  min-width: 0;
}

.app-header__context {
  min-width: 0;
}

.app-header__context-top {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  margin-bottom: 6px;
}

.app-header__workspace {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--app-text-secondary);
}

.app-header__divider {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(var(--app-brand-rgb), 0.22);
}

.app-header__title {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 700;
  color: var(--app-text-primary);
}

.app-header__icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  color: var(--app-text-primary);
  background: var(--app-control-bg);
}

.app-header__icon:hover {
  background: var(--app-control-hover-bg);
}

.app-header__theme-indicator {
  padding: 0 10px;
  border: 1px solid var(--app-border-color);
  border-radius: 999px;
  background: var(--app-control-bg);
  font-size: 12px;
  line-height: 30px;
  color: var(--app-text-secondary);
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
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
  min-width: 0;
}

.app-header__user-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text-primary);
}

.app-header__user-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: var(--app-text-secondary);
}

@media (max-width: 960px) {
  .app-header {
    padding: 0 14px;
  }

  .app-header__workspace,
  .app-header__theme-indicator,
  .app-header__user-meta {
    display: none;
  }

  .app-header__context-top {
    margin-bottom: 2px;
  }

  .app-header__title {
    font-size: 16px;
  }
}
</style>
