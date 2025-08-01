import { useRef } from 'react';
import { Form, Select, DatePicker } from 'antd';
import EntityList from './generic/EntityList';
import { assetEntityConfig } from '../config/entities/assetEntity';
import { DATE_FORMAT, parseDate, formatDate } from '../utils/dateUtils';
import type { Asset } from '../types/models';

const { Option } = Select;

export default function AssetList() {
  const formRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  
  // Enhanced asset config with custom renderers
  const enhancedAssetConfig = {
    ...assetEntityConfig,
    columns: assetEntityConfig.columns.map(column => {
      if (column.key === 'assetType') {
        return {
          ...column,
          customRenderer: (record: Asset, editing: boolean, fieldErrors?: Record<string, string>, triggerChangeDetection?: () => void) => {
            if (!editing) {
              return record.assetType || '';
            }
            
            return (
              <Form.Item 
                name="assetType" 
                style={{ margin: 0 }}
                validateStatus={fieldErrors?.assetType ? 'error' : ''}
                getValueProps={(value) => ({ value })}
              >
                <Select 
                  placeholder="Select asset type" 
                  style={{ width: '100%' }}
                  onChange={triggerChangeDetection}
                >
                  <Option value="APARTMENT">Apartment</Option>
                  <Option value="HOUSE">House</Option>
                  <Option value="PARKING">Parking</Option>
                </Select>
              </Form.Item>
            );
          },
        };
      }
      
      if (column.key === 'constructionYear') {
        return {
          ...column,
          customRenderer: (record: Asset, editing: boolean, fieldErrors?: Record<string, string>, triggerChangeDetection?: () => void) => {
            if (!editing) {
              return record.constructionYear || '';
            }
            
            const error = fieldErrors?.[column.key as string];
            
            return (
              <Form.Item 
                name={column.key} 
                style={{ margin: 0 }}
                validateStatus={error ? 'error' : ''}
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
                  placeholder="Select construction date"
                  picker="date"
                  onChange={triggerChangeDetection}
                />
              </Form.Item>
            );
          },
        };
      }
      
      return column;
    }),
  };

  return <EntityList config={enhancedAssetConfig} formRef={formRef} />;
}