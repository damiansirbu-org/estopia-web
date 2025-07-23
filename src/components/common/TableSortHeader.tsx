import React from 'react';

interface TableSortHeaderProps {
    label: string;
    field: string;
    sortField: string;
    sortDirection: 'asc' | 'desc' | null;
    onSort: (field: string) => void;
}

const TableSortHeader: React.FC<TableSortHeaderProps> = ({ label, field, sortField, sortDirection, onSort }) => {
    const isActive = sortField === field;
    return (
        <th
            className={
                'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer select-none' +
                (isActive ? ' text-gray-900' : '')
            }
            onClick={() => onSort(field)}
            title={`Sort by ${label}`}
        >
            <span className="flex items-center gap-1">
                {label}
                {isActive && (
                    <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                )}
            </span>
        </th>
    );
};

export default TableSortHeader; 