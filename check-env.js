// 환경 변수 확인 스크립트
const fs = require('fs');
const path = require('path');

console.log('\n=== 환경 변수 체크 ===\n');

// .env 파일 존재 확인
const envPath = path.join(__dirname, 'server', '.env');
const envExists = fs.existsSync(envPath);

console.log(`📁 .env 파일 존재: ${envExists ? '✅ 있음' : '❌ 없음'}`);

if (envExists) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    console.log('\n📝 현재 설정된 환경 변수:');
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && key.includes('PASSWORD')) {
        console.log(`   ${key}=****** (숨김)`);
      } else {
        console.log(`   ${line}`);
      }
    });
    
    // 필수 환경 변수 체크
    console.log('\n✅ 필수 환경 변수 체크:');
    const required = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
    const envVars = Object.fromEntries(lines.map(line => line.split('=').map(s => s.trim())));
    
    required.forEach(key => {
      const exists = envVars[key];
      console.log(`   ${key}: ${exists ? '✅' : '❌'}`);
    });
    
  } catch (error) {
    console.error(`오류: ${error.message}`);
  }
} else {
  console.log('\n❌ .env 파일이 없습니다!');
  console.log('\n해결 방법:');
  console.log('1. server 디렉토리에 .env 파일을 생성하세요');
  console.log('2. 다음 내용을 입력하세요:\n');
  console.log('DB_HOST=localhost');
  console.log('DB_PORT=5432');
  console.log('DB_NAME=coffee_order_db');
  console.log('DB_USER=postgres');
  console.log('DB_PASSWORD=your_password');
  console.log('');
  console.log('PORT=3000');
  console.log('NODE_ENV=development');
  console.log('FRONTEND_URL=http://localhost:5173');
}

console.log('\n' + '='.repeat(50) + '\n');

