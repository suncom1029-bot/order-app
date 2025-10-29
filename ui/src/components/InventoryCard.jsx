import './InventoryCard.css';

function InventoryCard({ item, onIncrease, onDecrease }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', className: 'out-of-stock' };
    if (stock < 5) return { text: '주의', className: 'warning' };
    return { text: '정상', className: 'normal' };
  };

  const status = getStockStatus(item.stock);

  return (
    <div className="inventory-card">
      <h3 className="inventory-name">{item.name}</h3>
      <div className="inventory-info">
        <span className="inventory-stock">{item.stock}개</span>
        <span className={`inventory-status ${status.className}`}>
          {status.text}
        </span>
      </div>
      <div className="inventory-controls">
        <button
          className="inventory-btn decrease"
          onClick={() => onDecrease(item.id)}
          disabled={item.stock === 0}
        >
          -
        </button>
        <button
          className="inventory-btn increase"
          onClick={() => onIncrease(item.id)}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default InventoryCard;

