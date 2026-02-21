<template>
  <div class="dashboard-page">
    <!-- Header -->
    <div class="content-header">
      <div class="header-left">
        <h1 class="page-title">교통 데이터 대시보드 (Highcharts)</h1>
        <div class="breadcrumb">
          <span class="bc-item">Home</span>
          <ChevronRight :size="14" color="#D1D5DB" />
          <span class="bc-item active">Dashboard</span>
        </div>
      </div>
      <div class="header-right">
        <div class="date-range-picker">
          <input type="date" v-model="startDate" class="date-input" @change="fetchAll" />
          <span class="date-sep">~</span>
          <input type="date" v-model="endDate" class="date-input" @change="fetchAll" />
          <button class="refresh-btn" @click="fetchAll">
            <RefreshCw :size="14" />
          </button>
        </div>
      </div>
    </div>

    <div class="header-divider"></div>

    <!-- Row 5: Raw Summary Stats Cards (full width) -->
    <div class="stats-row">
      <div class="stat-card" v-for="stat in summaryCards" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.bg }">
          <component :is="stat.icon" :size="20" :color="stat.color" />
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ loading.rawSummary ? '...' : stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="widget-grid">

      <!-- Row 1 -->
      <div class="widget-row">
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">일별 거래 현황</span>
          </div>
          <div class="chart-body">
            <div v-if="loading.daily" class="loading-skeleton"></div>
            <div v-else id="hc-daily" style="width:100%;height:200px;"></div>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">요일별 이용 통계</span>
          </div>
          <div class="chart-body">
            <div v-if="loading.dayOfWeek" class="loading-skeleton"></div>
            <div v-else id="hc-dayOfWeek" style="width:100%;height:200px;"></div>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">시간대별 이용 통계 (피크타임)</span>
          </div>
          <div class="chart-body">
            <div v-if="loading.hourlyStats" class="loading-skeleton"></div>
            <div v-else id="hc-hourlyStats" style="width:100%;height:200px;"></div>
          </div>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="widget-row">
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">호선별 일별 이용 현황</span>
          </div>
          <div class="chart-body">
            <div v-if="loading.dayLines" class="loading-skeleton"></div>
            <div v-else id="hc-dayLines" style="width:100%;height:200px;"></div>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">권종유형별 분석</span>
          </div>
          <div class="chart-body chart-center">
            <div v-if="loading.ticketType" class="loading-skeleton"></div>
            <div v-else id="hc-ticketType" style="width:100%;height:200px;"></div>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">카드유형별 이용 현황</span>
          </div>
          <div class="chart-body chart-center">
            <div v-if="loading.cardType" class="loading-skeleton"></div>
            <div v-else id="hc-cardType" style="width:100%;height:200px;"></div>
          </div>
        </div>
      </div>

      <!-- Row 3 -->
      <div class="widget-row">
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">TOP 10 승차역</span>
          </div>
          <div class="chart-body">
            <div v-if="loading.topBoarding" class="loading-skeleton"></div>
            <div v-else id="hc-topBoarding" style="width:100%;height:200px;"></div>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">역별 승하차 불균형 분석</span>
          </div>
          <div class="chart-body">
            <div v-if="loading.stationImbalance" class="loading-skeleton"></div>
            <div v-else id="hc-stationImbalance" style="width:100%;height:200px;"></div>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">노선별 효율 분석 (TOP 20)</span>
          </div>
          <div class="chart-body">
            <div v-if="loading.routeEfficiency" class="loading-skeleton"></div>
            <div v-else id="hc-routeEfficiency" style="width:100%;height:200px;"></div>
          </div>
        </div>
      </div>

      <!-- Row 4 -->
      <div class="widget-row">
        <div class="widget-card widget-card--wide">
          <div class="widget-header">
            <span class="widget-title">시간대 × 권종 크로스 분석</span>
          </div>
          <div class="chart-body">
            <div v-if="loading.hourTicketCross" class="loading-skeleton"></div>
            <div v-else id="hc-heatmap" style="width:100%;height:200px;"></div>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">호선별 TOP 역</span>
          </div>
          <div class="chart-body">
            <div v-if="loading.lineTopStations" class="loading-skeleton"></div>
            <div v-else id="hc-lineTopStations" style="width:100%;height:200px;"></div>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">무임 운임 면제 현황</span>
          </div>
          <div class="chart-body">
            <div v-if="loading.freeFare" class="loading-skeleton"></div>
            <div v-else id="hc-freeFare" style="width:100%;height:200px;"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import {
  ChevronRight,
  RefreshCw,
  BarChart2,
  Calendar,
  MapPin,
  TrendingUp,
  CreditCard,
} from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ layout: 'dashboard' });

const authStore = useAuthStore();

const mounted = ref(false);
const startDate = ref('2025-10-31');
const endDate = ref('2025-12-31');

// Loading states
const loading = ref({
  daily: true,
  dayOfWeek: true,
  hourlyStats: true,
  dayLines: true,
  ticketType: true,
  cardType: true,
  topBoarding: true,
  stationImbalance: true,
  routeEfficiency: true,
  hourTicketCross: true,
  lineTopStations: true,
  freeFare: true,
  rawSummary: true,
});

// Raw data refs
const dailyData = ref<any[]>([]);
const dayOfWeekData = ref<any[]>([]);
const hourlyStatsData = ref<any[]>([]);
const dayLinesData = ref<any[]>([]);
const ticketTypeData = ref<any[]>([]);
const cardTypeData = ref<any[]>([]);
const topBoardingData = ref<any[]>([]);
const stationImbalanceData = ref<any[]>([]);
const routeEfficiencyData = ref<any[]>([]);
const hourTicketCrossData = ref<any[]>([]);
const lineTopStationsData = ref<any[]>([]);
const freeFareData = ref<any[]>([]);
const rawSummaryData = ref<any>({});

const BASE = '/api/proxy/api/transport';
const params = computed(() => `startDate=${startDate.value}&endDate=${endDate.value}`);

async function fetchAll() {
  Object.keys(loading.value).forEach(k => (loading.value as any)[k] = true);

  await Promise.allSettled([
    fetchData(`${BASE}/daily?${params.value}`, dailyData, 'daily'),
    fetchData(`${BASE}/stats/day-of-week?${params.value}`, dayOfWeekData, 'dayOfWeek'),
    fetchData(`${BASE}/stats/hourly?${params.value}`, hourlyStatsData, 'hourlyStats'),
    fetchData(`${BASE}/day-lines?${params.value}`, dayLinesData, 'dayLines'),
    fetchData(`${BASE}/stats/ticket-type?${params.value}`, ticketTypeData, 'ticketType'),
    fetchData(`${BASE}/stats/card-type?${params.value}`, cardTypeData, 'cardType'),
    fetchData(`${BASE}/stats/top-boarding-stations?${params.value}`, topBoardingData, 'topBoarding'),
    fetchData(`${BASE}/stats/station-imbalance?${params.value}`, stationImbalanceData, 'stationImbalance'),
    fetchData(`${BASE}/stats/route-efficiency?${params.value}`, routeEfficiencyData, 'routeEfficiency'),
    fetchData(`${BASE}/stats/hour-ticket-cross?${params.value}`, hourTicketCrossData, 'hourTicketCross'),
    fetchData(`${BASE}/lines/top-stations?${params.value}`, lineTopStationsData, 'lineTopStations'),
    fetchData(`${BASE}/stats/free-fare?${params.value}`, freeFareData, 'freeFare'),
    fetchDataSingle(`${BASE}/stats/raw-summary?${params.value}`, rawSummaryData, 'rawSummary'),
  ]);
}

function authHeaders() {
  const token = authStore.accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchData(url: string, dataRef: any, loadingKey: string) {
  try {
    const res: any = await $fetch(url, { headers: authHeaders() });
    dataRef.value = res?.data ?? res ?? [];
  } catch (e) {
    dataRef.value = [];
  } finally {
    (loading.value as any)[loadingKey] = false;
  }
}

async function fetchDataSingle(url: string, dataRef: any, loadingKey: string) {
  try {
    const res: any = await $fetch(url, { headers: authHeaders() });
    dataRef.value = res?.data ?? res ?? {};
  } catch (e) {
    dataRef.value = {};
  } finally {
    (loading.value as any)[loadingKey] = false;
  }
}

// --- Summary Cards ---
const summaryCards = computed(() => [
  { label: '총 거래건수', value: rawSummaryData.value?.totalCnt?.toLocaleString() ?? '-', icon: BarChart2, color: '#4CAF50', bg: '#E8F5E9' },
  { label: '거래 일수', value: rawSummaryData.value?.tradeDateCnt?.toLocaleString() ?? '-', icon: Calendar, color: '#2196F3', bg: '#E3F2FD' },
  { label: '이용 역수', value: rawSummaryData.value?.stationCnt?.toLocaleString() ?? '-', icon: MapPin, color: '#FF9800', bg: '#FFF3E0' },
  { label: '이용 노선수', value: rawSummaryData.value?.routeCnt?.toLocaleString() ?? '-', icon: TrendingUp, color: '#9C27B0', bg: '#F3E5F5' },
  { label: '이용 카드수', value: rawSummaryData.value?.cardCnt?.toLocaleString() ?? '-', icon: CreditCard, color: '#F44336', bg: '#FFEBEE' },
]);

// ─── Highcharts ───
let Highcharts: any = null;
const charts: Record<string, any> = {};

async function loadHighcharts() {
  const hc = await import('highcharts');
  Highcharts = hc.default || hc;
  const heatmapMod = await import('highcharts/modules/heatmap');
  const HeatmapInit = heatmapMod.default || heatmapMod;
  if (typeof HeatmapInit === 'function') {
    HeatmapInit(Highcharts);
  }
}

function destroyChart(id: string) {
  if (charts[id]) {
    charts[id].destroy();
    delete charts[id];
  }
}

function destroyAllCharts() {
  Object.keys(charts).forEach(destroyChart);
}

function renderToEl(id: string, options: any) {
  destroyChart(id);
  const el = document.getElementById(id);
  if (!el || !Highcharts) return;
  charts[id] = Highcharts.chart(id, options);
}

const commonHighcharts = {
  credits: { enabled: false },
  title: { text: '' },
  accessibility: { enabled: false },
  tooltip: { style: { fontSize: '11px' } },
  plotOptions: { series: { animation: { duration: 500 } } },
};

const axisLabelStyle = { style: { color: '#9CA3AF', fontSize: '9px', fontWeight: '500' } };

function yLabelFormatter(this: any) {
  return this.value >= 1000 ? (this.value / 1000).toFixed(0) + 'K' : String(this.value);
}

// --- Daily Chart (Line) ---
async function renderDailyChart() {
  await nextTick();
  renderToEl('hc-daily', {
    ...commonHighcharts,
    chart: { type: 'line', backgroundColor: 'transparent', height: 200 },
    colors: ['#4CAF50'],
    xAxis: {
      categories: dailyData.value.map((d: any) => d.tradeDt ?? ''),
      labels: axisLabelStyle,
      lineColor: '#E5E7EB',
      tickLength: 0,
    },
    yAxis: {
      title: { text: '' },
      gridLineColor: '#F3F4F6',
      labels: { ...axisLabelStyle, formatter: yLabelFormatter },
    },
    legend: { enabled: false },
    plotOptions: {
      line: { marker: { radius: 3, fillColor: '#4CAF50', lineColor: '#4CAF50', lineWidth: 0 } },
      series: { animation: { duration: 500 } },
    },
    series: [{
      name: '총거래건수',
      data: dailyData.value.map((d: any) => d.totalCnt ?? 0),
    }],
  });
}

// --- Day of Week Chart (Column) ---
const DOW_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
async function renderDayOfWeekChart() {
  await nextTick();
  const data = dayOfWeekData.value.map((d: any) => ({
    y: d.avgTotalCnt ?? 0,
    color: (d.dayOfWeekNum === 1 || d.dayOfWeekNum === 7) ? '#E5E7EB' : '#4CAF50',
  }));
  renderToEl('hc-dayOfWeek', {
    ...commonHighcharts,
    chart: { type: 'column', backgroundColor: 'transparent', height: 200 },
    xAxis: {
      categories: dayOfWeekData.value.map((d: any) => DOW_LABELS[(d.dayOfWeekNum ?? 1) - 1] ?? String(d.dayOfWeekNum)),
      labels: axisLabelStyle,
      lineWidth: 0,
      tickLength: 0,
    },
    yAxis: { title: { text: '' }, visible: false },
    legend: { enabled: false },
    plotOptions: { column: { borderRadius: 4, pointWidth: undefined, groupPadding: 0.1 }, series: { animation: { duration: 500 } } },
    series: [{ name: '평균 이용건수', data, colorByPoint: true }],
  });
}

// --- Hourly Stats Chart (Area) ---
async function renderHourlyStatsChart() {
  await nextTick();
  renderToEl('hc-hourlyStats', {
    ...commonHighcharts,
    chart: { type: 'area', backgroundColor: 'transparent', height: 200 },
    colors: ['#4CAF50'],
    xAxis: {
      categories: hourlyStatsData.value.map((d: any) => `${d.hourRange}시`),
      labels: axisLabelStyle,
      lineColor: '#E5E7EB',
      tickLength: 0,
    },
    yAxis: {
      title: { text: '' },
      gridLineColor: '#F3F4F6',
      labels: { ...axisLabelStyle, formatter: yLabelFormatter },
    },
    legend: { enabled: false },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [[0, 'rgba(76,175,80,0.2)'], [1, 'rgba(76,175,80,0.02)']],
        },
        marker: { radius: 3 },
        lineWidth: 2,
      },
      series: { animation: { duration: 500 } },
    },
    series: [{
      name: '총 이용건수',
      data: hourlyStatsData.value.map((d: any) => d.totalCnt ?? 0),
    }],
  });
}

// --- Day Lines Chart (Grouped Column) ---
async function renderDayLinesChart() {
  await nextTick();
  const lineNos = [...new Set(dayLinesData.value.map((d: any) => d.lineNo))].sort();
  const dates = [...new Set(dayLinesData.value.map((d: any) => d.tradeDt))].sort();
  const lineColors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];

  const series = lineNos.map((line, i) => ({
    name: `${line}호선`,
    color: lineColors[i % lineColors.length],
    data: dates.map(dt => {
      const row = dayLinesData.value.find((d: any) => d.lineNo === line && d.tradeDt === dt);
      return row?.totalCnt ?? 0;
    }),
  }));

  renderToEl('hc-dayLines', {
    ...commonHighcharts,
    chart: { type: 'column', backgroundColor: 'transparent', height: 200 },
    xAxis: {
      categories: dates,
      labels: axisLabelStyle,
      lineWidth: 0,
      tickLength: 0,
    },
    yAxis: { title: { text: '' }, visible: false },
    legend: { enabled: true, itemStyle: { fontSize: '9px' }, align: 'center', verticalAlign: 'top' },
    plotOptions: { column: { borderRadius: 2, groupPadding: 0.1 }, series: { animation: { duration: 500 } } },
    series,
  });
}

// --- Ticket Type Donut (Pie with innerSize) ---
async function renderTicketTypeChart() {
  await nextTick();
  const colors = ['#4CAF50', '#81C784', '#C8E6C9', '#E8F5E9'];
  renderToEl('hc-ticketType', {
    ...commonHighcharts,
    chart: { type: 'pie', backgroundColor: 'transparent', height: 200 },
    plotOptions: {
      pie: {
        innerSize: '58%',
        dataLabels: { enabled: false },
        showInLegend: true,
        borderWidth: 0,
      },
      series: { animation: { duration: 500 } },
    },
    legend: { enabled: true, itemStyle: { fontSize: '9px' }, layout: 'horizontal', align: 'center', verticalAlign: 'bottom' },
    series: [{
      name: '건수',
      data: ticketTypeData.value.map((d: any, i: number) => ({
        name: d.ticketType ?? '',
        y: d.totalCnt ?? 0,
        color: colors[i % colors.length],
      })),
    }],
  });
}

// --- Card Type Donut (Pie with innerSize) ---
async function renderCardTypeChart() {
  await nextTick();
  const colors = ['#2196F3', '#64B5F6', '#BBDEFB', '#90CAF9', '#42A5F5'];
  renderToEl('hc-cardType', {
    ...commonHighcharts,
    chart: { type: 'pie', backgroundColor: 'transparent', height: 200 },
    plotOptions: {
      pie: {
        innerSize: '58%',
        dataLabels: { enabled: false },
        showInLegend: true,
        borderWidth: 0,
      },
      series: { animation: { duration: 500 } },
    },
    legend: { enabled: true, itemStyle: { fontSize: '9px' }, layout: 'horizontal', align: 'center', verticalAlign: 'bottom' },
    series: [{
      name: '건수',
      data: cardTypeData.value.map((d: any, i: number) => ({
        name: d.cardType ?? '',
        y: d.totalCnt ?? 0,
        color: colors[i % colors.length],
      })),
    }],
  });
}

// --- Top Boarding Stations (Horizontal Bar) ---
async function renderTopBoardingChart() {
  await nextTick();
  renderToEl('hc-topBoarding', {
    ...commonHighcharts,
    chart: { type: 'bar', backgroundColor: 'transparent', height: 200 },
    colors: ['#4CAF50'],
    xAxis: {
      categories: topBoardingData.value.map((d: any) => d.boardingStationNo ?? ''),
      labels: { style: { color: '#9CA3AF', fontSize: '9px' } },
      lineWidth: 0,
      tickLength: 0,
    },
    yAxis: {
      title: { text: '' },
      labels: axisLabelStyle,
    },
    legend: { enabled: false },
    plotOptions: { bar: { borderRadius: 4 }, series: { animation: { duration: 500 } } },
    series: [{
      name: '총 승차건수',
      data: topBoardingData.value.map((d: any) => d.totalBoardingCnt ?? 0),
    }],
  });
}

// --- Station Imbalance (Grouped Column) ---
async function renderStationImbalanceChart() {
  await nextTick();
  renderToEl('hc-stationImbalance', {
    ...commonHighcharts,
    chart: { type: 'column', backgroundColor: 'transparent', height: 200 },
    xAxis: {
      categories: stationImbalanceData.value.map((d: any) => d.stationNo ?? ''),
      labels: axisLabelStyle,
      lineWidth: 0,
      tickLength: 0,
    },
    yAxis: { title: { text: '' }, visible: false },
    legend: { enabled: true, itemStyle: { fontSize: '9px' }, align: 'center', verticalAlign: 'top' },
    plotOptions: { column: { borderRadius: 2, groupPadding: 0.1 }, series: { animation: { duration: 500 } } },
    series: [
      { name: '승차', color: '#4CAF50', data: stationImbalanceData.value.map((d: any) => d.totalBoardingCnt ?? 0) },
      { name: '하차', color: '#F44336', data: stationImbalanceData.value.map((d: any) => d.totalAlightingCnt ?? 0) },
    ],
  });
}

// --- Route Efficiency (Horizontal Bar) ---
async function renderRouteEfficiencyChart() {
  await nextTick();
  renderToEl('hc-routeEfficiency', {
    ...commonHighcharts,
    chart: { type: 'bar', backgroundColor: 'transparent', height: 200 },
    colors: ['#FF9800'],
    xAxis: {
      categories: routeEfficiencyData.value.map((d: any) => d.routeNo ?? ''),
      labels: { style: { color: '#9CA3AF', fontSize: '8px' } },
      lineWidth: 0,
      tickLength: 0,
    },
    yAxis: {
      title: { text: '' },
      labels: axisLabelStyle,
    },
    legend: { enabled: false },
    plotOptions: { bar: { borderRadius: 4 }, series: { animation: { duration: 500 } } },
    series: [{
      name: '총 이용건수',
      data: routeEfficiencyData.value.map((d: any) => d.totalCnt ?? 0),
    }],
  });
}

// --- Heatmap (Hour x Ticket Type) ---
async function renderHeatmapChart() {
  await nextTick();
  const ticketTypes = [...new Set(hourTicketCrossData.value.map((d: any) => d.ticketType))] as string[];
  const hours = Array.from({ length: 24 }, (_, h) => `${h}시`);

  const data: [number, number, number][] = [];
  ticketTypes.forEach((tt, yi) => {
    for (let h = 0; h < 24; h++) {
      const row = hourTicketCrossData.value.find((d: any) => d.ticketType === tt && d.hourRange === h);
      data.push([h, yi, row?.boardingCnt ?? 0]);
    }
  });

  renderToEl('hc-heatmap', {
    ...commonHighcharts,
    chart: { type: 'heatmap', backgroundColor: 'transparent', height: 200 },
    xAxis: {
      categories: hours,
      labels: axisLabelStyle,
      tickLength: 0,
    },
    yAxis: {
      categories: ticketTypes,
      labels: { style: { color: '#9CA3AF', fontSize: '9px' } },
      title: { text: '' },
      reversed: true,
    },
    colorAxis: {
      stops: [
        [0, '#F3F4F6'],
        [0.25, '#C8E6C9'],
        [0.5, '#81C784'],
        [0.75, '#4CAF50'],
        [1, '#1B5E20'],
      ],
      min: 0,
    },
    legend: { enabled: false },
    series: [{
      name: '승차건수',
      data,
      borderWidth: 1,
      borderColor: '#ffffff',
      dataLabels: { enabled: false },
    }],
  });
}

// --- Line Top Stations (Grouped Column) ---
async function renderLineTopStationsChart() {
  await nextTick();
  const lineNos = [...new Set(lineTopStationsData.value.map((d: any) => d.lineNo))].sort();
  const lineColors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];

  // Collect all station names
  const allStations = [...new Set(lineTopStationsData.value.map((d: any) => d.stationNo ?? ''))];

  const series = lineNos.map((line, i) => ({
    name: `${line}호선`,
    color: lineColors[i % lineColors.length],
    data: allStations.map(st => {
      const row = lineTopStationsData.value.find((d: any) => d.lineNo === line && d.stationNo === st);
      return row?.totalCnt ?? 0;
    }),
  }));

  renderToEl('hc-lineTopStations', {
    ...commonHighcharts,
    chart: { type: 'column', backgroundColor: 'transparent', height: 200 },
    xAxis: {
      categories: allStations,
      labels: { style: { color: '#9CA3AF', fontSize: '8px' } },
      lineWidth: 0,
      tickLength: 0,
    },
    yAxis: { title: { text: '' }, visible: false },
    legend: { enabled: true, itemStyle: { fontSize: '9px' }, align: 'center', verticalAlign: 'top' },
    plotOptions: { column: { borderRadius: 2, groupPadding: 0.1 }, series: { animation: { duration: 500 } } },
    series,
  });
}

// --- Free Fare Line Chart ---
async function renderFreeFareChart() {
  await nextTick();
  renderToEl('hc-freeFare', {
    ...commonHighcharts,
    chart: { type: 'line', backgroundColor: 'transparent', height: 200 },
    xAxis: {
      categories: freeFareData.value.map((d: any) => d.tradeDt ?? ''),
      labels: axisLabelStyle,
      lineColor: '#E5E7EB',
      tickLength: 0,
    },
    yAxis: {
      title: { text: '' },
      gridLineColor: '#F3F4F6',
      labels: { ...axisLabelStyle, formatter: yLabelFormatter },
    },
    legend: { enabled: true, itemStyle: { fontSize: '9px' }, align: 'center', verticalAlign: 'top' },
    plotOptions: {
      line: { marker: { radius: 3 }, lineWidth: 2 },
      series: { animation: { duration: 500 } },
    },
    series: [
      { name: '유료', color: '#4CAF50', data: freeFareData.value.map((d: any) => d.paidCnt ?? 0) },
      { name: '무임', color: '#F44336', data: freeFareData.value.map((d: any) => d.freeCnt ?? 0) },
    ],
  });
}

// ─── Render all charts after data is loaded ───
async function renderAllCharts() {
  await nextTick();
  if (!Highcharts) return;

  if (!loading.value.daily) renderDailyChart();
  if (!loading.value.dayOfWeek) renderDayOfWeekChart();
  if (!loading.value.hourlyStats) renderHourlyStatsChart();
  if (!loading.value.dayLines) renderDayLinesChart();
  if (!loading.value.ticketType) renderTicketTypeChart();
  if (!loading.value.cardType) renderCardTypeChart();
  if (!loading.value.topBoarding) renderTopBoardingChart();
  if (!loading.value.stationImbalance) renderStationImbalanceChart();
  if (!loading.value.routeEfficiency) renderRouteEfficiencyChart();
  if (!loading.value.hourTicketCross) renderHeatmapChart();
  if (!loading.value.lineTopStations) renderLineTopStationsChart();
  if (!loading.value.freeFare) renderFreeFareChart();
}

// Watch each loading flag individually to render chart when data arrives
watch(() => loading.value.daily, (v) => { if (!v && Highcharts) renderDailyChart(); });
watch(() => loading.value.dayOfWeek, (v) => { if (!v && Highcharts) renderDayOfWeekChart(); });
watch(() => loading.value.hourlyStats, (v) => { if (!v && Highcharts) renderHourlyStatsChart(); });
watch(() => loading.value.dayLines, (v) => { if (!v && Highcharts) renderDayLinesChart(); });
watch(() => loading.value.ticketType, (v) => { if (!v && Highcharts) renderTicketTypeChart(); });
watch(() => loading.value.cardType, (v) => { if (!v && Highcharts) renderCardTypeChart(); });
watch(() => loading.value.topBoarding, (v) => { if (!v && Highcharts) renderTopBoardingChart(); });
watch(() => loading.value.stationImbalance, (v) => { if (!v && Highcharts) renderStationImbalanceChart(); });
watch(() => loading.value.routeEfficiency, (v) => { if (!v && Highcharts) renderRouteEfficiencyChart(); });
watch(() => loading.value.hourTicketCross, (v) => { if (!v && Highcharts) renderHeatmapChart(); });
watch(() => loading.value.lineTopStations, (v) => { if (!v && Highcharts) renderLineTopStationsChart(); });
watch(() => loading.value.freeFare, (v) => { if (!v && Highcharts) renderFreeFareChart(); });

onMounted(async () => {
  mounted.value = true;
  await loadHighcharts();
  await fetchAll();
  await nextTick();
  renderAllCharts();
});

onBeforeUnmount(() => {
  destroyAllCharts();
});
</script>

<style scoped>
.dashboard-page {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100vh;
  overflow-y: auto;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  letter-spacing: -0.5px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bc-item { font-size: 12px; color: #9CA3AF; }
.bc-item.active { color: #4CAF50; font-weight: 500; }

.header-right { display: flex; align-items: center; }

.date-range-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  height: 32px;
  padding: 0 10px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 12px;
  color: #374151;
  background: #fff;
  cursor: pointer;
}

.date-input:focus { outline: none; border-color: #4CAF50; }

.date-sep { color: #9CA3AF; font-size: 13px; }

.refresh-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E5E7EB;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  color: #374151;
  transition: background 0.15s;
}
.refresh-btn:hover { background: #F9FAFB; }

.header-divider { height: 1px; background: #E5E7EB; flex-shrink: 0; }

/* Summary stats row */
.stats-row {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.stat-card {
  flex: 1;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.2;
}

.stat-label {
  font-size: 11px;
  color: #9CA3AF;
  margin-top: 2px;
}

/* Widget Grid */
.widget-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.widget-row {
  display: flex;
  gap: 16px;
}

.widget-card {
  flex: 1;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.widget-card--wide {
  flex: 2;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 44px;
  flex-shrink: 0;
  border-bottom: 1px solid #F3F4F6;
}

.widget-title {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.chart-body {
  flex: 1;
  padding: 8px 16px 12px;
  min-height: 0;
}

.chart-body.chart-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-skeleton {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (max-width: 1200px) {
  .widget-row { flex-wrap: wrap; }
  .widget-card { min-width: calc(50% - 8px); }
  .stats-row { flex-wrap: wrap; }
  .stat-card { min-width: calc(50% - 8px); }
}

@media (max-width: 768px) {
  .dashboard-page { padding: 16px; }
  .widget-row, .stats-row { flex-direction: column; }
  .content-header { flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>
