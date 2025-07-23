import { useState } from 'react';
import AssetList from './components/AssetList';
import ClientList from './components/ClientList';
import ClientListMUI from './components/ClientListMUI';
import ContractList from './components/ContractList';
import Header from './components/Header';
import PaymentList from './components/PaymentList';
import ErrorProvider from './context/ErrorProvider';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { DataGridStyleProvider } from './theme/DataGridStyleProvider';

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
      case 'clients-mui':
        return <ClientListMUI />;
      case 'contracts':
        return <ContractList />;
      case 'payments':
        return <PaymentList />;
      case 'settings':
        return <Settings />;
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
    <DataGridStyleProvider>
      <ErrorProvider>
        <AppContent />
      </ErrorProvider>
    </DataGridStyleProvider>
  );
}

export default App;