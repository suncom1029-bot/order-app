// API 기본 URL 자동 감지
const getApiBaseUrl = () => {
  // 1. 환경변수가 설정되어 있으면 사용
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 2. 프로덕션 환경 (Render)인 경우
  if (window.location.hostname.includes('onrender.com')) {
    return 'https://order-app-backend-ghte.onrender.com';
  }
  
  // 3. 로컬 개발 환경
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

// 개발 환경에서 API URL 로깅
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

// API 호출 헬퍼 함수
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '요청 처리 중 오류가 발생했습니다.');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// 메뉴 API
export const menuAPI = {
  // 모든 메뉴 조회
  getAll: async () => {
    const response = await apiCall('/api/menus');
    return response.data;
  },

  // 특정 메뉴 조회
  getById: async (id) => {
    const response = await apiCall(`/api/menus/${id}`);
    return response.data;
  },
};

// 주문 API
export const orderAPI = {
  // 주문 생성
  create: async (orderData) => {
    const response = await apiCall('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.data;
  },

  // 특정 주문 조회
  getById: async (id) => {
    const response = await apiCall(`/api/orders/${id}`);
    return response.data;
  },
};

// 관리자 API
export const adminAPI = {
  // 대시보드 통계
  getDashboard: async () => {
    const response = await apiCall('/api/admin/dashboard');
    return response.data;
  },

  // 모든 주문 조회
  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/admin/orders${queryString ? `?${queryString}` : ''}`;
    const response = await apiCall(endpoint);
    return response;
  },

  // 주문 상태 변경
  updateOrderStatus: async (orderId, status) => {
    const response = await apiCall(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  // 재고 현황 조회
  getInventory: async () => {
    const response = await apiCall('/api/admin/inventory');
    return response.data;
  },

  // 재고 수량 변경
  updateInventory: async (menuId, stockChange) => {
    const response = await apiCall(`/api/admin/inventory/${menuId}`, {
      method: 'PATCH',
      body: JSON.stringify({ stock_change: stockChange }),
    });
    return response.data;
  },
};

