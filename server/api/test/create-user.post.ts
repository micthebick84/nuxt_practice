import pool from '../../utils/db';

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
    await pool.query(`
      INSERT INTO com_user (
        user_id,
        user_name,
        email,
        cell_tel,
        password,
        use_flag,
        pass_date,
        pass_chg_date
      ) VALUES (
        $1, $2, $3, $4, $5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
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
