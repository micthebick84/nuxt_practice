<template>
  <div class="q-pa-md">
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label caption>{{ t('profile.name') }}</q-item-label>
          <q-item-label>{{ profile?.userName || '-' }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label caption>{{ t('profile.email') }}</q-item-label>
          <q-item-label>{{ profile?.email || '-' }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label caption>{{ t('profile.bio') }}</q-item-label>
          <q-item-label>{{ profile?.bio || '-' }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label caption>{{ t('profile.phone') }}</q-item-label>
          <q-item-label>{{ profile?.phone || '-' }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import type { UserProfile } from '~/types/profile';

defineProps<{ profile: UserProfile | null }>();
const { t } = useI18n();
</script>
