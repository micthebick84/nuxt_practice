import pool from '../../../utils/db';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  const body = await readBody(event);
  const { name, bio, phone, preferredLanguage, emailNotifications } = body;

  // Update com_user if name changed
  if (name) {
    await pool.query(
      'UPDATE com_user SET user_name = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      [name, userId]
    );
  }

  // Upsert user_profiles
  await pool.query(`
    INSERT INTO user_profiles (user_id, bio, phone, preferred_language, email_notifications, updated_at)
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) DO UPDATE SET
      bio = COALESCE($2, user_profiles.bio),
      phone = COALESCE($3, user_profiles.phone),
      preferred_language = COALESCE($4, user_profiles.preferred_language),
      email_notifications = COALESCE($5, user_profiles.email_notifications),
      updated_at = CURRENT_TIMESTAMP
  `, [userId, bio, phone, preferredLanguage, emailNotifications]);

  // Fetch updated profile
  const result = await pool.query(`
    SELECT u.user_id, u.user_name, u.email, u.created_at as join_date, u.last_login,
           p.bio, p.phone, p.avatar_url, p.preferred_language,
           p.email_notifications, p.updated_at
    FROM com_user u
    LEFT JOIN user_profiles p ON u.user_id = p.user_id
    WHERE u.user_id = $1
  `, [userId]);

  const row = result.rows[0];

  return {
    success: true,
    message: 'Profile updated successfully',
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
