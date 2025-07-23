import React, { useState } from 'react';

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

    return (
        <div className="absolute z-50 bg-white border border-gray-200 rounded shadow-md p-3 mt-2 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
                <select
                    value={localType}
                    onChange={e => setLocalType(e.target.value as FilterType)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                    {filterOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={localValue}
                    onChange={e => setLocalValue(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
                    placeholder="Value"
                />
            </div>
            <div className="flex justify-end gap-2">
                <button
                    onClick={handleClear}
                    className="text-gray-600 hover:text-gray-900 text-xs font-medium"
                >
                    Clear
                </button>
                <button
                    onClick={handleApply}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium"
                >
                    Apply
                </button>
            </div>
        </div>
    );
};

export default ColumnFilterPopover; 