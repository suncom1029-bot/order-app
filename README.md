# COZY - 커피 주문 시스템 ☕

Express.js와 React를 사용한 풀스택 커피 주문 관리 시스템입니다.

## 📋 프로젝트 개요

COZY는 커피숍을 위한 주문 및 재고 관리 시스템으로, 고객이 메뉴를 선택하고 주문할 수 있으며, 관리자가 주문 상태와 재고를 실시간으로 관리할 수 있습니다.

## 🏗️ 프로젝트 구조

```
coffee/
├── ui/                    # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── api/          # API 통신
│   │   ├── components/   # 재사용 컴포넌트
│   │   ├── pages/        # 페이지 컴포넌트
│   │   └── assets/       # 이미지 등 정적 파일
│   └── public/
│
├── server/                # 백엔드 (Node.js + Express + PostgreSQL)
│   ├── controllers/      # 비즈니스 로직
│   ├── routes/           # API 라우트
│   ├── db/               # 데이터베이스 설정 및 스키마
│   └── .env              # 환경 변수 (git에서 제외)
│
├── docs/                  # 문서
│   └── PRD.md            # 제품 요구사항 문서
│
└── README.md             # 프로젝트 설명서 (현재 파일)
```

## 🚀 빠른 시작

### 📦 배포하기

Render.com에 배포하려면 **[배포 가이드](./DEPLOYMENT.md)**를 참고하세요!

### 사전 요구사항

- Node.js (v14 이상)
- PostgreSQL (v12 이상)
- npm 또는 yarn

### 1. 저장소 클론

```bash
git clone <repository-url>
cd coffee
```

### 2. 백엔드 설정

```bash
cd server
npm install

# .env 파일 생성 및 설정
cp .env.example .env
# .env 파일을 열어 PostgreSQL 설정 입력

# 데이터베이스 초기화
npm run init-db

# 서버 실행
npm run dev
```

백엔드 서버: `http://localhost:3000`

### 3. 프론트엔드 설정

```bash
cd ui
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드 서버: `http://localhost:5173`

## 📡 주요 기능

### 👤 고객 기능 (주문하기 화면)
- ☕ 커피 메뉴 조회
- 🛒 장바구니에 메뉴 담기
- ➕ 옵션 추가 (샷, 시럽)
- 📦 주문하기
- 📊 실시간 재고 확인

### 👨‍💼 관리자 기능 (관리자 화면)
- 📊 대시보드 통계
  - 총 주문 수
  - 주문 접수 / 제조 중 / 제조 완료 수
- 📦 재고 관리
  - 재고 수량 조회
  - 재고 증감 (+/-)
  - 재고 상태 표시 (정상/주의/품절)
- 📋 주문 관리
  - 주문 목록 조회
  - 주문 상태 변경
  - 주문 접수 → 제조 중 → 제조 완료

## 🛠️ 기술 스택

### 프론트엔드
- **React 19** - UI 라이브러리
- **Vite** - 빌드 도구
- **CSS3** - 스타일링

### 백엔드
- **Node.js** - 런타임
- **Express.js** - 웹 프레임워크
- **PostgreSQL** - 데이터베이스
- **pg** - PostgreSQL 클라이언트

### 개발 도구
- **nodemon** - 자동 재시작
- **dotenv** - 환경 변수 관리
- **ESLint** - 코드 품질

## 📚 API 문서

자세한 API 문서는 [`docs/PRD.md`](./docs/PRD.md)의 "5.4 API 설계" 섹션을 참고하세요.

### 주요 엔드포인트

#### 메뉴
- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/:id` - 특정 메뉴 조회

#### 주문
- `POST /api/orders` - 주문 생성
- `GET /api/orders/:id` - 주문 조회

#### 관리자
- `GET /api/admin/dashboard` - 대시보드 통계
- `GET /api/admin/orders` - 주문 목록
- `PATCH /api/admin/orders/:id/status` - 주문 상태 변경
- `GET /api/admin/inventory` - 재고 현황
- `PATCH /api/admin/inventory/:menu_id` - 재고 변경

## 🗄️ 데이터베이스 스키마

### 테이블
- **menus** - 커피 메뉴 정보
- **options** - 메뉴 옵션 (샷 추가, 시럽 추가)
- **orders** - 주문 정보
- **order_items** - 주문 항목 상세

상세한 스키마는 [`server/db/schema.sql`](./server/db/schema.sql)을 참고하세요.

## 🔧 개발 가이드

### 환경 변수 설정

**server/.env**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password

PORT=3000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173
```

### 데이터베이스 초기화

```bash
cd server
npm run init-db
```

### 개발 서버 실행

**터미널 1 - 백엔드**
```bash
cd server
npm run dev
```

**터미널 2 - 프론트엔드**
```bash
cd ui
npm run dev
```

## 📝 라이선스

ISC

## 👥 기여

이 프로젝트는 학습 목적으로 만들어졌습니다.

## 📞 문의

문제가 있거나 제안사항이 있으시면 이슈를 등록해주세요.

---

Made with ☕ and ❤️

