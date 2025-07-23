import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { GridDensity, GridFilterModel, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';
import { DataGrid, GridRowEditStopReasons, GridRowModes, GridToolbarContainer, type GridCellParams, type GridColDef, type GridRowModesModel, type GridRowParams } from '@mui/x-data-grid';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useError } from '../context/useError';
import { clientService } from '../services/api';
import { DataGridStyleContext } from '../theme/DataGridStyleContext';
import type { Client, CreateClientRequest, UpdateClientRequest } from '../types/models';
import { EstopiaError } from '../utils/ErrorHandler';

function ClientListMUI() {
    const { withErrorHandling, loading } = useError();
    const [clients, setClients] = useState<Client[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
    const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
    const [addRowId, setAddRowId] = useState<number | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'firstName', sort: 'asc' }]);
    const { styleKey } = useContext(DataGridStyleContext);
    const stylePresets: Record<string, { sx: SxProps; density: GridDensity }> = {
        excel: {
            sx: {
                '& .MuiDataGrid-columnHeaders': { background: '#217346', color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' },
                '& .MuiDataGrid-cell': { borderRight: '1px solid #b7b7b7', fontFamily: 'monospace' },
                '& .MuiDataGrid-row': { borderBottom: '1px solid #b7b7b7' },
                border: '1px solid #217346', borderRadius: 2, fontSize: 15, background: '#fff',
            },
            density: 'compact',
        },
        airtable: {
            sx: {
                '& .MuiDataGrid-columnHeaders': { background: '#f5f5f5', color: '#222', fontWeight: 'bold', borderBottom: '2px solid #ccc', fontFamily: 'monospace' },
                '& .MuiDataGrid-cell': { borderRight: '1px solid #ccc', fontFamily: 'monospace' },
                '& .MuiDataGrid-row': { borderBottom: '1px solid #ccc' },
                border: '1px solid #ccc', borderRadius: 8, fontSize: 15, background: '#faf9f6',
            },
            density: 'comfortable',
        },
        minimal: {
            sx: {
                '& .MuiDataGrid-columnHeaders': { background: '#fff', color: '#222', fontWeight: 'bold', fontFamily: 'sans-serif' },
                '& .MuiDataGrid-cell': { borderRight: 'none', fontFamily: 'sans-serif' },
                '& .MuiDataGrid-row': { borderBottom: 'none' },
                border: '1px solid #e0e0e0', borderRadius: 4, fontSize: 15, background: '#fff',
            },
            density: 'standard',
        },
    };
    const preset = stylePresets[styleKey] || stylePresets['excel'];

    const filterFields = useMemo(() => [
        'firstName',
        'lastName',
        'nationalId',
        'email',
        'phoneNumber',
        'address',
    ], []);

    const columns = useMemo<GridColDef<Client>[]>(() => [
        { field: 'id', headerName: 'ID', width: 70, editable: false, type: 'number' },
        ...filterFields.map(field => ({
            field,
            headerName: field.charAt(0).toUpperCase() + field.slice(1),
            flex: 1,
            editable: true,
            minWidth: 120,
        })),
    ], [filterFields]);

    // Load clients
    const loadClients = useCallback(async (sort: GridSortModel = sortModel, filter: GridFilterModel = filterModel) => {
        await withErrorHandling(async () => {
            const sortField = sort[0]?.field;
            let sortDirection = sort[0]?.sort;
            if (sortDirection !== 'asc' && sortDirection !== 'desc') sortDirection = 'asc';
            // Map DataGrid filter model to backend DTO
            const filters: Record<string, { type: 'like', value: string }> = {};
            for (const item of filter.items) {
                if (item.value && item.value !== '' && item.field) {
                    filters[item.field] = { type: 'like', value: String(item.value) };
                }
            }
            const data = await clientService.getAllClients({ filters, sortField, sortDirection });
            setClients(data);
        });
    }, [withErrorHandling, sortModel, filterModel]);

    useEffect(() => {
        loadClients(sortModel, filterModel);

    }, [loadClients, sortModel, filterModel]);

    // Add new row on top
    const handleAddRow = () => {
        if (addRowId) return; // Only one add row at a time
        // Find a negative id that doesn't exist
        const minId = Math.min(0, ...clients.map(c => typeof c.id === 'number' ? c.id : 0));
        const newId = minId - 1;
        setClients(prev => [
            {
                id: newId,
                firstName: '',
                lastName: '',
                nationalId: '',
                email: '',
                phoneNumber: '',
                address: '',
            },
            ...prev,
        ]);
        setRowModesModel(prev => ({ ...prev, [newId]: { mode: GridRowModes.Edit } }));
        setAddRowId(newId);
    };

    // Save new or edited row
    const processRowUpdate = async (newRow: Client): Promise<Client> => {
        setFieldErrors({});
        if (typeof newRow.id === 'number' && newRow.id < 0) {
            // Add
            try {
                const clientData: CreateClientRequest = {
                    firstName: newRow.firstName,
                    lastName: newRow.lastName,
                    nationalId: newRow.nationalId,
                    address: newRow.address,
                    email: newRow.email,
                    phoneNumber: newRow.phoneNumber,
                };
                const savedClient = await clientService.createClient(clientData);
                setAddRowId(null);
                setClients(prev => [savedClient, ...prev.filter(r => r.id !== newRow.id)]);
                return savedClient;
            } catch (err) {
                if (err instanceof EstopiaError && err.fieldErrors) {
                    const fe: Record<string, string> = {};
                    for (const e of err.fieldErrors) {
                        fe[e.field] = e.message;
                    }
                    setFieldErrors(fe);
                }
                throw err;
            }
        } else {
            // Edit
            try {
                const updateData: UpdateClientRequest = {
                    firstName: newRow.firstName,
                    lastName: newRow.lastName,
                    nationalId: newRow.nationalId,
                    address: newRow.address,
                    email: newRow.email,
                    phoneNumber: newRow.phoneNumber,
                };
                const updatedClient = await clientService.updateClient(newRow.id, updateData);
                setClients(prev => prev.map(r => r.id === newRow.id ? updatedClient : r));
                return updatedClient;
            } catch (err) {
                if (err instanceof EstopiaError && err.fieldErrors) {
                    const fe: Record<string, string> = {};
                    for (const e of err.fieldErrors) {
                        fe[e.field] = e.message;
                    }
                    setFieldErrors(fe);
                }
                throw err;
            }
        }
    };

    // Delete selected
    const handleDelete = async () => {
        const selectedIds = Array.from(selectionModel.ids);
        if (selectedIds.length === 0) return;
        await withErrorHandling(async () => {
            const validIds = selectedIds.filter((id): id is number => typeof id === 'number' && Number.isFinite(id));
            for (const id of validIds) {
                if (typeof id !== 'number') continue;
                if (id < 0) {
                    setClients(prev => prev.filter(r => r.id !== id));
                    setAddRowId(null);
                } else {
                    await clientService.deleteClient(id as number);
                    setClients(prev => prev.filter(r => r.id !== id));
                }
            }
        });
    };

    // Edit selected
    const handleEdit = () => {
        const selectedIds = Array.from(selectionModel.ids);
        if (selectedIds.length === 1) {
            setRowModesModel(prev => ({ ...prev, [selectedIds[0]]: { mode: GridRowModes.Edit } }));
        }
    };

    // Row click to edit
    const handleRowClick = (params: GridRowParams) => {
        if (!addRowId || params.id !== addRowId) {
            setRowModesModel(prev => ({ ...prev, [params.id]: { mode: GridRowModes.Edit } }));
        }
    };

    // Cancel edit
    const handleRowEditStop = (params: GridRowParams) => {
        // Type guard for params with reason
        type ParamsWithReason = GridRowParams & { reason?: string };
        const p = params as ParamsWithReason;
        if (p.reason === GridRowEditStopReasons.escapeKeyDown) {
            setRowModesModel(prev => ({ ...prev, [p.id]: { mode: GridRowModes.View } }));
            if (typeof p.id === 'number' && p.id < 0) {
                setClients(prev => prev.filter(r => r.id !== p.id));
                setAddRowId(null);
            }
        }
    };

    // Custom toolbar
    function CustomToolbar() {
        const selectedIds = Array.from(selectionModel.ids);
        return (
            <GridToolbarContainer>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1 }}>
                    <Button startIcon={<AddIcon />} onClick={handleAddRow} size="small" variant="contained" color="success" disabled={!!addRowId}>Add</Button>
                    <Button startIcon={<EditIcon />} onClick={handleEdit} size="small" variant="outlined" disabled={selectedIds.length !== 1}>Edit</Button>
                    <Button startIcon={<DeleteIcon />} onClick={handleDelete} size="small" variant="outlined" color="error" disabled={selectedIds.length === 0}>Delete</Button>
                </Stack>
            </GridToolbarContainer>
        );
    }

    // Add error display to editable cells
    const getCellClassName = (params: GridCellParams) => {
        if (fieldErrors[params.field]) return 'Mui-error';
        return '';
    };

    const handleSortModelChange = (model: GridSortModel) => {
        setSortModel(model.length ? model : [{ field: 'firstName', sort: 'asc' }]);
    };

    const handleFilterModelChange = (model: GridFilterModel) => {
        setFilterModel(model);
    };

    return (
        <div style={{ height: 600, width: '100%', background: '#fff', border: '1px solid #ccc', borderRadius: 8, marginTop: 24 }}>
            <DataGrid
                rows={clients || []}
                columns={columns || []}
                checkboxSelection
                disableRowSelectionOnClick={false}
                rowSelectionModel={selectionModel}
                onRowSelectionModelChange={setSelectionModel}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={setRowModesModel}
                processRowUpdate={processRowUpdate}
                onRowClick={handleRowClick}
                onRowEditStop={handleRowEditStop}
                slots={{ toolbar: CustomToolbar }}
                filterModel={filterModel}
                onFilterModelChange={handleFilterModelChange}
                getCellClassName={getCellClassName}
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                sx={preset.sx}
                density={preset.density}
                loading={loading}
            />
        </div>
    );
}

export default ClientListMUI; 