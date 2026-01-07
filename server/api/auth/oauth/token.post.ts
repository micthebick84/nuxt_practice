import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  console.log('=== Token exchange API called ===');
  const body = await readBody(event);
  const { code } = body;
  console.log('Token exchange - code received:', code ? 'yes' : 'no');

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Authorization code is required',
    });
  }

  const config = useRuntimeConfig();
  const oauth = config.public.oauth;
  const clientSecret = config.oauth.clientSecret;

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
        redirect_uri: oauth.redirectUri,
      }).toString(),
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
