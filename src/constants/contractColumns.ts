import type { Contract } from '../types/models';
import type { EntityColumnConfig } from '../types/entity/entityConfig';

export type ContractColumnConfig = EntityColumnConfig<Contract>;

export const CONTRACT_COLUMNS: readonly ContractColumnConfig[] = [
  { key: 'clientName', title: 'Client', searchable: true, sortable: true, width: 150 },
  { key: 'assetName', title: 'Asset', searchable: true, sortable: true, width: 150 },
  { key: 'startDate', title: 'Start Date', searchable: true, sortable: true, width: 120 },
  { key: 'endDate', title: 'End Date', searchable: true, sortable: true, width: 120 },
  { key: 'rentAmount', title: 'Rent Amount', searchable: true, sortable: true, width: 120 },
  { key: 'amountInvestment', title: 'Investment Amount', searchable: true, sortable: true, width: 140 },
  { key: 'amountDeposit', title: 'Deposit', searchable: true, sortable: true, width: 120 },
  { key: 'isActive', title: 'Active', searchable: true, sortable: true, width: 80 },
  { key: 'notes', title: 'Notes', searchable: true, sortable: false, width: 200 },
] as const;