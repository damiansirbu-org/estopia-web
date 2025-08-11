import type { Client } from '../types/models';

export interface ClientColumnConfig {
  key: keyof Client;
  title: string;
  searchable: boolean;
  sortable: boolean;
  width?: number;
}

export const CLIENT_COLUMNS: readonly ClientColumnConfig[] = [
  {
    key: 'name',
    title: 'label.form.name',
    searchable: true,
    sortable: true,
    width: 200,
  },
  {
    key: 'nationalId',
    title: 'label.form.nationalId',
    searchable: true,
    sortable: true,
    width: 120,
  },
  {
    key: 'email',
    title: 'label.form.email',
    searchable: true,
    sortable: true,
    width: 200,
  },
  {
    key: 'phoneNumber',
    title: 'label.form.phoneNumber',
    searchable: true,
    sortable: true,
    width: 140,
  },
  {
    key: 'address',
    title: 'label.form.address',
    searchable: true,
    sortable: true,
    width: 200,
  },
] as const;

export const EDITABLE_CLIENT_FIELDS = CLIENT_COLUMNS.map(col => col.key);