
import { Form, DatePicker } from 'antd';
import EntityList from './generic/EntityList';
import { paymentEntityConfig } from '../config/entities/paymentEntity';
import { DATE_FORMAT, parseDate, formatDate } from '../utils/dateUtils';
import type { Payment } from '../types/models';

export default function PaymentList() {
  // Enhanced payment config with date picker custom renderers
  const enhancedPaymentConfig = {
    ...paymentEntityConfig,
    columns: paymentEntityConfig.columns.map(column => {
      if (column.key === 'dueDate' || column.key === 'paymentDate') {
        return {
          ...column,
          customRenderer: (record: Payment, editing: boolean, fieldErrors?: Record<string, string>) => {
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
                />
              </Form.Item>
            );
          },
        };
      }
      
      return column;
    }),
  };

  return <EntityList config={enhancedPaymentConfig} />;
}