<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-2">
    <q-header elevated class="bg-dark text-white">
      <q-toolbar>
        <!-- 로고/아이콘 영역 -->
        <div class="q-mr-md">
          <img 
            src="https://via.placeholder.com/32x32/ffffff/000000?text=Logo" 
            alt="Logo" 
            style="width: 32px; height: 32px; border-radius: 4px;"
          />
        </div>
        <q-separator dark vertical />
        <NuxtLink v-slot="{ navigate }" custom to="/">
          <q-btn stretch flat :label="$t('home')" @click="navigate" />
        </NuxtLink>
        <q-separator dark vertical />
        <NuxtLink v-slot="{ navigate }" custom to="/about">
          <q-btn stretch flat :label="$t('about')" @click="navigate" />
        </NuxtLink>
        <q-separator dark vertical />
        <NuxtLink v-slot="{ navigate }" custom to="/test">
          <q-btn stretch flat :label="$t('test')" @click="navigate" />
        </NuxtLink>
        <q-separator dark vertical />
        <NuxtLink v-slot="{ navigate }" custom to="/admin">
          <q-btn stretch flat :label="$t('admin')" @click="navigate" />
        </NuxtLink>
        <q-separator dark vertical />
        <!-- 로그아웃 버튼 -->
        <q-btn v-if="authStore.isAuthenticated" stretch flat @click="handleLogout">
          {{ $t('logout') }}
        </q-btn>
        <q-separator v-if="authStore.isAuthenticated" dark vertical />
        <q-btn-dropdown stretch flat no-caps :label="selectedLanguageName">
          <q-list padding dense>
            <q-item
              v-for="{ code, name } in languages"
              :key="code"
              v-close-popup
              clickable
              :active="code === $i18n.locale"
              @click="$i18n.locale = code"
            >
              <q-item-section>
                <q-item-label>{{ name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <q-page-container :style="pageContainerStyle">
      <slot></slot>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const { t } = useI18n();

// 페이지가 마운트될 때 인증 상태 초기화
onMounted(() => {
  authStore.initializeAuth();
});

const handleLogout = async () => {
  const confirmed = confirm(t('logoutConfirm'));
  if (confirmed) {
    await authStore.logout();
    navigateTo('/login');
  }
};

const pageContainerStyle = computed(() => ({
  maxWidth: '1080px',
  margin: '0 auto',
}));

interface Language {
  name: string;
  code: 'en' | 'ko';
}

const languages = ref<Language[]>([
  { name: 'English', code: 'en' },
  { name: '한국어', code: 'ko' },
]);

const { locale } = useI18n();

const selectedLanguageName = computed(
  () => languages.value.find((lang) => lang.code === locale.value)?.name,
);
</script>
