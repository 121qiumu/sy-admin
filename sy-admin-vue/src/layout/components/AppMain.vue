<template>
  <div class="app-main">
    <RouterView />
  </div>
</template>

<style scoped lang="less">
.app-main {
  min-height: calc(100vh - var(--app-header-height) - 40px);
}
</style>
