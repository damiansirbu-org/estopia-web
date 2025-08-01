import React, { useEffect, useRef } from 'react';
import type { TerminalMessage } from '../../context/TerminalTypes';

interface TerminalPanelProps {
    messages: TerminalMessage[];
    onClear: () => void;
    onCopy: () => void;
    maxMessages?: number;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ messages, onClear: _onClear, onCopy: _onCopy, maxMessages = 100 }) => {
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
            position: 'absolute',
            left: '0.5rem',
            right: '0.5rem',
            bottom: '0.5rem',
            background: '#fff',
            color: '#222',
            fontFamily: 'monospace',
            fontSize: 14,
            zIndex: 1000,
            borderTop: '2px solid #e0e0e0',
            height: '22vh', // Rounded from 21.78vh
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
            borderRadius: '0 0 8px 8px', // Round bottom corners to match container
        }}>
            {/* Simple spacing */}
            <div style={{
                height: '0.5rem', // Same as p-2 (8px)
                background: '#fff',
            }}></div>
            <div ref={panelRef} style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
                {messages.length === 0 ? (
                    <div style={{ color: '#bbb', textAlign: 'center', marginTop: '2rem' }}>
                        No messages yet
                    </div>
                ) : (
                    messages.slice(-maxMessages).map(msg => (
                        <div key={msg.id} style={{ color: msg.type === 'error' ? '#d32f2f' : msg.type === 'success' ? '#388e3c' : '#1976d2' }}>
                            <span style={{ opacity: 0.6, marginRight: '0.5rem' }}>[{formatTime(msg.timestamp)}]</span>
                            {msg.text}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TerminalPanel; 