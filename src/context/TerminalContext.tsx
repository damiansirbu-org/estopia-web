import React, { useCallback, useRef, useState } from 'react';
import { TerminalContext } from './TerminalContextDefinition';
import type { TerminalMessage, TerminalMessageType } from './TerminalTypes';

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

 