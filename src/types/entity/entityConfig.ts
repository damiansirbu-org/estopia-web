import type { FilterType } from '../../components/common/ColumnFilterPopover';
import type React from 'react';

// Base entity interface - all entities must extend this
export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

// Column configuration for each entity field
export interface EntityColumnConfig<T extends BaseEntity> {
  key: keyof T;
  title: string;
  searchable: boolean;
  sortable: boolean;
  width?: number;
  required?: boolean;
  customRenderer?: (record: T, editing: boolean) => React.ReactNode;
}

// Service interface that all entity services must implement
export interface EntityService<T extends BaseEntity, CreateT, UpdateT> {
  getAll(params?: { 
    filters?: Record<string, { type: FilterType; value: string }>; 
    sortField?: string; 
    sortDirection?: 'asc' | 'desc' 
  }): Promise<T[]>;
  create(data: CreateT): Promise<T>;
  update(id: number, data: UpdateT): Promise<T>;
  delete(id: number): Promise<void>;
}

// Main entity configuration
export interface EntityConfig<T extends BaseEntity, CreateT = Omit<T, 'id' | 'createdAt' | 'updatedAt'>, UpdateT = CreateT> {
  name: string;                                    // Singular name (e.g., "Client")
  pluralName: string;                             // Plural name (e.g., "Clients")
  columns: readonly EntityColumnConfig<T>[];      // Column definitions
  service: EntityService<T, CreateT, UpdateT>;    // API service
  createEmpty: () => T;                           // Factory function for new entities
}

// Filter and sort parameters
export interface FilterSortParams {
  filters?: Record<string, { type: FilterType; value: string }>;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}