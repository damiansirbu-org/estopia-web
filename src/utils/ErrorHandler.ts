// Custom error class with proper TypeScript types
export interface ApiFieldError {
  field: string;
  code: string;
  message: string;
}

export class EstopiaError extends Error {
  status: number;
  code: string;
  details?: unknown;
  fieldErrors?: ApiFieldError[];

  constructor(message: string, status: number = 500, code: string = 'UNKNOWN_ERROR', details?: unknown, fieldErrors?: ApiFieldError[]) {
    super(message);
    this.name = 'EstopiaError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.fieldErrors = fieldErrors;
  }
}

function hasFieldErrors(data: unknown): data is { errors: ApiFieldError[] } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'errors' in data &&
    Array.isArray((data as { errors: unknown }).errors)
  );
}

export const extractFieldErrors = (data: unknown): ApiFieldError[] | undefined => {
  if (hasFieldErrors(data)) {
    return data.errors.filter((e): e is ApiFieldError => !!e && typeof e.field === 'string');
  }
  return undefined;
};

// Error handler function with proper types
export const handleApiError = (error: unknown): EstopiaError => {
  console.error('API Error:', error);

  // Network errors
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return new EstopiaError(
      'Network error. Please check your connection.',
      0,
      'NETWORK_ERROR'
    );
  }

  const response = (error as { response: { status: number; data: unknown } }).response;
  const status = response.status;
  const data = response.data;
  const fieldErrors = extractFieldErrors(data);

  switch (status) {
    case 400:
      return new EstopiaError(
        data && typeof data === 'object' && 'message' in data ? (data as { message: string }).message : 'Invalid request data',
        400,
        'BAD_REQUEST',
        data,
        fieldErrors
      );

    case 401:
      return new EstopiaError(
        'Authentication required',
        401,
        'UNAUTHORIZED'
      );

    case 403:
      return new EstopiaError(
        'Access denied',
        403,
        'FORBIDDEN'
      );

    case 404:
      return new EstopiaError(
        data && typeof data === 'object' && 'message' in data ? (data as { message: string }).message : 'Resource not found',
        404,
        'NOT_FOUND'
      );

    case 409:
      return new EstopiaError(
        data && typeof data === 'object' && 'message' in data ? (data as { message: string }).message : 'Resource already exists',
        409,
        'CONFLICT'
      );

    case 422:
      return new EstopiaError(
        'Validation failed',
        422,
        'VALIDATION_ERROR',
        data && typeof data === 'object' && 'errors' in data ? (data as { errors: unknown }).errors : data,
        fieldErrors
      );

    case 500:
      return new EstopiaError(
        'Server error. Please try again later.',
        500,
        'SERVER_ERROR'
      );

    case 503:
      return new EstopiaError(
        'Service temporarily unavailable',
        503,
        'SERVICE_UNAVAILABLE'
      );

    default:
      return new EstopiaError(
        data && typeof data === 'object' && 'message' in data ? (data as { message: string }).message : 'An unexpected error occurred',
        status,
        'UNKNOWN_ERROR',
        data,
        fieldErrors
      );
  }
};

// Helper function for API calls with error handling
export const apiCall = async <T>(apiFunction: () => Promise<Response>): Promise<T> => {
  try {
    const response = await apiFunction();

    if (!response.ok) {
      // Create a mock error object similar to what axios would create
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const mockError = {
        response: {
          status: response.status,
          data: errorData
        }
      };
      throw handleApiError(mockError);
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
    if (error instanceof EstopiaError) {
      throw error;
    }
    throw handleApiError({ response: null });
  }
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiFieldError[];
};