from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# Create presentation
prs = Presentation()
prs.slide_width = Inches(10)
prs.slide_height = Inches(7.5)

def add_title_slide(title, subtitle):
    slide = prs.slides.add_slide(prs.slide_layouts[0])
    slide.shapes.title.text = title
    slide.placeholders[1].text = subtitle
    return slide

def add_content_slide(title, content_list):
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = title
    content = slide.placeholders[1].text_frame
    content.clear()
    for item in content_list:
        p = content.add_paragraph()
        p.text = item
        p.level = 0
        p.font.size = Pt(18)
    return slide

def add_bullet_slide(title, bullets):
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = title
    content = slide.placeholders[1].text_frame
    content.clear()
    for bullet in bullets:
        p = content.add_paragraph()
        p.text = bullet
        p.level = 0
        p.font.size = Pt(20)
    return slide

# Slide 1: Title
slide = add_title_slide(
    "Claude Code Taskmaster 워크플로우",
    "Task Master를 활용한 프로젝트 관리\n\n🤖 Generated with Claude Code"
)

# Slide 2: 목차
add_bullet_slide("📋 목차", [
    "1. Taskmaster 소개",
    "2. 설치 및 초기화",
    "3. Task 등록",
    "4. Task 실행",
    "5. Sub-Agent를 통한 상태 업데이트",
    "6. 실습 예제: 사용자 프로필 관리",
    "7. Git 커밋 및 관리"
])

# Slide 3: Taskmaster 소개
add_bullet_slide("1️⃣ Taskmaster란?", [
    "✅ Claude Code의 프로젝트 관리 도구",
    "✅ PRD(Product Requirements Document) 기반 작업 관리",
    "✅ Task 분해 및 추적 기능",
    "✅ Sub-agent를 통한 자동화된 진행 상황 관리"
])

# Slide 4: 주요 기능
add_bullet_slide("주요 기능", [
    "🎯 Task 자동 생성 및 의존성 관리",
    "📊 우선순위 및 상태 추적",
    "✅ 테스트 전략 문서화",
    "🤝 Sub-agent 연동 지원"
])

# Slide 5: 설치
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "2️⃣ 설치 및 초기화"
tf = slide.placeholders[1].text_frame
tf.clear()
p = tf.add_paragraph()
p.text = "설치"
p.font.size = Pt(24)
p.font.bold = True
p = tf.add_paragraph()
p.text = "npm install -g @anthropic-ai/taskmaster"
p.font.name = "Consolas"
p.font.size = Pt(16)
p = tf.add_paragraph()
p.text = ""
p = tf.add_paragraph()
p.text = "초기화"
p.font.size = Pt(24)
p.font.bold = True
p = tf.add_paragraph()
p.text = "npx taskmaster init"
p.font.name = "Consolas"
p.font.size = Pt(16)

# Slide 6: 디렉토리 구조
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "생성되는 디렉토리 구조"
tf = slide.placeholders[1].text_frame
tf.clear()
structure = [
    ".taskmaster/",
    "├── config.json          # 설정 파일",
    "├── state.json           # 현재 상태",
    "├── tasks/",
    "│   └── tasks.json       # Task 목록",
    "├── docs/                # PRD 문서",
    "└── templates/           # PRD 템플릿"
]
for line in structure:
    p = tf.add_paragraph()
    p.text = line
    p.font.name = "Consolas"
    p.font.size = Pt(18)

# Slide 7: PRD 작성
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "3️⃣ Task 등록 - PRD 작성"
tf = slide.placeholders[1].text_frame
tf.clear()
prd_content = [
    "# 사용자 프로필 관리 시스템",
    "",
    "## 목표",
    "사용자가 자신의 프로필을 조회, 수정, 관리할 수 있는 기능",
    "",
    "## 주요 기능",
    "1. 프로필 조회 및 편집",
    "2. 비밀번호 변경",
    "3. 아바타 업로드",
    "4. 계정 설정 및 삭제"
]
for line in prd_content:
    p = tf.add_paragraph()
    p.text = line
    p.font.size = Pt(16)

# Slide 8: Task 생성
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "Task 생성"
tf = slide.placeholders[1].text_frame
tf.clear()
p = tf.add_paragraph()
p.text = "npx taskmaster create-tasks prd_user_profile.txt"
p.font.name = "Consolas"
p.font.size = Pt(18)
p = tf.add_paragraph()
p.text = ""
p = tf.add_paragraph()
p.text = "생성된 10개 Tasks:"
p.font.size = Pt(20)
p.font.bold = True
tasks = [
    "1. 데이터베이스 스키마 및 타입 정의",
    "2. Pinia 사용자 프로필 스토어 구현",
    "3. 프로필 API 엔드포인트 구현",
    "4. 프로필 조회 페이지 구현",
    "5. i18n 프로필 번역 키 추가",
    "... (총 10개)"
]
for task in tasks:
    p = tf.add_paragraph()
    p.text = task
    p.font.size = Pt(16)

# Slide 9: Task 실행
add_bullet_slide("4️⃣ Task 실행", [
    'Claude Code에서 실행:',
    '"등록된 task를 보여줘"',
    '"순서대로 진행해"',
    '',
    'Claude Code가 자동으로:',
    '• 의존성 순서대로 Task 실행',
    '• 각 Task의 상세 구현 진행',
    '• 테스트 및 검증'
])

# Slide 10: Task 예제 - 데이터베이스
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "Task 1: 데이터베이스 스키마"
tf = slide.placeholders[1].text_frame
tf.clear()
sql = [
    "CREATE TABLE user_profiles (",
    "  id SERIAL PRIMARY KEY,",
    "  user_id VARCHAR(50) UNIQUE NOT NULL",
    "    REFERENCES com_user(user_id) ON DELETE CASCADE,",
    "  bio TEXT,",
    "  phone VARCHAR(20),",
    "  avatar_url VARCHAR(500),",
    "  preferred_language VARCHAR(10) DEFAULT 'en',",
    "  email_notifications BOOLEAN DEFAULT true,",
    "  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ");"
]
for line in sql:
    p = tf.add_paragraph()
    p.text = line
    p.font.name = "Consolas"
    p.font.size = Pt(14)

# Slide 11: Sub-Agent 소개
add_bullet_slide("5️⃣ Sub-Agent를 통한 상태 업데이트", [
    "문제점:",
    "• 모든 작업 완료 후에도 tasks.json에",
    "  status: pending으로 표시됨",
    "",
    "해결 방법:",
    '"task-master 작업 상황을 업데이트하는',
    ' sub-agent를 만들어줘"'
])

# Slide 12: Sub-Agent 실행
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "Sub-Agent 실행 과정"
tf = slide.placeholders[1].text_frame
tf.clear()
p = tf.add_paragraph()
p.text = "Before:"
p.font.size = Pt(20)
p.font.bold = True
p = tf.add_paragraph()
p.text = '{ "status": "pending" }'
p.font.name = "Consolas"
p.font.size = Pt(18)
p = tf.add_paragraph()
p.text = ""
p = tf.add_paragraph()
p.text = "After:"
p.font.size = Pt(20)
p.font.bold = True
p = tf.add_paragraph()
p.text = '{ "status": "completed" }'
p.font.name = "Consolas"
p.font.size = Pt(18)
p = tf.add_paragraph()
p.text = ""
p = tf.add_paragraph()
p.text = "✅ 10개 Task 모두 completed 상태로 변경"
p.font.size = Pt(18)

# Slide 13: 완성된 기능
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "6️⃣ 실습 예제 - 완성된 기능"
tf = slide.placeholders[1].text_frame
tf.clear()
p = tf.add_paragraph()
p.text = "Backend API (5개)"
p.font.size = Pt(22)
p.font.bold = True
apis = [
    "• GET /api/users/:userId/profile",
    "• PUT /api/users/:userId/profile",
    "• PUT /api/users/:userId/password",
    "• POST /api/users/:userId/avatar",
    "• DELETE /api/users/:userId"
]
for api in apis:
    p = tf.add_paragraph()
    p.text = api
    p.font.size = Pt(16)
p = tf.add_paragraph()
p.text = ""
p = tf.add_paragraph()
p.text = "Vue Components (6개)"
p.font.size = Pt(22)
p.font.bold = True
p = tf.add_paragraph()
p.text = "ProfileCard, ProfileForm, AvatarUpload,"
p.font.size = Pt(16)
p = tf.add_paragraph()
p.text = "PasswordChangeForm, PasswordStrengthIndicator, SettingsPanel"
p.font.size = Pt(16)

# Slide 14: Git 커밋
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "7️⃣ Git 커밋 및 관리"
tf = slide.placeholders[1].text_frame
tf.clear()
p = tf.add_paragraph()
p.text = "git add .taskmaster/"
p.font.name = "Consolas"
p.font.size = Pt(16)
p = tf.add_paragraph()
p.text = 'git commit -m "taskmaster 작업 상태 업데이트"'
p.font.name = "Consolas"
p.font.size = Pt(16)
p = tf.add_paragraph()
p.text = ""
p = tf.add_paragraph()
p.text = "결과:"
p.font.size = Pt(20)
p.font.bold = True
p = tf.add_paragraph()
p.text = "• 6개 파일 커밋"
p.font.size = Pt(18)
p = tf.add_paragraph()
p.text = "• 1,289 줄 추가"
p.font.size = Pt(18)

# Slide 15: 워크플로우
add_bullet_slide("워크플로우 요약", [
    "1. PRD 작성 → 2. Task 생성 (10개)",
    "     ↓",
    "3. Claude Code 실행 → 4. 구현 작업",
    "     ↓",
    "5. 브라우저 테스트 → 6. 버그 수정",
    "     ↓",
    "7. Sub-Agent 상태 업데이트 → 8. Git 커밋"
])

# Slide 16: 장점
add_bullet_slide("Taskmaster의 장점", [
    "🚀 자동화: PRD에서 Task 자동 생성",
    "📊 체계성: 의존성 및 우선순위 관리",
    "📝 문서화: 테스트 전략 포함",
    "🤖 AI 연동: Sub-agent 자동 업데이트"
])

# Slide 17: 프로젝트 성과
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "프로젝트 성과"
tf = slide.placeholders[1].text_frame
tf.clear()
stats = [
    ("작업 기간", "1일"),
    ("완료 Task", "10개"),
    ("작성 코드", "1,289+ 줄"),
    ("생성 파일", "20+ 개"),
    ("API 엔드포인트", "5개"),
    ("Vue 컴포넌트", "6개"),
    ("i18n 번역", "50+ 키")
]
for label, value in stats:
    p = tf.add_paragraph()
    p.text = f"{label:15} {value}"
    p.font.name = "Consolas"
    p.font.size = Pt(20)

# Slide 18: 보안 기능
add_bullet_slide("구현된 보안 기능", [
    "🔐 bcrypt 비밀번호 해싱",
    "✅ 파일 타입/크기 검증 (5MB, JPG/PNG/WebP)",
    "🔒 비밀번호 복잡성 검증",
    "   • 8자 이상, 대/소문자, 숫자 포함",
    "🗑️ CASCADE 삭제로 데이터 무결성 보장"
])

# Slide 19: 실전 팁
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "실전 팁 - Claude Code 명령어"
tf = slide.placeholders[1].text_frame
tf.clear()
commands = [
    '"등록된 task를 보여줘"',
    '"순서대로 진행해"',
    '"Task 3부터 진행해"',
    '"taskmaster 작업 진행 상황을 보여줘"',
    '"작업 상황을 업데이트하는 sub-agent를 만들어줘"',
    '"taskmaster 변경사항 커밋해줘"'
]
for cmd in commands:
    p = tf.add_paragraph()
    p.text = cmd
    p.font.name = "Consolas"
    p.font.size = Pt(16)

# Slide 20: Best Practices
add_bullet_slide("Best Practices", [
    "PRD 작성:",
    "• 명확한 목표 정의",
    "• 구체적인 요구사항",
    "• 기술 스택 명시",
    "",
    "Task 관리:",
    "• 작은 단위로 분해 (1-2일)",
    "• 의존성 명확히",
    "• 테스트 전략 포함"
])

# Slide 21: Q&A
slide = add_title_slide(
    "Q&A",
    "질문이 있으신가요?"
)

# Slide 22: 감사합니다
slide = add_title_slide(
    "감사합니다! 🙏",
    "🤖 Generated with Claude Code\n\n" +
    "작성: Claude Sonnet 4.5\n" +
    "날짜: 2025-12-21\n" +
    "프로젝트: nuxt_practice"
)

# Save presentation
output_file = "C:\\Users\\micth\\IdeaProjects\\nuxt_practice\\taskmaster_presentation.pptx"
prs.save(output_file)
print(f"PowerPoint file created: {output_file}")
print(f"Total slides: {len(prs.slides)}")
