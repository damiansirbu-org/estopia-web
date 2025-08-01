
import { useState, useRef } from 'react';
import { Button, Form, Input, DatePicker, Checkbox, InputNumber } from 'antd';
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

      // amountTotal - readonly, calculated in backend
      if (column.key === 'amountTotal') {
        return {
          ...column,
          customRenderer: (record: Payment, _editing: boolean) => {
            return (
              <span style={{ fontWeight: 'bold' }}>
                {record.amountTotal?.toFixed(2) || '0.00'}
              </span>
            );
          },
        };
      }

      // isPaid - checkbox with auto-fill logic
      if (column.key === 'isPaid') {
        return {
          ...column,
          customRenderer: (record: Payment, editing: boolean, fieldErrors?: Record<string, string>, triggerChangeDetection?: () => void) => {
            if (!editing) {
              // Calculate isPaid based on amountTotal and amountPaid
              const isPaidCalculated = (record.amountTotal || 0) <= (record.amountPaid || 0) && (record.amountTotal || 0) > 0;
              return isPaidCalculated ? 'Yes' : 'No';
            }
            
            // Calculate the current isPaid value based on amounts
            const isPaidCalculated = (record.amountTotal || 0) <= (record.amountPaid || 0) && (record.amountTotal || 0) > 0;
            
            return (
              <Form.Item 
                name="isPaid" 
                style={{ margin: 0 }}
                valuePropName="checked"
                initialValue={isPaidCalculated}
                normalize={(value) => {
                  // Ensure we always have a boolean value
                  return Boolean(value);
                }}
              >
                <Checkbox 
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    
                    if (isChecked && record.amountTotal) {
                      // Auto-fill paid amount with total amount when checked
                      if (formRef.current) {
                        formRef.current.setFieldsValue({
                          amountPaid: record.amountTotal
                        });
                      }
                    } else if (!isChecked) {
                      // When unchecked, set paid amount to 0 (showing full remaining amount)
                      if (formRef.current) {
                        formRef.current.setFieldsValue({
                          amountPaid: 0
                        });
                      }
                    }
                    
                    // Explicitly set the boolean value
                    if (formRef.current) {
                      formRef.current.setFieldsValue({
                        isPaid: isChecked
                      });
                    }
                    
                    if (triggerChangeDetection) triggerChangeDetection();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      // Find the EntityList container and trigger save
                      const tableRow = e.currentTarget.closest('tr');
                      if (tableRow) {
                        // Create a keyboard event that bubbles up to the table
                        const enterEvent = new KeyboardEvent('keydown', {
                          key: 'Enter',
                          bubbles: true,
                          cancelable: true
                        });
                        tableRow.dispatchEvent(enterEvent);
                      }
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      e.stopPropagation();
                      const tableRow = e.currentTarget.closest('tr');
                      if (tableRow) {
                        const escapeEvent = new KeyboardEvent('keydown', {
                          key: 'Escape',
                          bubbles: true,
                          cancelable: true
                        });
                        tableRow.dispatchEvent(escapeEvent);
                      }
                    }
                  }}
                />
              </Form.Item>
            );
          },
        };
      }

      // amountRemaining - readonly, calculated field (amountTotal - amountPaid)
      if (column.key === 'amountRemaining') {
        return {
          ...column,
          customRenderer: (record: Payment, _editing: boolean) => {
            const totalAmount = record.amountTotal || 0;
            const paidAmount = record.amountPaid || 0;
            const remainingAmount = totalAmount - paidAmount;
            
            return (
              <span style={{ 
                color: remainingAmount > 0 ? 'red' : 'inherit',
                fontWeight: remainingAmount > 0 ? 'bold' : 'normal'
              }}>
                {remainingAmount.toFixed(2)}
              </span>
            );
          },
        };
      }

      // amountPaid - number input with remaining calculation
      if (column.key === 'amountPaid') {
        return {
          ...column,
          customRenderer: (record: Payment, editing: boolean, fieldErrors?: Record<string, string>, triggerChangeDetection?: () => void) => {
            if (!editing) {
              return (record.amountPaid || 0).toFixed(2);
            }
            
            const error = fieldErrors?.[column.key as string];
            const totalAmount = record.amountTotal || 0;
            
            return (
              <Form.Item 
                name={column.key} 
                style={{ margin: 0 }}
                validateStatus={error ? 'error' : ''}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.01}
                  precision={2}
                  placeholder={`Enter paid amount (Total: ${totalAmount.toFixed(2)})`}
                  onChange={(value) => {
                    // Update isPaid checkbox based on remaining amount
                    setTimeout(() => {
                      const currentValues = formRef.current?.getFieldsValue();
                      if (currentValues) {
                        const paidAmount = value || 0;
                        const remainingAmount = totalAmount - paidAmount;
                        
                        formRef.current?.setFieldsValue({
                          isPaid: remainingAmount <= 0
                        });
                      }
                      if (triggerChangeDetection) triggerChangeDetection();
                    }, 0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      const tableRow = e.currentTarget.closest('tr');
                      if (tableRow) {
                        const enterEvent = new KeyboardEvent('keydown', {
                          key: 'Enter',
                          bubbles: true,
                          cancelable: true
                        });
                        tableRow.dispatchEvent(enterEvent);
                      }
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      e.stopPropagation();
                      const tableRow = e.currentTarget.closest('tr');
                      if (tableRow) {
                        const escapeEvent = new KeyboardEvent('keydown', {
                          key: 'Escape',
                          bubbles: true,
                          cancelable: true
                        });
                        tableRow.dispatchEvent(escapeEvent);
                      }
                    }
                  }}
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