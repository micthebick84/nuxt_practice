<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Hover trigger area for drawer -->
    <div
      class="drawer-hover-trigger"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    ></div>

    <!-- Vertical Menu Drawer -->
    <q-drawer
      v-model="menuState.isOpen"
      :width="menuState.miniMode ? 60 : 280"
      :mini="menuState.miniMode"
      :breakpoint="1024"
      overlay
      bordered
      class="bg-grey-1"
      @mouseenter="handleDrawerEnter"
      @mouseleave="handleDrawerLeave"
    >
      <VerticalMenu />
    </q-drawer>

    <!-- No header, content fills full height -->
    <q-page-container>
      <NuxtPage />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'
import { useVerticalMenu } from '~/composables/useVerticalMenu'
import { useRoute } from 'vue-router'
import VerticalMenu from '~/components/navigation/VerticalMenu.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const { state: menuState, openDrawer, closeDrawer } = useVerticalMenu()
const route = useRoute()

let hoverTimeout: NodeJS.Timeout | null = null

const handleMouseEnter = () => {
  // Open drawer when mouse enters the left edge
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
  openDrawer()
}

const handleMouseLeave = () => {
  // Delay closing the drawer to allow moving to drawer
  hoverTimeout = setTimeout(() => {
    closeDrawer()
  }, 300)
}

const handleDrawerEnter = () => {
  // Cancel close timeout when mouse enters drawer
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
}

const handleDrawerLeave = () => {
  // Close drawer when mouse leaves drawer
  closeDrawer()
}

onMounted(async () => {
  authStore.initializeAuth()
  // Load user profile if authenticated
  if (authStore.user?.userId) {
    try {
      await userStore.fetchProfile(authStore.user.userId)
    } catch (error) {
      // Profile fetch failed, but continue
    }
  }
  // Start with drawer closed
  closeDrawer()
})
</script>

<style scoped>
.drawer-hover-trigger {
  position: fixed;
  left: 0;
  top: 0;
  width: 20px;
  height: 100vh;
  z-index: 2000;
  background: transparent;
}

/* Make sure page container fills full height */
:deep(.q-page-container) {
  padding-top: 0 !important;
}
</style>
