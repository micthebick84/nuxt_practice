<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?
          <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            로그인
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">이메일 주소</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="이메일 주소"
            />
          </div>
          <div>
            <label for="password" class="sr-only">비밀번호</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="비밀번호"
            />
          </div>
          <div>
            <label for="password-confirm" class="sr-only">비밀번호 확인</label>
            <input
              id="password-confirm"
              v-model="form.passwordConfirm"
              name="password-confirm"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="비밀번호 확인"
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
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">이용약관</a> 및
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">개인정보처리방침</a>에 동의합니다
          </label>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="!formValid"
          >
            가입하기
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

const router = useRouter();

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
    // 여기에 회원가입 API 호출 로직 추가
    // 예: await authStore.register(form);
    
    // 임시로 회원가입 성공 후 자동 로그인 처리
    await authStore.login(form.email, form.password);
    
    // 회원가입 및 로그인 성공 시 홈으로 이동
    await navigateTo('/');
  } catch (error) {
    console.error('회원가입 실패:', error);
    alert('회원가입 중 오류가 발생했습니다.');
  }
};

// 이미 로그인한 사용자는 회원가입 페이지에 접근하지 못하도록
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
