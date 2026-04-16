<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useAppStore } from '@/stores/modules/app';
import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';
import AppSidebar from './components/AppSidebar.vue';

const appStore = useAppStore();

const desktopSidebarWidth = computed(() => {
  return appStore.sidebarCollapsed
    ? 'var(--app-sidebar-collapsed-width)'
    : 'var(--app-sidebar-width)';
});

function syncViewportState() {
  appStore.setDeviceMode(window.innerWidth < 1080);
}

onMounted(() => {
  syncViewportState();
  window.addEventListener('resize', syncViewportState, {
    passive: true,
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewportState);
});
</script>

<template>
  <div class="admin-layout">
    <div class="admin-layout__ambient"></div>

    <div class="admin-layout__frame">
      <aside
        v-if="!appStore.isMobile"
        class="admin-layout__aside"
        :style="{ width: desktopSidebarWidth }"
      >
        <div class="admin-layout__aside-shell">
          <AppSidebar />
        </div>
      </aside>

      <el-drawer
        v-if="appStore.isMobile"
        :model-value="appStore.sidebarDrawerVisible"
        append-to-body
        :with-header="false"
        :show-close="false"
        direction="ltr"
        size="min(88vw, 320px)"
        modal-class="admin-layout__drawer-mask"
        class="admin-layout__drawer"
        @close="appStore.closeSidebarDrawer()"
        @update:model-value="appStore.setSidebarDrawerVisible($event)"
      >
        <div class="admin-layout__drawer-body">
          <AppSidebar @select="appStore.closeSidebarDrawer()" />
        </div>
      </el-drawer>

      <div class="admin-layout__body">
        <header class="admin-layout__header">
          <AppHeader />
        </header>

        <main class="admin-layout__main">
          <div class="admin-layout__main-inner">
            <AppMain />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.admin-layout {
  position: relative;
  min-height: 100vh;
  background: var(--app-bg);
}

.admin-layout__ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at top left, rgba(var(--app-brand-rgb), 0.14), transparent 28%),
    radial-gradient(circle at bottom right, rgba(var(--app-accent-rgb), 0.14), transparent 24%),
    var(--app-bg-gradient);
}

.admin-layout__frame {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 100vh;
}

.admin-layout__aside {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: var(--app-layout-padding) 0 var(--app-layout-padding) var(--app-layout-padding);
  flex: none;
  transition: width 0.2s ease;
}

.admin-layout__aside-shell {
  height: calc(100vh - (var(--app-layout-padding) * 2));
  overflow: hidden;
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-2xl);
  background: var(--app-sidebar-bg);
  box-shadow: var(--app-sidebar-shadow);
  backdrop-filter: blur(var(--app-surface-blur));
}

.admin-layout__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  gap: var(--app-layout-gap);
  padding: var(--app-layout-padding);
  padding-left: var(--app-layout-gap);
}

.admin-layout__header {
  position: sticky;
  top: var(--app-layout-padding);
  z-index: 20;
  display: flex;
  align-items: center;
  min-height: var(--app-header-height);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-xl);
  background: var(--app-header-bg);
  box-shadow: var(--app-header-shadow);
  backdrop-filter: blur(var(--app-surface-blur));
}

.admin-layout__main {
  flex: 1;
  min-width: 0;
}

.admin-layout__main-inner {
  min-height: calc(
    100vh - var(--app-header-height) - (var(--app-layout-padding) * 2) - var(--app-layout-gap)
  );
}

.admin-layout__drawer-body {
  height: 100%;
  margin: calc(var(--app-layout-padding) * -1);
}

:deep(.admin-layout__drawer .el-drawer) {
  background: transparent;
  box-shadow: none;
}

:deep(.admin-layout__drawer .el-drawer__body) {
  padding: 0;
}

:deep(.admin-layout__drawer-mask) {
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(4px);
}

@media (max-width: 1079px) {
  .admin-layout__frame {
    display: block;
  }

  .admin-layout__body {
    gap: 12px;
    padding: 12px;
  }

  .admin-layout__header {
    top: 12px;
  }

  .admin-layout__main-inner {
    min-height: calc(100vh - var(--app-header-height) - 24px - 12px);
  }
}
</style>
