import type { Payment } from '../types/models';
import type { EntityColumnConfig } from '../types/entity/entityConfig';

export type PaymentColumnConfig = EntityColumnConfig<Payment>;

export const PAYMENT_COLUMNS: readonly PaymentColumnConfig[] = [
  { key: 'assetName', title: 'label.form.assetId', searchable: true, sortable: true, width: 150 },
  { key: 'dueDate', title: 'label.form.dueDate', searchable: true, sortable: true, width: 120 },
  { key: 'amountRent', title: 'label.form.amountRent', searchable: true, sortable: true, width: 120 },
  { key: 'amountInvestment', title: 'label.form.amountInvestment', searchable: true, sortable: true, width: 140 },
  { key: 'amountMaintenance', title: 'label.form.amountMaintenance', searchable: true, sortable: true, width: 120 },
  { key: 'amountNaturalGas', title: 'label.form.amountNaturalGas', searchable: true, sortable: true, width: 120 },
  { key: 'amountElectricity', title: 'label.form.amountElectricity', searchable: true, sortable: true, width: 120 },
  { key: 'amountWater', title: 'label.form.amountWater', searchable: true, sortable: true, width: 100 },
  { key: 'amountOther', title: 'label.form.amountOther', searchable: true, sortable: true, width: 100 },
  { key: 'amountTotal', title: 'label.form.amountTotal', searchable: false, sortable: true, width: 120 },
  { key: 'amountPaid', title: 'label.form.amountPaid', searchable: true, sortable: true, width: 120 },
  { key: 'amountRemaining', title: 'label.form.amountRemaining', searchable: false, sortable: false, width: 120 },
  { key: 'isPaid', title: 'label.form.isPaid', searchable: true, sortable: true, width: 80 },
  { key: 'paymentDate', title: 'label.form.paymentDate', searchable: true, sortable: true, width: 120 },
  { key: 'notes', title: 'label.form.notes', searchable: true, sortable: false, width: 200 },
] as const;