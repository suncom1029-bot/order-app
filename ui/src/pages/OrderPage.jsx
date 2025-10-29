import { useState } from 'react';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import './OrderPage.css';

const MENU_DATA = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '간단한 설명...',
    image: '/americano-ice.jpg',
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '간단한 설명...',
    image: '/americano-hot.jpg',
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '간단한 설명...',
    image: '/caffe-latte.jpg',
  },
];

function OrderPage() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (menuWithOptions) => {
    const totalPrice = menuWithOptions.price + menuWithOptions.optionPrice;
    
    // 같은 메뉴와 옵션이 있는지 확인
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.id === menuWithOptions.id &&
        JSON.stringify(item.options) === JSON.stringify(menuWithOptions.options)
    );

    if (existingItemIndex !== -1) {
      // 기존 항목의 수량 증가
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      updatedCart[existingItemIndex].totalPrice += totalPrice;
      setCartItems(updatedCart);
    } else {
      // 새 항목 추가
      setCartItems([
        ...cartItems,
        {
          id: menuWithOptions.id,
          name: menuWithOptions.name,
          options: menuWithOptions.options,
          quantity: 1,
          unitPrice: totalPrice,
          totalPrice: totalPrice,
        },
      ]);
    }
  };

  const handleOrder = () => {
    // 주문 완료 후 장바구니 초기화
    setCartItems([]);
  };

  return (
    <div className="order-page">
      <div className="menu-grid">
        {MENU_DATA.map((menu) => (
          <MenuCard key={menu.id} menu={menu} onAddToCart={handleAddToCart} />
        ))}
      </div>
      
      <Cart cartItems={cartItems} onOrder={handleOrder} />
    </div>
  );
}

export default OrderPage;

