import { useEffect, useState } from 'react';
import { DataGridStyleContext } from './DataGridStyleContext';

export function DataGridStyleProvider({ children }: { children: React.ReactNode }) {
    const [styleKey, setStyleKey] = useState<string>(() => localStorage.getItem('datagrid-style') || 'excel');

    useEffect(() => {
        localStorage.setItem('datagrid-style', styleKey);
    }, [styleKey]);

    return (
        <DataGridStyleContext.Provider value={{ styleKey, setStyleKey }}>
            {children}
        </DataGridStyleContext.Provider>
    );
} 