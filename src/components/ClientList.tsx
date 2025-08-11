import { useTranslation } from 'react-i18next';
import EntityList from './generic/EntityList';
import { getClientEntityConfig } from '../config/entities/clientEntity';

export default function ClientList() {
    const { t } = useTranslation();
    const translatedClientConfig = getClientEntityConfig(t);
    
    return <EntityList config={translatedClientConfig} />;
}