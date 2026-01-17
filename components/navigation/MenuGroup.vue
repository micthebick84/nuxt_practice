<template>
  <q-expansion-item
    v-model="expanded"
    :icon="group.icon"
    :label="miniMode ? '' : t(`menu.${group.id}`)"
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
        {{ t(`menu.${group.id}`) }}
      </q-tooltip>
    </template>

    <template v-for="child in group.children" :key="child.id">
      <LanguageSelector
        v-if="child.type === 'language-selector'"
        :mini-mode="miniMode"
        class="q-pl-lg"
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
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n();
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
