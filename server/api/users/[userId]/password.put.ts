import bcrypt from 'bcryptjs';
import pool from '../../../utils/db';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  const { currentPassword, newPassword } = await readBody(event);

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, statusMessage: 'Current and new password are required' });
  }

  // 현재 비밀번호 확인
  const result = await pool.query(
    'SELECT password FROM com_user WHERE user_id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  const isValid = await bcrypt.compare(currentPassword, result.rows[0].password);
  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Current password is incorrect' });
  }

  // 새 비밀번호 해싱 및 업데이트
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await pool.query(
    'UPDATE com_user SET password = $1, pw_salt = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3',
    [hashedPassword, salt, userId]
  );

  return { success: true, message: 'Password changed successfully' };
});
