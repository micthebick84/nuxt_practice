export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  badge?: number | string;
  roles?: string[];
  separator?: boolean;
  disabled?: boolean;
  external?: boolean;
  type?: 'language-selector' | 'normal';
}

// Backend API response types
export interface BackendMenu {
  menuNo: number;
  menuName: string;
  guid: string | null;
  menuAuth: string | null;
  orderNo: number;
  menuType: string | null; // 'LINK' | 'LAYOUT' | 'WIDGET' | null
  grpType: string | null;
}

export interface BackendPageGroup {
  pageGrpNo: number;
  pageGrpName: string;
  orderNo: number;
  children: BackendMenu[];
}

export interface BackendPage {
  pageNo: number;
  pageName: string;
  orderNo: number;
  webIconClass: string | null;
  children: BackendPageGroup[];
}

export interface MenuConfig {
  items: MenuItem[];
  miniMode: boolean;
  persistent: boolean;
  overlay: boolean;
  width: number;
  miniWidth: number;
}

export interface MenuState {
  isOpen: boolean;
  miniMode: boolean;
  activeRoute: string;
  expandedGroups: string[];
}
