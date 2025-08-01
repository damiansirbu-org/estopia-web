import type { Payment } from '../types/models';
import type { EntityColumnConfig } from '../types/entity/entityConfig';

export type PaymentColumnConfig = EntityColumnConfig<Payment>;

export const PAYMENT_COLUMNS: readonly PaymentColumnConfig[] = [
  { key: 'assetName', title: 'Asset', searchable: true, sortable: true, width: 150 },
  { key: 'dueDate', title: 'Due Date', searchable: true, sortable: true, width: 120 },
  { key: 'amountRent', title: 'Rent Amount', searchable: true, sortable: true, width: 120 },
  { key: 'amountInvestment', title: 'Investment Amount', searchable: true, sortable: true, width: 140 },
  { key: 'amountMaintenance', title: 'Maintenance', searchable: true, sortable: true, width: 120 },
  { key: 'amountNaturalGas', title: 'Natural Gas', searchable: true, sortable: true, width: 120 },
  { key: 'amountElectricity', title: 'Electricity', searchable: true, sortable: true, width: 120 },
  { key: 'amountWater', title: 'Water', searchable: true, sortable: true, width: 100 },
  { key: 'amountOther', title: 'Other', searchable: true, sortable: true, width: 100 },
  { key: 'amountTotal', title: 'Total Amount', searchable: false, sortable: true, width: 120 },
  { key: 'amountPaid', title: 'Paid Amount', searchable: true, sortable: true, width: 120 },
  { key: 'amountRemaining', title: 'Remaining', searchable: false, sortable: false, width: 120 },
  { key: 'isPaid', title: 'Paid', searchable: true, sortable: true, width: 80 },
  { key: 'paymentDate', title: 'Payment Date', searchable: true, sortable: true, width: 120 },
  { key: 'notes', title: 'Notes', searchable: true, sortable: false, width: 200 },
] as const;