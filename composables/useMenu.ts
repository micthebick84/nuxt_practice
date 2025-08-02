import type { MenuItem, ApiMenuItem, ApiMenuGroup, ApiMenuDetail } from '~/types/menu'

interface MenuResponse {
  success: boolean
  data: MenuItem[]
  message?: string
}

export const useMenu = () => {
  const menuItems = ref<MenuItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // API 데이터를 MenuItem 형태로 변환하는 함수
  const transformApiDataToMenuItems = (apiData: ApiMenuItem[]): MenuItem[] => {
    const menuItems: MenuItem[] = []
    
    apiData.forEach((mainMenu, mainIndex) => {
      // 대메뉴 생성
      const mainMenuItem: MenuItem = {
        guid: `main-${mainMenu.pageNo}`,
        menuName: mainMenu.pageName,
        menuLevel: 1,
        menuUrl: `/${mainMenu.pageNo}`,
        menuIcon: mainMenu.webIconClass,
        sortOrder: mainMenu.orderNo || mainIndex + 1,
        isVisible: true,
        isEnabled: true,
        children: []
      }
      
      // 중메뉴와 소메뉴 처리
      if (mainMenu.children) {
        mainMenu.children.forEach((subMenu, subIndex) => {
          // 중메뉴 생성
          const subMenuItem: MenuItem = {
            guid: `sub-${subMenu.pageGrpNo}`,
            menuName: subMenu.pageGrpName,
            menuLevel: 2,
            parentGuid: mainMenuItem.guid,
            menuUrl: `/${mainMenu.pageNo}/${subMenu.pageGrpNo}`,
            menuIcon: 'subdirectory_arrow_right',
            sortOrder: subMenu.orderNo || subIndex + 1,
            isVisible: true,
            isEnabled: true,
            children: []
          }
          
          // 소메뉴 처리
          if (subMenu.children) {
            subMenu.children.forEach((detailMenu, detailIndex) => {
              const detailMenuItem: MenuItem = {
                guid: detailMenu.guid,
                menuName: detailMenu.menuName,
                menuLevel: 3,
                parentGuid: subMenuItem.guid,
                menuUrl: `/${mainMenu.pageNo}/${subMenu.pageGrpNo}/${detailMenu.menuNo}`,
                menuIcon: 'article',
                sortOrder: detailMenu.orderNo || detailIndex + 1,
                isVisible: true,
                isEnabled: true
              }
              
              // 소메뉴를 중메뉴의 children에 추가
              subMenuItem.children!.push(detailMenuItem)
              
              // 소메뉴를 전체 메뉴 아이템에 추가
              menuItems.push(detailMenuItem)
            })
          }
          
          // 중메뉴를 대메뉴의 children에 추가
          mainMenuItem.children!.push(subMenuItem)
          
          // 중메뉴를 전체 메뉴 아이템에 추가
          menuItems.push(subMenuItem)
        })
      }
      
      // 대메뉴를 전체 메뉴 아이템에 추가
      menuItems.push(mainMenuItem)
    })
    
    return menuItems
  }

  // 대메뉴, 중메뉴, 소메뉴로 분류된 메뉴 구조
  const menuStructure = computed(() => {
    const structure: {
      mainMenus: MenuItem[]
      subMenus: { [key: string]: MenuItem[] }
      detailMenus: { [key: string]: MenuItem[] }
    } = {
      mainMenus: [],
      subMenus: {},
      detailMenus: {}
    }

    menuItems.value.forEach(item => {
      if (item.menuLevel === 1) {
        // 대메뉴
        structure.mainMenus.push(item)
      } else if (item.menuLevel === 2) {
        // 중메뉴
        const parentGuid = item.parentGuid || 'root'
        if (!structure.subMenus[parentGuid]) {
          structure.subMenus[parentGuid] = []
        }
        structure.subMenus[parentGuid].push(item)
      } else if (item.menuLevel === 3) {
        // 소메뉴
        const parentGuid = item.parentGuid || 'root'
        if (!structure.detailMenus[parentGuid]) {
          structure.detailMenus[parentGuid] = []
        }
        structure.detailMenus[parentGuid].push(item)
      }
    })

    return structure
  })

  // 계층형 메뉴 목록 가져오기 (8080 포트 직접 호출)
  const fetchHierarchicalMenu = async (
    userId: string = 'admin',
    siteName: string = 'Netis v6.6',
    auth: string = 'admin',
    menuAuthNo: string = '1'
  ) => {
    isLoading.value = true
    error.value = null

    try {
      // 8080 포트 백엔드 서버에 직접 호출
      const response = await $fetch<ApiMenuItem[]>('http://localhost:8080/api/menu/hierarchical', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        query: {
          userId,
          siteName,
          auth,
          menuAuthNo
        }
      });

      console.log('=== 계층형 메뉴 호출 결과 ===');
      console.log('요청 파라미터:', { userId, siteName, auth, menuAuthNo });
      console.log('응답 전체:', response);

      // 배열 크기로 성공 여부 판단
      const dataArraySize = response.length || 0
      const isSuccess = dataArraySize > 0
      
      console.log('배열 크기 기반 성공 여부:', isSuccess);
      console.log('배열 크기:', dataArraySize);

      if (isSuccess) {
        // API 데이터를 MenuItem 형태로 변환
        const transformedMenuItems = transformApiDataToMenuItems(response);
        menuItems.value = transformedMenuItems;
        
        console.log('변환된 메뉴 아이템:', transformedMenuItems);
        console.log('메뉴 구조 생성 완료:', menuStructure.value);
      } else {
        error.value = `메뉴 데이터가 없습니다. (배열 크기: ${dataArraySize})`
        console.error('메뉴 로드 실패 - 데이터 없음:', error.value)
      }
    } catch (err) {
      console.error('메뉴 조회 실패:', err)
      error.value = '메뉴를 불러오는데 실패했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  // 레이아웃 메뉴 목록 가져오기 (8080 포트 직접 호출)
  const fetchLayoutMenu = async (siteName: string = 'default') => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<MenuResponse>('http://localhost:8080/api/menu/layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { siteName }
      })

      console.log('=== 레이아웃 메뉴 호출 결과 ===')
      console.log('요청 파라미터:', { siteName })
      console.log('응답 전체:', response)
      console.log('응답 데이터 배열 크기:', response.data?.length || 0)
      console.log('메뉴 데이터 상세:', response.data)
      console.log('응답 메시지:', response.message)
      console.log('============================')

      // 배열 크기로 성공 여부 판단
      const dataArraySize = response.data?.length || 0
      const isSuccess = dataArraySize > 0
      
      console.log('배열 크기 기반 성공 여부:', isSuccess)
      console.log('배열 크기:', dataArraySize)

      if (isSuccess) {
        menuItems.value = response.data
        console.log('레이아웃 메뉴 아이템 설정 완료 (배열 크기:', dataArraySize, '):', menuItems.value)
        console.log('레이아웃 메뉴 구조 생성 완료: ', menuStructure.value)
      } else {
        error.value = `레이아웃 메뉴 데이터가 없습니다. (배열 크기: ${dataArraySize})`
        console.error('레이아웃 메뉴 로드 실패 - 데이터 없음:', error.value)
      }
    } catch (err) {
      console.error('메뉴 조회 실패:', err)
      error.value = '메뉴를 불러오는데 실패했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  // 메뉴 초기화
  const initializeMenu = async () => {
    console.log('=== 메뉴 초기화 시작 ===')
    await fetchHierarchicalMenu()
    console.log('=== 메뉴 초기화 완료 ===')
  }

  return {
    menuItems: readonly(menuItems),
    menuStructure: readonly(menuStructure),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchHierarchicalMenu,
    fetchLayoutMenu,
    initializeMenu
  }
} 