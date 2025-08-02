# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## 계층형 네비게이션 시스템

이 프로젝트는 MCP (Model Context Protocol)를 통해 계층형 메뉴 구조를 가져와서 네비게이션 바에 표시하는 시스템을 구현했습니다.

### 주요 기능

- **대메뉴 (Level 1)**: 최상위 메뉴 항목들
- **중메뉴 (Level 2)**: 대메뉴 하위의 서브 메뉴들
- **소메뉴 (Level 3)**: 중메뉴 하위의 상세 메뉴들

### 사용법

#### 1. 기본 레이아웃 사용
```vue
<template>
  <div>
    <!-- 기본 레이아웃 사용 -->
    <NuxtLayout name="hierarchical">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

#### 2. 페이지에서 레이아웃 지정
```vue
<script setup>
definePageMeta({
  layout: 'hierarchical'
})
</script>
```

#### 3. 메뉴 데이터 사용
```vue
<script setup>
import { useMenu } from '~/composables/useMenu'

const { menuStructure, isLoading, error, initializeMenu } = useMenu()

onMounted(async () => {
  await initializeMenu()
})
</script>
```

### 파일 구조

```
├── components/
│   └── HierarchicalNavigation.vue    # 계층형 네비게이션 컴포넌트
├── composables/
│   └── useMenu.ts                    # 메뉴 데이터 관리 composable
├── layouts/
│   └── hierarchical.vue              # 계층형 네비게이션 레이아웃
├── server/
│   └── api/
│       └── menu/
│           ├── hierarchical.post.ts  # 메뉴 API (샘플 데이터)
│           └── mcp-hierarchical.post.ts # MCP 메뉴 API
├── types/
│   └── menu.ts                       # 메뉴 타입 정의
└── pages/
    └── hierarchical-nav.vue          # 네비게이션 테스트 페이지
```

### MCP 연동

MCP 서버를 통해 실제 메뉴 데이터를 가져오려면:

1. MCP 서버가 `http://localhost:8080`에서 실행 중이어야 합니다
2. `server/api/menu/mcp-hierarchical.post.ts`에서 실제 MCP 호출을 구현해야 합니다
3. 현재는 샘플 데이터를 사용하여 UI를 테스트할 수 있습니다

### 테스트

새로운 네비게이션을 테스트하려면:

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 `http://localhost:3001/hierarchical-nav` 접속
3. 메뉴 구조와 네비게이션 동작을 확인

### API 엔드포인트 정보

API 엔드포인트 정보를 확인하려면:
- 브라우저에서 `http://localhost:3001/api-endpoints` 접속

### API 엔드포인트

- `POST /api/menu/hierarchical`: 샘플 메뉴 데이터 반환
- `POST /api/menu/mcp-hierarchical`: MCP를 통한 메뉴 데이터 반환 (구현 예정)
