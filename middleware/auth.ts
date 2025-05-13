import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  
  // 인증 상태 초기화
  authStore.initializeAuth();
  
  // 인증이 필요한 페이지 목록 (로그인, 회원가입 제외)
  const publicPages = ['/login', '/signup'];
  const isPublicPage = publicPages.includes(to.path);
  
  // 인증되지 않은 사용자가 보호된 페이지에 접근하려는 경우
  if (!authStore.isAuthenticated && !isPublicPage) {
    return navigateTo('/login');
  }
  
  // 이미 인증된 사용자가 로그인/회원가입 페이지에 접근하는 경우
  if (authStore.isAuthenticated && isPublicPage) {
    return navigateTo('/');
  }
});
