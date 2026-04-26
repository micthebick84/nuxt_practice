<template>
  <div class="dashboard-wrapper">
    <!-- Hover trigger area for drawer -->
    <div
      class="drawer-hover-trigger"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    />

    <!-- Sidebar Drawer -->
    <q-drawer
      v-model="drawerOpen"
      :width="menuState.miniMode ? 60 : 240"
      :mini="menuState.miniMode"
      overlay
      bordered
      class="dashboard-drawer"
      @mouseenter="handleDrawerEnter"
      @mouseleave="handleDrawerLeave"
    >
      <VerticalMenu />
    </q-drawer>

    <!-- Main Screen (Netis v6.6 메인 화면) -->
    <MainScreen @menu-toggle="toggleDrawer" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VerticalMenu from '~/components/navigation/VerticalMenu.vue';
import MainScreen from '~/components/main/MainScreen.vue';
import { useVerticalMenu } from '~/composables/useVerticalMenu';

const drawerOpen = ref(false);
const { state: menuState } = useVerticalMenu();

let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

function handleMouseEnter() {
  if (hoverTimeout) clearTimeout(hoverTimeout);
  drawerOpen.value = true;
}
function handleMouseLeave() {
  hoverTimeout = setTimeout(() => {
    drawerOpen.value = false;
  }, 300);
}
function handleDrawerEnter() {
  if (hoverTimeout) clearTimeout(hoverTimeout);
}
function handleDrawerLeave() {
  drawerOpen.value = false;
}
function toggleDrawer() {
  if (hoverTimeout) clearTimeout(hoverTimeout);
  drawerOpen.value = !drawerOpen.value;
}
</script>

<style scoped>
.dashboard-wrapper {
  position: relative;
  min-height: 100vh;
  background: #f4f6fa;
}

.drawer-hover-trigger {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 100vh;
  z-index: 200;
}

.dashboard-drawer {
  z-index: 300;
}
</style>

<style>
@import '~/assets/css/main-screen.css';

/* Pretendard font (CDN) — keeps design pixel-fidelity */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
</style>
