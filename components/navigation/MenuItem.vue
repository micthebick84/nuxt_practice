<template>
  <q-item
    clickable
    v-ripple
    :active="isActive"
    @click="handleClick"
    class="menu-item"
    :class="{ 'menu-item--active': isActive }"
  >
    <q-item-section avatar>
      <q-icon :name="item.icon" />
    </q-item-section>

    <q-item-section v-if="!miniMode">
      <q-item-label>{{ item.label }}</q-item-label>
    </q-item-section>

    <q-item-section side v-if="item.badge && !miniMode">
      <q-badge color="red" :label="item.badge" />
    </q-item-section>

    <q-tooltip
      v-if="miniMode"
      anchor="center right"
      self="center left"
      :offset="[10, 0]"
    >
      {{ item.label }}
    </q-tooltip>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuItem as MenuItemType } from '~/types/menu';

const props = defineProps<{
  item: MenuItemType;
  miniMode?: boolean;
}>();

const emit = defineEmits<{
  click: [item: MenuItemType];
}>();

const route = useRoute();

const isActive = computed(() => {
  return route.path === props.item.route;
});

const handleClick = () => {
  if (!props.item.disabled) {
    emit('click', props.item);
  }
};
</script>

<style scoped>
.menu-item {
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 2px 4px;
}

.menu-item :deep(.q-icon) {
  color: #616161;
  transition: color 0.2s ease;
}

.menu-item:hover :deep(.q-icon) {
  color: var(--q-color-primary);
}

.menu-item--active {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white !important;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

.menu-item--active :deep(.q-icon) {
  color: #ffeb3b !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.menu-item--active :deep(.q-item__label) {
  color: white !important;
  font-weight: 600;
}

@media (max-width: 1023px) {
  .menu-item {
    min-height: 48px;
    font-size: 1rem;
  }
}

@media (min-width: 1024px) {
  .menu-item {
    min-height: 40px;
  }
}
</style>
