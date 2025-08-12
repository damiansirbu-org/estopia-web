import { Building2, DollarSign, FileText, Home, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './LoginButton';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { t, ready } = useTranslation();
  const { isLoggedIn, isAdmin } = useAuth();
  
  // Fallback labels if translations aren't loaded yet
  const fallbackTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'assets', label: 'Assets', icon: Building2 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ];
  
  const baseTabs = ready ? [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'assets', label: t('nav.assets'), icon: Building2 },
    { id: 'clients', label: t('nav.clients'), icon: Users },
    { id: 'contracts', label: t('nav.contracts'), icon: FileText },
    { id: 'payments', label: t('nav.payments'), icon: DollarSign },
  ] : fallbackTabs;

  // Use base tabs only - Users is now only in dropdown
  const tabs = isLoggedIn() ? baseTabs : [];

  return (
    <>
    <header className="bg-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Center everything */}
          <div className="flex-1">
            {isLoggedIn() && (
              <nav className="flex space-x-8 justify-center">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors ${activeTab === tab.id
                        ? 'bg-gray-600 text-white'
                        : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                        }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
                <LoginButton setActiveTab={setActiveTab} />
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}

export default Header;