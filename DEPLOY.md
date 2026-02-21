# 프로덕션 빌드 및 배포 가이드

## 사전 요구사항

- Node.js 18+ 설치
- npm 또는 yarn
- 백엔드 서버 (`:8080`) 및 인증 서버 (`:9000`) 실행 중

## 1. 프로덕션 빌드

```bash
cd nuxt_practice
npm run build
```

빌드 결과물은 `.output/` 디렉토리에 생성됩니다.

```
.output/
├── server/          # Nitro 서버 번들
│   ├── index.mjs    # 서버 진입점
│   ├── chunks/      # 서버 청크 (API 라우트 포함)
│   └── package.json
├── public/          # 정적 자산 (클라이언트 JS/CSS)
│   └── _nuxt/       # 번들된 클라이언트 파일
└── nitro.json       # Nitro 설정
```

### 한글 경로 빌드 에러 대응

Windows 사용자 이름에 한글이 포함된 경우 (`C:\Users\이근호\...`) Vite SSR 빌드 시 경로 인코딩 문제가 발생할 수 있습니다. 이 프로젝트에는 이미 `nuxt.config.ts`에 `fixNonAsciiPaths()` 플러그인이 포함되어 있어 자동 처리됩니다.

만약 여전히 빌드 실패 시, junction 링크를 통해 ASCII 경로에서 빌드:

```bash
# Junction 생성
mklink /J C:\humetro C:\Users\이근호\cursorProject\humetro

# Junction 경로에서 빌드
cd C:\humetro\nuxt_practice
npm run build

# Junction 제거
rmdir C:\humetro
```

## 2. 로컬 프리뷰

빌드 결과를 로컬에서 확인:

```bash
# 방법 1: nuxi preview (개발 의존성 필요)
npm run preview

# 방법 2: Node.js 직접 실행 (의존성 불필요)
node .output/server/index.mjs
```

기본 포트는 `3000`입니다. 환경변수로 변경 가능:

```bash
PORT=8000 node .output/server/index.mjs
```

## 3. 환경변수 설정

### 필수 환경변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `PORT` | 서버 포트 | `3000` |
| `HOST` | 바인드 주소 | `0.0.0.0` |
| `API_BASE_URL` | 백엔드 API 주소 | `http://localhost:8080` |
| `SITE_NAME` | 사이트 이름 | `Netis v6.6` |

### OAuth 환경변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `OAUTH_CLIENT_ID` | OAuth 클라이언트 ID | `nuxt-app` |
| `OAUTH_CLIENT_SECRET` | OAuth 클라이언트 시크릿 | `secret123` |
| `OAUTH_AUTHORIZATION_ENDPOINT` | 인증 엔드포인트 | `http://localhost:9000/oauth2/authorize` |
| `OAUTH_TOKEN_ENDPOINT` | 토큰 엔드포인트 | `http://localhost:9000/oauth2/token` |
| `OAUTH_LOGOUT_ENDPOINT` | 로그아웃 엔드포인트 | `http://localhost:9000/logout` |
| `OAUTH_REDIRECT_URI` | OAuth 콜백 URI | `http://localhost:3000/auth/callback` |
| `OAUTH_POST_LOGOUT_REDIRECT_URI` | 로그아웃 후 리다이렉트 | `http://localhost:3000/login?logout=true` |
| `OAUTH_SCOPE` | OAuth 스코프 | `openid profile email` |

### .env 파일 예시

```env
PORT=3000
API_BASE_URL=http://production-backend:8080
OAUTH_CLIENT_ID=nuxt-app
OAUTH_CLIENT_SECRET=your-production-secret
OAUTH_AUTHORIZATION_ENDPOINT=https://auth.example.com/oauth2/authorize
OAUTH_TOKEN_ENDPOINT=https://auth.example.com/oauth2/token
OAUTH_LOGOUT_ENDPOINT=https://auth.example.com/logout
OAUTH_REDIRECT_URI=https://app.example.com/auth/callback
OAUTH_POST_LOGOUT_REDIRECT_URI=https://app.example.com/login?logout=true
OAUTH_SCOPE=openid profile email
```

## 4. 서버 배포

### 방법 A: PM2로 프로세스 관리 (권장)

```bash
# PM2 설치
npm install -g pm2

# .output 디렉토리를 서버에 복사 후 실행
pm2 start .output/server/index.mjs --name humetro-frontend

# 상태 확인
pm2 status

# 로그 확인
pm2 logs humetro-frontend

# 재시작
pm2 restart humetro-frontend

# 시스템 부팅 시 자동 시작 설정
pm2 startup
pm2 save
```

### 방법 B: systemd 서비스 (Linux)

`/etc/systemd/system/humetro-frontend.service`:

```ini
[Unit]
Description=HUmetro Frontend (Nuxt)
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/opt/humetro/nuxt_practice
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=on-failure
Environment=PORT=3000
Environment=API_BASE_URL=http://localhost:8080
EnvironmentFile=/opt/humetro/nuxt_practice/.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable humetro-frontend
sudo systemctl start humetro-frontend
sudo systemctl status humetro-frontend
```

### 방법 C: Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY .output/ .output/
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```bash
docker build -t humetro-frontend .
docker run -d -p 3000:3000 --env-file .env --name humetro-frontend humetro-frontend
```

## 5. Nginx 리버스 프록시 (선택)

`/etc/nginx/sites-available/humetro`:

```nginx
server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 6. 배포 체크리스트

- [ ] 백엔드 서버 (`:8080`) 정상 동작 확인
- [ ] 인증 서버 (`:9000`) 정상 동작 확인
- [ ] 환경변수 (`.env`) 프로덕션 값으로 설정
- [ ] OAuth `redirect_uri`가 프로덕션 도메인과 일치하는지 확인
- [ ] `npm run build` 성공 확인
- [ ] `node .output/server/index.mjs` 실행 후 정상 접속 확인
- [ ] PM2 또는 systemd로 프로세스 관리 설정
- [ ] (선택) Nginx 리버스 프록시 + SSL 설정

## 7. 성능 참고

| 항목 | 개발 서버 | 프로덕션 빌드 |
|------|----------|-------------|
| Ctrl+F5 | ~14초 | **633ms** |
| F5 새로고침 | ~7.5초 | **834ms** |
| 배치 API | 140~440ms | 2~165ms |

개발 서버의 느린 속도는 Vite가 2,200+개 모듈을 실시간 변환하기 때문이며, 프로덕션에서는 번들링된 JS를 직접 제공하므로 매우 빠릅니다.
