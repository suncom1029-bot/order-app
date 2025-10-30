const db = require('../db/database');

// 모든 메뉴 조회
const getAllMenus = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM menus ORDER BY id ASC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// 특정 메뉴 조회
const getMenuById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM menus WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMenus,
  getMenuById
};

