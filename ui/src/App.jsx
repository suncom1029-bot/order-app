import { useState } from 'react';
import Header from './components/Header';
import OrderPage from './pages/OrderPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('order');

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'order' && <OrderPage />}
        {activeTab === 'admin' && (
          <div className="coming-soon">
            <h2>관리자 페이지</h2>
            <p>준비 중입니다...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
