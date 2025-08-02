export interface MenuItem {
  guid: string
  menuName: string
  menuLevel: number
  parentGuid?: string
  menuUrl?: string
  menuIcon?: string
  sortOrder: number
  isVisible: boolean
  isEnabled: boolean
  children?: MenuItem[]
}

// API에서 받아오는 실제 데이터 구조
export interface ApiMenuItem {
  pageNo: string
  pageName: string
  orderNo: number | null
  webIconClass: string
  children?: ApiMenuGroup[]
}

export interface ApiMenuGroup {
  pageNo: string
  pageGrpNo: string
  pageGrpName: string
  orderNo: number | null
  children?: ApiMenuDetail[]
}

export interface ApiMenuDetail {
  pageNo: string
  pageGrpNo: string
  menuNo: string
  menuName: string
  guid: string
  menuAuth: string | null
  orderNo: number
  menuType: string | null
  linkViewType: string | null
  grpType: string | null
  scondUse: string | null
  rtUse: number | null
}

export interface MenuStructure {
  mainMenus: MenuItem[]
  subMenus: { [key: string]: MenuItem[] }
  detailMenus: { [key: string]: MenuItem[] }
} 