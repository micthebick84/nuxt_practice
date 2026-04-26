<template>
  <header class="netis-top-header">
    <div class="top-left">
      <button
        type="button"
        class="hover-trigger-hint"
        title="메뉴 열기"
        @click="emit('menuToggle')"
      >
        <span /><span /><span />
      </button>
      <div class="brand-block">
        <div class="brand-text">
          <div class="brand-name">
            Netis <span class="brand-version">v7.0</span>
          </div>
          <div class="brand-tag">통합 망관리 시스템</div>
        </div>
      </div>
    </div>
    <div class="top-right">
      <div class="health-pill">
        <span class="health-dot health-ok" />
        <span>System Healthy</span>
      </div>
      <div class="clock">
        <div class="clock-date">{{ dateStr }} ({{ wd }})</div>
        <div class="clock-time">{{ timeStr }}</div>
      </div>
      <button type="button" class="icon-btn" title="알림">
        🔔
        <span class="icon-btn-badge">3</span>
      </button>
      <div class="user-chip">
        <div class="user-avatar">{{ avatarInitial }}</div>
        <div class="user-info">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();
const emit = defineEmits<{ menuToggle: [] }>();

const userName = computed(() => auth.user?.userName || auth.user?.userId || '관리자');
const userRole = computed(() => 'System Admin');
const avatarInitial = computed(() => (userName.value || '관').slice(0, 1));

const now = ref(new Date());
let timer: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  timer = setInterval(() => (now.value = new Date()), 1000);
});
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

const fmt = (n: number) => String(n).padStart(2, '0');
const dateStr = computed(() => `${now.value.getFullYear()}-${fmt(now.value.getMonth() + 1)}-${fmt(now.value.getDate())}`);
const timeStr = computed(() => `${fmt(now.value.getHours())}:${fmt(now.value.getMinutes())}:${fmt(now.value.getSeconds())}`);
const wd = computed(() => ['일', '월', '화', '수', '목', '금', '토'][now.value.getDay()]);
</script>
