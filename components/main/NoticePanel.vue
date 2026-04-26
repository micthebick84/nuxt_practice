<template>
  <div class="notice-card">
    <div class="notice-head">
      <div class="notice-head-left">
        <div class="notice-icon">📋</div>
        <div>
          <div class="notice-title">공지사항</div>
          <div class="notice-subtitle">최근 등록된 운영 공지</div>
        </div>
      </div>
      <button type="button" class="notice-more">전체보기 →</button>
    </div>
    <ul class="notice-list">
      <li v-for="(n, i) in notices" :key="i" class="notice-item">
        <div class="notice-item-left">
          <span v-if="n.pinned" class="pin-icon" title="상단고정">📌</span>
          <span
            class="notice-tag"
            :style="{
              color: TAG_COLORS[n.tag],
              borderColor: hexAlpha(TAG_COLORS[n.tag], 0.3),
              background: hexAlpha(TAG_COLORS[n.tag], 0.08),
            }"
          >
            {{ n.tag }}
          </span>
          <span class="notice-text">{{ n.title }}</span>
        </div>
        <div class="notice-item-right">
          <span class="notice-writer">{{ n.writer }}</span>
          <span class="notice-date">{{ n.date }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Notice {
  tag: string;
  pinned: boolean;
  title: string;
  date: string;
  writer: string;
}

const TAG_COLORS: Record<string, string> = {
  공지: '#1976d2',
  시스템: '#7c3aed',
  보안: '#dc2626',
  운영: '#0891b2',
  교육: '#10b981',
};

const notices: Notice[] = [
  { tag: '공지', pinned: true, title: '[정기점검] 4/27(일) 02:00~04:00 NMS 서버 정기점검 안내', date: '2026-04-25', writer: '운영팀' },
  { tag: '시스템', pinned: true, title: 'Netis v6.6 패치 적용 — 알람 분류 로직 개선 사항 안내', date: '2026-04-24', writer: '시스템관리자' },
  { tag: '보안', pinned: false, title: '4월 보안 패치 배포 완료 — 적용 대상 장비 137대', date: '2026-04-23', writer: '보안팀' },
  { tag: '운영', pinned: false, title: '코어망 회선 증설 작업 완료 보고 (서울-부산 백본)', date: '2026-04-22', writer: '운영팀' },
  { tag: '교육', pinned: false, title: '5월 NMS 운영자 교육 일정 안내 (5/12, 5/19)', date: '2026-04-21', writer: '교육담당' },
  { tag: '공지', pinned: false, title: '대시보드 위젯 사용자 정의 기능 베타 오픈', date: '2026-04-20', writer: '운영팀' },
  { tag: '시스템', pinned: false, title: '폴링 주기 자동 조정 정책 적용 안내', date: '2026-04-19', writer: '시스템관리자' },
];

function hexAlpha(hex: string, a: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
</script>
