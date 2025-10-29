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

function OrderPage({ inventory, onAddOrder }) {
  const [cartItems, setCartItems] = useState([]);

  // 재고 확인 함수
  const getAvailableStock = (menuId) => {
    const inventoryItem = inventory.find((item) => item.id === menuId);
    if (!inventoryItem) return 0;

    // 장바구니에 담긴 수량 계산
    const cartQuantity = cartItems
      .filter((item) => item.id === menuId)
      .reduce((sum, item) => sum + item.quantity, 0);

    return inventoryItem.stock - cartQuantity;
  };

  const handleAddToCart = (menuWithOptions) => {
    // 재고 확인
    const availableStock = getAvailableStock(menuWithOptions.id);
    if (availableStock <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

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

  // 장바구니에서 항목 삭제
  const handleRemoveItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 장바구니 수량 증가
  const handleIncreaseQuantity = (index) => {
    const item = cartItems[index];
    const availableStock = getAvailableStock(item.id);
    
    if (availableStock <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    setCartItems((prev) =>
      prev.map((cartItem, i) =>
        i === index
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              totalPrice: cartItem.totalPrice + cartItem.unitPrice,
            }
          : cartItem
      )
    );
  };

  // 장바구니 수량 감소
  const handleDecreaseQuantity = (index) => {
    const item = cartItems[index];
    
    if (item.quantity === 1) {
      handleRemoveItem(index);
      return;
    }

    setCartItems((prev) =>
      prev.map((cartItem, i) =>
        i === index
          ? {
              ...cartItem,
              quantity: cartItem.quantity - 1,
              totalPrice: cartItem.totalPrice - cartItem.unitPrice,
            }
          : cartItem
      )
    );
  };

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니에 메뉴를 추가해주세요.');
      return;
    }

    // 주문 데이터 생성
    const orderData = {
      items: cartItems.map((item) => ({
        menuId: item.id,
        name: item.name,
        quantity: item.quantity,
        options: item.options,
      })),
      totalAmount: cartItems.reduce((sum, item) => sum + item.totalPrice, 0),
    };

    // 주문 추가
    onAddOrder(orderData);

    // 장바구니 초기화
    setCartItems([]);
    
    alert('주문이 완료되었습니다!');
  };

  // 메뉴 데이터와 재고 정보 결합
  const menusWithStock = MENU_DATA.map((menu) => ({
    ...menu,
    stock: inventory.find((item) => item.id === menu.id)?.stock || 0,
  }));

  return (
    <div className="order-page">
      <div className="menu-grid">
        {menusWithStock.map((menu) => (
          <MenuCard 
            key={menu.id} 
            menu={menu} 
            onAddToCart={handleAddToCart}
            availableStock={getAvailableStock(menu.id)}
          />
        ))}
      </div>
      
      <Cart 
        cartItems={cartItems} 
        onOrder={handleOrder}
        onRemoveItem={handleRemoveItem}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
      />
    </div>
  );
}

export default OrderPage;

