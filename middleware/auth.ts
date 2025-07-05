import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // Only run auth logic on client
  if (!process.client) return

  // Initialize authentication state
  const authStore = useAuthStore();
  authStore.initializeAuth();
  
  // List of public pages (accessible without authentication)
  const publicPages = ['/login', '/signup', '/about'];
  
  if (!authStore.isAuthenticated && !publicPages.includes(to.path)) {
    return navigateTo('/login');
  }
  
  // Root path (/) redirects based on authentication status
  if (to.path === '/' && authStore.isAuthenticated) {
    return navigateTo('/course');
  }
  
  // Redirect authenticated users away from login/signup pages
  if (authStore.isAuthenticated && publicPages.includes(to.path)) {
    return navigateTo('/');
  }
  
  return true;
});
