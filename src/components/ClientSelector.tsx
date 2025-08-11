import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import type { Client } from '../types/models';
import { clientService } from '../services/api';

interface ClientSelectorProps {
  value?: number;
  onChange?: (value: number) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export default function ClientSelector({ 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder = "Select client" 
}: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    clientService.getAllClients()
      .then(clientsData => setClients(clientsData))
      .catch(err => console.error('Failed to load clients:', err))
      .finally(() => setLoading(false));
  }, []);
  
  return (
    <Form.Item
      name="clientId"
      style={{ margin: 0 }}
      validateStatus={error ? 'error' : ''}
      help={error}
      rules={required ? [{ required: true, message: 'Client is required for USER role' }] : []}
    >
      <Select
        loading={loading}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        showSearch
        allowClear
        filterOption={(input, option) =>
          (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
        }
        options={clients.map(client => ({
          value: client.id,
          label: client.name
        }))}
      />
    </Form.Item>
  );
}