<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Header -->
      <div class="sidebar-header">
        <div v-if="!sidebarCollapsed" class="logo-area">
          <span class="logo-hu">HU</span><span class="logo-metro">metro</span>
        </div>
        <button class="collapse-btn" @click="toggleSidebar">
          <PanelLeftClose v-if="!sidebarCollapsed" :size="18" color="#999999" />
          <PanelLeftOpen v-else :size="18" color="#999999" />
        </button>
      </div>

      <div class="sidebar-divider"></div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <!-- Loading State -->
        <div v-if="menuStore.isLoading" class="nav-loading">
          <q-spinner color="green" size="24px" />
        </div>

        <!-- Dynamic Menu Items from API -->
        <div v-for="page in menuStore.menuItems" :key="page.id" class="nav-group">
          <!-- Top Level Menu (대메뉴) -->
          <button
            class="nav-item top-menu"
            :class="{ expanded: isGroupOpen(page.id) }"
            @click="page.children?.length ? toggleGroup(page.id) : handleNavigate(page)"
          >
            <q-icon :name="page.icon" size="18px" color="white" />
            <span v-if="!sidebarCollapsed" class="nav-label white">{{ page.label }}</span>
            <span v-if="!sidebarCollapsed" class="nav-spacer"></span>
            <ChevronDown
              v-if="!sidebarCollapsed && page.children?.length"
              :size="16"
              class="nav-chevron"
              :class="{ rotated: !isGroupOpen(page.id) }"
              color="#999999"
            />
          </button>

          <!-- Mid Level Menus (중메뉴) -->
          <div v-if="isGroupOpen(page.id) && !sidebarCollapsed && page.children?.length" class="sub-menus">
            <template v-for="group in page.children" :key="group.id">
              <!-- Group with children (expandable 중메뉴) -->
              <template v-if="group.children?.length">
                <button class="nav-item mid-menu" @click="toggleGroup(group.id)">
                  <q-icon :name="group.icon || 'folder'" size="16px" color="grey-6" />
                  <span class="nav-label">{{ group.label }}</span>
                  <span class="nav-spacer"></span>
                  <ChevronDown
                    :size="14"
                    class="nav-chevron"
                    :class="{ rotated: !isGroupOpen(group.id) }"
                    color="#666666"
                  />
                </button>

                <!-- Sub Level Menus (소메뉴) -->
                <div v-if="isGroupOpen(group.id)" class="sub-sub-menus">
                  <NuxtLink
                    v-for="menu in group.children"
                    :key="menu.id"
                    :to="menu.external ? undefined : (menu.route || '#')"
                    class="nav-item sub-menu"
                    @click="menu.external ? openExternal(menu.route) : undefined"
                  >
                    <Circle :size="8" :color="isActiveRoute(menu.route) ? '#4CAF50' : '#666666'" />
                    <span class="nav-label sub" :class="{ active: isActiveRoute(menu.route) }">{{ menu.label }}</span>
                  </NuxtLink>
                </div>
              </template>

              <!-- Flattened group (direct link, no sub-children) -->
              <template v-else>
                <NuxtLink
                  :to="group.external ? undefined : (group.route || '#')"
                  class="nav-item mid-menu"
                  @click="group.external ? openExternal(group.route) : undefined"
                >
                  <q-icon :name="group.icon || 'article'" size="16px" :color="isActiveRoute(group.route) ? 'green' : 'grey-6'" />
                  <span class="nav-label" :class="{ green: isActiveRoute(group.route) }">{{ group.label }}</span>
                </NuxtLink>
              </template>
            </template>
          </div>
        </div>
      </nav>

      <!-- Footer -->
      <div v-if="!sidebarCollapsed" class="sidebar-footer">
        <div class="sidebar-divider"></div>
        <div class="profile-section">
          <div class="profile-avatar">
            <span>{{ userInitial }}</span>
          </div>
          <div class="profile-info">
            <div class="profile-name">{{ userName }}</div>
            <div class="profile-email">{{ userEmail }}</div>
          </div>
          <button class="logout-btn" @click="handleLogout">
            <LogOut :size="18" color="#888888" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Content Area -->
    <main class="content-area">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Circle,
  LogOut,
} from 'lucide-vue-next';
import { useQuasar } from 'quasar';
import { useMenuStore } from '~/stores/menu';
import { useAuthStore } from '~/stores/auth';
import { useUserStore } from '~/stores/user';
import type { MenuItem } from '~/types/menu';

const { t } = useI18n();
const $q = useQuasar();

const menuStore = useMenuStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const sidebarCollapsed = ref(false);
const openGroups = ref<Set<string>>(new Set());

// User info
const userName = computed(() => authStore.user?.userName || authStore.user?.userId || 'User');
const userEmail = computed(() => authStore.user?.email || '');
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

// Group toggle
const isGroupOpen = (groupId: string) => openGroups.value.has(groupId);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const toggleGroup = (groupId: string) => {
  const newSet = new Set(openGroups.value);
  if (newSet.has(groupId)) {
    newSet.delete(groupId);
  } else {
    newSet.add(groupId);
  }
  openGroups.value = newSet;
};

// Route & Navigation
const isActiveRoute = (menuRoute?: string) => {
  if (!menuRoute) return false;
  return route.path === menuRoute;
};

const handleNavigate = (item: MenuItem) => {
  if (item.route) {
    if (item.external) {
      openExternal(item.route);
    } else {
      router.push(item.route);
    }
  }
};

const openExternal = (url?: string) => {
  if (url && process.client) {
    window.open(url, '_blank');
  }
};

// Logout
const handleLogout = () => {
  $q.dialog({
    title: t('logout'),
    message: t('logoutConfirm'),
    cancel: {
      label: t('no'),
      flat: true,
    },
    ok: {
      label: t('yes'),
      color: 'negative',
    },
    persistent: true,
  }).onOk(() => {
    authStore.logout();
    navigateTo('/login');
  });
};

// Auto-expand groups containing active route
const expandActiveGroups = () => {
  const currentPath = route.path;
  for (const page of menuStore.menuItems) {
    if (page.children) {
      for (const group of page.children) {
        if (group.children) {
          for (const menu of group.children) {
            if (menu.route === currentPath) {
              openGroups.value.add(page.id);
              openGroups.value.add(group.id);
            }
          }
        } else if (group.route === currentPath) {
          openGroups.value.add(page.id);
        }
      }
    }
  }
};

onMounted(async () => {
  authStore.initializeAuth();
  if (authStore.user?.userId) {
    try {
      await Promise.all([
        userStore.fetchProfile(authStore.user.userId),
        menuStore.fetchMenus(),
      ]);
      expandActiveGroups();
    } catch (error) {
      // Continue even if fetch fails
    }
  }
});

// Watch route changes to update active groups
watch(() => route.path, () => {
  expandActiveGroups();
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 280px;
  min-width: 280px;
  background: #0D0D0D;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease, min-width 0.2s ease;
  overflow: hidden;
  padding: 24px 0;
}

.sidebar.collapsed {
  width: 64px;
  min-width: 64px;
}

/* Header */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 64px;
}

.logo-area {
  display: flex;
  align-items: flex-end;
  gap: 1px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.logo-hu {
  color: #4CAF50;
}

.logo-metro {
  color: #78909C;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid #333333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.15s;
}

.collapse-btn:hover {
  background: #252525;
}

.collapsed .sidebar-header {
  justify-content: center;
  padding: 0 12px;
}

/* Divider */
.sidebar-divider {
  height: 1px;
  background: #252525;
  margin: 0;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
}

.nav-group {
  display: flex;
  flex-direction: column;
}

/* Nav Items */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: none;
  background: none;
  color: #CCCCCC;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
}

.nav-item.top-menu {
  padding: 0 12px;
  height: 44px;
  border-radius: 0;
}

.nav-item.top-menu.expanded {
  background: #252525;
}

.nav-item.top-menu:hover {
  background: #1a1a1a;
}

.nav-spacer {
  flex: 1;
}

.nav-label {
  color: #CCCCCC;
  font-weight: normal;
}

.nav-label.white {
  color: #FFFFFF;
  font-weight: 500;
}

.nav-label.green {
  color: #4CAF50;
  font-weight: 500;
}

.nav-label.sub {
  color: #999999;
  font-size: 12px;
}

.nav-label.sub.active {
  color: #4CAF50;
}

.nav-chevron {
  transition: transform 0.2s ease;
}

.nav-chevron.rotated {
  transform: rotate(-90deg);
}

/* Sub menus */
.sub-menus {
  padding-left: 16px;
  display: flex;
  flex-direction: column;
}

.nav-item.mid-menu {
  padding: 0 12px;
  height: 40px;
}

.nav-item.mid-menu:hover {
  background: #1a1a1a;
}

/* Sub-sub menus */
.sub-sub-menus {
  padding-left: 16px;
  display: flex;
  flex-direction: column;
}

.nav-item.sub-menu {
  padding: 0 12px;
  height: 36px;
}

.nav-item.sub-menu:hover {
  background: #1a1a1a;
}

.nav-item.sub-menu.router-link-exact-active .nav-label.sub {
  color: #4CAF50;
}

.collapsed .nav-item {
  justify-content: center;
  padding: 10px;
}

/* Footer */
.sidebar-footer {
  padding: 0;
}

.sidebar-footer .sidebar-divider {
  margin: 0 0 16px 0;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  height: 64px;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-name {
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 500;
}

.profile-email {
  color: #666666;
  font-size: 11px;
}

/* Logout Button */
.logout-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}

.logout-btn:hover {
  background: #252525;
}

/* Content Area */
.content-area {
  flex: 1;
  background: #F8F9FA;
  overflow-y: auto;
  min-width: 0;
}
</style>
