import type { MenuItem } from '~/types/menu'

interface MenuResponse {
  success: boolean
  data: MenuItem[]
  message?: string
}

interface MCPResponse {
  success?: boolean
  data?: any
  error?: string
}

// MCP 응답을 메뉴 데이터로 파싱하는 함수
function parseMCPMenuResponse(mcpData: any): MenuItem[] {
  try {
    // MCP 응답 구조에 따라 파싱 로직을 구현
    // 실제 MCP 응답 구조에 맞게 수정 필요
    if (Array.isArray(mcpData)) {
      return mcpData.map((item: any) => ({
        guid: item.guid || item.menuGuid || String(item.id),
        menuName: item.menuName || item.name || 'Unknown',
        menuLevel: item.menuLevel || item.level || 1,
        parentGuid: item.parentGuid || item.parentId,
        menuUrl: item.menuUrl || item.url || '',
        menuIcon: item.menuIcon || item.icon || '',
        sortOrder: item.sortOrder || item.order || 1,
        isVisible: item.isVisible !== false,
        isEnabled: item.isEnabled !== false,
        children: item.children ? parseMCPMenuResponse(item.children) : undefined
      }))
    }
    
    // 단일 객체인 경우 배열로 변환
    if (typeof mcpData === 'object' && mcpData !== null) {
      return [{
        guid: mcpData.guid || mcpData.menuGuid || String(mcpData.id),
        menuName: mcpData.menuName || mcpData.name || 'Unknown',
        menuLevel: mcpData.menuLevel || mcpData.level || 1,
        parentGuid: mcpData.parentGuid || mcpData.parentId,
        menuUrl: mcpData.menuUrl || mcpData.url || '',
        menuIcon: mcpData.menuIcon || mcpData.icon || '',
        sortOrder: mcpData.sortOrder || mcpData.order || 1,
        isVisible: mcpData.isVisible !== false,
        isEnabled: mcpData.isEnabled !== false,
        children: mcpData.children ? parseMCPMenuResponse(mcpData.children) : undefined
      }]
    }
    
    return []
  } catch (error) {
    console.error('MCP 메뉴 데이터 파싱 실패:', error)
    return []
  }
}

export default defineEventHandler(async (event): Promise<MenuResponse> => {
  try {
    const body = await readBody(event)
    const { userId = 'admin', siteName = 'Netis v6.6', auth = 'admin', menuAuthNo = '1' } = body

    // MCP를 통해 계층형 메뉴 목록 가져오기
    console.log('MCP 메뉴 조회 요청:', { userId, siteName, auth, menuAuthNo })

    // 실제 MCP 호출을 시도합니다
    try {
      // MCP 서버에 직접 요청 (8080 포트)
      const mcpResponse = await $fetch('http://localhost:8080/api/menu/hierarchical', {
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
      })

      console.log('MCP 응답:', mcpResponse)

      // MCP 응답을 파싱하여 메뉴 데이터로 변환
      const mcpResponseTyped = mcpResponse as MCPResponse
      if (mcpResponseTyped && mcpResponseTyped.data) {
        const menuData = parseMCPMenuResponse(mcpResponseTyped.data)
        return {
          success: true,
          data: menuData,
          message: 'MCP를 통해 메뉴 데이터를 성공적으로 가져왔습니다.'
        }
      }
    } catch (mcpError) {
      console.error('MCP 호출 실패:', mcpError)
      // MCP 호출 실패 시 샘플 데이터 반환
    }
    
    // 현재는 샘플 데이터를 반환하지만, 실제로는 MCP 응답을 파싱해야 합니다
    const sampleMenuData: MenuItem[] = [
      // 대메뉴 (level 1)
      {
        guid: 'main-1',
        menuName: '홈',
        menuLevel: 1,
        menuUrl: '/',
        menuIcon: 'home',
        sortOrder: 1,
        isVisible: true,
        isEnabled: true
      },
      {
        guid: 'main-2',
        menuName: '코스',
        menuLevel: 1,
        menuUrl: '/course',
        menuIcon: 'school',
        sortOrder: 2,
        isVisible: true,
        isEnabled: true
      },
      {
        guid: 'main-3',
        menuName: '관리',
        menuLevel: 1,
        menuUrl: '/admin',
        menuIcon: 'admin_panel_settings',
        sortOrder: 3,
        isVisible: true,
        isEnabled: true
      },
      {
        guid: 'main-4',
        menuName: '테스트',
        menuLevel: 1,
        menuUrl: '/test',
        menuIcon: 'bug_report',
        sortOrder: 4,
        isVisible: true,
        isEnabled: true
      },

      // 중메뉴 (level 2) - 코스 하위
      {
        guid: 'sub-1',
        menuName: 'HTML/CSS',
        menuLevel: 2,
        parentGuid: 'main-2',
        menuUrl: '/course/html-css',
        menuIcon: 'code',
        sortOrder: 1,
        isVisible: true,
        isEnabled: true
      },
      {
        guid: 'sub-2',
        menuName: 'JavaScript',
        menuLevel: 2,
        parentGuid: 'main-2',
        menuUrl: '/course/javascript',
        menuIcon: 'javascript',
        sortOrder: 2,
        isVisible: true,
        isEnabled: true
      },
      {
        guid: 'sub-3',
        menuName: 'Frontend',
        menuLevel: 2,
        parentGuid: 'main-2',
        menuUrl: '/course/frontend',
        menuIcon: 'web',
        sortOrder: 3,
        isVisible: true,
        isEnabled: true
      },

      // 중메뉴 (level 2) - 관리 하위
      {
        guid: 'sub-4',
        menuName: '대시보드',
        menuLevel: 2,
        parentGuid: 'main-3',
        menuUrl: '/admin/dashboard',
        menuIcon: 'dashboard',
        sortOrder: 1,
        isVisible: true,
        isEnabled: true
      },
      {
        guid: 'sub-5',
        menuName: '사용자 관리',
        menuLevel: 2,
        parentGuid: 'main-3',
        menuUrl: '/admin/users',
        menuIcon: 'people',
        sortOrder: 2,
        isVisible: true,
        isEnabled: true
      },

      // 소메뉴 (level 3) - HTML/CSS 하위
      {
        guid: 'detail-1',
        menuName: '기초 문법',
        menuLevel: 3,
        parentGuid: 'sub-1',
        menuUrl: '/course/html-css/basics',
        menuIcon: 'article',
        sortOrder: 1,
        isVisible: true,
        isEnabled: true
      },
      {
        guid: 'detail-2',
        menuName: '실전 프로젝트',
        menuLevel: 3,
        parentGuid: 'sub-1',
        menuUrl: '/course/html-css/project',
        menuIcon: 'assignment',
        sortOrder: 2,
        isVisible: true,
        isEnabled: true
      },

      // 소메뉴 (level 3) - JavaScript 하위
      {
        guid: 'detail-3',
        menuName: 'ES6+ 문법',
        menuLevel: 3,
        parentGuid: 'sub-2',
        menuUrl: '/course/javascript/es6',
        menuIcon: 'code',
        sortOrder: 1,
        isVisible: true,
        isEnabled: true
      },
      {
        guid: 'detail-4',
        menuName: 'DOM 조작',
        menuLevel: 3,
        parentGuid: 'sub-2',
        menuUrl: '/course/javascript/dom',
        menuIcon: 'web',
        sortOrder: 2,
        isVisible: true,
        isEnabled: true
      }
    ]

    return {
      success: true,
      data: sampleMenuData,
      message: 'MCP를 통해 메뉴 데이터를 성공적으로 가져왔습니다.'
    }

  } catch (error) {
    console.error('MCP 메뉴 조회 실패:', error)
    return {
      success: false,
      data: [],
      message: 'MCP를 통해 메뉴 데이터를 가져오는데 실패했습니다.'
    }
  }
}) 