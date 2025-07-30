import { useEffect, useState } from 'react';
import type { Client } from '../../types/models';
import { clientService } from '../../services/api';
import SelectionModal from './SelectionModal';
import type { ColumnsType } from 'antd/es/table/interface';

interface ClientSelectionModalProps {
  visible: boolean;
  onSelect: (client: Client) => void;
  onCancel: () => void;
}

export default function ClientSelectionModal({
  visible,
  onSelect,
  onCancel,
}: ClientSelectionModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchClients();
    }
  }, [visible]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientService.getAllClients();
      setClients(data || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Client> = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
    },
    {
      title: 'National ID',
      dataIndex: 'nationalId',
      key: 'nationalId',
      width: 120,
    },
  ];

  if (loading) {
    return (
      <SelectionModal<Client>
        visible={visible}
        title="Select Client"
        data={[]}
        columns={columns}
        onSelect={onSelect}
        onCancel={onCancel}
        rowKey="id"
      />
    );
  }

  return (
    <SelectionModal<Client>
      visible={visible}
      title="Select Client"
      data={clients}
      columns={columns}
      onSelect={onSelect}
      onCancel={onCancel}
      rowKey="id"
    />
  );
}