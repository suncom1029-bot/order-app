# 🔐 환경변수 설정 가이드

## `.env` 파일 생성

`server/.env` 파일을 생성하고 아래 내용을 참고하여 설정하세요.

---

## 📝 Render.com 프로덕션 환경 (권장)

Render PostgreSQL을 사용하는 경우, DATABASE_URL만 설정하면 됩니다:

```env
# Render Database URL (Internal Database URL 사용)
DATABASE_URL=postgresql://order_app_db_asrw_user:XSEmgZfWZIr4jEu0JU0SjmuzkyNZY6lZ@dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com/order_app_db_asrw

# 서버 설정
PORT=3000
NODE_ENV=production

# CORS 설정 (프론트엔드 URL)
FRONTEND_URL=https://cozy-coffee-ui.onrender.com
```

### Render Database URL 확인 방법:

1. Render 대시보드 → PostgreSQL 데이터베이스 선택
2. **Info** 탭에서 **External Database URL** 복사
3. 위의 `DATABASE_URL`에 붙여넣기

---

## 💻 로컬 개발 환경

로컬 PostgreSQL을 사용하는 경우:

```env
# 로컬 PostgreSQL 연결
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_local_password
DB_SSL=false

# 서버 설정
PORT=3000
NODE_ENV=development

# CORS 설정 (로컬 프론트엔드)
FRONTEND_URL=http://localhost:5173
```

---

## 🔄 환경별 전환

### 로컬 → Render 전환

1. `.env` 파일의 `DATABASE_URL`을 Render URL로 변경
2. 또는 터미널에서 환경변수로 직접 설정:

**Windows PowerShell:**
```powershell
$env:DATABASE_URL="postgresql://..."; npm run init-db
```

**Mac/Linux:**
```bash
DATABASE_URL="postgresql://..." npm run init-db
```

### Render → 로컬 전환

1. `.env` 파일에서 `DATABASE_URL` 주석 처리
2. 개별 DB 설정(`DB_HOST`, `DB_PORT` 등) 활성화

---

## ⚙️ 환경변수 우선순위

코드는 다음 순서로 환경변수를 확인합니다:

1. **DATABASE_URL** (있으면 이것 사용)
2. **개별 환경변수** (DB_HOST, DB_PORT 등)
3. **SSL 자동 감지** (호스트명에 `render.com` 포함 시 자동 활성화)

---

## 🛡️ 보안 주의사항

- ⚠️ **절대로** `.env` 파일을 Git에 커밋하지 마세요!
- `.gitignore`에 `.env`가 포함되어 있는지 확인하세요
- Render 배포 시에는 Render 대시보드의 **Environment Variables**에서 설정하세요

---

## 📌 예시 요약

### 현재 Render 데이터베이스 정보:

```
Database: order_app_db_asrw
User: order_app_db_asrw_user
Host: dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com
```

### 완전한 .env 파일 예시:

```env
DATABASE_URL=postgresql://order_app_db_asrw_user:XSEmgZfWZIr4jEu0JU0SjmuzkyNZY6lZ@dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com/order_app_db_asrw
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://cozy-coffee-ui.onrender.com
```

---

## ✅ 테스트

설정이 완료되면 연결을 테스트하세요:

```bash
cd server
npm run init-db
```

성공 시:
```
✅ 데이터베이스에 연결되었습니다
✅ 테이블 생성 완료
✅ 초기 데이터 삽입 완료
```

---

문제가 있으면 [DEPLOYMENT.md](../DEPLOYMENT.md)의 문제 해결 섹션을 참고하세요!

