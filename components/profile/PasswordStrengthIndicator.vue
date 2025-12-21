<template>
  <div v-if="password" class="password-strength">
    <q-linear-progress
      :value="strength / 3"
      :color="strengthColor"
      size="8px"
      class="q-mb-xs"
    />
    <div :class="`text-caption text-${strengthColor}`">
      {{ strengthText }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ password: string }>();
const { t } = useI18n();

const strength = computed(() => {
  const pwd = props.password;
  if (!pwd) return 0;

  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;

  return score;
});

const strengthColor = computed(() => {
  if (strength.value <= 1) return 'negative';
  if (strength.value === 2) return 'warning';
  return 'positive';
});

const strengthText = computed(() => {
  if (strength.value <= 1) return t('profile.passwordStrength.weak');
  if (strength.value === 2) return t('profile.passwordStrength.medium');
  return t('profile.passwordStrength.strong');
});
</script>
