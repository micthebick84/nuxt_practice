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

// GUID → URL mapping from menuurl.txt (without .do)
const GUID_URL_MAP: Record<string, string> = {
  '49614AF4-9C98-4EEA-96CE-CFDBD69DE23D': '/main/nms/devPerf',
  '387167E1-B897-11E7-BF32-42F2E997FE51': '/main/oms/errHistory',
  'BDAF11A9-B895-11E7-BF32-42F2E997FE51': '/main/oms/errStatus',
  'BB590E9A-A453-4F8A-B1D8-737A4D07BDD0': '/d3map/topology',
  'E3C9D4B0-0B60-47ED-8870-05F9605E12C0': '/main/oms/errorBoardList',
  '0BEBE9B8-FF65-4040-8A80-8AED3A2CB7BE': '/main/oms/supportBoardList',
  '2C6D4E2D-D444-4697-B77B-34B2BE34151A': '/main/oms/noticeBoardList',
  '9E594132-8942-47B8-AC46-0BDB74429E61': '/main/env/svrMgmt',
  '2EC61A02-01BE-11EE-96C9-005056040133': '/main/tms3/rawdataFSearch',
  '088A480C-ACCC-4369-B0EC-7D631CCE8169': '/main/errFree/abnlDtcRealtime',
  '8A3F82B0-FD5B-4AE0-9BDC-F649C9AAF176': '/main/env/loginHist',
  '9CF64ED0-19B0-4AD0-9B60-E857EFCC2C73': '/main/nms/devStatus',
  '9F76B61A-0219-490C-A8C8-DAC26A949CD5': '/main/env/grpMgmt',
  '1D26DA5D-C6DA-4FD1-8D0B-6B82CC84058A': '/main/env/userConf',
  'D066C7DE-DBF8-40D7-8835-DE848C850637': '/main/env/authGrpConf',
  '3082C6B1-274E-40A3-9072-2220556996F5': '/main/env/policyConf',
  '0DD1E2EB-BF4B-4F3B-9074-F3BB27490765': '/main/env/menuAuth',
  'C48K3FL2-140A-485U-E1BV-17A8CH7A58G2': '/main/env/themaConf',
};

function mapMenu(menu: BackendMenu, parentPath: string): MenuItem {
  const item: MenuItem = {
    id: `menu-${menu.menuNo}`,
    label: menu.menuName,
    icon: 'article',
  };

  if (menu.menuType === 'LINK' && menu.guid) {
    item.route = menu.guid;
    item.external = true;
  } else if (menu.guid && GUID_URL_MAP[menu.guid.toUpperCase()]) {
    item.route = GUID_URL_MAP[menu.guid.toUpperCase()];
  } else {
    item.route = `${parentPath}/${menu.menuName}`;
  }

  return item;
}

function mapPageGroup(group: BackendPageGroup, parentPath: string): MenuItem {
  const groupPath = `${parentPath}/${group.pageGrpName}`;
  const children = (group.children || []).map((m) => mapMenu(m, groupPath));

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
  const pagePath = `/${page.pageName}`;
  const children = (page.children || []).map((g) => mapPageGroup(g, pagePath));

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
