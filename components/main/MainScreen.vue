<template>
  <div class="netis-main">
    <TopHeader @menu-toggle="emit('menuToggle')" />
    <div class="main-screen">
      <section class="top-half">
        <NoticePanel />
        <div class="banner-wrap">
          <DashboardBanner @open="goToDashboard" />
        </div>
      </section>

      <section class="bottom-half">
        <div class="widget-grid">
          <MetricWidget icon="🖥" title="CPU 사용량" subtitle="Last 1H · 5m interval" accent-color="#1976d2" :current="cpu.cur.toFixed(1)" unit="%" :status="cpu.status">
            <LineChart :series="cpu.series" :labels="cpu.labels" unit="%" :y-max="100" />
          </MetricWidget>

          <MetricWidget icon="🧠" title="메모리 사용량" subtitle="Last 1H · 5m interval" accent-color="#7c3aed" :current="mem.cur.toFixed(1)" unit="%" :status="mem.status">
            <LineChart :series="mem.series" :labels="mem.labels" unit="%" :y-max="100" />
          </MetricWidget>

          <MetricWidget icon="🌡" title="장비 온도" subtitle="Last 1H · 5m interval" accent-color="#ef4444" :current="temp.cur.toFixed(1)" unit="°C" :status="temp.status">
            <LineChart :series="temp.series" :labels="temp.labels" unit="°C" :y-max="70" :y-min="20" />
          </MetricWidget>

          <MetricWidget icon="⚡" title="응답속도" subtitle="Last 1H · 5m interval" accent-color="#10b981" :current="resp.cur.toFixed(0)" unit="ms" :status="resp.status">
            <LineChart :series="resp.series" :labels="resp.labels" unit="ms" :y-max="120" />
          </MetricWidget>

          <MetricWidget icon="⬇" title="회선 IN bps" subtitle="Last 1H · 5m interval" accent-color="#0891b2" :current="(inbps.cur / 1000).toFixed(2)" unit="Gbps" status="ok">
            <LineChart :series="inbps.series" :labels="inbps.labels" unit="bps" :y-max="1200" />
          </MetricWidget>

          <MetricWidget icon="⬆" title="회선 OUT bps" subtitle="Last 1H · 5m interval" accent-color="#f59e0b" :current="(outbps.cur / 1000).toFixed(2)" unit="Gbps" status="ok">
            <LineChart :series="outbps.series" :labels="outbps.labels" unit="bps" :y-max="1200" />
          </MetricWidget>
        </div>
        <div class="event-card-wrap">
          <EventTable />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TopHeader from './TopHeader.vue';
import NoticePanel from './NoticePanel.vue';
import DashboardBanner from './DashboardBanner.vue';
import MetricWidget from './MetricWidget.vue';
import LineChart from './LineChart.vue';
import EventTable from './EventTable.vue';
import { buildSeries, makeTimeLabels } from '~/composables/mainScreenSeries';

const emit = defineEmits<{ menuToggle: [] }>();

const POINTS = 24;

type Status = 'ok' | 'warn' | 'crit';

function pack(seedBase: number, base: number, variance: number, trend: number, thresholds?: { crit: number; warn: number }) {
  const labels = makeTimeLabels(POINTS);
  const series = buildSeries(seedBase, POINTS, base, variance, trend);
  const cur = series[0].data[POINTS - 1];
  let status: Status = 'ok';
  if (thresholds) {
    if (cur > thresholds.crit) status = 'crit';
    else if (cur > thresholds.warn) status = 'warn';
  }
  return { labels, series, cur, status };
}

const cpu = computed(() => pack(101, 45, 18, 0.2, { crit: 80, warn: 60 }));
const mem = computed(() => pack(202, 62, 12, 0.1, { crit: 85, warn: 70 }));
const temp = computed(() => pack(303, 42, 6, 0.05, { crit: 60, warn: 50 }));
const resp = computed(() => pack(404, 28, 14, -0.05, { crit: 100, warn: 60 }));
const inbps = computed(() => pack(505, 420, 180, 0.5));
const outbps = computed(() => pack(606, 380, 160, 0.4));

function goToDashboard() {
  // placeholder route — wire to real dashboard when available
  navigateTo('/dashboard');
}
</script>
