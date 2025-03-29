<template>
  <div>
    <NuxtLayout name="custom">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
  layoutTransition: false,
});
</script>

<style lang="scss" scoped></style>
