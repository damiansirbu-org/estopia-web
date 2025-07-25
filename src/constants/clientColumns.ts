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
    key: 'firstName',
    title: 'First Name',
    searchable: true,
    sortable: true,
    width: 120,
  },
  {
    key: 'lastName', 
    title: 'Last Name',
    searchable: true,
    sortable: true,
    width: 120,
  },
  {
    key: 'nationalId',
    title: 'National ID',
    searchable: true,
    sortable: true,
    width: 120,
  },
  {
    key: 'email',
    title: 'Email',
    searchable: true,
    sortable: true,
    width: 200,
  },
  {
    key: 'phoneNumber',
    title: 'Phone Number',
    searchable: true,
    sortable: true,
    width: 140,
  },
  {
    key: 'address',
    title: 'Address',
    searchable: true,
    sortable: true,
    width: 200,
  },
] as const;

export const EDITABLE_CLIENT_FIELDS = CLIENT_COLUMNS.map(col => col.key);