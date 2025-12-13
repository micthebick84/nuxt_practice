<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          or
          <NuxtLink
            to="/signup"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </NuxtLink>
        </p>
      </div>

      <div
        v-if="errorMessage"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
      >
        {{ errorMessage }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="login">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="user-id" class="sr-only">User ID</label>
            <input
              id="user-id"
              v-model="form.userId"
              name="userId"
              type="text"
              autocomplete="username"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="User ID"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="authStore.isLoading">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

// Types
type LoginForm = {
  userId: string;
  password: string;
  rememberMe: boolean;
  redirect: string;
};

// State
const form = reactive<LoginForm>({
  userId: '',
  password: '',
  rememberMe: false,
  redirect: '',
});

const errorMessage = ref('');
const authStore = useAuthStore();
const route = useRoute();

// Methods
const login = async () => {
  errorMessage.value = '';
  try {
    await authStore.login(form.userId, form.password);

    // Redirect to previous page or home after successful login
    const redirectTo = form.redirect || '/';
    await navigateTo(redirectTo, { external: false });
  } catch (error: any) {
    console.error('Login failed:', error);
    if (error.data?.statusMessage) {
      errorMessage.value = error.data.statusMessage;
    } else {
      errorMessage.value = 'Login failed. Please check your credentials.';
    }
  }
};

// Check for successful registration
onMounted(() => {
  if (route.query.registered === 'true') {
    alert('Registration completed successfully. Please login.');
  }

  // Set redirect path after login (get from query parameters)
  if (route.query.redirect) {
    form.redirect = Array.isArray(route.query.redirect)
      ? route.query.redirect[0] || ''
      : route.query.redirect || '';
  }
});

// Layout
definePageMeta({
  layout: 'empty',
});
</script>
