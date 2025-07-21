import React, { useState } from 'react';
import { ErrorProvider } from './context/ErrorContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ClientList from './components/ClientList';
import AssetList from './components/AssetList';
import ContractList from './components/ContractList';
import PaymentList from './components/PaymentList';

function AppContent() {
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
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </>
  );
}

function App() {
  return (
    <ErrorProvider>
      <AppContent />
    </ErrorProvider>
  );
}

export default App;