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
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // 8080 포트로 프록시
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' }, // 필요시 경로 재작성
    },
  },
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
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        prependPath: true,
      }
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080'
    }
  }
});
