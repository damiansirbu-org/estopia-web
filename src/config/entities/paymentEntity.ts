import { PAYMENT_COLUMNS } from '../../constants/paymentColumns';
import { paymentService } from '../../services/api';
import type { Payment, CreatePaymentRequest, UpdatePaymentRequest } from '../../types/models';
import type { EntityConfig, EntityService } from '../../types/entity/entityConfig';

// Create empty payment for new records
const createEmptyPayment = (): Payment => ({
  id: 0, // This will be overridden with negative ID in EntityList
  assetId: null as unknown as number, // Will be set when asset is selected
  assetName: '',
  dueDate: '',
  amountRent: 0,
  amountMaintenance: undefined,
  amountNaturalGas: undefined,
  amountElectricity: undefined,
  amountWater: undefined,
  amountOther: undefined,
  amountInvestment: undefined,
  amountPaid: undefined,
  isPaid: false,
  paymentDate: undefined,
  notes: '',
});

// Adapter to make paymentService compatible with EntityService interface
const paymentServiceAdapter: EntityService<Payment, CreatePaymentRequest, UpdatePaymentRequest> = {
  getAll: (params) => paymentService.getAllPayments(params),
  create: (data) => paymentService.createPayment(data),
  update: (id, data) => paymentService.updatePayment(id, data),
  delete: (id) => paymentService.deletePayment(id),
};

// Payment entity configuration
export const paymentEntityConfig: EntityConfig<Payment, CreatePaymentRequest, UpdatePaymentRequest> = {
  name: 'Payment',
  pluralName: 'Payments',
  columns: PAYMENT_COLUMNS,
  service: paymentServiceAdapter,
  createEmpty: createEmptyPayment,
};