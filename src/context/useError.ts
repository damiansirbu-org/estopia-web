import { useContext } from 'react';
import { ErrorContext } from './ErrorContext';
import type { ErrorContextType } from './ErrorContextTypes';

export const useError = (): ErrorContextType => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
} 