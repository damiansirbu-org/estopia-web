import EntityList from './generic/EntityList';
import { assetEntityConfig } from '../config/entities/assetEntity';

export default function AssetList() {
    return <EntityList config={assetEntityConfig} />;
}