<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4"
  >
    <div class="max-w-md w-full space-y-8 text-center">
      <!-- Show logout success message -->
      <template v-if="showLogoutMessage">
        <q-icon name="check_circle" color="positive" size="64px" />
        <h2 class="mt-4 text-xl font-semibold text-gray-800">Logged out successfully</h2>
        <p class="mt-2 text-gray-600">You have been logged out.</p>
        <q-btn
          color="primary"
          label="Login Again"
          class="q-mt-lg"
          @click="redirectToOAuth"
        />
      </template>
      <!-- Show loading spinner when redirecting -->
      <template v-else>
        <q-spinner-dots color="primary" size="50px" />
        <p class="mt-4 text-gray-600">Redirecting to login...</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'empty',
});

const authStore = useAuthStore();
const config = useRuntimeConfig();
const route = useRoute();

// Check if this is a post-logout redirect
const showLogoutMessage = ref(route.query.logout === 'true');

const redirectToOAuth = () => {
  // Generate CSRF state
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const state = Array.from(array, (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
  sessionStorage.setItem('oauth_state', state);

  // Build OAuth authorization URL
  const oauth = config.public.oauth;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: oauth.clientId,
    redirect_uri: oauth.redirectUri,
    scope: oauth.scope,
    state,
  });

  // If force_login flag is set (after logout), force re-authentication
  const forceLogin = sessionStorage.getItem('force_login');
  if (forceLogin === 'true') {
    // Use max_age=0 to force re-authentication (more widely supported than prompt=login)
    params.append('max_age', '0');
    params.append('prompt', 'login');
    sessionStorage.removeItem('force_login');
  }

  const authUrl = `${oauth.authorizationEndpoint}?${params.toString()}`;

  // Redirect to OAuth server
  window.location.href = authUrl;
};

onMounted(() => {
  // If already authenticated, go to home
  authStore.initializeAuth();
  if (authStore.isAuthenticated) {
    navigateTo('/');
    return;
  }

  // If this is a post-logout redirect, don't auto-redirect to OAuth
  if (showLogoutMessage.value) {
    return;
  }

  // Otherwise, redirect to OAuth server
  redirectToOAuth();
});
</script>
