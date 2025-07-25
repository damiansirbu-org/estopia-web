import { createContext } from 'react';
import type { TerminalContextValue } from './TerminalTypes';

export const TerminalContext = createContext<TerminalContextValue | undefined>(undefined);