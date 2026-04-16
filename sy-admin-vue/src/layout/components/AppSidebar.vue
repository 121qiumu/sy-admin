<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { appConfig } from '@/config';
import { useAppStore } from '@/stores/modules/app';
import { usePermissionStore } from '@/stores/modules/permission';
import AppSidebarItem from './AppSidebarItem.vue';

const route = useRoute();
const appStore = useAppStore();
const permissionStore = usePermissionStore();

const navigationMenus = computed(() => permissionStore.navigationMenus);
const defaultOpeneds = computed(() => permissionStore.resolveOpenKeys(route.path));
</script>

<template>
  <div class="app-sidebar">
    <div class="app-sidebar__brand">
      <div class="app-sidebar__logo">SY</div>
      <div v-show="!appStore.sidebarCollapsed" class="app-sidebar__meta">
        <div class="app-sidebar__name">{{ appConfig.title }}</div>
        <div class="app-sidebar__tag">Permission Ready</div>
      </div>
    </div>

    <el-scrollbar>
      <el-menu
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        :default-active="$route.path"
        :default-openeds="defaultOpeneds"
        class="app-sidebar__menu"
        unique-opened
      >
        <AppSidebarItem v-for="item in navigationMenus" :key="item.menuKey" :item="item" />
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

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  margin: 4px 12px;
  border-radius: 12px;
}

:deep(.el-menu-item.is-active) {
  background: color-mix(in srgb, var(--app-surface-color) 72%, #2563eb 28%);
}
</style>
