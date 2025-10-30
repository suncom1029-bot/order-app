# 🔧 Render 데이터베이스 연결 오류 해결

## ❌ 발생한 오류

```
password authentication failed for user "postgres"
```

백엔드가 데이터베이스에 연결하지 못하고 있습니다.

---

## 🔍 원인

Render 백엔드 서비스의 **환경변수가 올바르게 설정되지 않았습니다**.

---

## ✅ 해결 방법

### 1단계: Render 백엔드 서비스 접속

1. https://dashboard.render.com 접속
2. **order-app-backend** (또는 order-app_backend) 서비스 선택
3. 왼쪽 메뉴에서 **Environment** 탭 클릭

### 2단계: 환경변수 확인 및 수정

현재 설정되어 있는 환경변수를 확인하고, 다음과 같이 수정하세요:

#### ⭐ 방법 1: DATABASE_URL 사용 (권장)

**Add Environment Variable** 클릭 후:

```
Key:   DATABASE_URL
Value: postgresql://order_app_db_asrw_user:XSEmgZfWZIr4jEu0JU0SjmuzkyNZY6lZ@dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com/order_app_db_asrw
```

> **중요**: 위 URL은 External Database URL입니다. Internal URL도 사용 가능합니다.

#### 또는 방법 2: 개별 환경변수 사용

다음 환경변수들을 모두 추가/수정:

```
DB_HOST = dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com
DB_PORT = 5432
DB_NAME = order_app_db_asrw
DB_USER = order_app_db_asrw_user
DB_PASSWORD = XSEmgZfWZIr4jEu0JU0SjmuzkyNZY6lZ
```

#### 기타 필수 환경변수:

```
NODE_ENV = production
PORT = 3000
FRONTEND_URL = https://order-app-frontend-xdek.onrender.com
```

### 3단계: 저장 및 재배포

1. **Save Changes** 버튼 클릭
2. Render가 자동으로 백엔드를 재배포합니다 (약 1-2분 소요)

---

## 🔍 환경변수 확인 방법

### Render PostgreSQL 대시보드에서 확인:

1. Render 대시보드에서 **PostgreSQL 데이터베이스** 선택
2. **Info** 탭 클릭
3. 다음 정보 확인:

```
Database: order_app_db_asrw
Username: order_app_db_asrw_user
Host: dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com
Port: 5432
```

4. **Connection** 섹션에서:
   - **Internal Database URL** (Render 내부 서비스에서 사용)
   - **External Database URL** (외부 또는 로컬에서 사용)

둘 중 하나를 `DATABASE_URL`로 사용하면 됩니다.

---

## ✅ 재배포 후 확인

### 1. 로그 확인

Render 대시보드 → **order-app-backend** → **Logs** 탭:

**성공 시:**
```
🔗 DATABASE_URL로 연결 중...
📍 Host: dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com
✅ 데이터베이스에 연결되었습니다.
🚀 서버가 포트 3000에서 실행 중입니다.
```

**실패 시:**
```
❌ 데이터베이스 연결 오류: password authentication failed
```

→ 환경변수를 다시 확인하세요.

### 2. API 테스트

브라우저에서 접속:
```
https://order-app-backend-ghte.onrender.com/api/menus
```

**성공 응답:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "price": 4000,
      "stock": 10,
      ...
    }
  ]
}
```

### 3. 프론트엔드 테스트

https://order-app-frontend-xdek.onrender.com 접속

- ✅ 메뉴 3개가 표시되어야 함
- ✅ "데이터를 불러오는 중 오류가 발생했습니다" 알림이 사라져야 함

---

## 🚨 주의사항

### 잘못된 환경변수 예시:

❌ **DB_USER = postgres** (틀림)
✅ **DB_USER = order_app_db_asrw_user** (맞음)

❌ **DB_NAME = coffee_order_db** (틀림)
✅ **DB_NAME = order_app_db_asrw** (맞음)

❌ **DB_HOST = localhost** (틀림)
✅ **DB_HOST = dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com** (맞음)

---

## 💡 팁

### 환경변수가 너무 많아서 헷갈린다면?

**DATABASE_URL 하나만** 사용하는 것을 권장합니다:

1. 기존의 `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` 모두 삭제
2. `DATABASE_URL` 하나만 추가
3. 훨씬 간단하고 오류 가능성이 줄어듭니다!

---

## 📞 아직도 안 되나요?

1. **Logs 탭에서 정확한 오류 메시지 확인**
2. **데이터베이스 서비스가 정상 작동 중인지 확인** (PostgreSQL 대시보드)
3. **환경변수 오타 확인** (특히 비밀번호, 호스트명)
4. **Render의 PostgreSQL Free 플랜 제한** 확인 (동시 연결 수 등)

---

**작성일**: 2025-10-30
**마지막 업데이트**: 백엔드 연결 디버깅 로그 추가

