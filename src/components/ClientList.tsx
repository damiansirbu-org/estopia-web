import React, { useState, useEffect } from 'react';
import { clientService } from '../services/api';
import { useError } from '../context/ErrorContext';
import type { Client, CreateClientRequest, UpdateClientRequest } from '../types/models';

function ClientList() {
  const { withErrorHandling, loading } = useError();
  const [clients, setClients] = useState<Client[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newClient, setNewClient] = useState<CreateClientRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [editData, setEditData] = useState<Partial<Client>>({});

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    await withErrorHandling(async () => {
      const data = await clientService.getAllClients();
      setClients(data);
    });
  };

  const handleAddClient = () => {
    setIsAdding(true);
  };

  const handleSaveClient = async () => {
    // Debug: log ce trimitem
    console.log('🔍 Creating client with data:', newClient);

    // Validare minim first/last name
    if (!newClient.firstName.trim() || !newClient.lastName.trim()) {
      alert('First name and last name are required!');
      return;
    }

    await withErrorHandling(async () => {
      // Trimite doar câmpurile non-empty pentru email și phone
      const clientData: CreateClientRequest = {
        firstName: newClient.firstName.trim(),
        lastName: newClient.lastName.trim(),
        address: newClient.address?.trim() || undefined,
        email: newClient.email?.trim() || undefined,
        phoneNumber: newClient.phoneNumber?.trim() || undefined
      };

      console.log('🔍 Cleaned client data being sent:', clientData);

      const savedClient = await clientService.createClient(clientData);
      console.log('🔍 Received from backend:', savedClient);

      setClients([...clients, savedClient]);
      setNewClient({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: ''
      });
      setIsAdding(false);
    }, 'Client created successfully!');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewClient({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: ''
    });
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id!);
    setEditData({...client});
  };

  const handleSaveEdit = async () => {
    if (editingId && editData.id) {
      await withErrorHandling(async () => {
        const { id, createdAt, updatedAt, ...updateData } = editData;

        // Clean up the data similar to create
        const cleanUpdateData: UpdateClientRequest = {
          firstName: updateData.firstName?.trim() || '',
          lastName: updateData.lastName?.trim() || '',
          address: updateData.address?.trim() || undefined,
          email: updateData.email?.trim() || undefined,
          phoneNumber: updateData.phoneNumber?.trim() || undefined
        };

        console.log('🔍 Updating client with data:', cleanUpdateData);

        const updatedClient = await clientService.updateClient(editingId, cleanUpdateData);
        setClients(clients.map(c => c.id === editingId ? updatedClient : c));
        setEditingId(null);
        setEditData({});
      }, 'Client updated successfully!');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      await withErrorHandling(async () => {
        await clientService.deleteClient(id);
        setClients(clients.filter(c => c.id !== id));
      }, 'Client deleted successfully!');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={handleAddClient}
          disabled={loading || isAdding}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium disabled:opacity-50"
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
                    placeholder="First name *"
                    disabled={loading}
                    required
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newClient.lastName}
                    onChange={(e) => setNewClient({...newClient, lastName: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Last name *"
                    disabled={loading}
                    required
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="email"
                    value={newClient.email || ''}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Email (optional)"
                    disabled={loading}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="tel"
                    value={newClient.phoneNumber || ''}
                    onChange={(e) => setNewClient({...newClient, phoneNumber: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Phone (optional)"
                    disabled={loading}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newClient.address || ''}
                    onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Address (optional)"
                    disabled={loading}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={handleSaveClient}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelAdd}
                    disabled={loading}
                    className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            )}

            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {editingId === client.id ? (
                    <input
                      type="text"
                      value={editData.firstName || ''}
                      onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={loading}
                    />
                  ) : (
                    client.firstName
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === client.id ? (
                    <input
                      type="text"
                      value={editData.lastName || ''}
                      onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={loading}
                    />
                  ) : (
                    client.lastName
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === client.id ? (
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={loading}
                    />
                  ) : (
                    client.email || '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === client.id ? (
                    <input
                      type="tel"
                      value={editData.phoneNumber || ''}
                      onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={loading}
                    />
                  ) : (
                    client.phoneNumber || '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === client.id ? (
                    <input
                      type="text"
                      value={editData.address || ''}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={loading}
                    />
                  ) : (
                    client.address || '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === client.id ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
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
                        onClick={() => handleDelete(client.id!)}
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

      {clients.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No clients found. Click "Add Client" to create one.
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-500">
          Loading clients...
        </div>
      )}
    </div>
  );
}

export default ClientList;