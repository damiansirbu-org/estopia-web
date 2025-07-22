import { createContext } from 'react';
import type { ErrorContextType } from './ErrorContextTypes';

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined); 