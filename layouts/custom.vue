<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-2">
    <q-header elevated class="bg-orange text-white">
      <q-toolbar>
        <q-toolbar-title>Vue & Nuxt Mastery Custom Layout</q-toolbar-title>
        <q-separator dark vertical />
        <NuxtLink v-slot="{ navigate }" custom to="/custom/dashboard">
          <q-btn stretch flat label="Dashboard" no-caps @click="navigate()" />
        </NuxtLink>
        <q-separator dark vertical />
        <NuxtLink v-slot="{ navigate }" custom to="/custom/settings">
          <q-btn stretch flat label="Settings" no-caps @click="navigate()" />
        </NuxtLink>
        <q-separator dark vertical />
        <NuxtLink v-slot="{ navigate }" custom to="/custom">
          <q-btn stretch flat label="Custom" no-caps @click="navigate()" />
        </NuxtLink>
      </q-toolbar>
    </q-header>
    <q-page-container :style="pageContainerStyle">
      <slot></slot>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
const pageContainerStyle = computed(() => ({
  maxWidth: '1080px',
  margin: '0 auto',
}));
</script>
