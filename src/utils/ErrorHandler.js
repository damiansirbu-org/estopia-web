// Custom error class
export class EstopiaError extends Error {
  constructor(message, status = 500, code = 'UNKNOWN_ERROR', details = null) {
    super(message);
    this.name = 'EstopiaError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Error handler function - DEFINED FIRST
export const handleApiError = (error) => {
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

    default:
      return new EstopiaError(
        data?.message || 'Something went wrong',
        status,
        'UNKNOWN_ERROR',
        data
      );
  }
};

// Async wrapper for API calls - DEFINED AFTER handleApiError
export const apiCall = async (apiFunction) => {
  try {
    const response = await apiFunction();

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw {
        response: {
          status: response.status,
          data: errorData
        }
      };
    }

    // Handle empty responses (like DELETE operations returning 204)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};