// Custom error class with proper TypeScript types
export class EstopiaError extends Error {
  status: number;
  code: string;
  details?: any;

  constructor(message: string, status: number = 500, code: string = 'UNKNOWN_ERROR', details?: any) {
    super(message);
    this.name = 'EstopiaError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Error handler function with proper types
export const handleApiError = (error: any): EstopiaError => {
  console.error('API Error:', error);

  // Network errors
  if (!error.response) {
    return new EstopiaError(
      'Network error. Please check your connection.',
      0,
      'NETWORK_ERROR'
    );
  }

  const status = error.response.status;
  const data = error.response.data;

  switch (status) {
    case 400:
      return new EstopiaError(
        data?.message || 'Invalid request data',
        400,
        'BAD_REQUEST',
        data
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
        data?.message || 'Resource not found',
        404,
        'NOT_FOUND'
      );

    case 409:
      return new EstopiaError(
        data?.message || 'Resource already exists',
        409,
        'CONFLICT'
      );

    case 422:
      return new EstopiaError(
        'Validation failed',
        422,
        'VALIDATION_ERROR',
        data?.errors || data
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
        data?.message || 'An unexpected error occurred',
        status,
        'UNKNOWN_ERROR',
        data
      );
  }
};

// Helper function for API calls with error handling
export const apiCall = async <T>(apiFunction: () => Promise<Response>): Promise<T> => {
  try {
    const response = await apiFunction();

    if (!response.ok) {
      // Create a mock error object similar to what axios would create
      const mockError = {
        response: {
          status: response.status,
          data: await response.json().catch(() => ({ message: response.statusText }))
        }
      };
      throw handleApiError(mockError);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof EstopiaError) {
      throw error;
    }
    throw handleApiError(error);
  }
};