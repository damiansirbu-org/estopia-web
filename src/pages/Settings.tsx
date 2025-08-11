import { Button, Card, Divider, Radio, Space, Table, Typography, Tabs, Select, InputNumber, Switch, Form } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { designTokens } from '../theme/tokens';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface PreviewData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
}

interface TableStylePreset {
    key: string;
    label: string;
    size: 'small' | 'middle' | 'large';
    bordered: boolean;
    showHeader: boolean;
}

const getTableStylePresets = (t: (key: string) => string): TableStylePreset[] => [
    {
        key: 'compact',
        label: t('settings.table.compact'),
        size: 'small',
        bordered: true,
        showHeader: true,
    },
    {
        key: 'comfortable',
        label: t('settings.table.comfortable'),
        size: 'middle',
        bordered: true,
        showHeader: true,
    },
    {
        key: 'spacious',
        label: t('settings.table.spacious'),
        size: 'large',
        bordered: false,
        showHeader: true,
    },
];

const previewData: PreviewData[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', status: 'Active' },
    { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', status: 'Inactive' },
];

const previewColumns: ColumnsType<PreviewData> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName', width: 120 },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName', width: 120 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 180 },
    { 
        title: 'Status', 
        dataIndex: 'status', 
        key: 'status', 
        width: 100,
        render: (status: string) => (
            <Button size="small" type={status === 'Active' ? 'primary' : 'default'}>
                {status}
            </Button>
        )
    },
];

interface SettingsState {
    language: string;
    dateFormat: string;
    currency: string;
    exportFormat: string;
    pageSize: number;
    refreshInterval: number;
    emailNotifications: boolean;
    systemAlerts: boolean;
    sessionTimeout: number;
    autoSave: boolean;
}

export default function Settings() {
    const { t, i18n } = useTranslation();
    const { currentTheme, setCurrentTheme, themes } = useTheme();
    const [selectedTableStyle, setSelectedTableStyle] = useState<string>(() => 
        localStorage.getItem('table-style') || 'comfortable'
    );
    
    const [settings, setSettings] = useState<SettingsState>(() => ({
        language: localStorage.getItem('language') || 'en',
        dateFormat: localStorage.getItem('date-format') || 'MM/DD/YYYY',
        currency: localStorage.getItem('currency') || 'USD',
        exportFormat: localStorage.getItem('export-format') || 'xlsx',
        pageSize: parseInt(localStorage.getItem('page-size') || '10'),
        refreshInterval: parseInt(localStorage.getItem('refresh-interval') || '30'),
        emailNotifications: localStorage.getItem('email-notifications') !== 'false',
        systemAlerts: localStorage.getItem('system-alerts') !== 'false',
        sessionTimeout: parseInt(localStorage.getItem('session-timeout') || '60'),
        autoSave: localStorage.getItem('auto-save') !== 'false',
    }));

    const handleThemeChange = (e: RadioChangeEvent) => {
        setCurrentTheme(e.target.value);
    };

    const handleTableStyleChange = (e: RadioChangeEvent) => {
        const newStyle = e.target.value;
        setSelectedTableStyle(newStyle);
        localStorage.setItem('table-style', newStyle);
    };

    const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        localStorage.setItem(key.replace(/([A-Z])/g, '-$1').toLowerCase(), String(value));
        
        // Handle language change
        if (key === 'language') {
            i18n.changeLanguage(value as string);
        }
    };

    const tableStylePresets = getTableStylePresets(t);
    const selectedTablePreset = tableStylePresets.find(p => p.key === selectedTableStyle) || tableStylePresets[1];

    const containerStyle: React.CSSProperties = {
        maxWidth: 800,
        margin: '40px auto',
        padding: designTokens.spacing.xl,
    };

    const sectionStyle: React.CSSProperties = {
        marginBottom: designTokens.spacing.xxl,
    };

    const previewContainerStyle: React.CSSProperties = {
        height: 350,
        width: '100%',
        marginTop: designTokens.spacing.lg,
    };

    const InterfaceTab = () => (
        <div>
            <div style={sectionStyle}>
                <Title level={3}>{t('settings.theme.title')}</Title>
                <Paragraph type="secondary">
                    {t('settings.theme.description')}
                </Paragraph>
                
                <Radio.Group
                    value={currentTheme}
                    onChange={handleThemeChange}
                    optionType="button"
                    buttonStyle="solid"
                    size="large"
                >
                    <Space wrap size="middle">
                        {themes.map(theme => (
                            <Radio.Button key={theme.key} value={theme.key}>
                                {theme.label}
                            </Radio.Button>
                        ))}
                    </Space>
                </Radio.Group>
            </div>

            <Divider />

            <div style={sectionStyle}>
                <Title level={3}>{t('settings.table.title')}</Title>
                <Paragraph type="secondary">
                    {t('settings.table.description')}
                </Paragraph>
                
                <Radio.Group
                    value={selectedTableStyle}
                    onChange={handleTableStyleChange}
                    optionType="button"
                    buttonStyle="solid"
                    size="large"
                >
                    <Space wrap size="middle">
                        {tableStylePresets.map(preset => (
                            <Radio.Button key={preset.key} value={preset.key}>
                                {preset.label}
                            </Radio.Button>
                        ))}
                    </Space>
                </Radio.Group>
            </div>

            <Divider />

            <div style={sectionStyle}>
                <Title level={3}>{t('settings.dateFormat.title')}</Title>
                <Form layout="vertical">
                    <Form.Item label={t('settings.dateFormat.label')}>
                        <Select 
                            value={settings.dateFormat}
                            onChange={(value) => updateSetting('dateFormat', value)}
                            style={{ width: 200 }}
                        >
                            <Option value="MM/DD/YYYY">MM/DD/YYYY (US)</Option>
                            <Option value="DD/MM/YYYY">DD/MM/YYYY (EU)</Option>
                            <Option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={t('settings.currency.label')}>
                        <Select 
                            value={settings.currency}
                            onChange={(value) => updateSetting('currency', value)}
                            style={{ width: 200 }}
                        >
                            <Option value="USD">USD ($)</Option>
                            <Option value="EUR">EUR (€)</Option>
                            <Option value="GBP">GBP (£)</Option>
                            <Option value="RON">RON (lei)</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </div>

            <Divider />

            <div>
                <Title level={3}>{t('settings.preview.title')}</Title>
                <Paragraph type="secondary">
                    {t('settings.preview.description')}
                </Paragraph>
                
                <div style={previewContainerStyle}>
                    <Table<PreviewData>
                        dataSource={previewData}
                        columns={previewColumns}
                        rowKey="id"
                        size={selectedTablePreset.size}
                        bordered={selectedTablePreset.bordered}
                        showHeader={selectedTablePreset.showHeader}
                        pagination={{ pageSize: 5, showSizeChanger: false }}
                        scroll={{ y: 250 }}
                    />
                </div>
            </div>
        </div>
    );

    const LanguageTab = () => (
        <div>
            <div style={sectionStyle}>
                <Title level={3}>{t('settings.language.title')}</Title>
                <Paragraph type="secondary">
                    {t('settings.language.description')}
                </Paragraph>
                
                <Form layout="vertical">
                    <Form.Item label={t('settings.language.interface')}>
                        <Select 
                            value={settings.language}
                            onChange={(value) => updateSetting('language', value)}
                            style={{ width: 300 }}
                        >
                            <Option value="en">English</Option>
                            <Option value="ro">Română</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            
            <Divider />
            
            <div>
                <Title level={3}>{t('settings.language.regional')}</Title>
                <Paragraph type="secondary">
                    {t('settings.language.note')}
                </Paragraph>
            </div>
        </div>
    );

    const DataTab = () => (
        <div>
            <div style={sectionStyle}>
                <Title level={3}>{t('settings.export.title')}</Title>
                <Form layout="vertical">
                    <Form.Item label={t('settings.export.format')}>
                        <Select 
                            value={settings.exportFormat}
                            onChange={(value) => updateSetting('exportFormat', value)}
                            style={{ width: 200 }}
                        >
                            <Option value="xlsx">Excel (.xlsx)</Option>
                            <Option value="csv">CSV (.csv)</Option>
                            <Option value="pdf">PDF (.pdf)</Option>
                            <Option value="json">JSON (.json)</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </div>

            <Divider />

            <div style={sectionStyle}>
                <Title level={3}>{t('settings.pagination.title')}</Title>
                <Form layout="vertical">
                    <Form.Item label={t('settings.pagination.pageSize')}>
                        <Select 
                            value={settings.pageSize}
                            onChange={(value) => updateSetting('pageSize', value)}
                            style={{ width: 200 }}
                        >
                            <Option value={10}>10 rows</Option>
                            <Option value={25}>25 rows</Option>
                            <Option value={50}>50 rows</Option>
                            <Option value={100}>100 rows</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </div>

            <Divider />

            <div>
                <Title level={3}>{t('settings.refresh.title')}</Title>
                <Form layout="vertical">
                    <Form.Item label={t('settings.refresh.interval')}>
                        <InputNumber 
                            min={10} 
                            max={300}
                            value={settings.refreshInterval}
                            onChange={(value) => updateSetting('refreshInterval', value || 30)}
                            style={{ width: 200 }}
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );

    const NotificationsTab = () => (
        <div>
            <div style={sectionStyle}>
                <Title level={3}>{t('settings.emailNotifications.title')}</Title>
                <Paragraph type="secondary">
                    {t('settings.emailNotifications.description')}
                </Paragraph>
                
                <Form layout="vertical">
                    <Form.Item>
                        <Space direction="vertical" size="middle">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 400 }}>
                                <span>{t('settings.emailNotifications.updates')}</span>
                                <Switch 
                                    checked={settings.emailNotifications}
                                    onChange={(checked) => updateSetting('emailNotifications', checked)}
                                />
                            </div>
                        </Space>
                    </Form.Item>
                </Form>
            </div>

            <Divider />

            <div>
                <Title level={3}>{t('settings.systemAlerts.title')}</Title>
                <Paragraph type="secondary">
                    {t('settings.systemAlerts.description')}
                </Paragraph>
                
                <Form layout="vertical">
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 400 }}>
                            <span>{t('settings.systemAlerts.warnings')}</span>
                            <Switch 
                                checked={settings.systemAlerts}
                                onChange={(checked) => updateSetting('systemAlerts', checked)}
                            />
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );

    const SystemTab = () => (
        <div>
            <div style={sectionStyle}>
                <Title level={3}>{t('settings.session.title')}</Title>
                <Form layout="vertical">
                    <Form.Item label={t('settings.session.timeout')}>
                        <InputNumber 
                            min={15} 
                            max={480}
                            value={settings.sessionTimeout}
                            onChange={(value) => updateSetting('sessionTimeout', value || 60)}
                            style={{ width: 200 }}
                        />
                    </Form.Item>
                </Form>
            </div>

            <Divider />

            <div>
                <Title level={3}>{t('settings.autoSave.title')}</Title>
                <Paragraph type="secondary">
                    {t('settings.autoSave.description')}
                </Paragraph>
                
                <Form layout="vertical">
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 400 }}>
                            <span>{t('settings.autoSave.enable')}</span>
                            <Switch 
                                checked={settings.autoSave}
                                onChange={(checked) => updateSetting('autoSave', checked)}
                            />
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );

    return (
        <div style={containerStyle}>
            <Card>
                <Title level={2}>{t('settings.title')}</Title>
                <Paragraph>
                    {t('settings.description')}
                </Paragraph>

                <Tabs 
                    defaultActiveKey="interface" 
                    type="line"
                    size="large"
                    items={[
                        {
                            key: 'interface',
                            label: t('settings.interface'),
                            children: <InterfaceTab />,
                        },
                        {
                            key: 'language',
                            label: t('settings.language'),
                            children: <LanguageTab />,
                        },
                        {
                            key: 'data',
                            label: t('settings.data'),
                            children: <DataTab />,
                        },
                        {
                            key: 'notifications',
                            label: t('settings.notifications'),
                            children: <NotificationsTab />,
                        },
                        {
                            key: 'system',
                            label: t('settings.system'),
                            children: <SystemTab />,
                        },
                    ]}
                />
            </Card>
        </div>
    );
} 