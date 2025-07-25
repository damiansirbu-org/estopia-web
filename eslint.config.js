import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      // Performance-friendly React Hooks rules
      'react-hooks/exhaustive-deps': 'warn', // Demote to warning instead of error
      'react-hooks/rules-of-hooks': 'error',  // Keep this as error for correctness
      
      // Performance optimizations
      '@typescript-eslint/no-empty-function': 'off', // Allow empty functions for performance callbacks
      '@typescript-eslint/no-explicit-any': 'warn',  // Warn instead of error for quick prototyping
      '@typescript-eslint/ban-ts-comment': 'warn',   // Allow @ts-ignore for performance hacks
    },
  },
])
