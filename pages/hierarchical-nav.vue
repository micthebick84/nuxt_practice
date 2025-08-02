<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-lg">계층형 네비게이션 테스트</div>
    
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">현재 메뉴 구조</div>
        <div class="q-mt-sm">
          <q-chip v-if="isLoading" color="primary" label="메뉴 로딩 중..." />
          <q-chip v-else-if="error" color="negative" :label="error" />
          <q-chip v-else color="positive" label="메뉴 로드 완료" />
        </div>
      </q-card-section>
    </q-card>

    <q-card v-if="menuStructure.mainMenus.length > 0">
      <q-card-section>
        <div class="text-h6">대메뉴 (Level 1)</div>
        <div class="q-mt-sm">
          <q-btn
            v-for="mainMenu in menuStructure.mainMenus"
            :key="mainMenu.guid"
            :label="mainMenu.menuName"
            :icon="mainMenu.menuIcon"
            @click="handleMainMenuClick(mainMenu)"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card v-if="Object.keys(menuStructure.subMenus).length > 0" class="q-mt-md">
      <q-card-section>
        <div class="text-h6">중메뉴 (Level 2)</div>
        <div class="q-mt-sm">
          <div v-for="(subMenus, parentGuid) in menuStructure.subMenus" :key="parentGuid" class="q-mb-md">
            <div class="text-subtitle2 q-mb-sm">
              부모: {{ getMainMenuName(String(parentGuid)) }}
            </div>
            <q-menu>
              <q-list>
                <q-item
                  v-for="subMenu in subMenus"
                  :key="subMenu.guid"
                  @click="handleSubMenuClick(subMenu)"
                >
                  <q-item-section avatar>
                    <q-icon :name="subMenu.menuIcon || 'folder'" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ subMenu.menuName }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card v-if="Object.keys(menuStructure.detailMenus).length > 0" class="q-mt-md">
      <q-card-section>
        <div class="text-h6">소메뉴 (Level 3)</div>
        <div class="q-mt-sm">
          <div v-for="(detailMenus, parentGuid) in menuStructure.detailMenus" :key="parentGuid" class="q-mb-md">
            <div class="text-subtitle2 q-mb-sm">
              부모: {{ getSubMenuName(String(parentGuid)) }}
            </div>
            <q-menu>
              <q-list>
                <q-item
                  v-for="detailMenu in detailMenus"
                  :key="detailMenu.guid"
                  @click="handleDetailMenuClick(detailMenu)"
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
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">메뉴 새로고침</div>
        <div class="row q-gutter-md">
          <q-btn
            color="primary"
            label="메뉴 다시 로드"
            @click="refreshMenu"
            :loading="isLoading"
          />
          <q-btn
            color="secondary"
            label="MCP 메뉴 로드"
            @click="loadMCPMenu"
            :loading="isLoading"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useMenu } from '~/composables/useMenu'
import type { MenuItem } from '~/types/menu'

// 페이지 레이아웃 설정
definePageMeta({
  layout: 'hierarchical' as any
})

const { menuStructure, isLoading, error, initializeMenu } = useMenu()

// 메뉴 새로고침
const refreshMenu = async () => {
  await initializeMenu()
}

// 실제 MCP 파라미터로 메뉴 로드
const loadMCPMenu = async () => {
  const { fetchHierarchicalMenu } = useMenu()
  await fetchHierarchicalMenu('admin', 'Netis v6.6', 'admin', '1')
}

// 대메뉴 이름 가져오기
const getMainMenuName = (guid: string) => {
  const menu = menuStructure.value.mainMenus.find((m: MenuItem) => m.guid === guid)
  return menu ? menu.menuName : 'Unknown'
}

// 중메뉴 이름 가져오기
const getSubMenuName = (guid: string) => {
  for (const subMenus of Object.values(menuStructure.value.subMenus)) {
    const menu = subMenus.find((m: MenuItem) => m.guid === guid)
    if (menu) return menu.menuName
  }
  return 'Unknown'
}

// 대메뉴 클릭 시 처리
const handleMainMenuClick = (menu: MenuItem) => {
  console.log('Main Menu Clicked:', menu)
  // 실제 네비게이션 로직 구현
  // 예: router.push(`/${menu.menuName.toLowerCase().replace(/\s/g, '-')}`)
}

// 중메뉴 클릭 시 처리
const handleSubMenuClick = (menu: MenuItem) => {
  console.log('Sub Menu Clicked:', menu)
  // 실제 네비게이션 로직 구현
  // 예: router.push(`/${menu.menuName.toLowerCase().replace(/\s/g, '-')}`)
}

// 소메뉴 클릭 시 처리
const handleDetailMenuClick = (menu: MenuItem) => {
  console.log('Detail Menu Clicked:', menu)
  // 실제 네비게이션 로직 구현
  // 예: router.push(`/${menu.menuName.toLowerCase().replace(/\s/g, '-')}`)
}

// 페이지 로드 시 메뉴 초기화
onMounted(async () => {
  await initializeMenu()
})
</script> 