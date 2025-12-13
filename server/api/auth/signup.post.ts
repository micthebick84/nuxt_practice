import bcrypt from 'bcryptjs';
import pool from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, password, userName } = body;

  if (!userId || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID and password are required',
    });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT user_id FROM com_user WHERE user_id = $1',
      [userId]
    );

    if (existingUser.rows.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User ID already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO com_user (user_id, password, user_name, pw_salt, use_flag, created_at, updated_at)
       VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING user_id, user_name`,
      [userId, hashedPassword, userName || userId, salt]
    );

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        userId: result.rows[0].user_id,
        userName: result.rows[0].user_name,
      },
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    console.error('Signup error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
