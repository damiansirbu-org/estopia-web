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
import type { ApiResponse } from '../utils/ErrorHandler';
import { apiCall } from '../utils/ErrorHandler';

// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Client API Service
export const clientService = {
  async getAllClients(params?: { filters?: Record<string, { type: FilterType, value: string }>, sortField?: string, sortDirection?: 'asc' | 'desc' }): Promise<Client[]> {
    let response: ApiResponse<Client[]>;
    if (params && params.filters && Object.keys(params.filters).length > 0) {
      // Use POST /api/clients/filter for filtering
      const filterDTO = { filters: params.filters };
      // Build query string for sort params
      const query: string[] = [];
      if (params.sortField) query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      if (params.sortDirection) query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      response = await apiCall(() =>
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
      response = await apiCall(() =>
        fetch(`${API_BASE_URL}/clients${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    }
    if (!response.success) throw new Error(response.message || 'API error');
    return response.data || [];
  },

  async createClient(client: CreateClientRequest): Promise<Client> {
    const response: ApiResponse<Client> = await apiCall(() =>
      fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      })
    );
    return response.data!;
  },

  async updateClient(id: number, client: UpdateClientRequest): Promise<Client> {
    const response: ApiResponse<Client> = await apiCall(() =>
      fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      })
    );
    return response.data!;
  },

  async deleteClient(id: number): Promise<void> {
    const response: ApiResponse<void> = await apiCall(() =>
      fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
    if (!response.success) throw new Error(response.message || 'API error');
  },

  async getClientById(id: number): Promise<Client> {
    const response: ApiResponse<Client> = await apiCall(() =>
      fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
    if (!response.success) throw new Error(response.message || 'API error');
    return response.data!;
  }
};

// Asset API Service
export const assetService = {
  async getAllAssets(params?: { filters?: Record<string, { type: FilterType, value: string }>, sortField?: string, sortDirection?: 'asc' | 'desc' }): Promise<Asset[]> {
    let response: ApiResponse<Asset[]>;
    if (params && params.filters && Object.keys(params.filters).length > 0) {
      // Use POST /api/assets/filter for filtering
      const filterDTO = { filters: params.filters };
      // Build query string for sort params
      const query: string[] = [];
      if (params.sortField) query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      if (params.sortDirection) query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      response = await apiCall(() =>
        fetch(`${API_BASE_URL}/assets/filter${queryString}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filterDTO),
        })
      );
    } else {
      // No filters: use GET /api/assets with optional sort params
      const query: string[] = [];
      if (params?.sortField) {
        query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      }
      if (params?.sortDirection) {
        query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      }
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      response = await apiCall(() =>
        fetch(`${API_BASE_URL}/assets${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    }
    return response.data;
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
  async getAllContracts(params?: { filters?: Record<string, { type: FilterType, value: string }>, sortField?: string, sortDirection?: 'asc' | 'desc' }): Promise<Contract[]> {
    let response: ApiResponse<Contract[]>;
    if (params && params.filters && Object.keys(params.filters).length > 0) {
      // Use POST /api/contracts/filter for filtering
      const filterDTO = { filters: params.filters };
      // Build query string for sort params
      const query: string[] = [];
      if (params.sortField) query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      if (params.sortDirection) query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      response = await apiCall(() =>
        fetch(`${API_BASE_URL}/contracts/filter${queryString}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filterDTO),
        })
      );
    } else {
      // No filters: use GET /api/contracts with optional sort params
      const query: string[] = [];
      if (params?.sortField) {
        query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      }
      if (params?.sortDirection) {
        query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      }
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      response = await apiCall(() =>
        fetch(`${API_BASE_URL}/contracts${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    }
    if (!response.success) throw new Error(response.message || 'API error');
    return response.data || [];
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
  async getAllPayments(params?: { filters?: Record<string, { type: FilterType, value: string }>, sortField?: string, sortDirection?: 'asc' | 'desc' }): Promise<Payment[]> {
    let response: ApiResponse<Payment[]>;
    if (params && params.filters && Object.keys(params.filters).length > 0) {
      // Use POST /api/payments/filter for filtering
      const filterDTO = { filters: params.filters };
      // Build query string for sort params
      const query: string[] = [];
      if (params.sortField) query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      if (params.sortDirection) query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      response = await apiCall(() =>
        fetch(`${API_BASE_URL}/payments/filter${queryString}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filterDTO),
        })
      );
    } else {
      // No filters: use GET /api/payments with optional sort params
      const query: string[] = [];
      if (params?.sortField) {
        query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      }
      if (params?.sortDirection) {
        query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      }
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      response = await apiCall(() =>
        fetch(`${API_BASE_URL}/payments${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    }
    if (!response.success) throw new Error(response.message || 'API error');
    
    // Calculate isPaid for each payment (UI-only field)
    const payments = response.data || [];
    return payments.map(payment => ({
      ...payment,
      isPaid: (payment.amountTotal || 0) <= (payment.amountPaid || 0) && (payment.amountTotal || 0) > 0
    }));
  },

  async createPayment(payment: CreatePaymentRequest): Promise<Payment> {
    const createdPayment = await apiCall<Payment>(() =>
      fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      })
    );
    
    // Calculate isPaid for the created payment (UI-only field)
    return {
      ...createdPayment,
      isPaid: (createdPayment.amountTotal || 0) <= (createdPayment.amountPaid || 0) && (createdPayment.amountTotal || 0) > 0
    };
  },

  async updatePayment(id: number, payment: UpdatePaymentRequest): Promise<Payment> {
    const updatedPayment = await apiCall<Payment>(() =>
      fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      })
    );
    
    // Calculate isPaid for the updated payment (UI-only field)
    return {
      ...updatedPayment,
      isPaid: (updatedPayment.amountTotal || 0) <= (updatedPayment.amountPaid || 0) && (updatedPayment.amountTotal || 0) > 0
    };
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