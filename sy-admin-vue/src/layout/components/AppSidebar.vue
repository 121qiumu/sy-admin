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
const emit = defineEmits(['select']);

const navigationMenus = computed(() => permissionStore.navigationMenus);
const defaultOpeneds = computed(() => permissionStore.resolveOpenKeys(route.path));
const menuCollapsed = computed(() => !appStore.isMobile && appStore.sidebarCollapsed);
</script>

<template>
  <div class="app-sidebar">
    <div class="app-sidebar__brand">
      <div class="app-sidebar__logo">SY</div>
      <div v-show="!menuCollapsed" class="app-sidebar__meta">
        <div class="app-sidebar__name">{{ appConfig.title }}</div>
        <div class="app-sidebar__tag">Enterprise Console</div>
      </div>
    </div>

    <div class="app-sidebar__panel">
      <div v-show="!menuCollapsed" class="app-sidebar__panel-label">Navigation</div>

      <el-scrollbar>
      <el-menu
        :collapse="menuCollapsed"
        :collapse-transition="false"
        :default-active="$route.path"
        :default-openeds="defaultOpeneds"
        class="app-sidebar__menu"
        unique-opened
      >
        <AppSidebarItem
          v-for="item in navigationMenus"
          :key="item.menuKey"
          :item="item"
          @select="emit('select', $event)"
        />
      </el-menu>
      </el-scrollbar>
    </div>

    <div v-show="!menuCollapsed" class="app-sidebar__footer">
      <div class="app-sidebar__footer-title">Layout Ready</div>
      <p class="app-sidebar__footer-desc">
        侧栏、顶部栏、面包屑和页面容器已经统一，后续 CRUD 页面可以直接接入。
      </p>
    </div>
  </div>
</template>

<style scoped lang="less">
.app-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 14px 0 12px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 24%),
    var(--app-sidebar-bg);
}

.app-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 18px;
  min-height: var(--app-header-height);
  margin-bottom: 14px;
}

.app-sidebar__logo {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 15px;
  background: linear-gradient(135deg, var(--app-brand-color), var(--app-accent-color));
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  flex-shrink: 0;
  box-shadow: 0 18px 34px rgba(var(--app-brand-rgb), 0.24);
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

.app-sidebar__panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.app-sidebar__panel-label {
  padding: 0 22px 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--app-text-tertiary);
}

.app-sidebar__menu {
  border-right: none;
  padding: 4px 0 12px;
  background: transparent;
}

:deep(.el-menu) {
  border-right: none;
  background: transparent;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 46px;
  margin: 4px 12px;
  border-radius: 16px;
  color: var(--app-text-secondary);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: var(--app-menu-hover-bg);
  color: var(--app-text-primary);
}

:deep(.el-menu-item.is-active) {
  background: var(--app-menu-active-bg);
  color: var(--app-text-primary);
  box-shadow: inset 0 0 0 1px rgba(var(--app-brand-rgb), 0.18);
}

:deep(.el-sub-menu .el-menu-item) {
  margin-left: 16px;
}

:deep(.el-menu--collapse .el-menu-item),
:deep(.el-menu--collapse .el-sub-menu__title) {
  justify-content: center;
}

.app-sidebar__footer {
  margin: 8px 16px 0;
  padding: 16px;
  border: 1px solid var(--app-border-color);
  border-radius: 18px;
  background: var(--app-sidebar-footer-bg);
}

.app-sidebar__footer-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--app-text-primary);
}

.app-sidebar__footer-desc {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--app-text-secondary);
}
</style>
