# 🔧 Render 배포 문제 해결 가이드

## 🐛 발견된 문제

배포된 사이트(https://order-app-frontend-xdek.onrender.com)에서 다음 오류가 발생했습니다:

1. **API 연결 실패**: 프론트엔드가 `http://localhost:3000`으로 API 호출
2. **CORS 오류**: 백엔드가 프론트엔드 URL을 허용하지 않음

---

## ✅ 적용된 수정사항

### 1. 백엔드 CORS 설정 개선 (`server/server.js`)

**변경 전:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

**변경 후:**
```javascript
// 여러 프론트엔드 URL 자동 허용
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://order-app-frontend-xdek.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`⚠️ CORS 차단된 origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

✨ **효과**: 
- 로컬 개발 환경과 Render 프로덕션 환경 모두 지원
- 추가 프론트엔드 URL 쉽게 추가 가능

---

### 2. 프론트엔드 API URL 자동 감지 (`ui/src/api/api.js`)

**변경 전:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

**변경 후:**
```javascript
const getApiBaseUrl = () => {
  // 1. 환경변수가 설정되어 있으면 사용
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 2. 프로덕션 환경 (Render)인 경우 자동 감지
  if (window.location.hostname.includes('onrender.com')) {
    return 'https://order-app-backend-ghte.onrender.com';
  }
  
  // 3. 로컬 개발 환경
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();
```

✨ **효과**: 
- 환경변수 없이도 자동으로 올바른 API URL 사용
- 로컬/프로덕션 환경 자동 전환

---

## 🚀 배포 방법

### 자동 배포 (Git Push)

```bash
git add .
git commit -m "fix: Improve CORS and API URL auto-detection for Render deployment"
git push
```

Render가 자동으로 재배포를 시작합니다.

---

## ✅ 배포 확인

### 1. 백엔드 재배포 확인

Render 대시보드 → **order-app-backend** → **Events** 탭에서 배포 완료 확인

### 2. 프론트엔드 재배포 확인

Render 대시보드 → **order-app-frontend-xdek** → **Events** 탭에서 배포 완료 확인

### 3. 기능 테스트

✅ **주문 페이지** (https://order-app-frontend-xdek.onrender.com)
- [ ] 메뉴 3개 정상 표시 (아메리카노 ICE/HOT, 카페라떼)
- [ ] 장바구니 추가 기능
- [ ] 옵션 추가 기능 (샷 추가, 시럽 추가)
- [ ] 주문하기 기능

✅ **관리자 페이지** (https://order-app-frontend-xdek.onrender.com/admin)
- [ ] 대시보드 통계 표시
- [ ] 재고 현황 표시 (각 메뉴별 재고 10개)
- [ ] 주문 목록 표시
- [ ] 주문 상태 변경 기능
- [ ] 재고 증감 기능 (+/-)

---

## 🧪 테스트 스크립트

배포 후 다음 명령으로 API 연결을 테스트할 수 있습니다:

```bash
node test-deployment.js
```

---

## 🔧 추가 설정 (선택사항)

환경변수를 명시적으로 설정하고 싶다면:

### 백엔드 환경변수

Render 대시보드 → **order-app-backend** → **Environment**:

```
FRONTEND_URL = https://order-app-frontend-xdek.onrender.com
```

### 프론트엔드 환경변수

Render 대시보드 → **order-app-frontend-xdek** → **Environment**:

```
VITE_API_URL = https://order-app-backend-ghte.onrender.com
```

> **참고**: 코드 수정으로 자동 감지가 되므로 이 설정은 선택사항입니다.

---

## 📊 배포 후 예상 결과

### 정상 동작 시:

1. **주문 페이지**
   - 메뉴 카드 3개 표시
   - 각 메뉴에 이미지, 이름, 가격, 재고 표시
   - 장바구니 정상 작동

2. **관리자 페이지**
   - 대시보드에 통계 표시 (초기에는 모두 0)
   - 재고 현황에 메뉴 3개와 각각 재고 10개 표시
   - 재고 +/- 버튼 작동

---

## 🐛 문제 해결

### 여전히 CORS 오류가 발생하는 경우

1. 백엔드 로그에서 차단된 origin 확인:
```
⚠️ CORS 차단된 origin: https://your-frontend-url
```

2. `server/server.js`의 `allowedOrigins` 배열에 해당 URL 추가

3. Git에 커밋 및 푸시

### 프론트엔드에서 여전히 localhost로 요청하는 경우

1. 브라우저 개발자 도구(F12) → Console 탭에서 로그 확인
2. 캐시 삭제 후 Hard Refresh (Ctrl + Shift + R)
3. Render에서 **Clear build cache & deploy** 실행

---

## 📞 지원

문제가 지속되면:
1. Render 로그 확인 (Logs 탭)
2. 브라우저 Console 오류 메시지 확인
3. Network 탭에서 API 요청 URL 확인

---

**수정 일시**: 2025-10-30
**수정자**: AI Assistant
**테스트 상태**: 코드 수정 완료, 배포 대기 중

