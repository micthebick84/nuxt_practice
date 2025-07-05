<template>
  <q-page padding class="q-my-xl text-center">
    <div class="text-h4">Custom Layout</div>
    <p class="q-mt-sm text-grey-8">This is a page for Custom Layout practice.</p>
    <div class="q-mt-lg">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Custom Features</div>
          <p class="q-mt-sm">
            Explore custom layout features and components designed for specific use cases.
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Dashboard" to="/custom/dashboard" />
          <q-btn color="secondary" label="Settings" to="/custom/settings" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>

<style scoped></style>
