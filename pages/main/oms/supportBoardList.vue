<template>
  <div class="menu-page">
    <div class="content-header">
      <h1 class="page-title">기술지원</h1>
      <div class="breadcrumb">
        <NuxtLink to="/dashboard" class="bc-item bc-link">Home</NuxtLink>
        <ChevronRight :size="14" color="#D1D5DB" />
        <span class="bc-item">종합현황</span>
        <ChevronRight :size="14" color="#D1D5DB" />
        <span class="bc-item">운영게시판</span>
        <ChevronRight :size="14" color="#D1D5DB" />
        <span class="bc-item active">기술지원</span>
      </div>
    </div>
    <div class="header-divider"></div>
    <div class="content-placeholder">
      <div class="placeholder-card">
        <FileText :size="48" color="#9CA3AF" />
        <h2>기술지원</h2>
        <p>This page is under construction.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, FileText } from 'lucide-vue-next';

definePageMeta({
  layout: 'dashboard',
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
</style>
