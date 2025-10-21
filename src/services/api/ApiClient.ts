/**
 * API Client
 * Axios-based HTTP client with interceptors, logging, and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { APIConfig, APIError, ErrorType } from './ApiTypes';

/**
 * ApiClient Class
 * Provides a configured Axios instance with comprehensive error handling,
 * request/response logging, and timeout management.
 */
export class ApiClient {
  private client: AxiosInstance;
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.url,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const method = config.method?.toUpperCase() || 'UNKNOWN';
        const url = config.url || 'unknown';
        console.log(`[API Request] ${method} ${url}`);
        console.log(`[API Request] Timestamp: ${new Date().toISOString()}`);

        // Log request size for monitoring
        if (config.data) {
          const dataSize = JSON.stringify(config.data).length;
          console.log(`[API Request] Payload size: ${dataSize} bytes`);
        }

        return config;
      },
      (error: AxiosError) => {
        console.error('[API Request Error]', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const status = response.status;
        const url = response.config.url || 'unknown';
        console.log(`[API Response] ${status} ${url}`);
        console.log(`[API Response] Timestamp: ${new Date().toISOString()}`);

        // Log response size for monitoring
        if (response.data) {
          const dataSize = JSON.stringify(response.data).length;
          console.log(`[API Response] Payload size: ${dataSize} bytes`);
        }

        return response;
      },
      (error: AxiosError) => {
        console.error('[API Response Error]', error.message);
        const classifiedError = this.handleAPIError(error);
        return Promise.reject(classifiedError);
      }
    );
  }

  /**
   * Handle and classify API errors
   */
  private handleAPIError(error: AxiosError): APIError {
    // Network errors (no response received)
    if (!error.response) {
      // Timeout error
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return {
          type: ErrorType.TIMEOUT_ERROR,
          message: 'Request timed out. The server took too long to respond.',
          code: error.code,
          retryable: true,
          suggestedAction: 'Check your internet connection and try again. If the problem persists, the service may be experiencing high load.',
        };
      }

      // Connection error
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return {
          type: ErrorType.NETWORK_ERROR,
          message: 'Unable to connect to the server.',
          code: error.code,
          retryable: true,
          suggestedAction: 'Please check your internet connection and ensure you are online.',
        };
      }

      // Generic network error
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network connection failed. Please check your internet connection.',
        code: error.code,
        retryable: true,
        suggestedAction: 'Verify your internet connection and try again.',
      };
    }

    // API errors (response received with error status)
    const status = error.response.status;
    const data = error.response.data as any;

    switch (status) {
      case 400:
        return {
          type: ErrorType.VALIDATION_ERROR,
          message: data?.error?.message || 'Invalid request. Please check your input.',
          code: status,
          details: data,
          retryable: false,
          suggestedAction: 'Please check the image quality and try again with a clearer photo.',
        };

      case 401:
        return {
          type: ErrorType.AUTHENTICATION_ERROR,
          message: 'Authentication failed. Invalid or missing API key.',
          code: status,
          details: data,
          retryable: false,
          suggestedAction: 'Please check your API key in Settings and ensure it is valid.',
        };

      case 403:
        return {
          type: ErrorType.AUTHENTICATION_ERROR,
          message: 'Access forbidden. Your API key may not have the required permissions.',
          code: status,
          details: data,
          retryable: false,
          suggestedAction: 'Verify that your API key has access to the Vision API.',
        };

      case 429:
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter ? `Wait ${retryAfter} seconds before trying again.` : 'Please wait a moment before trying again.';

        return {
          type: ErrorType.RATE_LIMIT_ERROR,
          message: 'Rate limit exceeded. You have made too many requests.',
          code: status,
          details: { ...data, retryAfter },
          retryable: true,
          suggestedAction: waitTime,
        };

      case 500:
        return {
          type: ErrorType.API_ERROR,
          message: 'Internal server error. The API server encountered an issue.',
          code: status,
          details: data,
          retryable: true,
          suggestedAction: 'The service is experiencing issues. Please try again in a few moments.',
        };

      case 502:
        return {
          type: ErrorType.API_ERROR,
          message: 'Bad gateway. The API server is unreachable.',
          code: status,
          details: data,
          retryable: true,
          suggestedAction: 'The service is temporarily unavailable. Please try again later.',
        };

      case 503:
        return {
          type: ErrorType.API_ERROR,
          message: 'Service unavailable. The API is temporarily down.',
          code: status,
          details: data,
          retryable: true,
          suggestedAction: 'The service is under maintenance or experiencing high load. Please try again later.',
        };

      case 504:
        return {
          type: ErrorType.TIMEOUT_ERROR,
          message: 'Gateway timeout. The request took too long to process.',
          code: status,
          details: data,
          retryable: true,
          suggestedAction: 'The request timed out. Try again with a smaller or clearer image.',
        };

      default:
        return {
          type: ErrorType.UNKNOWN_ERROR,
          message: data?.error?.message || `Unexpected error occurred (Status: ${status})`,
          code: status,
          details: data,
          retryable: status >= 500, // Server errors are retryable
          suggestedAction: 'An unexpected error occurred. Please try again or contact support if the issue persists.',
        };
    }
  }

  /**
   * Make a POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  /**
   * Make a GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  /**
   * Get the underlying Axios instance
   */
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }

  /**
   * Update API configuration
   */
  updateConfig(config: Partial<APIConfig>): void {
    this.config = { ...this.config, ...config };

    // Update Axios instance configuration
    if (config.url) {
      this.client.defaults.baseURL = config.url;
    }

    if (config.timeout) {
      this.client.defaults.timeout = config.timeout;
    }

    if (config.apiKey) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${config.apiKey}`;
    }
  }
}
