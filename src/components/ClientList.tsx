import React, { useState, useEffect } from 'react';
import { clientService } from '../services/api.js';

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

export default ClientList;