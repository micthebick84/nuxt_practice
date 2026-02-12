import pool from '../../../utils/db';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  const body = await readBody(event);
  const { name, phone, bio } = body;

  // Build dynamic UPDATE query based on provided fields
  const updateFields: string[] = [];
  const updateValues: any[] = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updateFields.push(`user_name = $${paramIndex}`);
    updateValues.push(name);
    paramIndex++;
  }

  if (phone !== undefined) {
    updateFields.push(`cell_tel = $${paramIndex}`);
    updateValues.push(phone);
    paramIndex++;
  }

  // Always update the timestamp
  updateFields.push('pass_chg_date = CURRENT_TIMESTAMP');

  // Add userId as the last parameter for WHERE clause
  updateValues.push(userId);

  if (updateFields.length > 1) { // More than just timestamp
    const updateQuery = `
      UPDATE com_user
      SET ${updateFields.join(', ')}
      WHERE user_id = $${paramIndex}
    `;

    await pool.query(updateQuery, updateValues);
  }

  // Update bio in user_profiles table
  if (bio !== undefined) {
    await pool.query(`
      INSERT INTO user_profiles (user_id, bio, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET bio = $2, updated_at = CURRENT_TIMESTAMP
    `, [userId, bio]);
  }

  // Fetch updated profile
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
    message: 'Profile updated successfully',
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
