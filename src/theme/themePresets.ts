import type { ThemeConfig } from 'antd';

export interface ThemePreset {
  key: string;
  label: string;
  theme: ThemeConfig;
}

// Define multiple theme presets
export const themePresets: ThemePreset[] = [
  {
    key: 'default',
    label: 'Default Theme',
    theme: {
      token: {
        colorPrimary: '#1890ff',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#ff4d4f',
        borderRadius: 6,
        fontSize: 14,
      },
      components: {
        Table: {
          borderColor: '#f0f0f0',
          headerBg: '#fafafa',
          headerColor: '#262626',
          rowHoverBg: '#f5f5f5',
        },
        Button: {
          borderRadius: 6,
          fontWeight: 400,
        },
      },
    },
  },
  {
    key: 'corporate',
    label: 'Corporate Theme',
    theme: {
      token: {
        colorPrimary: '#722ed1',
        colorSuccess: '#389e0d',
        colorWarning: '#d48806',
        colorError: '#cf1322',
        borderRadius: 2,
        fontSize: 13,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      components: {
        Table: {
          borderColor: '#d9d9d9',
          headerBg: '#722ed1',
          headerColor: '#ffffff',
          rowHoverBg: '#f0f5ff',
        },
        Button: {
          borderRadius: 2,
          fontWeight: 500,
        },
      },
    },
  },
  {
    key: 'modern',
    label: 'Modern Theme',
    theme: {
      token: {
        colorPrimary: '#13c2c2',
        colorSuccess: '#73d13d',
        colorWarning: '#fadb14',
        colorError: '#ff7875',
        borderRadius: 8,
        fontSize: 14,
        fontFamily: 'Inter, -apple-system, sans-serif',
      },
      components: {
        Table: {
          borderColor: '#f0f0f0',
          headerBg: '#e6fffb',
          headerColor: '#006d75',
          rowHoverBg: '#e6fffb',
        },
        Button: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
  {
    key: 'dark',
    label: 'Dark Theme',
    theme: {
      token: {
        colorPrimary: '#1890ff',
        colorBgBase: '#141414',
        colorTextBase: '#ffffff',
        colorBgContainer: '#1f1f1f',
        colorBorder: '#434343',
        borderRadius: 6,
        fontSize: 14,
      },
      components: {
        Table: {
          borderColor: '#434343',
          headerBg: '#262626',
          headerColor: '#ffffff',
          rowHoverBg: '#262626',
        },
        Button: {
          borderRadius: 6,
          fontWeight: 400,
        },
      },
    },
  },
  {
    key: 'stalker',
    label: 'S.T.A.L.K.E.R.',
    theme: {
      token: {
        colorPrimary: '#d4922a', // Rusty orange/amber
        colorSuccess: '#8b7355', // Weathered brass
        colorWarning: '#c67e3b', // Rust warning
        colorError: '#a0522d', // Dark rust/sienna  
        colorBgBase: '#2f2a24', // Dark brown base
        colorTextBase: '#ddc7a1', // Aged paper/parchment
        colorBgContainer: '#3c352b', // Dark earth container
        colorBorder: '#5d4e37', // Dark olive/brown border
        colorBgLayout: '#1e1a16', // Very dark brown background
        borderRadius: 0, // Sharp industrial edges
        fontSize: 13,
        fontFamily: '"Courier New", "Liberation Mono", "DejaVu Sans Mono", monospace', // Terminal font
        lineHeight: 1.2,
        colorText: '#ddc7a1', // Main text - aged paper
        colorTextSecondary: '#b8a082', // Secondary text - faded brown
        colorTextTertiary: '#8b7d6b', // Tertiary text - muted earth
        colorBgElevated: '#4a3f33', // Elevated surfaces
        colorFillAlter: '#352d22', // Alt fill
        colorFill: '#2a241b', // Fill
        controlHeight: 28,
        controlHeightSM: 24,
        controlHeightLG: 32,
      },
      components: {
        Table: {
          borderColor: '#5d4e37',
          headerBg: '#2a241b',
          headerColor: '#ddc7a1',
          rowHoverBg: '#3c352b',
          cellPaddingBlock: 6,
          cellPaddingInline: 8,
          fontSize: 12,
          headerSplitColor: '#5d4e37',
          bodySortBg: '#2a241b',
          headerFilterHoverBg: '#3c352b',
        },
        Button: {
          borderRadius: 0,
          fontWeight: 600,
        },
        Input: {
          colorBgContainer: '#2a241b',
          colorText: '#ddc7a1',
          colorBorder: '#5d4e37',
          borderRadius: 0,
          colorTextPlaceholder: '#8b7d6b',
          hoverBorderColor: '#8b7355',
          activeBorderColor: '#d4922a',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
        },
        Form: {
          labelColor: '#ddc7a1',
          verticalLabelPadding: '0 0 2px',
        },
        Typography: {
          titleMarginTop: 0,
          titleMarginBottom: 8,
        },
        Spin: {
          colorPrimary: '#d4922a',
          dotSize: 16,
        },
        Space: {
          size: 8,
        },
        Layout: {
          headerBg: '#1e1a16',
          bodyBg: '#2f2a24',
          siderBg: '#2a241b',
        },
      },
      algorithm: [], // Dark theme algorithm would conflict with custom colors
    },
  },
];