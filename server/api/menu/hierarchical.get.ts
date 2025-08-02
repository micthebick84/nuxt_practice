import type { ApiMenuItem } from '~/types/menu'

export default defineEventHandler(async (event): Promise<ApiMenuItem[]> => {
  try {
    // GET 요청의 쿼리 파라미터에서 파라미터 추출
    const query = getQuery(event)
    const userId = query.userId as string || 'admin'
    const siteName = query.siteName as string || 'Netis v6.6'
    const auth = query.auth as string || 'admin'
    const menuAuthNo = query.menuAuthNo as string || '1'

    // 8080 포트 백엔드 서버에서 계층형 메뉴 목록 가져오기
    console.log('백엔드 메뉴 조회 요청 (GET):', { userId, siteName, auth, menuAuthNo })

    try {
      // 8080 포트 백엔드 서버에 직접 요청 (GET 방식)
      const backendResponse = await $fetch('http://localhost:8080/api/menu/hierarchical', {
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

      // 백엔드 응답이 성공적이면 그대로 반환
      const typedResponse = backendResponse as ApiMenuItem[]
      
      console.log('=== 백엔드 응답 상세 ===')
      console.log('백엔드 응답 전체:', backendResponse)
      console.log('백엔드 메뉴 데이터 배열 크기:', typedResponse?.length || 0)
      console.log('백엔드 메뉴 데이터 상세:', typedResponse)
      console.log('========================')

      // 배열 크기로 성공 여부 판단
      const dataArraySize = typedResponse?.length || 0
      const isSuccess = dataArraySize > 0
      
      console.log('배열 크기 기반 성공 여부:', isSuccess)
      console.log('배열 크기:', dataArraySize)

      if (isSuccess) {
        console.log('백엔드 응답 성공 - 데이터 반환 (배열 크기:', dataArraySize, ')')
        return typedResponse
      }
    } catch (backendError) {
      console.error('백엔드 호출 실패:', backendError)
      // 백엔드 호출 실패 시 샘플 데이터 반환
    }
    
    // 샘플 데이터 반환 (백엔드 호출 실패 시)
    const sampleMenuData: ApiMenuItem[] = [
      {
        pageNo: "1618",
        pageName: "종합현황",
        orderNo: null,
        webIconClass: "icon_alarm",
        children: [
          {
            pageNo: "1618",
            pageGrpNo: "1620",
            pageGrpName: "종합관제",
            orderNo: null,
            children: [
              {
                pageNo: "1618",
                pageGrpNo: "1620",
                menuNo: "1628",
                menuName: "토폴로지",
                guid: "BB590E9A-A453-4F8A-B1D8-737A4D07BDD0",
                menuAuth: null,
                orderNo: 1,
                menuType: null,
                linkViewType: null,
                grpType: null,
                scondUse: null,
                rtUse: null
              },
              {
                pageNo: "1618",
                pageGrpNo: "1620",
                menuNo: "1816",
                menuName: "네트워크",
                guid: "793B0FBE-8FBD-11ED-8D27-005056010014",
                menuAuth: null,
                orderNo: 2,
                menuType: "WIDGET",
                linkViewType: null,
                grpType: "NONE",
                scondUse: "0",
                rtUse: 0
              }
            ]
          },
          {
            pageNo: "1618",
            pageGrpNo: "1619",
            pageGrpName: "이벤트현황",
            orderNo: null,
            children: [
              {
                pageNo: "1618",
                pageGrpNo: "1619",
                menuNo: "1625",
                menuName: "이벤트현황",
                guid: "BDAF11A9-B895-11E7-BF32-42F2E997FE51",
                menuAuth: null,
                orderNo: 1,
                menuType: null,
                linkViewType: null,
                grpType: null,
                scondUse: null,
                rtUse: null
              }
            ]
          }
        ]
      },
      {
        pageNo: "1567",
        pageName: "네트워크",
        orderNo: null,
        webIconClass: "icon_nms",
        children: [
          {
            pageNo: "1567",
            pageGrpNo: "1569",
            pageGrpName: "네트워크관리",
            orderNo: null,
            children: [
              {
                pageNo: "1567",
                pageGrpNo: "1569",
                menuNo: "1578",
                menuName: "장비성능순위",
                guid: "49614AF4-9C98-4EEA-96CE-CFDBD69DE23D",
                menuAuth: null,
                orderNo: 3,
                menuType: null,
                linkViewType: null,
                grpType: null,
                scondUse: null,
                rtUse: null
              }
            ]
          }
        ]
      }
    ]

    return sampleMenuData

  } catch (error) {
    console.error('메뉴 조회 실패:', error)
    return []
  }
}) 