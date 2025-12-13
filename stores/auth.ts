import { defineStore } from 'pinia';

interface User {
  id: string;
  userId: string;
  userName?: string;
  email?: string;
  deptName?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false,
  }),

  actions: {
    async login(userId: string, password: string) {
      this.isLoading = true;
      try {
        const response = await $fetch<{ success: boolean; user: User }>(
          '/api/auth/login',
          {
            method: 'POST',
            body: { userId, password },
          }
        );

        if (response.success && response.user) {
          this.user = response.user;
          this.isAuthenticated = true;
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('isAuthenticated', 'true');
          }
          return response.user;
        }

        throw new Error('Login failed');
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async signup(userId: string, password: string, userName?: string) {
      this.isLoading = true;
      try {
        const response = await $fetch<{
          success: boolean;
          user: { userId: string; userName: string };
        }>('/api/auth/signup', {
          method: 'POST',
          body: { userId, password, userName },
        });

        return response;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      if (process.client) {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    },

    // Restore login state on page refresh
    initializeAuth() {
      if (process.client) {
        const userStr = localStorage.getItem('user');
        const isAuthStr = localStorage.getItem('isAuthenticated');

        if (userStr && isAuthStr === 'true') {
          this.user = JSON.parse(userStr);
          this.isAuthenticated = true;
        }
      }
    },
  },
});
