import { defineEventHandler, readBody, createError, setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { code, redirect_uri: clientRedirectUri } = body;

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Authorization code is required',
    });
  }

  const config = useRuntimeConfig();
  const oauth = config.public.oauth;
  const clientSecret = config.oauth.clientSecret;

  // Use the redirect_uri that was actually used in the authorization request
  // (important when accessing via IP instead of localhost)
  const redirectUri = clientRedirectUri || oauth.redirectUri;

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await $fetch<{
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
      token_type?: string;
      scope?: string;
    }>(oauth.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${oauth.clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    // Set httpOnly cookie so SSR middleware can detect auth state reliably
    const maxAge = tokenResponse.expires_in || 3600;
    setCookie(event, 'auth_session', 'true', {
      httpOnly: true,
      secure: false,
      path: '/',
      maxAge,
      sameSite: 'lax' as const,
    });

    return tokenResponse;
  } catch (error: any) {
    console.error('Token exchange error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to exchange authorization code',
    });
  }
});
