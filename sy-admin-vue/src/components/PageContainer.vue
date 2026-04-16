<script setup>
import { computed, useSlots } from 'vue';

const props = defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  dense: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();

const hasHeader = computed(() => {
  return Boolean(
    props.eyebrow ||
      props.title ||
      props.description ||
      slots.actions ||
      slots.extra ||
      slots.meta
  );
});
</script>

<template>
  <section class="page-container" :class="{ 'page-container--dense': dense }">
    <header v-if="hasHeader" class="page-container__header page-card">
      <div class="page-container__intro">
        <p v-if="eyebrow" class="page-container__eyebrow">{{ eyebrow }}</p>
        <h1 v-if="title" class="page-container__title">{{ title }}</h1>
        <p v-if="description" class="page-container__description">{{ description }}</p>
        <slot name="meta"></slot>
      </div>

      <div v-if="$slots.actions || $slots.extra" class="page-container__actions">
        <slot name="actions"></slot>
        <slot name="extra"></slot>
      </div>
    </header>

    <div class="page-container__body">
      <slot></slot>
    </div>
  </section>
</template>

<style scoped lang="less">
.page-container {
  display: grid;
  gap: var(--app-page-gap);
  min-height: var(--app-main-min-height);
}

.page-container--dense {
  gap: 14px;
}

.page-container__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 28px;
  background:
    linear-gradient(135deg, rgba(var(--app-brand-rgb), 0.08), transparent 44%),
    linear-gradient(160deg, rgba(var(--app-accent-rgb), 0.12), transparent 64%),
    var(--app-surface-color);
}

.page-container__intro {
  min-width: 0;
}

.page-container__eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--app-text-secondary);
}

.page-container__title {
  margin: 0;
  font-size: clamp(28px, 4vw, 38px);
  line-height: 1.08;
  color: var(--app-text-primary);
}

.page-container__description {
  max-width: 760px;
  margin: 14px 0 0;
  color: var(--app-text-secondary);
  line-height: 1.85;
}

.page-container__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex: none;
}

.page-container__body {
  display: grid;
  gap: var(--app-page-gap);
}

@media (max-width: 960px) {
  .page-container__header {
    flex-direction: column;
    padding: 22px 20px;
  }

  .page-container__actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
