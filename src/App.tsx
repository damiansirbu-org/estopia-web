import React, { useState, useEffect } from 'react';
import { Home, Building2, Users, FileText, DollarSign, Settings } from 'lucide-react';
import { clientService } from './services/api.js';

function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await clientService.getAllClients();
        setClients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadClients();
  }, []);

  const handleAddClient = () => {
    setIsAdding(true);
  };

  const handleSaveClient = async () => {
    try {
      const savedClient = await clientService.createClient(newClient);
      setClients([...clients, savedClient]);
      setNewClient({ firstName: '', lastName: '', email: '', phoneNumber: '', address: '' });
      setIsAdding(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewClient({ firstName: '', lastName: '', email: '', phoneNumber: '', address: '' });
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setEditData({...client});
  };

  const handleSaveEdit = async () => {
    try {
      const updatedClient = await clientService.updateClient(editingId, editData);
      setClients(clients.map(c => c.id === editingId ? updatedClient : c));
      setEditingId(null);
      setEditData({});
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(id);
        setClients(clients.filter(c => c.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="p-6">Loading clients...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-start items-center mb-6">
        <button 
          onClick={handleAddClient}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          + Add Client
        </button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isAdding && (
              <tr className="bg-blue-50 border-l-4 border-blue-500">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">New</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newClient.firstName}
                    onChange={(e) => setNewClient({...newClient, firstName: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="First name"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newClient.lastName}
                    onChange={(e) => setNewClient({...newClient, lastName: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Last name"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Email"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newClient.phoneNumber}
                    onChange={(e) => setNewClient({...newClient, phoneNumber: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Phone"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newClient.address}
                    onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Address"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    onClick={handleSaveClient}
                    className="text-green-600 hover:text-green-900 mr-3 font-medium"
                  >
                    Save
                  </button>
                  <button 
                    onClick={handleCancelAdd}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            )}
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === client.id ? (
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900">{client.firstName}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === client.id ? (
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900">{client.lastName}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === client.id ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">{client.email}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === client.id ? (
                    <input
                      type="text"
                      value={editData.phoneNumber}
                      onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">{client.phoneNumber}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === client.id ? (
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">{client.address || '-'}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === client.id ? (
                    <>
                      <button 
                        onClick={handleSaveEdit}
                        className="text-green-600 hover:text-green-900 mr-3 font-medium"
                      >
                        Save
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900 font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleEdit(client)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'assets', label: 'Assets', icon: Building2 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold mb-2">Total Assets</h3>
                <p className="text-3xl font-bold text-blue-600">12</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold mb-2">Active Contracts</h3>
                <p className="text-3xl font-bold text-green-600">8</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
                <p className="text-3xl font-bold text-purple-600">€12,500</p>
              </div>
            </div>
          </div>
        );
      case 'assets':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Assets</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add Asset
              </button>
            </div>
            <div className="bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Apartament Floreasca</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Str. Floreasca 12, București</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apartment</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Occupied
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Casa Herastrau</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Str. Herastrau 45, București</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">House</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Available
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'clients':
        return <ClientList />;
      case 'contracts':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Contracts</h1>
            <div className="bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ion Popescu</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apartament Floreasca</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-01</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">€1,200</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'payments':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Payments</h1>
            <div className="bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ion Popescu - Floreasca</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-07-01</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">€1,550</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-07-05</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Maria Ionescu - Herastrau</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-07-01</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">€3,100</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Overdue
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return <div className="p-6">Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Logo and Navigation */}
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
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
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
              <h1 className="text-2xl text-white tracking-widest" style={{fontFamily: 'Orbitron, ui-monospace, monospace', letterSpacing: '0.3em', fontWeight: '900', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>ESTOPIA</h1>
              <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;