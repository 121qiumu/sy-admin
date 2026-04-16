<script setup>
import PageContainer from '@/components/PageContainer.vue';
import { useRoute } from 'vue-router';
import { usePermissionStore } from '@/stores/modules/permission';

const route = useRoute();
const permissionStore = usePermissionStore();

const pageMeta = computed(() => route.meta || {});
const breadcrumbTitles = computed(() => pageMeta.value.breadcrumbTitles || []);
const buttonMenus = computed(() => pageMeta.value.buttonMenus || []);
const permissionCodes = computed(() => pageMeta.value.permissionCodes || []);
const externalLink = computed(() => pageMeta.value.externalLink || '');

function openExternalLink() {
  if (!externalLink.value) {
    return;
  }

  window.open(externalLink.value, '_blank', 'noopener');
}

function handleMockAction(button) {
  ElMessage.success(`已通过权限校验：${button.name}`);
}
</script>

<template>
  <PageContainer
    eyebrow="Permission Page"
    :title="pageMeta.title || '权限页面'"
    description="
        当前阶段这里是通用占位页，用来承接菜单权限、页面级权限和按钮权限闭环。后续接入真实业务模块时，只需要把对应路由替换为真实页面组件。
      "
  >
    <template #meta>
      <div class="permission-workspace__meta-grid">
        <div class="permission-workspace__meta-item">
          <span class="permission-workspace__meta-label">路由地址</span>
          <strong>{{ pageMeta.menuPath || route.path }}</strong>
        </div>
        <div class="permission-workspace__meta-item">
          <span class="permission-workspace__meta-label">后端 viewPath</span>
          <strong>{{ pageMeta.viewPath || '-' }}</strong>
        </div>
        <div class="permission-workspace__meta-item">
          <span class="permission-workspace__meta-label">KeepAlive</span>
          <strong>{{ pageMeta.keepAlive ? '开启' : '关闭' }}</strong>
        </div>
      </div>
    </template>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="14">
        <el-card class="permission-workspace__card" shadow="hover">
          <template #header>页面级权限说明</template>

          <el-alert
            title="当前路由已经通过菜单权限校验后才会注入到 Router 中，未授权访问会被拦到 403 页面。"
            type="success"
            :closable="false"
          />

          <div class="permission-workspace__block">
            <div class="permission-workspace__block-title">面包屑路径</div>
            <div class="permission-workspace__tags">
              <el-tag
                v-for="item in breadcrumbTitles"
                :key="item"
                effect="plain"
                type="info"
              >
                {{ item }}
              </el-tag>
            </div>
          </div>

          <div class="permission-workspace__block">
            <div class="permission-workspace__block-title">当前用户权限点</div>
            <div class="permission-workspace__tags">
              <el-tag
                v-for="item in permissionStore.perms.slice(0, 16)"
                :key="item"
                effect="plain"
              >
                {{ item }}
              </el-tag>
              <span v-if="permissionStore.perms.length === 0" class="permission-workspace__empty">
                当前用户暂无可用权限点
              </span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card class="permission-workspace__card" shadow="hover">
          <template #header>按钮权限示例</template>

          <div class="permission-workspace__button-list">
            <el-button
              v-for="button in buttonMenus"
              :key="button.id"
              v-permission="button.permissionCodes"
              type="primary"
              plain
              @click="handleMockAction(button)"
            >
              {{ button.name }}
            </el-button>

            <span v-if="buttonMenus.length === 0" class="permission-workspace__empty">
              当前菜单下没有定义按钮权限点
            </span>
          </div>

          <div class="permission-workspace__block">
            <div class="permission-workspace__block-title">按钮权限码</div>
            <div class="permission-workspace__tags">
              <el-tag
                v-for="code in permissionCodes"
                :key="code"
                effect="plain"
                type="success"
              >
                {{ code }}
              </el-tag>
              <span v-if="permissionCodes.length === 0" class="permission-workspace__empty">
                当前页面未绑定按钮权限码
              </span>
            </div>
          </div>

          <div v-if="externalLink" class="permission-workspace__block">
            <div class="permission-workspace__block-title">外链页面</div>
            <el-button type="primary" @click="openExternalLink">打开外部页面</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<style scoped lang="less">
.permission-workspace {
  display: grid;
  gap: 16px;
}

.permission-workspace__meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-top: 24px;
}

.permission-workspace__meta-item {
  padding: 14px 16px;
  border: 1px solid var(--app-border-color);
  border-radius: 18px;
  background: color-mix(in srgb, var(--app-surface-raised) 88%, transparent);
}

.permission-workspace__meta-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--app-text-secondary);
}

.permission-workspace__card {
  height: 100%;
  border-radius: 20px;
}

.permission-workspace__block {
  margin-top: 22px;
}

.permission-workspace__block-title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  color: var(--app-text-primary);
}

.permission-workspace__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.permission-workspace__button-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.permission-workspace__empty {
  font-size: 13px;
  color: var(--app-text-secondary);
}
</style>
