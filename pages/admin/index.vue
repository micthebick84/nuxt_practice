<template>
  <q-page padding class="q-my-xl text-center">
    <div class="text-h4">Admin Dashboard</div>
    <p class="q-mt-sm text-grey-8">This is a page for Admin Layout practice.</p>
    <div class="q-mt-lg">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Admin Panel</div>
          <p class="q-mt-sm">
            Welcome to the admin dashboard. Here you can manage courses, users, and system settings.
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Manage Courses" />
          <q-btn color="secondary" label="User Management" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});
</script>

<style scoped></style>
