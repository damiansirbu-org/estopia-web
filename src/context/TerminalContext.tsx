import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

export type TerminalMessageType = 'error' | 'success' | 'info';
export interface TerminalMessage {
    id: number;
    text: string;
    type: TerminalMessageType;
    timestamp: number;
}

interface TerminalContextValue {
    messages: TerminalMessage[];
    push: (text: string, type?: TerminalMessageType) => void;
    clear: () => void;
    copy: () => void;
}

const TerminalContext = createContext<TerminalContextValue | undefined>(undefined);

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<TerminalMessage[]>([]);
    const nextId = useRef(1);

    const push = useCallback((text: string, type: TerminalMessageType = 'info') => {
        setMessages(msgs => [
            ...msgs,
            { id: nextId.current++, text, type, timestamp: Date.now() },
        ]);
    }, []);

    const clear = useCallback(() => setMessages([]), []);

    const copy = useCallback(() => {
        const text = messages.map(m => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.text}`).join('\n');
        void navigator.clipboard.writeText(text);
    }, [messages]);

    return (
        <TerminalContext.Provider value={{ messages, push, clear, copy }}>
            {children}
        </TerminalContext.Provider>
    );
};

export function useTerminal() {
    const ctx = useContext(TerminalContext);
    if (!ctx) throw new Error('useTerminal must be used within a TerminalProvider');
    return ctx;
} 