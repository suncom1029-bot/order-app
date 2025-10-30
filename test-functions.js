// COZY 커피 주문 시스템 - 기능 테스트 스크립트
const API_BASE_URL = `http://localhost:3000`;

let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const color = passed ? 'green' : 'red';
  log(`\n${status} - ${testName}`, color);
  if (message) {
    log(`   ${message}`, 'cyan');
  }
  testResults.tests.push({ name: testName, passed, message });
  if (passed) testResults.passed++;
  else testResults.failed++;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 서버 연결 테스트
async function testServerConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json();
    
    if (response.ok && data.message && data.message.includes('COZY')) {
      logTest('서버 연결', true, `서버가 정상적으로 응답합니다: ${data.message}`);
      return true;
    } else {
      logTest('서버 연결', false, '서버 응답이 올바르지 않습니다');
      return false;
    }
  } catch (error) {
    logTest('서버 연결', false, `서버에 연결할 수 없습니다: ${error.message}`);
    return false;
  }
}

// 메뉴 조회 테스트
async function testGetMenus() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus`);
    const data = await response.json();
    
    if (response.ok && data.success && Array.isArray(data.data)) {
      const menuCount = data.data.length;
      logTest('메뉴 조회', true, `${menuCount}개의 메뉴를 조회했습니다`);
      
      // 메뉴 상세 출력
      data.data.forEach(menu => {
        log(`   - ${menu.name}: ${menu.price}원 (재고: ${menu.stock}개)`, 'cyan');
      });
      
      return data.data;
    } else {
      logTest('메뉴 조회', false, `메뉴 조회 실패: ${JSON.stringify(data)}`);
      return null;
    }
  } catch (error) {
    logTest('메뉴 조회', false, `메뉴 조회 중 오류: ${error.message}`);
    return null;
  }
}

// 특정 메뉴 조회 테스트
async function testGetMenuById(menuId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus/${menuId}`);
    const data = await response.json();
    
    if (response.ok && data.success && data.data) {
      logTest(`메뉴 상세 조회 (ID: ${menuId})`, true, `메뉴: ${data.data.name}`);
      return data.data;
    } else {
      logTest(`메뉴 상세 조회 (ID: ${menuId})`, false, `조회 실패`);
      return null;
    }
  } catch (error) {
    logTest(`메뉴 상세 조회 (ID: ${menuId})`, false, error.message);
    return null;
  }
}

// 주문 생성 테스트
async function testCreateOrder(items) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success && data.data) {
      const order = data.data;
      logTest('주문 생성', true, 
        `주문 ID: ${order.order_id}, 총액: ${order.total_amount}원, 상태: ${order.status}`);
      
      if (order.items) {
        order.items.forEach(item => {
          log(`   - ${item.menu_name} x ${item.quantity} = ${item.total_price}원`, 'cyan');
        });
      }
      
      return order;
    } else {
      logTest('주문 생성', false, data.error || '알 수 없는 오류');
      return null;
    }
  } catch (error) {
    logTest('주문 생성', false, error.message);
    return null;
  }
}

// 관리자 대시보드 조회 테스트
async function testGetDashboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`);
    const data = await response.json();
    
    if (response.ok && data.success && data.data) {
      const stats = data.data;
      logTest('관리자 대시보드', true, 
        `총 주문: ${stats.total_orders}, ` +
        `대기: ${stats.pending_orders}, ` +
        `접수: ${stats.accepted_orders}, ` +
        `제조중: ${stats.preparing_orders}, ` +
        `완료: ${stats.completed_orders}`);
      return stats;
    } else {
      logTest('관리자 대시보드', false, '대시보드 조회 실패');
      return null;
    }
  } catch (error) {
    logTest('관리자 대시보드', false, error.message);
    return null;
  }
}

// 주문 목록 조회 테스트
async function testGetOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders`);
    const data = await response.json();
    
    if (response.ok && data.success && Array.isArray(data.data)) {
      logTest('주문 목록 조회', true, `${data.data.length}개의 주문을 조회했습니다`);
      
      // 최근 주문 5개 출력
      data.data.slice(0, 5).forEach(order => {
        log(`   - 주문 #${order.id}: ${order.status}, ${order.total_amount}원`, 'cyan');
      });
      
      return data.data;
    } else {
      logTest('주문 목록 조회', false, '주문 목록 조회 실패');
      return null;
    }
  } catch (error) {
    logTest('주문 목록 조회', false, error.message);
    return null;
  }
}

// 주문 상태 변경 테스트
async function testUpdateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      logTest(`주문 상태 변경 (ID: ${orderId})`, true, `${newStatus}로 변경됨`);
      return true;
    } else {
      logTest(`주문 상태 변경 (ID: ${orderId})`, false, data.error || '상태 변경 실패');
      return false;
    }
  } catch (error) {
    logTest(`주문 상태 변경 (ID: ${orderId})`, false, error.message);
    return false;
  }
}

// 재고 조회 테스트
async function testGetInventory() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/inventory`);
    const data = await response.json();
    
    if (response.ok && data.success && Array.isArray(data.data)) {
      logTest('재고 조회', true, `${data.data.length}개 메뉴의 재고를 조회했습니다`);
      
      data.data.forEach(item => {
        const status = item.stock > 5 ? '정상' : item.stock > 0 ? '주의' : '품절';
        log(`   - ${item.menu_name}: ${item.stock}개 (${status})`, 'cyan');
      });
      
      return data.data;
    } else {
      logTest('재고 조회', false, '재고 조회 실패');
      return null;
    }
  } catch (error) {
    logTest('재고 조회', false, error.message);
    return null;
  }
}

// 재고 변경 테스트
async function testUpdateInventory(menuId, stockChange) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/inventory/${menuId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stock_change: stockChange })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success && data.data) {
      const changeText = stockChange > 0 ? `+${stockChange}` : stockChange;
      logTest(`재고 변경 (메뉴 ID: ${menuId})`, true, 
        `${data.data.old_stock} → ${data.data.new_stock} (${changeText})`);
      return true;
    } else {
      logTest(`재고 변경 (메뉴 ID: ${menuId})`, false, data.error || '재고 변경 실패');
      return false;
    }
  } catch (error) {
    logTest(`재고 변경 (메뉴 ID: ${menuId})`, false, error.message);
    return false;
  }
}

// 전체 통합 테스트 시나리오
async function runIntegrationTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('COZY 커피 주문 시스템 - 기능 테스트', 'blue');
  log('='.repeat(60), 'blue');
  
  // 1. 서버 연결 테스트
  log('\n[1단계] 서버 연결 테스트', 'yellow');
  const serverConnected = await testServerConnection();
  if (!serverConnected) {
    log('\n서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.', 'red');
    log('실행 방법: cd server && npm run dev', 'cyan');
    return;
  }
  
  await sleep(500);
  
  // 2. 메뉴 관리 테스트
  log('\n[2단계] 메뉴 조회 테스트', 'yellow');
  const menus = await testGetMenus();
  if (!menus || menus.length === 0) {
    log('\n메뉴가 없습니다. 데이터베이스를 초기화하세요.', 'red');
    log('실행 방법: cd server && npm run init-db', 'cyan');
    return;
  }
  
  await sleep(500);
  
  // 특정 메뉴 조회
  await testGetMenuById(menus[0].id);
  await sleep(500);
  
  // 3. 주문 생성 테스트
  log('\n[3단계] 주문 생성 테스트', 'yellow');
  const orderItems = [
    {
      menu_id: menus[0].id,
      quantity: 2,
      options: ['샷 추가']
    }
  ];
  
  if (menus.length > 1) {
    orderItems.push({
      menu_id: menus[1].id,
      quantity: 1,
      options: []
    });
  }
  
  const order = await testCreateOrder(orderItems);
  await sleep(500);
  
  // 4. 관리자 기능 테스트
  log('\n[4단계] 관리자 대시보드 테스트', 'yellow');
  await testGetDashboard();
  await sleep(500);
  
  log('\n[5단계] 주문 관리 테스트', 'yellow');
  const orders = await testGetOrders();
  await sleep(500);
  
  // 주문 상태 변경
  if (order && order.order_id) {
    await testUpdateOrderStatus(order.order_id, 'accepted');
    await sleep(500);
    await testUpdateOrderStatus(order.order_id, 'preparing');
    await sleep(500);
    await testUpdateOrderStatus(order.order_id, 'completed');
    await sleep(500);
  }
  
  // 5. 재고 관리 테스트
  log('\n[6단계] 재고 관리 테스트', 'yellow');
  const inventory = await testGetInventory();
  await sleep(500);
  
  if (inventory && inventory.length > 0) {
    const testMenuId = inventory[0].menu_id;
    await testUpdateInventory(testMenuId, 5);  // 재고 증가
    await sleep(500);
    await testUpdateInventory(testMenuId, -2); // 재고 감소
    await sleep(500);
  }
  
  // 최종 재고 상태 확인
  log('\n[7단계] 최종 재고 상태 확인', 'yellow');
  await testGetInventory();
  
  // 테스트 결과 요약
  log('\n' + '='.repeat(60), 'blue');
  log('테스트 결과 요약', 'blue');
  log('='.repeat(60), 'blue');
  
  const total = testResults.passed + testResults.failed;
  const successRate = ((testResults.passed / total) * 100).toFixed(1);
  
  log(`\n총 테스트: ${total}개`, 'cyan');
  log(`✅ 통과: ${testResults.passed}개`, 'green');
  log(`❌ 실패: ${testResults.failed}개`, testResults.failed > 0 ? 'red' : 'green');
  log(`성공률: ${successRate}%\n`, successRate === '100.0' ? 'green' : 'yellow');
  
  if (testResults.failed > 0) {
    log('실패한 테스트:', 'red');
    testResults.tests
      .filter(t => !t.passed)
      .forEach(t => {
        log(`  - ${t.name}: ${t.message}`, 'red');
      });
  } else {
    log('🎉 모든 테스트가 성공적으로 완료되었습니다!', 'green');
  }
  
  log('\n' + '='.repeat(60) + '\n', 'blue');
}

// 에러 처리
process.on('unhandledRejection', (error) => {
  log(`\n처리되지 않은 오류: ${error.message}`, 'red');
  process.exit(1);
});

// 테스트 실행
runIntegrationTests().catch(error => {
  log(`\n테스트 실행 중 오류 발생: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

