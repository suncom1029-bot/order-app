import './Header.css';

function Header({ activeTab, onTabChange }) {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">COZY</h1>
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'order' ? 'active' : ''}`}
            onClick={() => onTabChange('order')}
          >
            주문하기
          </button>
          <button
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => onTabChange('admin')}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

