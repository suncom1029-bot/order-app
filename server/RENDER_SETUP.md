# 🚀 Render 백엔드 배포 설정 가이드

## ⚠️ 오류 해결: "Cannot find module 'index.js'"

이 오류가 발생했다면 Render 설정을 다음과 같이 정확히 입력했는지 확인하세요.

---

## 📋 Render Web Service 설정

### 1. 기본 설정

| 항목 | 값 | 설명 |
|------|-----|------|
| **Name** | `order-app-backend` | 원하는 이름 |
| **Region** | `Oregon (US West)` | 데이터베이스와 같은 지역 |
| **Branch** | `main` | Git 브랜치 |
| **Root Directory** | `server` | ⚠️ 중요! |
| **Environment** | `Node` | Node.js 선택 |

### 2. Build & Deploy 설정

| 항목 | 값 | 비고 |
|------|-----|------|
| **Build Command** | `npm install` | 의존성 설치 |
| **Start Command** | `npm start` | ⚠️ `node server.js` 아님! |

> **중요**: Start Command는 반드시 `npm start`를 사용하세요. `node server.js`를 직접 입력하면 안 됩니다!

### 3. 환경변수 (Environment Variables)

다음 환경변수를 추가하세요:

```env
DATABASE_URL = postgresql://order_app_db_asrw_user:XSEmgZfWZIr4jEu0JU0SjmuzkyNZY6lZ@dpg-d41atm75r7bs739b60o0-a.oregon-postgres.render.com/order_app_db_asrw

NODE_ENV = production

PORT = 3000

FRONTEND_URL = http://localhost:5173
```

> **참고**: `FRONTEND_URL`은 나중에 프론트엔드 배포 후 업데이트하세요.

---

## 🔧 이미 배포했는데 오류가 발생한 경우

### 방법 1: Render 설정 확인 및 수정

1. Render 대시보드에서 서비스 선택
2. **Settings** 탭 클릭
3. **Build & Deploy** 섹션 확인:
   - Root Directory: `server` ✅
   - Build Command: `npm install` ✅
   - Start Command: `npm start` ✅ (NOT `node server.js`)

4. 잘못되어 있다면 수정 후 **Save Changes**
5. **Manual Deploy** → **Deploy latest commit** 클릭

### 방법 2: Git 푸시 후 재배포

코드를 수정했으므로 GitHub에 푸시하세요:

```bash
git add .
git commit -m "fix: Add engines field to package.json for Render deployment"
git push
```

Render가 자동으로 새로운 배포를 시작합니다.

---

## ✅ 배포 확인

배포가 성공하면:

1. **Logs** 탭에서 다음과 같은 메시지를 확인:
```
🚀 서버가 포트 3000에서 실행 중입니다.
✅ 데이터베이스에 연결되었습니다.
```

2. 브라우저에서 접속:
```
https://order-app-backend.onrender.com/
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

3. API 테스트:
```
https://order-app-backend.onrender.com/api/menus
```

---

## 🐛 여전히 문제가 있나요?

### 일반적인 문제들

#### 1. "Cannot find module" 오류
- ✅ Root Directory가 `server`로 설정되었는지 확인
- ✅ Start Command가 `npm start`인지 확인
- ✅ `package.json`의 `main` 필드가 `server.js`인지 확인

#### 2. "MODULE_NOT_FOUND" 오류
- Build Command가 `npm install`로 설정되었는지 확인
- 로그에서 의존성 설치가 완료되었는지 확인

#### 3. Database 연결 오류
- `DATABASE_URL` 환경변수가 정확한지 확인
- External Database URL (`.oregon-postgres.render.com` 포함)을 사용하는지 확인

#### 4. Port 오류
- `PORT` 환경변수를 `3000`으로 설정
- Render는 자동으로 포트를 할당하므로 `process.env.PORT`를 사용해야 함 (이미 코드에 구현됨)

---

## 📞 추가 도움

더 자세한 내용은 다음 문서를 참고하세요:
- [DEPLOYMENT.md](../../DEPLOYMENT.md) - 전체 배포 가이드
- [ENV_GUIDE.md](./ENV_GUIDE.md) - 환경변수 설정 가이드
- [Render 공식 문서](https://render.com/docs/deploy-node-express-app)

---

## 🎯 요약

**필수 Render 설정:**
```
Root Directory: server
Build Command: npm install
Start Command: npm start
```

**필수 환경변수:**
```
DATABASE_URL (Render PostgreSQL URL)
NODE_ENV = production
PORT = 3000
FRONTEND_URL (프론트엔드 URL)
```

이 설정대로 하면 정상적으로 배포됩니다! 🚀

