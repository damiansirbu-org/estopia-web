import type { Payment } from '../types/models';
import type { EntityColumnConfig } from '../types/entity/entityConfig';

export type PaymentColumnConfig = EntityColumnConfig<Payment>;

export const getPaymentColumns = (t: (key: string) => string): readonly PaymentColumnConfig[] => [
  { key: 'assetName', title: t('table.asset'), searchable: true, sortable: true, width: 150 },
  { key: 'dueDate', title: t('table.dueDate'), searchable: true, sortable: true, width: 120 },
  { key: 'amountRent', title: t('table.rentAmount'), searchable: true, sortable: true, width: 120 },
  { key: 'amountInvestment', title: t('table.investment'), searchable: true, sortable: true, width: 140 },
  { key: 'amountMaintenance', title: t('table.maintenance'), searchable: true, sortable: true, width: 120 },
  { key: 'amountNaturalGas', title: t('table.naturalGas'), searchable: true, sortable: true, width: 120 },
  { key: 'amountElectricity', title: t('table.electricity'), searchable: true, sortable: true, width: 120 },
  { key: 'amountWater', title: t('table.water'), searchable: true, sortable: true, width: 100 },
  { key: 'amountOther', title: t('table.other'), searchable: true, sortable: true, width: 100 },
  { key: 'amountTotal', title: t('table.total'), searchable: false, sortable: true, width: 120 },
  { key: 'amountPaid', title: t('table.paid'), searchable: true, sortable: true, width: 120 },
  { key: 'amountRemaining', title: t('table.remaining'), searchable: false, sortable: false, width: 120 },
  { key: 'isPaid', title: t('table.isPaid'), searchable: true, sortable: true, width: 80 },
  { key: 'paymentDate', title: t('table.paymentDate'), searchable: true, sortable: true, width: 120 },
  { key: 'notes', title: t('table.notes'), searchable: true, sortable: false, width: 200 },
] as const;

// Fallback for backward compatibility
export const PAYMENT_COLUMNS: readonly PaymentColumnConfig[] = getPaymentColumns((key: string) => {
  const fallbacks: Record<string, string> = {
    'table.asset': 'Asset',
    'table.dueDate': 'Due Date',
    'table.rentAmount': 'Rent Amount',
    'table.investment': 'Investment Amount',
    'table.maintenance': 'Maintenance',
    'table.naturalGas': 'Natural Gas',
    'table.electricity': 'Electricity',
    'table.water': 'Water',
    'table.other': 'Other',
    'table.total': 'Total',
    'table.paid': 'Paid Amount',
    'table.remaining': 'Remaining',
    'table.isPaid': 'Is Paid',
    'table.paymentDate': 'Payment Date',
    'table.notes': 'Notes',
  };
  return fallbacks[key] || key;
});