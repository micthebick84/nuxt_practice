<template>
  <div ref="containerRef" class="netis-line-chart" :style="{ width: '100%', position: 'relative' }">
    <svg
      :width="w"
      :height="height"
      style="display: block; overflow: visible"
      @mousemove="onMove"
      @mouseleave="hoverIdx = null"
    >
      <!-- y grid + labels -->
      <g v-for="(t, i) in ticks" :key="`y${i}`">
        <line
          :x1="padL"
          :x2="padL + innerW"
          :y1="y(t)"
          :y2="y(t)"
          stroke="#e5e7eb"
          :stroke-dasharray="i === 0 ? '0' : '3,3'"
          stroke-width="1"
        />
        <text
          :x="padL - 6"
          :y="y(t) + 3"
          text-anchor="end"
          font-size="10"
          fill="#94a3b8"
          font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          {{ formatTick(t, unit) }}
        </text>
      </g>

      <!-- x labels -->
      <text
        v-for="(idx, i) in xTickIdx"
        :key="`x${i}`"
        :x="x(idx)"
        :y="padT + innerH + 14"
        text-anchor="middle"
        font-size="10"
        fill="#94a3b8"
        font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
      >
        {{ labels[idx] }}
      </text>

      <!-- series -->
      <path
        v-for="(s, si) in series"
        :key="`s${si}`"
        :d="pathFor(s)"
        fill="none"
        :stroke="s.color"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        :opacity="hoverIdx === null ? 0.95 : 0.6"
      />

      <!-- hover overlay -->
      <g v-if="hoverIdx !== null">
        <line
          :x1="x(hoverIdx)"
          :x2="x(hoverIdx)"
          :y1="padT"
          :y2="padT + innerH"
          stroke="#94a3b8"
          stroke-width="1"
          stroke-dasharray="3,3"
        />
        <circle
          v-for="(s, si) in series"
          :key="`h${si}`"
          :cx="x(hoverIdx)"
          :cy="y(s.data[hoverIdx])"
          r="3"
          fill="#fff"
          :stroke="s.color"
          stroke-width="2"
        />
      </g>
    </svg>

    <div
      v-if="hoverIdx !== null"
      class="netis-line-tooltip"
      :style="{
        left: Math.min(w - 170, Math.max(0, x(hoverIdx) + 10)) + 'px',
      }"
    >
      <div class="tt-time">{{ labels[hoverIdx] }}</div>
      <div v-for="(s, si) in series" :key="`tt${si}`" class="tt-row">
        <span class="tt-label">
          <span class="tt-swatch" :style="{ background: s.color }" />
          {{ s.name }}
        </span>
        <span>{{ formatTick(s.data[hoverIdx], unit) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

interface Series {
  name: string;
  color: string;
  data: number[];
}

const props = withDefaults(
  defineProps<{
    series: Series[];
    labels: string[];
    unit: string;
    yMax?: number;
    yMin?: number;
    height?: number;
  }>(),
  { yMin: 0, height: 180, yMax: undefined },
);

const padL = 40;
const padR = 8;
const padT = 8;
const padB = 22;

const containerRef = ref<HTMLDivElement | null>(null);
const w = ref(360);
const hoverIdx = ref<number | null>(null);

let ro: ResizeObserver | null = null;
onMounted(() => {
  if (!containerRef.value) return;
  ro = new ResizeObserver((entries) => {
    for (const e of entries) w.value = e.contentRect.width;
  });
  ro.observe(containerRef.value);
});
onBeforeUnmount(() => {
  ro?.disconnect();
});

const innerW = computed(() => Math.max(20, w.value - padL - padR));
const innerH = computed(() => props.height - padT - padB);
const points = computed(() => props.labels.length);

const top = computed(() => {
  if (props.yMax !== undefined) return props.yMax;
  const dataMax = Math.max(...props.series.flatMap((s) => s.data));
  return Math.ceil(dataMax * 1.15);
});
const bottom = computed(() => props.yMin);
const yRange = computed(() => top.value - bottom.value || 1);

const x = (i: number) => padL + (innerW.value * i) / Math.max(1, points.value - 1);
const y = (v: number) => padT + innerH.value - ((v - bottom.value) / yRange.value) * innerH.value;

const ticks = computed(() => [0, 1, 2, 3, 4].map((i) => bottom.value + (yRange.value * i) / 4));
const xTickIdx = computed(() => {
  const tickCount = Math.min(6, points.value);
  const arr: number[] = [];
  for (let i = 0; i < tickCount; i++) {
    arr.push(Math.round(((points.value - 1) * i) / Math.max(1, tickCount - 1)));
  }
  return arr;
});

function pathFor(s: Series) {
  return s.data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
}

function onMove(e: MouseEvent) {
  const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
  const px = e.clientX - rect.left;
  const rel = (px - padL) / innerW.value;
  const idx = Math.round(rel * (points.value - 1));
  hoverIdx.value = idx >= 0 && idx < points.value ? idx : null;
}

function formatTick(v: number, unit: string) {
  if (unit === 'bps') {
    if (v >= 1000) return (v / 1000).toFixed(1) + 'G';
    return v.toFixed(0) + 'M';
  }
  if (unit === 'ms') return v.toFixed(0) + 'ms';
  if (unit === '°C') return v.toFixed(0) + '°';
  if (unit === '%') return v.toFixed(0) + '%';
  return v.toFixed(0);
}
</script>

<style scoped>
.netis-line-tooltip {
  position: absolute;
  top: 6px;
  background: rgba(15, 23, 42, 0.92);
  color: #fff;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 11px;
  line-height: 1.5;
  pointer-events: none;
  min-width: 140px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  z-index: 5;
}
.tt-time {
  opacity: 0.7;
  margin-bottom: 2px;
}
.tt-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.tt-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.tt-swatch {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  display: inline-block;
}
</style>
