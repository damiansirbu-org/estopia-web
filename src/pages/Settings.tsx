import { Button, Card, Divider, Radio, Space, Table, Typography } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { designTokens } from '../theme/tokens';

const { Title, Paragraph } = Typography;

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

const tableStylePresets: TableStylePreset[] = [
    {
        key: 'compact',
        label: 'Compact Table',
        size: 'small',
        bordered: true,
        showHeader: true,
    },
    {
        key: 'comfortable',
        label: 'Comfortable Table',
        size: 'middle',
        bordered: true,
        showHeader: true,
    },
    {
        key: 'spacious',
        label: 'Spacious Table',
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

export default function Settings() {
    const { currentTheme, setCurrentTheme, themes } = useTheme();
    const [selectedTableStyle, setSelectedTableStyle] = useState<string>(() => 
        localStorage.getItem('table-style') || 'comfortable'
    );

    const handleThemeChange = (e: RadioChangeEvent) => {
        setCurrentTheme(e.target.value);
    };

    const handleTableStyleChange = (e: RadioChangeEvent) => {
        const newStyle = e.target.value;
        setSelectedTableStyle(newStyle);
        localStorage.setItem('table-style', newStyle);
    };

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

    return (
        <div style={containerStyle}>
            <Card>
                <Title level={2}>Theme & Style Settings</Title>
                <Paragraph>
                    Customize the appearance of your application. Changes will be applied immediately 
                    and saved for your next visit.
                </Paragraph>

                <div style={sectionStyle}>
                    <Title level={3}>Application Theme</Title>
                    <Paragraph type="secondary">
                        Choose the overall color scheme and styling for the entire application.
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
                    <Title level={3}>Table Style</Title>
                    <Paragraph type="secondary">
                        Adjust the spacing and borders for all tables in the application.
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

                <div>
                    <Title level={3}>Preview</Title>
                    <Paragraph type="secondary">
                        See how your selected theme and table style will look.
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
            </Card>
        </div>
    );
} 