import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // List of public pages (accessible without authentication)
  const publicPages = ['/login', '/signup', '/about'];

  // On server side, redirect to login if not a public page or root
  if (!process.client) {
    if (!publicPages.includes(to.path) && to.path !== '/') {
      return navigateTo('/login');
    }
    return;
  }

  // Initialize authentication state on client
  const authStore = useAuthStore();
  authStore.initializeAuth();

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
});
