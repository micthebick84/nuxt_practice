<template>
  <div class="widget-card">
    <div class="widget-accent" :style="{ background: accentColor }" />
    <div class="widget-head">
      <div class="widget-title-row">
        <div class="widget-icon" :style="{ color: accentColor, background: hexAlpha(accentColor, 0.1) }">
          {{ icon }}
        </div>
        <div>
          <div class="widget-title">{{ title }}</div>
          <div class="widget-subtitle">{{ subtitle }}</div>
        </div>
      </div>
      <div class="widget-current">
        <div class="widget-current-value">
          {{ current }}<span class="widget-current-unit">{{ unit }}</span>
        </div>
        <div :class="`widget-status status-${status}`">
          <span class="status-dot" />
          {{ statusLabel }}
        </div>
      </div>
    </div>
    <div class="widget-body">
      <slot />
    </div>
    <div class="widget-legend">
      <span v-for="(name, i) in seriesNames" :key="name" class="legend-item">
        <span class="legend-swatch" :style="{ background: seriesColors[i] }" />
        {{ name }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SERIES_COLORS, SERIES_NAMES } from '~/composables/mainScreenSeries';

const props = defineProps<{
  icon: string;
  title: string;
  subtitle: string;
  accentColor: string;
  current: string;
  unit: string;
  status: 'ok' | 'warn' | 'crit';
}>();

const seriesNames = SERIES_NAMES;
const seriesColors = SERIES_COLORS;

const statusLabel = computed(() =>
  props.status === 'ok' ? '정상' : props.status === 'warn' ? '주의' : '경고',
);

function hexAlpha(hex: string, a: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
</script>
