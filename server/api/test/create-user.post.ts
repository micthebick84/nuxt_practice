import oracleDb from '../../utils/oracleDb';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, userName, email, phone, password } = body;

  if (!userId || !userName || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'userId, userName, and password are required',
    });
  }

  try {
    // Insert new user
    await oracleDb.query(`
      INSERT INTO COM_USER (
        USER_ID,
        USER_NAME,
        EMAIL,
        CELL_TEL,
        PASSWORD,
        USE_FLAG,
        PASS_DATE,
        PASS_CHG_DATE
      ) VALUES (
        :1, :2, :3, :4, :5, 1, SYSTIMESTAMP, SYSTIMESTAMP
      )
    `, [userId, userName, email, phone, password]);

    return {
      success: true,
      message: 'User created successfully',
      data: { userId, userName, email, phone },
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create user',
    });
  }
});
