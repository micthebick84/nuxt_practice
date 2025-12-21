<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="form.currentPassword"
      :label="t('profile.currentPassword')"
      type="password"
      :rules="[(v) => !!v || t('profile.validation.passwordRequired')]"
      outlined
    />
    <q-input
      v-model="form.newPassword"
      :label="t('profile.newPassword')"
      type="password"
      :rules="passwordRules"
      outlined
    >
      <template #hint>
        <PasswordStrengthIndicator :password="form.newPassword" />
      </template>
    </q-input>
    <q-input
      v-model="form.confirmPassword"
      :label="t('profile.confirmPassword')"
      type="password"
      :rules="confirmRules"
      outlined
    />
    <q-btn type="submit" color="primary" :label="t('profile.changePassword')" :loading="loading" />
  </q-form>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUserStore } from '~/stores/user';
import { useAuthStore } from '~/stores/auth';

const { t } = useI18n();
const $q = useQuasar();
const userStore = useUserStore();
const authStore = useAuthStore();

const emit = defineEmits<{ success: [] }>();
const loading = ref(false);

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const passwordRules = [
  (v: string) => !!v || t('profile.validation.passwordRequired'),
  (v: string) => v.length >= 8 || t('profile.validation.passwordLength'),
  (v: string) => /[A-Z]/.test(v) || t('profile.validation.passwordUppercase'),
  (v: string) => /[a-z]/.test(v) || t('profile.validation.passwordLowercase'),
  (v: string) => /\d/.test(v) || t('profile.validation.passwordNumber'),
];

const confirmRules = [
  (v: string) => v === form.newPassword || t('profile.messages.passwordMismatch'),
];

const onSubmit = async () => {
  loading.value = true;
  try {
    await userStore.changePassword(authStore.user!.userId, form);
    $q.notify({ type: 'positive', message: t('profile.messages.passwordChanged') });
    Object.assign(form, { currentPassword: '', newPassword: '', confirmPassword: '' });
    emit('success');
  } catch (error: any) {
    $q.notify({ type: 'negative', message: error.data?.statusMessage || t('profile.messages.invalidPassword') });
  } finally {
    loading.value = false;
  }
};
</script>
