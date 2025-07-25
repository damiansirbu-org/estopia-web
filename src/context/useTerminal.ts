import { useContext } from 'react';
import { TerminalContext } from './TerminalContextDefinition';

export function useTerminal() {
    const ctx = useContext(TerminalContext);
    if (!ctx) throw new Error('useTerminal must be used within a TerminalProvider');
    return ctx;
}