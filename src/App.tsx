import { useState } from 'react';
import AssetList from './components/AssetList';
import ClientList from './components/ClientList';
import ContractList from './components/ContractList';
import Header from './components/Header';
import PaymentList from './components/PaymentList';
import ErrorProvider from './context/ErrorProvider';
import Dashboard from './pages/Dashboard';

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