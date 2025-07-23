import { Building2, DollarSign, FileText, Home, Settings, Users } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function Header({ activeTab, setActiveTab }: HeaderProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'assets', label: 'Assets', icon: Building2 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ];

  return (
    <header className="bg-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Empty left side */}
          <div className="flex items-center">
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                      ? 'bg-gray-600 text-white'
                      : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Logo and User Menu */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl text-white tracking-widest" style={{ fontFamily: 'Orbitron, ui-monospace, monospace', letterSpacing: '0.3em', fontWeight: '900', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>ESTOPIA</h1>
            <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;