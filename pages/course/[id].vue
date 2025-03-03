<template>
  <div>
    <h2>Course</h2>
    <div class="text-subtitle1">
      {{ $route.params }}
    </div>
  </div>
</template>
<script lang="ts">
const route = useRoute();
console.log(route.params.id);
</script>
