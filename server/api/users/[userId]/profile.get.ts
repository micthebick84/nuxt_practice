import oracleDb from '../../../utils/oracleDb';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

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
