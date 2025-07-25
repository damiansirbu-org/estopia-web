import type { Asset } from '../types/models';

export interface AssetColumnConfig {
  key: keyof Asset;
  title: string;
  searchable: boolean;
  sortable: boolean;
  width?: number;
}

export const ASSET_COLUMNS: readonly AssetColumnConfig[] = [
  {
    key: 'name',
    title: 'Name',
    searchable: true,
    sortable: true,
    width: 150,
  },
  {
    key: 'address',
    title: 'Address',
    searchable: true,
    sortable: true,
    width: 200,
  },
  {
    key: 'assetType',
    title: 'Type',
    searchable: true,
    sortable: true,
    width: 100,
  },
  {
    key: 'roomCount',
    title: 'Rooms',
    searchable: false,
    sortable: true,
    width: 80,
  },
  {
    key: 'surfaceArea',
    title: 'Surface (m²)',
    searchable: false,
    sortable: true,
    width: 100,
  },
  {
    key: 'floor',
    title: 'Floor',
    searchable: true,
    sortable: true,
    width: 80,
  },
  {
    key: 'constructionYear',
    title: 'Built',
    searchable: false,
    sortable: true,
    width: 80,
  },
] as const;

export const EDITABLE_ASSET_FIELDS = ASSET_COLUMNS.map(col => col.key);