<script setup>
import { useAppStore } from '@/stores/modules/app';
import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';
import AppSidebar from './components/AppSidebar.vue';

const appStore = useAppStore();
</script>

<template>
  <div class="layout-shell">
    <el-container class="layout-frame">
      <el-aside :width="appStore.sidebarCollapsed ? '76px' : '248px'" class="layout-aside">
        <AppSidebar />
      </el-aside>
      <el-container class="layout-body">
        <el-header class="layout-header">
          <AppHeader />
        </el-header>
        <el-main class="layout-main">
          <AppMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">
.layout-shell {
  min-height: 100%;
}

.layout-frame {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(15, 23, 42, 0.08), transparent 28%),
    radial-gradient(circle at bottom right, rgba(22, 163, 74, 0.08), transparent 26%),
    var(--app-bg);
}

.layout-aside {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  border-right: 1px solid var(--app-border-color);
  background: var(--app-sidebar-bg);
  transition: width 0.2s ease;
}

.layout-body {
  min-width: 0;
}

.layout-header {
  display: flex;
  align-items: center;
  height: var(--app-header-height);
  padding: 0;
  border-bottom: 1px solid var(--app-border-color);
  background: var(--app-surface-color);
}

.layout-main {
  padding: 20px;
}
</style>
