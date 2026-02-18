import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // List of public pages (accessible without authentication)
  const publicPages = ['/login', '/signup', '/auth/callback', '/about', '/dashboard/traffic'];
  const config = useRuntimeConfig();

  // Build OAuth authorization URL
  const buildOAuthUrl = () => {
    const oauth = config.public.oauth;
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: oauth.clientId,
      redirect_uri: oauth.redirectUri,
      scope: oauth.scope,
    });
    return `${oauth.authorizationEndpoint}?${params.toString()}`;
  };

  // On server side, check cookie for authentication
  if (!process.client) {
    const cookie = useCookie('isAuthenticated');
    const isAuthenticated = cookie.value === 'true';

    // Unauthenticated users accessing protected pages -> redirect to OAuth
    if (!isAuthenticated && !publicPages.includes(to.path)) {
      // Skip redirect for logout callback
      if (to.query.logout === 'true') {
        return navigateTo('/login?logout=true');
      }
      return navigateTo(buildOAuthUrl(), { external: true });
    }

    // Authenticated users accessing login/signup -> redirect to course
    if (isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
      return navigateTo('/course');
    }

    // Root path for authenticated users -> redirect to course
    if (isAuthenticated && to.path === '/') {
      return navigateTo('/course');
    }

    return;
  }

  // Client side: Initialize authentication state
  const authStore = useAuthStore();
  authStore.initializeAuth();

  // Unauthenticated users trying to access protected pages -> redirect to OAuth
  if (!authStore.isAuthenticated && !publicPages.includes(to.path)) {
    // Skip redirect for logout callback
    if (to.query.logout === 'true') {
      return navigateTo('/login?logout=true');
    }
    return navigateTo(buildOAuthUrl(), { external: true });
  }

  // Root path (/) redirects based on authentication status
  if (to.path === '/' && authStore.isAuthenticated) {
    return navigateTo('/course');
  }

  // Redirect authenticated users away from login/signup pages to course page
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/course');
  }
});
