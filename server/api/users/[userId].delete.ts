import bcrypt from 'bcryptjs';
import pool from '../../utils/db';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  const { password } = await readBody(event);

  if (!password) {
    throw createError({ statusCode: 400, statusMessage: 'Password is required' });
  }

  // 비밀번호 확인
  const result = await pool.query(
    'SELECT password FROM com_user WHERE user_id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  const isValid = await bcrypt.compare(password, result.rows[0].password);
  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid password' });
  }

  // 계정 삭제 (CASCADE로 user_profiles도 함께 삭제)
  await pool.query('DELETE FROM com_user WHERE user_id = $1', [userId]);

  return { success: true, message: 'Account deleted successfully' };
});
