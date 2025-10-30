# 🚀 Render.com 배포 가이드

COZY 커피 주문 시스템을 Render.com에 배포하는 완벽한 가이드입니다.

## 📋 목차

1. [사전 준비](#사전-준비)
2. [배포 순서](#배포-순서)
3. [1단계: PostgreSQL 데이터베이스 배포](#1단계-postgresql-데이터베이스-배포)
4. [2단계: 백엔드 API 배포](#2단계-백엔드-api-배포)
5. [3단계: 프론트엔드 배포](#3단계-프론트엔드-배포)
6. [4단계: 환경변수 최종 설정](#4단계-환경변수-최종-설정)
7. [배포 확인](#배포-확인)
8. [문제 해결](#문제-해결)

---

## 사전 준비

### 필요한 계정 및 도구
- ✅ GitHub 계정
- ✅ Render.com 계정 (무료 가능)
- ✅ Git 설치 및 저장소 생성

### GitHub에 코드 푸시

```bash
# 저장소 초기화 (아직 안 했다면)
git init
git add .
git commit -m "Initial commit: COZY Coffee Order System"

# GitHub 저장소에 푸시
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

---

## 배포 순서

**중요**: 반드시 이 순서대로 배포하세요!

```
1️⃣ PostgreSQL 데이터베이스
    ↓
2️⃣ 백엔드 API 서버
    ↓
3️⃣ 프론트엔드 (Static Site)
    ↓
4️⃣ 환경변수 최종 업데이트
```

---

## 1단계: PostgreSQL 데이터베이스 배포

### 1.1 데이터베이스 생성

1. [Render 대시보드](https://dashboard.render.com)에 로그인
2. **New +** 버튼 클릭 → **PostgreSQL** 선택
3. 데이터베이스 설정:
   - **Name**: `cozy-coffee-db` (원하는 이름)
   - **Database**: `order_app_db` (자동 생성)
   - **User**: `order_app_user` (자동 생성)
   - **Region**: `Oregon (US West)` 또는 가까운 지역
   - **PostgreSQL Version**: `16` (최신 버전)
   - **Plan**: `Free` 또는 `Starter`
4. **Create Database** 클릭

### 1.2 데이터베이스 연결 정보 확인

데이터베이스 생성 후 **Info** 탭에서 연결 정보 확인:

- **Internal Database URL**: Render 내부에서 사용 (백엔드 배포 시 사용)
- **External Database URL**: 외부에서 접근 시 사용 (로컬에서 스키마 생성 시 사용)

형식:
```
postgresql://username:password@hostname/database
```

### 1.3 데이터베이스 스키마 생성

로컬에서 스키마를 적용합니다:

```bash
cd server

# External Database URL을 환경변수로 설정하여 스키마 생성
# Windows PowerShell:
$env:DATABASE_URL="복사한_External_Database_URL"; npm run init-db

# Mac/Linux:
DATABASE_URL="복사한_External_Database_URL" npm run init-db
```

성공하면 다음과 같이 표시됩니다:
```
✅ 테이블 생성 완료
✅ 인덱스 생성 완료
✅ 트리거 생성 완료
✅ 초기 데이터 삽입 완료
```

---

## 2단계: 백엔드 API 배포

### 2.1 백엔드 서비스 생성

1. Render 대시보드에서 **New +** → **Web Service** 선택
2. **Connect a repository** → GitHub 저장소 연결
3. 저장소 선택 후 **Connect**

### 2.2 백엔드 설정

다음 정보를 입력합니다:

| 항목 | 값 |
|------|-----|
| **Name** | `cozy-coffee-api` |
| **Region** | `Oregon (US West)` (DB와 동일) |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` 또는 `Starter` |

### 2.3 환경변수 설정

**Environment** 섹션에서 다음 환경변수를 추가:

```env
DATABASE_URL = <1단계에서 생성한 Internal Database URL>
NODE_ENV = production
PORT = 3000
FRONTEND_URL = http://localhost:5173
```

**참고**: `FRONTEND_URL`은 3단계 완료 후 업데이트합니다.

### 2.4 배포 시작

**Create Web Service** 버튼을 클릭하면 자동으로 배포가 시작됩니다.

배포 완료 후 URL을 확인하세요:
```
예: https://cozy-coffee-api.onrender.com
```

### 2.5 API 테스트

브라우저에서 백엔드 URL에 접속하여 테스트:
```
https://cozy-coffee-api.onrender.com/
```

응답:
```json
{
  "message": "COZY Coffee Order API",
  "version": "1.0.0",
  "endpoints": {
    "menus": "/api/menus",
    "orders": "/api/orders",
    "admin": "/api/admin"
  }
}
```

메뉴 API 테스트:
```
https://cozy-coffee-api.onrender.com/api/menus
```

---

## 3단계: 프론트엔드 배포

### 3.1 프론트엔드 코드 수정

배포 전에 API URL을 환경변수로 사용하도록 수정해야 합니다.

**ui/src/api/api.js** 파일 수정:

```javascript
// 수정 전:
const API_BASE_URL = 'http://localhost:3000';

// 수정 후:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

변경사항을 커밋하고 푸시:
```bash
git add ui/src/api/api.js
git commit -m "feat: Add environment variable for API URL"
git push
```

### 3.2 프론트엔드 서비스 생성

1. Render 대시보드에서 **New +** → **Static Site** 선택
2. 동일한 GitHub 저장소 선택

### 3.3 프론트엔드 설정

| 항목 | 값 |
|------|-----|
| **Name** | `cozy-coffee-ui` |
| **Root Directory** | `ui` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Auto-Deploy** | `Yes` |

### 3.4 환경변수 설정

**Environment Variables** 섹션에서:

```env
VITE_API_URL = https://cozy-coffee-api.onrender.com
```

**중요**: 2단계에서 배포한 백엔드 URL을 정확히 입력하세요!

### 3.5 배포 시작

**Create Static Site** 클릭하면 배포가 시작됩니다.

배포 완료 후 URL 확인:
```
예: https://cozy-coffee-ui.onrender.com
```

---

## 4단계: 환경변수 최종 설정

### 4.1 백엔드 CORS 설정 업데이트

1. 백엔드 서비스(`cozy-coffee-api`) 대시보드로 이동
2. **Environment** 탭 선택
3. `FRONTEND_URL` 값을 프론트엔드 URL로 업데이트:

```env
FRONTEND_URL = https://cozy-coffee-ui.onrender.com
```

4. **Save Changes** 클릭 → 자동으로 재배포됨

---

## 배포 확인

### ✅ 체크리스트

- [ ] **데이터베이스**: Render 대시보드에서 연결 상태 확인
- [ ] **백엔드 API**: 
  - [ ] `/` 엔드포인트 접근 가능
  - [ ] `/api/menus` 메뉴 데이터 반환
  - [ ] 로그에서 데이터베이스 연결 성공 확인
- [ ] **프론트엔드**:
  - [ ] 사이트 접속 가능
  - [ ] 메뉴 목록 표시
  - [ ] 장바구니 기능 동작
  - [ ] 주문하기 기능 동작
  - [ ] 관리자 페이지 접근 가능

### 🧪 기능 테스트

1. **주문 페이지** (`/`)
   - 메뉴가 정상적으로 표시되는지 확인
   - 장바구니에 추가 가능한지 확인
   - 주문하기 버튼이 동작하는지 확인

2. **관리자 페이지** (`/admin`)
   - 대시보드 통계가 표시되는지 확인
   - 주문 목록이 표시되는지 확인
   - 주문 상태 변경이 가능한지 확인
   - 재고 조정이 가능한지 확인

---

## 문제 해결

### 🔧 일반적인 문제

#### 1. "Application failed to respond" 오류

**원인**: 백엔드가 시작되지 않았거나 포트 설정 문제

**해결**:
- Render 대시보드에서 **Logs** 확인
- `PORT` 환경변수가 설정되었는지 확인
- `package.json`의 `start` 스크립트 확인

#### 2. 데이터베이스 연결 오류

**원인**: DATABASE_URL이 잘못되었거나 SSL 설정 문제

**해결**:
- Render 대시보드에서 **Internal Database URL** 정확히 복사
- SSL 설정이 자동으로 활성화되는지 확인 (코드에 구현됨)

#### 3. CORS 오류

**원인**: 백엔드의 `FRONTEND_URL`이 프론트엔드 URL과 다름

**해결**:
- 백엔드 환경변수에서 `FRONTEND_URL` 확인
- 프로토콜(https)까지 정확히 일치하는지 확인
- 재배포 후 캐시 삭제

#### 4. 프론트엔드에서 메뉴가 표시되지 않음

**원인**: API URL이 잘못 설정되었거나 백엔드 응답 없음

**해결**:
- 브라우저 개발자 도구(F12) → Network 탭 확인
- 프론트엔드 환경변수 `VITE_API_URL` 확인
- 백엔드 API 직접 접속하여 응답 확인

#### 5. Free 플랜 - Cold Start 지연

**문제**: 15분 이상 요청이 없으면 서비스가 sleep 모드로 전환되어 첫 요청이 느림

**해결**:
- Render의 Starter 플랜으로 업그레이드
- 또는 UptimeRobot 같은 서비스로 주기적으로 핑 보내기

---

## 📌 추가 팁

### 이미지 파일 처리

현재 이미지가 로컬 경로로 되어 있습니다. 프로덕션에서는:

1. **Cloudinary 사용** (권장):
   - 무료 계정으로 이미지 호스팅
   - 데이터베이스의 `image_url` 업데이트

2. **백엔드에서 제공**:
   - `server/public/images` 폴더 생성
   - `server.js`에 정적 파일 제공 추가
   - Render Persistent Disk 사용 (유료)

### 로그 확인

배포 후 문제가 있다면:
```
Render 대시보드 → 서비스 선택 → Logs 탭
```

### 자동 배포 설정

GitHub에 푸시할 때마다 자동으로 배포:
```
Render 대시보드 → 서비스 설정 → Auto-Deploy: Yes
```

### 환경별 설정 분리

- **로컬 개발**: `.env` (git에서 제외)
- **프로덕션**: Render 대시보드에서 환경변수 설정

---

## 🎉 완료!

배포가 완료되었습니다! 이제 다음 URL에서 앱에 접속할 수 있습니다:

- **프론트엔드**: `https://cozy-coffee-ui.onrender.com`
- **백엔드 API**: `https://cozy-coffee-api.onrender.com`
- **데이터베이스**: Render 대시보드에서 관리

---

## 📞 지원

문제가 발생하면:
1. 이 가이드의 [문제 해결](#문제-해결) 섹션 확인
2. Render 로그 확인
3. GitHub Issues에 문의

---

Made with ☕ and ❤️

