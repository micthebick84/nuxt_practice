import { defineStore } from 'pinia';

type User = {
  email: string;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null as User | null,
  }),
  
  actions: {
    login(email: string, password: string) {
      // 실제 인증 로직으로 대체하세요
      // 예: API 호출 후 성공 시 아래 코드 실행
      this.isAuthenticated = true;
      this.user = { email };
      
      // 로그인 상태를 localStorage에 저장 (새로고침 시 유지)
      if (process.client) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ email }));
      }
      
      return true;
    },
    
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      
      if (process.client) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      }
    },
    
    // 페이지 새로고침 시 로그인 상태 복원
    initializeAuth() {
      if (process.client) {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const user = localStorage.getItem('user');
        
        if (isAuthenticated && user) {
          this.isAuthenticated = true;
          this.user = JSON.parse(user);
        }
      }
    }
  }
});
