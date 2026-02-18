<template>
  <div class="traffic-page">
    <!-- Content Header -->
    <div class="content-header">
      <h1 class="page-title">Dashboard</h1>
      <div class="breadcrumb">
        <span class="bc-item">Home</span>
        <ChevronRight :size="14" color="#D1D5DB" />
        <span class="bc-item active">Dashboard</span>
      </div>
    </div>

    <!-- Header Divider -->
    <div class="header-divider"></div>

    <!-- Action Bar -->
    <div class="action-bar">
      <button class="action-btn">
        <Search :size="14" color="#374151" />
        <span>Search</span>
      </button>
      <button class="action-btn">
        <SlidersHorizontal :size="14" color="#374151" />
        <span>Settings</span>
      </button>
    </div>

    <!-- Widget Grid -->
    <div class="widget-grid">
      <!-- Row 1 -->
      <div class="widget-row">
        <!-- Bar Chart -->
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">Bar Chart</span>
            <div class="widget-actions">
              <button class="widget-action-btn"><RefreshCw :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><Maximize2 :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><SettingsIcon :size="14" color="#9CA3AF" /></button>
            </div>
          </div>
          <div class="chart-body">
            <ClientOnly>
              <apexchart
                v-if="mounted"
                type="bar"
                height="200"
                :options="barChartOptions"
                :series="barChartSeries"
              />
            </ClientOnly>
          </div>
        </div>

        <!-- Pie Chart (Donut) -->
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">Pie Chart</span>
            <div class="widget-actions">
              <button class="widget-action-btn"><RefreshCw :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><Maximize2 :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><SettingsIcon :size="14" color="#9CA3AF" /></button>
            </div>
          </div>
          <div class="chart-body chart-center">
            <ClientOnly>
              <apexchart
                v-if="mounted"
                type="donut"
                height="200"
                :options="donutChartOptions"
                :series="donutChartSeries"
              />
            </ClientOnly>
          </div>
        </div>

        <!-- Line Chart -->
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">Line Chart</span>
            <div class="widget-actions">
              <button class="widget-action-btn"><RefreshCw :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><Maximize2 :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><SettingsIcon :size="14" color="#9CA3AF" /></button>
            </div>
          </div>
          <div class="chart-body">
            <ClientOnly>
              <apexchart
                v-if="mounted"
                type="line"
                height="200"
                :options="lineChartOptions"
                :series="lineChartSeries"
              />
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="widget-row">
        <!-- Gauge (RadialBar) -->
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">Gauge</span>
            <div class="widget-actions">
              <button class="widget-action-btn"><RefreshCw :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><Maximize2 :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><SettingsIcon :size="14" color="#9CA3AF" /></button>
            </div>
          </div>
          <div class="chart-body chart-center">
            <ClientOnly>
              <apexchart
                v-if="mounted"
                type="radialBar"
                height="220"
                :options="gaugeChartOptions"
                :series="gaugeChartSeries"
              />
            </ClientOnly>
          </div>
        </div>

        <!-- Table -->
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">Table</span>
            <div class="widget-actions">
              <button class="widget-action-btn"><RefreshCw :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><Maximize2 :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><SettingsIcon :size="14" color="#9CA3AF" /></button>
            </div>
          </div>
          <div class="table-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Visitors</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in tableData" :key="row.source">
                  <td class="td-source">{{ row.source }}</td>
                  <td class="td-visitors">{{ row.visitors }}</td>
                  <td class="td-rate" :class="{ green: row.highlight }">{{ row.rate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Area Chart -->
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">Area Chart</span>
            <div class="widget-actions">
              <button class="widget-action-btn"><RefreshCw :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><Maximize2 :size="14" color="#9CA3AF" /></button>
              <button class="widget-action-btn"><SettingsIcon :size="14" color="#9CA3AF" /></button>
            </div>
          </div>
          <div class="chart-body">
            <ClientOnly>
              <apexchart
                v-if="mounted"
                type="area"
                height="200"
                :options="areaChartOptions"
                :series="areaChartSeries"
              />
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
  Search,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  Maximize2,
  Settings as SettingsIcon,
} from 'lucide-vue-next';

definePageMeta({
  layout: 'dashboard',
});

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

// --- Bar Chart ---
const barChartSeries = ref([
  {
    name: 'Visitors',
    data: [
      { x: 'Mon', y: 3200, fillColor: '#4CAF50' },
      { x: 'Tue', y: 4100, fillColor: '#4CAF50' },
      { x: 'Wed', y: 2800, fillColor: '#4CAF50' },
      { x: 'Thu', y: 5100, fillColor: '#4CAF50' },
      { x: 'Fri', y: 4200, fillColor: '#4CAF50' },
      { x: 'Sat', y: 1800, fillColor: '#E5E7EB' },
      { x: 'Sun', y: 1200, fillColor: '#E5E7EB' },
    ],
  },
]);

const barChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    background: 'transparent',
  },
  colors: ['#4CAF50'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '55%',
      distributed: false,
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    labels: { style: { colors: '#9CA3AF', fontSize: '10px', fontWeight: 500 } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { show: false },
  grid: { show: false },
  tooltip: { theme: 'light' },
  legend: { show: false },
}));

// --- Donut Chart ---
const donutChartSeries = ref([42, 28, 30]);

const donutChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    background: 'transparent',
  },
  colors: ['#4CAF50', '#81C784', '#E5E7EB'],
  plotOptions: {
    pie: {
      donut: {
        size: '58%',
        labels: {
          show: true,
          name: { show: false },
          value: { show: false },
          total: {
            show: true,
            label: '68%',
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'JetBrains Mono, monospace',
            color: '#374151',
            formatter: () => '68%',
          },
        },
      },
    },
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { show: false },
  tooltip: { enabled: false },
}));

// --- Line Chart ---
const lineChartSeries = ref([
  {
    name: 'Users',
    data: [120, 280, 350, 250, 420, 450],
  },
]);

const lineChartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: { show: false },
    background: 'transparent',
  },
  colors: ['#4CAF50'],
  stroke: { width: 2, curve: 'smooth' },
  markers: {
    size: 4,
    colors: ['#4CAF50'],
    strokeColors: '#4CAF50',
    strokeWidth: 0,
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    labels: { style: { colors: '#9CA3AF', fontSize: '9px', fontWeight: 500 } },
    axisBorder: { color: '#E5E7EB' },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: '#9CA3AF', fontSize: '9px' },
      formatter: (val: number) => val.toString(),
    },
  },
  grid: {
    borderColor: '#F3F4F6',
    strokeDashArray: 0,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  },
  tooltip: { theme: 'light' },
}));

// --- Gauge (Radial Bar) ---
const gaugeChartSeries = ref([75]);

const gaugeChartOptions = computed(() => ({
  chart: {
    type: 'radialBar',
    background: 'transparent',
  },
  colors: ['#4CAF50'],
  plotOptions: {
    radialBar: {
      startAngle: -180,
      endAngle: 0,
      hollow: { size: '60%' },
      track: {
        background: '#E5E7EB',
        strokeWidth: '100%',
        startAngle: -180,
        endAngle: 0,
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: '11px',
          color: '#9CA3AF',
          offsetY: 20,
          fontFamily: 'Inter, sans-serif',
        },
        value: {
          show: true,
          fontSize: '28px',
          fontWeight: 600,
          color: '#374151',
          offsetY: -10,
          fontFamily: 'JetBrains Mono, monospace',
        },
      },
    },
  },
  labels: ['Performance'],
  stroke: { lineCap: 'butt' },
}));

// --- Table Data ---
const tableData = ref([
  { source: 'Google', visitors: '4,521', rate: '42.3%', highlight: true },
  { source: 'Direct', visitors: '2,108', rate: '28.1%', highlight: false },
  { source: 'Twitter', visitors: '1,432', rate: '15.7%', highlight: false },
  { source: 'GitHub', visitors: '987', rate: '13.9%', highlight: false },
]);

// --- Area Chart ---
const areaChartSeries = ref([
  {
    name: 'Page Views',
    data: [4500, 5200, 4800, 6200, 7100, 8400],
  },
]);

const areaChartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    background: 'transparent',
  },
  colors: ['#4CAF50'],
  stroke: { width: 2, curve: 'smooth' },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.2,
      opacityTo: 0.02,
      stops: [0, 90, 100],
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    labels: { style: { colors: '#9CA3AF', fontSize: '9px', fontWeight: 500 } },
    axisBorder: { color: '#E5E7EB' },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: '#9CA3AF', fontSize: '9px' },
      formatter: (val: number) => {
        if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
        return val.toString();
      },
    },
  },
  grid: {
    borderColor: '#F3F4F6',
    strokeDashArray: 0,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  },
  tooltip: { theme: 'light' },
}));
</script>

<style scoped>
.traffic-page {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100vh;
  overflow-y: auto;
}

/* Content Header */
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  flex-shrink: 0;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  letter-spacing: -0.5px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bc-item {
  font-size: 13px;
  color: #9CA3AF;
}

.bc-item.active {
  color: #4CAF50;
  font-weight: 500;
}

/* Divider */
.header-divider {
  height: 1px;
  background: #E5E7EB;
  flex-shrink: 0;
}

/* Action Bar */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 36px;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 32px;
  border: 1px solid #E5E7EB;
  background: #ffffff;
  border-radius: 6px;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: background 0.15s;
}

.action-btn:hover {
  background: #F9FAFB;
}

/* Widget Grid */
.widget-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.widget-row {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.widget-card {
  flex: 1;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* Widget Header */
.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 48px;
  flex-shrink: 0;
  border-bottom: 1px solid #F3F4F6;
}

.widget-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.widget-actions {
  display: flex;
  gap: 4px;
}

.widget-action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
}

.widget-action-btn:hover {
  background: #F3F4F6;
}

/* Chart Body */
.chart-body {
  flex: 1;
  padding: 16px;
  min-height: 0;
}

.chart-body.chart-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Table */
.table-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead tr {
  background: #F9FAFB;
}

.data-table th {
  text-align: left;
  padding: 0 16px;
  height: 36px;
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #F3F4F6;
}

.data-table td {
  padding: 0 16px;
  height: 36px;
  font-size: 12px;
  border-bottom: 1px solid #F3F4F6;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.td-source {
  color: #374151;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.td-visitors {
  color: #374151;
  font-family: 'JetBrains Mono', monospace;
}

.td-rate {
  color: #374151;
  font-family: 'JetBrains Mono', monospace;
}

.td-rate.green {
  color: #4CAF50;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1200px) {
  .widget-row {
    flex-wrap: wrap;
  }
  .widget-card {
    min-width: calc(50% - 10px);
  }
}

@media (max-width: 768px) {
  .traffic-page {
    padding: 16px;
  }
  .widget-row {
    flex-direction: column;
  }
  .widget-card {
    min-width: 100%;
  }
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    gap: 8px;
  }
}
</style>
