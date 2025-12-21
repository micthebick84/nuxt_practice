<template>
  <div class="q-gutter-md">
    <!-- 언어 설정 -->
    <q-item>
      <q-item-section>
        <q-item-label>{{ t('profile.settings.language') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-select
          v-model="settings.preferredLanguage"
          :options="languageOptions"
          emit-value
          map-options
          dense
          outlined
          style="min-width: 150px"
          @update:model-value="onSettingChange"
        />
      </q-item-section>
    </q-item>

    <q-separator />

    <!-- 이메일 알림 -->
    <q-item>
      <q-item-section>
        <q-item-label>{{ t('profile.settings.notifications') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-toggle v-model="settings.emailNotifications" @update:model-value="onSettingChange" />
      </q-item-section>
    </q-item>

    <q-separator />

    <!-- 계정 삭제 -->
    <q-item class="text-negative">
      <q-item-section>
        <q-item-label>{{ t('profile.deleteAccount') }}</q-item-label>
        <q-item-label caption>{{ t('profile.deleteConfirm') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn flat color="negative" label="삭제" @click="showDeleteDialog = true" />
      </q-item-section>
    </q-item>

    <!-- 계정 삭제 확인 다이얼로그 -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ t('profile.deleteAccount') }}</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="deletePassword"
            :label="t('profile.currentPassword')"
            type="password"
            outlined
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="t('profile.cancel')" v-close-popup />
          <q-btn flat color="negative" label="삭제" :loading="deleting" @click="deleteAccount" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUserStore } from '~/stores/user';
import { useAuthStore } from '~/stores/auth';
import type { UserProfile } from '~/types/profile';

const props = defineProps<{ profile: UserProfile | null }>();
const emit = defineEmits<{ update: [settings: any] }>();

const { t, locale } = useI18n();
const $q = useQuasar();
const userStore = useUserStore();
const authStore = useAuthStore();

const settings = reactive({
  preferredLanguage: props.profile?.preferredLanguage || 'en',
  emailNotifications: props.profile?.emailNotifications ?? true,
});

watch(() => props.profile, (newProfile) => {
  if (newProfile) {
    settings.preferredLanguage = newProfile.preferredLanguage || 'en';
    settings.emailNotifications = newProfile.emailNotifications ?? true;
  }
}, { immediate: true });

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: '한국어', value: 'ko' },
];

const showDeleteDialog = ref(false);
const deletePassword = ref('');
const deleting = ref(false);

const onSettingChange = async () => {
  try {
    await userStore.updateProfile(authStore.user!.userId, settings);
    // 언어 변경 시 전역 locale도 업데이트
    if (settings.preferredLanguage) {
      locale.value = settings.preferredLanguage;
    }
    emit('update', settings);
    $q.notify({ type: 'positive', message: t('profile.messages.updateSuccess') });
  } catch (error) {
    $q.notify({ type: 'negative', message: t('profile.messages.updateError') });
  }
};

const deleteAccount = async () => {
  deleting.value = true;
  try {
    await userStore.deleteAccount(authStore.user!.userId, deletePassword.value);
    $q.notify({ type: 'positive', message: 'Account deleted successfully' });
    authStore.logout();
    navigateTo('/login');
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to delete account. Please check your password.' });
  } finally {
    deleting.value = false;
  }
};
</script>
