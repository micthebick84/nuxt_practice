<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-2">
    <q-header elevated class="bg-dark text-white">
      <q-toolbar>
        <q-toolbar-title> Learn Nuxt3 </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container :style="pageContainerStyle">
      <q-page padding>
        <div class="text-h2">Learn Nuxt 3</div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
const pageContainerStyle = computed(() => ({
  maxWidth: '1080px',
  margin: '0 auto',
}));
</script>
