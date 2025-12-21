# 프레젠테이션 사용 가이드

## 생성된 파일

### 1. taskmaster_presentation.html (권장)
✅ **브라우저에서 바로 실행 가능**
- 더블클릭으로 즉시 프레젠테이션 시작
- 23개 슬라이드 포함
- 전문적인 디자인 및 애니메이션
- 코드 하이라이팅 지원

### 2. taskmaster_workflow_presentation.md
- Markdown 형식 원본
- PowerPoint 변환용
- 텍스트 편집 용이

---

## 빠른 시작 (HTML 프레젠테이션)

### 1. 프레젠테이션 시작
```bash
# 파일 탐색기에서 더블클릭
taskmaster_presentation.html

# 또는 브라우저에서 직접 열기
chrome taskmaster_presentation.html
```

### 2. 키보드 단축키
| 키 | 동작 |
|---|---|
| `→` 또는 `Space` | 다음 슬라이드 |
| `←` | 이전 슬라이드 |
| `Esc` | 슬라이드 개요 보기 |
| `F` | 전체 화면 |
| `S` | 발표자 노트 (듀얼 스크린) |
| `?` | 도움말 |

### 3. 발표자 모드
1. `S` 키를 눌러 발표자 노트 창 열기
2. 한 화면은 청중에게, 다른 화면은 본인이 사용
3. 다음 슬라이드 미리보기 제공

---

## HTML을 PowerPoint로 변환

### 방법 1: 브라우저 인쇄 기능 (가장 쉬움)

1. **HTML 파일을 브라우저에서 열기**
2. **각 슬라이드 스크린샷**
   - Windows: `Win + Shift + S`
   - 또는 `Ctrl + P` → PDF로 저장

3. **PowerPoint에서 이미지 삽입**
   - 새 프레젠테이션 생성
   - 각 슬라이드에 스크린샷 삽입

### 방법 2: PDF로 변환 후 PowerPoint로

1. **브라우저에서 PDF로 인쇄**
   ```
   Ctrl + P → 대상: PDF로 저장
   ```

2. **PDF를 PowerPoint로 변환**
   - Adobe Acrobat 사용
   - 온라인: https://www.adobe.com/acrobat/online/pdf-to-ppt.html
   - 또는 PowerPoint: 삽입 → 개체 → PDF

### 방법 3: Pandoc 수동 설치 후 변환

1. **Pandoc 다운로드**
   - https://pandoc.org/installing.html
   - Windows Installer (.msi) 다운로드 및 설치

2. **변환 실행**
   ```bash
   pandoc taskmaster_workflow_presentation.md \
     -o taskmaster_presentation.pptx
   ```

---

## 프레젠테이션 커스터마이징

### HTML 테마 변경
`taskmaster_presentation.html` 파일에서 테마 라인 수정:

```html
<!-- 현재 테마 -->
<link rel="stylesheet" href="...dist/theme/black.css">

<!-- 다른 테마 옵션 -->
white.css    - 밝은 배경
league.css   - 회색 배경
sky.css      - 파란색 그라디언트
beige.css    - 베이지색 배경
simple.css   - 심플한 디자인
serif.css    - 세리프 폰트
night.css    - 어두운 배경
moon.css     - 파란색 테마
solarized.css - Solarized 테마
```

### 슬라이드 추가/수정
HTML 파일에서 `<section>` 태그로 슬라이드 추가:

```html
<section>
    <h2>새 슬라이드 제목</h2>
    <p>내용</p>
    <ul>
        <li>항목 1</li>
        <li>항목 2</li>
    </ul>
</section>
```

---

## 프레젠테이션 구조

### 23개 슬라이드 목록

1. **제목 슬라이드** - Claude Code Taskmaster 워크플로우
2. **목차** - 7개 주요 섹션
3. **Taskmaster 소개** - 개요
4. **주요 기능** - 5가지 핵심 기능
5. **설치** - npm 명령어
6. **디렉토리 구조** - .taskmaster/ 폴더
7. **PRD 작성** - 예제
8. **Task 생성** - 10개 Task 목록
9. **Task 실행** - Claude Code 명령어
10. **Task 예제 1** - 데이터베이스 스키마
11. **Task 예제 2** - Pinia Store
12. **Sub-Agent 소개** - 문제점 및 해결
13. **Sub-Agent 실행** - Before/After 비교
14. **완성된 기능** - API 및 컴포넌트 목록
15. **Git 커밋** - 커밋 메시지 예제
16. **워크플로우 다이어그램** - 전체 과정 요약
17. **장점** - 4가지 핵심 장점
18. **프로젝트 성과** - 통계 테이블
19. **보안 기능** - 구현된 보안 기능
20. **실전 팁** - Claude Code 명령어 모음
21. **Best Practices** - PRD 작성 및 Task 관리
22. **Q&A** - 질문 시간
23. **마무리** - 감사 인사

---

## 발표 시간 배분 (30분 기준)

| 슬라이드 | 시간 | 내용 |
|---------|------|------|
| 1-2 | 2분 | 소개 및 목차 |
| 3-6 | 5분 | Taskmaster 개념 및 설치 |
| 7-9 | 5분 | Task 등록 및 실행 |
| 10-13 | 8분 | Task 예제 및 Sub-Agent |
| 14-16 | 6분 | 실습 결과 및 워크플로우 |
| 17-21 | 4분 | 장점 및 Best Practices |
| 22-23 | 2분 | Q&A 및 마무리 |

---

## 발표 팁

### 효과적인 프레젠테이션

1. **코드 슬라이드 처리**
   - 코드를 전부 읽지 말고 핵심만 설명
   - "이 부분은 PostgreSQL 테이블 생성 SQL입니다" 정도로 요약

2. **실제 데모 준비**
   - Chrome DevTools 화면 준비
   - 실제 동작하는 프로필 페이지 보여주기
   - taskmaster 디렉토리 구조 실제로 보여주기

3. **청중 참여**
   - "Taskmaster를 사용해본 분 계신가요?"
   - "비슷한 프로젝트 관리 도구를 사용해보신 분?"

4. **질문 예상 답변**
   - Q: "다른 PM 도구와 차이점?"
     A: "AI 기반 자동 Task 생성과 Sub-agent 연동이 핵심"
   - Q: "학습 곡선은?"
     A: "PRD만 작성하면 나머지는 자동, 30분이면 시작 가능"

---

## 고급 기능

### 1. 슬라이드 내 애니메이션

```html
<section>
    <h2>제목</h2>
    <p class="fragment">첫 번째 나타날 내용</p>
    <p class="fragment">두 번째 나타날 내용</p>
    <p class="fragment">세 번째 나타날 내용</p>
</section>
```

### 2. 세로 슬라이드 (상세 설명용)

```html
<section>
    <h2>메인 슬라이드</h2>
</section>
<section>
    <h3>상세 설명 1</h3>
</section>
<section>
    <h3>상세 설명 2</h3>
</section>
```

### 3. 배경 이미지/색상 변경

```html
<section data-background-color="#4d7e65">
    <!-- 초록색 배경 -->
</section>

<section data-background-image="image.jpg">
    <!-- 이미지 배경 -->
</section>
```

---

## 문제 해결

### 슬라이드가 제대로 표시되지 않을 때
- **원인**: 인터넷 연결 필요 (CDN 사용)
- **해결**:
  1. 인터넷 연결 확인
  2. 또는 Reveal.js 로컬 다운로드
  3. 파일을 다시 열어보기

### 코드 하이라이팅이 안 될 때
- **원인**: JavaScript가 제대로 로드되지 않음
- **해결**: 페이지 새로고침 (F5)

### 한글이 깨질 때
- **원인**: 인코딩 문제
- **해결**: 파일을 UTF-8로 저장 (보통 자동)

---

## 오프라인 사용

### Reveal.js 로컬 다운로드

1. **Reveal.js 다운로드**
   ```bash
   npm install reveal.js
   ```

2. **HTML 파일 수정**
   ```html
   <!-- CDN 링크를 로컬 경로로 변경 -->
   <link rel="stylesheet" href="node_modules/reveal.js/dist/reveal.css">
   ```

---

## 추가 리소스

### 공식 문서
- [Reveal.js 문서](https://revealjs.com/)
- [Pandoc 가이드](https://pandoc.org/MANUAL.html)

### 유사 도구
- Google Slides
- Marp (Markdown Presentation)
- Slidev (Developer-friendly)

---

## 체크리스트

발표 전 확인사항:
- [ ] HTML 파일이 브라우저에서 정상 작동
- [ ] 모든 슬라이드 내용 확인
- [ ] 발표자 노트 모드 테스트 (S 키)
- [ ] 듀얼 모니터 설정 확인
- [ ] 데모 화면 준비
- [ ] 예상 질문 답변 준비
- [ ] 백업 PDF 버전 생성

---

## 문의 및 피드백

이 프레젠테이션에 대한 질문이나 개선 사항이 있으시면:
- GitHub Issue 등록
- 또는 직접 HTML 파일 수정

**Happy Presenting! 🎉**
