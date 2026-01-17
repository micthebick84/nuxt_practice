<template>
  <div>
    <q-item
      class="language-selector"
      @click.stop="toggleLanguageMenu"
    >
      <q-item-section avatar>
        <q-btn
          flat
          dense
          round
          icon="language"
          @click.stop="toggleLanguageMenu"
        />
      </q-item-section>

      <q-item-section v-if="!miniMode" @click.stop="toggleLanguageMenu" style="cursor: pointer;">
        <q-item-label>{{ t('menu.language') }}</q-item-label>
        <q-item-label caption class="text-weight-bold text-primary">{{ currentLanguageName }}</q-item-label>
      </q-item-section>

      <q-item-section side v-if="!miniMode">
        <q-btn
          flat
          dense
          round
          :icon="showLanguageMenu ? 'expand_less' : 'expand_more'"
          @click.stop="toggleLanguageMenu"
        />
      </q-item-section>

      <q-tooltip
        v-if="miniMode"
        anchor="center right"
        self="center left"
        :offset="[10, 0]"
      >
        {{ t('menu.language') }}: {{ currentLanguageName }}
      </q-tooltip>
    </q-item>

    <!-- Language Options as separate items -->
    <div v-if="showLanguageMenu && !miniMode" class="language-options">
      <q-item
        v-for="lang in languages"
        :key="lang.code"
        clickable
        v-ripple
        @click.stop="selectLanguage(lang.code)"
        :active="locale === lang.code"
        class="language-option-item q-pl-xl"
        :class="{ 'bg-blue-1': locale === lang.code }"
      >
        <q-item-section avatar style="min-width: 40px">
          <div class="text-h6">{{ lang.flag }}</div>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">{{ lang.nativeName }}</q-item-label>
          <q-item-label caption class="text-grey-7">{{ lang.name }}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="locale === lang.code">
          <q-icon name="check_circle" color="primary" />
        </q-item-section>
      </q-item>
    </div>

    <!-- Mini mode menu -->
    <q-menu
      v-if="miniMode"
      v-model="showLanguageMenu"
      anchor="center right"
      self="center left"
      :offset="[10, 0]"
    >
      <q-list style="min-width: 200px">
        <q-item
          v-for="lang in languages"
          :key="lang.code"
          clickable
          v-ripple
          @click.stop="selectLanguage(lang.code)"
          :active="locale === lang.code"
          :class="{ 'bg-blue-1': locale === lang.code }"
        >
          <q-item-section avatar style="min-width: 40px">
            <div class="text-h6">{{ lang.flag }}</div>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ lang.nativeName }}</q-item-label>
            <q-item-label caption class="text-grey-7">{{ lang.name }}</q-item-label>
          </q-item-section>
          <q-item-section side v-if="locale === lang.code">
            <q-icon name="check_circle" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  miniMode?: boolean;
}>();

const { t, locale } = useI18n({ useScope: 'global' });
const showLanguageMenu = ref(false);

const languages = [
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    icon: 'language',
    flag: '🇰🇷',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    icon: 'language',
    flag: '🇺🇸',
  },
];

const currentLanguageName = computed(() => {
  const lang = languages.find(l => l.code === locale.value);
  return lang ? `${lang.flag} ${lang.nativeName}` : 'Language';
});

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value;
};

const selectLanguage = (code: string) => {
  locale.value = code;
  // Save to localStorage for persistence
  if (process.client) {
    localStorage.setItem('app-locale', code);
  }
  showLanguageMenu.value = false;
  console.log('Language changed to:', code, languages.find(l => l.code === code)?.nativeName);
};
</script>

<style scoped>
.language-selector {
  transition: background-color 0.2s ease;
}

.language-selector:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.language-options {
  background-color: #fafafa;
  border-left: 3px solid var(--q-primary);
}

.language-option-item {
  transition: all 0.2s ease;
}

.language-option-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
