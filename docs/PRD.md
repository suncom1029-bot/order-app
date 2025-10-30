# 커피 주문 앱

## 1. 프로젝트 개용

### 1.1 프로젝트명
커피 주문 앱

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

### 1.3 개발 범위
- 주문하기 화면(메뉴 선택 및 장바구니 가능)
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- 프런트엔드 : HTML, CSS, 리엑트, 자바스크립트 
- 백엔드 : Node.js, Express
- 데이터베이스 : PostgreSQL

## 3. 기본 사항
- 프런트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목저이므로 사용자 인증이나 결재 기능은 제외
- 메뉴는 커피 메뉴만 있음

## 4. 프런트엔드 UI 상세 명세

### 4.1 주문하기 화면

#### 4.1.1 화면 개요
고객이 커피 메뉴를 선택하고 옵션을 추가하여 주문할 수 있는 메인 화면

#### 4.1.2 화면 구성 요소

##### 헤더 영역
- **브랜드명**: "COZY" 로고 좌측 상단 표시
- **네비게이션 탭**: 
  - "주문하기" 버튼 (현재 화면)
  - "관리자" 버튼 (관리자 화면으로 이동)

##### 메뉴 카드 영역
메뉴는 그리드 형식으로 3개씩 배열되며, 각 메뉴 카드는 다음 요소를 포함:

**메뉴 카드 구성**:
1. **상품 이미지 영역**
   - placeholder 이미지 또는 실제 메뉴 이미지 표시
   - 고정된 비율 유지

2. **메뉴 정보**
   - 메뉴명 (예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼")
   - 기본 가격 (예: "4,000원", "5,000원")
   - 간단한 설명 (예: "간단한 설명...")

3. **옵션 선택 영역**
   - 샷 추가 체크박스: "샷 추가 (+500원)"
   - 시럽 추가 체크박스: "시럽 추가 (+0원)"
   - 체크박스는 다중 선택 가능

4. **담기 버튼**
   - 메뉴를 장바구니에 추가하는 버튼
   - 버튼 레이블: "담기"

**초기 메뉴 데이터**:
- 아메리카노(ICE): 4,000원
- 아메리카노(HOT): 4,000원
- 카페라떼: 5,000원

##### 장바구니 영역
화면 하단에 고정 표시되는 장바구니 섹션:

1. **장바구니 제목**
   - "장바구니" 텍스트 표시

2. **주문 내역 리스트**
   - 선택한 메뉴명 (옵션 표시 포함)
   - 수량 (예: "X 1", "X 2")
   - 개별 금액 (예: "4,500원", "8,000원")
   - 옵션이 있는 경우 메뉴명 옆에 표시 (예: "아메리카노(ICE) (샷 추가)")

3. **총 금액 표시**
   - "총 금액" 레이블
   - 전체 주문 금액 (예: "12,500원")
   - 우측 정렬, 강조 표시

4. **주문하기 버튼**
   - 주문을 완료하는 버튼
   - 버튼 레이블: "주문하기"

#### 4.1.3 기능 명세

##### F1. 메뉴 선택
- **설명**: 사용자가 메뉴 카드에서 원하는 커피를 선택
- **입력**: 메뉴 카드의 "담기" 버튼 클릭
- **처리**:
  1. 선택한 옵션 확인 (샷 추가, 시럽 추가)
  2. 옵션에 따른 최종 가격 계산
  3. 장바구니에 해당 메뉴 추가
  4. 총 금액 업데이트
- **출력**: 장바구니 영역에 선택한 메뉴 추가 표시

##### F2. 옵션 선택
- **설명**: 메뉴에 추가 옵션을 선택
- **입력**: 체크박스 선택/해제
- **옵션 종류**:
  - 샷 추가: +500원
  - 시럽 추가: +0원 (무료)
- **처리**: 체크박스 상태 토글
- **출력**: 체크박스 선택 상태 변경

##### F3. 장바구니 관리
- **설명**: 장바구니에 담긴 메뉴 확인
- **표시 정보**:
  - 각 주문 항목의 메뉴명, 옵션, 수량, 금액
  - 전체 주문의 총 금액
- **계산 로직**:
  - 개별 메뉴 금액 = 기본 가격 + 옵션 가격
  - 총 금액 = Σ(개별 메뉴 금액 × 수량)

##### F4. 주문 완료
- **설명**: 장바구니의 메뉴를 주문으로 제출
- **입력**: "주문하기" 버튼 클릭
- **전제 조건**: 장바구니에 1개 이상의 메뉴 존재
- **처리**:
  1. 장바구니 데이터를 백엔드 API로 전송
  2. 주문 생성 요청
  3. 주문 번호 및 상태 수신
- **출력**: 
  - 성공 시: 주문 완료 메시지, 장바구니 초기화
  - 실패 시: 오류 메시지 표시

##### F5. 화면 전환
- **설명**: 네비게이션 탭을 통한 화면 이동
- **입력**: "주문하기" 또는 "관리자" 버튼 클릭
- **처리**: 해당 화면으로 라우팅
- **출력**: 선택한 화면 표시

#### 4.1.4 UI/UX 고려사항

1. **반응형 디자인**
   - 메뉴 카드는 화면 크기에 따라 그리드 레이아웃 조정
   - 모바일: 1열, 태블릿: 2열, 데스크톱: 3열

2. **사용자 피드백**
   - "담기" 버튼 클릭 시 시각적 피드백 (애니메이션 또는 색상 변경)
   - 장바구니에 항목 추가 시 부드러운 전환 효과

3. **접근성**
   - 모든 버튼과 체크박스는 키보드 네비게이션 지원
   - 명확한 레이블과 충분한 클릭 영역

4. **오류 처리**
   - 빈 장바구니로 주문 시도 시 안내 메시지 표시
   - API 통신 실패 시 사용자 친화적인 오류 메시지

#### 4.1.5 API 연동

##### 메뉴 조회 API
- **Endpoint**: `GET /api/menus`
- **응답 데이터**:
```json
[
  {
    "id": 1,
    "name": "아메리카노(ICE)",
    "price": 4000,
    "description": "간단한 설명",
    "image_url": "/images/americano-ice.jpg"
  },
  ...
]
```

##### 주문 생성 API
- **Endpoint**: `POST /api/orders`
- **요청 데이터**:
```json
{
  "items": [
    {
      "menu_id": 1,
      "quantity": 1,
      "options": ["샷 추가"]
    },
    ...
  ],
  "total_amount": 12500
}
```
- **응답 데이터**:
```json
{
  "order_id": 1,
  "status": "pending",
  "created_at": "2025-10-29T10:30:00Z"
}
```

#### 4.1.6 상태 관리
- 메뉴 목록 상태
- 장바구니 상태 (선택한 메뉴 및 옵션)
- 총 금액 상태
- 로딩 상태 (API 통신 중)
- 오류 상태

### 4.2 관리자 화면

#### 4.2.1 화면 개요
관리자가 주문 상태를 관리하고 메뉴 재고를 관리할 수 있는 관리 화면

#### 4.2.2 화면 구성 요소

##### 헤더 영역
- **브랜드명**: "COZY" 로고 좌측 상단 표시
- **네비게이션 탭**: 
  - "주문하기" 버튼 (주문하기 화면으로 이동)
  - "관리자" 버튼 (현재 화면)

##### 관리자 대시보드 영역
주문 현황을 한눈에 파악할 수 있는 요약 정보:

1. **대시보드 제목**
   - "관리자 대시보드" 텍스트 표시

2. **주문 통계 표시**
   - 총 주문: 전체 주문 수 (예: "총 주문 1")
   - 주문 접수: 접수된 주문 수 (예: "주문 접수 1")
   - 제조 중: 제조 중인 주문 수 (예: "제조 중 0")
   - 제조 완료: 완료된 주문 수 (예: "제조 완료 0")
   - 통계는 실시간으로 업데이트

##### 재고 현황 영역
메뉴별 재고 수량을 확인하고 조정할 수 있는 섹션:

1. **재고 현황 제목**
   - "재고 현황" 텍스트 표시

2. **재고 카드 구성**
   각 메뉴당 하나의 재고 카드를 표시하며, 그리드 형식으로 3개씩 배열:
   
   - 메뉴명 (예: "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼")
   - 현재 재고 수량 (예: "10개")
   - 증가/감소 버튼:
     * "+" 버튼: 재고 1개 증가
     * "-" 버튼: 재고 1개 감소

3. **초기 재고 수량**
   - 모든 메뉴: 10개

##### 주문 현황 영역
접수된 주문 목록과 상태를 관리하는 섹션:

1. **주문 현황 제목**
   - "주문 현황" 텍스트 표시

2. **주문 리스트**
   각 주문 항목은 다음 정보를 포함:
   
   - **주문 시간**: 주문 접수 일시 (예: "7월 31일 13:00")
   - **주문 내역**: 메뉴명 x 수량 (예: "아메리카노(ICE) x 1")
   - **주문 금액**: 해당 주문의 총액 (예: "4,000원")
   - **상태 변경 버튼**: 
     * 주문 접수 상태: "주문 접수" 버튼 표시
     * 버튼 클릭 시 다음 상태로 변경

3. **주문 표시 형식**
   - 최신 주문이 상단에 표시 (역순 정렬)
   - 스크롤 가능한 리스트 형태

#### 4.2.3 기능 명세

##### F1. 대시보드 통계 조회
- **설명**: 주문 상태별 통계를 실시간으로 표시
- **입력**: 화면 진입 또는 주기적 갱신
- **처리**:
  1. 백엔드 API에서 주문 통계 데이터 조회
  2. 상태별 주문 수 계산
  3. 대시보드에 표시
- **출력**: 
  - 총 주문 수
  - 주문 접수 수
  - 제조 중 수
  - 제조 완료 수

##### F2. 재고 조회
- **설명**: 모든 메뉴의 현재 재고 수량 표시
- **입력**: 화면 진입
- **처리**: 백엔드 API에서 재고 정보 조회
- **출력**: 메뉴별 재고 수량 표시

##### F3. 재고 증가
- **설명**: 특정 메뉴의 재고를 1개 증가
- **입력**: "+" 버튼 클릭
- **처리**:
  1. 해당 메뉴의 재고 수량 +1
  2. 백엔드 API로 재고 업데이트 요청
  3. 성공 시 화면 갱신
- **출력**: 
  - 성공 시: 증가된 재고 수량 표시
  - 실패 시: 오류 메시지 표시
- **제약사항**: 최대 재고 제한 (예: 100개) 고려 가능

##### F4. 재고 감소
- **설명**: 특정 메뉴의 재고를 1개 감소
- **입력**: "-" 버튼 클릭
- **처리**:
  1. 해당 메뉴의 재고 수량 -1
  2. 백엔드 API로 재고 업데이트 요청
  3. 성공 시 화면 갱신
- **출력**: 
  - 성공 시: 감소된 재고 수량 표시
  - 실패 시: 오류 메시지 표시
- **제약사항**: 재고가 0인 경우 감소 불가

##### F5. 주문 목록 조회
- **설명**: 모든 주문 내역을 시간순으로 표시
- **입력**: 화면 진입 또는 주기적 갱신
- **처리**:
  1. 백엔드 API에서 주문 목록 조회
  2. 최신순으로 정렬
  3. 주문 정보 표시
- **출력**: 주문 시간, 내역, 금액, 상태별 버튼

##### F6. 주문 상태 변경
- **설명**: 주문의 상태를 다음 단계로 변경
- **입력**: 상태 변경 버튼 클릭
- **상태 흐름**:
  1. pending (주문 접수 대기) → "주문 접수" 버튼
  2. accepted (주문 접수) → "제조 시작" 버튼
  3. preparing (제조 중) → "제조 완료" 버튼
  4. completed (제조 완료) → 버튼 없음 (최종 상태)
- **처리**:
  1. 해당 주문의 상태를 다음 단계로 변경
  2. 백엔드 API로 상태 업데이트 요청
  3. 성공 시 대시보드 통계 및 주문 목록 갱신
- **출력**:
  - 성공 시: 변경된 상태 및 버튼 표시
  - 실패 시: 오류 메시지 표시

##### F7. 실시간 데이터 갱신
- **설명**: 주문 및 재고 정보를 주기적으로 업데이트
- **입력**: 자동 (타이머 기반 또는 WebSocket)
- **갱신 주기**: 5-10초 간격 (설정 가능)
- **처리**: 
  1. 대시보드 통계 갱신
  2. 주문 목록 갱신
  3. 재고 현황 갱신
- **출력**: 최신 데이터 반영

##### F8. 화면 전환
- **설명**: 네비게이션 탭을 통한 화면 이동
- **입력**: "주문하기" 또는 "관리자" 버튼 클릭
- **처리**: 해당 화면으로 라우팅
- **출력**: 선택한 화면 표시

#### 4.2.4 UI/UX 고려사항

1. **실시간 업데이트**
   - 새로운 주문 접수 시 시각적 알림 (배지, 색상 변경 등)
   - 부드러운 화면 전환 효과

2. **반응형 디자인**
   - 재고 카드는 화면 크기에 따라 그리드 레이아웃 조정
   - 모바일: 1열, 태블릿: 2열, 데스크톱: 3열

3. **사용자 피드백**
   - 버튼 클릭 시 즉각적인 시각적 피드백
   - 재고 변경 시 애니메이션 효과
   - 상태 변경 시 확인 메시지 (옵션)

4. **접근성**
   - 모든 버튼은 키보드 네비게이션 지원
   - 명확한 레이블과 충분한 클릭 영역
   - 색상만으로 정보를 전달하지 않음 (텍스트 병기)

5. **오류 처리**
   - API 통신 실패 시 재시도 옵션 제공
   - 재고 0 이하로 감소 시도 시 안내 메시지
   - 네트워크 오류 시 사용자 친화적인 메시지

6. **성능 최적화**
   - 주문 목록이 많을 경우 페이지네이션 또는 가상 스크롤링
   - 불필요한 API 호출 최소화

#### 4.2.5 API 연동

##### 대시보드 통계 조회 API
- **Endpoint**: `GET /api/admin/dashboard`
- **응답 데이터**:
```json
{
  "total_orders": 1,
  "pending_orders": 1,
  "preparing_orders": 0,
  "completed_orders": 0
}
```

##### 재고 조회 API
- **Endpoint**: `GET /api/admin/inventory`
- **응답 데이터**:
```json
[
  {
    "menu_id": 1,
    "menu_name": "아메리카노(ICE)",
    "stock": 10
  },
  {
    "menu_id": 2,
    "menu_name": "아메리카노(HOT)",
    "stock": 10
  },
  {
    "menu_id": 3,
    "menu_name": "카페라떼",
    "stock": 10
  }
]
```

##### 재고 업데이트 API
- **Endpoint**: `PATCH /api/admin/inventory/:menu_id`
- **요청 데이터**:
```json
{
  "stock_change": 1  // 또는 -1
}
```
- **응답 데이터**:
```json
{
  "menu_id": 1,
  "new_stock": 11,
  "updated_at": "2025-10-29T10:30:00Z"
}
```

##### 주문 목록 조회 API
- **Endpoint**: `GET /api/admin/orders`
- **쿼리 파라미터**: 
  - `status` (옵션): pending, accepted, preparing, completed
  - `limit` (옵션): 페이지당 항목 수
  - `offset` (옵션): 페이지네이션 오프셋
- **응답 데이터**:
```json
[
  {
    "order_id": 1,
    "created_at": "2025-07-31T13:00:00Z",
    "items": [
      {
        "menu_name": "아메리카노(ICE)",
        "quantity": 1,
        "options": []
      }
    ],
    "total_amount": 4000,
    "status": "pending"
  }
]
```

##### 주문 상태 변경 API
- **Endpoint**: `PATCH /api/admin/orders/:order_id/status`
- **요청 데이터**:
```json
{
  "status": "accepted"  // pending → accepted → preparing → completed
}
```
- **응답 데이터**:
```json
{
  "order_id": 1,
  "status": "accepted",
  "updated_at": "2025-10-29T10:30:00Z"
}
```

#### 4.2.6 상태 관리
- 대시보드 통계 상태 (총 주문, 상태별 주문 수)
- 재고 목록 상태 (메뉴별 재고 수량)
- 주문 목록 상태 (전체 주문 내역)
- 로딩 상태 (API 통신 중)
- 오류 상태
- 갱신 타이머 상태 (실시간 업데이트용)

#### 4.2.7 주문 상태 정의

| 상태 코드 | 상태명 | 설명 | 버튼 레이블 |
|---------|--------|------|------------|
| pending | 주문 접수 대기 | 고객이 주문을 완료한 초기 상태 | 주문 접수 |
| accepted | 주문 접수 | 관리자가 주문을 확인하고 접수한 상태 | 제조 시작 |
| preparing | 제조 중 | 주문한 메뉴를 제조 중인 상태 | 제조 완료 |
| completed | 제조 완료 | 주문이 완료되어 고객에게 전달 가능한 상태 | (버튼 없음) |

## 5. 백엔드 개발 명세

### 5.1 개요

백엔드는 Node.js와 Express를 사용하여 REST API를 제공하며, PostgreSQL 데이터베이스를 통해 데이터를 영구 저장합니다.

### 5.2 데이터 모델

#### 5.2.1 Menus (메뉴 테이블)

메뉴 정보를 저장하는 테이블

**필드**:
- `id` (INTEGER, PRIMARY KEY, AUTO INCREMENT): 메뉴 고유 ID
- `name` (VARCHAR(100), NOT NULL): 커피 이름 (예: "아메리카노(ICE)")
- `description` (TEXT): 메뉴 설명
- `price` (INTEGER, NOT NULL): 기본 가격 (원 단위)
- `image_url` (VARCHAR(255)): 이미지 경로 또는 URL
- `stock` (INTEGER, DEFAULT 0): 재고 수량
- `created_at` (TIMESTAMP, DEFAULT NOW()): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT NOW()): 수정 일시

**제약 조건**:
- `price`는 0 이상
- `stock`는 0 이상
- `name`은 UNIQUE

**초기 데이터**:
```sql
INSERT INTO menus (name, description, price, image_url, stock) VALUES
('아메리카노(ICE)', '간단한 설명...', 4000, '/americano-ice.jpg', 10),
('아메리카노(HOT)', '간단한 설명...', 4000, '/americano-hot.jpg', 10),
('카페라떼', '간단한 설명...', 5000, '/caffe-latte.jpg', 10);
```

#### 5.2.2 Options (옵션 테이블)

메뉴에 추가 가능한 옵션 정보를 저장하는 테이블

**필드**:
- `id` (INTEGER, PRIMARY KEY, AUTO INCREMENT): 옵션 고유 ID
- `name` (VARCHAR(50), NOT NULL): 옵션 이름 (예: "샷 추가", "시럽 추가")
- `price` (INTEGER, NOT NULL, DEFAULT 0): 옵션 가격 (원 단위)
- `menu_id` (INTEGER, FOREIGN KEY): 연결할 메뉴 ID (NULL 가능 - 모든 메뉴에 적용)
- `created_at` (TIMESTAMP, DEFAULT NOW()): 생성 일시

**제약 조건**:
- `price`는 0 이상
- `menu_id`는 menus 테이블의 `id`를 참조 (ON DELETE CASCADE)

**초기 데이터**:
```sql
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, NULL),
('시럽 추가', 0, NULL);
```

#### 5.2.3 Orders (주문 테이블)

고객의 주문 정보를 저장하는 메인 테이블

**필드**:
- `id` (INTEGER, PRIMARY KEY, AUTO INCREMENT): 주문 고유 ID
- `status` (VARCHAR(20), NOT NULL, DEFAULT 'pending'): 주문 상태
  - `pending`: 주문 접수 대기
  - `accepted`: 주문 접수
  - `preparing`: 제조 중
  - `completed`: 제조 완료
- `total_amount` (INTEGER, NOT NULL): 총 주문 금액
- `created_at` (TIMESTAMP, DEFAULT NOW()): 주문 일시
- `updated_at` (TIMESTAMP, DEFAULT NOW()): 수정 일시

**제약 조건**:
- `total_amount`는 0 이상
- `status`는 ENUM('pending', 'accepted', 'preparing', 'completed')

#### 5.2.4 Order_Items (주문 항목 테이블)

주문에 포함된 메뉴 항목을 저장하는 테이블

**필드**:
- `id` (INTEGER, PRIMARY KEY, AUTO INCREMENT): 주문 항목 고유 ID
- `order_id` (INTEGER, NOT NULL, FOREIGN KEY): 주문 ID
- `menu_id` (INTEGER, NOT NULL, FOREIGN KEY): 메뉴 ID
- `menu_name` (VARCHAR(100), NOT NULL): 메뉴 이름 (스냅샷)
- `quantity` (INTEGER, NOT NULL): 수량
- `unit_price` (INTEGER, NOT NULL): 개당 가격 (옵션 포함)
- `total_price` (INTEGER, NOT NULL): 총 가격 (unit_price × quantity)
- `options` (TEXT): 선택한 옵션 (JSON 배열 형태)

**제약 조건**:
- `order_id`는 orders 테이블의 `id`를 참조 (ON DELETE CASCADE)
- `menu_id`는 menus 테이블의 `id`를 참조 (ON DELETE RESTRICT)
- `quantity`는 1 이상
- `unit_price`, `total_price`는 0 이상

**options 필드 예시**:
```json
["샷 추가", "시럽 추가"]
```

### 5.3 데이터베이스 스키마 및 사용자 흐름

#### 5.3.1 전체 데이터 흐름

```
1. [화면 로드]
   ↓
   프론트엔드 → GET /api/menus → 백엔드 → DB: Menus 조회
   ↓
   메뉴 목록 표시 (가격, 이미지, 재고 등)

2. [메뉴 선택 및 담기]
   ↓
   프론트엔드: 장바구니에 임시 저장 (로컬 상태)

3. [주문하기]
   ↓
   프론트엔드 → POST /api/orders → 백엔드
   ↓
   트랜잭션 시작
   ├─ DB: Orders 테이블에 주문 생성
   ├─ DB: Order_Items 테이블에 주문 항목 생성
   └─ DB: Menus 테이블의 재고 감소
   ↓
   트랜잭션 커밋
   ↓
   주문 완료 응답

4. [관리자 화면 - 주문 조회]
   ↓
   프론트엔드 → GET /api/admin/orders → 백엔드
   ↓
   DB: Orders + Order_Items JOIN 조회
   ↓
   주문 현황 표시

5. [관리자 화면 - 주문 상태 변경]
   ↓
   프론트엔드 → PATCH /api/admin/orders/:id/status → 백엔드
   ↓
   DB: Orders 테이블의 status 업데이트
   ↓
   상태 변경 완료

6. [관리자 화면 - 재고 관리]
   ↓
   프론트엔드 → PATCH /api/admin/inventory/:id → 백엔드
   ↓
   DB: Menus 테이블의 stock 업데이트
   ↓
   재고 변경 완료
```

#### 5.3.2 상세 흐름 설명

**1) 메뉴 조회 및 표시**
- 프론트엔드가 앱 로드 시 `GET /api/menus` API 호출
- 백엔드는 Menus 테이블에서 모든 메뉴 정보 조회
- 주문하기 화면: 메뉴명, 가격, 이미지, 설명 표시
- 관리자 화면: 재고 수량 추가 표시

**2) 장바구니 관리**
- 사용자가 메뉴 선택 시 프론트엔드에서 임시 저장
- 옵션 선택 정보도 함께 저장
- 장바구니에 메뉴, 수량, 옵션, 금액 표시

**3) 주문 생성**
- '주문하기' 버튼 클릭 시 `POST /api/orders` API 호출
- 백엔드는 트랜잭션으로 처리:
  1. Orders 테이블에 새 주문 생성 (status='pending')
  2. Order_Items 테이블에 주문 항목들 생성
  3. 각 메뉴의 재고 감소 (Menus.stock -= quantity)
  4. 재고 부족 시 트랜잭션 롤백 및 에러 반환
- 성공 시 주문 ID와 상태 반환

**4) 주문 현황 조회**
- 관리자 화면에서 `GET /api/admin/orders` API 호출
- Orders와 Order_Items를 JOIN하여 전체 주문 정보 조회
- 주문 시간, 메뉴, 수량, 금액, 상태 표시
- 최신 주문이 상단에 표시되도록 정렬

**5) 주문 상태 변경**
- 관리자가 상태 변경 버튼 클릭 시 `PATCH /api/admin/orders/:id/status` API 호출
- 백엔드는 해당 주문의 status 필드 업데이트
- 상태 흐름: pending → accepted → preparing → completed

**6) 재고 관리**
- 관리자가 +/- 버튼 클릭 시 `PATCH /api/admin/inventory/:menu_id` API 호출
- 백엔드는 Menus 테이블의 stock 필드 업데이트
- 재고는 0 이하로 내려갈 수 없음

### 5.4 API 설계

#### 5.4.1 메뉴 관리 API

##### GET /api/menus
메뉴 목록 조회

**요청**:
- Method: GET
- Headers: 없음
- Body: 없음

**응답**:
- Status: 200 OK
- Body:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "description": "간단한 설명...",
      "price": 4000,
      "image_url": "/americano-ice.jpg",
      "stock": 10,
      "created_at": "2025-10-29T10:00:00Z",
      "updated_at": "2025-10-29T10:00:00Z"
    },
    ...
  ]
}
```

**에러 응답**:
- Status: 500 Internal Server Error
```json
{
  "success": false,
  "error": "메뉴 조회 중 오류가 발생했습니다."
}
```

##### GET /api/menus/:id
특정 메뉴 상세 조회

**요청**:
- Method: GET
- URL Parameters: `id` (메뉴 ID)

**응답**:
- Status: 200 OK
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "아메리카노(ICE)",
    "description": "간단한 설명...",
    "price": 4000,
    "image_url": "/americano-ice.jpg",
    "stock": 10,
    "created_at": "2025-10-29T10:00:00Z",
    "updated_at": "2025-10-29T10:00:00Z"
  }
}
```

**에러 응답**:
- Status: 404 Not Found
```json
{
  "success": false,
  "error": "메뉴를 찾을 수 없습니다."
}
```

#### 5.4.2 주문 관리 API

##### POST /api/orders
새 주문 생성

**요청**:
- Method: POST
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "items": [
    {
      "menu_id": 1,
      "quantity": 2,
      "options": ["샷 추가"]
    },
    {
      "menu_id": 3,
      "quantity": 1,
      "options": []
    }
  ]
}
```

**처리 로직**:
1. 각 메뉴의 재고 확인
2. 재고가 충분한지 검증
3. 트랜잭션 시작
4. Orders 테이블에 주문 생성
5. Order_Items 테이블에 항목들 생성
6. Menus 테이블의 재고 감소
7. 트랜잭션 커밋

**응답**:
- Status: 201 Created
```json
{
  "success": true,
  "data": {
    "order_id": 1,
    "status": "pending",
    "total_amount": 13000,
    "items": [
      {
        "menu_name": "아메리카노(ICE)",
        "quantity": 2,
        "options": ["샷 추가"],
        "total_price": 9000
      },
      {
        "menu_name": "카페라떼",
        "quantity": 1,
        "options": [],
        "total_price": 5000
      }
    ],
    "created_at": "2025-10-29T14:30:00Z"
  }
}
```

**에러 응답**:
- Status: 400 Bad Request (재고 부족)
```json
{
  "success": false,
  "error": "재고가 부족합니다.",
  "details": {
    "menu_name": "아메리카노(ICE)",
    "requested": 5,
    "available": 3
  }
}
```

- Status: 400 Bad Request (잘못된 요청)
```json
{
  "success": false,
  "error": "주문 항목이 비어있습니다."
}
```

##### GET /api/orders/:id
특정 주문 조회

**요청**:
- Method: GET
- URL Parameters: `id` (주문 ID)

**응답**:
- Status: 200 OK
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "pending",
    "total_amount": 13000,
    "items": [
      {
        "id": 1,
        "menu_id": 1,
        "menu_name": "아메리카노(ICE)",
        "quantity": 2,
        "unit_price": 4500,
        "total_price": 9000,
        "options": ["샷 추가"]
      },
      {
        "id": 2,
        "menu_id": 3,
        "menu_name": "카페라떼",
        "quantity": 1,
        "unit_price": 5000,
        "total_price": 5000,
        "options": []
      }
    ],
    "created_at": "2025-10-29T14:30:00Z",
    "updated_at": "2025-10-29T14:30:00Z"
  }
}
```

**에러 응답**:
- Status: 404 Not Found
```json
{
  "success": false,
  "error": "주문을 찾을 수 없습니다."
}
```

#### 5.4.3 관리자 API

##### GET /api/admin/orders
모든 주문 조회

**요청**:
- Method: GET
- Query Parameters (선택):
  - `status`: 주문 상태 필터링 (pending, accepted, preparing, completed)
  - `limit`: 조회 개수 (기본값: 50)
  - `offset`: 오프셋 (기본값: 0)

**예시**:
```
GET /api/admin/orders?status=pending&limit=20
```

**응답**:
- Status: 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "status": "pending",
      "total_amount": 13000,
      "items": [
        {
          "menu_name": "아메리카노(ICE)",
          "quantity": 2,
          "options": ["샷 추가"]
        }
      ],
      "created_at": "2025-10-29T14:30:00Z",
      "updated_at": "2025-10-29T14:30:00Z"
    },
    ...
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

##### PATCH /api/admin/orders/:id/status
주문 상태 변경

**요청**:
- Method: PATCH
- URL Parameters: `id` (주문 ID)
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "status": "accepted"
}
```

**상태 변경 규칙**:
- pending → accepted
- accepted → preparing
- preparing → completed
- completed → (변경 불가)

**응답**:
- Status: 200 OK
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "accepted",
    "updated_at": "2025-10-29T14:35:00Z"
  }
}
```

**에러 응답**:
- Status: 400 Bad Request (잘못된 상태 전환)
```json
{
  "success": false,
  "error": "잘못된 상태 전환입니다.",
  "details": {
    "current_status": "completed",
    "requested_status": "preparing"
  }
}
```

##### GET /api/admin/dashboard
대시보드 통계 조회

**요청**:
- Method: GET

**응답**:
- Status: 200 OK
```json
{
  "success": true,
  "data": {
    "total_orders": 10,
    "pending_orders": 3,
    "accepted_orders": 2,
    "preparing_orders": 4,
    "completed_orders": 1
  }
}
```

##### GET /api/admin/inventory
재고 현황 조회

**요청**:
- Method: GET

**응답**:
- Status: 200 OK
```json
{
  "success": true,
  "data": [
    {
      "menu_id": 1,
      "menu_name": "아메리카노(ICE)",
      "stock": 10
    },
    {
      "menu_id": 2,
      "menu_name": "아메리카노(HOT)",
      "stock": 3
    },
    {
      "menu_id": 3,
      "menu_name": "카페라떼",
      "stock": 0
    }
  ]
}
```

##### PATCH /api/admin/inventory/:menu_id
재고 수량 변경

**요청**:
- Method: PATCH
- URL Parameters: `menu_id` (메뉴 ID)
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "stock_change": 5
}
```
또는
```json
{
  "stock_change": -3
}
```

**처리 로직**:
- `stock_change` > 0: 재고 증가
- `stock_change` < 0: 재고 감소
- 결과 재고가 0 미만이 되면 에러 반환

**응답**:
- Status: 200 OK
```json
{
  "success": true,
  "data": {
    "menu_id": 1,
    "menu_name": "아메리카노(ICE)",
    "old_stock": 10,
    "new_stock": 15,
    "updated_at": "2025-10-29T14:40:00Z"
  }
}
```

**에러 응답**:
- Status: 400 Bad Request (재고 음수)
```json
{
  "success": false,
  "error": "재고는 0 미만이 될 수 없습니다.",
  "details": {
    "current_stock": 2,
    "requested_change": -5
  }
}
```

#### 5.4.4 옵션 관리 API

##### GET /api/options
옵션 목록 조회

**요청**:
- Method: GET
- Query Parameters (선택):
  - `menu_id`: 특정 메뉴의 옵션만 조회

**응답**:
- Status: 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "샷 추가",
      "price": 500,
      "menu_id": null
    },
    {
      "id": 2,
      "name": "시럽 추가",
      "price": 0,
      "menu_id": null
    }
  ]
}
```

### 5.5 에러 처리

#### 5.5.1 공통 에러 코드

| HTTP 상태 | 에러 코드 | 설명 |
|----------|---------|------|
| 400 | BAD_REQUEST | 잘못된 요청 (필수 필드 누락, 유효성 검증 실패) |
| 404 | NOT_FOUND | 리소스를 찾을 수 없음 |
| 409 | CONFLICT | 리소스 충돌 (재고 부족 등) |
| 500 | INTERNAL_SERVER_ERROR | 서버 내부 오류 |

#### 5.5.2 에러 응답 형식

모든 에러는 다음 형식으로 응답:
```json
{
  "success": false,
  "error": "에러 메시지",
  "code": "ERROR_CODE",
  "details": {
    // 추가 상세 정보 (선택)
  }
}
```

### 5.6 데이터베이스 인덱스

성능 최적화를 위한 인덱스 설계:

```sql
-- Menus 테이블
CREATE INDEX idx_menus_name ON menus(name);
CREATE INDEX idx_menus_stock ON menus(stock);

-- Orders 테이블
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Order_Items 테이블
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id ON order_items(menu_id);

-- Options 테이블
CREATE INDEX idx_options_menu_id ON options(menu_id);
```

### 5.7 트랜잭션 관리

#### 5.7.1 주문 생성 트랜잭션

주문 생성 시 ACID 보장을 위한 트랜잭션 처리:

```javascript
// 트랜잭션 예시 (의사 코드)
BEGIN TRANSACTION;

try {
  // 1. 재고 확인 및 잠금
  FOR EACH item IN order_items {
    SELECT stock FROM menus WHERE id = item.menu_id FOR UPDATE;
    IF stock < item.quantity THEN
      THROW ERROR "재고 부족";
    END IF;
  }

  // 2. 주문 생성
  INSERT INTO orders (...) VALUES (...);
  
  // 3. 주문 항목 생성
  FOR EACH item IN order_items {
    INSERT INTO order_items (...) VALUES (...);
  }
  
  // 4. 재고 감소
  FOR EACH item IN order_items {
    UPDATE menus SET stock = stock - item.quantity WHERE id = item.menu_id;
  }
  
  COMMIT;
} catch (error) {
  ROLLBACK;
  THROW error;
}
```

### 5.8 보안 고려사항

#### 5.8.1 입력 검증

- 모든 API 요청에 대해 입력값 검증
- SQL Injection 방지를 위한 Prepared Statement 사용
- XSS 방지를 위한 입력 sanitization

#### 5.8.2 CORS 설정

프론트엔드와 백엔드가 다른 포트에서 실행되므로 CORS 설정 필요:
```javascript
// 허용할 origin 설정
CORS origin: http://localhost:5173
Methods: GET, POST, PATCH, DELETE
Headers: Content-Type, Authorization
```

#### 5.8.3 Rate Limiting

API 남용 방지를 위한 속도 제한:
- 일반 API: 100 requests/분
- 관리자 API: 200 requests/분

### 5.9 배포 및 환경 설정

#### 5.9.1 환경 변수

```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password

# 서버 설정
PORT=3000
NODE_ENV=development

# CORS 설정
FRONTEND_URL=http://localhost:5173
```

#### 5.9.2 개발/운영 환경 분리

- **개발 환경**: localhost, 상세 로그, 에러 스택 노출
- **운영 환경**: 실제 도메인, 최소 로그, 에러 메시지만 노출

