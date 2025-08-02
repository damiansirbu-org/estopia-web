import { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import AssetList from './components/AssetList';
import ClientList from './components/ClientList';
import TerminalPanel from './components/common/TerminalPanel';
import ContractList from './components/ContractList';
import Header from './components/Header';
import PaymentList from './components/PaymentList';
import ErrorProvider from './context/ErrorProvider';
import { TerminalProvider } from './context/TerminalContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './hooks/useTheme';
import { useTerminal } from './context/useTerminal';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

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
      case 'settings':
        return <Settings />;
      default:
        return <div className="p-6">Page not found</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden" style={{ 
        margin: '0.5rem',
        marginBottom: '23.5vh', // Space for console (22vh) + gap
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {renderContent()}
      </main>
    </div>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { messages, clear, copy } = useTerminal();
  return (
    <>
      {children}
      <TerminalPanel messages={messages} onClear={clear} onCopy={copy} />
    </>
  );
}

function ThemedApp() {
  const { getThemeConfig } = useTheme();
  
  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <div className="max-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden relative" style={{ margin: '0 auto', height: 'calc(100vh - 1rem)' }}>
        <ConfigProvider theme={getThemeConfig()}>
          <ErrorProvider>
            <TerminalProvider>
              <AppShell>
                <AppContent />
              </AppShell>
            </TerminalProvider>
          </ErrorProvider>
        </ConfigProvider>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;