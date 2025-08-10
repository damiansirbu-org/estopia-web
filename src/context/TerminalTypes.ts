export type TerminalMessageType = 'error' | 'success' | 'info';

export interface TerminalMessage {
    id: number;
    text: string;
    type: TerminalMessageType;
    timestamp: number;
}

export interface TerminalContextValue {
    messages: TerminalMessage[];
    push: (text: string, type?: TerminalMessageType) => void;
    success: (text: string) => void;
    error: (text: string) => void; 
    info: (text: string) => void;
    clear: () => void;
    copy: () => void;
}