import { useAuthStore } from '~/stores/auth';
import { useOAuthUrls } from '~/composables/useOAuthUrls';

export default defineNuxtRouteMiddleware((to) => {
  // List of public pages (accessible without authentication)
  const publicPages = ['/login', '/signup', '/auth/callback', '/about', '/dashboard/traffic'];
  const config = useRuntimeConfig();
  const oauthUrls = useOAuthUrls();

  // Build OAuth authorization URL, optionally encoding a post-login redirect path in state
  const buildOAuthUrl = (redirectPath?: string) => {
    const oauth = config.public.oauth;
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: oauth.clientId,
      redirect_uri: oauthUrls.redirectUri,
      scope: oauth.scope,
    });
    if (redirectPath) {
      params.set('state', encodeURIComponent(redirectPath));
    }
    return `${oauthUrls.authorizationEndpoint}?${params.toString()}`;
  };

  // On server side, check cookie for authentication
  if (!process.client) {
    // Read cookies directly from request headers (more reliable than useCookie in middleware)
    const headers = useRequestHeaders(['cookie']);
    const cookieStr = headers.cookie || '';
    const hasAuthSession = cookieStr.includes('auth_session=true');
    const hasIsAuthenticated = cookieStr.includes('isAuthenticated=true');
    const isAuthenticated = hasAuthSession || hasIsAuthenticated;

    // Unauthenticated users accessing protected pages -> redirect to OAuth
    if (!isAuthenticated && !publicPages.includes(to.path)) {
      // Skip redirect for logout callback
      if (to.query.logout === 'true') {
        return navigateTo('/login?logout=true');
      }
      return navigateTo(buildOAuthUrl(to.fullPath), { external: true });
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
    if (process.client) {
      sessionStorage.setItem('oauth_redirect', to.fullPath);
    }
    return navigateTo(buildOAuthUrl(to.fullPath), { external: true });
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
