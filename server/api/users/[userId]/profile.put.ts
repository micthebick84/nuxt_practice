import oracleDb from '../../../utils/oracleDb';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  const body = await readBody(event);
  const { name, phone } = body;

  // Build dynamic UPDATE query based on provided fields
  const updateFields: string[] = [];
  const updateValues: any[] = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updateFields.push(`USER_NAME = :${paramIndex}`);
    updateValues.push(name);
    paramIndex++;
  }

  if (phone !== undefined) {
    updateFields.push(`CELL_TEL = :${paramIndex}`);
    updateValues.push(phone);
    paramIndex++;
  }

  // Always update the timestamp
  updateFields.push('PASS_CHG_DATE = SYSTIMESTAMP');

  // Add userId as the last parameter for WHERE clause
  updateValues.push(userId);

  if (updateFields.length > 1) { // More than just timestamp
    const updateQuery = `
      UPDATE COM_USER
      SET ${updateFields.join(', ')}
      WHERE USER_ID = :${paramIndex}
    `;

    await oracleDb.query(updateQuery, updateValues);
  }

  // Fetch updated profile
  const result = await oracleDb.query(`
    SELECT
      USER_ID,
      USER_NAME,
      EMAIL,
      CELL_TEL as PHONE,
      PASS_DATE as JOIN_DATE,
      PASS_CHG_DATE as UPDATED_AT,
      NULL as BIO,
      NULL as AVATAR_URL,
      'ko' as PREFERRED_LANGUAGE,
      1 as EMAIL_NOTIFICATIONS,
      NULL as LAST_LOGIN
    FROM COM_USER
    WHERE USER_ID = :1
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
      userId: row.USER_ID,
      userName: row.USER_NAME,
      email: row.EMAIL,
      bio: row.BIO,
      phone: row.PHONE,
      avatarUrl: row.AVATAR_URL,
      preferredLanguage: row.PREFERRED_LANGUAGE || 'ko',
      emailNotifications: row.EMAIL_NOTIFICATIONS === 1,
      joinDate: row.JOIN_DATE,
      lastLogin: row.LAST_LOGIN,
      createdAt: row.JOIN_DATE || new Date().toISOString(),
      updatedAt: row.UPDATED_AT || new Date().toISOString(),
    },
  };
});
