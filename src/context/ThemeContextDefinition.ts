import type { ThemeConfig } from 'antd';
import { createContext } from 'react';
import type { ThemePreset } from '../theme/themePresets';

export interface ThemeContextValue {
  currentTheme: string;
  setCurrentTheme: (themeKey: string) => void;
  themes: ThemePreset[];
  getThemeConfig: () => ThemeConfig;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);