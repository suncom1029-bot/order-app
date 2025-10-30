const db = require('../db/database');

// 대시보드 통계 조회
const getDashboardStats = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_orders,
        COUNT(CASE WHEN status = 'preparing' THEN 1 END) as preparing_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders
      FROM orders
    `);

    res.json({
      success: true,
      data: {
        total_orders: parseInt(result.rows[0].total_orders),
        accepted_orders: parseInt(result.rows[0].accepted_orders),
        preparing_orders: parseInt(result.rows[0].preparing_orders),
        completed_orders: parseInt(result.rows[0].completed_orders)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 모든 주문 조회
const getAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT 
        o.id, o.status, o.total_amount, o.created_at, o.updated_at,
        json_agg(
          json_build_object(
            'menu_name', oi.menu_name,
            'quantity', oi.quantity,
            'options', oi.options::json
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;

    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` WHERE o.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += `
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    // 총 개수 조회
    let countQuery = 'SELECT COUNT(*) FROM orders';
    const countParams = [];
    
    if (status) {
      countQuery += ' WHERE status = $1';
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 주문 상태 변경
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 상태 유효성 검증
    const validStatuses = ['pending', 'accepted', 'preparing', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 상태입니다.'
      });
    }

    // 현재 주문 상태 조회
    const currentOrder = await db.query(
      'SELECT status FROM orders WHERE id = $1',
      [id]
    );

    if (currentOrder.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      });
    }

    const currentStatus = currentOrder.rows[0].status;

    // 상태 전환 규칙 검증
    const statusFlow = {
      'pending': ['accepted'],
      'accepted': ['preparing'],
      'preparing': ['completed'],
      'completed': []
    };

    if (!statusFlow[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        error: '잘못된 상태 전환입니다.',
        details: {
          current_status: currentStatus,
          requested_status: status
        }
      });
    }

    // 상태 업데이트
    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({
      success: true,
      data: {
        id: result.rows[0].id,
        status: result.rows[0].status,
        updated_at: result.rows[0].updated_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// 재고 현황 조회
const getInventory = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT id as menu_id, name as menu_name, stock
      FROM menus
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// 재고 수량 변경
const updateInventory = async (req, res, next) => {
  try {
    const { menu_id } = req.params;
    const { stock_change } = req.body;

    if (stock_change === undefined || stock_change === 0) {
      return res.status(400).json({
        success: false,
        error: '재고 변경량을 지정해주세요.'
      });
    }

    // 현재 재고 조회
    const currentStock = await db.query(
      'SELECT name, stock FROM menus WHERE id = $1',
      [menu_id]
    );

    if (currentStock.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.'
      });
    }

    const oldStock = currentStock.rows[0].stock;
    const newStock = oldStock + stock_change;

    // 재고가 0 미만이 되는지 확인
    if (newStock < 0) {
      return res.status(400).json({
        success: false,
        error: '재고는 0 미만이 될 수 없습니다.',
        details: {
          current_stock: oldStock,
          requested_change: stock_change
        }
      });
    }

    // 재고 업데이트
    const result = await db.query(
      'UPDATE menus SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [stock_change, menu_id]
    );

    res.json({
      success: true,
      data: {
        menu_id: result.rows[0].id,
        menu_name: result.rows[0].name,
        old_stock: oldStock,
        new_stock: result.rows[0].stock,
        updated_at: result.rows[0].updated_at
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getInventory,
  updateInventory
};

