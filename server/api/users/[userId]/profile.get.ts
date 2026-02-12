import pool from '../../../utils/db';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  const result = await pool.query(`
    SELECT
      u.user_id,
      u.user_name,
      u.email,
      u.cell_tel as phone,
      u.pass_date as join_date,
      u.pass_chg_date as updated_at,
      p.bio,
      p.avatar_url,
      'ko' as preferred_language,
      1 as email_notifications,
      NULL as last_login
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
      id: 0,
      userId: row.user_id,
      userName: row.user_name,
      email: row.email,
      bio: row.bio,
      phone: row.phone,
      avatarUrl: row.avatar_url,
      preferredLanguage: row.preferred_language || 'ko',
      emailNotifications: row.email_notifications === 1,
      joinDate: row.join_date,
      lastLogin: row.last_login,
      createdAt: row.join_date || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    },
  };
});
