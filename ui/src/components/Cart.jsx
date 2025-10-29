import './Cart.css';

function Cart({ cartItems, onOrder, onRemoveItem, onIncreaseQuantity, onDecreaseQuantity }) {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="cart">
      <div className="cart-container">
        <h2 className="cart-title">장바구니</h2>
        
        <div className="cart-content">
          <div className="cart-left">
            {cartItems.length === 0 ? (
              <p className="cart-empty">장바구니가 비어있습니다</p>
            ) : (
              <div className="cart-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="cart-item-main">
                      <div className="cart-item-info">
                        <span className="cart-item-name">
                          {item.name}
                          {item.options.length > 0 && ` (${item.options.join(', ')})`}
                        </span>
                      </div>
                      <div className="cart-item-controls">
                        <button 
                          className="quantity-btn" 
                          onClick={() => onDecreaseQuantity(index)}
                        >
                          -
                        </button>
                        <span className="cart-item-quantity">{item.quantity}</span>
                        <button 
                          className="quantity-btn" 
                          onClick={() => onIncreaseQuantity(index)}
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-item-price">
                        {item.totalPrice.toLocaleString()}원
                      </span>
                    </div>
                    <button 
                      className="remove-btn" 
                      onClick={() => onRemoveItem(index)}
                      title="삭제"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="cart-right">
            <div className="cart-total">
              <span className="total-label">총 금액</span>
              <span className="total-amount">{totalAmount.toLocaleString()}원</span>
            </div>
            <button className="order-btn" onClick={onOrder}>
              주문하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

