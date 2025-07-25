import React, { useState } from 'react';
import { designTokens } from '../../theme/tokens';

export type FilterType = 'like' | 'notLike';

interface ColumnFilterPopoverProps {
    value: string;
    type: FilterType;
    onChange: (type: FilterType, value: string) => void;
    onApply: () => void;
    onClear: () => void;
    onClose: () => void;
}

const filterOptions = [
    { label: 'Like', value: 'like' },
    { label: 'Not Like', value: 'notLike' },
];

const ColumnFilterPopover: React.FC<ColumnFilterPopoverProps> = ({ value, type, onChange, onApply, onClear, onClose }) => {
    const [localType, setLocalType] = useState<FilterType>(type);
    const [localValue, setLocalValue] = useState<string>(value);

    const handleApply = () => {
        onChange(localType, localValue);
        onApply();
        onClose();
    };

    const handleClear = () => {
        setLocalValue('');
        onChange(localType, '');
        onClear();
        onClose();
    };

    const containerStyle: React.CSSProperties = {
        position: 'absolute',
        zIndex: designTokens.zIndex.popover,
        backgroundColor: designTokens.colors.background.primary,
        border: `1px solid ${designTokens.colors.border.primary}`,
        borderRadius: designTokens.borderRadius.base,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        padding: designTokens.spacing.md,
        marginTop: designTokens.spacing.sm,
        minWidth: 180,
    };

    const inputRowStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: designTokens.spacing.sm,
        marginBottom: designTokens.spacing.sm,
    };

    const selectStyle: React.CSSProperties = {
        padding: `${designTokens.spacing.xs}px ${designTokens.spacing.sm}px`,
        border: `1px solid ${designTokens.colors.border.primary}`,
        borderRadius: designTokens.borderRadius.base,
        fontSize: designTokens.fontSize.sm,
    };

    const inputStyle: React.CSSProperties = {
        ...selectStyle,
        flex: 1,
    };

    const buttonRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: designTokens.spacing.sm,
    };

    const buttonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: designTokens.fontSize.xs,
        fontWeight: designTokens.fontWeight.medium,
        padding: 0,
    };

    const clearButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        color: designTokens.colors.text.secondary,
    };

    const applyButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        color: designTokens.colors.primary,
    };

    return (
        <div style={containerStyle}>
            <div style={inputRowStyle}>
                <select
                    value={localType}
                    onChange={e => setLocalType(e.target.value as FilterType)}
                    style={selectStyle}
                >
                    {filterOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={localValue}
                    onChange={e => setLocalValue(e.target.value)}
                    style={inputStyle}
                    placeholder="Value"
                />
            </div>
            <div style={buttonRowStyle}>
                <button
                    onClick={handleClear}
                    style={clearButtonStyle}
                >
                    Clear
                </button>
                <button
                    onClick={handleApply}
                    style={applyButtonStyle}
                >
                    Apply
                </button>
            </div>
        </div>
    );
};

export default ColumnFilterPopover; 