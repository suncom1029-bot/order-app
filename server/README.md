# COZY Coffee Order System - Backend

Express.js와 PostgreSQL을 사용한 커피 주문 시스템 백엔드 API 서버입니다.

## 📋 요구사항

- Node.js (v14 이상)
- PostgreSQL (v12 이상)
- npm 또는 yarn

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password

# 서버 설정
PORT=3000
NODE_ENV=development

# CORS 설정
FRONTEND_URL=http://localhost:5173
```

### 3. 데이터베이스 설정

PostgreSQL에 데이터베이스를 생성하세요:

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE coffee_order_db;

# 데이터베이스 선택
\c coffee_order_db

# 스키마 실행
\i db/schema.sql
```

또는 psql 명령어로 직접 실행:

```bash
psql -U postgres -d coffee_order_db -f db/schema.sql
```

### 4. 서버 실행

**개발 모드 (nodemon 사용):**
```bash
npm run dev
```

**프로덕션 모드:**
```bash
npm start
```

서버가 정상적으로 실행되면:
```
🚀 서버가 포트 3000에서 실행 중입니다.
📍 API 주소: http://localhost:3000
🌍 환경: development
✅ 데이터베이스에 연결되었습니다.
```

## 📡 API 엔드포인트

### 메뉴 관리

- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/:id` - 특정 메뉴 조회

### 주문 관리

- `POST /api/orders` - 새 주문 생성
- `GET /api/orders/:id` - 특정 주문 조회

### 관리자

- `GET /api/admin/dashboard` - 대시보드 통계
- `GET /api/admin/orders` - 모든 주문 조회
- `PATCH /api/admin/orders/:id/status` - 주문 상태 변경
- `GET /api/admin/inventory` - 재고 현황 조회
- `PATCH /api/admin/inventory/:menu_id` - 재고 수량 변경

자세한 API 문서는 [docs/PRD.md](../docs/PRD.md)의 "5.4 API 설계" 섹션을 참고하세요.

## 📁 프로젝트 구조

```
server/
├── controllers/          # 비즈니스 로직
│   ├── menuController.js
│   ├── orderController.js
│   └── adminController.js
├── db/                   # 데이터베이스 관련
│   ├── database.js       # DB 연결 설정
│   └── schema.sql        # 데이터베이스 스키마
├── routes/               # API 라우트
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   └── adminRoutes.js
├── .env                  # 환경 변수 (git에서 제외)
├── .env.example          # 환경 변수 예시
├── .gitignore
├── package.json
├── server.js             # 서버 진입점
└── README.md
```

## 🗄️ 데이터베이스 스키마

### 테이블

- **menus**: 커피 메뉴 정보
- **options**: 메뉴 옵션 (샷 추가, 시럽 추가 등)
- **orders**: 주문 정보
- **order_items**: 주문 항목 상세

상세한 스키마는 `db/schema.sql` 파일을 참고하세요.

## 🔧 개발

### 데이터베이스 초기화

데이터를 초기 상태로 되돌리려면:

```bash
psql -U postgres -d coffee_order_db -f db/schema.sql
```

### 로그 확인

서버는 모든 요청과 쿼리를 콘솔에 로깅합니다:

```
2025-10-29T15:00:00.000Z - GET /api/menus
📊 Query: { text: 'SELECT * FROM menus ORDER BY id ASC', duration: 5, rows: 3 }
```

## 🛠️ 트러블슈팅

### 데이터베이스 연결 오류

```
❌ 데이터베이스 연결 오류: connection refused
```

**해결방법:**
1. PostgreSQL이 실행 중인지 확인
2. `.env` 파일의 DB 설정이 올바른지 확인
3. 방화벽 설정 확인

### 포트 충돌

```
Error: listen EADDRINUSE: address already in use :::3000
```

**해결방법:**
1. `.env` 파일에서 다른 포트 번호로 변경
2. 또는 기존 프로세스 종료:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:3000 | xargs kill
   ```

## 📝 라이선스

ISC

