import { createContext } from 'react';

interface DataGridStyleContextType {
    styleKey: string;
    setStyleKey: (key: string) => void;
}

export const DataGridStyleContext = createContext<DataGridStyleContextType>({
    styleKey: 'excel',
    setStyleKey: () => { },
}); 