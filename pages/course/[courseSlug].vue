<template>
  <q-page padding>
    <div v-if="course" class="q-my-xl">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8">
          <VideoPlayer :src="course.video" />
          <div class="q-mt-md">
            <span> {{ course?.reviewCount }} reviews </span>
            <span class="q-mx-md">|</span>
            <span>{{ course?.studentCount }} students</span>
            <q-btn
              flat
              color="primary"
              label="View Reviews"
              :href="course.reviewsUrl"
              target="_blank"
            />
          </div>
        </div>
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ course.title }}</div>
              <p class="q-mt-sm">{{ course.subtitle }}</p>
              <div class="q-mt-md">
                <q-btn
                  color="primary"
                  label="Take Course on Inflearn"
                  :href="course.inflearnUrl"
                  target="_blank"
                  class="q-mb-sm full-width"
                />
                <q-btn
                  color="secondary"
                  label="Take Course on Gymcoding Club"
                  :href="course.gymcodingUrl"
                  target="_blank"
                  class="q-mb-sm full-width"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="q-mt-lg">
        <q-card>
          <q-card-section>
            <div class="text-h6">Course Progress</div>
            <q-btn
              color="success"
              label="Mark as Completed"
              class="q-mt-sm"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="q-mt-lg">
        <q-card>
          <q-card-section>
            <div class="text-h6">Notes</div>
            <q-input
              v-model="notes"
              type="textarea"
              placeholder="Write your notes here."
              class="q-mt-sm"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="q-mt-lg">
        <q-card>
          <q-card-section>
            <div class="text-h6">Navigation</div>
            <div class="row q-col-gutter-sm">
              <div class="col">
                <q-btn
                  color="primary"
                  label="Previous Course"
                  class="full-width"
                />
              </div>
              <div class="col">
                <q-btn
                  color="secondary"
                  label="Add Query"
                  class="full-width"
                />
              </div>
              <div class="col">
                <q-btn
                  color="primary"
                  label="Next Course"
                  class="full-width"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const route = useRoute()
const courseSlug = route.params.courseSlug as string
const { course, prevCourse, nextCourse } = useCourse(courseSlug)
const notes = ref('')

definePageMeta({
  middleware: ['auth']
})
</script>
