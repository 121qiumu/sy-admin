<template>
  <div class="app-main">
    <RouterView v-slot="{ Component, route }">
      <KeepAlive>
        <component
          :is="Component"
          v-if="route.meta?.keepAlive"
          :key="route.name || route.path"
        />
      </KeepAlive>

      <component
        :is="Component"
        v-if="!route.meta?.keepAlive"
        :key="route.fullPath"
      />
    </RouterView>
  </div>
</template>

<style scoped lang="less">
.app-main {
  min-height: calc(100vh - var(--app-header-height) - 40px);
}
</style>
