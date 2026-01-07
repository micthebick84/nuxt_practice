import { defineEventHandler, getHeader, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization header is required',
    });
  }

  const accessToken = authHeader.substring(7);
  const config = useRuntimeConfig();

  try {
    // Fetch user info from OAuth server's userinfo endpoint
    const userInfoEndpoint = config.public.oauth.authorizationEndpoint.replace(
      '/oauth2/authorize',
      '/userinfo'
    );

    const userInfo = await $fetch<{
      sub: string;
      name?: string;
      preferred_username?: string;
      email?: string;
    }>(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Map OAuth user info to our User format
    const user = {
      id: userInfo.sub,
      userId: userInfo.preferred_username || userInfo.sub,
      userName: userInfo.name,
      email: userInfo.email,
    };

    return { user };
  } catch (error: any) {
    console.error('User info fetch error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch user info',
    });
  }
});
