// 빠른 수정 및 테스트 스크립트
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🔍 COZY 커피 주문 시스템 - 빠른 진단 및 수정');
console.log('='.repeat(60) + '\n');

// 1. .env 파일 체크
const envPath = path.join(__dirname, 'server', '.env');
console.log('📋 1단계: 환경 설정 확인');
console.log('─'.repeat(60));

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  const config = {};
  lines.forEach(line => {
    const [key, ...values] = line.split('=');
    if (key) config[key.trim()] = values.join('=').trim();
  });
  
  console.log('✅ .env 파일 존재');
  console.log(`   DB_HOST: ${config.DB_HOST || '미설정'}`);
  console.log(`   DB_PORT: ${config.DB_PORT || '미설정'}`);
  console.log(`   DB_NAME: ${config.DB_NAME || '미설정'}`);
  console.log(`   DB_USER: ${config.DB_USER || '미설정'}`);
  console.log(`   DATABASE_URL: ${config.DATABASE_URL ? '설정됨' : '미설정'}`);
  
  // 문제 진단
  console.log('\n🔍 진단:');
  if (config.DB_HOST && config.DB_HOST.includes('render.com')) {
    console.log('   ⚠️  Render 클라우드 데이터베이스 감지');
    
    if (config.DB_USER === 'postgres') {
      console.log('   ❌ DB_USER가 "postgres"로 설정되어 있습니다');
      console.log('   💡 Render의 경우 "order_app_db_asrw_user"를 사용해야 합니다');
    }
    
    if (config.DB_NAME === 'coffee_order_db') {
      console.log('   ❌ DB_NAME이 "coffee_order_db"로 설정되어 있습니다');
      console.log('   💡 Render의 경우 "order_app_db_asrw"를 사용해야 합니다');
    }
    
    if (!config.DATABASE_URL) {
      console.log('   ⚠️  DATABASE_URL을 사용하는 것을 권장합니다');
    }
    
    console.log('\n📝 해결 방법:');
    console.log('   1. Render Dashboard에서 External Database URL 확인');
    console.log('   2. server/.env 파일에 DATABASE_URL 추가:');
    console.log('      DATABASE_URL=postgresql://user:pass@host/dbname');
    console.log('   3. 기존 DB_HOST, DB_PORT 등은 주석 처리');
    
  } else if (config.DB_HOST === 'localhost') {
    console.log('   ✅ 로컬 PostgreSQL 설정');
    console.log('   💡 로컬 PostgreSQL이 실행 중인지 확인하세요');
    
    console.log('\n📝 PostgreSQL 설치 및 실행:');
    console.log('   Windows: https://www.postgresql.org/download/windows/');
    console.log('   실행 확인: services.msc에서 "postgresql" 검색');
  }
  
} else {
  console.log('❌ .env 파일이 없습니다!');
  console.log('\n📝 해결 방법:');
  console.log('   server/.env 파일을 생성하고 다음 내용을 추가하세요:');
  console.log('   (자세한 내용은 server/ENV_GUIDE.md 참조)');
}

console.log('\n' + '─'.repeat(60));

// 2. 서버 프로세스 확인
console.log('\n📋 2단계: 서버 프로세스 확인');
console.log('─'.repeat(60));

try {
  // Windows에서 포트 3000 사용 중인 프로세스 확인
  const output = execSync('netstat -ano | findstr :3000', { encoding: 'utf8' });
  if (output) {
    console.log('✅ 포트 3000에서 서버가 실행 중입니다');
  }
} catch (error) {
  console.log('⚠️  포트 3000에서 실행 중인 프로세스 없음');
  console.log('   서버를 시작하려면: cd server && npm run dev');
}

console.log('\n' + '─'.repeat(60));

// 3. 데이터베이스 연결 테스트 제안
console.log('\n📋 3단계: 다음 단계');
console.log('─'.repeat(60));
console.log('1. .env 파일 수정 (위의 진단 내용 참고)');
console.log('2. 데이터베이스 초기화: cd server && npm run init-db');
console.log('3. 서버 재시작: cd server && npm run dev');
console.log('4. 테스트 실행: node test-functions.js');
console.log('');
console.log('📄 상세 보고서: diagnostic-report.md 파일을 확인하세요');
console.log('\n' + '='.repeat(60) + '\n');

