import React from 'react';

interface TableFilterProps {
    fields: string[];
    values: Record<string, string>;
    onChange: (field: string, value: string) => void;
}

const TableFilter: React.FC<TableFilterProps> = ({ fields, values, onChange }) => {
    return (
        <tr className="bg-gray-100">
            {fields.map((field) => (
                <td key={field} className="px-6 py-2">
                    <input
                        type="text"
                        value={values[field] || ''}
                        onChange={e => onChange(field, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder={`Filter ${field}`}
                    />
                </td>
            ))}
            <td /> {/* For actions column */}
        </tr>
    );
};

export default TableFilter; 