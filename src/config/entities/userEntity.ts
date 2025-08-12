import { USER_COLUMNS } from '../../constants/userColumns';
import { userService } from '../../services/api';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../types/models';
import type { EntityConfig, EntityService } from '../../types/entity/entityConfig';

// Create empty user for new records
const createEmptyUser = (): User => ({
  id: 0, // This will be overridden with negative ID in EntityList
  username: '',
  fullName: '',
  role: 'USER',
  clientId: undefined,
  clientName: undefined,
  isActive: true,
  mustEnroll: false,
});

// Adapter to make userService compatible with EntityService interface
const userServiceAdapter: EntityService<User, CreateUserRequest, UpdateUserRequest> = {
  getAll: (params) => userService.getAllUsers(params),
  create: (data) => userService.createUser(data),
  update: (id, data) => userService.updateUser(id, data),
  delete: (id) => userService.deleteUser(id),
};

// User entity configuration
export const userEntityConfig: EntityConfig<User, CreateUserRequest, UpdateUserRequest> = {
  name: 'User',
  pluralName: 'Users',
  columns: USER_COLUMNS,
  service: userServiceAdapter,
  createEmpty: createEmptyUser,
};