<script setup lang="ts">
// Redirect to dashboard as the main landing page
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
