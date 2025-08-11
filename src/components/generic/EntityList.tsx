import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Spin, Table, Typography } from 'antd';
import type { ColumnsType, FilterDropdownProps, FilterValue, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/es/table/interface';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FilterType } from '../common/ColumnFilterPopover';
import { useTerminal } from '../../context/useTerminal';
import { useAuth } from '../../contexts/AuthContext';
import { tableConfig } from '../../theme/tokens';
import {
  createActionButtonContainerStyle,
  createButtonGroupStyle,
  createEditingRowStyle,
  createFormItemStyle,
  createIconStyle,
  createLayoutStyle,
  createSearchDropdownStyle,
  createSearchInputStyle,
} from '../../theme/styleHelpers';
import type { BaseEntity, EntityConfig } from '../../types/entity/entityConfig';
import { EstopiaError, ValidationError } from '../../utils/ErrorHandler';

const { Title: _Title } = Typography;

interface EntityListProps<T extends BaseEntity, CreateT, UpdateT> {
  config: EntityConfig<T, CreateT, UpdateT>;
  formRef?: React.MutableRefObject<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

function getColumnSearchProps<T extends BaseEntity>(dataIndex: keyof T, title: string, t: (key: string) => string) {
    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
            <div style={createSearchDropdownStyle()}>
                <Input
                    placeholder={t('button.search') + ` ${title}`}
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
                        {t('button.search')}
                    </Button>
                    <Button
                        onClick={() => clearFilters && clearFilters()}
                        size="small"
                        style={createButtonGroupStyle()}
                    >
                        {t('button.reset')}
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (_filtered: boolean) => <SearchOutlined style={createIconStyle()} />,
        onFilter: (value: string | number | boolean | bigint, record: T) => {
            const cell = record[dataIndex];
            return cell ? String(cell).toLowerCase().includes(String(value).toLowerCase()) : false;
        },
    };
}

export default function EntityList<T extends BaseEntity, CreateT, UpdateT>({ 
  config,
  formRef
}: EntityListProps<T, CreateT, UpdateT>) {
    const { t } = useTranslation();
    const { push } = useTerminal();
    const { isAdmin } = useAuth();
    const [entities, setEntities] = useState<T[]>([]);
    const [loading, setLoading] = useState(true); // Start with true since we fetch immediately
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
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    // Use ref to store the service to avoid recreating fetchEntities
    const serviceRef = useRef(config.service);
    
    // Connect external form ref if provided
    if (formRef) {
        formRef.current = form;
    }
    serviceRef.current = config.service;

    const fetchEntities = useCallback(async (params?: { sortField?: string; sortDirection?: 'asc' | 'desc'; filters?: Record<string, { type: FilterType; value: string }> }) => {
        setLoading(true);
        try {
            const data = await serviceRef.current.getAll(params || {});
            setEntities(data);
            setInitialLoadComplete(true);
        } catch (error) {
            console.error('Failed to fetch entities:', error);
            push(`Failed to load ${config.pluralName.toLowerCase()}`, 'error');
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies - function never changes

    // Initial load only - use ref to prevent double calls in StrictMode
    const initializedRef = useRef(false);
    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;
            fetchEntities();
        }
    }, []); // Empty dependency array - only run once

    // Re-fetch when sort/filter changes (but not on initial mount)
    useEffect(() => {
        // Only fetch if we have actual sort/filter values AND initial load is complete
        if ((sortField || sortDirection || filters) && initialLoadComplete) {
            fetchEntities({ sortField, sortDirection, filters });
        }
    }, [sortField, sortDirection, filters, initialLoadComplete]); // Removed fetchEntities dependency

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
        sorter: SorterResult<T> | SorterResult<T>[],
        _extra: TableCurrentDataSource<T>
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

    const isEditing = useCallback((record: T) => record.id === editingKey, [editingKey]);

    const edit = useCallback((record: T) => {
        const values = { ...record };
        form.setFieldsValue(values);
        setEditingKey(record.id);
        setFieldErrors({});
        setOriginalValues(values as Record<string, unknown>);
        setHasChanges(false);
    }, [form]);

    const cancel = () => {
        setEditingKey(null);
        setFieldErrors({});
        setHasChanges(false);
        setOriginalValues({});
    };

    // Add handler: insert a new editable row at the top
    const handleAdd = useCallback(() => {
        if (editingKey !== null) return; // Only one edit at a time
        // Prevent multiple negative-ID add rows
        const existingAddRow = entities.find(e => e.id < 0);
        if (existingAddRow) {
            edit(existingAddRow);
            return;
        }
        const newEntity: T = {
            ...config.createEmpty(),
            id: -Math.floor(Math.random() * 1e6), // temp negative id
        };
        setEntities([newEntity, ...entities]);
        form.setFieldsValue(newEntity);
        setEditingKey(newEntity.id);
        setFieldErrors({});
        setOriginalValues({ ...newEntity } as Record<string, unknown>);
        setHasChanges(true); // New rows always have "changes" (they need to be saved)
    }, [editingKey, entities, edit, config, form]);

    // Delete handler: delete the currently edited entity
    const handleDelete = useCallback(async () => {
        if (editingKey === null) return;
        setLoading(true);
        setShowDeleteConfirm(false);
        try {
            const entity = entities.find(e => e.id === editingKey);
            if (!entity) return;
            if (entity.id < 0) {
                // New unsaved row, just remove from UI
                setEntities(entities.filter(e => e.id !== entity.id));
                setEditingKey(null);
                return;
            }
            await config.service.delete(entity.id);
            setEditingKey(null);
            fetchEntities({ sortField, sortDirection, filters });
            push(`${config.name} deleted`, 'success');
        } catch {
            push('Delete failed', 'error');
        } finally {
            setLoading(false);
        }
    }, [editingKey, entities, config.service, config.name, sortField, sortDirection, filters, push]);

    // Save: handle both add and edit
    const save = useCallback(async (id: number) => {
        try {
            const row = (await form.validateFields()) as CreateT;
            setLoading(true);
            setFieldErrors({});
            if (id < 0) {
                // Add
                await config.service.create(row);
                setEditingKey(null);
                fetchEntities({ sortField, sortDirection, filters });
                push(`${config.name} added`, 'success');
            } else {
                // Edit
                await config.service.update(id, row as unknown as UpdateT);
                setEditingKey(null);
                fetchEntities({ sortField, sortDirection, filters });
                push(`${config.name} updated`, 'success');
            }
        } catch (_error) {
            if (_error instanceof ValidationError && _error.fieldErrors) {
                const fe: Record<string, string> = {};
                for (const e of _error.fieldErrors) {
                    fe[e.field] = e.message;
                    // Push each validation error message to terminal
                    push(`${e.field}: ${e.message}`, 'error');
                }
                setFieldErrors({ [id]: fe });
            } else if (_error && (_error as { errorFields?: unknown }).errorFields) {
                // AntD form validation error, do nothing
            } else {
                // Show the actual error message from the backend
                const errorMessage = _error && typeof _error === 'object' && 'message' in _error 
                    ? (_error as { message: string }).message 
                    : (id < 0 ? 'Add failed' : 'Update failed');
                push(errorMessage, 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [form, config.service, config.name, sortField, sortDirection, filters, push]);

    // Determine table props based on style setting - memoized to prevent recalculation
    const tableProps = useMemo(() => {
        switch (tableStyle) {
            case 'compact':
                return { size: 'small' as const, bordered: true };
            case 'spacious':
                return { size: 'large' as const, bordered: false };
            default: // comfortable
                return { size: 'middle' as const, bordered: true };
        }
    }, [tableStyle]);

    // Simple row click handler for editing
    const handleRowClick = useCallback((record: T) => {
        // Only allow editing for admins
        if (editingKey === null && isAdmin()) {
            edit(record);
        }
    }, [editingKey, edit, isAdmin]);

    // Single change detection function for the whole form
    const triggerChangeDetection = useCallback(() => {
        setTimeout(() => {
            const currentValues = form.getFieldsValue();
            const editingRecord = entities.find(e => e.id === editingKey);
            if (!editingRecord) return;
            
            const changed = Object.keys(currentValues).some(key => {
                const current = currentValues[key];
                const original = originalValues[key];
                // Handle null/undefined/empty string comparison
                const currentNormalized = current === null || current === undefined ? '' : String(current);
                const originalNormalized = original === null || original === undefined ? '' : String(original);
                return currentNormalized !== originalNormalized;
            });
            setHasChanges(changed || editingRecord.id < 0);
        }, 0);
    }, [form, entities, editingKey, originalValues]);

    const columns: ColumnsType<T> = useMemo(() => [
        ...config.columns.map((columnConfig) => ({
            title: columnConfig.title,
            dataIndex: columnConfig.key as string,
            key: columnConfig.key as string,
            sorter: columnConfig.sortable,
            width: columnConfig.width,
            ...(columnConfig.searchable ? getColumnSearchProps(columnConfig.key, columnConfig.title, t) : {}),
            render: (_: unknown, record: T) => {
                const editing = isEditing(record);
                const error = fieldErrors[record.id]?.[columnConfig.key as string];

                // Use custom renderer if provided
                if (columnConfig.customRenderer) {
                    return columnConfig.customRenderer(record, editing, fieldErrors[record.id], triggerChangeDetection);
                }
                
                return editing ? (
                    <Form.Item
                        name={columnConfig.key as string}
                        style={createFormItemStyle()}
                        validateStatus={error ? 'error' : ''}
                    >
                        <Input
                            onChange={triggerChangeDetection}
                            onKeyDown={e => {
                                if (e.key === 'Enter') save(record.id);
                                if (e.key === 'Escape') cancel();
                            }}
                        />
                    </Form.Item>
                ) : (
                    String(record[columnConfig.key] || '')
                );
            },
        })),
    ], [config.columns, isEditing, fieldErrors, triggerChangeDetection, save, cancel]);

    // Memoize layout style to prevent recalculation
    const layoutStyle = useMemo(() => createLayoutStyle(), []);
    const actionButtonContainerStyle = useMemo(() => createActionButtonContainerStyle(), []);

    // Memoize pagination to prevent recreation
    const paginationConfig = useMemo(() => ({ pageSize: tableConfig.pageSize }), []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Only process shortcuts when not typing in inputs
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                return;
            }

            const editingRecord = entities.find(entity => entity.id === editingKey);

            switch (event.key) {
                case '+':
                    if (!editingRecord) {
                        event.preventDefault();
                        handleAdd();
                    }
                    break;
                case '-':
                    if (editingRecord && editingRecord.id > 0 && !hasChanges) {
                        event.preventDefault();
                        setShowDeleteConfirm(true);
                    }
                    break;
                case 'Enter':
                    if (editingRecord) {
                        event.preventDefault();
                        if (hasChanges) {
                            save(editingRecord.id);
                        } else if (showDeleteConfirm) {
                            // Confirm delete when in delete confirmation state
                            handleDelete();
                        }
                    }
                    break;
                case 'Escape':
                    if (editingRecord) {
                        event.preventDefault();
                        if (showDeleteConfirm) {
                            setShowDeleteConfirm(false);
                        }
                        if (editingRecord.id < 0) {
                            // Remove temp add row
                            setEntities(entities.filter(e => e.id !== editingRecord.id));
                        }
                        cancel();
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [entities, editingKey, hasChanges, showDeleteConfirm, handleAdd, save, cancel, setEntities, setShowDeleteConfirm]);

    // Get the currently editing record for action buttons
    const editingRecord = entities.find(entity => entity.id === editingKey);

    // Render action buttons based on current state
    const renderActionButtons = () => {
        // Only show action buttons for admins
        if (!isAdmin()) {
            return null;
        }
        
        if (!editingRecord) {
            // No record being edited - show Add button (PLUS)
            return (
                <Button 
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    size="middle"
                    style={{ 
                        backgroundColor: '#f0f9ff', 
                        borderColor: '#bae6fd', 
                        color: '#0369a1' 
                    }}
                />
            );
        }

        const editing = isEditing(editingRecord);
        if (editing) {
            if (showDeleteConfirm && editingRecord.id === editingKey) {
                // Delete confirmation (V and STOP SIGN)
                return (
                    <Space size="small">
                        <Button 
                            icon={<CheckOutlined />}
                            onClick={handleDelete}
                            size="middle"
                            style={{ 
                                backgroundColor: '#fef7f7', 
                                borderColor: '#fecdd3', 
                                color: '#991b1b' 
                            }}
                        />
                        <Button 
                            icon={<CloseOutlined />}
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                cancel();
                            }}
                            size="middle"
                        />
                    </Space>
                );
            } else {
                // Smart button logic (V and STOP SIGN)
                return (
                    <Space size="small">
                        {hasChanges && (
                            <>
                                <Button 
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    onClick={() => save(editingRecord.id)}
                                    size="middle"
                                />
                                <Button 
                                    icon={<CloseOutlined />}
                                    onClick={() => {
                                        if (editingRecord.id < 0) {
                                            // Remove temp add row
                                            setEntities(entities.filter(e => e.id !== editingRecord.id));
                                        }
                                        cancel();
                                    }}
                                    size="middle"
                                />
                            </>
                        )}
                        {!hasChanges && editingRecord.id > 0 && (
                            <Button 
                                icon={<MinusOutlined />}
                                onClick={() => setShowDeleteConfirm(true)}
                                size="middle"
                                style={{ 
                                    backgroundColor: '#fef7f7', 
                                    borderColor: '#fecdd3', 
                                    color: '#991b1b' 
                                }}
                            />
                        )}
                    </Space>
                );
            }
        }
        
        return null;
    };

    return (
        <Form form={form} component={false}>
            <Space direction="vertical" size="middle" style={layoutStyle}>
                <div style={actionButtonContainerStyle}>
                    {renderActionButtons()}
                </div>
                <Spin spinning={loading} tip={`Loading ${config.pluralName.toLowerCase()}...`}>
                    <Table
                        dataSource={entities}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            ...paginationConfig,
                            hideOnSinglePage: false,
                            showSizeChanger: false
                        }}
                        {...tableProps}
                        onChange={handleTableChange}
                        rowClassName={(record: T) => {
                            const editing = isEditing(record);
                            if (!editing) return '';
                            
                            if (showDeleteConfirm && record.id === editingKey) {
                                return 'editing-row-delete';
                            } else if (hasChanges && record.id > 0) {
                                return 'editing-row-save';
                            } else if (record.id < 0) {
                                return 'editing-row-add';
                            }
                            return 'editing-row';
                        }}
                        onRow={(record: T) => {
                            const editing = isEditing(record);
                            let rowStyle = {};
                            
                            if (editing) {
                                if (showDeleteConfirm && record.id === editingKey) {
                                    // Red background for delete confirmation
                                    rowStyle = {
                                        backgroundColor: '#fef2f2', // red-50
                                        borderColor: '#fecaca', // red-200
                                    };
                                } else if (hasChanges && record.id > 0) {
                                    // Yellow background for unsaved changes (save confirm)
                                    rowStyle = {
                                        backgroundColor: '#fefce8', // yellow-50
                                        borderColor: '#fde047', // yellow-300
                                    };
                                } else if (record.id < 0) {
                                    // Pale blue background for add mode (like add button)
                                    rowStyle = {
                                        backgroundColor: '#f0f9ff', // sky-50
                                        borderColor: '#bae6fd', // sky-200
                                    };
                                }
                                // Add subtle border to all editing rows
                                rowStyle = {
                                    ...rowStyle,
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                };
                            }
                            
                            return {
                                onClick: () => handleRowClick(record),
                                onMouseEnter: editing ? (event) => {
                                    // Preserve custom background color on hover for editing rows
                                    const target = event.currentTarget as HTMLElement;
                                    Object.assign(target.style, rowStyle);
                                } : undefined,
                                onMouseLeave: editing ? (event) => {
                                    // Maintain custom background color on mouse leave for editing rows
                                    const target = event.currentTarget as HTMLElement;
                                    Object.assign(target.style, rowStyle);
                                } : undefined,
                                style: { 
                                    cursor: (editingKey === null && isAdmin()) ? 'pointer' : 'default',
                                    ...rowStyle
                                }
                            };
                        }}
                        scroll={{ x: 'max-content' }}
                        tableLayout="fixed"
                    />
                </Spin>
            </Space>
        </Form>
    );
}