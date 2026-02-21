<template>
  <div class="widget-card" :class="{ 'is-selected': selected, 'edit-mode': editMode }">
    <!-- Selection overlay -->
    <div v-if="editMode" class="select-overlay">
      <div class="select-checkbox" :class="{ checked: selected }" @click="$emit('toggle-select')">
        <Check v-if="selected" :size="12" color="#fff" />
      </div>
    </div>

    <!-- Header -->
    <div class="widget-header widget-drag-handle">
      <span class="widget-title">{{ widget.itemTitle || '제목 없음' }}</span>
      <div class="widget-actions" @click.stop>
        <button class="action-btn" title="새로고침" @click="$emit('refresh')">
          <RefreshCw :size="14" />
        </button>
        <button class="action-btn" title="최대화" @click="$emit('maximize')">
          <Maximize2 :size="14" />
        </button>
        <button v-if="editMode" class="action-btn" title="설정" @click="$emit('open-settings')">
          <Settings :size="14" />
        </button>
      </div>
    </div>

    <!-- Chart Body -->
    <div class="widget-body">
      <WidgetChartBody
        :widget="widget"
        :start-date="startDate"
        :end-date="endDate"
        :height="bodyHeight"
        :refresh-key="refreshKey"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RefreshCw, Maximize2, Settings, Check } from 'lucide-vue-next';

interface WidgetItem {
  tempId: string;
  itemNo?: number;
  itemTitle: string;
  chartType: string;
  gridX: number;
  gridY: number;
  gridW: number;
  gridH: number;
  xAxisField: string;
  yAxisFields: string;
  dataApi: string;
}

const props = defineProps<{
  widget: WidgetItem;
  editMode: boolean;
  selected: boolean;
  startDate: string;
  endDate: string;
  refreshKey?: number;
}>();

defineEmits<{
  (e: 'toggle-select'): void;
  (e: 'open-settings'): void;
  (e: 'refresh'): void;
  (e: 'maximize'): void;
}>();

const bodyHeight = computed(() => {
  const h = (props.widget.gridH || 4) * 80 - 48 - 16;
  return Math.max(h, 80);
});
</script>

<style scoped>
.widget-card {
  position: relative;
  height: 100%;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.15s, border-color 0.15s;
}
.widget-card.is-selected {
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.25);
}
.widget-card.edit-mode:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Selection overlay */
.select-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background: transparent;
}
.select-checkbox {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  border: 2px solid #D1D5DB;
  border-radius: 4px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  pointer-events: auto;
  cursor: pointer;
}
.select-checkbox.checked {
  background: #4CAF50;
  border-color: #4CAF50;
}

/* Header */
.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 48px;
  border-bottom: 1px solid #F3F4F6;
  flex-shrink: 0;
  cursor: grab;
}
.widget-header:active { cursor: grabbing; }
.widget-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.widget-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  position: relative;
  z-index: 20;
}
.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #9CA3AF;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}
.action-btn:hover { background: #F3F4F6; color: #374151; }

/* Body */
.widget-body {
  flex: 1;
  overflow: hidden;
  padding: 8px;
}
</style>
