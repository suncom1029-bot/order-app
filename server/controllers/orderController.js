const db = require('../db/database');

// 새 주문 생성
const createOrder = async (req, res, next) => {
  const client = await db.getClient();
  
  try {
    const { items } = req.body;

    // 입력 검증
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: '주문 항목이 비어있습니다.'
      });
    }

    await client.query('BEGIN');

    // 1. 재고 확인 및 잠금
    const menuIds = items.map(item => item.menuId);
    const stockCheck = await client.query(
      'SELECT id, name, price, stock FROM menus WHERE id = ANY($1) FOR UPDATE',
      [menuIds]
    );

    const menuMap = {};
    stockCheck.rows.forEach(menu => {
      menuMap[menu.id] = menu;
    });

    // 재고 부족 확인
    for (const item of items) {
      const menu = menuMap[item.menuId];
      if (!menu) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: '존재하지 않는 메뉴입니다.',
          details: { menu_id: item.menuId }
        });
      }

      if (menu.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: '재고가 부족합니다.',
          details: {
            menu_name: menu.name,
            requested: item.quantity,
            available: menu.stock
          }
        });
      }
    }

    // 2. 총 금액 계산
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menu = menuMap[item.menuId];
      let unitPrice = menu.price;

      // 옵션 가격 추가
      if (item.options && item.options.length > 0) {
        const optionPrices = await client.query(
          'SELECT name, price FROM options WHERE name = ANY($1)',
          [item.options]
        );
        
        optionPrices.rows.forEach(option => {
          unitPrice += option.price;
        });
      }

      const itemTotal = unitPrice * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuId: item.menuId,
        menuName: menu.name,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
        options: item.options || []
      });
    }

    // 3. 주문 생성
    const orderResult = await client.query(
      'INSERT INTO orders (status, total_amount) VALUES ($1, $2) RETURNING *',
      ['pending', totalAmount]
    );

    const orderId = orderResult.rows[0].id;

    // 4. 주문 항목 생성
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items 
         (order_id, menu_id, menu_name, quantity, unit_price, total_price, options) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          orderId,
          item.menuId,
          item.menuName,
          item.quantity,
          item.unitPrice,
          item.totalPrice,
          JSON.stringify(item.options)
        ]
      );
    }

    // 5. 재고 감소
    for (const item of items) {
      await client.query(
        'UPDATE menus SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.menuId]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: {
        order_id: orderId,
        status: 'pending',
        total_amount: totalAmount,
        items: orderItems,
        created_at: orderResult.rows[0].created_at
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// 특정 주문 조회
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 주문 정보 조회
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      });
    }

    // 주문 항목 조회
    const itemsResult = await db.query(
      `SELECT id, menu_id, menu_name, quantity, unit_price, total_price, options 
       FROM order_items 
       WHERE order_id = $1`,
      [id]
    );

    const order = orderResult.rows[0];
    order.items = itemsResult.rows.map(item => ({
      ...item,
      options: JSON.parse(item.options || '[]')
    }));

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById
};

