# COZY 커피 주문 시스템 - 기능 테스트 진단 보고서

## 📅 테스트 일시
251030

## 🔍 진단 결과

### 1. 서버 연결 상태
✅ **정상** - 서버가 포트 3000에서 정상적으로 실행 중입니다.

### 2. 데이터베이스 연결 문제 발견 ⚠️
❌ **실패** - PostgreSQL 인증 실패

#### 오류 메시지:
```
password authentication failed for user "postgres"
```

#### 원인 분석:
현재 `.env` 파일에 설정된 데이터베이스 연결 정보:
- DB_HOST: `dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com` (Render 클라우드)
- DB_USER: `postgres` ⚠️ **잘못된 사용자명**
- DB_NAME: `coffee_order_db` ⚠️ **잘못된 데이터베이스명**

Render.com 데이터베이스의 올바른 정보 (ENV_GUIDE.md 참조):
- DB_USER: `order_app_db_asrw_user` ✅
- DB_NAME: `order_app_db_asrw` ✅
- DB_HOST: `dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com` ✅

## 🔧 해결 방법

### 옵션 1: DATABASE_URL 사용 (권장)
Render 클라우드 데이터베이스를 사용하는 경우, `server/.env` 파일을 다음과 같이 수정하세요:

```env
# Render Database URL 사용
DATABASE_URL=postgresql://order_app_db_asrw_user:PASSWORD@dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com/order_app_db_asrw

# 개별 설정은 주석 처리하거나 삭제
# DB_HOST=...
# DB_PORT=...
# DB_NAME=...
# DB_USER=...
# DB_PASSWORD=...

PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**참고:** `PASSWORD` 부분은 실제 Render 데이터베이스 비밀번호로 교체하세요.

### 옵션 2: 개별 환경 변수 수정
개별 환경 변수를 사용하려면 다음과 같이 수정하세요:

```env
DB_HOST=dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=order_app_db_asrw
DB_USER=order_app_db_asrw_user
DB_PASSWORD=실제_비밀번호
DB_SSL=true

PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 옵션 3: 로컬 PostgreSQL 사용
로컬 개발을 위해 로컬 PostgreSQL을 사용하려면:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=로컬_비밀번호
DB_SSL=false

PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 📝 수정 후 진행 단계

### 1단계: 데이터베이스 초기화
```bash
cd server
npm run init-db
```

예상 출력:
```
✅ 데이터베이스에 연결되었습니다
✅ 테이블 생성 완료
✅ 초기 데이터 삽입 완료
```

### 2단계: 서버 재시작
```bash
cd server
npm run dev
```

### 3단계: 기능 테스트 실행
```bash
node test-functions.js
```

## 🧪 테스트해야 할 주요 기능

1. ✅ 서버 연결 - **정상**
2. ⏳ 메뉴 조회 API - 대기 중
3. ⏳ 주문 생성 API - 대기 중
4. ⏳ 관리자 대시보드 - 대기 중
5. ⏳ 주문 목록 조회 - 대기 중
6. ⏳ 주문 상태 변경 - 대기 중
7. ⏳ 재고 조회 - 대기 중
8. ⏳ 재고 변경 - 대기 중

## 📚 추가 참고 자료

- `server/ENV_GUIDE.md` - 환경 변수 설정 가이드
- `DEPLOYMENT.md` - 배포 가이드
- `RENDER_FIX_GUIDE.md` - Render 관련 문제 해결

## 🎯 다음 단계

1. **즉시:** `.env` 파일의 데이터베이스 연결 정보 수정
2. **그 다음:** `npm run init-db` 실행하여 데이터베이스 초기화
3. **마지막:** 기능 테스트 재실행 (`node test-functions.js`)

---

💡 **팁:** Render 대시보드에서 데이터베이스 연결 정보를 확인할 수 있습니다:
- Render Dashboard → PostgreSQL 선택 → Info 탭 → "External Database URL" 복사

