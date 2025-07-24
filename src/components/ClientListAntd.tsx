import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Spin, Table, Typography } from 'antd';
import type { ColumnsType, FilterDropdownProps, FilterValue, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';
import type { FilterType } from '../components/common/ColumnFilterPopover';
import { useTerminal } from '../context/TerminalContext';
import { clientService } from '../services/api';
import type { Client, UpdateClientRequest } from '../types/models';
import { EstopiaError } from '../utils/ErrorHandler';

const { Title } = Typography;

function getColumnSearchProps(dataIndex: keyof Client) {
    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${String(dataIndex)}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: 'block' }}
                    autoFocus
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined style={{ fontSize: 18 }} />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && clearFilters()}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined, fontSize: 18 }} />,
        onFilter: (value: string | number | boolean | bigint, record: Client) => {
            const cell = record[dataIndex];
            return cell ? String(cell).toLowerCase().includes(String(value).toLowerCase()) : false;
        },
    };
}

export default function ClientListAntd() {
    const { push } = useTerminal();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortField, setSortField] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>(undefined);
    const [filters, setFilters] = useState<Record<string, { type: FilterType; value: string }> | undefined>(undefined);
    const [editingKey, setEditingKey] = useState<number | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<number, Record<string, string>>>({});
    const [form] = Form.useForm();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const fetchClients = async (params?: { sortField?: string; sortDirection?: 'asc' | 'desc'; filters?: Record<string, { type: FilterType; value: string }> }) => {
        setLoading(true);
        try {
            const data = await clientService.getAllClients(params || {});
            setClients(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients({ sortField, sortDirection, filters });

    }, [sortField, sortDirection, filters]);

    const handleTableChange = (
        _pagination: TablePaginationConfig,
        tableFilters: Record<string, FilterValue | null>,
        sorter: SorterResult<Client> | SorterResult<Client>[],
        _extra: TableCurrentDataSource<Client>
    ) => {
        // Sorting
        let sortField: string | undefined;
        let sortDirection: 'asc' | 'desc' | undefined;
        if (Array.isArray(sorter)) {
            if (sorter.length > 0 && typeof sorter[0].field === 'string') {
                sortField = sorter[0].field;
                sortDirection = sorter[0].order === 'ascend' ? 'asc' : sorter[0].order === 'descend' ? 'desc' : undefined;
            }
        } else if (sorter && typeof sorter.field === 'string') {
            sortField = sorter.field;
            sortDirection = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : undefined;
        }
        setSortField(sortField);
        setSortDirection(sortDirection);
        // Filtering
        const newFilters: Record<string, { type: FilterType; value: string }> = {};
        Object.keys(tableFilters).forEach((key) => {
            const filterArr = tableFilters[key] as FilterValue | null;
            const value = filterArr && Array.isArray(filterArr) ? filterArr[0] : undefined;
            if (value) {
                newFilters[key] = { type: 'like', value: String(value) };
            }
        });
        setFilters(Object.keys(newFilters).length > 0 ? newFilters : undefined);
    };

    const isEditing = (record: Client) => record.id === editingKey;

    const edit = (record: Client) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id);
        setFieldErrors({});
    };

    const cancel = () => {
        setEditingKey(null);
        setFieldErrors({});
    };

    // Add handler: insert a new editable row at the top
    const handleAdd = () => {
        if (editingKey !== null) return; // Only one edit at a time
        // Prevent multiple negative-ID add rows
        const existingAddRow = clients.find(c => c.id < 0);
        if (existingAddRow) {
            edit(existingAddRow);
            return;
        }
        const newClient = {
            id: -Math.floor(Math.random() * 1e6), // temp negative id
            firstName: '',
            lastName: '',
            nationalId: '',
            email: '',
            phoneNumber: '',
            address: '',
        };
        setClients([newClient, ...clients]);
        form.setFieldsValue(newClient);
        setEditingKey(newClient.id);
        setFieldErrors({});
    };

    // Delete handler: delete the currently edited client
    const handleDelete = async () => {
        if (editingKey === null) return;
        setLoading(true);
        setShowDeleteConfirm(false);
        try {
            const client = clients.find(c => c.id === editingKey);
            if (!client) return;
            if (client.id < 0) {
                // New unsaved row, just remove from UI
                setClients(clients.filter(c => c.id !== client.id));
                setEditingKey(null);
                return;
            }
            await clientService.deleteClient(client.id);
            setEditingKey(null);
            fetchClients({ sortField, sortDirection, filters });
            push('Client deleted', 'success');
        } catch {
            push('Delete failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Save: handle both add and edit
    const save = async (id: number) => {
        try {
            const row = (await form.validateFields()) as UpdateClientRequest;
            setLoading(true);
            setFieldErrors({});
            if (id < 0) {
                // Add
                await clientService.createClient(row);
                setEditingKey(null);
                fetchClients({ sortField, sortDirection, filters });
                push('Client added', 'success');
            } else {
                // Edit
                await clientService.updateClient(id, row);
                setEditingKey(null);
                fetchClients({ sortField, sortDirection, filters });
                push('Client updated', 'success');
            }
        } catch (_error) {
            if (_error instanceof EstopiaError && _error.fieldErrors) {
                const fe: Record<string, string> = {};
                for (const e of _error.fieldErrors) {
                    fe[e.field] = e.message;
                }
                setFieldErrors({ [id]: fe });
                push('Validation error', 'error');
            } else if (_error && (_error as { errorFields?: unknown }).errorFields) {
                // AntD form validation error, do nothing
            } else {
                push(id < 0 ? 'Add failed' : 'Update failed', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<Client> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            ...getColumnSearchProps('id'),
            render: (_: unknown, record: Client) => record.id,
        },
        ...(['firstName', 'lastName', 'nationalId', 'email', 'phoneNumber', 'address'] as (keyof Client)[]).map((field) => ({
            title: field.charAt(0).toUpperCase() + field.slice(1),
            dataIndex: field,
            key: field,
            sorter: true,
            ...getColumnSearchProps(field),
            render: (_: unknown, record: Client) => {
                const editing = isEditing(record);
                const error = fieldErrors[record.id]?.[field];
                return editing ? (
                    <Form.Item
                        name={field}
                        style={{ margin: 0 }}
                        validateStatus={error ? 'error' : ''}
                    >
                        <Input
                            onKeyDown={e => {
                                if (e.key === 'Enter') save(record.id);
                                if (e.key === 'Escape') cancel();
                            }}
                        />
                    </Form.Item>
                ) : (
                    record[field]
                );
            },
        })),
    ];

    return (
        <Form form={form} component={false}>
            <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 24 }}>
                <Title level={3}>Clients (Ant Design)</Title>
                <Space style={{ marginBottom: 12 }}>
                    <Button
                        type="default"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        style={{
                            background: '#fafafa',
                            border: '1px solid #bdbdbd',
                            color: '#333',
                            fontWeight: 500,
                        }}
                    >
                        Add
                    </Button>
                    {editingKey !== null && editingKey < 0 && (
                        <>
                            <Button type="primary" onClick={() => save(editingKey)} style={{ fontWeight: 500 }}>Yes</Button>
                            <Button onClick={cancel} style={{ marginLeft: 4 }}>No</Button>
                        </>
                    )}
                    {editingKey !== null && editingKey > 0 && !showDeleteConfirm && (
                        <Button icon={<DeleteOutlined />} danger onClick={() => setShowDeleteConfirm(true)}>
                            Delete
                        </Button>
                    )}
                    {editingKey !== null && editingKey > 0 && showDeleteConfirm && (
                        <>
                            <Button danger onClick={handleDelete} style={{ fontWeight: 500 }}>Yes</Button>
                            <Button onClick={() => setShowDeleteConfirm(false)} style={{ marginLeft: 4 }}>No</Button>
                        </>
                    )}
                </Space>
                <Spin spinning={loading} tip="Loading clients...">
                    <Table
                        dataSource={clients}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 100 }}
                        bordered
                        onChange={handleTableChange}
                        components={{
                            body: {
                                cell: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => <td {...props} />,
                            },
                        }}
                        onRow={record => ({
                            onClick: () => {
                                if (editingKey === null) edit(record);
                            },
                        })}
                    />
                </Spin>
            </Space>
            <style>{`
  .ant-pagination .ant-pagination-item-active {
    background: #f5f5f5 !important;
    border-color: #bdbdbd !important;
  }
  .ant-pagination .ant-pagination-item-active a {
    color: #333 !important;
  }
  .ant-pagination .ant-pagination-item a {
    color: #555;
  }
  .ant-pagination .ant-pagination-item:hover {
    border-color: #888 !important;
  }
  .ant-pagination .ant-pagination-item-active {
    font-weight: bold;
  }
  .ant-pagination .ant-pagination-next .ant-pagination-item-link,
  .ant-pagination .ant-pagination-prev .ant-pagination-item-link {
    color: #555 !important;
    border-color: #bdbdbd !important;
    background: #fafafa !important;
  }
  /* Make sort icons in table headers bigger */
  .ant-table-column-sorter-up svg,
  .ant-table-column-sorter-down svg {
    font-size: 18px !important;
    width: 18px !important;
    height: 18px !important;
  }
`}</style>
        </Form>
    );
} 