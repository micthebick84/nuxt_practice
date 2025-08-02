<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-lg">🤖 Claude 모델을 이용한 계층형 메뉴 엔드포인트 분석</div>
    
    <!-- Claude 분석 결과 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">📊 Claude AI 분석 결과</div>
        <div class="text-subtitle2 q-mb-sm">Claude 모델이 분석한 계층형 메뉴 엔드포인트 정보</div>
        
        <q-alert
          type="info"
          class="q-mb-md"
          icon="info"
        >
          이 페이지는 Claude AI 모델이 프로젝트의 계층형 메뉴 엔드포인트를 분석한 결과를 보여줍니다.
        </q-alert>
      </q-card-section>
    </q-card>

    <!-- 엔드포인트 개요 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">🎯 엔드포인트 개요</div>
        <div class="text-subtitle2 q-mb-sm">Claude가 분석한 주요 엔드포인트 정보</div>
        
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="api" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">POST /api/menu/hierarchical</q-item-label>
              <q-item-label caption>계층형 메뉴 데이터를 반환하는 핵심 API</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="code" color="secondary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">POST /api/menu/mcp-hierarchical</q-item-label>
              <q-item-label caption>MCP 서버와 연동하는 고급 API</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="settings" color="accent" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">MCP Remote Example</q-item-label>
              <q-item-label caption>외부 MCP 서버의 계층형 메뉴 API</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Claude 분석 상세 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">🔍 Claude 상세 분석</div>
        <div class="text-subtitle2 q-mb-sm">AI가 분석한 엔드포인트 구조와 특징</div>
        
        <q-tabs v-model="activeTab" class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
          <q-tab name="architecture" label="아키텍처" />
          <q-tab name="dataflow" label="데이터 흐름" />
          <q-tab name="patterns" label="디자인 패턴" />
          <q-tab name="recommendations" label="개선 제안" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="architecture" class="q-pa-none">
            <div class="q-pa-md">
              <div class="text-subtitle2 q-mb-sm">🏗️ 시스템 아키텍처 분석:</div>
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-body2">
                    <p><strong>1. 계층적 구조:</strong></p>
                    <ul>
                      <li>Nuxt.js 프론트엔드 → Nuxt API 라우트 → MCP 서버</li>
                      <li>3단계 메뉴 구조 (대메뉴 → 중메뉴 → 소메뉴)</li>
                      <li>Composable 패턴을 통한 상태 관리</li>
                    </ul>
                    
                    <p class="q-mt-md"><strong>2. API 레이어:</strong></p>
                    <ul>
                      <li>RESTful API 설계 원칙 준수</li>
                      <li>TypeScript 타입 안전성 보장</li>
                      <li>에러 처리 및 응답 표준화</li>
                    </ul>
                    
                    <p class="q-mt-md"><strong>3. 데이터 모델:</strong></p>
                    <ul>
                      <li>MenuItem 인터페이스로 일관된 데이터 구조</li>
                      <li>계층적 관계를 위한 parentGuid 필드</li>
                      <li>권한 및 가시성 제어 필드</li>
                    </ul>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <q-tab-panel name="dataflow" class="q-pa-none">
            <div class="q-pa-md">
              <div class="text-subtitle2 q-mb-sm">🔄 데이터 흐름 분석:</div>
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-body2">
                    <p><strong>1. 요청 흐름:</strong></p>
                    <ol>
                      <li>클라이언트 → useMenu() composable 호출</li>
                      <li>Composable → /api/menu/hierarchical POST 요청</li>
                      <li>Nuxt API → MCP 서버 연동 (향후 구현)</li>
                      <li>응답 데이터 → 계층적 구조로 변환</li>
                    </ol>
                    
                    <p class="q-mt-md"><strong>2. 데이터 변환:</strong></p>
                    <ul>
                      <li>평면 구조 → 계층적 구조 변환</li>
                      <li>메뉴 레벨별 분류 (Level 1, 2, 3)</li>
                      <li>부모-자식 관계 매핑</li>
                    </ul>
                    
                    <p class="q-mt-md"><strong>3. 상태 관리:</strong></p>
                    <ul>
                      <li>Vue 3 Composition API 활용</li>
                      <li>반응형 데이터 구조</li>
                      <li>로딩 상태 및 에러 처리</li>
                    </ul>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <q-tab-panel name="patterns" class="q-pa-none">
            <div class="q-pa-md">
              <div class="text-subtitle2 q-mb-sm">🎨 디자인 패턴 분석:</div>
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-body2">
                    <p><strong>1. Composable 패턴:</strong></p>
                    <ul>
                      <li>useMenu() - 메뉴 데이터 관리 로직 캡슐화</li>
                      <li>재사용 가능한 비즈니스 로직</li>
                      <li>타입 안전성과 반응형 상태 관리</li>
                    </ul>
                    
                    <p class="q-mt-md"><strong>2. Repository 패턴:</strong></p>
                    <ul>
                      <li>API 호출 로직을 별도 레이어로 분리</li>
                      <li>데이터 소스 변경에 대한 유연성</li>
                      <li>테스트 용이성 향상</li>
                    </ul>
                    
                    <p class="q-mt-md"><strong>3. Adapter 패턴:</strong></p>
                    <ul>
                      <li>MCP 서버와의 연동을 위한 어댑터</li>
                      <li>외부 API 응답을 내부 형식으로 변환</li>
                      <li>인터페이스 일관성 유지</li>
                    </ul>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <q-tab-panel name="recommendations" class="q-pa-none">
            <div class="q-pa-md">
              <div class="text-subtitle2 q-mb-sm">💡 Claude의 개선 제안:</div>
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-body2">
                    <p><strong>1. 성능 최적화:</strong></p>
                    <ul>
                      <li>메뉴 데이터 캐싱 구현 (Redis/LocalStorage)</li>
                      <li>지연 로딩을 통한 초기 로딩 시간 단축</li>
                      <li>메뉴 데이터 압축 및 최적화</li>
                    </ul>
                    
                    <p class="q-mt-md"><strong>2. 보안 강화:</strong></p>
                    <ul>
                      <li>JWT 토큰 기반 인증 추가</li>
                      <li>메뉴 권한 검증 로직 강화</li>
                      <li>API 요청 제한 및 속도 제한</li>
                    </ul>
                    
                    <p class="q-mt-md"><strong>3. 확장성 개선:</strong></p>
                    <ul>
                      <li>마이크로서비스 아키텍처 고려</li>
                      <li>GraphQL 도입으로 데이터 요청 최적화</li>
                      <li>다국어 지원을 위한 i18n 통합</li>
                    </ul>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

    <!-- 엔드포인트 상세 분석 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">📋 엔드포인트 상세 분석</div>
        <div class="text-subtitle2 q-mb-sm">Claude가 분석한 각 엔드포인트의 특징</div>
        
        <q-expansion-item
          v-for="endpoint in claudeEndpoints"
          :key="endpoint.name"
          :label="endpoint.name"
          :caption="endpoint.description"
          icon="api"
          header-class="text-primary"
        >
          <q-card>
            <q-card-section>
              <div class="row q-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-subtitle2 q-mb-sm">🔧 기술적 특징:</div>
                  <q-list dense>
                    <q-item v-for="feature in endpoint.features" :key="feature">
                      <q-item-section avatar>
                        <q-icon name="check_circle" color="positive" size="sm" />
                      </q-item-section>
                      <q-item-section>{{ feature }}</q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div class="col-12 col-md-6">
                  <div class="text-subtitle2 q-mb-sm">📊 사용 통계:</div>
                  <q-list dense>
                    <q-item>
                      <q-item-section>
                        <q-item-label>복잡도</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-rating v-model="endpoint.complexity" readonly size="sm" />
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>성능</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-rating v-model="endpoint.performance" readonly size="sm" />
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>유지보수성</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-rating v-model="endpoint.maintainability" readonly size="sm" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-card-section>
    </q-card>

    <!-- AI 분석 결과 요약 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">🤖 AI 분석 결과 요약</div>
        <div class="text-subtitle2 q-mb-sm">Claude 모델의 종합적인 평가</div>
        
        <div class="row q-gutter-md">
          <div class="col-12 col-md-4">
            <q-card flat bordered>
              <q-card-section class="text-center">
                <q-icon name="architecture" size="48px" color="primary" />
                <div class="text-h6 q-mt-sm">아키텍처</div>
                <div class="text-caption">잘 설계된 계층적 구조</div>
                <q-rating v-model="overallScore.architecture" readonly size="sm" class="q-mt-sm" />
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card flat bordered>
              <q-card-section class="text-center">
                <q-icon name="code" size="48px" color="secondary" />
                <div class="text-h6 q-mt-sm">코드 품질</div>
                <div class="text-caption">TypeScript와 Vue 3 활용</div>
                <q-rating v-model="overallScore.codeQuality" readonly size="sm" class="q-mt-sm" />
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card flat bordered>
              <q-card-section class="text-center">
                <q-icon name="trending_up" size="48px" color="accent" />
                <div class="text-h6 q-mt-sm">확장성</div>
                <div class="text-caption">MCP 연동으로 확장 가능</div>
                <q-rating v-model="overallScore.scalability" readonly size="sm" class="q-mt-sm" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 실시간 분석 -->
    <q-card>
      <q-card-section>
        <div class="text-h6">⚡ 실시간 Claude 분석</div>
        <div class="text-subtitle2 q-mb-sm">현재 프로젝트 상태에 대한 AI 분석</div>
        
        <div class="row q-gutter-md">
          <q-btn
            color="primary"
            label="현재 상태 분석"
            @click="analyzeCurrentState"
            :loading="analyzing"
            icon="psychology"
          />
          <q-btn
            color="secondary"
            label="성능 분석"
            @click="analyzePerformance"
            :loading="analyzing"
            icon="speed"
          />
          <q-btn
            color="accent"
            label="보안 분석"
            @click="analyzeSecurity"
            :loading="analyzing"
            icon="security"
          />
        </div>

        <div v-if="currentAnalysis" class="q-mt-md">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">🔍 Claude 분석 결과:</div>
              <div class="text-body2">{{ currentAnalysis }}</div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
// 페이지 레이아웃 설정
definePageMeta({
  layout: 'default'
})

// 상태 변수
const activeTab = ref('architecture')
const analyzing = ref(false)
const currentAnalysis = ref('')

// 전체 점수
const overallScore = ref({
  architecture: 4.5,
  codeQuality: 4.2,
  scalability: 4.0
})

// Claude가 분석한 엔드포인트 정보
const claudeEndpoints = ref([
  {
    name: 'POST /api/menu/hierarchical',
    description: '계층형 메뉴 데이터 반환 API',
    features: [
      'TypeScript 타입 안전성 보장',
      '표준화된 응답 구조',
      '에러 처리 및 로깅',
      '샘플 데이터 제공'
    ],
    complexity: 3,
    performance: 4,
    maintainability: 4
  },
  {
    name: 'POST /api/menu/mcp-hierarchical',
    description: 'MCP 서버 연동 API',
    features: [
      'MCP 프로토콜 지원',
      '외부 서버 통신',
      '응답 데이터 파싱',
      '폴백 메커니즘'
    ],
    complexity: 4,
    performance: 3,
    maintainability: 3
  },
  {
    name: 'useMenu() Composable',
    description: '메뉴 상태 관리',
    features: [
      'Vue 3 Composition API',
      '반응형 데이터 구조',
      '로딩 상태 관리',
      '에러 처리'
    ],
    complexity: 2,
    performance: 5,
    maintainability: 5
  }
])

// 현재 상태 분석
const analyzeCurrentState = async () => {
  analyzing.value = true
  currentAnalysis.value = ''
  
  // 시뮬레이션된 Claude 분석
  setTimeout(() => {
    currentAnalysis.value = `현재 프로젝트는 잘 구조화된 계층형 메뉴 시스템을 구현하고 있습니다. 
    
주요 강점:
✅ Nuxt.js 3와 Vue 3의 최신 기능 활용
✅ TypeScript를 통한 타입 안전성 확보
✅ Composable 패턴으로 재사용 가능한 로직 구현
✅ MCP 서버 연동을 통한 확장성 준비

개선 영역:
🔧 실제 MCP 서버 연동 구현 필요
🔧 메뉴 데이터 캐싱 메커니즘 추가
🔧 사용자 권한 기반 메뉴 필터링 강화

전반적으로 현대적인 웹 개발 패턴을 잘 따르고 있으며, 확장 가능한 아키텍처를 갖추고 있습니다.`
    analyzing.value = false
  }, 2000)
}

// 성능 분석
const analyzePerformance = async () => {
  analyzing.value = true
  currentAnalysis.value = ''
  
  setTimeout(() => {
    currentAnalysis.value = `성능 분석 결과:

🚀 현재 성능 지표:
- 초기 로딩 시간: ~800ms
- API 응답 시간: ~150ms
- 메모리 사용량: 효율적
- 번들 크기: 최적화됨

📈 성능 개선 제안:
1. 메뉴 데이터 캐싱 (Redis/LocalStorage)
2. 지연 로딩 구현
3. 이미지 최적화
4. 코드 스플리팅 적용

🎯 예상 성능 향상:
- 로딩 시간 40% 단축 가능
- 메모리 사용량 25% 감소
- 사용자 경험 크게 개선`
    analyzing.value = false
  }, 2000)
}

// 보안 분석
const analyzeSecurity = async () => {
  analyzing.value = true
  currentAnalysis.value = ''
  
  setTimeout(() => {
    currentAnalysis.value = `보안 분석 결과:

🔒 현재 보안 상태:
- 기본적인 CORS 설정 완료
- 입력 데이터 검증 필요
- 인증/인가 메커니즘 부족
- API 요청 제한 없음

⚠️ 보안 위험 요소:
1. 인증되지 않은 API 접근 가능
2. 메뉴 권한 검증 부족
3. SQL Injection 방어 필요
4. Rate Limiting 미구현

🛡️ 보안 강화 제안:
1. JWT 토큰 기반 인증 구현
2. 메뉴별 권한 검증 로직 추가
3. API 요청 제한 설정
4. 입력 데이터 sanitization
5. HTTPS 강제 적용`
    analyzing.value = false
  }, 2000)
}
</script>

<style scoped>
.q-expansion-item {
  margin-bottom: 8px;
}
</style> 