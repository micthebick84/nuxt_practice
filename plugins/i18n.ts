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
        home: '홈',
        about: '어바웃',
        test: '테스트',
        admin: '관리자',
        logout: '로그아웃',
        logoutConfirm: '정말로 로그아웃을 하시겠습니까?',
        yes: '예',
        no: '아니오',
      },
    },
  });

  vueApp.use(i18n);
});
