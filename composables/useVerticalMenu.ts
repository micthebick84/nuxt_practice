import { ref, computed, readonly, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { MenuItem, MenuState } from '~/types/menu';
import { menuItems } from '~/config/menu';

const state = ref<MenuState>({
  isOpen: true,
  miniMode: false,
  activeRoute: '',
  expandedGroups: [],
});

export const useVerticalMenu = () => {
  const router = useRouter();
  const route = useRoute();

  // Load state from localStorage
  if (process.client) {
    const saved = localStorage.getItem('app-menu-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        state.value = { ...state.value, ...parsed };
      } catch (e) {
        console.error('Failed to parse menu state:', e);
      }
    }
  }

  // Save state to localStorage
  const saveState = () => {
    if (process.client) {
      localStorage.setItem('app-menu-state', JSON.stringify(state.value));
    }
  };

  // Actions
  const toggleDrawer = () => {
    state.value.isOpen = !state.value.isOpen;
    saveState();
  };

  const openDrawer = () => {
    state.value.isOpen = true;
    saveState();
  };

  const closeDrawer = () => {
    state.value.isOpen = false;
    saveState();
  };

  const toggleMiniMode = () => {
    state.value.miniMode = !state.value.miniMode;
    saveState();
  };

  const setMiniMode = (mini: boolean) => {
    state.value.miniMode = mini;
    saveState();
  };

  const toggleGroup = (groupId: string) => {
    const index = state.value.expandedGroups.indexOf(groupId);
    if (index > -1) {
      state.value.expandedGroups.splice(index, 1);
    } else {
      state.value.expandedGroups.push(groupId);
    }
    saveState();
  };

  const isGroupExpanded = (groupId: string) => {
    return state.value.expandedGroups.includes(groupId);
  };

  const navigate = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route);
      // Auto-close on mobile
      if (process.client && window.innerWidth < 1024) {
        closeDrawer();
      }
    }
  };

  // Getters
  const visibleMenuItems = computed(() => {
    // TODO: Filter based on user roles
    return menuItems;
  });

  const activeMenuItem = computed(() => {
    return state.value.activeRoute;
  });

  // Watch route changes
  if (process.client) {
    watch(() => route.path, (newPath) => {
      state.value.activeRoute = newPath;
    }, { immediate: true });
  }

  return {
    // State
    state: readonly(state),

    // Actions
    toggleDrawer,
    openDrawer,
    closeDrawer,
    toggleMiniMode,
    setMiniMode,
    toggleGroup,
    isGroupExpanded,
    navigate,

    // Getters
    visibleMenuItems,
    activeMenuItem,
  };
};
