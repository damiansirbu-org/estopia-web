import type { ThemeConfig } from 'antd';
import React, { useEffect, useState } from 'react';
import { themePresets } from '../theme/themePresets';
import { ThemeContext } from './ThemeContextDefinition';
import type { ThemeContextValue } from './ThemeContextDefinition';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string>(() => 
    localStorage.getItem('antd-theme') || 'default'
  );

  useEffect(() => {
    localStorage.setItem('antd-theme', currentTheme);
  }, [currentTheme]);

  const getThemeConfig = (): ThemeConfig => {
    const preset = themePresets.find(p => p.key === currentTheme) || themePresets[0];
    return preset.theme;
  };

  const value: ThemeContextValue = {
    currentTheme,
    setCurrentTheme,
    themes: themePresets,
    getThemeConfig,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

