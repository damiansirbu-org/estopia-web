
import { useState, useRef } from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';
import EntityList from './generic/EntityList';
import ClientSelectionModal from './common/ClientSelectionModal';
import AssetSelectionModal from './common/AssetSelectionModal';
import { contractEntityConfig } from '../config/entities/contractEntity';
import { DATE_FORMAT, parseDate, formatDate } from '../utils/dateUtils';
import type { Contract, Client, Asset } from '../types/models';

export default function ContractList() {
  const [clientModalVisible, setClientModalVisible] = useState(false);
  const [assetModalVisible, setAssetModalVisible] = useState(false);
  const formRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const handleClientSelect = (client: Client) => {
    if (formRef.current) {
      formRef.current.setFieldsValue({
        clientName: `${client.firstName} ${client.lastName}`,
        clientId: client.id,
      });
    }
    setClientModalVisible(false);
  };

  const handleAssetSelect = (asset: Asset) => {
    if (formRef.current) {
      formRef.current.setFieldsValue({
        assetName: asset.name,
        assetId: asset.id,
      });
    }
    setAssetModalVisible(false);
  };

  // Enhanced contract config with custom renderers
  const enhancedContractConfig = {
    ...contractEntityConfig,
    columns: contractEntityConfig.columns.map(column => {
      if (column.key === 'clientName') {
        return {
          ...column,
          customRenderer: (record: Contract, editing: boolean, fieldErrors?: Record<string, string>) => {
            if (!editing) {
              return record.clientName || `Client ID: ${record.clientId}`;
            }
            
            return (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Form.Item 
                  name="clientName" 
                  style={{ margin: 0, flex: 1 }}
                  validateStatus={fieldErrors?.clientId ? 'error' : ''}
                  help={fieldErrors?.clientId}
                >
                  <Input
                    placeholder="Select client..."
                    readOnly
                    style={{ cursor: 'pointer' }}
                  />
                </Form.Item>
                <Form.Item name="clientId" hidden>
                  <Input />
                </Form.Item>
                <Button
                  size="small"
                  onClick={() => {
                    setClientModalVisible(true);
                  }}
                >
                  Select
                </Button>
              </div>
            );
          },
        };
      }
      
      if (column.key === 'assetName') {
        return {
          ...column,
          customRenderer: (record: Contract, editing: boolean, fieldErrors?: Record<string, string>) => {
            if (!editing) {
              return record.assetName || `Asset ID: ${record.assetId}`;
            }
            
            return (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Form.Item 
                  name="assetName" 
                  style={{ margin: 0, flex: 1 }}
                  validateStatus={fieldErrors?.assetId ? 'error' : ''}
                  help={fieldErrors?.assetId}
                >
                  <Input
                    placeholder="Select asset..."
                    readOnly
                    style={{ cursor: 'pointer' }}
                  />
                </Form.Item>
                <Form.Item name="assetId" hidden>
                  <Input />
                </Form.Item>
                <Button
                  size="small"
                  onClick={() => {
                    setAssetModalVisible(true);
                  }}
                >
                  Select
                </Button>
              </div>
            );
          },
        };
      }

      if (column.key === 'startDate' || column.key === 'endDate') {
        return {
          ...column,
          customRenderer: (record: Contract, editing: boolean, fieldErrors?: Record<string, string>) => {
            if (!editing) {
              return record[column.key] || '';
            }
            
            return (
              <Form.Item 
                name={column.key} 
                style={{ margin: 0 }}
                rules={[
                  { required: true, message: `${column.key === 'startDate' ? 'Start' : 'End'} date is required` },
                  ...(column.key === 'endDate' ? [
                    ({ getFieldValue }: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
                      validator(_: any, value: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                        const startDate = getFieldValue('startDate');
                        if (!value || !startDate) {
                          return Promise.resolve();
                        }
                        if (dayjs(value).isBefore(dayjs(startDate))) {
                          return Promise.reject(new Error('End date must be after start date'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ] : [])
                ]}
                getValueProps={(value) => ({
                  value: parseDate(value),
                })}
                normalize={(value) => {
                  return value ? formatDate(value) : '';
                }}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format={DATE_FORMAT}
                  placeholder={`Select ${column.key === 'startDate' ? 'start' : 'end'} date`}
                  disabledDate={column.key === 'endDate' ? (current) => {
                    const startDate = formRef.current?.getFieldValue('startDate');
                    return startDate ? current && current.isBefore(dayjs(startDate), 'day') : false;
                  } : undefined}
                />
              </Form.Item>
            );
          },
        };
      }
      
      return column;
    }),
  };

  return (
    <>
      <EntityList config={enhancedContractConfig} formRef={formRef} />
      
      <ClientSelectionModal
        visible={clientModalVisible}
        onSelect={handleClientSelect}
        onCancel={() => setClientModalVisible(false)}
      />
      
      <AssetSelectionModal
        visible={assetModalVisible}
        onSelect={handleAssetSelect}
        onCancel={() => setAssetModalVisible(false)}
      />
    </>
  );
}