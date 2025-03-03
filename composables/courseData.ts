import type { Course } from '~/types/course';

const courses: Course[] = [
  {
    courseSlug: 'html-css',
    title: '입문자를 위한, HTML&CSS 웹 개발 입문',
    subtitle:
      '코딩을 처음 접할 때 두려움이 없도록 정말 알기 쉽게 설명한 강의입니다.',
    thumbnail: 'https://i.imgur.com/oBODKcW.jpg',
    video: 'https://www.youtube.com/embed/N_nVDZSAjq4',
    rating: 5.0,
    reviewsCount: 42,
    studentCount: 2266,
    reviewsUrl: 'https://inf.run/YkAN#reviews',
    inflearnUrl: 'https://inf.run/YkAN',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content: `우리는 웹사이트를 만들기 위해 기본적으로 HTML, CSS, JavaScript를 사용합니다.
      이 웹 언어를 쉽게 설명드릴게요!
      
      HTML로 웹사이트를 정의하고
      CSS로 예쁘게 꾸민 후에
      JavaScript로 동작하게 하는 것을 의미합니다.
      
      이 강의에서는 HTML과 CSS가 무엇인지 정확하게 이해하고,
      HTML 태그 사용법 그리고 CSS로 HTML 요소를 스타일링 하는 방법에 대해 자세히 학습합니다.`,
  },
  {
    courseSlug: 'javascript',
    title: '입문자를 위한, ES6+ 최신 자바스크립트 입문',
    subtitle:
      '이번 강의는 코딩에 입문하시는 왕초보 분들을 위해 쉽고! 알찬! 내용을 준비했습니다.',
    thumbnail: 'https://i.imgur.com/0fGbOU2.png',
    video: 'https://www.youtube.com/embed/z_o638sr5s0',
    rating: 4.9,
    reviewsCount: 9,
    studentCount: 78,
    reviewsUrl: 'https://inf.run/Kpnd#reviews',
    inflearnUrl: 'https://inf.run/Kpnd',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content: `주변에서 코딩을 처음 시작하시는 분들을 많이 봤어요. 경력자 분들은 자바스크립트가 쉽다고 하지만 처음 접하시는 분들은 어렵게 느낄 수 밖에 없습니다. 그래서 이번 강의는 코딩에 입문하시는 왕초보 분들을 위해 쉽고! 알찬! 내용을 준비했습니다. 💪🙂`,
  },
  {
    courseSlug: 'frontend',
    title: '프론트엔드 날개달기: Vue, React 배우기 전에 꼭 알아야 하는 지식',
    subtitle:
      '이 강의를 통해 Webpack, NPM 등 프론트엔드 개발자가 되기 전에 꼭 알아야할 지식을 탄탄히 다질 수 있습니다.',
    thumbnail: 'https://i.imgur.com/DS2x9jr.png',
    video: 'https://www.youtube.com/embed/5VxdeXfh0Ew',
    rating: 5.0,
    reviewsCount: 136,
    studentCount: 3286,
    reviewsUrl: 'https://inf.run/CJ4a#reviews',
    inflearnUrl: 'https://inf.run/CJ4a',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content: `프론트엔드 개발을 하며 많은 분들이 Webpack, NPM, 모듈시스템 등에 대해 확실하게 이해를 하지 못하고 있다고 느꼈습니다.
      현재 많은 강좌들이 Vuejs, React, Angular 등 해당 프레임워크에 대한 주제로 강의를 다루고 있지만 프론트엔드 개발자가 되기위한 Background 지식은 많이 없더라고요.
      그래서 준비하게 된 "프론트엔드 날개달기" 강의입니다. 쉬운 설명으로 준비한 강의이니, 많은 도움이 되었으면 합니다. 🙂`,
  },
  {
    courseSlug: 'vue3-basic',
    title: 'Vue3 완벽 마스터: 기초부터 실전까지 - "기본편"',
    subtitle:
      'Vue.js 3로 웹 개발을 할 수 있도록 공식문서를 기반으로 하여 Vue 3 스펙을 자세하고 깊이있게 다룹니다.',
    thumbnail: 'https://i.imgur.com/eR2vDgH.png',
    video: 'https://www.youtube.com/embed/zmq2zu-UsRk',
    rating: 5.0,
    reviewsCount: 133,
    studentCount: 1308,
    reviewsUrl: 'https://inf.run/yWHo#reviews',
    inflearnUrl: 'https://inf.run/yWHo',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content:
      '본 강좌는 Vue.js 3로 웹 애플리케이션을 위한 만들기 강좌로, 새롭게 등장한 Composition API를 기반으로 강의를 진행합니다. 공식문서를 기반으로 알아야하는 내용을 빠짐없이 다루면서도 쉽고, 자세하고, 깊게 내용을 다룹니다.',
  },
  {
    courseSlug: 'vue3-practice',
    title: 'Vue3 완벽 마스터: 기초부터 실전까지 - "실전편"',
    subtitle:
      'Vue.js 3로 실전 프로젝트를 개발하며 Composition API의 사용법을 숙지합니다. 뿐만 아니라 본 강좌를 수강하면 "Vue Router v4"와 "Pinia", "Boostrap"에 대한 기술을 가져가실 수 있습니다.',
    thumbnail: 'https://i.imgur.com/ytHamn1.png',
    video: 'https://www.youtube.com/embed/zmq2zu-UsRk',
    rating: 4.9,
    reviewsCount: 75,
    studentCount: 1034,
    reviewsUrl: 'https://inf.run/ZN1Y#reviews',
    inflearnUrl: 'https://inf.run/ZN1Y',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content:
      'Vue.js 3로 실전 프로젝트를 개발하며 Composition API의 사용법을 숙지합니다. 뿐만 아니라 본 강좌를 수강하면 "Vue Router v4"와 "Pinia", "Boostrap"에 대한 기술을 가져가실 수 있습니다.',
  },
  {
    courseSlug: 'quasar',
    title: '퀘이사(Quasar) 완벽 마스터 : Vue 프론트 웹을 빠르게 만들고 싶다면!',
    subtitle:
      'Vue.js로 웹 개발을 하며 퀘이사(Quasar)를 이용하고 싶은 분들을 위한 강의입니다. 사내에서 프론트 웹을 빠르게 구축해야 하는 분 또는 나만의 멋진 UI를 만들어야 하는 분이신가요? 이 강의를 통해서 쉽고, 빠르게 프론트 웹을 만들 수 있습니다.',
    thumbnail: 'https://i.imgur.com/zkqvR9a.png',
    video: 'https://www.youtube.com/embed/8CmQY2q8bXI',
    rating: 5.0,
    reviewsCount: 133,
    studentCount: 1308,
    reviewsUrl: 'https://inf.run/HbGc#reviews',
    inflearnUrl: 'https://inf.run/HbGc',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content: `처음에는 Vue3 + Quasar + Firebase를 활용해 진짜 커뮤니티 사이트를 만드는 강의를 준비하고 있었습니다. 그리고 이렇게 만들어진 커뮤니티는 제가 실제로도 이용할 계획이었습니다. 

     그런데 퀘이사를 이용해 UI를 만들던 중 수강생 분들이 UI 구축에 대한 여러 질문을 주셨고, ”원하는 UI를 막힘없이 만들기 위해서는 별도의 퀘이사 강의가 필요하겠다”는 생각이 들었습니다.
     
     왜냐하면 초기 웹 애플리케이션을 구축할 때 사용하는 프레임워크의 참여도가 높으면 높을 수록 해당 프레임워크를 “제대로” 알고 사용하는 경우와 그렇지 않은 경우에는 개발 생산성도, 유지관리 측면에서도 크나큰 차이가 있기 때문입니다. 
     
     그래서 이왕 강의를 준비하는 거, 
     
     개인 웹 사이트를 만드시는 분들이 빠르게, 멋진 UI를 개발할 수 있도록
     현업에 계신 개발자 분들이 이 강의를 통해 성공적인 프론트 웹을 개발할 수 있도록
     퀘이사 프레임워크를 한 번에 끝낼 수 있는 강의를 준비하게 되었습니다.`,
  },
  {
    courseSlug: 'vue3-firebase',
    title:
      'Vue 3 & Firebase 10 커뮤니티 만들기 풀스택 (with Pinia, Quasar, Tiptap, VueUse)',
    subtitle:
      'Vue3 & Firebase(v10)를 활용하여 커뮤니티를 만드는 강의로 Vue3 실전 활용법, Firebase 기초부터 실전, 최신 웹 기술 활용법, 지식공유자 경험 공유 등 다양한 방면으로 개발자로써 한 단계 성장할 수 있도록 돕습니다!',
    thumbnail: 'https://i.imgur.com/J50dCJp.png',
    video: 'https://www.youtube.com/embed/4PS14XwuWwI',
    rating: 5.0,
    reviewsCount: 14,
    studentCount: 86,
    reviewsUrl: 'https://inf.run/6kyv#reviews',
    inflearnUrl: 'https://inf.run/6kyv',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content: `안녕하세요! 이번 강의는 Vue3와 Firebase를 활용하여 커뮤니티 웹을 만드는 강의로, 이번 강의를 수강하신다면 Vue3 Composition API 실무 활용법! 그리고 Firebase 기초부터 실전까지 한 번에 내 것으로 만들 수 있는 강의입니다.
프론트엔드 웹을 개발할 때 에디터, 무한 스크롤링, 검색 기능, 디버깅 등 다양한 지식이 필요한데요. 해당 강의에서는 실무 경험에서 알 수 있는 다양한 웹 기술까지 습득하여 개발자로서 한 단계 성장할 수 있는 강의입니다.`,
  },
];
export default courses;
