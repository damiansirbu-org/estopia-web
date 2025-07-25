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
    clear: () => void;
    copy: () => void;
}