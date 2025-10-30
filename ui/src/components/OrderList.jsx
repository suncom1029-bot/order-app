import './OrderList.css';

function OrderList({ orders, onStatusChange }) {
  const getStatusButton = (order) => {
    switch (order.status) {
      case 'pending':
        return { text: '주문 접수', nextStatus: 'accepted' };
      case 'accepted':
        return { text: '제조 시작', nextStatus: 'preparing' };
      case 'preparing':
        return { text: '제조 완료', nextStatus: 'completed' };
      case 'completed':
        return null; // 완료된 주문은 버튼 없음
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  return (
    <div className="order-list">
      <h2 className="order-list-title">주문 현황</h2>
      {orders.length === 0 ? (
        <p className="order-list-empty">주문 내역이 없습니다</p>
      ) : (
        <div className="order-items">
          {orders.map((order) => {
            const statusButton = getStatusButton(order);
            return (
              <div key={order.id} className="order-item">
                <div className="order-item-header">
                  <span className="order-date">{formatDate(order.created_at || order.createdAt)}</span>
                </div>
                <div className="order-item-body">
                  <div className="order-item-info">
                    <span className="order-menu">
                      {Array.isArray(order.items) && order.items.map((item, idx) => (
                        <span key={idx}>
                          {item.menu_name || item.name} x {item.quantity}
                          {idx < order.items.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                    <span className="order-price">
                      {(order.total_amount || order.totalAmount)?.toLocaleString()}원
                    </span>
                  </div>
                  {statusButton && (
                    <button
                      className="order-status-btn"
                      onClick={() => onStatusChange(order.id, statusButton.nextStatus)}
                    >
                      {statusButton.text}
                    </button>
                  )}
                  {!statusButton && (
                    <span className="order-completed">완료</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrderList;

