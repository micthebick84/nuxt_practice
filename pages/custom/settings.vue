<template>
  <q-page padding class="q-my-xl text-center">
    <div class="text-h4">Custom Settings</div>
    <p class="q-mt-sm text-grey-8">This is a page for Custom Settings practice.</p>
    <div class="q-mt-lg">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Settings Panel</div>
          <p class="q-mt-sm">
            Configure your custom preferences and application settings.
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Save Settings" />
          <q-btn color="secondary" label="Back to Custom" to="/custom" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>

<style scoped></style>
