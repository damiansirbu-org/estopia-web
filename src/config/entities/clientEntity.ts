import { CLIENT_COLUMNS } from '../../constants/clientColumns';
import { clientService } from '../../services/api';
import type { Client, CreateClientRequest, UpdateClientRequest } from '../../types/models';
import type { EntityConfig, EntityService } from '../../types/entity/entityConfig';

// Create empty client for new records
const createEmptyClient = (): Client => ({
  id: 0, // This will be overridden with negative ID in EntityList
  name: '',
  nationalId: '',
  email: '',
  phoneNumber: '',
  address: '',
});

// Adapter to make clientService compatible with EntityService interface
const clientServiceAdapter: EntityService<Client, CreateClientRequest, UpdateClientRequest> = {
  getAll: (params) => clientService.getAllClients(params),
  create: (data) => clientService.createClient(data),
  update: (id, data) => clientService.updateClient(id, data),
  delete: (id) => clientService.deleteClient(id),
};

// Client entity configuration
export const clientEntityConfig: EntityConfig<Client, CreateClientRequest, UpdateClientRequest> = {
  name: 'Client',
  pluralName: 'Clients',
  columns: CLIENT_COLUMNS,
  service: clientServiceAdapter,
  createEmpty: createEmptyClient,
};