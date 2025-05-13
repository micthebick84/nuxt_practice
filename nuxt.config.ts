// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  typescript: {
    shim: false,
    typeCheck: false,
  },
  devtools: { enabled: true },
  modules: [
    'nuxt-quasar-ui',
    '@pinia/nuxt',
  ],
  quasar: {
    /* */
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  alias: {},
  imports: {
    presets: [
      {
        from: 'vue-i18n',
        imports: ['useI18n'],
      },
    ],
  },
  ssr: true,
  router: {
    middleware: ['auth']
  },
});
