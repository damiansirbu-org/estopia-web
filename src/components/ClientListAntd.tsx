import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Spin, Table, Typography } from 'antd';
import type { ColumnsType, FilterDropdownProps, FilterValue, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';
import { CLIENT_COLUMNS } from '../constants/clientColumns';
import type { FilterType } from '../components/common/ColumnFilterPopover';
import { useTerminal } from '../context/useTerminal';
import { clientService } from '../services/api';
import { tableConfig } from '../theme/tokens';
import {
  createButtonGroupStyle,
  createButtonStyle,
  createFormItemStyle,
  createIconStyle,
  createLayoutStyle,
  createSearchDropdownStyle,
  createSearchInputStyle,
} from '../theme/styleHelpers';
import type { Client, UpdateClientRequest } from '../types/models';
import { EstopiaError } from '../utils/ErrorHandler';

const { Title } = Typography;

function getColumnSearchProps(dataIndex: keyof Client, title: string) {
    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
            <div style={createSearchDropdownStyle()}>
                <Input
                    placeholder={`Search ${title}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={createSearchInputStyle()}
                    autoFocus
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined style={createIconStyle()} />}
                        size="small"
                        style={createButtonGroupStyle()}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && clearFilters()}
                        size="small"
                        style={createButtonGroupStyle()}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (_filtered: boolean) => <SearchOutlined style={createIconStyle()} />,
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
    const [tableStyle, setTableStyle] = useState(() => localStorage.getItem('table-style') || 'comfortable');
    const [hasChanges, setHasChanges] = useState(false);
    const [originalValues, setOriginalValues] = useState<Record<string, unknown>>({});

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

    useEffect(() => {
        const handleStorageChange = () => {
            setTableStyle(localStorage.getItem('table-style') || 'comfortable');
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

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
        const values = { ...record };
        form.setFieldsValue(values);
        setEditingKey(record.id);
        setFieldErrors({});
        setOriginalValues(values as Record<string, unknown>);
        setHasChanges(false);
    };

    const cancel = () => {
        setEditingKey(null);
        setFieldErrors({});
        setHasChanges(false);
        setOriginalValues({});
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
        const newClient: Client = {
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
        setOriginalValues({ ...newClient } as Record<string, unknown>);
        setHasChanges(true); // New rows always have "changes" (they need to be saved)
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

    // Determine table props based on style setting
    const getTableProps = () => {
        switch (tableStyle) {
            case 'compact':
                return { size: 'small' as const, bordered: true };
            case 'spacious':
                return { size: 'large' as const, bordered: false };
            default: // comfortable
                return { size: 'middle' as const, bordered: true };
        }
    };

    const columns: ColumnsType<Client> = [
        ...CLIENT_COLUMNS.map((columnConfig) => ({
            title: columnConfig.title,
            dataIndex: columnConfig.key,
            key: columnConfig.key,
            sorter: columnConfig.sortable,
            width: columnConfig.width,
            ...(columnConfig.searchable ? getColumnSearchProps(columnConfig.key, columnConfig.title) : {}),
            render: (_: unknown, record: Client) => {
                const editing = isEditing(record);
                const error = fieldErrors[record.id]?.[columnConfig.key];
                return editing ? (
                    <Form.Item
                        name={columnConfig.key}
                        style={createFormItemStyle()}
                        validateStatus={error ? 'error' : ''}
                    >
                        <Input
                            onChange={() => {
                                // Check if current form values differ from original values
                                setTimeout(() => {
                                    const currentValues = form.getFieldsValue();
                                    const changed = Object.keys(currentValues).some(key => 
                                        currentValues[key] !== originalValues[key]
                                    );
                                    setHasChanges(changed || record.id < 0);
                                }, 0);
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter') save(record.id);
                                if (e.key === 'Escape') cancel();
                            }}
                        />
                    </Form.Item>
                ) : (
                    record[columnConfig.key]
                );
            },
        })),
        // Actions column - last position (right side) with global actions in header
        {
            key: 'actions',
            width: 40,
            className: 'actions-column',
            title: () => (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}>
                    <Button 
                        type="text"
                        icon={<PlusOutlined />}
                        size="small"
                        onClick={handleAdd}
                        style={{ 
                            color: '#1890ff',
                            padding: '4px',
                            minWidth: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Add new client"
                    />
                </div>
            ),
            onHeaderCell: () => ({
                style: { 
                    backgroundColor: '#fafafa',
                    borderLeft: '1px solid #f0f0f0',
                    padding: '4px',
                    textAlign: 'center' as const
                }
            }),
            onCell: () => ({
                style: { 
                    backgroundColor: '#fafafa',
                    borderLeft: '1px solid #f0f0f0',
                    padding: '8px 4px',
                    textAlign: 'center' as const
                }
            }),
            render: (_: unknown, record: Client) => {
                const editing = isEditing(record);
                
                if (editing) {
                    if (showDeleteConfirm && record.id === editingKey) {
                        // Delete confirmation
                        return (
                            <Space size={4}>
                                <Button 
                                    type="text"
                                    icon={<CheckOutlined />}
                                    size="small"
                                    onClick={handleDelete}
                                    style={{ color: '#52c41a', padding: '2px' }}
                                />
                                <Button 
                                    type="text"
                                    icon={<CloseOutlined />}
                                    size="small"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        cancel();
                                    }}
                                    style={{ color: '#ff4d4f', padding: '2px' }}
                                />
                            </Space>
                        );
                    } else {
                        // Smart button logic
                        return (
                            <Space size={4}>
                                {hasChanges && (
                                    <>
                                        <Button 
                                            type="text"
                                            icon={<CheckOutlined />}
                                            size="small"
                                            onClick={() => save(record.id)}
                                            style={{ color: '#52c41a', padding: '2px' }}
                                        />
                                        <Button 
                                            type="text"
                                            icon={<CloseOutlined />}
                                            size="small"
                                            onClick={() => {
                                                if (record.id < 0) {
                                                    // Remove temp add row
                                                    setClients(clients.filter(c => c.id !== record.id));
                                                }
                                                cancel();
                                            }}
                                            style={{ color: '#ff4d4f', padding: '2px' }}
                                        />
                                    </>
                                )}
                                {!hasChanges && record.id > 0 && (
                                    <Button 
                                        type="text"
                                        icon={<MinusOutlined />}
                                        size="small"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        style={{ color: '#8c8c8c', padding: '2px' }}
                                    />
                                )}
                            </Space>
                        );
                    }
                }
                
                return null; // No actions when not editing
            },
        },
    ];

    return (
        <Form form={form} component={false}>
            <Space direction="vertical" size="large" style={createLayoutStyle()}>
                <Title level={3}>Clients</Title>
                <Spin spinning={loading} tip="Loading clients...">
                    <Table
                        dataSource={clients}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: tableConfig.pageSize }}
                        {...getTableProps()}
                        onChange={handleTableChange}
                        onRow={record => ({
                            onClick: () => {
                                if (editingKey === null) edit(record);
                            },
                        })}
                    />
                </Spin>
            </Space>
        </Form>
    );
} 