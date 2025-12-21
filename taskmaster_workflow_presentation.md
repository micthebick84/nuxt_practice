# Claude Code Taskmaster 워크플로우
## Task Master를 활용한 프로젝트 관리

---

## 목차

1. Taskmaster 소개
2. 설치 및 초기화
3. Task 등록
4. Task 실행
5. Sub-Agent를 통한 상태 업데이트
6. Git 커밋 및 관리
7. 실습 예제: 사용자 프로필 관리 시스템

---

## 1. Taskmaster란?

### 개요
- **Claude Code의 프로젝트 관리 도구**
- PRD(Product Requirements Document) 기반 작업 관리
- Task 분해 및 추적 기능
- Sub-agent를 통한 자동화된 진행 상황 관리

### 주요 기능
- ✅ Task 자동 생성 및 의존성 관리
- ✅ 우선순위 및 상태 추적
- ✅ 테스트 전략 문서화
- ✅ Sub-agent 연동 지원

---

## 2. 설치 및 초기화

### 2.1 Taskmaster 설치

```bash
npm install -g @anthropic-ai/taskmaster
```

### 2.2 프로젝트 초기화

```bash
npx taskmaster init
```

**생성되는 디렉토리 구조:**
```
.taskmaster/
├── config.json          # 설정 파일
├── state.json           # 현재 상태
├── tasks/
│   └── tasks.json       # Task 목록
├── docs/                # PRD 문서
└── templates/           # PRD 템플릿
```

---

## 3. Task 등록

### 3.1 PRD 문서 작성

**파일:** `.taskmaster/docs/prd_user_profile.txt`

```markdown
# 사용자 프로필 관리 시스템

## 목표
사용자가 자신의 프로필을 조회, 수정, 관리할 수 있는 기능 구현

## 주요 기능
1. 프로필 조회 및 편집
2. 비밀번호 변경
3. 아바타 업로드
4. 계정 설정 및 삭제
5. 다국어 지원 (영어/한국어)

## 기술 스택
- Frontend: Nuxt 3, Quasar UI, Pinia
- Backend: Nuxt API Routes
- Database: PostgreSQL
- i18n: vue-i18n
```

---

## 3.2 Task 생성 명령어

```bash
npx taskmaster create-tasks prd_user_profile.txt
```

**생성된 10개의 Tasks:**
1. 데이터베이스 스키마 및 타입 정의
2. Pinia 사용자 프로필 스토어 구현
3. 프로필 API 엔드포인트 구현
4. 프로필 조회 페이지 구현
5. i18n 프로필 번역 키 추가
6. 프로필 수정 페이지 및 폼 컴포넌트 구현
7. 비밀번호 변경 기능 구현
8. 아바타 업로드 기능 구현
9. 계정 설정 및 삭제 기능 구현
10. 네비게이션 및 통합 테스트

---

## 4. Task 실행

### 4.1 Task 목록 확인

```bash
npx taskmaster list
```

**출력 예시:**
```
ID  Title                              Status    Priority
1   데이터베이스 스키마 및 타입 정의      pending   high
2   Pinia 사용자 프로필 스토어 구현      pending   high
3   프로필 API 엔드포인트 구현          pending   high
...
```

### 4.2 Claude Code에서 Task 실행

**명령어:**
```
등록된 task를 보여줘
순서대로 진행해
```

---

## 4.3 Task 실행 과정

### Task 1: 데이터베이스 스키마
```sql
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL
    REFERENCES com_user(user_id) ON DELETE CASCADE,
  bio TEXT,
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  preferred_language VARCHAR(10) DEFAULT 'en',
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Task 2: Pinia Store
```typescript
export const useUserStore = defineStore('user', {
  state: () => ({
    userProfile: null as UserProfile | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchProfile(userId: string) { ... },
    async updateProfile(userId: string, data: ProfileUpdateRequest) { ... }
  }
})
```

---

## 5. Sub-Agent를 통한 상태 업데이트

### 5.1 작업 완료 확인

**명령어:**
```
taskmaster의 작업 진행 상황을 보여줘
```

**문제점 발견:**
- 모든 작업이 완료되었지만 `tasks.json`에는 여전히 `"status": "pending"`으로 표시됨

---

### 5.2 Sub-Agent 생성 및 실행

**명령어:**
```
현재 task-master가 작업하고 있는 작업 상황을
업데이트 해주는 sub-agent를 만들어줘
```

**Sub-Agent 작업 내용:**
```javascript
// Task 파일 읽기
Read: .taskmaster/tasks/tasks.json

// 각 Task의 status를 "pending" → "completed"로 변경
Edit: "status": "pending" → "status": "completed"

// Metadata 업데이트
Edit: "updated": "2025-12-21T00:00:00.000Z"
```

---

### 5.3 Sub-Agent 실행 결과

**Before:**
```json
{
  "id": 1,
  "title": "데이터베이스 스키마 및 타입 정의",
  "status": "pending"
}
```

**After:**
```json
{
  "id": 1,
  "title": "데이터베이스 스키마 및 타입 정의",
  "status": "completed"
}
```

**업데이트 완료:**
- ✅ 10개 Task 모두 "completed" 상태로 변경
- ✅ Metadata 타임스탬프 업데이트
- ✅ 변경사항 검증 완료

---

## 6. Git 커밋 및 관리

### 6.1 변경사항 확인

```bash
git status
```

**출력:**
```
Untracked files:
  .taskmaster/
  components/profile/
  pages/profile/
  server/api/users/
  ...
```

---

### 6.2 Taskmaster 변경사항 커밋

**명령어:**
```
taskmaster 변경사항 커밋해줘
```

**실행 내용:**
```bash
git add .taskmaster/
git commit -m "taskmaster 작업 상태 업데이트 - 사용자 프로필 관리 기능 완료"
```

**커밋 메시지:**
```
taskmaster 작업 상태 업데이트 - 사용자 프로필 관리 기능 완료

10개의 사용자 프로필 관리 작업이 모두 완료됨:
- 데이터베이스 스키마 및 타입 정의
- Pinia 사용자 프로필 스토어 구현
- 프로필 API 엔드포인트 구현
...

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## 7. 실습 예제: 사용자 프로필 관리 시스템

### 7.1 완성된 기능 목록

#### 데이터베이스 (PostgreSQL)
- ✅ `user_profiles` 테이블 생성
- ✅ Foreign Key 관계 설정 (ON DELETE CASCADE)
- ✅ 인덱스 최적화

#### Backend API
- ✅ GET `/api/users/:userId/profile` - 프로필 조회
- ✅ PUT `/api/users/:userId/profile` - 프로필 수정
- ✅ PUT `/api/users/:userId/password` - 비밀번호 변경
- ✅ POST `/api/users/:userId/avatar` - 아바타 업로드
- ✅ DELETE `/api/users/:userId` - 계정 삭제

---

### 7.2 Frontend 컴포넌트

#### Pages
- ✅ `/pages/profile/index.vue` - 프로필 메인 페이지 (탭: General, Security, Settings)
- ✅ `/pages/profile/edit.vue` - 프로필 편집 페이지

#### Components
- ✅ `ProfileCard.vue` - 프로필 정보 표시
- ✅ `ProfileForm.vue` - 프로필 편집 폼
- ✅ `AvatarUpload.vue` - 아바타 업로드
- ✅ `PasswordChangeForm.vue` - 비밀번호 변경
- ✅ `PasswordStrengthIndicator.vue` - 비밀번호 강도 표시
- ✅ `SettingsPanel.vue` - 언어/알림/계정삭제 설정

---

### 7.3 상태 관리 (Pinia)

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({
    userProfile: null,
    loading: false,
    error: null
  }),

  getters: {
    fullName: (state) => state.userProfile?.userName,
    hasAvatar: (state) => !!state.userProfile?.avatarUrl,
    profileCompleteness: (state) => { /* 프로필 완성도 계산 */ }
  },

  actions: {
    fetchProfile, updateProfile, changePassword,
    uploadAvatar, deleteAccount
  }
})
```

---

### 7.4 국제화 (i18n)

**지원 언어:** 영어, 한국어

```typescript
// plugins/i18n.ts
messages: {
  en: {
    profile: {
      title: 'My Profile',
      edit: 'Edit Profile',
      save: 'Save Changes',
      // ... 50+ keys
    }
  },
  ko: {
    profile: {
      title: '내 프로필',
      edit: '프로필 수정',
      save: '변경사항 저장',
      // ... 50+ keys
    }
  }
}
```

---

### 7.5 보안 기능

#### 비밀번호 관리
- ✅ bcryptjs 해싱
- ✅ Salt 생성 및 저장
- ✅ 현재 비밀번호 확인
- ✅ 복잡성 검증 (대/소문자, 숫자, 8자 이상)

#### 파일 업로드 보안
- ✅ 파일 타입 검증 (JPG, PNG, WebP만 허용)
- ✅ 파일 크기 제한 (5MB)
- ✅ 안전한 파일명 생성

#### 계정 삭제
- ✅ 비밀번호 재확인 필수
- ✅ CASCADE 삭제로 관련 데이터 자동 제거

---

## 8. Taskmaster 워크플로우 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PRD 작성                                                  │
│    └─ .taskmaster/docs/prd_user_profile.txt                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Task 생성                                                 │
│    └─ npx taskmaster create-tasks prd_user_profile.txt      │
│    └─ 10개 Task 자동 생성 (의존성, 우선순위 포함)              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Claude Code에서 Task 실행                                 │
│    └─ "순서대로 진행해"                                       │
│    └─ Task 1 → Task 2 → ... → Task 10                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. 실제 구현 작업                                            │
│    ├─ 데이터베이스 스키마 생성                                │
│    ├─ API 엔드포인트 구현                                     │
│    ├─ Vue 컴포넌트 개발                                       │
│    ├─ Pinia 스토어 구현                                       │
│    └─ i18n 번역 추가                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. 브라우저 테스트                                            │
│    └─ Chrome DevTools MCP로 실제 동작 검증                   │
│    └─ 버그 발견 및 수정 (Component imports, Quasar plugins)  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Sub-Agent로 상태 업데이트                                  │
│    └─ "task-master 작업 상황 업데이트하는 sub-agent 만들어줘"  │
│    └─ 모든 Task status: pending → completed                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Git 커밋                                                  │
│    └─ "taskmaster 변경사항 커밋해줘"                          │
│    └─ 6개 파일 커밋 (1,289 insertions)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Taskmaster의 장점

### 자동화 및 효율성
- ✅ **자동 Task 생성**: PRD에서 자동으로 세분화된 작업 생성
- ✅ **의존성 관리**: Task 간 의존 관계 자동 추적
- ✅ **우선순위 자동 설정**: high/medium/low 자동 분류

### 체계적인 문서화
- ✅ **테스트 전략 포함**: 각 Task에 검증 방법 문서화
- ✅ **상세 구현 가이드**: 코드 예제 포함
- ✅ **진행 상황 추적**: 실시간 상태 업데이트

### Sub-Agent 연동
- ✅ **자동 상태 업데이트**: 완료된 작업 자동 반영
- ✅ **병렬 처리**: 여러 Task 동시 실행 가능
- ✅ **결과 검증**: 완료 조건 자동 확인

---

## 10. 모범 사례 (Best Practices)

### PRD 작성
1. **명확한 목표 정의**: 무엇을 왜 만드는지 명시
2. **구체적인 요구사항**: 모호한 표현 지양
3. **기술 스택 명시**: 사용할 기술 및 라이브러리 지정
4. **우선순위 표시**: Must-have vs Nice-to-have 구분

### Task 관리
1. **작은 단위로 분해**: 1-2일 내 완료 가능한 크기
2. **의존성 명확히**: 선행 작업 명시
3. **테스트 전략 포함**: 완료 기준 정의
4. **정기적 상태 업데이트**: Sub-agent 활용

---

## 11. 실전 팁

### Claude Code와의 연동
```bash
# Task 목록 확인
"등록된 task를 보여줘"

# Task 실행
"순서대로 진행해"
"Task 3부터 진행해"
"고우선순위 task만 진행해"

# 상태 확인
"taskmaster 작업 진행 상황을 보여줘"

# Sub-agent 활용
"작업 상황을 업데이트하는 sub-agent를 만들어줘"
```

### Git 통합
```bash
# Taskmaster 변경사항만 커밋
git add .taskmaster/
git commit -m "taskmaster: [설명]"

# 전체 기능 구현 후 커밋
git add .
git commit -m "feat: 사용자 프로필 관리 시스템 구현"
```

---

## 12. 트러블슈팅

### 자주 발생하는 문제

#### 1. Task가 생성되지 않음
**원인:** PRD 형식 불일치
**해결:** PRD 템플릿 참고하여 재작성

#### 2. Sub-agent가 status 업데이트 안됨
**원인:** tasks.json 경로 불일치
**해결:** 절대 경로 사용

#### 3. Task 의존성 순환 참조
**원인:** Task 간 상호 의존
**해결:** 의존성 그래프 재설계

---

## 13. 실습 예제 코드

### Task 1: Database Schema
```sql
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  bio TEXT,
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  preferred_language VARCHAR(10) DEFAULT 'en',
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES com_user(user_id)
    ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_user_id
  ON user_profiles(user_id);
```

---

### Task 2: TypeScript Types
```typescript
// types/profile.d.ts
export interface UserProfile {
  id: number;
  userId: string;
  userName?: string;
  email?: string;
  bio?: string;
  phone?: string;
  avatarUrl?: string;
  preferredLanguage: 'en' | 'ko';
  emailNotifications: boolean;
  joinDate?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  bio?: string;
  phone?: string;
  preferredLanguage?: 'en' | 'ko';
  emailNotifications?: boolean;
}
```

---

### Task 3: API Endpoint
```typescript
// server/api/users/[userId]/profile.get.ts
export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  const result = await pool.query(`
    SELECT u.user_id, u.user_name, u.email,
           u.created_at as join_date,
           p.bio, p.phone, p.avatar_url,
           p.preferred_language, p.email_notifications
    FROM com_user u
    LEFT JOIN user_profiles p ON u.user_id = p.user_id
    WHERE u.user_id = $1
  `, [userId]);

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    });
  }

  return { success: true, data: result.rows[0] };
});
```

---

### Task 4: Vue Component
```vue
<!-- pages/profile/index.vue -->
<template>
  <q-page padding>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar size="100px">
          <img v-if="userStore.hasAvatar"
               :src="userStore.userProfile?.avatarUrl" />
          <q-icon v-else name="person" size="60px" />
        </q-avatar>

        <div class="col">
          <div class="text-h5">{{ userStore.fullName }}</div>
          <div class="text-grey">
            {{ userStore.userProfile?.email }}
          </div>
        </div>
      </q-card-section>

      <q-tabs v-model="tab">
        <q-tab name="general" :label="t('profile.general')" />
        <q-tab name="security" :label="t('profile.security')" />
        <q-tab name="settings" :label="t('profile.settings.title')" />
      </q-tabs>
    </q-card>
  </q-page>
</template>
```

---

## 14. 성과 및 결과

### 프로젝트 통계
- **총 작업 기간**: 1일
- **생성된 Task 수**: 10개
- **작성된 코드**: 1,289+ 줄
- **생성된 파일**: 20+ 개
- **API 엔드포인트**: 5개
- **Vue 컴포넌트**: 6개
- **i18n 번역 키**: 50+ 개

### 기술적 성과
- ✅ 완전한 CRUD 작업
- ✅ 보안 기능 (bcrypt 해싱, 파일 검증)
- ✅ 국제화 지원 (영어/한국어)
- ✅ 반응형 UI (Quasar)
- ✅ 상태 관리 (Pinia)
- ✅ 타입 안전성 (TypeScript)

---

## 15. 다음 단계

### 확장 가능성
1. **소셜 로그인 통합**
   - OAuth 2.0 (Google, GitHub)
   - JWT 토큰 관리

2. **프로필 고급 기능**
   - 2단계 인증 (2FA)
   - 활동 로그 조회
   - 프라이버시 설정

3. **성능 최적화**
   - 이미지 압축 및 CDN 연동
   - 캐싱 전략 (Redis)
   - API 응답 최적화

---

## 16. 참고 자료

### 공식 문서
- [Claude Code Documentation](https://claude.com/claude-code)
- [Taskmaster GitHub](https://github.com/anthropics/taskmaster)
- [Nuxt 3 Documentation](https://nuxt.com)
- [Quasar Framework](https://quasar.dev)

### 관련 기술
- PostgreSQL 공식 문서
- Pinia 상태 관리
- vue-i18n 국제화
- bcryptjs 암호화

---

## 17. Q&A

### 자주 묻는 질문

**Q: Taskmaster는 무료인가요?**
A: 네, Taskmaster는 Claude Code의 일부로 제공됩니다.

**Q: 다른 프로젝트 관리 도구와 차이점은?**
A: AI 기반 자동 Task 생성과 Sub-agent 연동이 핵심 차별점입니다.

**Q: 기존 프로젝트에도 적용 가능한가요?**
A: 네, `npx taskmaster init`으로 언제든 시작할 수 있습니다.

**Q: Git과의 충돌은 없나요?**
A: `.taskmaster/` 디렉토리만 관리하므로 충돌 없습니다.

---

## 감사합니다!

### 연락처
- **GitHub**: [Your Repository]
- **Email**: [Your Email]
- **Claude Code Community**: [Community Link]

### 라이선스
MIT License

---

**생성 정보:**
- 작성자: Claude Sonnet 4.5
- 생성일: 2025-12-21
- 버전: 1.0
- 프로젝트: nuxt_practice
