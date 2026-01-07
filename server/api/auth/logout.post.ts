import { defineEventHandler, getHeader, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization header with Bearer token is required',
    });
  }

  const accessToken = authHeader.substring(7);

  try {
    // Call OAuth server logout endpoint
    const response = await $fetch<{
      success: boolean;
      message: string;
      data?: {
        revoked: boolean;
        message: string;
      };
    }>('http://localhost:9000/api/auth/logout/bearer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    // Even if the server returns an error, we consider logout successful
    // because the local state will be cleared anyway
    return {
      success: true,
      message: 'Local logout completed',
      data: {
        revoked: false,
        message: error.message || 'Token revocation failed, but local logout completed',
      },
    };
  }
});
