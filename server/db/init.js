require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// DATABASE_URL 사용 여부 확인
const usesDatabaseURL = !!process.env.DATABASE_URL;

// SSL 설정 자동 감지
const isCloudDatabase = usesDatabaseURL || (process.env.DB_HOST && 
  (process.env.DB_HOST.includes('render.com') || 
   process.env.DB_HOST.includes('amazonaws.com') ||
   process.env.DB_HOST.includes('heroku') ||
   process.env.DB_SSL === 'true'));

const sslConfig = isCloudDatabase ? {
  rejectUnauthorized: false
} : false;

console.log(`🔐 SSL 연결: ${isCloudDatabase ? '활성화' : '비활성화'}`);
console.log(`📝 연결 방식: ${usesDatabaseURL ? 'DATABASE_URL' : '개별 환경변수'}`);

// PostgreSQL 연결 설정
let adminPoolConfig;
if (usesDatabaseURL) {
  // DATABASE_URL에서 postgres 데이터베이스로 연결 (로컬에서는 사용 안 함)
  adminPoolConfig = null; // 클라우드에서는 adminPool 사용 안 함
} else {
  adminPoolConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: sslConfig,
  };
}

const adminPool = adminPoolConfig ? new Pool(adminPoolConfig) : null;

async function initDatabase() {
  console.log('🚀 데이터베이스 초기화를 시작합니다...\n');

  try {
    let dbPool;

    // Render 등 클라우드 환경에서는 데이터베이스가 이미 생성되어 있음
    if (usesDatabaseURL) {
      console.log('☁️  클라우드 데이터베이스 감지 (DATABASE_URL 사용) - 기존 데이터베이스에 연결합니다\n');
      
      // 1. DATABASE_URL로 바로 연결
      console.log('1️⃣ 데이터베이스에 연결 중...');
      dbPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        },
      });
      
      console.log(`   ✅ 데이터베이스에 연결되었습니다\n`);
    } else if (isCloudDatabase) {
      console.log('☁️  클라우드 데이터베이스 감지 - 기존 데이터베이스에 연결합니다\n');
      
      // 1. 바로 제공된 데이터베이스에 연결
      console.log('1️⃣ 데이터베이스에 연결 중...');
      dbPool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: sslConfig,
      });
      
      console.log(`   ✅ 데이터베이스 '${process.env.DB_NAME}'에 연결되었습니다\n`);
    } else {
      // 로컬 환경: 데이터베이스 생성 시도
      console.log('💻 로컬 데이터베이스 - 데이터베이스를 생성합니다\n');
      
      // 1. 데이터베이스 존재 확인
      console.log('1️⃣ 데이터베이스 확인 중...');
      const dbCheckResult = await adminPool.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [process.env.DB_NAME]
      );

      if (dbCheckResult.rows.length === 0) {
        // 데이터베이스 생성
        console.log(`   ➜ 데이터베이스 '${process.env.DB_NAME}' 생성 중...`);
        await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log(`   ✅ 데이터베이스 '${process.env.DB_NAME}' 생성 완료\n`);
      } else {
        console.log(`   ✅ 데이터베이스 '${process.env.DB_NAME}'가 이미 존재합니다\n`);
      }

      // adminPool 종료
      await adminPool.end();

      // 2. 새로 생성한 데이터베이스에 연결
      console.log('2️⃣ 데이터베이스에 연결 중...');
      dbPool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: sslConfig,
      });
    }

    // 2. 스키마 파일 읽기 및 실행
    console.log('2️⃣ 스키마 파일 실행 중...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await dbPool.query(schemaSql);
    console.log('   ✅ 테이블 생성 완료');
    console.log('   ✅ 인덱스 생성 완료');
    console.log('   ✅ 트리거 생성 완료');
    console.log('   ✅ 초기 데이터 삽입 완료\n');

    // 3. 생성된 테이블 확인
    console.log('3️⃣ 생성된 테이블 확인...');
    const tablesResult = await dbPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('   📋 생성된 테이블:');
    tablesResult.rows.forEach(row => {
      console.log(`      - ${row.table_name}`);
    });

    // 4. 초기 데이터 확인
    console.log('\n4️⃣ 초기 데이터 확인...');
    
    const menusResult = await dbPool.query('SELECT COUNT(*) FROM menus');
    console.log(`   ☕ 메뉴: ${menusResult.rows[0].count}개`);

    const optionsResult = await dbPool.query('SELECT COUNT(*) FROM options');
    console.log(`   🎯 옵션: ${optionsResult.rows[0].count}개`);

    // 메뉴 목록 출력
    const menuList = await dbPool.query('SELECT id, name, price, stock FROM menus');
    console.log('\n   📋 메뉴 목록:');
    menuList.rows.forEach(menu => {
      console.log(`      ${menu.id}. ${menu.name} - ${menu.price}원 (재고: ${menu.stock}개)`);
    });

    await dbPool.end();

    console.log('\n✅ 데이터베이스 초기화가 완료되었습니다! 🎉');
    console.log(`\n📍 데이터베이스: ${process.env.DB_NAME}`);
    console.log(`📍 호스트: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`📍 사용자: ${process.env.DB_USER}\n`);

  } catch (error) {
    console.error('\n❌ 오류가 발생했습니다:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 해결방법:');
      console.error('   1. PostgreSQL 서비스가 실행 중인지 확인하세요');
      console.error('   2. .env 파일의 DB_HOST와 DB_PORT가 올바른지 확인하세요');
    } else if (error.code === '28P01') {
      console.error('\n💡 해결방법:');
      console.error('   1. .env 파일의 DB_USER와 DB_PASSWORD가 올바른지 확인하세요');
      console.error('   2. PostgreSQL 사용자 권한을 확인하세요');
    } else if (error.code === '42501') {
      console.error('\n💡 해결방법:');
      console.error('   1. PostgreSQL 사용자에게 데이터베이스 생성 권한이 있는지 확인하세요');
    }
    
    process.exit(1);
  }
}

// 실행
initDatabase();

