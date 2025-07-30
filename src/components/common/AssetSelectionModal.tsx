import { useEffect, useState } from 'react';
import type { Asset } from '../../types/models';
import { assetService } from '../../services/api';
import SelectionModal from './SelectionModal';
import type { ColumnsType } from 'antd/es/table/interface';

interface AssetSelectionModalProps {
  visible: boolean;
  onSelect: (asset: Asset) => void;
  onCancel: () => void;
}

export default function AssetSelectionModal({
  visible,
  onSelect,
  onCancel,
}: AssetSelectionModalProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [_loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchAssets();
    }
  }, [visible]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await assetService.getAllAssets();
      setAssets(data || []);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Asset> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 250,
    },
    {
      title: 'Type',
      dataIndex: 'assetType',
      key: 'assetType',
      width: 120,
    },
    {
      title: 'Rooms',
      dataIndex: 'roomCount',
      key: 'roomCount',
      width: 80,
    },
    {
      title: 'Surface (m²)',
      dataIndex: 'surfaceArea',
      key: 'surfaceArea',
      width: 100,
    },
  ];

  return (
    <SelectionModal<Asset>
      visible={visible}
      title="Select Asset"
      data={assets}
      columns={columns}
      onSelect={onSelect}
      onCancel={onCancel}
      rowKey="id"
    />
  );
}