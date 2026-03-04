import { defineStore } from 'pinia';
import { useOAuthUrls } from '~/composables/useOAuthUrls';

interface User {
  id: string;
  userId: string;
  userName?: string;
  email?: string;
  deptName?: string;
}

interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
  tokenType?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false,
    tokens: null as OAuthTokens | null,
  }),

  getters: {
    accessToken: (state) => state.tokens?.accessToken,
    isTokenExpired: (state) => {
      if (!state.tokens?.expiresAt) return true;
      return Date.now() >= state.tokens.expiresAt;
    },
  },

  actions: {
    // Generate OAuth authorization URL (dynamically resolves host for IP access)
    getAuthorizationUrl(state?: string) {
      const config = useRuntimeConfig();
      const oauth = config.public.oauth;
      const oauthUrls = useOAuthUrls();

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: oauth.clientId,
        redirect_uri: oauthUrls.redirectUri,
        scope: oauth.scope,
        state: state || this.generateState(),
      });

      return `${oauthUrls.authorizationEndpoint}?${params.toString()}`;
    },

    // Generate random state for CSRF protection
    generateState() {
      const array = new Uint8Array(32);
      if (process.client) {
        crypto.getRandomValues(array);
        const state = Array.from(array, (byte) =>
          byte.toString(16).padStart(2, '0')
        ).join('');
        sessionStorage.setItem('oauth_state', state);
        return state;
      }
      return '';
    },

    // Validate state parameter
    validateState(state: string) {
      if (process.client) {
        const savedState = sessionStorage.getItem('oauth_state');
        sessionStorage.removeItem('oauth_state');
        return savedState === state;
      }
      return false;
    },

    // Exchange authorization code for tokens (called from server API)
    async exchangeCodeForTokens(code: string) {
      this.isLoading = true;
      try {
        // Send the actual redirect_uri used in the authorization request
        // so the token exchange matches (important for IP-based access)
        const oauthUrls = useOAuthUrls();
        const response = await $fetch<{
          access_token: string;
          refresh_token?: string;
          id_token?: string;
          expires_in?: number;
          token_type?: string;
        }>('/api/auth/oauth/token', {
          method: 'POST',
          body: { code, redirect_uri: oauthUrls.redirectUri },
        });

        const tokens: OAuthTokens = {
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          idToken: response.id_token,
          expiresAt: response.expires_in
            ? Date.now() + response.expires_in * 1000
            : undefined,
          tokenType: response.token_type,
        };

        this.tokens = tokens;
        this.isAuthenticated = true;

        if (process.client) {
          localStorage.setItem('oauth_tokens', JSON.stringify(tokens));
          localStorage.setItem('isAuthenticated', 'true');
          // Set auth cookie for server-side checking
          document.cookie = 'isAuthenticated=true; path=/; max-age=86400';
        }

        // Fetch user info after getting tokens
        await this.fetchUserInfo();

        return tokens;
      } catch (error) {
        console.error('Token exchange failed:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch user info from OAuth server or backend
    async fetchUserInfo() {
      if (!this.tokens?.accessToken) return null;

      try {
        const response = await $fetch<{ user: User }>('/api/auth/oauth/userinfo', {
          headers: {
            Authorization: `Bearer ${this.tokens.accessToken}`,
          },
        });

        if (response.user) {
          this.user = response.user;
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        }

        return response.user;
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        return null;
      }
    },

    // Legacy login method (kept for backwards compatibility)
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

    // Clear local auth state
    clearLocalAuth() {
      this.user = null;
      this.isAuthenticated = false;
      this.tokens = null;
      if (process.client) {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('oauth_tokens');
        sessionStorage.removeItem('oauth_state');
        // Clear auth cookie
        document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    },

    // Generate OAuth logout URL (dynamically resolves host for IP access)
    getLogoutUrl() {
      const oauthUrls = useOAuthUrls();

      const params = new URLSearchParams({
        post_logout_redirect_uri: `${oauthUrls.postLogoutRedirectUri}?logout=true`,
      });

      return `${oauthUrls.logoutEndpoint}?${params.toString()}`;
    },

    // Logout - revokes token on OAuth server and clears local state
    async logout() {
      // Save id_token before clearing for OIDC logout
      const idToken = this.tokens?.idToken;

      if (process.client && this.tokens?.accessToken) {
        try {
          // Call server API to revoke token on OAuth server
          await $fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.tokens.accessToken}`,
            },
          });
        } catch (error) {
          console.error('Token revocation failed:', error);
          // Continue with local logout even if server call fails
        }
      }

      this.clearLocalAuth();

      if (process.client) {
        // Use OIDC RP-Initiated Logout to clear OAuth server session
        // id_token_hint is REQUIRED by the OAuth server
        const config = useRuntimeConfig();
        const oauthUrls = useOAuthUrls();
        const authBase = oauthUrls.logoutEndpoint.replace('/logout', '');
        const logoutUrl = new URL(`${authBase}/connect/logout`);

        // id_token_hint is required for OIDC logout
        if (idToken) {
          logoutUrl.searchParams.set('id_token_hint', idToken);
          logoutUrl.searchParams.set('post_logout_redirect_uri', oauthUrls.postLogoutRedirectUri.replace('?logout=true', '/'));
          logoutUrl.searchParams.set('client_id', config.public.oauth.clientId);
          window.location.href = logoutUrl.toString();
        } else {
          // Fallback: if no id_token, just redirect to home
          sessionStorage.setItem('force_login', 'true');
          window.location.href = '/';
        }
      }
    },

    // Redirect to OAuth login
    redirectToLogin() {
      if (process.client) {
        const authUrl = this.getAuthorizationUrl();
        window.location.href = authUrl;
      }
    },

    // Restore login state on page refresh
    initializeAuth() {
      if (process.client) {
        const userStr = localStorage.getItem('user');
        const isAuthStr = localStorage.getItem('isAuthenticated');
        const tokensStr = localStorage.getItem('oauth_tokens');

        if (tokensStr) {
          try {
            this.tokens = JSON.parse(tokensStr);
          } catch {
            this.tokens = null;
          }
        }

        // If we have tokens and isAuthenticated flag, consider authenticated
        if (tokensStr && isAuthStr === 'true') {
          this.isAuthenticated = true;
          // Ensure cookie is set for server-side checking
          document.cookie = 'isAuthenticated=true; path=/; max-age=86400';
          if (userStr) {
            try {
              this.user = JSON.parse(userStr);
            } catch {
              this.user = null;
            }
          }
        } else {
          // Clear cookie if not authenticated
          document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      }
    },
  },
});
