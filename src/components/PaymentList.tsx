
import EntityList from './generic/EntityList';
import { paymentEntityConfig } from '../config/entities/paymentEntity';

export default function PaymentList() {
  return <EntityList config={paymentEntityConfig} />;
}