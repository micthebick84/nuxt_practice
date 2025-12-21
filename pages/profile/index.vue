<template>
  <q-page padding>
    <div class="max-w-4xl mx-auto">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar size="100px" class="q-mr-md">
            <img v-if="userStore.hasAvatar" :src="userStore.userProfile?.avatarUrl" />
            <q-icon v-else name="person" size="60px" />
          </q-avatar>
          <div class="col">
            <div class="text-h5">{{ userStore.fullName }}</div>
            <div class="text-grey">{{ userStore.userProfile?.email }}</div>
            <div class="text-caption">{{ t('profile.joinDate') }}: {{ formatDate(userStore.userProfile?.joinDate) }}</div>
          </div>
          <q-btn flat icon="edit" :label="t('profile.edit')" @click="navigateTo('/profile/edit')" />
        </q-card-section>

        <q-separator />

        <q-tabs v-model="tab" class="text-primary">
          <q-tab name="general" :label="t('profile.general')" />
          <q-tab name="security" :label="t('profile.security')" />
          <q-tab name="settings" :label="t('profile.settings.title')" />
        </q-tabs>

        <q-tab-panels v-model="tab">
          <q-tab-panel name="general">
            <AvatarUpload :current-url="userStore.userProfile?.avatarUrl" @update="onAvatarUpdate" />
            <q-separator class="q-my-md" />
            <ProfileCard :profile="userStore.userProfile" />
          </q-tab-panel>
          <q-tab-panel name="security">
            <PasswordChangeForm @success="onPasswordChanged" />
          </q-tab-panel>
          <q-tab-panel name="settings">
            <SettingsPanel :profile="userStore.userProfile" @update="onSettingsUpdate" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <q-inner-loading :showing="userStore.loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { useAuthStore } from '~/stores/auth';
import AvatarUpload from '~/components/profile/AvatarUpload.vue';
import ProfileCard from '~/components/profile/ProfileCard.vue';
import PasswordChangeForm from '~/components/profile/PasswordChangeForm.vue';
import SettingsPanel from '~/components/profile/SettingsPanel.vue';

const { t } = useI18n();
const userStore = useUserStore();
const authStore = useAuthStore();
const tab = ref('general');

onMounted(async () => {
  if (authStore.user?.userId) {
    await userStore.fetchProfile(authStore.user.userId);
  }
});

const formatDate = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
};

const onPasswordChanged = () => {
  // Password changed successfully
};

const onAvatarUpdate = async (avatarUrl: string) => {
  if (authStore.user?.userId) {
    await userStore.fetchProfile(authStore.user.userId);
  }
};

const onSettingsUpdate = async (settings: any) => {
  // Settings updated successfully
};
</script>
