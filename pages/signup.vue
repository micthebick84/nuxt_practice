<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign Up
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Login
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
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
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Terms of Service</a> and
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="!formValid"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Form state
const form = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
  agreeTerms: false
});

// Form validation
const formValid = computed(() => {
  return (
    form.email &&
    form.password &&
    form.password === form.passwordConfirm &&
    form.agreeTerms
  );
});

// Handle signup
const handleSignup = async () => {
  if (!formValid.value) return;

  try {
    // Add signup API call logic here
    // Example: await authStore.register(form);
    
    // Temporarily handle auto-login after successful signup
    await authStore.login(form.email, form.password);
    
    // Navigate to home after successful signup and login
    await navigateTo('/');
  } catch (error) {
    console.error('Signup failed:', error);
    alert('An error occurred during signup.');
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
  middleware: ['auth']
});
</script>
