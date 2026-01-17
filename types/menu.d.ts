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
