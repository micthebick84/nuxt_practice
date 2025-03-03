<template>
  <q-card class="my-card" @click="$emit('click')">
    <img :src="thumbnail" />
    <q-card-section>
      <div class="text-h6 ellipsis">{{ title }}</div>
      <div class="text-subtitle2 ellipsis text-grey-8">
        {{ subTitle }}
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
interface Props {
  thumbnail: string;
  title: string;
  subTitle: string;
}
defineProps<Props>();
defineEmits<{ click: [] }>();
</script>
