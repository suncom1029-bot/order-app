// 배포 상태 테스트 스크립트
const FRONTEND_URL = 'https://order-app-frontend-xdek.onrender.com';
const BACKEND_URL = 'https://order-app-backend-ghte.onrender.com';

async function testDeployment() {
  console.log('🔍 배포 상태 테스트 시작...\n');

  // 1. 백엔드 API 테스트
  console.log('1️⃣ 백엔드 API 테스트...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/menus`);
    const data = await response.json();
    
    if (data.success && data.data.length > 0) {
      console.log(`✅ 백엔드 정상 작동 (메뉴 ${data.data.length}개)`);
      data.data.forEach(menu => {
        console.log(`   - ${menu.name}: ${menu.price}원 (재고: ${menu.stock})`);
      });
    } else {
      console.log('❌ 백엔드 응답 오류:', data);
    }
  } catch (error) {
    console.log('❌ 백엔드 연결 실패:', error.message);
  }

  console.log('');

  // 2. CORS 테스트
  console.log('2️⃣ CORS 설정 테스트...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/menus`, {
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    
    const corsHeader = response.headers.get('access-control-allow-origin');
    if (corsHeader === FRONTEND_URL || corsHeader === '*') {
      console.log('✅ CORS 설정 정상');
    } else {
      console.log(`⚠️ CORS 설정 확인 필요: ${corsHeader}`);
    }
  } catch (error) {
    console.log('❌ CORS 테스트 실패:', error.message);
  }

  console.log('');

  // 3. 프론트엔드 접근성 테스트
  console.log('3️⃣ 프론트엔드 접근성 테스트...');
  try {
    const response = await fetch(FRONTEND_URL);
    if (response.ok) {
      console.log('✅ 프론트엔드 정상 접근 가능');
    } else {
      console.log(`⚠️ 프론트엔드 응답 코드: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ 프론트엔드 연결 실패:', error.message);
  }

  console.log('\n🎉 테스트 완료!');
  console.log(`\n📍 사이트 URL: ${FRONTEND_URL}`);
  console.log(`📍 API URL: ${BACKEND_URL}`);
}

// Node.js 환경에서만 실행
if (typeof window === 'undefined') {
  testDeployment().catch(console.error);
}

