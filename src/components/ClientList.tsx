import { useCallback, useEffect, useState } from 'react';
import { useError } from '../context/useError';
import { clientService } from '../services/api';
import type { Client, CreateClientRequest, UpdateClientRequest } from '../types/models';
import type { FilterType } from './common/ColumnFilterPopover';
import TableSortHeader from './common/TableSortHeader';

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

  const filterFields = [
    'id',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'address',
  ];

  // Add a separate state for filter inputs (pendingFilters) and only apply them to columnFilters when Filter is clicked
  const [pendingFilters, setPendingFilters] = useState<Record<string, string>>({});
  // Per-column filter state: { field: { type, value } }
  const [columnFilters, setColumnFilters] = useState<Record<string, { type: FilterType, value: string }>>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handlePendingFilterChange = (field: string, value: string) => {
    setPendingFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleColumnFilterChange = (field: string, type: FilterType, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [field]: { type, value } }));
  };

  const handleApplyColumnFilter = () => {
    // Only include fields with non-empty values in the filters object
    const newFilters: Record<string, { type: FilterType, value: string }> = {};
    for (const field of filterFields) {
      const value = pendingFilters[field] || '';
      if (value.trim() !== '') {
        newFilters[field] = { type: 'like', value };
      }
    }
    setColumnFilters(newFilters);
  };

  const handleClearColumnFilter = () => {
    setPendingFilters({});
    setColumnFilters({});
  };

  const setFiltersFromColumnFilters = () => {
    // This function can be used to map columnFilters to the filter DTO structure for the API call
    // For now, just triggers useEffect by updating a dummy state if needed
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Debounce filter changes
  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters, sortField, sortDirection]);

  const loadClients = useCallback(async () => {
    await withErrorHandling(async () => {
      // Build filter DTO for API
      const filters: Record<string, { type: FilterType, value: string }> = {};
      for (const field of filterFields) {
        const f = columnFilters[field];
        if (f && f.value.trim() !== '') {
          filters[field] = f;
        }
      }
      const data = await clientService.getAllClients({ filters, sortField, sortDirection });
      setClients(data);
    });
  }, [withErrorHandling, columnFilters, sortField, sortDirection]);

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setEditData({ ...client });
  };

  const handleSaveEdit = async () => {
    if (editingId && editData.id) {
      await withErrorHandling(async () => {
        // Only use the fields needed for update
        const updateData = { ...editData };
        delete updateData.id;
        delete updateData.createdAt;
        delete updateData.updatedAt;

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
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {filterFields.map((field) => (
                <TableSortHeader key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} field={field} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              ))}
              <th className="text-xs font-medium text-gray-500 uppercase tracking-wider align-middle text-center" style={{ padding: '12px 2px' }}>
              </th>
              <th className="text-xs font-medium text-gray-500 uppercase tracking-wider align-middle text-center" style={{ padding: '12px 2px' }}></th>
            </tr>
            <tr className="bg-white align-middle">
              {filterFields.map((field) => (
                <td key={field} className="px-6 py-2 align-middle">
                  <input
                    type="text"
                    value={pendingFilters[field] || ''}
                    onChange={e => handlePendingFilterChange(field, e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder={`Filter ${field}`}
                    style={{ minWidth: 80 }}
                  />
                </td>
              ))}
              <td className="align-middle text-center" style={{ padding: '8px 2px' }}>
                <button
                  onClick={handleApplyColumnFilter}
                  className="px-2 py-1 bg-transparent text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
                >
                  Filter
                </button>
              </td>
              <td className="align-middle text-center" style={{ padding: '8px 2px' }}>
                <button
                  onClick={handleClearColumnFilter}
                  className="px-2 py-1 bg-transparent text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
                >
                  Clear
                </button>
              </td>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="whitespace-nowrap text-center" style={{ padding: '16px 2px' }}>
                <button
                  onClick={handleAddClient}
                  className="px-2 py-1 bg-transparent text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
                >
                  Add
                </button>
              </td>
              <td style={{ padding: '16px 2px' }}></td>
            </tr>

            {isAdding && (
              <tr className="bg-blue-50 border-l-4 border-blue-500">
                {filterFields.map((field) => (
                  <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {field === 'id' ? '' : (
                      field === 'firstName' ? (
                        <input
                          type="text"
                          value={newClient.firstName}
                          onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="First name *"
                          disabled={loading}
                          required
                        />
                      ) : field === 'lastName' ? (
                        <input
                          type="text"
                          value={newClient.lastName}
                          onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Last name *"
                          disabled={loading}
                          required
                        />
                      ) : field === 'email' ? (
                        <input
                          type="email"
                          value={newClient.email || ''}
                          onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Email (optional)"
                          disabled={loading}
                        />
                      ) : field === 'phoneNumber' ? (
                        <input
                          type="tel"
                          value={newClient.phoneNumber || ''}
                          onChange={(e) => setNewClient({ ...newClient, phoneNumber: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Phone (optional)"
                          disabled={loading}
                        />
                      ) : field === 'address' ? (
                        <input
                          type="text"
                          value={newClient.address || ''}
                          onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Address (optional)"
                          disabled={loading}
                        />
                      ) : null
                    )}
                  </td>
                ))}
                <td className="whitespace-nowrap text-center" style={{ padding: '16px 2px' }}>
                  <button
                    onClick={handleSaveClient}
                    disabled={loading}
                    className="px-2 py-1 bg-transparent text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                  >
                    Save
                  </button>
                </td>
                <td className="whitespace-nowrap text-center" style={{ padding: '16px 2px' }}>
                  <button
                    onClick={handleCancelAdd}
                    disabled={loading}
                    className="px-2 py-1 bg-transparent text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
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
                      onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
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
                      onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
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
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
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
                      onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
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
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={loading}
                    />
                  ) : (
                    client.address || '-'
                  )}
                </td>
                <td className="whitespace-nowrap text-center" style={{ padding: '16px 2px' }}>
                  {editingId === client.id ? (
                    <button
                      onClick={handleSaveEdit}
                      disabled={loading}
                      className="px-2 py-1 bg-transparent text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(client)}
                      className="px-2 py-1 bg-transparent text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </td>
                <td className="whitespace-nowrap text-center" style={{ padding: '16px 2px' }}>
                  {editingId === client.id ? (
                    <button
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="px-2 py-1 bg-transparent text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(client.id!)}
                      className="px-2 py-1 bg-transparent text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {clients.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No clients found. Click "Add" to create one.
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