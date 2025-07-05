import type { Course } from '~/types/course';

const courses: Course[] = [
  {
    courseSlug: 'html-css',
    title: 'HTML & CSS Web Development for Beginners',
    subtitle:
      'A course that explains coding in a really easy-to-understand way so that beginners won\'t be afraid when first encountering coding.',
    thumbnail: 'https://i.imgur.com/oBODKcW.jpg',
    video: 'https://www.youtube.com/embed/N_nVDZSAjq4',
    rating: 5.0,
    reviewsCount: 42,
    studentCount: 2266,
    reviewsUrl: 'https://inf.run/YkAN#reviews',
    inflearnUrl: 'https://inf.run/YkAN',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content: `We use HTML, CSS, and JavaScript as the basic languages to create websites.
      Let me explain these web languages in an easy way!
      
      This means defining the website with HTML,
      making it beautiful with CSS,
      and making it functional with JavaScript.
      
      In this course, you will accurately understand what HTML and CSS are,
      learn how to use HTML tags, and study in detail how to style HTML elements with CSS.`,
  },
  {
    courseSlug: 'javascript',
    title: 'ES6+ Modern JavaScript for Beginners',
    subtitle:
      'This course is prepared with easy and substantial content for complete beginners who are just starting to code.',
    thumbnail: 'https://i.imgur.com/0fGbOU2.png',
    video: 'https://www.youtube.com/embed/z_o638sr5s0',
    rating: 4.9,
    reviewsCount: 9,
    studentCount: 78,
    reviewsUrl: 'https://inf.run/Kpnd#reviews',
    inflearnUrl: 'https://inf.run/Kpnd',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content: `I\'ve seen many people around me who are just starting to code. Experienced developers say JavaScript is easy, but beginners can\'t help but find it difficult. So this course is prepared with easy and substantial content for complete beginners who are just starting to code. 💪🙂`,
  },
  {
    courseSlug: 'frontend',
    title: 'Frontend Wings: Essential Knowledge Before Learning Vue and React',
    subtitle:
      'Through this course, you can solidly build the knowledge that frontend developers must know before becoming one, such as Webpack and NPM.',
    thumbnail: 'https://i.imgur.com/DS2x9jr.png',
    video: 'https://www.youtube.com/embed/5VxdeXfh0Ew',
    rating: 5.0,
    reviewsCount: 136,
    studentCount: 3286,
    reviewsUrl: 'https://inf.run/CJ4a#reviews',
    inflearnUrl: 'https://inf.run/CJ4a',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content: `While doing frontend development, I felt that many people don\'t have a clear understanding of Webpack, NPM, module systems, etc.
      Currently, many courses deal with topics related to specific frameworks like Vue.js, React, Angular, but there aren\'t many background knowledge courses for becoming a frontend developer.
      So I prepared the "Frontend Wings" course. I hope this course with easy explanations will be helpful. 🙂`,
  },
  {
    courseSlug: 'vue3-basic',
    title: 'Vue3 Complete Master: From Basics to Practice - "Basic Edition"',
    subtitle:
      'Based on the official documentation, this course covers Vue 3 specifications in detail and depth so you can develop web applications with Vue.js 3.',
    thumbnail: 'https://i.imgur.com/eR2vDgH.png',
    video: 'https://www.youtube.com/embed/zmq2zu-UsRk',
    rating: 5.0,
    reviewsCount: 133,
    studentCount: 1308,
    reviewsUrl: 'https://inf.run/yWHo#reviews',
    inflearnUrl: 'https://inf.run/yWHo',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content:
      'This course is for creating web applications with Vue.js 3, and the lecture is conducted based on the newly introduced Composition API. Based on the official documentation, we cover all the necessary content without missing anything, while explaining it in an easy, detailed, and deep manner.',
  },
  {
    courseSlug: 'vue3-practice',
    title: 'Vue3 Complete Master: From Basics to Practice - "Practice Edition"',
    subtitle:
      'Develop real projects with Vue.js 3 and master the usage of Composition API. Additionally, by taking this course, you will acquire skills in "Vue Router v4", "Pinia", and "Bootstrap".',
    thumbnail: 'https://i.imgur.com/ytHamn1.png',
    video: 'https://www.youtube.com/embed/zmq2zu-UsRk',
    rating: 4.9,
    reviewsCount: 75,
    studentCount: 1034,
    reviewsUrl: 'https://inf.run/ZN1Y#reviews',
    inflearnUrl: 'https://inf.run/ZN1Y',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content:
      'Develop real projects with Vue.js 3 and master the usage of Composition API. Additionally, by taking this course, you will acquire skills in "Vue Router v4", "Pinia", and "Bootstrap".',
  },
  {
    courseSlug: 'quasar',
    title: 'Quasar Complete Master: If you want to build Vue frontend web quickly!',
    subtitle:
      'This course is for those who want to use Quasar while doing web development with Vue.js. Are you someone who needs to quickly build frontend web in-house or someone who needs to create your own amazing UI? Through this course, you can create frontend web easily and quickly.',
    thumbnail: 'https://i.imgur.com/zkqvR9a.png',
    video: 'https://www.youtube.com/embed/8CmQY2q8bXI',
    rating: 5.0,
    reviewsCount: 133,
    studentCount: 1308,
    reviewsUrl: 'https://inf.run/HbGc#reviews',
    inflearnUrl: 'https://inf.run/HbGc',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content: `Initially, I was preparing a course to create a real community site using Vue3 + Quasar + Firebase. And I planned to actually use this community myself.

     However, while creating UI using Quasar, students asked various questions about UI construction, and I thought "a separate Quasar course would be needed to create desired UI without getting stuck."
     
     This is because when building initial web applications, the higher the participation of the framework used, the greater the difference in development productivity and maintenance aspects between those who "properly" know and use the framework and those who don\'t.
     
     So while preparing the course,
     
     For those creating personal websites to develop quickly and with amazing UI
     For developers in the industry to successfully develop frontend web through this course
     I prepared a course that can complete the Quasar framework in one go.`,
  },
  {
    courseSlug: 'vue3-firebase',
    title:
      'Vue 3 & Firebase 10 Community Building Full Stack (with Pinia, Quasar, Tiptap, VueUse)',
    subtitle:
      'This course on creating communities using Vue3 & Firebase(v10) helps developers grow to the next level in various aspects: Vue3 practical usage, Firebase from basics to practice, latest web technology usage, knowledge sharer experience sharing, and more!',
    thumbnail: 'https://i.imgur.com/J50dCJp.png',
    video: 'https://www.youtube.com/embed/4PS14XwuWwI',
    rating: 5.0,
    reviewsCount: 14,
    studentCount: 86,
    reviewsUrl: 'https://inf.run/6kyv#reviews',
    inflearnUrl: 'https://inf.run/6kyv',
    gymcodingUrl: 'https://edu.gymcoding.co/p/products',
    content: `Hello! This course is about creating community web using Vue3 and Firebase. By taking this course, you will learn Vue3 Composition API practical usage! And it\'s a course where you can master Firebase from basics to practice in one go.
When developing frontend web, various knowledge is needed such as editors, infinite scrolling, search functionality, debugging, etc. In this course, you can acquire various web technologies that can only be known through practical experience, helping you grow as a developer to the next level.`,
  },
];
export default courses;
