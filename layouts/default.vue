<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Logo/Icon area -->
        <q-icon name="school" size="24px" class="q-mr-sm" />
        <q-toolbar-title>
          <NuxtLink to="/" class="text-white text-decoration-none">
            {{ t('home') }}
          </NuxtLink>
        </q-toolbar-title>

        <q-space />

        <q-tabs v-model="tab" class="text-white">
          <q-tab name="home" :label="t('home')" @click="navigateTo('/')" />
          <q-tab name="about" :label="t('about')" @click="navigateTo('/about')" />
          <q-tab name="test" :label="t('test')" @click="navigateTo('/test')" />
          <q-tab name="admin" :label="t('admin')" @click="navigateTo('/admin')" />
        </q-tabs>

        <q-space />

        <!-- Language Switcher -->
        <q-btn-dropdown flat :label="currentLanguageName">
          <q-list>
            <q-item v-for="lang in languages" :key="lang.code" clickable @click="setLanguage(lang.code)">
              <q-item-section>{{ lang.name }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Profile Menu -->
        <q-btn-dropdown flat>
          <template #label>
            <q-avatar size="32px">
              <img v-if="userStore.hasAvatar" :src="userStore.userProfile?.avatarUrl" />
              <q-icon v-else name="person" />
            </q-avatar>
          </template>
          <q-list>
            <q-item clickable @click="navigateTo('/profile')">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>{{ t('profile.title') }}</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="handleLogout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>{{ t('logout') }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <NuxtPage />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const { t, locale } = useI18n()
const tab = ref('home')
const route = useRoute()

// Sync tab with current route
watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/admin')) tab.value = 'admin'
    else if (path.startsWith('/about')) tab.value = 'about'
    else if (path.startsWith('/test')) tab.value = 'test'
    else tab.value = 'home'
  },
  { immediate: true }
)

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
})

const handleLogout = () => {
  if (confirm(t('logoutConfirm'))) {
    authStore.logout()
    navigateTo('/login')
  }
}

const languages = [
  { name: 'English', code: 'en' },
  { name: 'Korean', code: 'ko' },
]
const currentLanguageName = computed(() => languages.find(l => l.code === locale.value)?.name || 'Language')
const setLanguage = (code: string) => { locale.value = code }
</script>

<style scoped>
.q-tabs {
  color: white;
}

.q-tab {
  color: white;
}

.q-tab--active {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
