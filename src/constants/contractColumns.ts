import type { Contract } from '../types/models';
import type { EntityColumnConfig } from '../types/entity/entityConfig';

export type ContractColumnConfig = EntityColumnConfig<Contract>;

export const CONTRACT_COLUMNS: readonly ContractColumnConfig[] = [
  { key: 'clientName', title: 'label.form.clientId', searchable: true, sortable: true, width: 150 },
  { key: 'assetName', title: 'label.form.assetId', searchable: true, sortable: true, width: 150 },
  { key: 'startDate', title: 'label.form.startDate', searchable: true, sortable: true, width: 120 },
  { key: 'endDate', title: 'label.form.endDate', searchable: true, sortable: true, width: 120 },
  { key: 'rentAmount', title: 'label.form.rentAmount', searchable: true, sortable: true, width: 120 },
  { key: 'amountInvestment', title: 'label.form.amountInvestment', searchable: true, sortable: true, width: 140 },
  { key: 'amountDeposit', title: 'label.form.amountDeposit', searchable: true, sortable: true, width: 120 },
  { key: 'isActive', title: 'label.form.isActive', searchable: true, sortable: true, width: 80 },
  { key: 'notes', title: 'label.form.notes', searchable: true, sortable: false, width: 200 },
] as const;