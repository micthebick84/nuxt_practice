<template>
  <q-page padding>
    <div class="max-w-2xl mx-auto">
      <q-card>
        <q-card-section>
          <div class="text-h5">{{ t('profile.edit') }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <ProfileForm
            :profile="userStore.userProfile"
            :loading="userStore.loading"
            @submit="handleSubmit"
            @cancel="navigateTo('/profile')"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUserStore } from '~/stores/user';
import { useAuthStore } from '~/stores/auth';

const $q = useQuasar();
const { t } = useI18n();
const userStore = useUserStore();
const authStore = useAuthStore();

const handleSubmit = async (data: any) => {
  try {
    await userStore.updateProfile(authStore.user!.userId, data);
    $q.notify({ type: 'positive', message: t('profile.messages.updateSuccess') });
    navigateTo('/profile');
  } catch (error) {
    $q.notify({ type: 'negative', message: t('profile.messages.updateError') });
  }
};
</script>
