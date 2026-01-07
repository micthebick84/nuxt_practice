<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4"
  >
    <div class="max-w-md w-full space-y-8 text-center">
      <q-spinner-dots color="primary" size="50px" />
      <p class="mt-4 text-gray-600">Redirecting to registration...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'empty',
});

const authStore = useAuthStore();

onMounted(() => {
  // If already authenticated, go to home
  authStore.initializeAuth();
  if (authStore.isAuthenticated) {
    navigateTo('/');
    return;
  }

  // Redirect to OAuth authorization server (registration handled there)
  authStore.redirectToLogin();
});
</script>
