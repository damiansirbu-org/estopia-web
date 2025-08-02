// Enhanced error types following 2024-2025 best practices

export interface FieldError {
  field: string;
  message: string;
  rejectedValue?: unknown;
}

export interface ErrorResponse {
  errorId: string;
  status: number;
  title: string;
  detail: string;
  timestamp: string;
  path: string;
  fieldErrors?: FieldError[];
}

export interface ApiResponseError {
  success: false;
  data: null;
  message: string;
  errors?: FieldError[];
}

// Custom error classes for different error scenarios
export class BaseApiError extends Error {
  public readonly errorId?: string;
  public readonly status: number;
  public readonly title: string;
  public readonly timestamp?: string;
  public readonly path?: string;
  
  constructor(message: string, status: number, title: string, errorId?: string, timestamp?: string, path?: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.title = title;
    this.errorId = errorId;
    this.timestamp = timestamp;
    this.path = path;
    
    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends BaseApiError {
  public readonly fieldErrors: FieldError[];
  
  constructor(message: string, fieldErrors: FieldError[], errorId?: string, timestamp?: string, path?: string) {
    super(message, 400, 'Validation Failed', errorId, timestamp, path);
    this.fieldErrors = fieldErrors;
  }
  
  getFieldError(fieldName: string): FieldError | undefined {
    return this.fieldErrors.find(error => error.field === fieldName);
  }
  
  getFieldErrorMessage(fieldName: string): string | undefined {
    return this.getFieldError(fieldName)?.message;
  }
  
  hasFieldError(fieldName: string): boolean {
    return this.fieldErrors.some(error => error.field === fieldName);
  }
  
  formatFieldErrors(): string {
    return this.fieldErrors
      .map(error => `${error.field}: ${error.message}`)
      .join(', ');
  }
}

export class BusinessError extends BaseApiError {
  constructor(message: string, status: number, title: string, errorId?: string, timestamp?: string, path?: string) {
    super(message, status, title, errorId, timestamp, path);
  }
}

export class NotFoundError extends BusinessError {
  constructor(resource: string, errorId?: string, timestamp?: string, path?: string) {
    super(`The requested ${resource} was not found`, 404, 'Resource Not Found', errorId, timestamp, path);
  }
}

export class ConflictError extends BusinessError {
  constructor(message: string, errorId?: string, timestamp?: string, path?: string) {
    super(message, 409, 'Conflict', errorId, timestamp, path);
  }
}

export class UnauthorizedError extends BaseApiError {
  constructor(message: string = 'Authentication required', errorId?: string, timestamp?: string, path?: string) {
    super(message, 401, 'Unauthorized', errorId, timestamp, path);
  }
}

export class ForbiddenError extends BaseApiError {
  constructor(message: string = 'Access denied', errorId?: string, timestamp?: string, path?: string) {
    super(message, 403, 'Forbidden', errorId, timestamp, path);
  }
}

export class ServerError extends BaseApiError {
  constructor(message: string, errorId?: string, timestamp?: string, path?: string) {
    super(message, 500, 'Internal Server Error', errorId, timestamp, path);
  }
}

export class NetworkError extends BaseApiError {
  constructor(message: string = 'Network error. Please check your connection.') {
    super(message, 0, 'Network Error');
  }
}

export class TimeoutError extends BaseApiError {
  constructor(message: string = 'Request timed out. Please try again.') {
    super(message, 408, 'Request Timeout');
  }
}