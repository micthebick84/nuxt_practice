import type { MenuItem, BackendPage, BackendPageGroup, BackendMenu } from '~/types/menu';

const ICON_MAP: Record<string, string> = {
  icon_alarm: 'notifications',
  icon_nms: 'hub',
  icon_sms: 'dns',
  icon_tms: 'router',
  icon_ap: 'wifi',
  icon_env: 'thermostat',
  icon_errfree: 'verified',
  icon_fms: 'storage',
  icon_ipt: 'phone',
  icon_asset: 'inventory_2',
};

function mapIcon(webIconClass: string | null): string {
  if (!webIconClass) return 'folder';
  return ICON_MAP[webIconClass] || 'folder';
}

function mapMenu(menu: BackendMenu): MenuItem {
  const item: MenuItem = {
    id: `menu-${menu.menuNo}`,
    label: menu.menuName,
    icon: 'article',
  };

  if (menu.menuType === 'LINK' && menu.guid) {
    item.route = menu.guid;
    item.external = true;
  } else if (menu.guid) {
    item.route = `/view/${menu.guid}`;
  }

  return item;
}

function mapPageGroup(group: BackendPageGroup): MenuItem {
  const children = (group.children || []).map(mapMenu);

  // If only one child, flatten
  if (children.length === 1) {
    return {
      ...children[0],
      id: `grp-${group.pageGrpNo}`,
      label: group.pageGrpName,
    };
  }

  return {
    id: `grp-${group.pageGrpNo}`,
    label: group.pageGrpName,
    icon: 'folder',
    children,
  };
}

function mapPage(page: BackendPage): MenuItem {
  const children = (page.children || []).map(mapPageGroup);

  return {
    id: `page-${page.pageNo}`,
    label: page.pageName,
    icon: mapIcon(page.webIconClass),
    children,
  };
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    pages: [] as BackendPage[],
    userAuth: null as string | null,
    menuAuthNo: null as number | null,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    menuItems(state): MenuItem[] {
      return state.pages.map(mapPage);
    },
  },

  actions: {
    async fetchComUser(userId: string) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      try {
        const response = await $fetch<{ success: boolean; data: { auth: string; menuAuthNo: number | null } }>(
          `${config.public.apiBaseUrl}/api/users/com/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authStore.accessToken}`,
            },
          },
        );
        if (response.success && response.data) {
          this.userAuth = response.data.auth;
          this.menuAuthNo = response.data.menuAuthNo;
        }
      } catch (error: any) {
        console.error('Failed to fetch ComUser:', error);
      }
    },

    async fetchMenus() {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();

      if (!authStore.user?.userId) return;

      this.isLoading = true;
      this.error = null;

      try {
        // First fetch com_user info for auth and menuAuthNo
        await this.fetchComUser(authStore.user.userId);

        const params = new URLSearchParams({
          userId: authStore.user.userId,
          siteName: config.public.siteName,
          auth: this.userAuth || 'User',
          menuAuthNo: String(this.menuAuthNo ?? 0),
        });

        const response = await $fetch<{ success: boolean; data: BackendPage[] }>(
          `${config.public.apiBaseUrl}/api/menus/hierarchical?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${authStore.accessToken}`,
            },
          },
        );

        if (response.success && response.data) {
          this.pages = response.data;
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch menus';
        console.error('Failed to fetch menus:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot));
}
