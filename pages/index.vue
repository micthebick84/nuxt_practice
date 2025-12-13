<template>
  <q-page padding class="q-my-xl text-center">
    <div class="text-h4">Welcome to Vue & Nuxt Mastery Class</div>
    <p class="q-mt-sm text-grey-8">Learn web development from basics to practice.</p>
    <div class="q-mt-lg">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Featured Courses</div>
          <p class="q-mt-sm">
            Explore our comprehensive collection of web development courses designed to take you from beginner to expert.
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="View Courses" to="/course" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
console.log('index.vue');
</script>

<script setup lang="ts">
// Page metadata - no longer needs middleware since auth is global
</script>
