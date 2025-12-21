import pool from '../../../utils/db';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  const result = await pool.query(`
    SELECT u.user_id, u.user_name, u.email, u.created_at as join_date, u.last_login,
           p.bio, p.phone, p.avatar_url, p.preferred_language,
           p.email_notifications, p.updated_at
    FROM com_user u
    LEFT JOIN user_profiles p ON u.user_id = p.user_id
    WHERE u.user_id = $1
  `, [userId]);

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  const row = result.rows[0];
  return {
    success: true,
    data: {
      id: row.id || 0,
      userId: row.user_id,
      userName: row.user_name,
      email: row.email,
      bio: row.bio,
      phone: row.phone,
      avatarUrl: row.avatar_url,
      preferredLanguage: row.preferred_language || 'en',
      emailNotifications: row.email_notifications ?? true,
      joinDate: row.join_date,
      lastLogin: row.last_login,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    },
  };
});
