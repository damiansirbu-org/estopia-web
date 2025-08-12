// Domain Models matching backend DTOs exactly

export interface Client {
  id: number;
  name: string;
  phoneNumber?: string;
  email?: string;
  nationalId?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Asset {
  id: number;
  name: string;
  address: string;
  description?: string;
  surfaceArea?: number;
  roomCount?: number;
  bathroomCount?: number;
  floor?: string;
  assetType?: 'APARTMENT' | 'HOUSE' | 'PARKING';
  constructionYear?: string; // LocalDate in backend
  hasBalcony?: boolean;
  hasParking?: boolean;
  hasElevator?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contract {
  id: number;
  clientId: number;
  assetId: number;
  clientName?: string; // For display purposes
  assetName?: string;  // For display purposes
  startDate: string; // LocalDate in backend
  endDate: string;   // LocalDate in backend
  rentAmount: number;
  amountDeposit: number;
  amountInvestment?: number;
  isActive?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: number;
  assetId: number;
  assetName?: string; // For display purposes
  dueDate: string; // LocalDate in backend
  amountRent: number;
  amountMaintenance?: number;
  amountNaturalGas?: number;
  amountElectricity?: number;
  amountWater?: number;
  amountOther?: number;
  amountInvestment?: number;
  amountTotal?: number; // Calculated in backend - sum of all amounts except amountPaid
  amountPaid?: number;
  amountRemaining?: number; // UI-only calculated field: amountTotal - amountPaid
  isPaid?: boolean;
  paymentDate?: string; // LocalDate in backend
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'USER';
  clientId?: number;
  clientName?: string; // For display purposes
  isActive?: boolean;
  mustEnroll: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Filter DTOs for advanced filtering (matching backend)
export interface ClientFilterDTO {
  include?: Partial<Client>;
  exclude?: Partial<Client>;
}

export interface AssetFilterDTO {
  include?: Partial<Asset>;
  exclude?: Partial<Asset>;
}

export interface ContractFilterDTO {
  include?: Partial<Contract>;
  exclude?: Partial<Contract>;
}

export interface PaymentFilterDTO {
  include?: Partial<Payment>;
  exclude?: Partial<Payment>;
}

export interface UserFilterDTO {
  include?: Partial<User>;
  exclude?: Partial<User>;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Error types
export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}

// Request types for API calls
export type CreateClientRequest = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateClientRequest = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateAssetRequest = Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAssetRequest = Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateContractRequest = Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateContractRequest = Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>;

export type CreatePaymentRequest = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePaymentRequest = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string };
export type UpdateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password?: string };

// Notification types
export type NotificationType = 'error' | 'success' | 'info';

export interface Notification {
  type: NotificationType;
  message: string;
}