const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET /api/admin/dashboard - 대시보드 통계 조회
router.get('/dashboard', adminController.getDashboardStats);

// GET /api/admin/orders - 모든 주문 조회
router.get('/orders', adminController.getAllOrders);

// PATCH /api/admin/orders/:id/status - 주문 상태 변경
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// GET /api/admin/inventory - 재고 현황 조회
router.get('/inventory', adminController.getInventory);

// PATCH /api/admin/inventory/:menu_id - 재고 수량 변경
router.patch('/inventory/:menu_id', adminController.updateInventory);

module.exports = router;

