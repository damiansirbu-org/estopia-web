import { CONTRACT_COLUMNS } from '../../constants/contractColumns';
import { contractService } from '../../services/api';
import type { Contract, CreateContractRequest, UpdateContractRequest } from '../../types/models';
import type { EntityConfig, EntityService } from '../../types/entity/entityConfig';

// Create empty contract for new records
const createEmptyContract = (): Contract => ({
  id: 0, // This will be overridden with negative ID in EntityList
  clientId: null as unknown as number, // Will be set when client is selected
  assetId: null as unknown as number,  // Will be set when asset is selected
  clientName: '',
  assetName: '',
  startDate: '',
  endDate: '',
  rentAmount: 0,
  amountDeposit: 0,
  amountInvestment: undefined,
  isActive: true,
  notes: '',
});

// Adapter to make contractService compatible with EntityService interface
const contractServiceAdapter: EntityService<Contract, CreateContractRequest, UpdateContractRequest> = {
  getAll: (params) => contractService.getAllContracts(params),
  create: (data) => contractService.createContract(data),
  update: (id, data) => contractService.updateContract(id, data),
  delete: (id) => contractService.deleteContract(id),
};

// Contract entity configuration
export const contractEntityConfig: EntityConfig<Contract, CreateContractRequest, UpdateContractRequest> = {
  name: 'Contract',
  pluralName: 'Contracts',
  columns: CONTRACT_COLUMNS,
  service: contractServiceAdapter,
  createEmpty: createEmptyContract,
};