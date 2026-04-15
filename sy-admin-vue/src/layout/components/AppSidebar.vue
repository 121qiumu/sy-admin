<script setup>
import { shellMenus } from '@/layout/menu';
import { useAppStore } from '@/stores/modules/app';

const appStore = useAppStore();
</script>

<template>
  <div class="app-sidebar">
    <div class="app-sidebar__brand">
      <div class="app-sidebar__logo">EA</div>
      <div v-show="!appStore.sidebarCollapsed" class="app-sidebar__meta">
        <div class="app-sidebar__name">Sy Admin</div>
        <div class="app-sidebar__tag">Vue 3 + Vite</div>
      </div>
    </div>

    <el-scrollbar>
      <el-menu
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        :default-active="$route.path"
        class="app-sidebar__menu"
        router
      >
        <el-menu-item v-for="item in shellMenus" :key="item.path" :index="item.path">
          <IconEpHomeFilled />
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="less">
.app-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  height: var(--app-header-height);
  padding: 0 18px;
  border-bottom: 1px solid var(--app-border-color);
}

.app-sidebar__logo {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0f766e, #2563eb);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.app-sidebar__meta {
  min-width: 0;
}

.app-sidebar__name {
  font-size: 14px;
  font-weight: 700;
  color: var(--app-text-primary);
}

.app-sidebar__tag {
  font-size: 12px;
  color: var(--app-text-secondary);
}

.app-sidebar__menu {
  border-right: none;
  padding: 12px 0;
  background: transparent;
}

:deep(.el-menu-item) {
  margin: 4px 12px;
  border-radius: 12px;
}
</style>
