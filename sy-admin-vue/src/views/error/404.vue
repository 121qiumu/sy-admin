<template>
  <section class="not-found-page">
    <el-result icon="warning" title="404" sub-title="页面不存在或路由尚未接入。">
      <template #extra>
        <RouterLink to="/dashboard">
          <el-button type="primary">返回工作台</el-button>
        </RouterLink>
      </template>
    </el-result>
  </section>
</template>

<style scoped lang="less">
.not-found-page {
  display: grid;
  place-items: center;
  min-height: calc(100vh - var(--app-header-height) - 40px);
  border: 1px dashed var(--app-border-color);
  border-radius: 24px;
  background: var(--app-surface-color);
}
</style>
