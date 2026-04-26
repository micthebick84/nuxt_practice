<template>
  <button
    type="button"
    :class="['dashboard-banner', { 'is-hover': hover }]"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="$emit('open')"
  >
    <div class="banner-grid-bg" />
    <div class="banner-glow" />
    <div class="banner-content">
      <div class="banner-eyebrow">
        <span class="banner-live-dot" />
        REALTIME · v7.0
      </div>
      <h2 class="banner-headline">
        통합 대시보드<br />
        <span class="banner-headline-accent">바로가기</span>
      </h2>
      <p class="banner-desc">
        전체 망의 상태를 한 화면에서.<br />
        토폴로지 · 트래픽 · 알람을 통합 모니터링합니다.
      </p>
      <div class="banner-stats">
        <div class="banner-stat">
          <div class="banner-stat-num">1,247</div>
          <div class="banner-stat-label">관리 장비</div>
        </div>
        <div class="banner-stat-divider" />
        <div class="banner-stat">
          <div class="banner-stat-num">98.7<span style="font-size: 0.6em">%</span></div>
          <div class="banner-stat-label">가용률</div>
        </div>
        <div class="banner-stat-divider" />
        <div class="banner-stat">
          <div class="banner-stat-num" style="color: #fca5a5">3</div>
          <div class="banner-stat-label">Critical</div>
        </div>
      </div>
      <span class="banner-cta">
        <span>대시보드 열기</span>
        <span class="banner-cta-arrow">→</span>
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
defineEmits<{ open: [] }>();
const hover = ref(false);
</script>
