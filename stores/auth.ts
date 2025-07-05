import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  name?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false
  }),
  
  actions: {
    async login(email: string, password: string) {
      this.isLoading = true;
      try {
        // Replace with actual authentication logic
        // Example: API call, then execute the code below on success
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store login state in localStorage (persist on refresh)
        const user = { id: '1', email, name: 'User' };
        this.user = user;
        this.isAuthenticated = true;
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
        }
        
        return user;
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
    }
  }
});
