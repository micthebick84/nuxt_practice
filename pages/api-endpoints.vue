<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-lg">API 엔드포인트 정보</div>
    
    <!-- Nuxt.js 내부 API 엔드포인트 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Nuxt.js 내부 API 엔드포인트</div>
        <div class="text-subtitle2 q-mb-sm">프로젝트 내부에서 제공하는 API</div>
        
        <q-list>
          <q-item v-for="endpoint in internalEndpoints" :key="endpoint.url">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ endpoint.method }} {{ endpoint.url }}
              </q-item-label>
              <q-item-label caption>{{ endpoint.description }}</q-item-label>
              <q-item-label caption v-if="endpoint.params">
                <strong>파라미터:</strong> {{ endpoint.params }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip :color="endpoint.status === 'active' ? 'positive' : 'warning'" :label="endpoint.status" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 외부 MCP API 엔드포인트 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">외부 MCP API 엔드포인트</div>
        <div class="text-subtitle2 q-mb-sm">MCP 서버에서 제공하는 API</div>
        
        <q-list>
          <q-item v-for="endpoint in mcpEndpoints" :key="endpoint.url">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ endpoint.method }} {{ endpoint.url }}
              </q-item-label>
              <q-item-label caption>{{ endpoint.description }}</q-item-label>
              <q-item-label caption v-if="endpoint.params">
                <strong>파라미터:</strong> {{ endpoint.params }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip :color="endpoint.status === 'active' ? 'positive' : 'negative'" :label="endpoint.status" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 프록시 설정 정보 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">프록시 설정</div>
        <div class="text-subtitle2 q-mb-sm">Nuxt.js 프록시 설정 정보</div>
        
        <q-list>
          <q-item v-for="proxy in proxyConfigs" :key="proxy.path">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ proxy.path }} → {{ proxy.target }}
              </q-item-label>
              <q-item-label caption>{{ proxy.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- API 테스트 섹션 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">API 테스트</div>
        <div class="text-subtitle2 q-mb-sm">엔드포인트 연결 테스트</div>
        
        <div class="row q-gutter-md">
          <q-btn
            color="primary"
            label="내부 메뉴 API 테스트"
            @click="testInternalMenuAPI"
            :loading="testingInternal"
          />
          <q-btn
            color="secondary"
            label="MCP 메뉴 API 테스트"
            @click="testMCPMenuAPI"
            :loading="testingMCP"
          />
          <q-btn
            color="accent"
            label="MCP 서버 연결 테스트"
            @click="testMCPServer"
            :loading="testingMCPServer"
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
              </q-item-section>
              <q-item-section side>
                <q-chip :color="result.success ? 'positive' : 'negative'" :label="result.success ? '성공' : '실패'" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>

    <!-- 환경 설정 정보 -->
    <q-card>
      <q-card-section>
        <div class="text-h6">환경 설정</div>
        <div class="text-subtitle2 q-mb-sm">현재 API 설정 정보</div>
        
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label><strong>API Base URL:</strong> {{ apiBaseUrl }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label><strong>MCP Server URL:</strong> {{ mcpServerUrl }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label><strong>개발 서버 포트:</strong> {{ devServerPort }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useMenu } from '~/composables/useMenu'

// 페이지 레이아웃 설정
definePageMeta({
  layout: 'default'
})

const { fetchHierarchicalMenu } = useMenu()

// 테스트 상태
const testingInternal = ref(false)
const testingMCP = ref(false)
const testingMCPServer = ref(false)
const testResults = ref<Array<{id: number, name: string, message: string, success: boolean}>>([])

// 환경 설정 정보
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:8080'
const mcpServerUrl = 'http://localhost:8080/api/v1/sse'
const devServerPort = '3001' // 현재 실행 중인 포트

// 내부 API 엔드포인트
const internalEndpoints = ref([
  {
    method: 'GET',
    url: '/api/menu/hierarchical',
    description: '8080 포트 백엔드 서버에서 메뉴 데이터를 가져오는 API (GET 방식)',
    params: '?userId=admin&siteName=Netis v6.6&auth=admin&menuAuthNo=1',
    status: 'active'
  },
  {
    method: 'POST',
    url: '/api/menu/hierarchical',
    description: '8080 포트 백엔드 서버에서 메뉴 데이터를 가져오는 API (POST 방식)',
    params: '{ userId: "admin", siteName: "Netis v6.6", auth: "admin", menuAuthNo: "1" }',
    status: 'active'
  },
  {
    method: 'GET',
    url: '/api/menu/mcp-hierarchical',
    description: '8080 포트 MCP 서버에서 메뉴 데이터를 가져오는 API (GET 방식)',
    params: '?userId=admin&siteName=Netis v6.6&auth=admin&menuAuthNo=1',
    status: 'active'
  },
  {
    method: 'POST',
    url: '/api/menu/mcp-hierarchical',
    description: '8080 포트 MCP 서버에서 메뉴 데이터를 가져오는 API (POST 방식)',
    params: '{ userId: "admin", siteName: "Netis v6.6", auth: "admin", menuAuthNo: "1" }',
    status: 'active'
  }
])

// MCP API 엔드포인트
const mcpEndpoints = ref([
  {
    method: 'GET',
    url: 'http://localhost:8080/api/menu/hierarchical',
    description: '8080 포트 백엔드 서버의 계층형 메뉴 목록 조회 (GET)',
    params: '?userId=admin&siteName=Netis v6.6&auth=admin&menuAuthNo=1',
    status: 'active'
  },
  {
    method: 'POST',
    url: 'http://localhost:8080/api/menu/hierarchical',
    description: '8080 포트 백엔드 서버의 계층형 메뉴 목록 조회 (POST)',
    params: '{ userId: "admin", siteName: "Netis v6.6", auth: "admin", menuAuthNo: "1" }',
    status: 'active'
  },
  {
    method: 'POST',
    url: 'http://localhost:8080/api/v1/sse',
    description: 'MCP 서버의 계층형 메뉴 목록 조회 (SSE)',
    params: '{ method: "getHierarchicalMenuList", params: { userId, siteName, auth, menuAuthNo } }',
    status: 'unknown'
  },
  {
    method: 'POST',
    url: 'http://localhost:8080/api/v1/sse',
    description: 'MCP 서버의 레이아웃 메뉴 목록 조회 (SSE)',
    params: '{ method: "getLayoutMenuList", params: { siteName } }',
    status: 'unknown'
  },
  {
    method: 'POST',
    url: 'http://localhost:8080/api/v1/sse',
    description: 'MCP 서버의 사용자 목록 조회 (SSE)',
    params: '{ method: "getUsersByPage", params: { page, size } }',
    status: 'unknown'
  }
])

// 프록시 설정
const proxyConfigs = ref([
  {
    path: '/api',
    target: 'http://localhost:8080',
    description: '모든 /api 요청을 localhost:8080으로 프록시'
  }
])

// 내부 메뉴 API 테스트
const testInternalMenuAPI = async () => {
  testingInternal.value = true
  const resultId = Date.now()
  
  try {
    const response = await $fetch('/api/menu/hierarchical', {
      method: 'GET',
      query: {
        userId: 'admin',
        siteName: 'Netis v6.6',
        auth: 'admin',
        menuAuthNo: '1'
      }
    })
    
    testResults.value.push({
      id: resultId,
      name: '내부 메뉴 API 테스트',
      message: `성공: ${response.data?.length || 0}개의 메뉴 항목 반환`,
      success: true
    })
  } catch (error) {
    testResults.value.push({
      id: resultId,
      name: '내부 메뉴 API 테스트',
      message: `실패: ${error}`,
      success: false
    })
  } finally {
    testingInternal.value = false
  }
}

// MCP 메뉴 API 테스트
const testMCPMenuAPI = async () => {
  testingMCP.value = true
  const resultId = Date.now()
  
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
    
    testResults.value.push({
      id: resultId,
      name: 'MCP 메뉴 API 테스트',
      message: `성공: ${response.data?.length || 0}개의 메뉴 항목 반환`,
      success: true
    })
  } catch (error) {
    testResults.value.push({
      id: resultId,
      name: 'MCP 메뉴 API 테스트',
      message: `실패: ${error}`,
      success: false
    })
  } finally {
    testingMCP.value = false
  }
}

// MCP 서버 연결 테스트
const testMCPServer = async () => {
  testingMCPServer.value = true
  const resultId = Date.now()
  
  try {
    const response = await $fetch('http://localhost:8080/api/v1/sse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        method: 'getCurrentDateTime',
        params: {}
      }
    })
    
    testResults.value.push({
      id: resultId,
      name: 'MCP 서버 연결 테스트',
      message: `성공: MCP 서버에 연결됨`,
      success: true
    })
  } catch (error) {
    testResults.value.push({
      id: resultId,
      name: 'MCP 서버 연결 테스트',
      message: `실패: ${error}`,
      success: false
    })
  } finally {
    testingMCPServer.value = false
  }
}

// 페이지 로드 시 MCP 서버 상태 확인
onMounted(async () => {
  await testMCPServer()
})
</script> 