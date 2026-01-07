<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4"
  >
    <div class="max-w-md w-full space-y-8 text-center">
      <div v-if="isLoading">
        <q-spinner-dots color="primary" size="50px" />
        <p class="mt-4 text-gray-600">Completing authentication...</p>
      </div>

      <div v-else-if="error" class="text-red-600">
        <q-icon name="error" size="50px" />
        <h2 class="mt-4 text-xl font-bold">Authentication Failed</h2>
        <p class="mt-2">{{ error }}</p>
        <q-btn
          color="primary"
          class="mt-4"
          label="Try Again"
          @click="retryLogin"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'empty',
});

const route = useRoute();
const authStore = useAuthStore();

const isLoading = ref(true);
const error = ref<string | null>(null);
const isProcessing = ref(false);

const retryLogin = () => {
  authStore.redirectToLogin();
};

onMounted(async () => {
  // Prevent multiple executions
  if (isProcessing.value) return;
  isProcessing.value = true;

  const code = route.query.code as string;
  const state = route.query.state as string;
  const errorParam = route.query.error as string;
  const errorDescription = route.query.error_description as string;

  console.log('OAuth callback - code:', code ? 'present' : 'missing', 'state:', state ? 'present' : 'missing');

  // Check for OAuth error response
  if (errorParam) {
    error.value = errorDescription || errorParam;
    isLoading.value = false;
    return;
  }

  // Validate required parameters
  if (!code) {
    error.value = 'Authorization code not received';
    isLoading.value = false;
    return;
  }

  // Check if we already processed this code (prevent duplicate processing)
  const processedCode = sessionStorage.getItem('processed_oauth_code');
  if (processedCode === code) {
    console.log('OAuth callback - code already processed, redirecting...');
    await navigateTo('/course', { replace: true });
    return;
  }

  // Validate state parameter (CSRF protection) - skip if no state in session
  const savedState = sessionStorage.getItem('oauth_state');
  console.log('OAuth callback - savedState:', savedState ? 'present' : 'missing');

  if (state && savedState && state !== savedState) {
    error.value = 'Invalid state parameter. Please try again.';
    isLoading.value = false;
    sessionStorage.removeItem('oauth_state');
    return;
  }
  sessionStorage.removeItem('oauth_state');

  try {
    console.log('OAuth callback - exchanging code for tokens...');
    // Mark this code as processed to prevent duplicate processing
    sessionStorage.setItem('processed_oauth_code', code);

    // Exchange code for tokens
    await authStore.exchangeCodeForTokens(code);
    console.log('OAuth callback - token exchange successful');

    // Use navigateTo with replace to prevent back navigation issues
    await navigateTo('/course', { replace: true });
  } catch (err: any) {
    console.error('OAuth callback error:', err);
    error.value = err.message || 'Failed to complete authentication';
    sessionStorage.removeItem('processed_oauth_code');
  } finally {
    isLoading.value = false;
  }
});
</script>
