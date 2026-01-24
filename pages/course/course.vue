<script setup lang="ts">
// Course page is disabled - redirect to dashboard
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/dashboard');
    },
  ],
});
</script>

<template>
  <div></div>
</template>
