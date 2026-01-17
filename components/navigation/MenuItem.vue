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
      <q-item-label>{{ t(`menu.${item.id}`) }}</q-item-label>
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
      {{ t(`menu.${item.id}`) }}
    </q-tooltip>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import type { MenuItem as MenuItemType } from '~/types/menu';

const props = defineProps<{
  item: MenuItemType;
  miniMode?: boolean;
}>();

const emit = defineEmits<{
  click: [item: MenuItemType];
}>();

const { t } = useI18n();
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
  transition: background-color 0.2s ease;
}

.menu-item--active {
  background-color: var(--q-color-primary);
  color: white;
}

.menu-item--active :deep(.q-icon) {
  color: white;
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
