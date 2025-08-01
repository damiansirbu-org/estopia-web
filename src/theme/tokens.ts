export const designTokens = {
  colors: {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    text: {
      primary: '#262626',
      secondary: '#595959',
      disabled: '#bfbfbf',
    },
    background: {
      primary: '#ffffff',
      secondary: '#fafafa',
      disabled: '#f5f5f5',
    },
    border: {
      primary: '#d9d9d9',
      secondary: '#bdbdbd',
      hover: '#888888',
    },
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    xxl: '2rem',    // 32px
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  borderRadius: {
    sm: 2,
    base: 6,
    lg: 8,
  },
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export const tableConfig = {
  pageSize: 20,
  rowHeight: 54,
} as const;

export type DesignTokens = typeof designTokens;