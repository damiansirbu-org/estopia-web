import { useState } from 'react';
import { ConfigProvider } from 'antd';
import AssetList from './components/AssetList';
import ClientListAntd from './components/ClientListAntd';
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
        return <ClientListAntd />;
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
    <ConfigProvider theme={getThemeConfig()}>
      <ErrorProvider>
        <TerminalProvider>
          <AppShell>
            <AppContent />
          </AppShell>
        </TerminalProvider>
      </ErrorProvider>
    </ConfigProvider>
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