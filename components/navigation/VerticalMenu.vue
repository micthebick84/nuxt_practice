<template>
  <div class="vertical-menu column no-wrap full-height">
    <!-- Header -->
    <q-item class="menu-header bg-primary text-white">
      <q-item-section avatar v-if="!state.miniMode">
        <q-icon name="school" size="md" />
      </q-item-section>
      <q-item-section v-if="!state.miniMode">
        <q-item-label class="text-h6">{{ t('app.name') }}</q-item-label>
        <q-item-label caption class="text-white">{{ t('app.tagline') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
          flat
          dense
          round
          icon="menu_open"
          :title="t('menu.toggleMini')"
          @click="toggleMiniMode"
        />
      </q-item-section>
    </q-item>

    <q-separator />

    <!-- Menu Items -->
    <q-scroll-area class="col">
      <q-list padding>
        <template v-for="item in visibleMenuItems" :key="item.id">
          <q-separator v-if="item.separator" class="q-my-sm" />

          <!-- Group with children -->
          <MenuGroup
            v-if="item.children && item.children.length > 0"
            :group="item"
            :mini-mode="state.miniMode"
            @item-click="navigate"
          />

          <!-- Single item -->
          <MenuItem
            v-else
            :item="item"
            :mini-mode="state.miniMode"
            @click="navigate"
          />
        </template>
      </q-list>
    </q-scroll-area>

    <!-- Footer -->
    <q-separator />

    <!-- Logout Button -->
    <div class="menu-footer">
      <q-item
        clickable
        v-ripple
        @click="handleLogout"
        class="logout-item"
      >
        <q-item-section avatar>
          <q-icon name="logout" color="negative" />
        </q-item-section>
        <q-item-section v-if="!state.miniMode">
          <q-item-label class="text-negative text-weight-medium">{{ t('logout') }}</q-item-label>
        </q-item-section>
        <q-tooltip
          v-if="state.miniMode"
          anchor="center right"
          self="center left"
          :offset="[10, 0]"
        >
          {{ t('logout') }}
        </q-tooltip>
      </q-item>

      <q-separator />

      <div class="q-pa-sm text-center text-caption text-grey" v-if="!state.miniMode">
        <div>© 2026 Nuxt Practice</div>
        <div class="text-weight-light">v1.0.0</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useVerticalMenu } from '~/composables/useVerticalMenu';
import { useAuthStore } from '~/stores/auth';
import MenuItem from './MenuItem.vue';
import MenuGroup from './MenuGroup.vue';
import type { MenuItem as MenuItemType } from '~/types/menu';

const { t } = useI18n();
const $q = useQuasar();
const authStore = useAuthStore();
const {
  state,
  toggleMiniMode,
  navigate,
  visibleMenuItems,
} = useVerticalMenu();

const handleLogout = () => {
  $q.dialog({
    title: t('logout'),
    message: t('logoutConfirm'),
    cancel: {
      label: t('no'),
      flat: true,
    },
    ok: {
      label: t('yes'),
      color: 'negative',
    },
    persistent: true,
  }).onOk(() => {
    authStore.logout();
    navigateTo('/login');
  });
};
</script>

<style scoped>
.vertical-menu {
  background-color: #f5f5f5;
}

.menu-header {
  min-height: 64px;
}

.menu-footer {
  background-color: #fafafa;
}

.logout-item {
  transition: background-color 0.2s ease;
}

.logout-item:hover {
  background-color: rgba(255, 0, 0, 0.05);
}
</style>
