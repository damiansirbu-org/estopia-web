import type { FilterType } from '../components/common/ColumnFilterPopover';
import type {
  Asset,
  Client,
  Contract,
  CreateAssetRequest,
  CreateClientRequest,
  CreateContractRequest,
  CreatePaymentRequest,
  Payment,
  UpdateAssetRequest,
  UpdateClientRequest,
  UpdateContractRequest,
  UpdatePaymentRequest
} from '../types/models';
import { apiCall } from '../utils/ErrorHandler';

// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Client API Service
export const clientService = {
  async getAllClients(params?: { filters?: Record<string, { type: FilterType, value: string }>, sortField?: string, sortDirection?: 'asc' | 'desc' }): Promise<Client[]> {
    if (params && params.filters && Object.keys(params.filters).length > 0) {
      // Use POST /api/clients/filter for filtering
      const filterDTO = { filters: params.filters };
      // Build query string for sort params
      const query: string[] = [];
      if (params.sortField) query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      if (params.sortDirection) query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      return apiCall(() =>
        fetch(`${API_BASE_URL}/clients/filter${queryString}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filterDTO),
        })
      );
    } else {
      // No filters: use GET /api/clients with optional sort params
      const query: string[] = [];
      if (params?.sortField) {
        query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      }
      if (params?.sortDirection) {
        query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      }
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      return apiCall(() =>
        fetch(`${API_BASE_URL}/clients${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    }
  },

  async createClient(client: CreateClientRequest): Promise<Client> {
    // Debug: log what we're sending
    console.log('🔍 Sending client data to backend:', client);

    return apiCall(() =>
      fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      })
    );
  },

  async updateClient(id: number, client: UpdateClientRequest): Promise<Client> {
    // Debug: log what we're updating
    console.log('🔍 Updating client data:', { id, client });

    return apiCall(() =>
      fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      })
    );
  },

  async deleteClient(id: number): Promise<void> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  },

  async getClientById(id: number): Promise<Client> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }
};

// Asset API Service
export const assetService = {
  async getAllAssets(): Promise<Asset[]> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/assets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  },

  async createAsset(asset: CreateAssetRequest): Promise<Asset> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asset),
      })
    );
  },

  async updateAsset(id: number, asset: UpdateAssetRequest): Promise<Asset> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/assets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asset),
      })
    );
  },

  async deleteAsset(id: number): Promise<void> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/assets/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }
};

// Contract API Service
export const contractService = {
  async getAllContracts(): Promise<Contract[]> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/contracts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  },

  async createContract(contract: CreateContractRequest): Promise<Contract> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contract),
      })
    );
  },

  async updateContract(id: number, contract: UpdateContractRequest): Promise<Contract> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/contracts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contract),
      })
    );
  },

  async deleteContract(id: number): Promise<void> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/contracts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }
};

// Payment API Service
export const paymentService = {
  async getAllPayments(): Promise<Payment[]> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/payments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  },

  async createPayment(payment: CreatePaymentRequest): Promise<Payment> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      })
    );
  },

  async updatePayment(id: number, payment: UpdatePaymentRequest): Promise<Payment> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      })
    );
  },

  async deletePayment(id: number): Promise<void> {
    return apiCall(() =>
      fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }
};

// Backward compatibility
export default clientService;