import { createI18n } from 'vue-i18n';

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
      en: {
        home: 'Home',
        about: 'About',
        test: 'Test',
        admin: 'Admin',
        logout: 'Logout',
        logoutConfirm: 'Are you sure you want to logout?',
        yes: 'Yes',
        no: 'No',
      },
      ko: {
        home: 'Home',
        about: 'About',
        test: 'Test',
        admin: 'Admin',
        logout: 'Logout',
        logoutConfirm: 'Are you sure you want to logout?',
        yes: 'Yes',
        no: 'No',
      },
    },
  });

  vueApp.use(i18n);
});
