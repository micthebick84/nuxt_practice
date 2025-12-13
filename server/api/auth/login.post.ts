import bcrypt from 'bcryptjs';
import pool from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, password } = body;

  if (!userId || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID and password are required',
    });
  }

  try {
    // Find user by user_id
    const result = await pool.query(
      `SELECT user_id, password, user_name, email, dept_name, use_flag
       FROM com_user
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid user ID or password',
      });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.use_flag) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Account is disabled',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Update password error count
      await pool.query(
        `UPDATE com_user SET pass_err_cnt = COALESCE(pass_err_cnt, 0) + 1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1`,
        [userId]
      );

      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid user ID or password',
      });
    }

    // Reset password error count on successful login
    await pool.query(
      `UPDATE com_user SET pass_err_cnt = 0, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1`,
      [userId]
    );

    // Record login history
    await pool.query(
      `INSERT INTO com_user_history (user_id, login_date, login_ip)
       VALUES ($1, CURRENT_TIMESTAMP, $2)`,
      [userId, getRequestIP(event) || 'unknown']
    );

    return {
      success: true,
      user: {
        id: user.user_id,
        userId: user.user_id,
        userName: user.user_name,
        email: user.email,
        deptName: user.dept_name,
      },
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    console.error('Login error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
