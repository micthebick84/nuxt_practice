import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // Only run auth logic on client
  if (!process.client) return;

  // Initialize authentication state
  const authStore = useAuthStore();
  authStore.initializeAuth();

  // List of public pages (accessible without authentication)
  const publicPages = ['/login', '/signup', '/about'];

  // Unauthenticated users trying to access protected pages -> redirect to login
  if (!authStore.isAuthenticated && !publicPages.includes(to.path)) {
    return navigateTo('/login');
  }

  // Redirect authenticated users away from login/signup pages to course page
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/course');
  }

  return true;
});
