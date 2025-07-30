import { Modal, Table, Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import type { ColumnsType } from 'antd/es/table/interface';

interface SelectionModalProps<T> {
  visible: boolean;
  title: string;
  data: T[];
  columns: ColumnsType<T>;
  onSelect: (record: T) => void;
  onCancel: () => void;
  rowKey: keyof T;
}

export default function SelectionModal<T extends Record<string, any>>({ // eslint-disable-line @typescript-eslint/no-explicit-any
  visible,
  title,
  data,
  columns,
  onSelect,
  onCancel,
  rowKey,
}: SelectionModalProps<T>) {
  const [searchText, setSearchText] = useState('');

  // Filter data based on search text
  const filteredData = useMemo(() => {
    if (!searchText || !data) return data || [];
    
    return data.filter(item =>
      Object.values(item).some(value => 
        value != null && String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [data, searchText]);

  const handleRowClick = (record: T) => {
    onSelect(record);
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
      width={800}
      style={{ top: 20 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Input
          placeholder={`Search ${title.toLowerCase()}...`}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        
        <Table<T>
          dataSource={filteredData}
          columns={columns}
          rowKey={rowKey as string}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          size="small"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' },
          })}
          rowHoverable
        />
      </Space>
    </Modal>
  );
}