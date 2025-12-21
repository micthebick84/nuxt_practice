export interface UserProfile {
  id: number;
  userId: string;
  userName?: string;
  email?: string;
  bio?: string;
  phone?: string;
  avatarUrl?: string;
  preferredLanguage: 'en' | 'ko';
  emailNotifications: boolean;
  joinDate?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  bio?: string;
  phone?: string;
  preferredLanguage?: 'en' | 'ko';
  emailNotifications?: boolean;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
