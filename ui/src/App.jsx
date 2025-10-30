import { useState, useEffect } from 'react';
import Header from './components/Header';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';
import { menuAPI, orderAPI, adminAPI } from './api/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('order');
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // 메뉴 및 재고 정보 로드
      const menus = await menuAPI.getAll();
      setInventory(menus.map(menu => ({
        id: menu.id,
        name: menu.name,
        stock: menu.stock
      })));

      // 주문 정보 로드
      const ordersData = await adminAPI.getOrders();
      setOrders(ordersData.data || []);
    } catch (error) {
      console.error('초기 데이터 로드 실패:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 재고 증가
  const handleIncreaseInventory = async (id) => {
    try {
      await adminAPI.updateInventory(id, 1);
      // 재고 정보 다시 로드
      const menus = await menuAPI.getAll();
      setInventory(menus.map(menu => ({
        id: menu.id,
        name: menu.name,
        stock: menu.stock
      })));
    } catch (error) {
      console.error('재고 증가 실패:', error);
      alert('재고 변경 중 오류가 발생했습니다.');
    }
  };

  // 재고 감소
  const handleDecreaseInventory = async (id) => {
    try {
      await adminAPI.updateInventory(id, -1);
      // 재고 정보 다시 로드
      const menus = await menuAPI.getAll();
      setInventory(menus.map(menu => ({
        id: menu.id,
        name: menu.name,
        stock: menu.stock
      })));
    } catch (error) {
      console.error('재고 감소 실패:', error);
      alert(error.message || '재고 변경 중 오류가 발생했습니다.');
    }
  };

  // 주문 추가
  const handleAddOrder = async (orderData) => {
    try {
      // API로 주문 생성
      const newOrder = await orderAPI.create({
        items: orderData.items.map(item => ({
          menuId: item.menuId,
          quantity: item.quantity,
          options: item.options
        }))
      });

      // 주문 및 재고 정보 다시 로드
      await loadInitialData();

      return newOrder;
    } catch (error) {
      console.error('주문 생성 실패:', error);
      throw error;
    }
  };

  // 주문 상태 변경
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      // 주문 정보 다시 로드
      const ordersData = await adminAPI.getOrders();
      setOrders(ordersData.data || []);
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert(error.message || '상태 변경 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="app">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="main-content">
          <div className="loading">
            <p>데이터를 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

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
