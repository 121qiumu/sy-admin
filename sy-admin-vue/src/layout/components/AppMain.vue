<template>
  <div class="app-main">
    <RouterView v-slot="{ Component, route }">
      <KeepAlive>
        <component
          :is="Component"
          v-if="route.meta?.keepAlive"
          :key="route.name || route.path"
          class="app-main__view"
        />
      </KeepAlive>

      <component
        :is="Component"
        v-if="!route.meta?.keepAlive"
        :key="route.fullPath"
        class="app-main__view"
      />
    </RouterView>
  </div>
</template>

<style scoped lang="less">
.app-main {
  min-height: var(--app-main-min-height);
}

.app-main__view {
  min-height: var(--app-main-min-height);
}
</style>
