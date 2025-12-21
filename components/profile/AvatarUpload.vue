<template>
  <div class="text-center">
    <q-avatar size="150px" class="q-mb-md cursor-pointer" @click="triggerUpload">
      <img v-if="previewUrl || currentUrl" :src="previewUrl || currentUrl" />
      <q-icon v-else name="person" size="80px" />
      <q-badge floating color="primary" rounded>
        <q-icon name="edit" size="xs" />
      </q-badge>
    </q-avatar>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden"
      @change="onFileSelected"
    />

    <div class="q-gutter-sm">
      <q-btn v-if="selectedFile" color="primary" :label="t('profile.uploadAvatar')" :loading="loading" @click="uploadAvatar" />
      <q-btn v-if="currentUrl" flat color="negative" :label="t('profile.removeAvatar')" @click="removeAvatar" />
    </div>

    <div class="text-caption q-mt-sm text-grey">최대 5MB, JPG/PNG/WebP</div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUserStore } from '~/stores/user';
import { useAuthStore } from '~/stores/auth';

const props = defineProps<{ currentUrl?: string }>();
const emit = defineEmits<{ update: [url: string] }>();

const { t } = useI18n();
const $q = useQuasar();
const userStore = useUserStore();
const authStore = useAuthStore();

const fileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const previewUrl = ref('');
const loading = ref(false);

const triggerUpload = () => fileInput.value?.click();

const onFileSelected = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      $q.notify({ type: 'negative', message: 'File size exceeds 5MB' });
      return;
    }
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const uploadAvatar = async () => {
  if (!selectedFile.value) return;
  loading.value = true;
  try {
    const result = await userStore.uploadAvatar(authStore.user!.userId, selectedFile.value);
    emit('update', result.avatarUrl);
    $q.notify({ type: 'positive', message: 'Avatar uploaded successfully' });
    selectedFile.value = null;
    previewUrl.value = '';
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to upload avatar' });
  } finally {
    loading.value = false;
  }
};

const removeAvatar = async () => {
  // 아바타 제거 로직 (추후 구현)
  $q.notify({ type: 'info', message: 'Remove avatar feature coming soon' });
};
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
