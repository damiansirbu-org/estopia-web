import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ErrorFactory } from './ErrorFactory';
import { BaseApiError, NetworkError, TimeoutError } from './ErrorTypes';

// Extend AxiosRequestConfig for custom options
declare module 'axios' {
  export interface AxiosRequestConfig {
    _skipGlobalErrorHandler?: boolean;
    _suppressToast?: boolean;
    _customErrorHandler?: (error: BaseApiError) => void;
  }
}

/**
 * Enhanced Axios instance with comprehensive error handling
 * Following 2024-2025 best practices
 */
class AxiosErrorHandler {
  private axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor() {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();
        
        // Log outgoing requests in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
            headers: config.headers,
          });
        }
        
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(ErrorFactory.networkError('Request configuration error'));
      }
    );
  }

  private setupResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }
        
        return response;
      },
      (error: AxiosError) => {
        return this.handleResponseError(error);
      }
    );
  }

  private handleResponseError(error: AxiosError): Promise<never> {
    const config = error.config as AxiosRequestConfig;
    
    // Skip global error handling if requested
    if (config?._skipGlobalErrorHandler) {
      return Promise.reject(error);
    }

    let apiError: BaseApiError;

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      apiError = ErrorFactory.timeoutError();
    } else if (!error.response) {
      // Network error (no response received)
      apiError = ErrorFactory.networkError(
        error.message || 'Network error. Please check your connection.'
      );
    } else {
      // HTTP error response
      const { status, data } = error.response;
      apiError = ErrorFactory.fromHttpResponse(status, data, error.config?.url);
      
      // Log error details in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ API Error: ${config?.method?.toUpperCase()} ${config?.url}`, {
          status,
          data,
          errorId: (data as any)?.errorId,
          requestId: error.config?.headers?.['X-Request-ID'],
        });
      }
    }

    // Handle custom error handler
    if (config?._customErrorHandler) {
      config._customErrorHandler(apiError);
    } else if (!config?._suppressToast) {
      // Default global error handling (show toast, etc.)
      this.handleGlobalError(apiError);
    }

    return Promise.reject(apiError);
  }

  private handleGlobalError(error: BaseApiError) {
    // This will be called for errors that aren't handled locally
    // You can integrate with your toast system here
    
    if (error.status >= 500) {
      // Server errors - show generic message with error ID if available
      const message = error.errorId 
        ? `Server error occurred. Reference ID: ${error.errorId}`
        : 'Server error occurred. Please try again later.';
      
      this.showErrorToast(message, 'error');
    } else if (error.status === 401) {
      // Unauthorized - might want to redirect to login
      this.showErrorToast('Please log in to continue', 'warning');
      // TODO: Redirect to login page
    } else if (error.status === 403) {
      // Forbidden
      this.showErrorToast('You don\'t have permission to perform this action', 'warning');
    } else if (error.status === 0) {
      // Network error
      this.showErrorToast('Connection error. Please check your internet connection.', 'error');
    } else {
      // Other client errors
      this.showErrorToast(error.message, 'warning');
    }
  }

  private showErrorToast(message: string, type: 'error' | 'warning' | 'info') {
    // TODO: Integrate with your toast notification system
    // For now, just console.error
    console.error(`[${type.toUpperCase()}] ${message}`);
    
    // Example integration with react-toastify:
    // import { toast } from 'react-toastify';
    // toast[type](message);
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Public methods to access the configured axios instance
  get instance() {
    return this.axiosInstance;
  }

  // Convenience methods that preserve error handling
  async get<T = any>(url: string, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // Method to make requests with custom error handling
  async requestWithCustomErrorHandler<T = any>(
    config: AxiosRequestConfig,
    errorHandler: (error: BaseApiError) => void
  ) {
    const requestConfig = {
      ...config,
      _customErrorHandler: errorHandler,
    };
    
    const response = await this.axiosInstance.request<T>(requestConfig);
    return response.data;
  }

  // Method to make requests without global error handling
  async requestWithoutGlobalHandling<T = any>(config: AxiosRequestConfig) {
    const requestConfig = {
      ...config,
      _skipGlobalErrorHandler: true,
    };
    
    const response = await this.axiosInstance.request<T>(requestConfig);
    return response.data;
  }

  // Method to make silent requests (no toast notifications)
  async silentRequest<T = any>(config: AxiosRequestConfig) {
    const requestConfig = {
      ...config,
      _suppressToast: true,
    };
    
    const response = await this.axiosInstance.request<T>(requestConfig);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new AxiosErrorHandler();
export default apiClient;