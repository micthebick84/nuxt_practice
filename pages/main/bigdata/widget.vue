<template>
  <div class="widget-page">
    <!-- Header -->
    <div class="content-header">
      <div class="header-left">
        <h1 class="page-title">위젯 대시보드</h1>
        <div class="breadcrumb">
          <NuxtLink to="/dashboard" class="bc-item bc-link">Home</NuxtLink>
          <ChevronRight :size="14" color="#D1D5DB" />
          <span class="bc-item">빅데이터</span>
          <ChevronRight :size="14" color="#D1D5DB" />
          <span class="bc-item active">위젯 대시보드</span>
        </div>
      </div>
      <div class="header-right">
        <!-- 날짜 조건 -->
        <div class="date-range-picker">
          <input type="date" v-model="startDate" class="date-input" />
          <span class="date-sep">~</span>
          <input type="date" v-model="endDate" class="date-input" />
        </div>
        <!-- 모드 전환 -->
        <div class="mode-toggle">
          <label class="mode-label" :class="{ active: mode === 'view' }">
            <input type="radio" v-model="mode" value="view" />
            <span>조회모드</span>
          </label>
          <label class="mode-label" :class="{ active: mode === 'edit' }">
            <input type="radio" v-model="mode" value="edit" />
            <span>관리모드</span>
          </label>
        </div>
        <!-- 관리모드 버튼 -->
        <div v-if="mode === 'edit'" class="edit-actions">
          <button class="btn btn-primary" @click="addWidget">
            <Plus :size="14" />
            추가
          </button>
          <button class="btn btn-danger" @click="deleteSelectedWidgets" :disabled="selectedItems.size === 0">
            <Trash2 :size="14" />
            삭제
          </button>
          <button class="btn btn-success" @click="saveLayout" :disabled="saving">
            <Save :size="14" />
            {{ saving ? '저장 중...' : '저장' }}
          </button>
        </div>
      </div>
    </div>
    <div class="header-divider"></div>

    <!-- Widget Grid -->
    <div class="widget-grid-container" ref="gridContainer">
      <ClientOnly>
        <div v-if="widgets.length === 0" class="empty-state">
          <LayoutGrid :size="64" color="#9CA3AF" />
          <h3>위젯이 없습니다</h3>
          <p v-if="mode === 'edit'">상단의 [추가] 버튼을 눌러 위젯을 추가하세요.</p>
          <p v-else>관리모드에서 위젯을 추가하세요.</p>
        </div>

        <div v-else class="grid-stack" ref="gridStackRef">
          <div
            v-for="widget in widgets"
            :key="widget.tempId"
            class="grid-stack-item"
            :gs-x="widget.itemNo != null ? widget.gridX : undefined"
            :gs-y="widget.itemNo != null ? widget.gridY : undefined"
            :gs-w="widget.gridW"
            :gs-h="widget.gridH"
            :gs-id="widget.tempId"
            :gs-auto-position="widget.itemNo == null ? 'true' : undefined"
          >
            <div class="grid-stack-item-content">
              <WidgetCard
                :widget="widget"
                :edit-mode="mode === 'edit'"
                :selected="selectedItems.has(widget.tempId)"
                :start-date="startDate"
                :end-date="endDate"
                :refresh-key="refreshCounters[widget.tempId] || 0"
                @toggle-select="toggleSelect(widget.tempId)"
                @open-settings="openSettings(widget)"
                @refresh="refreshWidget(widget)"
                @maximize="maximizeWidget(widget)"
              />
            </div>
          </div>
        </div>

        <template #fallback>
          <div class="loading-state">
            <q-spinner color="green" size="32px" />
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Widget Settings Popup -->
    <Teleport to="body">
      <div v-if="settingsVisible" class="popup-overlay" @click.self="closeSettings">
        <div class="popup-container">
          <div class="popup-header">
            <span class="popup-title">위젯 설정</span>
            <button class="popup-close" @click="closeSettings">
              <X :size="16" />
            </button>
          </div>

          <div class="popup-body">
            <!-- Widget Title -->
            <div class="form-field">
              <label class="field-label">위젯 제목</label>
              <input
                type="text"
                v-model="editingWidget.itemTitle"
                class="field-input"
                placeholder="위젯 제목을 입력하세요"
              />
            </div>

            <!-- Chart Type -->
            <div class="form-field">
              <label class="field-label">차트 유형</label>
              <select v-model="editingWidget.chartType" class="field-select" @change="onChartTypeChange">
                <option value="bar">Bar Chart (막대 차트)</option>
                <option value="line">Line Chart (라인 차트)</option>
                <option value="area">Area Chart (영역 차트)</option>
                <option value="pie">Pie Chart (파이 차트)</option>
                <option value="gauge">Gauge (게이지)</option>
                <option value="table">Table (테이블)</option>
              </select>
            </div>

            <!-- Data Source API -->
            <div class="form-field">
              <label class="field-label">데이터 소스</label>
              <select v-model="editingWidget.dataApi" class="field-select" @change="onApiChange">
                <option value="">-- 데이터 소스 선택 --</option>
                <option value="/api/proxy/api/transport/daily">일별 거래 현황</option>
                <option value="/api/proxy/api/transport/hourly">시간대별 이용 통계</option>
                <option value="/api/proxy/api/transport/stations">역별 이용 현황</option>
                <option value="/api/proxy/api/transport/routes">노선별 이용 현황</option>
                <option value="/api/proxy/api/transport/stats/day-of-week">요일별 통계</option>
                <option value="/api/proxy/api/transport/stats/card-type">카드 유형별 통계</option>
                <option value="/api/proxy/api/transport/stats/ticket-type">승차권 유형별 통계</option>
              </select>
            </div>

            <!-- Axis Settings (time-based charts) -->
            <div v-if="isTimeBasedChart" class="form-row">
              <div class="form-field">
                <label class="field-label">X축 데이터</label>
                <select v-model="editingWidget.xAxisField" class="field-select">
                  <option value="">-- X축 선택 --</option>
                  <option v-for="field in availableXFields" :key="field.value" :value="field.value">
                    {{ field.label }}
                  </option>
                </select>
              </div>
              <div class="form-field">
                <label class="field-label">Y축 데이터</label>
                <div class="y-axis-list">
                  <div
                    v-for="(yf, idx) in editingYAxisFields"
                    :key="idx"
                    class="y-axis-item"
                  >
                    <select v-model="yf.field" class="field-select-sm">
                      <option value="">-- 필드 선택 --</option>
                      <option v-for="f in availableYFields" :key="f.value" :value="f.value">
                        {{ f.label }}
                      </option>
                    </select>
                    <input v-model="yf.label" class="field-input-sm" placeholder="범례명" />
                    <button class="btn-icon-danger" @click="removeYAxis(idx)" v-if="editingYAxisFields.length > 1">
                      <Minus :size="12" />
                    </button>
                  </div>
                  <button class="btn-add-y" @click="addYAxis">
                    <Plus :size="12" /> Y축 추가
                  </button>
                </div>
              </div>
            </div>

            <!-- Value-only settings (non-time charts: pie, gauge) -->
            <div v-else class="form-field">
              <label class="field-label">값 데이터</label>
              <div class="y-axis-list">
                <div
                  v-for="(yf, idx) in editingYAxisFields"
                  :key="idx"
                  class="y-axis-item"
                >
                  <select v-model="yf.field" class="field-select-sm">
                    <option value="">-- 필드 선택 --</option>
                    <option v-for="f in availableYFields" :key="f.value" :value="f.value">
                      {{ f.label }}
                    </option>
                  </select>
                  <input v-model="yf.label" class="field-input-sm" placeholder="범례명" />
                  <button class="btn-icon-danger" @click="removeYAxis(idx)" v-if="editingYAxisFields.length > 1">
                    <Minus :size="12" />
                  </button>
                </div>
                <button class="btn-add-y" @click="addYAxis">
                  <Plus :size="12" /> 값 추가
                </button>
              </div>
            </div>

            <!-- Widget Size -->
            <div class="form-row">
              <div class="form-field">
                <label class="field-label">너비 (1~12)</label>
                <input type="number" v-model.number="editingWidget.gridW" class="field-input" min="2" max="12" />
              </div>
              <div class="form-field">
                <label class="field-label">높이 (단위)</label>
                <input type="number" v-model.number="editingWidget.gridH" class="field-input" min="2" max="12" />
              </div>
            </div>
          </div>

          <div class="popup-footer">
            <button class="btn btn-outline" @click="closeSettings">취소</button>
            <button class="btn btn-success" @click="applySettings">
              <Check :size="14" />
              저장
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Maximize Modal -->
    <Teleport to="body">
      <div v-if="maximizedWidget" class="popup-overlay" @click.self="closeMaximize">
        <div class="maximize-container">
          <div class="popup-header">
            <span class="popup-title">{{ maximizedWidget.itemTitle || '위젯' }}</span>
            <button class="popup-close" @click="closeMaximize">
              <X :size="16" />
            </button>
          </div>
          <div class="maximize-body">
            <WidgetChartBody
              :widget="maximizedWidget"
              :start-date="startDate"
              :end-date="endDate"
              :height="480"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import {
  ChevronRight, Plus, Trash2, Save, X, Check, Minus, LayoutGrid,
} from 'lucide-vue-next';

definePageMeta({ layout: 'dashboard' });

// ──────────────────────── Types ────────────────────────
interface YAxisField {
  field: string;
  label: string;
}

interface WidgetItem {
  tempId: string;
  itemNo?: number;
  boardNo?: number;
  itemTitle: string;
  chartType: string;
  gridX: number;
  gridY: number;
  gridW: number;
  gridH: number;
  xAxisField: string;
  yAxisFields: string;  // JSON
  dataApi: string;
  sortOrder: number;
}

// ──────────────────────── State ────────────────────────
const authStore = useAuthStore();
const userId = computed(() => authStore.user?.userId || 'anonymous');

function authHeaders() {
  const token = authStore.accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const mode = ref<'view' | 'edit'>('view');
const saving = ref(false);
const startDate = ref(getDefaultStartDate());
const endDate = ref(getDefaultEndDate());

const widgets = ref<WidgetItem[]>([]);
const selectedItems = ref<Set<string>>(new Set());
const settingsVisible = ref(false);
const maximizedWidget = ref<WidgetItem | null>(null);

const editingWidget = ref<WidgetItem>(createEmptyWidget());
const editingYAxisFields = ref<YAxisField[]>([{ field: '', label: '' }]);
const editingTargetId = ref<string | null>(null);

// Refresh counters per widget
const refreshCounters = reactive<Record<string, number>>({});

// GridStack instance
const gridStackRef = ref<HTMLElement | null>(null);
let gridInstance: any = null;

// ──────────────────────── Helpers ────────────────────────
function getDefaultStartDate() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().split('T')[0];
}

function getDefaultEndDate() {
  return new Date().toISOString().split('T')[0];
}

function createEmptyWidget(overrides?: Partial<WidgetItem>): WidgetItem {
  return {
    tempId: `w-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemTitle: '새 위젯',
    chartType: 'bar',
    gridX: 0,
    gridY: 0,
    gridW: 6,
    gridH: 4,
    xAxisField: '',
    yAxisFields: '[]',
    dataApi: '',
    sortOrder: 0,
    ...overrides,
  };
}

// ──────────────────────── API / Data Field Maps ────────────────────────
const API_FIELDS: Record<string, { x: { value: string; label: string }[]; y: { value: string; label: string }[] }> = {
  '/api/proxy/api/transport/daily': {
    x: [{ value: 'tradeDt', label: '날짜' }],
    y: [
      { value: 'totalCnt', label: '총 이용객' },
      { value: 'boardingCnt', label: '승차 수' },
      { value: 'alightingCnt', label: '하차 수' },
      { value: 'totalRev', label: '총 수입' },
    ],
  },
  '/api/proxy/api/transport/hourly': {
    x: [{ value: 'hourRange', label: '시간' }],
    y: [
      { value: 'totalCnt', label: '총 이용객' },
      { value: 'boardingCnt', label: '승차 수' },
      { value: 'alightingCnt', label: '하차 수' },
    ],
  },
  '/api/proxy/api/transport/stations': {
    x: [{ value: 'stationNo', label: '역번호' }],
    y: [
      { value: 'totalCnt', label: '총 이용객' },
      { value: 'boardingCnt', label: '승차 수' },
      { value: 'alightingCnt', label: '하차 수' },
    ],
  },
  '/api/proxy/api/transport/routes': {
    x: [{ value: 'routeNo', label: '노선번호' }],
    y: [
      { value: 'totalCnt', label: '총 이용객' },
      { value: 'boardingCnt', label: '승차 수' },
    ],
  },
  '/api/proxy/api/transport/stats/day-of-week': {
    x: [{ value: 'dayOfWeekNum', label: '요일' }],
    y: [
      { value: 'avgTotalCnt', label: '평균 이용객' },
      { value: 'avgBoardingCnt', label: '평균 승차 수' },
      { value: 'avgTotalRev', label: '평균 수입' },
    ],
  },
  '/api/proxy/api/transport/stats/card-type': {
    x: [{ value: 'cardType', label: '카드 유형' }],
    y: [
      { value: 'totalCnt', label: '총 건수' },
      { value: 'totalRev', label: '총 수입' },
    ],
  },
  '/api/proxy/api/transport/stats/ticket-type': {
    x: [{ value: 'ticketType', label: '승차권 유형' }],
    y: [
      { value: 'totalCnt', label: '총 건수' },
      { value: 'boardingCnt', label: '승차 수' },
    ],
  },
};

const availableXFields = computed(() => API_FIELDS[editingWidget.value.dataApi]?.x || []);
const availableYFields = computed(() => API_FIELDS[editingWidget.value.dataApi]?.y || []);
const isTimeBasedChart = computed(() =>
  !['pie', 'gauge'].includes(editingWidget.value.chartType),
);

// ──────────────────────── Chart Type change ────────────────────────
function onChartTypeChange() {
  if (!isTimeBasedChart.value) {
    editingWidget.value.xAxisField = '';
  }
}

function onApiChange() {
  editingWidget.value.xAxisField = availableXFields.value[0]?.value || '';
  editingYAxisFields.value = [{ field: availableYFields.value[0]?.value || '', label: availableYFields.value[0]?.label || '' }];
}

// ──────────────────────── Y-Axis management ────────────────────────
function addYAxis() {
  editingYAxisFields.value.push({ field: '', label: '' });
}

function removeYAxis(idx: number) {
  editingYAxisFields.value.splice(idx, 1);
}

// ──────────────────────── Widget CRUD ────────────────────────
function addWidget() {
  const newWidget = createEmptyWidget();
  widgets.value.push(newWidget);
  nextTick(() => {
    if (gridInstance) {
      const el = gridStackRef.value?.querySelector(`[gs-id="${newWidget.tempId}"]`);
      if (el) {
        gridInstance.makeWidget(el);
        // Sync back the auto-positioned coordinates
        syncGridPositions();
      }
    }
  });
}

function toggleSelect(tempId: string) {
  if (mode.value !== 'edit') return;
  if (selectedItems.value.has(tempId)) {
    selectedItems.value.delete(tempId);
  } else {
    selectedItems.value.add(tempId);
  }
}

function deleteSelectedWidgets() {
  if (gridInstance && gridStackRef.value) {
    selectedItems.value.forEach((tempId) => {
      const el = gridStackRef.value?.querySelector(`[gs-id="${tempId}"]`);
      if (el) gridInstance.removeWidget(el, false);
    });
  }
  widgets.value = widgets.value.filter((w) => !selectedItems.value.has(w.tempId));
  selectedItems.value.clear();
}

// ──────────────────────── Settings Popup ────────────────────────
function openSettings(widget: WidgetItem) {
  editingWidget.value = { ...widget };
  editingTargetId.value = widget.tempId;
  try {
    const parsed = JSON.parse(widget.yAxisFields || '[]');
    editingYAxisFields.value = Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : [{ field: '', label: '' }];
  } catch {
    editingYAxisFields.value = [{ field: '', label: '' }];
  }
  settingsVisible.value = true;
}

function closeSettings() {
  settingsVisible.value = false;
  editingTargetId.value = null;
}

function applySettings() {
  editingWidget.value.yAxisFields = JSON.stringify(
    editingYAxisFields.value.filter((y) => y.field),
  );
  const idx = widgets.value.findIndex((w) => w.tempId === editingTargetId.value);
  if (idx !== -1) {
    widgets.value[idx] = { ...editingWidget.value };
    // Update gridstack widget size
    if (gridInstance) {
      const el = gridStackRef.value?.querySelector(`[gs-id="${editingTargetId.value}"]`);
      if (el) {
        gridInstance.update(el, {
          w: editingWidget.value.gridW,
          h: editingWidget.value.gridH,
        });
      }
    }
  }
  closeSettings();
}

// ──────────────────────── Maximize & Refresh ────────────────────────
function maximizeWidget(widget: WidgetItem) {
  maximizedWidget.value = { ...widget };
}

function closeMaximize() {
  if (maximizedWidget.value) {
    const tempId = maximizedWidget.value.tempId;
    maximizedWidget.value = null;
    // Refresh the original widget chart after modal closes
    nextTick(() => {
      refreshCounters[tempId] = (refreshCounters[tempId] || 0) + 1;
    });
  }
}

function refreshWidget(widget: WidgetItem) {
  refreshCounters[widget.tempId] = (refreshCounters[widget.tempId] || 0) + 1;
}

// ──────────────────────── Save/Load Layout ────────────────────────
function syncGridPositions() {
  if (!gridInstance || !gridStackRef.value) return;
  const items = gridInstance.save(false) as any[];
  items.forEach((gs: any) => {
    const w = widgets.value.find((w) => w.tempId === gs.id);
    if (w) {
      w.gridX = gs.x ?? w.gridX;
      w.gridY = gs.y ?? w.gridY;
      w.gridW = gs.w ?? w.gridW;
      w.gridH = gs.h ?? w.gridH;
    }
  });
}

async function saveLayout() {
  syncGridPositions();
  saving.value = true;
  try {
    const payload = {
      pageKey: 'bigdata-widget',
      userId: userId.value,
      items: widgets.value.map((w, idx) => ({
        itemNo: w.itemNo || null,
        boardNo: w.boardNo || null,
        itemTitle: w.itemTitle,
        chartType: w.chartType,
        gridX: w.gridX,
        gridY: w.gridY,
        gridW: w.gridW,
        gridH: w.gridH,
        xAxisField: w.xAxisField,
        yAxisFields: w.yAxisFields,
        dataApi: w.dataApi,
        sortOrder: idx,
      })),
    };
    const res = await $fetch<{ success: boolean; message: string; data: any }>(
      '/api/proxy/api/widget/board',
      { method: 'POST', body: payload, headers: authHeaders() },
    );
    if (res.success && res.data) {
      // Refresh with server-assigned item numbers
      const saved = res.data.items || [];
      widgets.value = widgets.value.map((w, idx) => ({
        ...w,
        itemNo: saved[idx]?.itemNo,
        boardNo: saved[idx]?.boardNo,
      }));
    }
    alert('저장되었습니다.');
  } catch (e) {
    console.error('Save error:', e);
    alert('저장 중 오류가 발생했습니다.');
  } finally {
    saving.value = false;
  }
}

async function loadLayout() {
  try {
    const res = await $fetch<{ success: boolean; data: any }>(
      `/api/proxy/api/widget/board?pageKey=bigdata-widget&userId=${userId.value}`,
      { headers: authHeaders() },
    );
    if (res.success && res.data?.items) {
      widgets.value = res.data.items.map((item: any) => ({
        tempId: `w-${item.itemNo}`,
        itemNo: item.itemNo,
        boardNo: item.boardNo,
        itemTitle: item.itemTitle || '제목 없음',
        chartType: item.chartType || 'bar',
        gridX: item.gridX ?? 0,
        gridY: item.gridY ?? 0,
        gridW: item.gridW ?? 6,
        gridH: item.gridH ?? 4,
        xAxisField: item.xAxisField || '',
        yAxisFields: item.yAxisFields || '[]',
        dataApi: item.dataApi || '',
        sortOrder: item.sortOrder ?? 0,
      }));
    }
  } catch (e) {
    console.error('Load error:', e);
  }
}

// ──────────────────────── GridStack init ────────────────────────
async function initGridStack() {
  if (!gridStackRef.value || gridInstance) return;
  const { GridStack } = await import('gridstack');

  gridInstance = GridStack.init(
    {
      column: 12,
      cellHeight: 80,
      margin: 8,
      float: true,
      draggable: { handle: '.widget-drag-handle' },
      resizable: { handles: 'se' },
      disableDrag: false,
      disableResize: false,
    },
    gridStackRef.value,
  );

  gridInstance.on('change', () => syncGridPositions());
}

async function destroyGridStack() {
  if (gridInstance) {
    gridInstance.destroy(false);
    gridInstance = null;
  }
}

// Watch mode changes
watch(mode, async (newMode) => {
  selectedItems.value.clear();
  await nextTick();
  if (gridInstance) {
    if (newMode === 'edit') {
      gridInstance.enableMove(true);
      gridInstance.enableResize(true);
    } else {
      gridInstance.enableMove(false);
      gridInstance.enableResize(false);
    }
  }
});

// Watch widget count to init/update gridstack
watch(
  () => widgets.value.length,
  async (newLen) => {
    if (newLen > 0) {
      await nextTick();
      if (!gridInstance) {
        await initGridStack();
      }
    } else {
      await destroyGridStack();
    }
  },
);

onMounted(async () => {
  await loadLayout();
  if (widgets.value.length > 0) {
    await nextTick();
    await initGridStack();
    if (gridInstance) {
      gridInstance.enableMove(false);
      gridInstance.enableResize(false);
    }
  }
});

onBeforeUnmount(() => {
  destroyGridStack();
});
</script>

<style scoped>
.widget-page {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100vh;
  overflow-y: auto;
  background: #F8F9FA;
}

/* ── Header ── */
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 12px;
}
.header-left { display: flex; flex-direction: column; gap: 4px; }
.header-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.page-title { font-size: 22px; font-weight: 600; color: #111827; margin: 0; letter-spacing: -0.5px; }
.breadcrumb { display: flex; align-items: center; gap: 8px; }
.bc-item { font-size: 13px; color: #9CA3AF; }
.bc-link { text-decoration: none; transition: color 0.15s; }
.bc-link:hover { color: #4CAF50; }
.bc-item.active { color: #4CAF50; font-weight: 500; }
.header-divider { height: 1px; background: #E5E7EB; flex-shrink: 0; }

/* ── Date Range ── */
.date-range-picker { display: flex; align-items: center; gap: 8px; }
.date-input {
  height: 32px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 13px;
  color: #374151;
  background: #fff;
  outline: none;
}
.date-input:focus { border-color: #4CAF50; }
.date-sep { font-size: 13px; color: #9CA3AF; }

/* ── Mode Toggle ── */
.mode-toggle {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  overflow: hidden;
}
.mode-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 32px;
  font-size: 13px;
  cursor: pointer;
  background: #fff;
  color: #6B7280;
  transition: all 0.15s;
}
.mode-label input[type='radio'] { display: none; }
.mode-label.active { background: #4CAF50; color: #fff; font-weight: 500; }
.mode-label:not(.active):hover { background: #F3F4F6; }

/* ── Edit Actions ── */
.edit-actions { display: flex; align-items: center; gap: 8px; }
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: #3B82F6; color: #fff; }
.btn-primary:hover:not(:disabled) { background: #2563EB; }
.btn-danger { background: #EF4444; color: #fff; }
.btn-danger:hover:not(:disabled) { background: #DC2626; }
.btn-success { background: #4CAF50; color: #fff; }
.btn-success:hover:not(:disabled) { background: #388E3C; }
.btn-outline { background: #fff; color: #374151; border: 1px solid #D1D5DB; }
.btn-outline:hover { background: #F9FAFB; }

/* ── Grid Container ── */
.widget-grid-container {
  flex: 1;
  min-height: 300px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 32px;
  background: #fff;
  border: 1px dashed #D1D5DB;
  border-radius: 12px;
  text-align: center;
}
.empty-state h3 { font-size: 18px; font-weight: 600; color: #374151; margin: 0; }
.empty-state p { font-size: 14px; color: #9CA3AF; margin: 0; }

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
}

/* ── Popup ── */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.popup-container {
  background: #fff;
  border-radius: 12px;
  width: 540px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}
.maximize-container {
  background: #fff;
  border-radius: 12px;
  width: 90vw;
  max-width: 1200px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}
.maximize-body { flex: 1; overflow: hidden; padding: 16px; }

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  border-bottom: 1px solid #F3F4F6;
  flex-shrink: 0;
}
.popup-title { font-size: 16px; font-weight: 600; color: #111827; }
.popup-close {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.popup-close:hover { background: #E5E7EB; }

.popup-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.popup-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 24px;
  height: 64px;
  border-top: 1px solid #F3F4F6;
  flex-shrink: 0;
}

/* ── Form Fields ── */
.form-field { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.form-row { display: flex; gap: 16px; }
.field-label { font-size: 13px; font-weight: 500; color: #374151; }
.field-input, .field-select {
  height: 40px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 13px;
  color: #374151;
  outline: none;
  width: 100%;
  background: #fff;
}
.field-input:focus, .field-select:focus { border-color: #4CAF50; }

.y-axis-list { display: flex; flex-direction: column; gap: 8px; }
.y-axis-item { display: flex; align-items: center; gap: 8px; }
.field-select-sm {
  height: 36px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 12px;
  outline: none;
  flex: 1;
  background: #fff;
}
.field-input-sm {
  height: 36px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 12px;
  outline: none;
  width: 100px;
}
.btn-icon-danger {
  width: 28px;
  height: 28px;
  border: none;
  background: #FEE2E2;
  color: #EF4444;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}
.btn-add-y {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #4CAF50;
  border: 1px dashed #4CAF50;
  background: transparent;
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
  align-self: flex-start;
}
.btn-add-y:hover { background: #F0FDF4; }

/* ── GridStack overrides ── */
:deep(.grid-stack) { background: transparent; }
:deep(.grid-stack-item-content) { border-radius: 8px; overflow: hidden; }
:deep(.grid-stack-item.ui-draggable-dragging) {
  opacity: 0.85;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
}
:deep(.grid-stack-placeholder > .placeholder-content) {
  border: 2px dashed #4CAF50 !important;
  background: rgba(76, 175, 80, 0.08) !important;
  border-radius: 8px;
}
:deep(.ui-resizable-se) {
  background: #4CAF50 !important;
  width: 12px !important;
  height: 12px !important;
  border-radius: 2px !important;
  opacity: 0.7;
}
</style>
