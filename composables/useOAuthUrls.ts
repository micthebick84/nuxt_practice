/**
 * Dynamically resolve OAuth URLs based on the current browser hostname.
 * When accessed via IP (e.g., 10.1.1.75:3000), OAuth endpoints must also use
 * the IP so the browser can reach the auth server.
 * Server-side token exchange always uses localhost (same machine).
 */
export function useOAuthUrls() {
  const config = useRuntimeConfig();
  const oauth = config.public.oauth;

  function getHostname(): string {
    if (process.client) {
      return window.location.hostname;
    }
    // SSR: read from request headers
    try {
      const headers = useRequestHeaders(['host']);
      const host = headers.host || '';
      return host.split(':')[0] || 'localhost';
    } catch {
      return 'localhost';
    }
  }

  function replaceHost(url: string, hostname: string): string {
    if (hostname === 'localhost' || hostname === '127.0.0.1') return url;
    return url.replace(/localhost/g, hostname);
  }

  const hostname = getHostname();

  return {
    /** Browser-facing: auth server authorize page */
    authorizationEndpoint: replaceHost(oauth.authorizationEndpoint, hostname),
    /** Server-side only: kept as localhost (Nuxt server -> auth server on same machine) */
    tokenEndpoint: oauth.tokenEndpoint,
    /** Browser-facing: where auth server redirects back to */
    redirectUri: replaceHost(oauth.redirectUri, hostname),
    /** Browser-facing: auth server logout */
    logoutEndpoint: replaceHost(oauth.logoutEndpoint, hostname),
    /** Browser-facing: post-logout redirect */
    postLogoutRedirectUri: replaceHost(oauth.postLogoutRedirectUri, hostname),
    /** Original static config (for server-side use) */
    raw: oauth,
  };
}
