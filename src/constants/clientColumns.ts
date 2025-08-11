import type { Client } from '../types/models';

export interface ClientColumnConfig {
  key: keyof Client;
  title: string;
  searchable: boolean;
  sortable: boolean;
  width?: number;
}

export const getClientColumns = (t: (key: string) => string): readonly ClientColumnConfig[] => [
  {
    key: 'name',
    title: t('table.name'),
    searchable: true,
    sortable: true,
    width: 200,
  },
  {
    key: 'nationalId',
    title: t('table.nationalId'),
    searchable: true,
    sortable: true,
    width: 120,
  },
  {
    key: 'email',
    title: t('table.email'),
    searchable: true,
    sortable: true,
    width: 200,
  },
  {
    key: 'phoneNumber',
    title: t('table.phoneNumber'),
    searchable: true,
    sortable: true,
    width: 140,
  },
  {
    key: 'address',
    title: t('table.address'),
    searchable: true,
    sortable: true,
    width: 200,
  },
] as const;

// Fallback for backward compatibility
export const CLIENT_COLUMNS: readonly ClientColumnConfig[] = getClientColumns((key: string) => {
  const fallbacks: Record<string, string> = {
    'table.name': 'Name',
    'table.nationalId': 'National ID (CNP)',
    'table.email': 'Email',
    'table.phoneNumber': 'Phone Number',
    'table.address': 'Address',
  };
  return fallbacks[key] || key;
});

export const EDITABLE_CLIENT_FIELDS = CLIENT_COLUMNS.map(col => col.key);