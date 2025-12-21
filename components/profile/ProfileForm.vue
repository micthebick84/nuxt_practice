<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="form.name"
      :label="t('profile.name')"
      :rules="nameRules"
      outlined
    />
    <q-input
      v-model="form.bio"
      :label="t('profile.bio')"
      type="textarea"
      :rules="bioRules"
      outlined
      counter
      maxlength="500"
    />
    <q-input
      v-model="form.phone"
      :label="t('profile.phone')"
      :rules="phoneRules"
      outlined
    />
    <div class="row q-gutter-sm">
      <q-btn type="submit" color="primary" :label="t('profile.save')" :loading="loading" />
      <q-btn flat :label="t('profile.cancel')" @click="emit('cancel')" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { UserProfile } from '~/types/profile';

const props = defineProps<{ profile: UserProfile | null; loading?: boolean }>();
const emit = defineEmits<{ submit: [data: any]; cancel: [] }>();
const { t } = useI18n();

const form = reactive({
  name: props.profile?.userName || '',
  bio: props.profile?.bio || '',
  phone: props.profile?.phone || '',
});

watch(() => props.profile, (newProfile) => {
  if (newProfile) {
    form.name = newProfile.userName || '';
    form.bio = newProfile.bio || '';
    form.phone = newProfile.phone || '';
  }
}, { immediate: true });

const nameRules = [
  (val: string) => !!val || t('profile.validation.nameRequired'),
  (val: string) => (val.length >= 2 && val.length <= 50) || t('profile.validation.nameLength'),
];

const bioRules = [
  (val: string) => !val || val.length <= 500 || t('profile.validation.bioLength'),
];

const phoneRules = [
  (val: string) => !val || /^[\d\s-()]+$/.test(val) || t('profile.validation.phoneInvalid'),
];

const onSubmit = () => emit('submit', { ...form });
</script>
