<template>
  <q-expansion-item
    v-model="expanded"
    :icon="group.icon"
    :label="miniMode ? '' : group.label"
    :header-class="miniMode ? 'q-px-sm' : ''"
    class="menu-group"
  >
    <template #header v-if="miniMode">
      <q-item-section avatar>
        <q-icon :name="group.icon" />
      </q-item-section>
      <q-tooltip
        anchor="center right"
        self="center left"
        :offset="[10, 0]"
      >
        {{ group.label }}
      </q-tooltip>
    </template>

    <template v-for="child in group.children" :key="child.id">
      <LanguageSelector
        v-if="child.type === 'language-selector'"
        :mini-mode="miniMode"
        class="q-pl-lg"
      />
      <MenuGroup
        v-else-if="child.children && child.children.length > 0"
        :group="child"
        :mini-mode="miniMode"
        class="q-pl-md"
        @item-click="handleItemClick"
      />
      <MenuItem
        v-else
        :item="child"
        :mini-mode="miniMode"
        class="q-pl-lg"
        @click="handleItemClick"
      />
    </template>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { MenuItem as MenuItemType } from '~/types/menu';
import { useVerticalMenu } from '~/composables/useVerticalMenu';
import MenuItem from './MenuItem.vue';
import LanguageSelector from './LanguageSelector.vue';

const props = defineProps<{
  group: MenuItemType;
  miniMode?: boolean;
}>();

const emit = defineEmits<{
  itemClick: [item: MenuItemType];
}>();

const { isGroupExpanded, toggleGroup } = useVerticalMenu();

const expanded = ref(isGroupExpanded(props.group.id));

watch(expanded, (newVal) => {
  if (newVal !== isGroupExpanded(props.group.id)) {
    toggleGroup(props.group.id);
  }
});

const handleItemClick = (item: MenuItemType) => {
  emit('itemClick', item);
};
</script>

<style scoped>
.menu-group :deep(.q-item) {
  padding-left: 2rem;
}
</style>
