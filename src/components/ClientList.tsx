import EntityList from './generic/EntityList';
import { clientEntityConfig } from '../config/entities/clientEntity';

export default function ClientList() {
    return <EntityList config={clientEntityConfig} />;
}