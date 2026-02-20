// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devServer: {
    port: 3000,
    host: '0.0.0.0', // localhost 외 접근 허용 (같은 PC 내 다른 툴/브라우저 등)
  },
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
    '/api/proxy': {
      target: 'http://localhost:8080', // 8080 포트로 프록시
      changeOrigin: true,
      pathRewrite: { '^/api/proxy': '/api' }, // 필요시 경로 재작성
    },
  },
  quasar: {
    plugins: ['Notify', 'Dialog'],
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
      '/api/proxy': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        prependPath: true,
      }
    }
  },
  runtimeConfig: {
    // Server-only (secret)
    oauth: {
      clientSecret: process.env.OAUTH_CLIENT_SECRET || 'secret123',
    },
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080',
      siteName: process.env.SITE_NAME || 'Netis v6.6',
      oauth: {
        clientId: process.env.OAUTH_CLIENT_ID || 'nuxt-app',
        authorizationEndpoint: process.env.OAUTH_AUTHORIZATION_ENDPOINT || 'http://localhost:9000/oauth2/authorize',
        tokenEndpoint: process.env.OAUTH_TOKEN_ENDPOINT || 'http://localhost:9000/oauth2/token',
        logoutEndpoint: process.env.OAUTH_LOGOUT_ENDPOINT || 'http://localhost:9000/logout',
        redirectUri: process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000/auth/callback',
        postLogoutRedirectUri: process.env.OAUTH_POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000/login?logout=true',
        scope: process.env.OAUTH_SCOPE || 'openid profile email',
      },
    },
  }
});
