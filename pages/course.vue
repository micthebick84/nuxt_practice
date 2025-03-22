<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-3">
        <q-card>
          <q-item-label header>강의 로드맵</q-item-label>
          <q-list bordered separator>
            <q-item
              v-for="(course, index) in courses"
              :key="course.courseSlug"
              v-ripple
              clickable
              :to="course.path"
            >
              <q-item-section>
                {{ index + 1 }}. {{ course.title }}
              </q-item-section>
            </q-item>
            <!-- NuxtLink 사용시 페이지 방문 전 prefetching 이 이루어져 해당 소스의 내용을 가져온다. -->
            <!-- <NuxtLink to="/course/prefetching-1"> prefetching test 1 </NuxtLink>
            <q-item to="/course/prefetching-1">prefetching test 1</q-item>
            <q-item to="/course/prefetching-2">prefetching test 2</q-item>
            <q-item to="/course/prefetching-3">prefetching test 3</q-item> -->
          </q-list>
        </q-card>
      </div>
      <div class="col">
        <NuxtPage />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const { courses } = useCourses();
</script>
