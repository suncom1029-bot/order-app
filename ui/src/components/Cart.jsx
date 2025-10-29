import './Cart.css';

function Cart({ cartItems, onOrder }) {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니에 메뉴를 추가해주세요.');
      return;
    }
    
    alert(`총 ${totalAmount.toLocaleString()}원 주문이 완료되었습니다!`);
    onOrder();
  };

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
                    <div className="cart-item-info">
                      <span className="cart-item-name">
                        {item.name}
                        {item.options.length > 0 && ` (${item.options.join(', ')})`}
                      </span>
                      <span className="cart-item-quantity">X {item.quantity}</span>
                    </div>
                    <span className="cart-item-price">
                      {item.totalPrice.toLocaleString()}원
                    </span>
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
            <button className="order-btn" onClick={handleOrder}>
              주문하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

