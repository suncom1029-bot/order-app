const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders - 새 주문 생성
router.post('/orders', orderController.createOrder);

// GET /api/orders/:id - 특정 주문 조회
router.get('/orders/:id', orderController.getOrderById);

module.exports = router;

