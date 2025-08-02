// Re-export new error types for backwards compatibility
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

// Legacy function for backwards compatibility - use ErrorFactory instead
export const handleApiError = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return ErrorFactory.networkError('Network error. Please check your connection.');
  }

  const response = (error as { response: { status: number; data: unknown } }).response;
  return ErrorFactory.fromHttpResponse(response.status, response.data);
};

// Helper function for API calls with error handling - use apiClient instead
export const apiCall = async <T>(apiFunction: () => Promise<Response>): Promise<T> => {
  try {
    const response = await apiFunction();

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const apiError = ErrorFactory.fromHttpResponse(response.status, errorData);
      throw apiError;
    }

    // Handle empty responses (like DELETE operations returning 204)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null as T;
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        console.warn('Failed to parse JSON response, returning null');
        return null as T;
      }
    }

    return null as T;
  } catch (error) {
    if (error instanceof Error && error.name.includes('Error')) {
      throw error;
    }
    throw ErrorFactory.networkError('Network error occurred');
  }
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiFieldError[];
};