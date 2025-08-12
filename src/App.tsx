import { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import AssetList from './components/AssetList';
import ClientList from './components/ClientList';
import TerminalPanel from './components/common/TerminalPanel';
import ContractList from './components/ContractList';
import Header from './components/Header';
import PaymentList from './components/PaymentList';
import UserList from './components/UserList';
import ErrorProvider from './context/ErrorProvider';
import { TerminalProvider } from './context/TerminalContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTheme } from './hooks/useTheme';
import { useTerminal } from './context/useTerminal';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';

function AppContent() {
  const { isLoggedIn, login } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    setLoginLoading(true);
    setLoginError('');
    try {
      await login(credentials.username, credentials.password);
    } catch (error) {
      setLoginError('Login failed. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleResetPassword = async (data: any) => {
    if (data.error) {
      setLoginError(data.error);
      return;
    }
    
    // Implement actual password reset logic here
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'username': data.username,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      if (response.ok) {
        setLoginError('');
        // Success message or redirect to login
      } else {
        const errorData = await response.json();
        setLoginError(errorData.error || 'Password reset failed');
      }
    } catch (error) {
      setLoginError('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

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
      case 'users':
        return <UserList />;
      case 'settings':
        return <Settings />;
      default:
        return <div className="p-6">Page not found</div>;
    }
  };

  // Show full-screen login when not logged in
  if (!isLoggedIn()) {
    return (
      <Login 
        onLogin={handleLogin}
        onResetPassword={handleResetPassword}
        loading={loginLoading}
        error={loginError}
      />
    );
  }

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
  const { isLoggedIn } = useAuth();
  return (
    <>
      {children}
      {isLoggedIn() && <TerminalPanel messages={messages} onClear={clear} onCopy={copy} />}
    </>
  );
}

function ThemedApp() {
  const { getThemeConfig } = useTheme();
  const { isLoggedIn } = useAuth();
  
  return (
    <ConfigProvider theme={getThemeConfig()}>
      <ErrorProvider>
        {isLoggedIn() ? (
          <div className="min-h-screen bg-gray-100 p-2">
            <div className="max-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden relative" style={{ margin: '0 auto', height: 'calc(100vh - 1rem)' }}>
              <AppShell>
                <AppContent />
              </AppShell>
            </div>
          </div>
        ) : (
          <AppShell>
            <AppContent />
          </AppShell>
        )}
      </ErrorProvider>
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TerminalProvider>
        <AuthProvider>
          <ThemedApp />
        </AuthProvider>
      </TerminalProvider>
    </ThemeProvider>
  );
}

export default App;