# Markdown을 PowerPoint로 변환하는 방법

## 방법 1: Pandoc 사용 (권장)

### 1. Pandoc 설치
```bash
# Windows (Chocolatey 사용)
choco install pandoc

# 또는 공식 사이트에서 다운로드
# https://pandoc.org/installing.html
```

### 2. PowerPoint로 변환
```bash
pandoc taskmaster_workflow_presentation.md -o taskmaster_workflow_presentation.pptx
```

### 3. 고급 변환 (템플릿 사용)
```bash
# 기본 참조 템플릿 생성
pandoc --print-default-data-file reference.pptx > custom-reference.pptx

# 템플릿을 사용하여 변환
pandoc taskmaster_workflow_presentation.md \
  --reference-doc=custom-reference.pptx \
  -o taskmaster_workflow_presentation.pptx
```

---

## 방법 2: 온라인 도구 사용

### Markdown to PowerPoint 변환 사이트
1. **CloudConvert**: https://cloudconvert.com/md-to-pptx
   - 파일 업로드 → 변환 → 다운로드

2. **AnyConv**: https://anyconv.com/md-to-pptx-converter/
   - 간편한 드래그 앤 드롭

3. **Zamzar**: https://www.zamzar.com/convert/md-to-pptx/
   - 이메일로 결과 전송

---

## 방법 3: VS Code Extension 사용

### Marp 확장 프로그램
1. VS Code에서 "Marp for VS Code" 설치
2. Markdown 파일 열기
3. 명령 팔레트 (Ctrl+Shift+P) → "Marp: Export slide deck"
4. PowerPoint 형식 선택

---

## 방법 4: 수동 복사 (가장 간단)

### PowerPoint에서 직접 작업
1. PowerPoint 열기
2. 새 프레젠테이션 생성
3. Markdown 파일을 보면서 각 섹션을 슬라이드로 복사
4. `---`로 구분된 각 섹션이 하나의 슬라이드

**장점:**
- 디자인 완전 커스터마이징 가능
- 즉시 편집 가능
- 추가 도구 불필요

---

## Markdown 슬라이드 구조

파일에서 `---`는 슬라이드 구분자입니다:

```markdown
## 슬라이드 제목

- 내용 1
- 내용 2

---

## 다음 슬라이드 제목

- 내용 1
```

총 **17개의 슬라이드**가 포함되어 있습니다.

---

## 추천 워크플로우

### 빠른 프로토타입이 필요한 경우
→ **Pandoc** 사용 (1분 이내)

### 디자인 커스터마이징이 필요한 경우
→ **수동 복사** 후 PowerPoint에서 편집

### 반복적으로 업데이트해야 하는 경우
→ **Marp** 사용 (Markdown 편집 → 자동 변환)

---

## PowerPoint 디자인 팁

### 슬라이드 1-2: 제목 및 목차
- 큰 제목 폰트 (44pt 이상)
- 회사 로고 추가
- 배경 이미지 또는 그라디언트

### 슬라이드 3-16: 본문
- 제목: 32-40pt
- 본문: 18-24pt
- 코드 블록: 14-16pt, 고정폭 폰트
- 불릿 포인트 3-5개 이하로 제한

### 슬라이드 17: 마무리
- 연락처 정보
- 감사 메시지
- Q&A 안내

---

## 색상 팔레트 제안

### 전문적인 스타일
- 주요 색상: #2C3E50 (어두운 청회색)
- 강조 색상: #3498DB (밝은 파란색)
- 배경: #ECF0F1 (밝은 회색)
- 텍스트: #2C3E50 (어두운 청회색)

### 현대적인 스타일
- 주요 색상: #6C63FF (보라색)
- 강조 색상: #FF6584 (핑크)
- 배경: #FFFFFF (흰색)
- 텍스트: #2D3436 (검은색)

---

## 폰트 추천

### 제목용
- Montserrat (Bold)
- Roboto (Bold)
- Noto Sans KR (Bold) - 한글

### 본문용
- Open Sans (Regular)
- Roboto (Regular)
- Noto Sans KR (Regular) - 한글

### 코드용
- Fira Code
- JetBrains Mono
- Consolas

---

## 추가 리소스

### 아이콘 및 이미지
- [Flaticon](https://www.flaticon.com) - 무료 아이콘
- [Undraw](https://undraw.co) - 일러스트레이션
- [Unsplash](https://unsplash.com) - 고품질 사진

### 다이어그램
- [Excalidraw](https://excalidraw.com) - 손그림 스타일 다이어그램
- [Draw.io](https://draw.io) - 전문 다이어그램
- [Mermaid Live](https://mermaid.live) - 코드로 다이어그램 생성

---

## 문제 해결

### Pandoc 변환 시 한글이 깨지는 경우
```bash
pandoc taskmaster_workflow_presentation.md \
  -o taskmaster_workflow_presentation.pptx \
  --metadata title="Taskmaster 워크플로우"
```

### 코드 블록이 제대로 표시되지 않는 경우
- PowerPoint에서 수동으로 고정폭 폰트 적용
- 또는 코드를 스크린샷으로 삽입

### 슬라이드가 너무 많은 내용을 포함하는 경우
- 2-3개의 슬라이드로 분할
- 애니메이션 효과로 순차 표시

---

## 완성 후 체크리스트

- [ ] 모든 슬라이드에 일관된 폰트 적용
- [ ] 색상 팔레트 일관성 확인
- [ ] 코드 블록 가독성 확인
- [ ] 이미지 및 다이어그램 추가
- [ ] 슬라이드 번호 추가
- [ ] 발표자 노트 작성
- [ ] 애니메이션 효과 적용 (선택)
- [ ] PDF 백업 버전 생성

---

## 발표 팁

### 시간 배분 (30분 발표 기준)
- 슬라이드 1-2 (소개): 2분
- 슬라이드 3-6 (개념 및 설치): 5분
- 슬라이드 7-10 (Task 등록 및 실행): 8분
- 슬라이드 11-14 (Sub-Agent 및 Git): 8분
- 슬라이드 15-16 (실습 예제): 5분
- 슬라이드 17 (Q&A): 2분

### 발표 중 주의사항
- 코드 블록은 설명만 하고 넘어가기 (읽지 않기)
- 실제 데모 화면 준비 (Chrome DevTools)
- 청중 질문 예상 및 답변 준비

---

## 파일 위치

- **원본 Markdown**: `taskmaster_workflow_presentation.md`
- **변환 가이드**: `HOW_TO_CONVERT_TO_PPT.md` (이 파일)
- **변환 후 PPT**: `taskmaster_workflow_presentation.pptx` (생성 예정)
