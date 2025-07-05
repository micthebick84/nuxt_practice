<template>
  <q-page padding>
    <div class="q-my-xl text-center">
      <div class="text-h4">{{ $t('test') }}</div>
      <p class="q-mt-sm text-grey-8">
        This is a test page for development purposes.
      </p>
      <div class="q-mt-lg">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6">Test Content</div>
            <p class="q-mt-sm">
              Welcome to the test page! This page is used for testing various features and components.
            </p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" label="Test Button" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Test page component
</script> 