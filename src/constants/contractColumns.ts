import type { Contract } from '../types/models';
import type { EntityColumnConfig } from '../types/entity/entityConfig';

export type ContractColumnConfig = EntityColumnConfig<Contract>;

export const getContractColumns = (t: (key: string) => string): readonly ContractColumnConfig[] => [
  { key: 'clientName', title: t('table.client'), searchable: true, sortable: true, width: 150 },
  { key: 'assetName', title: t('table.asset'), searchable: true, sortable: true, width: 150 },
  { key: 'startDate', title: t('table.startDate'), searchable: true, sortable: true, width: 120 },
  { key: 'endDate', title: t('table.endDate'), searchable: true, sortable: true, width: 120 },
  { key: 'rentAmount', title: t('table.rentAmount'), searchable: true, sortable: true, width: 120 },
  { key: 'amountInvestment', title: t('table.investment'), searchable: true, sortable: true, width: 140 },
  { key: 'amountDeposit', title: t('table.deposit'), searchable: true, sortable: true, width: 120 },
  { key: 'isActive', title: t('table.active'), searchable: true, sortable: true, width: 80 },
  { key: 'notes', title: t('table.notes'), searchable: true, sortable: false, width: 200 },
] as const;

// Fallback for backward compatibility
export const CONTRACT_COLUMNS: readonly ContractColumnConfig[] = getContractColumns((key: string) => {
  const fallbacks: Record<string, string> = {
    'table.client': 'Client',
    'table.asset': 'Asset',
    'table.startDate': 'Start Date',
    'table.endDate': 'End Date', 
    'table.rentAmount': 'Rent Amount',
    'table.investment': 'Investment Amount',
    'table.deposit': 'Deposit Amount',
    'table.active': 'Active',
    'table.notes': 'Notes',
  };
  return fallbacks[key] || key;
});