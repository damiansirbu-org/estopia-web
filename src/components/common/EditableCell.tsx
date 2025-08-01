import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Input } from 'antd';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType?: 'text' | 'number';
  record: any;
  index: number;
  children: React.ReactNode;
  onClick?: () => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType = 'text',
  record,
  index,
  children,
  onClick,
  ...restProps
}) => {
  const inputRef = useRef<any>(null);
  const [value, setValue] = useState(record?.[dataIndex] || '');

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select?.();
    }
  }, [editing]);

  useEffect(() => {
    setValue(record?.[dataIndex] || '');
  }, [record, dataIndex]);

  const save = async () => {
    // This will be handled by the parent form
  };

  let childNode = children;

  if (editing) {
    childNode = (
      <Form.Item
        name={dataIndex}
        style={{ margin: 0 }}
        rules={[
          {
            required: false,
            message: `Please Input ${title}!`,
          },
        ]}
      >
        <Input
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          style={{ width: '100%' }}
        />
      </Form.Item>
    );
  }

  return <td {...restProps} onClick={!editing ? onClick : undefined} style={{ cursor: !editing ? 'pointer' : 'default' }}>{childNode}</td>;
};

export default EditableCell;