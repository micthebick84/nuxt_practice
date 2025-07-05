<template>
  <q-page padding class="q-my-xl text-center">
    <div class="text-h4">About</div>
    <p class="q-mt-sm text-grey-8">
      Vue & Nuxt Mastery Class web is built with Nuxt3.
    </p>
    <div class="q-mt-lg">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Our Mission</div>
          <p class="q-mt-sm">
            We are dedicated to providing high-quality web development education, helping developers master Vue.js and Nuxt.js frameworks through comprehensive courses and practical projects.
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Learn More" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';
</script>
