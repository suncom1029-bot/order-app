require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function updateImagePaths() {
  try {
    console.log('🔄 이미지 경로를 업데이트하는 중...');
    
    const result = await pool.query(`
      UPDATE menus 
      SET image_url = REPLACE(image_url, '/images/', '/') 
      WHERE image_url LIKE '/images/%'
    `);
    
    console.log(`✅ ${result.rowCount}개의 메뉴 이미지 경로가 업데이트되었습니다.`);
    
    // 업데이트된 데이터 확인
    const checkResult = await pool.query('SELECT id, name, image_url FROM menus');
    console.log('\n📋 현재 메뉴 목록:');
    checkResult.rows.forEach(menu => {
      console.log(`   ${menu.id}. ${menu.name} - ${menu.image_url}`);
    });
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
  } finally {
    await pool.end();
  }
}

updateImagePaths();

