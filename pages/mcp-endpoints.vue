<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-lg">MCP Remote Example 서버 엔드포인트</div>
    
    <!-- MCP 서버 정보 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">MCP 서버 설정</div>
        <div class="text-subtitle2 q-mb-sm">Remote Example 서버 정보</div>
        
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label><strong>서버 URL:</strong> http://localhost:8080/api/v1/sse</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label><strong>프로토콜:</strong> MCP (Model Context Protocol)</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label><strong>명령어:</strong> npx mcp-remote</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 사용자 관리 엔드포인트 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">사용자 관리 컨트롤러</div>
        <div class="text-subtitle2 q-mb-sm">사용자 관련 API 엔드포인트</div>
        
        <q-list>
          <q-item v-for="endpoint in userEndpoints" :key="endpoint.method + endpoint.name">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ endpoint.method }} {{ endpoint.name }}
              </q-item-label>
              <q-item-label caption>{{ endpoint.description }}</q-item-label>
              <q-item-label caption v-if="endpoint.params">
                <strong>파라미터:</strong> {{ endpoint.params }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip color="primary" label="사용자" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 메뉴 관리 엔드포인트 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">메뉴 관리 컨트롤러</div>
        <div class="text-subtitle2 q-mb-sm">메뉴 관련 API 엔드포인트</div>
        
        <q-list>
          <q-item v-for="endpoint in menuEndpoints" :key="endpoint.method + endpoint.name">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ endpoint.method }} {{ endpoint.name }}
              </q-item-label>
              <q-item-label caption>{{ endpoint.description }}</q-item-label>
              <q-item-label caption v-if="endpoint.params">
                <strong>파라미터:</strong> {{ endpoint.params }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip color="secondary" label="메뉴" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 대시보드 엔드포인트 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">대시보드 컨트롤러</div>
        <div class="text-subtitle2 q-mb-sm">대시보드 관련 API 엔드포인트</div>
        
        <q-list>
          <q-item v-for="endpoint in dashboardEndpoints" :key="endpoint.method + endpoint.name">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ endpoint.method }} {{ endpoint.name }}
              </q-item-label>
              <q-item-label caption>{{ endpoint.description }}</q-item-label>
              <q-item-label caption v-if="endpoint.params">
                <strong>파라미터:</strong> {{ endpoint.params }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip color="accent" label="대시보드" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 알람 엔드포인트 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">알람 컨트롤러</div>
        <div class="text-subtitle2 q-mb-sm">알람 관련 API 엔드포인트</div>
        
        <q-list>
          <q-item v-for="endpoint in alarmEndpoints" :key="endpoint.method + endpoint.name">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ endpoint.method }} {{ endpoint.name }}
              </q-item-label>
              <q-item-label caption>{{ endpoint.description }}</q-item-label>
              <q-item-label caption v-if="endpoint.params">
                <strong>파라미터:</strong> {{ endpoint.params }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip color="warning" label="알람" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 유틸리티 엔드포인트 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">유틸리티 컨트롤러</div>
        <div class="text-subtitle2 q-mb-sm">유틸리티 관련 API 엔드포인트</div>
        
        <q-list>
          <q-item v-for="endpoint in utilityEndpoints" :key="endpoint.method + endpoint.name">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ endpoint.method }} {{ endpoint.name }}
              </q-item-label>
              <q-item-label caption>{{ endpoint.description }}</q-item-label>
              <q-item-label caption v-if="endpoint.params">
                <strong>파라미터:</strong> {{ endpoint.params }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip color="info" label="유틸리티" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- API 호출 테스트 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">MCP API 호출 테스트</div>
        <div class="text-subtitle2 q-mb-sm">실제 MCP 서버와의 통신 테스트</div>
        
        <div class="row q-gutter-md">
          <q-btn
            color="primary"
            label="사용자 목록 조회"
            @click="testGetUsers"
            :loading="testingUsers"
          />
          <q-btn
            color="secondary"
            label="계층형 메뉴 조회"
            @click="testGetHierarchicalMenu"
            :loading="testingMenu"
          />
          <q-btn
            color="accent"
            label="현재 시간 조회"
            @click="testGetCurrentDateTime"
            :loading="testingDateTime"
          />
        </div>

        <!-- 테스트 결과 -->
        <div v-if="testResults.length > 0" class="q-mt-md">
          <div class="text-subtitle2 q-mb-sm">테스트 결과:</div>
          <q-list>
            <q-item v-for="result in testResults" :key="result.id">
              <q-item-section>
                <q-item-label>{{ result.name }}</q-item-label>
                <q-item-label caption>{{ result.message }}</q-item-label>
                <q-item-label caption v-if="result.data" class="text-caption">
                  <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip :color="result.success ? 'positive' : 'negative'" :label="result.success ? '성공' : '실패'" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>

    <!-- 요청 예시 -->
    <q-card>
      <q-card-section>
        <div class="text-h6">API 요청 예시</div>
        <div class="text-subtitle2 q-mb-sm">MCP 서버 호출 방법</div>
        
        <q-tabs v-model="activeTab" class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
          <q-tab name="users" label="사용자 API" />
          <q-tab name="menu" label="메뉴 API" />
          <q-tab name="datetime" label="시간 API" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="users" class="q-pa-none">
            <div class="q-pa-md">
              <div class="text-subtitle2 q-mb-sm">사용자 목록 조회:</div>
              <q-card flat bordered>
                <q-card-section>
                  <pre class="text-caption">POST http://localhost:8080/api/v1/sse
Content-Type: application/json

{
  "method": "getUsersByPage",
  "params": {
    "page": 1,
    "size": 10
  }
}</pre>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <q-tab-panel name="menu" class="q-pa-none">
            <div class="q-pa-md">
              <div class="text-subtitle2 q-mb-sm">계층형 메뉴 조회:</div>
              <q-card flat bordered>
                <q-card-section>
                  <pre class="text-caption">POST http://localhost:8080/api/v1/sse
Content-Type: application/json

{
  "method": "getHierarchicalMenuList",
  "params": {
    "userId": "admin",
    "siteName": "Netis v6.6",
    "auth": "admin",
    "menuAuthNo": "1"
  }
}</pre>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <q-tab-panel name="datetime" class="q-pa-none">
            <div class="q-pa-md">
              <div class="text-subtitle2 q-mb-sm">현재 시간 조회:</div>
              <q-card flat bordered>
                <q-card-section>
                  <pre class="text-caption">POST http://localhost:8080/api/v1/sse
Content-Type: application/json

{
  "method": "getCurrentDateTime",
  "params": {}
}</pre>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
// 페이지 레이아웃 설정
definePageMeta({
  layout: 'default'
})

// 테스트 상태
const testingUsers = ref(false)
const testingMenu = ref(false)
const testingDateTime = ref(false)
const testResults = ref<Array<{id: number, name: string, message: string, success: boolean, data?: any}>>([])
const activeTab = ref('users')

// 사용자 관리 엔드포인트
const userEndpoints = ref([
  {
    method: 'POST',
    name: 'getUsersByPage',
    description: '페이지네이션을 통한 사용자 목록 조회',
    params: '{ page: number, size: number }'
  },
  {
    method: 'POST',
    name: 'getUserById',
    description: 'ID로 사용자 정보 조회',
    params: '{ id: string }'
  },
  {
    method: 'POST',
    name: 'getUserByUsername',
    description: '사용자명으로 사용자 정보 조회',
    params: '{ username: string }'
  },
  {
    method: 'POST',
    name: 'createUser',
    description: '새 사용자 생성',
    params: '{ username: string, email: string }'
  },
  {
    method: 'POST',
    name: 'updateUser',
    description: '사용자 정보 업데이트',
    params: '{ id: string, username: string, email: string }'
  },
  {
    method: 'POST',
    name: 'deleteUser',
    description: '사용자 삭제',
    params: '{ id: string }'
  }
])

// 메뉴 관리 엔드포인트
const menuEndpoints = ref([
  {
    method: 'POST',
    name: 'getLayoutMenuList',
    description: '레이아웃 메뉴 목록 조회',
    params: '{ siteName: string }'
  },
  {
    method: 'POST',
    name: 'getHierarchicalMenuList',
    description: '계층적 메뉴 목록 조회 (권한 필터링)',
    params: '{ userId: string, siteName: string, auth: string, menuAuthNo: string }'
  },
  {
    method: 'POST',
    name: 'getLayoutMenuCondList',
    description: 'GUID로 레이아웃 메뉴 조건 목록 조회',
    params: '{ guid: string }'
  },
  {
    method: 'POST',
    name: 'getPageGroupList',
    description: '페이지 그룹 목록 조회 (메뉴 카운트 포함)',
    params: '{ siteName: string }'
  },
  {
    method: 'POST',
    name: 'getPageList',
    description: '페이지 목록 조회 (메뉴 카운트 포함)',
    params: '{ siteName: string }'
  },
  {
    method: 'POST',
    name: 'getMenuAuthExistCnt',
    description: '사용자의 메뉴 권한 존재 여부 확인',
    params: '{ userId: string, guid: string }'
  },
  {
    method: 'POST',
    name: 'getMenuLoc',
    description: 'GUID로 메뉴 위치 정보 조회',
    params: '{ guid: string }'
  },
  {
    method: 'POST',
    name: 'getMenuListAll',
    description: '전체 메뉴 목록 조회 (레이아웃 필터링 옵션)',
    params: '{ siteName: string, disableLayout?: boolean }'
  }
])

// 대시보드 엔드포인트
const dashboardEndpoints = ref([
  {
    method: 'POST',
    name: 'getDashMenuNo',
    description: '대시보드 메뉴 번호 조회',
    params: '{}'
  }
])

// 알람 엔드포인트
const alarmEndpoints = ref([
  {
    method: 'POST',
    name: 'setAlarm',
    description: 'ISO-8601 형식의 시간으로 사용자 알람 설정',
    params: '{ time: string }'
  }
])

// 유틸리티 엔드포인트
const utilityEndpoints = ref([
  {
    method: 'POST',
    name: 'getCurrentDateTime',
    description: '사용자 시간대의 현재 날짜/시간 조회',
    params: '{}'
  }
])

// MCP API 호출 함수
const callMCPAPI = async (method: string, params: any) => {
  try {
    const response = await $fetch('http://localhost:8080/api/v1/sse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        method,
        params
      }
    })
    return { success: true, data: response }
  } catch (error) {
    return { success: false, error }
  }
}

// 사용자 목록 조회 테스트
const testGetUsers = async () => {
  testingUsers.value = true
  const resultId = Date.now()
  
  const result = await callMCPAPI('getUsersByPage', { page: 1, size: 5 })
  
  testResults.value.push({
    id: resultId,
    name: '사용자 목록 조회',
    message: result.success ? '사용자 목록을 성공적으로 가져왔습니다.' : `실패: ${result.error}`,
    success: result.success,
    data: result.success ? result.data : undefined
  })
  
  testingUsers.value = false
}

// 계층형 메뉴 조회 테스트
const testGetHierarchicalMenu = async () => {
  testingMenu.value = true
  const resultId = Date.now()
  
  const result = await callMCPAPI('getHierarchicalMenuList', {
    userId: 'admin',
    siteName: 'Netis v6.6',
    auth: 'admin',
    menuAuthNo: '1'
  })
  
  testResults.value.push({
    id: resultId,
    name: '계층형 메뉴 조회',
    message: result.success ? '메뉴 목록을 성공적으로 가져왔습니다.' : `실패: ${result.error}`,
    success: result.success,
    data: result.success ? result.data : undefined
  })
  
  testingMenu.value = false
}

// 현재 시간 조회 테스트
const testGetCurrentDateTime = async () => {
  testingDateTime.value = true
  const resultId = Date.now()
  
  const result = await callMCPAPI('getCurrentDateTime', {})
  
  testResults.value.push({
    id: resultId,
    name: '현재 시간 조회',
    message: result.success ? '현재 시간을 성공적으로 가져왔습니다.' : `실패: ${result.error}`,
    success: result.success,
    data: result.success ? result.data : undefined
  })
  
  testingDateTime.value = false
}
</script>

<style scoped>
pre {
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  overflow-x: auto;
}
</style> 