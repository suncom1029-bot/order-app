const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// GET /api/menus - 메뉴 목록 조회
router.get('/menus', menuController.getAllMenus);

// GET /api/menus/:id - 특정 메뉴 조회
router.get('/menus/:id', menuController.getMenuById);

module.exports = router;

