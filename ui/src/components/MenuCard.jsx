import { useState } from 'react';
import './MenuCard.css';

function MenuCard({ menu, onAddToCart }) {
  const [shotAdded, setShotAdded] = useState(false);
  const [syrupAdded, setSyrupAdded] = useState(false);

  const handleAddToCart = () => {
    const options = [];
    if (shotAdded) options.push('샷 추가');
    if (syrupAdded) options.push('시럽 추가');

    onAddToCart({
      ...menu,
      options,
      optionPrice: shotAdded ? 500 : 0,
    });

    // 옵션 초기화
    setShotAdded(false);
    setSyrupAdded(false);
  };

  return (
    <div className="menu-card">
      <div className="menu-image">
        <img src={menu.image} alt={menu.name} />
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{menu.price.toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>
      </div>
      <div className="menu-options">
        <label className="option-label">
          <input
            type="checkbox"
            checked={shotAdded}
            onChange={(e) => setShotAdded(e.target.checked)}
          />
          <span>샷 추가 (+500원)</span>
        </label>
        <label className="option-label">
          <input
            type="checkbox"
            checked={syrupAdded}
            onChange={(e) => setSyrupAdded(e.target.checked)}
          />
          <span>시럽 추가 (+0원)</span>
        </label>
      </div>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        담기
      </button>
    </div>
  );
}

export default MenuCard;

