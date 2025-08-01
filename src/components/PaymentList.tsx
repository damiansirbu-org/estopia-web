
import { useState, useRef } from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import EntityList from './generic/EntityList';
import AssetSelectionModal from './common/AssetSelectionModal';
import { paymentEntityConfig } from '../config/entities/paymentEntity';
import { contractService } from '../services/api';
import { DATE_FORMAT, parseDate, formatDate } from '../utils/dateUtils';
import { useTerminal } from '../context/useTerminal';
import type { Payment, Asset } from '../types/models';

export default function PaymentList() {
  const [assetModalVisible, setAssetModalVisible] = useState(false);
  const formRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const { push } = useTerminal();

  const handleAssetSelect = async (asset: Asset) => {
    if (formRef.current) {
      // Set asset info first
      formRef.current.setFieldsValue({
        assetName: asset.name,
        assetId: asset.id,
      });

      try {
        // Find contracts for this asset
        const contracts = await contractService.getAllContracts();
        const assetContracts = contracts.filter(contract => 
          contract.assetId === asset.id && contract.isActive
        );

        if (assetContracts.length === 0) {
          push(`Nu există contracte active pentru proprietatea: ${asset.name}`, 'error');
        } else if (assetContracts.length > 1) {
          push(`Există mai multe contracte active pentru proprietatea: ${asset.name}. Selectați manual valorile.`, 'error');
        } else {
          // Perfect! One active contract - prefill values
          const contract = assetContracts[0];
          formRef.current.setFieldsValue({
            amountRent: contract.rentAmount,
            amountInvestment: contract.amountInvestment || 0,
          });
          push(`Completat automat: chirie ${contract.rentAmount}, investiții ${contract.amountInvestment || 0}`, 'success');
        }
      } catch (error) {
        push(`Eroare la căutarea contractelor: ${error}`, 'error');
      }
    }
    setAssetModalVisible(false);
  };

  // Enhanced payment config with custom renderers
  const enhancedPaymentConfig = {
    ...paymentEntityConfig,
    columns: paymentEntityConfig.columns.map(column => {
      if (column.key === 'assetName') {
        return {
          ...column,
          customRenderer: (record: Payment, editing: boolean, fieldErrors?: Record<string, string>, _triggerChangeDetection?: () => void) => {
            if (!editing) {
              return record.assetName || `Asset ID: ${record.assetId}`;
            }
            
            return (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Form.Item 
                  name="assetName" 
                  style={{ margin: 0, flex: 1 }}
                  validateStatus={fieldErrors?.assetId ? 'error' : ''}
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
      
      if (column.key === 'dueDate' || column.key === 'paymentDate') {
        return {
          ...column,
          customRenderer: (record: Payment, editing: boolean, fieldErrors?: Record<string, string>, triggerChangeDetection?: () => void) => {
            if (!editing) {
              return record[column.key] || '';
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
                  placeholder={`Select ${column.key === 'dueDate' ? 'due' : 'payment'} date`}
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

  return (
    <>
      <EntityList config={enhancedPaymentConfig} formRef={formRef} />
      
      <AssetSelectionModal
        visible={assetModalVisible}
        onSelect={handleAssetSelect}
        onCancel={() => setAssetModalVisible(false)}
      />
    </>
  );
}