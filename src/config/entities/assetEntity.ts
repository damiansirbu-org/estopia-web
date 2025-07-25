import { ASSET_COLUMNS } from '../../constants/assetColumns';
import { assetService } from '../../services/api';
import type { Asset, CreateAssetRequest, UpdateAssetRequest } from '../../types/models';
import type { EntityConfig, EntityService } from '../../types/entity/entityConfig';

// Create empty asset for new records
const createEmptyAsset = (): Asset => ({
  id: 0, // This will be overridden with negative ID in EntityList
  name: '',
  address: '',
  description: '',
  surfaceArea: undefined,
  roomCount: undefined,
  bathroomCount: undefined,
  floor: '',
  assetType: '',
  constructionYear: undefined,
  hasBalcony: false,
  hasParking: false,
  hasElevator: false,
});

// Adapter to make assetService compatible with EntityService interface
const assetServiceAdapter: EntityService<Asset, CreateAssetRequest, UpdateAssetRequest> = {
  getAll: (params) => assetService.getAllAssets(params),
  create: (data) => assetService.createAsset(data),
  update: (id, data) => assetService.updateAsset(id, data),
  delete: (id) => assetService.deleteAsset(id),
};

// Asset entity configuration
export const assetEntityConfig: EntityConfig<Asset, CreateAssetRequest, UpdateAssetRequest> = {
  name: 'Asset',
  pluralName: 'Assets',
  columns: ASSET_COLUMNS,
  service: assetServiceAdapter,
  createEmpty: createEmptyAsset,
};