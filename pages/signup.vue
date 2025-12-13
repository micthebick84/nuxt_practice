<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign Up
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <NuxtLink
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login
          </NuxtLink>
        </p>
      </div>

      <div
        v-if="errorMessage"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="successMessage"
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
      >
        {{ successMessage }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
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
            <label for="user-name" class="sr-only">User Name</label>
            <input
              id="user-name"
              v-model="form.userName"
              name="userName"
              type="text"
              autocomplete="name"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="User Name (optional)"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <div>
            <label for="password-confirm" class="sr-only">Confirm password</label>
            <input
              id="password-confirm"
              v-model="form.passwordConfirm"
              name="password-confirm"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div v-if="form.password && form.passwordConfirm && form.password !== form.passwordConfirm" class="text-red-500 text-sm">
          Passwords do not match.
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.agreeTerms"
            name="terms"
            type="checkbox"
            required
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500"
              >Terms of Service</a
            >
            and
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500"
              >Privacy Policy</a
            >
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="!formValid || authStore.isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="authStore.isLoading">Signing up...</span>
            <span v-else>Sign Up</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

// Form state
const form = reactive({
  userId: '',
  userName: '',
  password: '',
  passwordConfirm: '',
  agreeTerms: false,
});

const errorMessage = ref('');
const successMessage = ref('');

// Form validation
const formValid = computed(() => {
  return (
    form.userId &&
    form.password &&
    form.password === form.passwordConfirm &&
    form.agreeTerms
  );
});

// Handle signup
const handleSignup = async () => {
  if (!formValid.value) return;

  errorMessage.value = '';
  successMessage.value = '';

  try {
    await authStore.signup(form.userId, form.password, form.userName || undefined);

    successMessage.value = 'Registration successful! Redirecting to login...';

    // Navigate to login page after successful signup
    setTimeout(() => {
      navigateTo('/login?registered=true');
    }, 1500);
  } catch (error: any) {
    console.error('Signup failed:', error);
    if (error.data?.statusMessage) {
      errorMessage.value = error.data.statusMessage;
    } else {
      errorMessage.value = 'An error occurred during signup.';
    }
  }
};

// Prevent already logged-in users from accessing signup page
onMounted(() => {
  authStore.initializeAuth();
  if (authStore.isAuthenticated) {
    navigateTo('/');
  }
});

// Layout
definePageMeta({
  layout: 'empty',
});
</script>
