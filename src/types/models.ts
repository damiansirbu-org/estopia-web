// Domain Models matching backend DTOs exactly

export interface Client {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  nationalId?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Asset {
  id?: number;
  name: string;
  address: string;
  description?: string;
  surfaceArea?: number;
  roomCount?: number;
  bathroomCount?: number;
  floor?: string;
  assetType?: string;
  constructionYear?: number;
  hasBalcony?: boolean;
  hasParking?: boolean;
  hasElevator?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contract {
  id?: number;
  clientId: number;
  assetId: number;
  startDate: string;
  endDate: string;
  rentAmount: number;
  amountMaintenance?: number;
  amountDeposit: number;
  isActive?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id?: number;
  contractId: number;
  dueDate: string;
  rentAmount: number;
  amountMaintenance?: number;
  amountNaturalGas?: number;
  amountElectricity?: number;
  amountWater?: number;
  amountOther?: number;
  amountPaid?: number;
  isPaid?: boolean;
  paymentDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
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