import Dashboard from '../components/Dashboard';
import InventoryCard from '../components/InventoryCard';
import OrderList from '../components/OrderList';
import './AdminPage.css';

function AdminPage({ inventory, orders, onIncreaseInventory, onDecreaseInventory, onStatusChange }) {
  // 대시보드 통계 계산
  const stats = {
    total: orders.length,
    accepted: orders.filter((o) => o.status === 'accepted').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div className="admin-page">
      <Dashboard stats={stats} />

      <div className="inventory-section">
        <h2 className="section-title">재고 현황</h2>
        <div className="inventory-grid">
          {inventory.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onIncrease={onIncreaseInventory}
              onDecrease={onDecreaseInventory}
            />
          ))}
        </div>
      </div>

      <OrderList orders={orders} onStatusChange={onStatusChange} />
    </div>
  );
}

export default AdminPage;

