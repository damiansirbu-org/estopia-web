import { PAYMENT_COLUMNS, getPaymentColumns } from '../../constants/paymentColumns';
import { paymentService } from '../../services/api';
import type { Payment, CreatePaymentRequest, UpdatePaymentRequest } from '../../types/models';
import type { EntityConfig, EntityService } from '../../types/entity/entityConfig';

// Create empty payment for new records
const createEmptyPayment = (): Payment => ({
  id: 0, // This will be overridden with negative ID in EntityList
  assetId: null as unknown as number, // Will be set when asset is selected
  assetName: '',
  dueDate: null as unknown as string,
  amountRent: 0,
  amountMaintenance: undefined,
  amountNaturalGas: undefined,
  amountElectricity: undefined,
  amountWater: undefined,
  amountOther: undefined,
  amountInvestment: undefined,
  amountTotal: 0, // Will be calculated in backend
  amountPaid: undefined,
  isPaid: false,
  paymentDate: null as unknown as string,
  notes: '',
});

// Adapter to make paymentService compatible with EntityService interface
const paymentServiceAdapter: EntityService<Payment, CreatePaymentRequest, UpdatePaymentRequest> = {
  getAll: (params) => paymentService.getAllPayments(params),
  create: (data) => paymentService.createPayment(data),
  update: (id, data) => paymentService.updatePayment(id, data),
  delete: (id) => paymentService.deletePayment(id),
};

// Payment entity configuration with translation function
export const getPaymentEntityConfig = (t: (key: string) => string): EntityConfig<Payment, CreatePaymentRequest, UpdatePaymentRequest> => ({
  name: 'Payment',
  pluralName: 'Payments',
  columns: getPaymentColumns(t),
  service: paymentServiceAdapter,
  createEmpty: createEmptyPayment,
});

// Fallback for backward compatibility
export const paymentEntityConfig: EntityConfig<Payment, CreatePaymentRequest, UpdatePaymentRequest> = {
  name: 'Payment',
  pluralName: 'Payments',
  columns: PAYMENT_COLUMNS,
  service: paymentServiceAdapter,
  createEmpty: createEmptyPayment,
};