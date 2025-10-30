# 🚀 프론트엔드 Render 배포 가이드

## 📋 배포 설정 요약

### Render Static Site 설정

| 항목 | 값 |
|------|-----|
| **Name** | `order-app-frontend` |
| **Root Directory** | `ui` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Auto-Deploy** | `Yes` |

### 환경변수

```
VITE_API_URL = https://order-app-backend-ghte.onrender.com
```

---

## 🎯 배포 단계

### 1단계: Render 대시보드

1. https://dashboard.render.com 접속
2. **New +** → **Static Site** 선택
3. GitHub 저장소 `order-app` 연결

### 2단계: 설정 입력

위의 표에 있는 설정을 정확히 입력하세요.

### 3단계: 환경변수 추가

Environment Variables 섹션에서:
- Key: `VITE_API_URL`
- Value: `https://order-app-backend-ghte.onrender.com`

### 4단계: 배포 시작

**Create Static Site** 클릭!

---

## ✅ 배포 후 확인

1. 프론트엔드 URL 접속
2. 메뉴가 정상적으로 표시되는지 확인
3. 주문 기능 테스트
4. 관리자 페이지 테스트

---

## 🔄 백엔드 CORS 업데이트

프론트엔드 배포 완료 후:

1. 백엔드 서비스 선택
2. Environment 탭에서 `FRONTEND_URL` 업데이트
3. 새 프론트엔드 URL로 변경

