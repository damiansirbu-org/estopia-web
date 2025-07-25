import type { Contract } from '../types/models';
import type { EntityColumnConfig } from '../types/entity/entityConfig';

export type ContractColumnConfig = EntityColumnConfig<Contract>;

export const CONTRACT_COLUMNS: readonly ContractColumnConfig[] = [
  { key: 'clientId', title: 'Client ID', searchable: true, sortable: true, width: 100 },
  { key: 'assetId', title: 'Asset ID', searchable: true, sortable: true, width: 100 },
  { key: 'startDate', title: 'Start Date', searchable: true, sortable: true, width: 120 },
  { key: 'endDate', title: 'End Date', searchable: true, sortable: true, width: 120 },
  { key: 'rentAmount', title: 'Rent Amount', searchable: true, sortable: true, width: 120 },
  { key: 'amountMaintenance', title: 'Maintenance', searchable: true, sortable: true, width: 120 },
  { key: 'amountDeposit', title: 'Deposit', searchable: true, sortable: true, width: 120 },
  { key: 'isActive', title: 'Active', searchable: true, sortable: true, width: 80 },
  { key: 'notes', title: 'Notes', searchable: true, sortable: false, width: 200 },
] as const;