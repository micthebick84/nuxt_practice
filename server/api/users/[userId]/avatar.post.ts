import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import pool from '../../../utils/db';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  const formData = await readMultipartFormData(event);

  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
  }

  const file = formData.find(f => f.name === 'avatar');
  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'Avatar file is required' });
  }

  // 파일 타입 검증
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type || '')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file type. Allowed: JPG, PNG, WebP' });
  }

  // 파일 크기 검증 (5MB)
  if (file.data.length > 5 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: 'File size exceeds 5MB limit' });
  }

  // 파일 저장
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
  await mkdir(uploadDir, { recursive: true });

  const ext = file.type?.split('/')[1] || 'jpg';
  const filename = `${userId}_${Date.now()}.${ext}`;
  const filePath = join(uploadDir, filename);

  await writeFile(filePath, file.data);

  const avatarUrl = `/uploads/avatars/${filename}`;

  // DB 업데이트
  await pool.query(`
    INSERT INTO user_profiles (user_id, avatar_url, updated_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) DO UPDATE SET avatar_url = $2, updated_at = CURRENT_TIMESTAMP
  `, [userId, avatarUrl]);

  return { success: true, avatarUrl };
});
