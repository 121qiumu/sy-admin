<script setup>
import { useRouter } from 'vue-router';
import { requestConfig } from '@/config';
import { useAuthStore } from '@/stores/modules/auth';

const router = useRouter();
const authStore = useAuthStore();

async function backToSafePage() {
  if (authStore.hasToken) {
    await router.replace('/dashboard');
    return;
  }

  await router.replace(requestConfig.loginPath);
}
</script>

<template>
  <section class="error-page">
    <el-result
      icon="error"
      title="403"
      sub-title="当前账号没有访问这个页面的权限。"
    >
      <template #extra>
        <el-button type="primary" @click="backToSafePage">返回安全页面</el-button>
      </template>
    </el-result>
  </section>
</template>

<style scoped lang="less">
.error-page {
  display: grid;
  place-items: center;
  min-height: calc(100vh - var(--app-header-height) - 40px);
  border: 1px dashed var(--app-border-color);
  border-radius: 24px;
  background: var(--app-surface-color);
}
</style>
