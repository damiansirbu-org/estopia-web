import type { GridDensity } from '@mui/x-data-grid';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useContext, useEffect, useState } from 'react';
import { DataGridStyleContext } from '../theme/DataGridStyleContext';

const stylePresets: { key: string; label: string; sx: object; density: GridDensity }[] = [
    {
        key: 'excel',
        label: 'Excel',
        sx: {
            '& .MuiDataGrid-columnHeaders': { background: '#217346', color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' },
            '& .MuiDataGrid-cell': { borderRight: '1px solid #b7b7b7', fontFamily: 'monospace' },
            '& .MuiDataGrid-row': { borderBottom: '1px solid #b7b7b7' },
            border: '1px solid #217346', borderRadius: 2, fontSize: 15, background: '#fff',
        },
        density: 'compact',
    },
    {
        key: 'airtable',
        label: 'Airtable/Retro',
        sx: {
            '& .MuiDataGrid-columnHeaders': { background: '#f5f5f5', color: '#222', fontWeight: 'bold', borderBottom: '2px solid #ccc', fontFamily: 'monospace' },
            '& .MuiDataGrid-cell': { borderRight: '1px solid #ccc', fontFamily: 'monospace' },
            '& .MuiDataGrid-row': { borderBottom: '1px solid #ccc' },
            border: '1px solid #ccc', borderRadius: 8, fontSize: 15, background: '#faf9f6',
        },
        density: 'comfortable',
    },
    {
        key: 'minimal',
        label: 'Minimal',
        sx: {
            '& .MuiDataGrid-columnHeaders': { background: '#fff', color: '#222', fontWeight: 'bold', fontFamily: 'sans-serif' },
            '& .MuiDataGrid-cell': { borderRight: 'none', fontFamily: 'sans-serif' },
            '& .MuiDataGrid-row': { borderBottom: 'none' },
            border: '1px solid #e0e0e0', borderRadius: 4, fontSize: 15, background: '#fff',
        },
        density: 'standard',
    },
];

const previewRows = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
];
const previewColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', width: 120 },
    { field: 'lastName', headerName: 'Last Name', width: 120 },
    { field: 'email', headerName: 'Email', width: 180 },
];

export default function Settings() {
    const { styleKey, setStyleKey } = useContext(DataGridStyleContext) as { styleKey: string; setStyleKey: (key: string) => void };
    const [selected, setSelected] = useState(styleKey || 'excel');

    useEffect(() => {
        setStyleKey(selected);
        localStorage.setItem('datagrid-style', selected);
    }, [selected, setStyleKey]);

    const preset = stylePresets.find(p => p.key === selected) || stylePresets[0];

    return (
        <div style={{ maxWidth: 700, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
            <h2>DataGrid Style Settings</h2>
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                {stylePresets.map(p => (
                    <label key={p.key} style={{ cursor: 'pointer', padding: 8, border: selected === p.key ? '2px solid #1976d2' : '1px solid #ccc', borderRadius: 6, background: selected === p.key ? '#e3f2fd' : '#fafafa' }}>
                        <input type="radio" name="datagrid-style" value={p.key} checked={selected === p.key} onChange={() => setSelected(p.key)} style={{ marginRight: 8 }} />
                        {p.label}
                    </label>
                ))}
            </div>
            <div style={{ height: 260, width: '100%' }}>
                <DataGrid
                    rows={previewRows}
                    columns={previewColumns}
                    sx={preset.sx}
                    density={preset.density}
                    hideFooter
                    disableColumnMenu
                    disableRowSelectionOnClick
                />
            </div>
        </div>
    );
} 