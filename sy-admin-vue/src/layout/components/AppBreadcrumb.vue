<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const breadcrumbItems = computed(() => {
  const metaTitles = Array.isArray(route.meta?.breadcrumbTitles)
    ? route.meta.breadcrumbTitles.filter(Boolean)
    : [];

  const matchedTitles = route.matched
    .filter((record) => record.path !== '/' && record.meta?.title)
    .map((record) => record.meta.title);

  const titles = metaTitles.length ? metaTitles : matchedTitles;

  if (route.path === '/dashboard') {
    return [
      {
        label: '工作台',
        path: '',
        isHome: true,
      },
    ];
  }

  return [
    {
      label: '工作台',
      path: '/dashboard',
      isHome: true,
    },
    ...titles.map((title) => ({
      label: title,
      path: '',
      isHome: false,
    })),
  ];
});

function handleNavigate(path) {
  if (!path) {
    return;
  }

  router.push(path);
}
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="item in breadcrumbItems"
      :key="`${item.label}-${item.path || 'current'}`"
    >
      <button
        v-if="item.path"
        class="app-breadcrumb__link"
        type="button"
        @click="handleNavigate(item.path)"
      >
        <IconEpHouse v-if="item.isHome" />
        <span>{{ item.label }}</span>
      </button>

      <span v-else class="app-breadcrumb__text">
        <IconEpHouse v-if="item.isHome" />
        <span>{{ item.label }}</span>
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="less">
.app-breadcrumb__link,
.app-breadcrumb__text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 1;
}

.app-breadcrumb__link {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--app-text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;
}

.app-breadcrumb__link:hover {
  color: var(--app-text-primary);
}

.app-breadcrumb__text {
  color: var(--app-text-tertiary);
}

:deep(.el-breadcrumb__separator) {
  color: var(--app-text-tertiary);
}
</style>
