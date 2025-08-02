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
import { apiClient } from '../utils/ErrorHandler';

// Helper type for API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: unknown[];
}

// Helper function to extract data from wrapped API responses
function extractData<T>(apiResponse: ApiResponse<T>): T {
  const timestamp = new Date().toISOString();
  const cacheId = Date.now().toString(36);
  
  console.log(`🔍 [${timestamp}] extractData called with cache ID: ${cacheId}`);
  console.log(`📦 [${cacheId}] Raw API response:`, { 
    apiResponse,
    apiResponseType: typeof apiResponse 
  });
  
  // Detailed debugging for the exact failure point
  console.log(`🔎 [${cacheId}] Checking apiResponse exists:`, !!apiResponse);
  console.log(`🔎 [${cacheId}] Checking apiResponse type:`, typeof apiResponse);
  
  if (!apiResponse || typeof apiResponse !== 'object') {
    console.error(`❌ [${cacheId}] Invalid API response format - apiResponse:`, apiResponse, 'type:', typeof apiResponse);
    throw new Error('Invalid API response format');
  }
  
  console.log(`🔎 [${cacheId}] Checking apiResponse.success:`, apiResponse.success);
  
  if (!apiResponse.success) {
    console.error(`❌ [${cacheId}] API returned success=false:`, apiResponse);
    throw new Error(apiResponse.message || 'API request failed');
  }
  
  console.log(`🔎 [${cacheId}] Checking apiResponse.data:`, apiResponse.data);
  console.log(`✅ [${cacheId}] Successfully extracting data:`, apiResponse.data);
  return apiResponse.data;
}

// Client API Service
export const clientService = {
  async getAllClients(params?: { filters?: Record<string, { type: FilterType, value: string }>, sortField?: string, sortDirection?: 'asc' | 'desc' }): Promise<Client[]> {
    console.log('🚀 getAllClients called with params:', params);
    try {
      if (params && params.filters && Object.keys(params.filters).length > 0) {
      // Use POST /api/clients/filter for filtering
      const filterDTO = { filters: params.filters };
      // Build query string for sort params
      const query: string[] = [];
      if (params.sortField) query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      if (params.sortDirection) query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      const response = await apiClient.post(`/clients/filter${queryString}`, filterDTO);
      return extractData<Client[]>(response);
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
        const response = await apiClient.get(`/clients${queryString}`);
        return extractData<Client[]>(response);
      }
    } catch (error) {
      console.error('❌ getAllClients error:', error);
      throw error;
    }
  },

  async getClientById(id: number): Promise<Client> {
    const response = await apiClient.get(`/clients/${id}`);
    return extractData<Client>(response);
  },

  async createClient(client: CreateClientRequest): Promise<Client> {
    const response = await apiClient.post('/clients', client);
    return extractData<Client>(response);
  },

  async updateClient(id: number, client: UpdateClientRequest): Promise<Client> {
    const response = await apiClient.put(`/clients/${id}`, client);
    return extractData<Client>(response);
  },

  async deleteClient(id: number): Promise<void> {
    await apiClient.delete(`/clients/${id}`);
  }
};

// Asset API Service
export const assetService = {
  async getAllAssets(params?: { filters?: Record<string, { type: FilterType, value: string }>, sortField?: string, sortDirection?: 'asc' | 'desc' }): Promise<Asset[]> {
    const cacheId = Date.now().toString(36);
    console.log(`🚀 [${cacheId}] assetService.getAllAssets called with params:`, params);
    
    try {
      if (params && params.filters && Object.keys(params.filters).length > 0) {
        // Use POST /api/assets/filter for filtering
        const filterDTO = { filters: params.filters };
        // Build query string for sort params
        const query: string[] = [];
        if (params.sortField) query.push(`sortField=${encodeURIComponent(params.sortField)}`);
        if (params.sortDirection) query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
        const queryString = query.length > 0 ? `?${query.join('&')}` : '';
        const url = `/assets/filter${queryString}`;
        console.log(`📡 [${cacheId}] Making POST request to:`, url, 'with body:', filterDTO);
        const response = await apiClient.post(url, filterDTO);
        return extractData<Asset[]>(response);
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
        const url = `/assets${queryString}`;
        console.log(`📡 [${cacheId}] Making GET request to:`, url);
        const response = await apiClient.get(url);
        return extractData<Asset[]>(response);
      }
    } catch (error) {
      console.error(`❌ [${cacheId}] assetService.getAllAssets error:`, error);
      throw error;
    }
  },

  async getAssetById(id: number): Promise<Asset> {
    const response = await apiClient.get(`/assets/${id}`);
    return extractData<Asset>(response);
  },

  async createAsset(asset: CreateAssetRequest): Promise<Asset> {
    const response = await apiClient.post('/assets', asset);
    return extractData<Asset>(response);
  },

  async updateAsset(id: number, asset: UpdateAssetRequest): Promise<Asset> {
    const response = await apiClient.put(`/assets/${id}`, asset);
    return extractData<Asset>(response);
  },

  async deleteAsset(id: number): Promise<void> {
    await apiClient.delete(`/assets/${id}`);
  }
};

// Contract API Service
export const contractService = {
  async getAllContracts(params?: { filters?: Record<string, { type: FilterType, value: string }>, sortField?: string, sortDirection?: 'asc' | 'desc' }): Promise<Contract[]> {
    if (params && params.filters && Object.keys(params.filters).length > 0) {
      // Use POST /api/contracts/filter for filtering
      const filterDTO = { filters: params.filters };
      // Build query string for sort params
      const query: string[] = [];
      if (params.sortField) query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      if (params.sortDirection) query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      const response = await apiClient.post(`/contracts/filter${queryString}`, filterDTO);
      return extractData<Contract[]>(response);
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
      const response = await apiClient.get(`/contracts${queryString}`);
      return extractData<Contract[]>(response);
    }
  },

  async getContractById(id: number): Promise<Contract> {
    const response = await apiClient.get(`/contracts/${id}`);
    return extractData<Contract>(response);
  },

  async createContract(contract: CreateContractRequest): Promise<Contract> {
    const response = await apiClient.post('/contracts', contract);
    return extractData<Contract>(response);
  },

  async updateContract(id: number, contract: UpdateContractRequest): Promise<Contract> {
    const response = await apiClient.put(`/contracts/${id}`, contract);
    return extractData<Contract>(response);
  },

  async deleteContract(id: number): Promise<void> {
    await apiClient.delete(`/contracts/${id}`);
  }
};

// Payment API Service
export const paymentService = {
  async getAllPayments(params?: { filters?: Record<string, { type: FilterType, value: string }>, sortField?: string, sortDirection?: 'asc' | 'desc' }): Promise<Payment[]> {
    if (params && params.filters && Object.keys(params.filters).length > 0) {
      // Use POST /api/payments/filter for filtering
      const filterDTO = { filters: params.filters };
      // Build query string for sort params
      const query: string[] = [];
      if (params.sortField) query.push(`sortField=${encodeURIComponent(params.sortField)}`);
      if (params.sortDirection) query.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      const response = await apiClient.post(`/payments/filter${queryString}`, filterDTO);
      return extractData<Payment[]>(response);
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
      const response = await apiClient.get(`/payments${queryString}`);
      return extractData<Payment[]>(response);
    }
  },

  async getPaymentById(id: number): Promise<Payment> {
    const response = await apiClient.get(`/payments/${id}`);
    return extractData<Payment>(response);
  },

  async createPayment(payment: CreatePaymentRequest): Promise<Payment> {
    const response = await apiClient.post('/payments', payment);
    return extractData<Payment>(response);
  },

  async updatePayment(id: number, payment: UpdatePaymentRequest): Promise<Payment> {
    const response = await apiClient.put(`/payments/${id}`, payment);
    return extractData<Payment>(response);
  },

  async deletePayment(id: number): Promise<void> {
    await apiClient.delete(`/payments/${id}`);
  }
};