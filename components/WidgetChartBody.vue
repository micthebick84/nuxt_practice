<template>
  <div class="chart-body">
    <!-- No config state -->
    <div v-if="!widget.dataApi" class="chart-placeholder">
      <BarChart2 :size="32" color="#9CA3AF" />
      <p>설정 버튼을 눌러 차트를 구성하세요</p>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="chart-loading">
      <q-spinner color="green" size="24px" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="chart-error">
      <AlertCircle :size="24" color="#EF4444" />
      <p>{{ error }}</p>
    </div>

    <!-- Highcharts -->
    <div v-else-if="chartOptions" :id="chartId" :style="{ width: '100%', height: height + 'px' }"></div>

    <!-- Table type -->
    <div v-else-if="widget.chartType === 'table' && tableData.length > 0" class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="col in tableColumns" :key="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in tableData" :key="idx">
            <td v-for="col in tableColumns" :key="col">{{ row[col] ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { BarChart2, AlertCircle } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

interface WidgetItem {
  tempId: string;
  itemTitle: string;
  chartType: string;
  xAxisField: string;
  yAxisFields: string;
  dataApi: string;
}

const props = defineProps<{
  widget: WidgetItem;
  startDate: string;
  endDate: string;
  height: number;
  refreshKey?: number;
}>();

const authStore = useAuthStore();
function authHeaders() {
  const token = authStore.accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const uid = Math.random().toString(36).slice(2, 9);
const chartId = `hc-${props.widget.tempId}-${uid}`;
const loading = ref(false);
const error = ref('');
const chartOptions = ref<any>(null);
const tableData = ref<any[]>([]);
const tableColumns = ref<string[]>([]);
let hcChart: any = null;

// ──── Data Fetching ────
async function fetchData() {
  if (!props.widget.dataApi) return;
  loading.value = true;
  error.value = '';
  chartOptions.value = null;
  tableData.value = [];

  try {
    const params = new URLSearchParams({
      startDate: props.startDate,
      endDate: props.endDate,
    });
    const res = await $fetch<{ success: boolean; data: any[] }>(
      `${props.widget.dataApi}?${params.toString()}`,
      { headers: authHeaders() },
    );

    if (!res.success || !res.data) throw new Error('데이터를 불러오지 못했습니다.');

    const raw = res.data;
    buildChart(raw);
  } catch (e: any) {
    error.value = e?.data?.error || e?.message || '데이터 로드 오류';
  } finally {
    loading.value = false;
  }
}

function buildChart(raw: any[]) {
  if (!raw || raw.length === 0) {
    error.value = '조회된 데이터가 없습니다.';
    return;
  }

  const yFields: { field: string; label: string }[] = (() => {
    try {
      const p = JSON.parse(props.widget.yAxisFields || '[]');
      return Array.isArray(p) ? p.filter((y) => y.field) : [];
    } catch {
      return [];
    }
  })();

  if (props.widget.chartType === 'table') {
    tableColumns.value = Object.keys(raw[0]);
    tableData.value = raw;
    return;
  }

  const xField = props.widget.xAxisField;
  const categories = raw.map((r) => String(r[xField] ?? ''));

  const COLORS = ['#4CAF50', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (props.widget.chartType === 'pie') {
    const yField = yFields[0]?.field || Object.keys(raw[0]).find((k) => typeof raw[0][k] === 'number') || '';
    chartOptions.value = {
      chart: { type: 'pie', backgroundColor: 'transparent', height: props.height },
      title: { text: '' },
      credits: { enabled: false },
      legend: { enabled: true },
      plotOptions: {
        pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: true, format: '{point.name}: {point.percentage:.1f}%' } },
      },
      series: [{
        name: yFields[0]?.label || yField,
        data: raw.map((r, i) => ({
          name: String(r[xField] ?? categories[i] ?? `항목 ${i + 1}`),
          y: Number(r[yField] ?? 0),
          color: COLORS[i % COLORS.length],
        })),
      }],
    };
  } else if (props.widget.chartType === 'gauge') {
    const yField = yFields[0]?.field || '';
    const val = raw.reduce((sum, r) => sum + Number(r[yField] ?? 0), 0);
    const maxVal = Math.max(val * 1.5, 100);
    chartOptions.value = {
      chart: { type: 'gauge', backgroundColor: 'transparent', height: props.height },
      title: { text: '' },
      credits: { enabled: false },
      pane: { startAngle: -150, endAngle: 150, background: [{ backgroundColor: '#F3F4F6', borderWidth: 0, innerRadius: '60%', outerRadius: '100%' }] },
      yAxis: { min: 0, max: maxVal, title: { text: yFields[0]?.label || yField } },
      series: [{ name: yFields[0]?.label || yField, data: [val], dataLabels: { format: '{y}' } }],
    };
  } else {
    const hcType = props.widget.chartType === 'area' ? 'area'
      : props.widget.chartType === 'line' ? 'line' : 'column';

    const series = yFields.length > 0
      ? yFields.map((yf, idx) => ({
          name: yf.label || yf.field,
          data: raw.map((r) => Number(r[yf.field] ?? 0)),
          color: COLORS[idx % COLORS.length],
        }))
      : [{
          name: '값',
          data: raw.map((r) => {
            const numKeys = Object.keys(r).filter((k) => typeof r[k] === 'number');
            return Number(r[numKeys[0]] ?? 0);
          }),
          color: COLORS[0],
        }];

    chartOptions.value = {
      chart: { type: hcType, backgroundColor: 'transparent', height: props.height },
      title: { text: '' },
      credits: { enabled: false },
      xAxis: { categories, labels: { style: { fontSize: '11px' } } },
      yAxis: { title: { text: '' }, gridLineColor: '#F3F4F6' },
      legend: { enabled: series.length > 1 },
      plotOptions: {
        column: { borderRadius: 4 },
        area: { fillOpacity: 0.15 },
        series: { animation: { duration: 600 } },
      },
      series,
      tooltip: { shared: true },
    };
  }
}

// ──── Highcharts rendering ────
async function renderChart() {
  if (!chartOptions.value || props.widget.chartType === 'table') return;
  await nextTick();
  await nextTick();
  const el = document.getElementById(chartId);
  if (!el) return;

  if (hcChart) {
    hcChart.destroy();
    hcChart = null;
  }

  const hcModule = await import('highcharts');
  const Highcharts = hcModule.default || hcModule;
  if (props.widget.chartType === 'gauge') {
    const moreModule = await import('highcharts/highcharts-more');
    const gaugeModule = await import('highcharts/modules/solid-gauge');
    const HighchartsMore = moreModule.default || moreModule;
    const HighchartsGauge = gaugeModule.default || gaugeModule;
    if (typeof HighchartsMore === 'function') HighchartsMore(Highcharts);
    if (typeof HighchartsGauge === 'function') HighchartsGauge(Highcharts);
  }

  hcChart = Highcharts.chart(chartId, chartOptions.value);
}

watch(chartOptions, async (val) => {
  if (val) await renderChart();
});

watch(
  [
    () => props.startDate,
    () => props.endDate,
    () => props.widget.dataApi,
    () => props.widget.chartType,
    () => props.widget.xAxisField,
    () => props.widget.yAxisFields,
    () => props.refreshKey,
  ],
  () => {
    fetchData();
  },
);

onMounted(() => {
  fetchData();
});

onBeforeUnmount(() => {
  if (hcChart) {
    hcChart.destroy();
    hcChart = null;
  }
});
</script>

<style scoped>
.chart-body {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chart-placeholder, .chart-loading, .chart-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #9CA3AF;
  text-align: center;
  padding: 16px;
}
.chart-placeholder p, .chart-error p { font-size: 12px; margin: 0; }
.chart-error { color: #EF4444; }

.table-wrapper { width: 100%; height: 100%; overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.data-table th {
  background: #F9FAFB;
  padding: 8px 12px;
  text-align: left;
  color: #6B7280;
  font-weight: 600;
  border-bottom: 1px solid #E5E7EB;
  white-space: nowrap;
}
.data-table td {
  padding: 8px 12px;
  color: #374151;
  border-bottom: 1px solid #F3F4F6;
  white-space: nowrap;
}
.data-table tr:hover td { background: #F9FAFB; }
</style>
