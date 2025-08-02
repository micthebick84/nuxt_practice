<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-lg">API 엔드포인트 상세 정보</div>
    
    <!-- 엔드포인트 기본 정보 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">GET /api/menu/mcp-hierarchical</div>
        <div class="text-subtitle2 q-mb-sm">계층형 메뉴 데이터를 반환하는 API (GET 방식)</div>
        
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label><strong>HTTP 메서드:</strong> GET</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label><strong>URL:</strong> /api/menu/mcp-hierarchical</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label><strong>Content-Type:</strong> application/json</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label><strong>설명:</strong> MCP를 통해 메뉴 데이터를 가져오는 API (GET 방식)</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 요청 파라미터 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">요청 파라미터</div>
        <div class="text-subtitle2 q-mb-sm">GET 요청 쿼리 파라미터</div>
        
        <q-table
          :rows="requestParams"
          :columns="paramColumns"
          row-key="name"
          flat
          bordered
        />
      </q-card-section>
    </q-card>

    <!-- 응답 구조 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">응답 구조</div>
        <div class="text-subtitle2 q-mb-sm">API 응답 데이터 구조</div>
        
        <q-tabs v-model="activeTab" class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
          <q-tab name="response" label="응답 구조" />
          <q-tab name="menuItem" label="MenuItem 타입" />
          <q-tab name="example" label="응답 예시" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="response" class="q-pa-none">
            <div class="q-pa-md">
              <div class="text-subtitle2 q-mb-sm">MenuResponse 인터페이스:</div>
              <q-card flat bordered>
                <q-card-section>
                  <pre class="text-caption">interface MenuResponse {
  success: boolean;      // 요청 성공 여부
  data: MenuItem[];      // 메뉴 데이터 배열
  message?: string;      // 응답 메시지 (선택사항)
}</pre>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <q-tab-panel name="menuItem" class="q-pa-none">
            <div class="q-pa-md">
              <div class="text-subtitle2 q-mb-sm">MenuItem 인터페이스:</div>
              <q-card flat bordered>
                <q-card-section>
                  <pre class="text-caption">interface MenuItem {
  guid: string;          // 메뉴 고유 식별자
  menuName: string;      // 메뉴 이름
  menuLevel: number;     // 메뉴 레벨 (1: 대메뉴, 2: 중메뉴, 3: 소메뉴)
  parentGuid?: string;   // 부모 메뉴 GUID (선택사항)
  menuUrl?: string;      // 메뉴 URL (선택사항)
  menuIcon?: string;     // 메뉴 아이콘 (선택사항)
  sortOrder: number;     // 정렬 순서
  isVisible: boolean;    // 표시 여부
  isEnabled: boolean;    // 활성화 여부
  children?: MenuItem[]; // 하위 메뉴 (선택사항)
}</pre>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <q-tab-panel name="example" class="q-pa-none">
            <div class="q-pa-md">
              <div class="text-subtitle2 q-mb-sm">성공 응답 예시:</div>
              <q-card flat bordered>
                <q-card-section>
                  <pre class="text-caption">{{ responseExample }}</pre>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

    <!-- 메뉴 데이터 구조 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">메뉴 데이터 구조</div>
        <div class="text-subtitle2 q-mb-sm">계층형 메뉴 구조 분석</div>
        
        <q-list>
          <q-item v-for="level in menuLevels" :key="level.level">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                Level {{ level.level }}: {{ level.name }}
              </q-item-label>
              <q-item-label caption>{{ level.description }}</q-item-label>
              <q-item-label caption v-if="level.examples">
                <strong>예시:</strong> {{ level.examples }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip :color="level.color" :label="level.count + '개'" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- API 테스트 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">API 테스트</div>
        <div class="text-subtitle2 q-mb-sm">실제 API 호출 테스트</div>
        
        <div class="row q-gutter-md q-mb-md">
          <q-btn
            color="primary"
            label="기본 파라미터로 테스트"
            @click="testWithDefaultParams"
            :loading="testingDefault"
          />
          <q-btn
            color="secondary"
            label="커스텀 파라미터로 테스트"
            @click="testWithCustomParams"
            :loading="testingCustom"
          />
        </div>

        <!-- 테스트 파라미터 입력 -->
        <div v-if="showCustomParams" class="q-mb-md">
          <div class="text-subtitle2 q-mb-sm">커스텀 파라미터:</div>
          <div class="row q-gutter-md">
            <q-input
              v-model="customParams.userId"
              label="userId"
              outlined
              dense
              class="col-12 col-md-3"
            />
            <q-input
              v-model="customParams.siteName"
              label="siteName"
              outlined
              dense
              class="col-12 col-md-3"
            />
            <q-input
              v-model="customParams.auth"
              label="auth"
              outlined
              dense
              class="col-12 col-md-3"
            />
            <q-input
              v-model="customParams.menuAuthNo"
              label="menuAuthNo"
              outlined
              dense
              class="col-12 col-md-3"
            />
          </div>
        </div>

        <!-- 테스트 결과 -->
        <div v-if="testResult" class="q-mt-md">
          <div class="text-subtitle2 q-mb-sm">테스트 결과:</div>
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center q-mb-sm">
                <q-chip :color="testResult.success ? 'positive' : 'negative'" :label="testResult.success ? '성공' : '실패'" />
                <span class="q-ml-sm">{{ testResult.message }}</span>
              </div>
              <div v-if="testResult.data" class="q-mt-sm">
                <div class="text-subtitle2 q-mb-sm">반환된 메뉴 데이터:</div>
                <q-list dense>
                  <q-item v-for="menu in testResult.data" :key="menu.guid">
                    <q-item-section>
                      <q-item-label>{{ menu.menuName }}</q-item-label>
                      <q-item-label caption>
                        Level {{ menu.menuLevel }} | URL: {{ menu.menuUrl || 'N/A' }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-chip :color="getLevelColor(menu.menuLevel)" :label="'L' + menu.menuLevel" size="sm" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>

    <!-- 구현 세부사항 -->
    <q-card>
      <q-card-section>
        <div class="text-h6">구현 세부사항</div>
        <div class="text-subtitle2 q-mb-sm">API 구현 내용</div>
        
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">파일 위치:</q-item-label>
              <q-item-label caption>server/api/menu/hierarchical.post.ts</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">현재 상태:</q-item-label>
              <q-item-label caption>샘플 데이터 반환 (MCP 연동 준비 중)</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">MCP 연동:</q-item-label>
              <q-item-label caption>향후 MCP 서버와 연동하여 실제 메뉴 데이터 제공 예정</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">에러 처리:</q-item-label>
              <q-item-label caption>try-catch 블록으로 에러 처리 및 적절한 에러 응답 반환</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
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
const testingDefault = ref(false)
const testingCustom = ref(false)
const showCustomParams = ref(false)
const testResult = ref<any>(null)
const activeTab = ref('response')

// 커스텀 파라미터
const customParams = ref({
  userId: 'admin',
  siteName: 'Netis v6.6',
  auth: 'admin',
  menuAuthNo: '1'
})

// 요청 파라미터 테이블
const paramColumns = [
  { name: 'name', label: '파라미터명', field: 'name', align: 'left' as const },
  { name: 'type', label: '타입', field: 'type', align: 'left' as const },
  { name: 'required', label: '필수', field: 'required', align: 'center' as const },
  { name: 'default', label: '기본값', field: 'default', align: 'left' as const },
  { name: 'description', label: '설명', field: 'description', align: 'left' as const }
]

const requestParams = ref([
  {
    name: 'userId',
    type: 'string',
    required: false,
    default: 'admin',
    description: '사용자 ID'
  },
  {
    name: 'siteName',
    type: 'string',
    required: false,
    default: 'Netis v6.6',
    description: '사이트 이름'
  },
  {
    name: 'auth',
    type: 'string',
    required: false,
    default: 'admin',
    description: '권한 정보'
  },
  {
    name: 'menuAuthNo',
    type: 'string',
    required: false,
    default: '1',
    description: '메뉴 권한 번호'
  }
])

// 메뉴 레벨 정보
const menuLevels = ref([
  {
    level: 1,
    name: '대메뉴',
    description: '최상위 메뉴 항목들',
    examples: '홈, 코스, 관리, 테스트',
    count: 4,
    color: 'primary'
  },
  {
    level: 2,
    name: '중메뉴',
    description: '대메뉴 하위의 서브 메뉴들',
    examples: 'HTML/CSS, JavaScript, Frontend, 대시보드, 사용자 관리',
    count: 5,
    color: 'secondary'
  },
  {
    level: 3,
    name: '소메뉴',
    description: '중메뉴 하위의 상세 메뉴들',
    examples: '기초 문법, 실전 프로젝트, ES6+ 문법, DOM 조작',
    count: 4,
    color: 'accent'
  }
])

// 응답 예시
const responseExample = ref(`{
  "success": true,
  "data": [
    {
      "guid": "main-1",
      "menuName": "홈",
      "menuLevel": 1,
      "menuUrl": "/",
      "menuIcon": "home",
      "sortOrder": 1,
      "isVisible": true,
      "isEnabled": true
    },
    {
      "guid": "sub-1",
      "menuName": "HTML/CSS",
      "menuLevel": 2,
      "parentGuid": "main-2",
      "menuUrl": "/course/html-css",
      "menuIcon": "code",
      "sortOrder": 1,
      "isVisible": true,
      "isEnabled": true
    }
  ],
  "message": "메뉴 데이터를 성공적으로 가져왔습니다."
}`)

// 레벨별 색상 반환
const getLevelColor = (level: number) => {
  switch (level) {
    case 1: return 'primary'
    case 2: return 'secondary'
    case 3: return 'accent'
    default: return 'grey'
  }
}

// 기본 파라미터로 테스트
const testWithDefaultParams = async () => {
  testingDefault.value = true
  testResult.value = null
  
  try {
    const response = await $fetch('/api/menu/mcp-hierarchical', {
      method: 'GET',
      query: {
        userId: 'admin',
        siteName: 'Netis v6.6',
        auth: 'admin',
        menuAuthNo: '1'
      }
    })
    
    testResult.value = response
  } catch (error) {
    testResult.value = {
      success: false,
      message: `테스트 실패: ${error}`,
      data: null
    }
  } finally {
    testingDefault.value = false
  }
}

// 커스텀 파라미터로 테스트
const testWithCustomParams = async () => {
  testingCustom.value = true
  testResult.value = null
  
  try {
    const response = await $fetch('/api/menu/mcp-hierarchical', {
      method: 'GET',
      query: customParams.value
    })
    
    testResult.value = response
  } catch (error) {
    testResult.value = {
      success: false,
      message: `테스트 실패: ${error}`,
      data: null
    }
  } finally {
    testingCustom.value = false
  }
}

// 커스텀 파라미터 표시 토글
const toggleCustomParams = () => {
  showCustomParams.value = !showCustomParams.value
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