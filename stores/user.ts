import type { UserProfile, ProfileUpdateRequest, PasswordChangeRequest } from '~/types/profile';

export const useUserStore = defineStore('user', {
  state: () => ({
    userProfile: null as UserProfile | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    fullName: (state) => state.userProfile?.userName || '',
    hasAvatar: (state) => !!state.userProfile?.avatarUrl,
    profileCompleteness: (state) => {
      if (!state.userProfile) return 0;
      const fields = ['userName', 'bio', 'phone', 'avatarUrl'];
      const filled = fields.filter(f => state.userProfile?.[f as keyof UserProfile]);
      return Math.round((filled.length / fields.length) * 100);
    },
  },

  actions: {
    async fetchProfile(userId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch<{ success: boolean; data: UserProfile }>(
          `/api/users/${userId}/profile`
        );
        if (response.success) {
          this.userProfile = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(userId: string, data: ProfileUpdateRequest) {
      this.loading = true;
      try {
        const response = await $fetch<{ success: boolean; data: UserProfile }>(`/api/users/${userId}/profile`, {
          method: 'PUT',
          body: data,
        });
        if (response.success) {
          this.userProfile = { ...this.userProfile, ...response.data } as UserProfile;
        }
        return response;
      } finally {
        this.loading = false;
      }
    },

    async changePassword(userId: string, data: PasswordChangeRequest) {
      this.loading = true;
      try {
        return await $fetch<{ success: boolean; message: string }>(`/api/users/${userId}/password` as string, {
          method: 'PUT',
          body: data,
        });
      } finally {
        this.loading = false;
      }
    },

    async uploadAvatar(userId: string, file: File) {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await $fetch<{ success: boolean; avatarUrl: string }>(`/api/users/${userId}/avatar`, {
        method: 'POST',
        body: formData,
      });
      if (response.success) {
        this.userProfile = { ...this.userProfile, avatarUrl: response.avatarUrl } as UserProfile;
      }
      return response;
    },

    async deleteAccount(userId: string, password: string) {
      return await $fetch<{ success: boolean; message: string }>(`/api/users/${userId}` as string, {
        method: 'DELETE',
        body: { password },
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
