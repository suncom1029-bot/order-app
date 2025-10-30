require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL 연결 (데이터베이스 없이 postgres에 연결)
const adminPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: 'postgres', // 기본 데이터베이스
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function initDatabase() {
  console.log('🚀 데이터베이스 초기화를 시작합니다...\n');

  try {
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
    const dbPool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // 3. 스키마 파일 읽기 및 실행
    console.log('3️⃣ 스키마 파일 실행 중...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await dbPool.query(schemaSql);
    console.log('   ✅ 테이블 생성 완료');
    console.log('   ✅ 인덱스 생성 완료');
    console.log('   ✅ 트리거 생성 완료');
    console.log('   ✅ 초기 데이터 삽입 완료\n');

    // 4. 생성된 테이블 확인
    console.log('4️⃣ 생성된 테이블 확인...');
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

    // 5. 초기 데이터 확인
    console.log('\n5️⃣ 초기 데이터 확인...');
    
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

