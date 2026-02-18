<template>
  <div class="menu-page">
    <!-- Content Header -->
    <div class="content-header">
      <h1 class="page-title">{{ groupTitle }}</h1>
      <div class="breadcrumb">
        <NuxtLink to="/dashboard" class="bc-item bc-link">Home</NuxtLink>
        <ChevronRight :size="14" color="#D1D5DB" />
        <span class="bc-item">{{ pageTitle }}</span>
        <ChevronRight :size="14" color="#D1D5DB" />
        <span class="bc-item active">{{ groupTitle }}</span>
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

    <!-- Content Placeholder -->
    <div class="content-placeholder">
      <div class="placeholder-card">
        <FolderOpen :size="48" color="#9CA3AF" />
        <h2>{{ groupTitle }}</h2>
        <p>This page is under construction.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  FolderOpen,
} from 'lucide-vue-next';

definePageMeta({
  layout: 'dashboard',
});

const route = useRoute();
const pageTitle = computed(() => {
  const page = route.params.page;
  return typeof page === 'string' ? decodeURIComponent(page) : '';
});
const groupTitle = computed(() => {
  const group = route.params.group;
  return typeof group === 'string' ? decodeURIComponent(group) : '';
});
</script>

<style scoped>
.menu-page {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100vh;
  overflow-y: auto;
}

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

.bc-link {
  text-decoration: none;
  transition: color 0.15s;
}

.bc-link:hover {
  color: #4CAF50;
}

.bc-item.active {
  color: #4CAF50;
  font-weight: 500;
}

.header-divider {
  height: 1px;
  background: #E5E7EB;
  flex-shrink: 0;
}

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

.content-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-card {
  text-align: center;
  padding: 48px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
}

.placeholder-card h2 {
  margin: 16px 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.placeholder-card p {
  margin: 0;
  font-size: 14px;
  color: #9CA3AF;
}

@media (max-width: 768px) {
  .menu-page {
    padding: 16px;
  }
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    gap: 8px;
  }
}
</style>
