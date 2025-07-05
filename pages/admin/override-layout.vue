<template>
  <q-page padding class="q-my-xl text-center">
    <div class="text-h4">Layout Override</div>
    <p class="q-mt-sm text-grey-8">
      This is a page for Admin Layout practice.
    </p>
    <div class="q-mt-lg">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Custom Layout</div>
          <p class="q-mt-sm">
            This page demonstrates how to override the default layout with a custom admin layout.
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Back to Admin" to="/admin" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  // layout: false,
});
</script>

<style scoped></style>
