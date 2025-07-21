import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ClientList from './components/ClientList.jsx';
import AssetList from './components/AssetList.jsx';
import ContractList from './components/ContractList.jsx';
import PaymentList from './components/PaymentList.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'assets':
        return <AssetList />;
      case 'clients':
        return <ClientList />;
      case 'contracts':
        return <ContractList />;
      case 'payments':
        return <PaymentList />;
      default:
        return <div className="p-6">Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;