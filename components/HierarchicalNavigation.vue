<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <!-- Logo/Icon area -->
      <q-icon name="school" size="24px" class="q-mr-sm" />
      <q-toolbar-title>
        <NuxtLink to="/" class="text-white text-decoration-none">
          {{ t('home') }}
        </NuxtLink>
      </q-toolbar-title>

      <q-space />

      <!-- 계층형 메뉴 네비게이션 -->
      <div class="row items-center q-gutter-md">
        <!-- 대메뉴 -->
        <div v-for="mainMenu in menuStructure.mainMenus" :key="mainMenu.guid" class="main-menu-item">
          <q-btn
            :flat="activeMainMenu !== mainMenu.guid"
            :unelevated="activeMainMenu === mainMenu.guid"
            :color="activeMainMenu === mainMenu.guid ? 'white' : 'transparent'"
            :text-color="activeMainMenu === mainMenu.guid ? 'primary' : 'white'"
            :label="mainMenu.menuName"
            :icon="mainMenu.menuIcon"
            @click="handleMainMenuClick(mainMenu)"
            class="main-menu-btn"
          />
          
          <!-- 중메뉴 드롭다운 -->
          <q-menu
            v-if="getSubMenus(mainMenu.guid).length > 0"
            :model-value="activeMainMenu === mainMenu.guid && showSubMenu"
            @update:model-value="showSubMenu = $event"
            anchor="bottom left"
            self="top left"
            class="sub-menu-dropdown"
          >
            <q-list style="min-width: 200px">
              <q-item
                v-for="subMenu in getSubMenus(mainMenu.guid)"
                :key="subMenu.guid"
                clickable
                @click="handleSubMenuClick(subMenu)"
                class="sub-menu-item"
              >
                <q-item-section avatar>
                  <q-icon :name="subMenu.menuIcon || 'folder'" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ subMenu.menuName }}</q-item-label>
                </q-item-section>
                
                <!-- 소메뉴가 있는 경우 화살표 표시 -->
                <q-item-section side v-if="getDetailMenus(subMenu.guid).length > 0">
                  <q-icon name="chevron_right" />
                </q-item-section>
                
                <!-- 소메뉴 서브메뉴 -->
                <q-menu
                  v-if="getDetailMenus(subMenu.guid).length > 0"
                  anchor="top right"
                  self="top left"
                  class="detail-menu-dropdown"
                >
                  <q-list style="min-width: 180px">
                    <q-item
                      v-for="detailMenu in getDetailMenus(subMenu.guid)"
                      :key="detailMenu.guid"
                      clickable
                      @click="handleDetailMenuClick(detailMenu)"
                      class="detail-menu-item"
                    >
                      <q-item-section avatar>
                        <q-icon :name="detailMenu.menuIcon || 'article'" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ detailMenu.menuName }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </div>

      <q-space />

      <!-- 메뉴 새로고침 버튼 -->
      <q-btn
        flat
        round
        icon="refresh"
        @click="refreshMenu"
        :loading="isLoading"
        class="q-mr-sm"
      >
        <q-tooltip>메뉴 새로고침</q-tooltip>
      </q-btn>

      <!-- Language Switcher -->
      <q-btn-dropdown flat :label="currentLanguageName">
        <q-list>
          <q-item v-for="lang in languages" :key="lang.code" clickable @click="setLanguage(lang.code)">
            <q-item-section>{{ lang.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <!-- Logout button -->
      <q-btn
        flat
        :label="t('logout')"
        @click="handleLogout"
      />
    </q-toolbar>

    <!-- 로딩 인디케이터 -->
    <q-linear-progress
      v-if="isLoading"
      indeterminate
      color="white"
      class="q-mt-sm"
    />

    <!-- 에러 메시지 -->
    <q-banner
      v-if="error"
      class="bg-negative text-white q-mt-sm"
      rounded
    >
      {{ error }}
      <template v-slot:action>
        <q-btn flat color="white" label="닫기" @click="error = null" />
      </template>
    </q-banner>

    <!-- 메뉴 정보 표시 (개발용) -->
    <q-banner
      v-if="showMenuInfo"
      class="bg-info text-white q-mt-sm"
      rounded
    >
      <div class="text-caption">
        <strong>메뉴 정보:</strong> 대메뉴 {{ menuStructure.mainMenus.length }}개, 
        중메뉴 {{ Object.keys(menuStructure.subMenus).length }}개, 
        소메뉴 {{ Object.keys(menuStructure.detailMenus).length }}개
      </div>
      <template v-slot:action>
        <q-btn flat color="white" label="닫기" @click="showMenuInfo = false" />
      </template>
    </q-banner>
  </q-header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useMenu } from '~/composables/useMenu'
import type { MenuItem } from '~/types/menu'

const authStore = useAuthStore()
const { t, locale } = useI18n()
const { menuStructure, isLoading, error, initializeMenu } = useMenu()

const activeMainMenu = ref<string>('')
const showSubMenu = ref(false)
const showMenuInfo = ref(false)

// 언어 설정
const languages = [
  { name: 'English', code: 'en' },
  { name: 'Korean', code: 'ko' },
]
const currentLanguageName = computed(() => languages.find(l => l.code === locale.value)?.name || 'Language')
const setLanguage = (code: string) => { locale.value = code }

// 중메뉴 가져오기
const getSubMenus = (parentGuid: string) => {
  return menuStructure.value.subMenus[parentGuid] || []
}

// 소메뉴 가져오기
const getDetailMenus = (parentGuid: string) => {
  return menuStructure.value.detailMenus[parentGuid] || []
}

// 대메뉴 클릭 핸들러
const handleMainMenuClick = (menu: any) => {
  activeMainMenu.value = menu.guid
  showSubMenu.value = true
  
  // 대메뉴에 직접 URL이 있는 경우
  if (menu.menuUrl) {
    navigateTo(menu.menuUrl)
  }
  
  console.log('대메뉴 클릭:', menu.menuName, 'GUID:', menu.guid)
}

// 중메뉴 클릭 핸들러
const handleSubMenuClick = (menu: any) => {
  console.log('중메뉴 클릭:', menu.menuName, 'GUID:', menu.guid)
  
  if (menu.menuUrl) {
    navigateTo(menu.menuUrl)
  }
}

// 소메뉴 클릭 핸들러
const handleDetailMenuClick = (menu: any) => {
  console.log('소메뉴 클릭:', menu.menuName, 'GUID:', menu.guid)
  
  if (menu.menuUrl) {
    navigateTo(menu.menuUrl)
  }
}

// 메뉴 새로고침
const refreshMenu = async () => {
  console.log('메뉴 새로고침 시작')
  await initializeMenu()
  console.log('메뉴 새로고침 완료')
}

// 로그아웃 핸들러
const handleLogout = () => {
  if (confirm(t('logoutConfirm'))) {
    authStore.logout()
    navigateTo('/login')
  }
}

// 컴포넌트 마운트 시 메뉴 초기화
onMounted(async () => {
  console.log('네비게이션 컴포넌트 마운트')
  authStore.initializeAuth()
  await initializeMenu()
  
  // 첫 번째 대메뉴를 기본으로 선택
  if (menuStructure.value.mainMenus.length > 0) {
    const firstMainMenu = menuStructure.value.mainMenus[0]
    activeMainMenu.value = firstMainMenu.guid
    console.log('기본 대메뉴 설정:', firstMainMenu.menuName)
  }
  
  // 개발 모드에서 메뉴 정보 표시
  if (process.env.NODE_ENV === 'development') {
    showMenuInfo.value = true
  }
})

// 메뉴 구조 변경 감지
watch(menuStructure, (newStructure) => {
  console.log('메뉴 구조 변경 감지:', {
    mainMenus: newStructure.mainMenus.length,
    subMenus: Object.keys(newStructure.subMenus).length,
    detailMenus: Object.keys(newStructure.detailMenus).length
  })
}, { deep: true })
</script>

<style scoped>
.main-menu-item {
  position: relative;
}

.main-menu-btn {
  font-weight: 500;
  transition: all 0.3s ease;
}

.main-menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sub-menu-dropdown {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.detail-menu-dropdown {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.sub-menu-item {
  min-height: 48px;
  transition: background-color 0.2s ease;
}

.sub-menu-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.detail-menu-item {
  min-height: 40px;
  transition: background-color 0.2s ease;
}

.detail-menu-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.q-item-label {
  font-size: 14px;
  font-weight: 500;
}

.q-item-label.caption {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}
</style> 