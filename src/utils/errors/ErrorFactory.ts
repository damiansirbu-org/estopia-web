import {
  BaseApiError,
  ValidationError,
  BusinessError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  ServerError,
  NetworkError,
  TimeoutError,
  type ErrorResponse,
  type ApiResponseError,
  type FieldError
} from './ErrorTypes';

/**
 * Factory for creating strongly-typed error instances from API responses
 * Following 2024-2025 best practices for error handling
 */
export class ErrorFactory {
  
  /**
   * Create error from new backend ErrorResponse format
   */
  static fromErrorResponse(errorResponse: ErrorResponse): BaseApiError {
    const { errorId, status, title, detail, timestamp, path, fieldErrors } = errorResponse;
    
    if (fieldErrors && fieldErrors.length > 0) {
      return new ValidationError(detail, fieldErrors, errorId, timestamp, path);
    }
    
    switch (status) {
      case 400:
        return new ValidationError(detail, [], errorId, timestamp, path);
      case 401:
        return new UnauthorizedError(detail, errorId, timestamp, path);
      case 403:
        return new ForbiddenError(detail, errorId, timestamp, path);
      case 404:
        return new NotFoundError(detail.replace('The requested ', '').replace(' was not found', ''), errorId, timestamp, path);
      case 409:
        return new ConflictError(detail, errorId, timestamp, path);
      case 500:
      case 502:
      case 503:
        return new ServerError(detail, errorId, timestamp, path);
      default:
        return new BusinessError(detail, status, title, errorId, timestamp, path);
    }
  }
  
  /**
   * Create error from legacy ApiResponseError format (backwards compatibility)
   */
  static fromApiResponseError(apiError: ApiResponseError): BaseApiError {
    const fieldErrors: FieldError[] = apiError.errors?.map(e => ({
      field: e.field,
      message: e.message,
      rejectedValue: undefined
    })) || [];
    
    if (fieldErrors.length > 0) {
      return new ValidationError(apiError.message, fieldErrors);
    }
    
    return new BusinessError(apiError.message, 400, 'Bad Request');
  }
  
  /**
   * Create error from HTTP response
   */
  static fromHttpResponse(status: number, data: unknown, url?: string): BaseApiError {
    // Try to parse as new ErrorResponse format
    if (this.isErrorResponse(data)) {
      return this.fromErrorResponse(data);
    }
    
    // Try to parse as legacy ApiResponseError format
    if (this.isApiResponseError(data)) {
      return this.fromApiResponseError(data);
    }
    
    // Fallback to generic error based on status
    const message = this.extractMessageFromData(data) || this.getDefaultErrorMessage(status);
    
    switch (status) {
      case 400:
        return new BusinessError(message, 400, 'Bad Request');
      case 401:
        return new UnauthorizedError(message);
      case 403:
        return new ForbiddenError(message);
      case 404:
        return new NotFoundError('resource');
      case 409:
        return new ConflictError(message);
      case 422:
        return new ValidationError(message, []);
      case 500:
      case 502:
      case 503:
        return new ServerError(message);
      case 408:
        return new TimeoutError(message);
      default:
        return new BusinessError(message, status, `HTTP ${status}`);
    }
  }
  
  /**
   * Create network error
   */
  static networkError(message?: string): NetworkError {
    return new NetworkError(message);
  }
  
  /**
   * Create timeout error
   */
  static timeoutError(message?: string): TimeoutError {
    return new TimeoutError(message);
  }
  
  /**
   * Type guards and utility methods
   */
  private static isErrorResponse(data: unknown): data is ErrorResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'errorId' in data &&
      'status' in data &&
      'title' in data &&
      'detail' in data
    );
  }
  
  private static isApiResponseError(data: unknown): data is ApiResponseError {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      (data as ApiResponseError).success === false &&
      'message' in data
    );
  }
  
  private static extractMessageFromData(data: unknown): string | null {
    if (typeof data === 'string') {
      return data;
    }
    
    if (typeof data === 'object' && data !== null) {
      if ('message' in data && typeof (data as any).message === 'string') {
        return (data as any).message;
      }
      if ('detail' in data && typeof (data as any).detail === 'string') {
        return (data as any).detail;
      }
      if ('error' in data && typeof (data as any).error === 'string') {
        return (data as any).error;
      }
    }
    
    return null;
  }
  
  private static getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400: return 'Bad request';
      case 401: return 'Authentication required';
      case 403: return 'Access denied';
      case 404: return 'Resource not found';
      case 409: return 'Resource conflict';
      case 422: return 'Validation failed';
      case 500: return 'Internal server error';
      case 502: return 'Bad gateway';
      case 503: return 'Service unavailable';
      case 408: return 'Request timeout';
      default: return `HTTP error ${status}`;
    }
  }
}