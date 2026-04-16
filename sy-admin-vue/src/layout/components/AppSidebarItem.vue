<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { resolveMenuIcon } from '@/layout/menu-icons';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const hasChildren = computed(() => Array.isArray(props.item.children) && props.item.children.length > 0);
const iconComponent = computed(() => resolveMenuIcon(props.item.icon));

function handleMenuClick() {
  if (props.item.externalLink) {
    window.open(props.item.externalLink, '_blank', 'noopener');
    return;
  }

  if (props.item.routePath) {
    router.push(props.item.routePath);
  }
}
</script>

<template>
  <el-sub-menu v-if="hasChildren" :index="item.menuKey">
    <template #title>
      <el-icon><component :is="iconComponent" /></el-icon>
      <span>{{ item.name }}</span>
    </template>

    <AppSidebarItem v-for="child in item.children" :key="child.menuKey" :item="child" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.routePath || item.menuKey" @click="handleMenuClick">
    <el-icon><component :is="iconComponent" /></el-icon>
    <template #title>{{ item.name }}</template>
  </el-menu-item>
</template>
