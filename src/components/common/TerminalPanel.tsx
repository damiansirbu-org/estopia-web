import React, { useEffect, useRef } from 'react';
import type { TerminalMessage } from '../../context/TerminalTypes';

interface TerminalPanelProps {
    messages: TerminalMessage[];
    onClear: () => void;
    onCopy: () => void;
    maxMessages?: number;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ messages, onClear, onCopy, maxMessages = 100 }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom on new message
        if (panelRef.current) {
            panelRef.current.scrollTop = panelRef.current.scrollHeight;
        }
    }, [messages]);

    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleTimeString();
    };

    return (
        <div style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#fff',
            color: '#222',
            fontFamily: 'monospace',
            fontSize: 14,
            zIndex: 1000,
            borderTop: '2px solid #e0e0e0',
            height: 180,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
        }}>
            {/* Top bar with separator and left-aligned buttons */}
            <div style={{
                padding: '4px 12px',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                background: '#fafafa',
                minHeight: 32,
            }}>
                <button
                    onClick={onCopy}
                    title="Copy all messages"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#555',
                        cursor: 'pointer',
                        fontSize: 14,
                        marginRight: 8,
                        padding: '2px 8px',
                        borderRadius: 4,
                        transition: 'background 0.2s',
                    }}
                    aria-label="Copy"
                >
                    Copy
                </button>
                <button
                    onClick={onClear}
                    title="Clear messages"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#555',
                        cursor: 'pointer',
                        fontSize: 14,
                        padding: '2px 8px',
                        borderRadius: 4,
                        transition: 'background 0.2s',
                    }}
                    aria-label="Clear"
                >
                    Clear
                </button>
            </div>
            <div ref={panelRef} style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
                {messages.length === 0 ? (
                    <div style={{ color: '#bbb', textAlign: 'center', marginTop: 32 }}>
                        No messages yet
                    </div>
                ) : (
                    messages.slice(-maxMessages).map(msg => (
                        <div key={msg.id} style={{ color: msg.type === 'error' ? '#d32f2f' : msg.type === 'success' ? '#388e3c' : '#1976d2' }}>
                            <span style={{ opacity: 0.6, marginRight: 8 }}>[{formatTime(msg.timestamp)}]</span>
                            {msg.text}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TerminalPanel; 