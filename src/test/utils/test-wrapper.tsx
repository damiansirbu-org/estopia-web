import React from 'react'
import { TerminalProvider } from '../../context/TerminalContext'
import { ErrorProvider } from '../../context/ErrorProvider'
import { ThemeContext } from '../../context/ThemeContext'

interface TestWrapperProps {
  children: React.ReactNode
}

// Mock theme context value
const mockThemeValue = {
  theme: 'light' as const,
  setTheme: () => {},
  toggleTheme: () => {}
}

// Test wrapper component that provides all necessary contexts
export function TestWrapper({ children }: TestWrapperProps) {
  return (
    <ThemeContext.Provider value={mockThemeValue}>
      <ErrorProvider>
        <TerminalProvider>
          {children}
        </TerminalProvider>
      </ErrorProvider>
    </ThemeContext.Provider>
  )
}

// Custom render function that wraps components with providers
export function renderWithProviders(ui: React.ReactElement, options = {}) {
  const { render } = require('@testing-library/react')
  
  return render(ui, {
    wrapper: TestWrapper,
    ...options
  })
}