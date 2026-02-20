<template>
  <div class="dashboard-page">
    <!-- Header -->
    <div class="content-header">
      <div class="header-left">
        <h1 class="page-title">교통 데이터 대시보드</h1>
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
            <ClientOnly>
              <div v-if="loading.daily" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="line" height="200"
                :options="dailyChartOptions" :series="dailyChartSeries" />
            </ClientOnly>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">요일별 이용 통계</span>
          </div>
          <div class="chart-body">
            <ClientOnly>
              <div v-if="loading.dayOfWeek" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="bar" height="200"
                :options="dayOfWeekChartOptions" :series="dayOfWeekChartSeries" />
            </ClientOnly>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">시간대별 이용 통계 (피크타임)</span>
          </div>
          <div class="chart-body">
            <ClientOnly>
              <div v-if="loading.hourlyStats" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="area" height="200"
                :options="hourlyStatsChartOptions" :series="hourlyStatsChartSeries" />
            </ClientOnly>
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
            <ClientOnly>
              <div v-if="loading.dayLines" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="bar" height="200"
                :options="dayLinesChartOptions" :series="dayLinesChartSeries" />
            </ClientOnly>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">권종유형별 분석</span>
          </div>
          <div class="chart-body chart-center">
            <ClientOnly>
              <div v-if="loading.ticketType" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="donut" height="200"
                :options="ticketTypeChartOptions" :series="ticketTypeChartSeries" />
            </ClientOnly>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">카드유형별 이용 현황</span>
          </div>
          <div class="chart-body chart-center">
            <ClientOnly>
              <div v-if="loading.cardType" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="donut" height="200"
                :options="cardTypeChartOptions" :series="cardTypeChartSeries" />
            </ClientOnly>
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
            <ClientOnly>
              <div v-if="loading.topBoarding" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="bar" height="200"
                :options="topBoardingChartOptions" :series="topBoardingChartSeries" />
            </ClientOnly>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">역별 승하차 불균형 분석</span>
          </div>
          <div class="chart-body">
            <ClientOnly>
              <div v-if="loading.stationImbalance" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="bar" height="200"
                :options="stationImbalanceChartOptions" :series="stationImbalanceChartSeries" />
            </ClientOnly>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">노선별 효율 분석 (TOP 20)</span>
          </div>
          <div class="chart-body">
            <ClientOnly>
              <div v-if="loading.routeEfficiency" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="bar" height="200"
                :options="routeEfficiencyChartOptions" :series="routeEfficiencyChartSeries" />
            </ClientOnly>
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
            <ClientOnly>
              <div v-if="loading.hourTicketCross" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="heatmap" height="200"
                :options="heatmapChartOptions" :series="heatmapChartSeries" />
            </ClientOnly>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">호선별 TOP 역</span>
          </div>
          <div class="chart-body">
            <ClientOnly>
              <div v-if="loading.lineTopStations" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="bar" height="200"
                :options="lineTopStationsChartOptions" :series="lineTopStationsChartSeries" />
            </ClientOnly>
          </div>
        </div>

        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">무임 운임 면제 현황</span>
          </div>
          <div class="chart-body">
            <ClientOnly>
              <div v-if="loading.freeFare" class="loading-skeleton"></div>
              <apexchart v-else-if="mounted" type="line" height="200"
                :options="freeFareChartOptions" :series="freeFareChartSeries" />
            </ClientOnly>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
  // Reset loading
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

onMounted(async () => {
  mounted.value = true;
  await fetchAll();
});

// --- Summary Cards ---
const summaryCards = computed(() => [
  { label: '총 거래건수', value: rawSummaryData.value?.totalCnt?.toLocaleString() ?? '-', icon: BarChart2, color: '#4CAF50', bg: '#E8F5E9' },
  { label: '거래 일수', value: rawSummaryData.value?.tradeDateCnt?.toLocaleString() ?? '-', icon: Calendar, color: '#2196F3', bg: '#E3F2FD' },
  { label: '이용 역수', value: rawSummaryData.value?.stationCnt?.toLocaleString() ?? '-', icon: MapPin, color: '#FF9800', bg: '#FFF3E0' },
  { label: '이용 노선수', value: rawSummaryData.value?.routeCnt?.toLocaleString() ?? '-', icon: TrendingUp, color: '#9C27B0', bg: '#F3E5F5' },
  { label: '이용 카드수', value: rawSummaryData.value?.cardCnt?.toLocaleString() ?? '-', icon: CreditCard, color: '#F44336', bg: '#FFEBEE' },
]);

// Common chart options
const commonOptions = {
  chart: { toolbar: { show: false }, background: 'transparent' },
  dataLabels: { enabled: false },
  grid: { borderColor: '#F3F4F6', yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
  tooltip: { theme: 'light' },
};

const axisLabelStyle = { style: { colors: '#9CA3AF', fontSize: '9px', fontWeight: 500 } };

// --- Daily Chart ---
const dailyChartSeries = computed(() => [{
  name: '총거래건수',
  data: dailyData.value.map((d: any) => d.totalCnt ?? 0),
}]);
const dailyChartOptions = computed(() => ({
  ...commonOptions,
  colors: ['#4CAF50'],
  stroke: { width: 2, curve: 'smooth' },
  markers: { size: 4, colors: ['#4CAF50'], strokeColors: '#4CAF50', strokeWidth: 0 },
  xaxis: {
    categories: dailyData.value.map((d: any) => d.tradeDt ?? ''),
    labels: axisLabelStyle,
    axisBorder: { color: '#E5E7EB' },
    axisTicks: { show: false },
  },
  yaxis: { labels: { ...axisLabelStyle, formatter: (v: number) => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : String(v) } },
}));

// --- Day of Week Chart ---
const DOW_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const dayOfWeekChartSeries = computed(() => [{
  name: '평균 이용건수',
  data: dayOfWeekData.value.map((d: any) => ({
    x: DOW_LABELS[(d.dayOfWeekNum ?? 1) - 1] ?? String(d.dayOfWeekNum),
    y: d.avgTotalCnt ?? 0,
    fillColor: (d.dayOfWeekNum === 1 || d.dayOfWeekNum === 7) ? '#E5E7EB' : '#4CAF50',
  })),
}]);
const dayOfWeekChartOptions = computed(() => ({
  ...commonOptions,
  colors: ['#4CAF50'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '55%', distributed: false } },
  xaxis: { labels: axisLabelStyle, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { show: false },
}));

// --- Hourly Stats Chart ---
const hourlyStatsChartSeries = computed(() => [{
  name: '총 이용건수',
  data: hourlyStatsData.value.map((d: any) => d.totalCnt ?? 0),
}]);
const hourlyStatsChartOptions = computed(() => ({
  ...commonOptions,
  colors: ['#4CAF50'],
  stroke: { width: 2, curve: 'smooth' },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0.02, stops: [0, 90, 100] } },
  xaxis: {
    categories: hourlyStatsData.value.map((d: any) => `${d.hourRange}시`),
    labels: axisLabelStyle,
    axisBorder: { color: '#E5E7EB' },
    axisTicks: { show: false },
  },
  yaxis: { labels: { ...axisLabelStyle, formatter: (v: number) => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : String(v) } },
}));

// --- Day Lines Chart (grouped by line) ---
const dayLinesChartSeries = computed(() => {
  const lineNos = [...new Set(dayLinesData.value.map((d: any) => d.lineNo))].sort();
  const dates = [...new Set(dayLinesData.value.map((d: any) => d.tradeDt))].sort();
  const lineColors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
  return lineNos.map((line, i) => ({
    name: `${line}호선`,
    data: dates.map(dt => {
      const row = dayLinesData.value.find((d: any) => d.lineNo === line && d.tradeDt === dt);
      return row?.totalCnt ?? 0;
    }),
    color: lineColors[i % lineColors.length],
  }));
});
const dayLinesChartOptions = computed(() => {
  const dates = [...new Set(dayLinesData.value.map((d: any) => d.tradeDt))].sort();
  return {
    ...commonOptions,
    chart: { ...commonOptions.chart, stacked: false },
    plotOptions: { bar: { columnWidth: '60%', borderRadius: 2 } },
    xaxis: { categories: dates, labels: axisLabelStyle, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { show: false },
    legend: { show: true, fontSize: '9px', position: 'top' },
  };
});

// --- Ticket Type Donut ---
const ticketTypeChartSeries = computed(() => ticketTypeData.value.map((d: any) => d.totalCnt ?? 0));
const ticketTypeChartOptions = computed(() => ({
  ...commonOptions,
  colors: ['#4CAF50', '#81C784', '#C8E6C9', '#E8F5E9'],
  labels: ticketTypeData.value.map((d: any) => d.ticketType ?? ''),
  plotOptions: { pie: { donut: { size: '58%', labels: { show: true, total: { show: true, fontSize: '14px', fontWeight: 600, color: '#374151', formatter: () => ticketTypeData.value.length + '종' } } } } },
  legend: { show: true, fontSize: '9px', position: 'bottom' },
  stroke: { show: false },
}));

// --- Card Type Donut ---
const cardTypeChartSeries = computed(() => cardTypeData.value.map((d: any) => d.totalCnt ?? 0));
const cardTypeChartOptions = computed(() => ({
  ...commonOptions,
  colors: ['#2196F3', '#64B5F6', '#BBDEFB', '#90CAF9', '#42A5F5'],
  labels: cardTypeData.value.map((d: any) => d.cardType ?? ''),
  plotOptions: { pie: { donut: { size: '58%', labels: { show: true, total: { show: true, fontSize: '14px', fontWeight: 600, color: '#374151', formatter: () => cardTypeData.value.length + '종' } } } } },
  legend: { show: true, fontSize: '9px', position: 'bottom' },
  stroke: { show: false },
}));

// --- Top Boarding Stations (horizontal bar) ---
const topBoardingChartSeries = computed(() => [{
  name: '총 승차건수',
  data: topBoardingData.value.map((d: any) => d.totalBoardingCnt ?? 0),
}]);
const topBoardingChartOptions = computed(() => ({
  ...commonOptions,
  colors: ['#4CAF50'],
  plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } },
  xaxis: {
    categories: topBoardingData.value.map((d: any) => d.boardingStationNo ?? ''),
    labels: axisLabelStyle,
  },
  yaxis: { labels: { style: { colors: '#9CA3AF', fontSize: '9px' } } },
}));

// --- Station Imbalance ---
const stationImbalanceChartSeries = computed(() => [
  { name: '승차', data: stationImbalanceData.value.map((d: any) => d.totalBoardingCnt ?? 0) },
  { name: '하차', data: stationImbalanceData.value.map((d: any) => d.totalAlightingCnt ?? 0) },
]);
const stationImbalanceChartOptions = computed(() => ({
  ...commonOptions,
  colors: ['#4CAF50', '#F44336'],
  plotOptions: { bar: { columnWidth: '60%', borderRadius: 2 } },
  xaxis: {
    categories: stationImbalanceData.value.map((d: any) => d.stationNo ?? ''),
    labels: axisLabelStyle,
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { show: false },
  legend: { show: true, fontSize: '9px', position: 'top' },
}));

// --- Route Efficiency (horizontal bar) ---
const routeEfficiencyChartSeries = computed(() => [{
  name: '총 이용건수',
  data: routeEfficiencyData.value.map((d: any) => d.totalCnt ?? 0),
}]);
const routeEfficiencyChartOptions = computed(() => ({
  ...commonOptions,
  colors: ['#FF9800'],
  plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '55%' } },
  xaxis: {
    categories: routeEfficiencyData.value.map((d: any) => d.routeNo ?? ''),
    labels: axisLabelStyle,
  },
  yaxis: { labels: { style: { colors: '#9CA3AF', fontSize: '8px' } } },
}));

// --- Heatmap (Hour x Ticket Type) ---
const heatmapChartSeries = computed(() => {
  const ticketTypes = [...new Set(hourTicketCrossData.value.map((d: any) => d.ticketType))];
  return ticketTypes.map(tt => ({
    name: tt,
    data: Array.from({ length: 24 }, (_, h) => {
      const row = hourTicketCrossData.value.find((d: any) => d.ticketType === tt && d.hourRange === h);
      return { x: `${h}시`, y: row?.boardingCnt ?? 0 };
    }),
  }));
});
const heatmapChartOptions = computed(() => ({
  ...commonOptions,
  colors: ['#4CAF50'],
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      colorScale: {
        ranges: [
          { from: 0, to: 0, color: '#F3F4F6', name: '없음' },
          { from: 1, to: 10000, color: '#C8E6C9', name: '낮음' },
          { from: 10001, to: 50000, color: '#81C784', name: '보통' },
          { from: 50001, to: 200000, color: '#4CAF50', name: '높음' },
          { from: 200001, to: 9999999, color: '#1B5E20', name: '매우 높음' },
        ],
      },
    },
  },
  xaxis: { labels: axisLabelStyle },
  legend: { show: false },
}));



// --- Line Top Stations ---
const lineTopStationsChartSeries = computed(() => {
  const lineNos = [...new Set(lineTopStationsData.value.map((d: any) => d.lineNo))].sort();
  const lineColors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
  return lineNos.map((line, i) => ({
    name: `${line}호선`,
    data: lineTopStationsData.value
      .filter((d: any) => d.lineNo === line)
      .map((d: any) => ({ x: d.stationNo ?? '', y: d.totalCnt ?? 0 })),
    color: lineColors[i % lineColors.length],
  }));
});
const lineTopStationsChartOptions = computed(() => ({
  ...commonOptions,
  plotOptions: { bar: { columnWidth: '55%', borderRadius: 2 } },
  xaxis: { labels: { style: { colors: '#9CA3AF', fontSize: '8px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { show: false },
  legend: { show: true, fontSize: '9px', position: 'top' },
}));

// --- Free Fare Line Chart ---
const freeFareChartSeries = computed(() => [
  { name: '유료', data: freeFareData.value.map((d: any) => d.paidCnt ?? 0) },
  { name: '무임', data: freeFareData.value.map((d: any) => d.freeCnt ?? 0) },
]);
const freeFareChartOptions = computed(() => ({
  ...commonOptions,
  colors: ['#4CAF50', '#F44336'],
  stroke: { width: 2, curve: 'smooth' },
  markers: { size: 4 },
  xaxis: {
    categories: freeFareData.value.map((d: any) => d.tradeDt ?? ''),
    labels: axisLabelStyle,
    axisBorder: { color: '#E5E7EB' },
    axisTicks: { show: false },
  },
  yaxis: { labels: { ...axisLabelStyle, formatter: (v: number) => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : String(v) } },
  legend: { show: true, fontSize: '9px', position: 'top' },
}));
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
