<template>
  <NuxtLayout>
    <NuxtPage />
    <!-- <NuxtPage :page-key="(route) => route.fullPath" /> -->
    <!-- <RouterView /> -->
  </NuxtLayout>
</template>
<script setup lang="ts">
const nuxtApp = useNuxtApp();
console.log('nuxtApp : ', nuxtApp);

// nuxtApp.provide('hello', (msg: string) => `hello ${msg}`);
</script>
