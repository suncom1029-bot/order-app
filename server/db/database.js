const { Pool } = require('pg');

// DATABASE_URL이 있으면 우선 사용 (Render, Heroku 등)
let poolConfig;

if (process.env.DATABASE_URL) {
  // DATABASE_URL 사용 (클라우드 환경)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
} else {
  // 개별 환경변수 사용 (로컬 환경)
  const isCloudDatabase = process.env.DB_HOST && 
    (process.env.DB_HOST.includes('render.com') || 
     process.env.DB_HOST.includes('amazonaws.com') ||
     process.env.DB_HOST.includes('heroku') ||
     process.env.DB_SSL === 'true');

  const sslConfig = isCloudDatabase ? {
    rejectUnauthorized: false
  } : false;

  poolConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: sslConfig,
  };
}

// PostgreSQL 연결 풀 생성
const pool = new Pool(poolConfig);

// 연결 테스트
pool.on('connect', () => {
  console.log('✅ 데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('❌ 데이터베이스 연결 오류:', err);
});

// 쿼리 헬퍼 함수
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Query Error:', error);
    throw error;
  }
};

// 트랜잭션 헬퍼 함수
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);
  
  // 트랜잭션 시작/커밋/롤백 메서드 추가
  client.query = (...args) => {
    return query(...args);
  };
  
  client.release = () => {
    return release();
  };
  
  return client;
};

module.exports = {
  query,
  getClient,
  pool
};

