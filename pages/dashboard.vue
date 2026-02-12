<template>
  <div class="dashboard-wrapper">
    <!-- Hover trigger area for drawer -->
    <div
      class="drawer-hover-trigger"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    ></div>

    <!-- Sidebar Drawer -->
    <q-drawer
      v-model="drawerOpen"
      :width="menuState.miniMode ? 60 : 240"
      :mini="menuState.miniMode"
      overlay
      bordered
      class="dashboard-drawer"
      @mouseenter="handleDrawerEnter"
      @mouseleave="handleDrawerLeave"
    >
      <VerticalMenu />
    </q-drawer>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="page-header">
        <div class="header-title">
          <h1>Home</h1>
        </div>
      </header>

      <!-- Content Area -->
      <div class="content-area">
        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <!-- Activation Card -->
          <q-card class="metric-card">
            <q-card-section>
              <div class="metric-header">
                <div>
                  <div class="metric-subtitle">
                    <span class="metric-icon">🔻</span>
                    Activation & Milestones
                  </div>
                  <h2 class="metric-title">Activation</h2>
                  <div class="metric-value large">28.97%</div>
                </div>
                <div class="time-badge">7d</div>
              </div>
              
              <div class="progress-list">
                <div v-for="item in activationProgress" :key="item.label" class="progress-item">
                  <span class="progress-label" :class="{ disabled: item.disabled }">{{ item.label }}</span>
                  <div class="progress-wrapper">
                    <q-linear-progress
                      :value="item.value / 100"
                      :color="item.disabled ? 'grey-3' : 'purple'"
                      class="progress-bar"
                    />
                    <span class="progress-percent" :class="{ disabled: item.disabled }">{{ item.percentage }}</span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Daily Active Companies Card -->
          <q-card class="metric-card">
            <q-card-section>
              <div class="metric-header">
                <div>
                  <div class="metric-subtitle">
                    <span class="metric-icon">👥</span>
                    An overview of your act...
                  </div>
                  <h2 class="metric-title">Daily active companies</h2>
                  <div class="metric-value large">94</div>
                </div>
                <div class="time-badge">7d</div>
              </div>
              
              <div class="chart-container">
                <ClientOnly>
                  <apexchart
                    v-if="mounted"
                    type="area"
                    height="140"
                    :options="companiesChartOptions"
                    :series="companiesChartSeries"
                  />
                </ClientOnly>
              </div>
            </q-card-section>
          </q-card>

          <!-- Top Power Users Card -->
          <q-card class="metric-card">
            <q-card-section>
              <div class="metric-header">
                <div>
                  <div class="metric-subtitle">
                    <span class="metric-icon">👑</span>
                    Power users
                  </div>
                  <h2 class="metric-title">Top Power Users</h2>
                </div>
              </div>
              
              <div class="user-list">
                <div v-for="user in powerUsers" :key="user.id" class="user-item">
                  <q-avatar :style="{ backgroundColor: user.color }" size="32px">
                    <span class="avatar-text">{{ user.initial }}</span>
                  </q-avatar>
                  <div class="user-info">
                    <div class="user-email">{{ user.email }}</div>
                    <div class="user-status">{{ user.status }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Daily New Users Card -->
          <q-card class="metric-card">
            <q-card-section>
              <div class="metric-header">
                <div>
                  <div class="metric-subtitle">
                    <span class="metric-icon">👤</span>
                    Recent sign ups
                  </div>
                  <h2 class="metric-title">Daily New Users</h2>
                  <div class="metric-value large">216</div>
                </div>
                <div class="time-badge">7d</div>
              </div>
              
              <div class="chart-container">
                <ClientOnly>
                  <apexchart
                    v-if="mounted"
                    type="area"
                    height="140"
                    :options="newUsersChartOptions"
                    :series="newUsersChartSeries"
                  />
                </ClientOnly>
              </div>
            </q-card-section>
          </q-card>

          <!-- Daily Active Users Card -->
          <q-card class="metric-card">
            <q-card-section>
              <div class="metric-header">
                <div>
                  <div class="metric-subtitle">
                    <span class="metric-icon">👥</span>
                    An overview of your act...
                  </div>
                  <h2 class="metric-title">Daily active users</h2>
                  <div class="metric-value large">115</div>
                </div>
                <div class="time-badge">7d</div>
              </div>
              
              <div class="chart-container">
                <ClientOnly>
                  <apexchart
                    v-if="mounted"
                    type="area"
                    height="140"
                    :options="activeUsersChartOptions"
                    :series="activeUsersChartSeries"
                  />
                </ClientOnly>
              </div>
            </q-card-section>
          </q-card>

          <!-- User Retention Cohorts Card -->
          <q-card class="metric-card">
            <q-card-section>
              <div class="metric-header">
                <div>
                  <div class="metric-subtitle">
                    <span class="metric-icon">📊</span>
                    Retention
                  </div>
                  <h2 class="metric-title">User retention cohorts</h2>
                  <div class="metric-value large">2%</div>
                </div>
                <div class="time-badge">3m</div>
              </div>
              
              <div class="chart-container">
                <ClientOnly>
                  <apexchart
                    v-if="mounted"
                    type="bar"
                    height="140"
                    :options="retentionChartOptions"
                    :series="retentionChartSeries"
                  />
                </ClientOnly>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import VerticalMenu from '~/components/navigation/VerticalMenu.vue';
import { useVerticalMenu } from '~/composables/useVerticalMenu';

const mounted = ref(false);
const drawerOpen = ref(false);
const { state: menuState } = useVerticalMenu();

let hoverTimeout: NodeJS.Timeout | null = null;

const handleMouseEnter = () => {
  // Open drawer when mouse enters the left edge
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
  }
  drawerOpen.value = true;
};

const handleMouseLeave = () => {
  // Delay closing the drawer to allow moving to drawer
  hoverTimeout = setTimeout(() => {
    drawerOpen.value = false;
  }, 300);
};

const handleDrawerEnter = () => {
  // Cancel close timeout when mouse enters drawer
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
  }
};

const handleDrawerLeave = () => {
  // Close drawer when mouse leaves drawer
  drawerOpen.value = false;
};

const activationProgress = ref([
  { label: 'Signed up', value: 100, percentage: '100%', disabled: false },
  { label: 'Setup', value: 68, percentage: '68%', disabled: false },
  { label: 'Used', value: 70, percentage: '70%', disabled: false },
  { label: 'Aha!', value: 68, percentage: '68%', disabled: false },
  { label: 'Activated', value: 0, percentage: '0%', disabled: true },
]);

const powerUsers = ref([
  { id: 1, email: 'rev@iasch-harthe.com', status: 'Power user for 7 weeks', initial: 'R', color: '#3b82f6' },
  { id: 2, email: 'galen@bartoletti.jsst-and-...', status: 'Power user for 7 weeks', initial: 'G', color: '#f97316' },
  { id: 3, email: 'shanna@runolfsson-wintheiser.com', status: 'Power user for 7 weeks', initial: 'S', color: '#8b5cf6' },
  { id: 4, email: 'harley@hagenes-cruickshank-and-...', status: 'Power user for 7 weeks', initial: 'H', color: '#06b6d4' },
]);

// Chart configurations
const companiesChartSeries = ref([
  {
    name: 'Companies',
    data: [45, 52, 48, 55, 60, 72, 85, 78, 70, 65, 58, 62, 68, 75, 82, 88, 92, 85, 78, 72, 68, 75, 82, 88, 94]
  }
]);

const companiesChartOptions = computed(() => ({
  chart: {
    type: 'area',
    background: 'transparent',
    toolbar: { show: false },
    zoom: { enabled: false },
    sparkline: { enabled: false }
  },
  colors: ['#8b5cf6'],
  stroke: { width: 2, curve: 'smooth' },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: Array.from({ length: 25 }, (_, i) => `Day ${i + 1}`),
    labels: { show: true, style: { colors: '#9ca3af', fontSize: '10px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { show: false }
  },
  grid: {
    show: false
  },
  tooltip: {
    theme: 'light',
    x: { show: false }
  }
}));

const newUsersChartSeries = ref([
  {
    name: 'New Users',
    data: [120, 140, 130, 150, 160, 180, 200, 220, 240, 210, 190, 170, 160, 180, 200, 220, 230, 210, 190, 180, 200, 210, 220, 210, 216]
  }
]);

const newUsersChartOptions = computed(() => ({
  chart: {
    type: 'area',
    background: 'transparent',
    toolbar: { show: false },
    zoom: { enabled: false },
    sparkline: { enabled: false }
  },
  colors: ['#8b5cf6'],
  stroke: { width: 2, curve: 'smooth' },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: Array.from({ length: 25 }, (_, i) => `Day ${i + 1}`),
    labels: { show: true, style: { colors: '#9ca3af', fontSize: '10px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { show: false }
  },
  grid: {
    show: false
  },
  tooltip: {
    theme: 'light',
    x: { show: false }
  }
}));

const activeUsersChartSeries = ref([
  {
    name: 'Active Users',
    data: [80, 88, 85, 92, 95, 102, 108, 112, 105, 98, 92, 88, 95, 102, 108, 112, 118, 110, 105, 100, 95, 105, 110, 112, 115]
  }
]);

const activeUsersChartOptions = computed(() => ({
  chart: {
    type: 'area',
    background: 'transparent',
    toolbar: { show: false },
    zoom: { enabled: false },
    sparkline: { enabled: false }
  },
  colors: ['#8b5cf6'],
  stroke: { width: 2, curve: 'smooth' },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: Array.from({ length: 25 }, (_, i) => `Day ${i + 1}`),
    labels: { show: true, style: { colors: '#9ca3af', fontSize: '10px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { show: false }
  },
  grid: {
    show: false
  },
  tooltip: {
    theme: 'light',
    x: { show: false }
  }
}));

const retentionChartSeries = ref([
  {
    name: 'Retention',
    data: [95, 88, 82, 75, 68, 62, 58]
  }
]);

const retentionChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    background: 'transparent',
    toolbar: { show: false },
    sparkline: { enabled: false }
  },
  colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f5f3ff', '#faf5ff'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '70%',
      borderRadius: 4,
      distributed: true
    }
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  xaxis: {
    categories: ['1', '2', '3', '4', '5', '6', '7'],
    labels: { style: { colors: '#9ca3af', fontSize: '10px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { show: false }
  },
  grid: {
    show: false
  },
  tooltip: {
    theme: 'light'
  }
}));

onMounted(() => {
  mounted.value = true;
  drawerOpen.value = false;
});
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf2f8 0%, #faf5ff 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  position: relative;
}

/* Hover trigger area */
.drawer-hover-trigger {
  position: fixed;
  left: 0;
  top: 0;
  width: 20px;
  height: 100vh;
  z-index: 3000;
  background: transparent;
}

/* Drawer Styles */
:deep(.dashboard-drawer) {
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  margin-left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: transparent;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-icon {
  font-size: 24px;
}

.header-title h1 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.content-area {
  flex: 1;
  padding: 0 32px 32px;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.metric-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.metric-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.metric-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-icon {
  font-size: 14px;
}

.metric-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.metric-value.large {
  font-size: 32px;
}

.time-badge {
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

/* Progress List */
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-label {
  font-size: 13px;
  color: #374151;
  font-weight: 400;
}

.progress-label.disabled {
  color: #d1d5db;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
}

.progress-percent {
  font-size: 12px;
  font-weight: 600;
  color: #8b5cf6;
  min-width: 40px;
  text-align: right;
}

.progress-percent.disabled {
  color: #d1d5db;
}

/* Chart Container */
.chart-container {
  margin-top: 16px;
  margin-left: -8px;
  margin-right: -8px;
}

/* User List */
.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-text {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-email {
  font-size: 13px;
  color: #111827;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-status {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
