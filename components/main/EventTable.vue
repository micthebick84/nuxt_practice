<template>
  <div class="event-card">
    <div class="event-head">
      <div class="event-head-left">
        <div class="event-icon">⚠</div>
        <div>
          <div class="event-title">이벤트 현황</div>
          <div class="event-subtitle">실시간 장애 · 알람 모니터링</div>
        </div>
      </div>
      <div class="event-tabs">
        <button
          v-for="t in tabs"
          :key="t.k"
          type="button"
          :class="['event-tab', { active: filter === t.k }]"
          @click="filter = t.k"
        >
          {{ t.label }}
          <span class="event-tab-count">{{ counts[t.k] }}</span>
        </button>
      </div>
    </div>
    <div class="event-table-wrap">
      <table class="event-table">
        <thead>
          <tr>
            <th style="width: 110px">장애등급</th>
            <th style="width: 170px">시간</th>
            <th style="width: 240px">장애 대상</th>
            <th style="width: 110px">지속시간</th>
            <th>이벤트 내용</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ev, i) in filtered" :key="i">
            <td>
              <span
                class="level-badge"
                :style="{ color: EVENT_LEVELS[ev.level].color, background: EVENT_LEVELS[ev.level].bg }"
              >
                <span class="level-dot" :style="{ background: EVENT_LEVELS[ev.level].color }" />
                {{ EVENT_LEVELS[ev.level].label }}
              </span>
            </td>
            <td class="mono">{{ ev.time }}</td>
            <td class="target">{{ ev.target }}</td>
            <td class="mono duration">{{ ev.duration }}</td>
            <td class="msg">{{ ev.message }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type Level = 'critical' | 'major' | 'minor' | 'warning' | 'info';
type FilterKey = 'all' | 'critical' | 'major' | 'minor' | 'warning';

interface EventRow {
  level: Level;
  time: string;
  target: string;
  duration: string;
  message: string;
}

const EVENT_LEVELS: Record<Level, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#dc2626', bg: '#fee2e2' },
  major: { label: 'Major', color: '#ea580c', bg: '#ffedd5' },
  minor: { label: 'Minor', color: '#ca8a04', bg: '#fef9c3' },
  warning: { label: 'Warning', color: '#0284c7', bg: '#e0f2fe' },
  info: { label: 'Info', color: '#64748b', bg: '#f1f5f9' },
};

const events: EventRow[] = [
  { level: 'critical', time: '2026-04-26 14:32:18', target: 'CORE-RTR-01 / Gi0/0/1',           duration: '00:12:34', message: 'Interface link down — 회선 단절 감지' },
  { level: 'critical', time: '2026-04-26 14:28:02', target: 'DB-PRIMARY-02',                     duration: '00:16:50', message: 'CPU 사용률 임계치 초과 (98%)' },
  { level: 'major',    time: '2026-04-26 14:21:47', target: 'FW-DMZ-A / vsys-edge',              duration: '00:23:05', message: '세션 테이블 사용률 임계치 초과 (87%)' },
  { level: 'major',    time: '2026-04-26 14:15:33', target: 'SW-DIST-09 / Te1/0/24',             duration: '00:29:19', message: 'CRC 에러율 급증 — 0.42%' },
  { level: 'minor',    time: '2026-04-26 14:09:11', target: 'AP-OFC-3F-12',                      duration: '00:35:41', message: '클라이언트 연결 수 비정상 (다중 재접속)' },
  { level: 'warning',  time: '2026-04-26 14:02:57', target: 'CORE-RTR-02',                       duration: '00:41:55', message: '온도 센서 경고 — 51.2°C' },
  { level: 'minor',    time: '2026-04-26 13:58:14', target: 'WAN-LINK-SEOUL-BUSAN',              duration: '00:46:38', message: '응답속도 평균 상승 (78ms → 124ms)' },
  { level: 'info',     time: '2026-04-26 13:51:00', target: 'NMS-COLLECTOR-01',                  duration: '00:53:52', message: '폴링 주기 자동 조정 — 30s → 60s' },
  { level: 'warning',  time: '2026-04-26 13:44:22', target: 'STORAGE-NAS-04 / vol-3',            duration: '01:00:30', message: '디스크 사용률 82% — 임계치 근접' },
  { level: 'info',     time: '2026-04-26 13:38:09', target: 'SYS-BACKUP-NODE',                   duration: '01:06:43', message: '정기 백업 작업 시작' },
];

const tabs: { k: FilterKey; label: string }[] = [
  { k: 'all', label: '전체' },
  { k: 'critical', label: 'Critical' },
  { k: 'major', label: 'Major' },
  { k: 'minor', label: 'Minor' },
  { k: 'warning', label: 'Warning' },
];

const filter = ref<FilterKey>('all');
const filtered = computed(() => (filter.value === 'all' ? events : events.filter((e) => e.level === filter.value)));
const counts = computed<Record<FilterKey, number>>(() => ({
  all: events.length,
  critical: events.filter((e) => e.level === 'critical').length,
  major: events.filter((e) => e.level === 'major').length,
  minor: events.filter((e) => e.level === 'minor').length,
  warning: events.filter((e) => e.level === 'warning').length,
}));
</script>
