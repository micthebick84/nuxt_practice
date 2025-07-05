<template>
  <q-page padding>
    <div class="q-my-xl text-center">
      <div class="text-h4">
        Course Roadmap {{ $hello('gymcoding') }}</div
      >
    </div>
    <div class="row q-col-gutter-lg">
      <div
        v-for="{ courseSlug, title, subtitle, thumbnail, path } in courses"
        :key="courseSlug"
        class="col-12 col-md-4 col-sm-6"
      >
        <!-- When using NuxtLink, prefetching occurs before page visit, fetching the content of that source. -->
        <NuxtLink v-slot="{ navigate }" :to="path">
          <CourseCard
            :title="title"
            :sub-title="subtitle"
            :thumbnail="thumbnail"
            @click="navigate"
          />
        </NuxtLink>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const { courses } = useCourses()

definePageMeta({
  middleware: ['auth']
})
</script>
