import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  
  // 인증 상태 초기화
  authStore.initializeAuth();
  
  // 공개 페이지 목록 (인증 없이 접근 가능)
  const publicPages = ['/login', '/signup'];
  const isPublicPage = publicPages.includes(to.path);
  
  // 인증되지 않은 사용자가 보호된 페이지에 접근하려는 경우
  if (!authStore.isAuthenticated && !isPublicPage) {
    // 현재 경로를 쿼리 파라미터로 전달하여 로그인 후 되돌아올 수 있도록 함
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
  
  // 루트 경로(/)는 인증 여부에 따라 리다이렉트
  if (to.path === '/') {
    return authStore.isAuthenticated ? true : navigateTo('/login');
  }
  
  // 이미 인증된 사용자가 로그인/회원가입 페이지에 접근하는 경우
  if (authStore.isAuthenticated && isPublicPage) {
    return navigateTo('/');
  }
  
  return true;
});
