import React from 'react';
import { Checkbox, Form, Select } from 'antd';
import type { User } from '../types/models';
import ClientSelector from '../components/ClientSelector';

export interface UserColumnConfig {
  key: keyof User;
  title: string;
  searchable: boolean;
  sortable: boolean;
  width?: number;
  customRenderer?: (record: User, editing: boolean, fieldErrors?: Record<string, string>, triggerChangeDetection?: () => void) => React.ReactNode;
}

export const USER_COLUMNS: readonly UserColumnConfig[] = [
  {
    key: 'username',
    title: 'Username',
    searchable: true,
    sortable: true,
    width: 150,
  },
  {
    key: 'fullName',
    title: 'Full Name',
    searchable: true,
    sortable: true,
    width: 200,
  },
  {
    key: 'email',
    title: 'Email',
    searchable: true,
    sortable: true,
    width: 200,
  },
  {
    key: 'role',
    title: 'Role',
    searchable: true,
    sortable: true,
    width: 100,
    customRenderer: (record: User, editing: boolean, fieldErrors?: Record<string, string>, triggerChangeDetection?: () => void) => {
      const error = fieldErrors?.[record.role as keyof typeof fieldErrors];
      
      if (editing) {
        return (
          <Form.Item
            name="role"
            style={{ margin: 0 }}
            validateStatus={error ? 'error' : ''}
            help={error}
          >
            <Select
              onChange={triggerChangeDetection}
              placeholder="Select role"
            >
              <Select.Option value="USER">USER</Select.Option>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
            </Select>
          </Form.Item>
        );
      }
      return record.role || '';
    },
  },
  {
    key: 'clientId',
    title: 'Client',
    searchable: false,
    sortable: false,
    width: 200,
    customRenderer: (record: User, editing: boolean, fieldErrors?: Record<string, string>, triggerChangeDetection?: () => void) => {
      const error = fieldErrors?.['clientId'];
      
      if (editing && record.role === 'USER') {
        return (
          <ClientSelector
            value={record.clientId}
            onChange={triggerChangeDetection}
            error={error}
            required={true}
          />
        );
      }
      
      // Show client name in view mode  
      return record.clientName || (record.role === 'ADMIN' ? '-' : 'No client assigned');
    },
  },
  {
    key: 'mustResetPassword',
    title: 'Reset Password',
    searchable: false,
    sortable: true,
    width: 120,
    customRenderer: (record: User, editing: boolean, fieldErrors?: Record<string, string>, triggerChangeDetection?: () => void) => {
      const error = fieldErrors?.['mustResetPassword'];
      
      if (editing) {
        return (
          <Form.Item
            name="mustResetPassword"
            style={{ margin: 0 }}
            validateStatus={error ? 'error' : ''}
            help={error}
            valuePropName="checked"
          >
            <Checkbox
              onChange={triggerChangeDetection}
            />
          </Form.Item>
        );
      }
      return record.mustResetPassword ? 'Yes' : 'No';
    },
  },
  {
    key: 'isActive',
    title: 'Active',
    searchable: false,
    sortable: true,
    width: 100,
    customRenderer: (record: User, editing: boolean, fieldErrors?: Record<string, string>, triggerChangeDetection?: () => void) => {
      const error = fieldErrors?.['isActive'];
      
      if (editing) {
        return (
          <Form.Item
            name="isActive"
            style={{ margin: 0 }}
            validateStatus={error ? 'error' : ''}
            help={error}
            valuePropName="checked"
          >
            <Checkbox
              onChange={triggerChangeDetection}
            />
          </Form.Item>
        );
      }
      return record.isActive ? 'Yes' : 'No';
    },
  },
] as const;

export const EDITABLE_USER_FIELDS = USER_COLUMNS.map(col => col.key);