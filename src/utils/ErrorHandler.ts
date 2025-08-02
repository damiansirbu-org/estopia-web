// Clean exports - no legacy compatibility
export {
  BaseApiError as EstopiaError,
  ValidationError,
  BusinessError,
  NetworkError,
  type FieldError as ApiFieldError,
  type ErrorResponse
} from './errors/ErrorTypes';

export { ErrorFactory } from './errors/ErrorFactory';
export { apiClient } from './errors/AxiosErrorHandler';

// Import for internal use
import type { FieldError as ApiFieldError } from './errors/ErrorTypes';

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiFieldError[];
};