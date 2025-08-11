import type { Asset } from '../types/models';
import type { EntityColumnConfig } from '../types/entity/entityConfig';

export type AssetColumnConfig = EntityColumnConfig<Asset>;

export const getAssetColumns = (t: (key: string) => string): readonly AssetColumnConfig[] => [
  {
    key: 'name',
    title: t('table.name'),
    searchable: true,
    sortable: true,
    width: 150,
  },
  {
    key: 'address',
    title: t('table.address'),
    searchable: true,
    sortable: true,
    width: 200,
  },
  {
    key: 'assetType',
    title: t('table.type'),
    searchable: true,
    sortable: true,
    width: 100,
  },
  {
    key: 'roomCount',
    title: t('table.rooms'),
    searchable: false,
    sortable: true,
    width: 80,
  },
  {
    key: 'bathroomCount',
    title: t('table.bathrooms'),
    searchable: false,
    sortable: true,
    width: 90,
  },
  {
    key: 'surfaceArea',
    title: t('table.surface'),
    searchable: false,
    sortable: true,
    width: 100,
  },
  {
    key: 'floor',
    title: t('table.floor'),
    searchable: true,
    sortable: true,
    width: 80,
  },
  {
    key: 'constructionYear',
    title: t('table.built'),
    searchable: false,
    sortable: true,
    width: 80,
  },
  {
    key: 'description',
    title: t('table.description'),
    searchable: true,
    sortable: false,
    width: 200,
  },
] as const;

// Fallback for backward compatibility - uses English labels
export const ASSET_COLUMNS: readonly AssetColumnConfig[] = getAssetColumns((key: string) => {
  const fallbacks: Record<string, string> = {
    'table.name': 'Name',
    'table.address': 'Address',
    'table.type': 'Type',
    'table.rooms': 'Rooms',
    'table.bathrooms': 'Bathrooms',
    'table.surface': 'Surface (m²)',
    'table.floor': 'Floor',
    'table.built': 'Built',
    'table.description': 'Description',
  };
  return fallbacks[key] || key;
});

export const EDITABLE_ASSET_FIELDS = ASSET_COLUMNS.map(col => col.key);