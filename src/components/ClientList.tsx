import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useError } from '../context/useError';
import { clientService } from '../services/api';
import type { Client, CreateClientRequest, UpdateClientRequest } from '../types/models';
import { EstopiaError } from '../utils/ErrorHandler';
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
    nationalId: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [editData, setEditData] = useState<Partial<Client>>({});
  const tableRef = useRef<HTMLDivElement>(null);
  const [addFieldErrors, setAddFieldErrors] = useState<Record<string, string>>({});
  const [editFieldErrors, setEditFieldErrors] = useState<Record<string, string>>({});

  const filterFields = useMemo(() => [
    'firstName',
    'lastName',
    'nationalId',
    'email',
    'phoneNumber',
    'address',
  ], []);

  const [pendingFilters, setPendingFilters] = useState<Record<string, string>>({});
  const [columnFilters, setColumnFilters] = useState<Record<string, { type: FilterType, value: string }>>({});
  const [sortField, setSortField] = useState<string>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handlePendingFilterChange = (field: string, value: string) => {
    setPendingFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyColumnFilter = useCallback(() => {
    const newFilters: Record<string, { type: FilterType, value: string }> = {};
    for (const field of filterFields) {
      const value = pendingFilters[field] || '';
      if (value.trim() !== '') {
        newFilters[field] = { type: 'like', value };
      }
    }
    setColumnFilters(newFilters);
  }, [filterFields, pendingFilters]);

  const handleClearColumnFilter = () => {
    setPendingFilters({});
    setColumnFilters({});
  };

  // Handle keyboard events for filter row
  const handleFilterKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyColumnFilter();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClearColumnFilter();
    }
  };

  // Handle keyboard events for add row
  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveClient();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelAdd();
    }
  };

  // Handle keyboard events for edit row
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddClient = () => {
    setIsAdding(true);
  };

  const { showError } = useError();

  // Wrap withErrorHandling pentru a intercepta erorile de validare
  const withFieldErrorHandling = useCallback(async (fn: () => Promise<void>, mode: 'add' | 'edit' = 'add') => {
    if (mode === 'add') setAddFieldErrors({});
    if (mode === 'edit') setEditFieldErrors({});
    try {
      await fn();
    } catch (err) {
      if (err instanceof EstopiaError && err.fieldErrors) {
        const fe: Record<string, string> = {};
        for (const e of err.fieldErrors) {
          fe[e.field] = e.message;
        }
        if (mode === 'add') setAddFieldErrors(fe);
        if (mode === 'edit') setEditFieldErrors(fe);
        // Toast global cu toate erorile
        const msg = Object.entries(fe).map(([f, m]) => `${f}: ${m}`).join('; ');
        showError(msg);
      } else {
        throw err;
      }
    }
  }, [showError]);

  const handleSaveClient = useCallback(async () => {
    await withFieldErrorHandling(async () => {
      const clientData: CreateClientRequest = {
        firstName: newClient.firstName,
        lastName: newClient.lastName,
        nationalId: newClient.nationalId,
        address: newClient.address,
        email: newClient.email,
        phoneNumber: newClient.phoneNumber
      };
      const savedClient = await clientService.createClient(clientData);
      setClients([...clients, savedClient]);
      setNewClient({
        firstName: '',
        lastName: '',
        nationalId: '',
        email: '',
        phoneNumber: '',
        address: ''
      });
      setIsAdding(false);
      setAddFieldErrors({});
    }, 'add');
  }, [withFieldErrorHandling, newClient, clients]);

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewClient({
      firstName: '',
      lastName: '',
      nationalId: '',
      email: '',
      phoneNumber: '',
      address: ''
    });
    setAddFieldErrors({});
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id!);
    setEditData({ ...client });
    setEditFieldErrors({});
  };

  // Handle row click for editing
  const handleRowClick = (client: Client) => {
    if (editingId !== client.id) {
      handleEdit(client);
    }
  };

  const handleSaveEdit = useCallback(async () => {
    if (editingId && editData.id) {
      await withFieldErrorHandling(async () => {
        const cleanUpdateData: UpdateClientRequest = {
          firstName: editData.firstName ?? '',
          lastName: editData.lastName ?? '',
          nationalId: editData.nationalId ?? '',
          phoneNumber: editData.phoneNumber ?? '',
          email: editData.email ?? '',
          address: editData.address ?? ''
        };
        const updatedClient = await clientService.updateClient(editingId, cleanUpdateData);
        setClients(clients.map(c => c.id === editingId ? updatedClient : c));
        setEditingId(null);
        setEditData({});
        setEditFieldErrors({});
      }, 'edit');
    }
  }, [withFieldErrorHandling, editingId, editData, clients]);

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setEditFieldErrors({});
  };

  // Handle clicks outside to act as ENTER
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        if (isAdding) {
          handleSaveClient();
        } else if (editingId) {
          handleSaveEdit();
        } else if (Object.values(pendingFilters).some(val => val.trim() !== '')) {
          handleApplyColumnFilter();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAdding, editingId, pendingFilters, handleSaveClient, handleSaveEdit, handleApplyColumnFilter]);

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters, sortField, sortDirection]);

  const loadClients = useCallback(async () => {
    await withErrorHandling(async () => {
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
  }, [withErrorHandling, columnFilters, sortField, sortDirection, filterFields]);

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect pentru resetare erori la schimbare mod
  useEffect(() => {
    setAddFieldErrors({}); setNewClient({
      firstName: '',
      lastName: '',
      nationalId: '',
      email: '',
      phoneNumber: '',
      address: ''
    });
  }, [isAdding]);
  useEffect(() => { setEditFieldErrors({}); }, [editingId]);

  // Helper pentru accesare dinamică fielduri tipate
  function getField<T extends object>(obj: T, field: string): any {
    return (obj as any)[field];
  }
  function setField<T extends object>(obj: T, field: string, value: any): T {
    return { ...obj, [field]: value };
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow" ref={tableRef}>
        <style>{`
          * {
            outline: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          table, tr, td, th {
            outline: none !important;
            border: none !important;
          }
          tr:focus, td:focus, th:focus {
            outline: none !important;
            box-shadow: none !important;
          }
        `}</style>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {filterFields.map((field) => (
                <TableSortHeader key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} field={field} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              ))}
            </tr>
            {/* Filter row */}
            <tr className="bg-white align-middle">
              {filterFields.map((field) => (
                <td key={field} className="px-6 py-2 align-middle">
                  <input
                    type="text"
                    value={pendingFilters[field] || ''}
                    onChange={e => handlePendingFilterChange(field, e.target.value)}
                    onKeyDown={handleFilterKeyDown}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder={`Filter ${field}`}
                    style={{ minWidth: 80 }}
                  />
                </td>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Add row - click to add */}
            <tr
              onClick={handleAddClient}
              className="cursor-pointer hover:bg-blue-50 border-l-4 border-dashed border-blue-300 hover:border-blue-500 transition-all duration-200 bg-gray-50 outline-none focus:outline-none"
              style={{ outline: 'none', border: 'none' }}
            >
              {filterFields.map((field, index) => (
                <td key={field} className="px-6 py-4 text-sm text-gray-500 italic font-medium outline-none focus:outline-none" style={{ outline: 'none' }}>
                  {index === 0 ? '+ Click to add new client...' : ''}
                </td>
              ))}
            </tr>

            {/* Add form row */}
            {isAdding && (
              <tr className="bg-blue-50 border-l-4 border-blue-500" onKeyDown={handleAddKeyDown}>
                {filterFields.map((field) => (
                  <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
                      value={getField(newClient, field) || ''}
                      onChange={e => {
                        setNewClient(setField(newClient, field, e.target.value));
                        if (addFieldErrors[field]) {
                          const { [field]: _, ...rest } = addFieldErrors;
                          setAddFieldErrors(rest);
                        }
                      }}
                      className={`w-full px-2 py-1 border ${addFieldErrors[field] ? 'border-red-500' : 'border-gray-300'} rounded text-sm`}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (['firstName', 'lastName', 'nationalId', 'phoneNumber'].includes(field) ? ' *' : '')}
                      disabled={loading}
                      autoFocus={field === 'firstName'}
                    />
                  </td>
                ))}
              </tr>
            )}

            {/* Client rows */}
            {clients.map((client) => (
              <tr
                key={client.id}
                onClick={() => handleRowClick(client)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors outline-none focus:outline-none ${editingId === client.id ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}`}
                style={{ outline: 'none' }}
                onKeyDown={editingId === client.id ? handleEditKeyDown : undefined}
              >
                {filterFields.map((field) => (
                  <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === client.id ? (
                      <input
                        type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
                        value={getField(editData, field) || ''}
                        onChange={e => setEditData(setField(editData, field, e.target.value))}
                        className={`w-full px-2 py-1 border ${editFieldErrors[field] ? 'border-red-500' : 'border-gray-300'} rounded text-sm`}
                        disabled={loading}
                        autoFocus={field === 'firstName'}
                      />
                    ) : (
                      getField(client, field) || (field === 'nationalId' ? '-' : '-')
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {clients.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No clients found. Click the empty row above to add one.
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