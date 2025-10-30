require('dotenv').config();
const express = require('express');
const cors = require('cors');

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정 - 여러 프론트엔드 URL 허용
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://order-app-frontend-xdek.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // origin이 없는 경우 (같은 서버에서의 요청) 허용
    if (!origin) return callback(null, true);
    
    // 허용된 origin 목록에 있으면 허용
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`⚠️ CORS 차단된 origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'COZY Coffee Order API',
    version: '1.0.0',
    endpoints: {
      menus: '/api/menus',
      orders: '/api/orders',
      admin: '/api/admin'
    }
  });
});

app.use('/api', menuRoutes);
app.use('/api', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '요청한 리소스를 찾을 수 없습니다.'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || '서버 내부 오류가 발생했습니다.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📍 API 주소: http://localhost:${PORT}`);
  console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM 시그널을 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT 시그널을 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

