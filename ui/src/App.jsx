import { useState, useEffect } from 'react';
import Header from './components/Header';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';
import './App.css';

// 초기 재고 데이터
const INITIAL_INVENTORY = [
  { id: 1, name: '아메리카노(ICE)', stock: 10 },
  { id: 2, name: '아메리카노(HOT)', stock: 10 },
  { id: 3, name: '카페라떼', stock: 10 },
];

function App() {
  const [activeTab, setActiveTab] = useState('order');
  
  // localStorage에서 초기 데이터 로드
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });
  
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  // 데이터 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // 재고 증가
  const handleIncreaseInventory = (id) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: item.stock + 1 } : item
      )
    );
  };

  // 재고 감소
  const handleDecreaseInventory = (id) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id && item.stock > 0
          ? { ...item, stock: item.stock - 1 }
          : item
      )
    );
  };

  // 주문 추가
  const handleAddOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'pending',
    };

    // 주문 추가
    setOrders((prev) => [newOrder, ...prev]);

    // 재고 감소
    orderData.items.forEach((item) => {
      const menuId = item.menuId;
      setInventory((prev) =>
        prev.map((inv) =>
          inv.id === menuId
            ? { ...inv, stock: Math.max(0, inv.stock - item.quantity) }
            : inv
        )
      );
    });

    return newOrder;
  };

  // 주문 상태 변경
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'order' && (
          <OrderPage 
            inventory={inventory}
            onAddOrder={handleAddOrder}
          />
        )}
        {activeTab === 'admin' && (
          <AdminPage 
            inventory={inventory}
            orders={orders}
            onIncreaseInventory={handleIncreaseInventory}
            onDecreaseInventory={handleDecreaseInventory}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
    </div>
  );
}

export default App;
