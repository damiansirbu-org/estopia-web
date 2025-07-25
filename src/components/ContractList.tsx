
import EntityList from './generic/EntityList';
import { contractEntityConfig } from '../config/entities/contractEntity';

export default function ContractList() {
  return <EntityList config={contractEntityConfig} />;
}