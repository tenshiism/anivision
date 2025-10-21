/**
 * API Types
 * Comprehensive type definitions for OpenAI Vision API integration
 */

/**
 * API Configuration Interface
 */
export interface APIConfig {
  url: string;
  apiKey: string;
  model: 'gpt-4-vision-preview' | 'gpt-4o';
  maxTokens: number;
  temperature: number;
  timeout: number;
}

/**
 * Default API Configuration
 */
export const defaultConfig: APIConfig = {
  url: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o',
  maxTokens: 500,
  temperature: 0.1,
  timeout: 30000, // 30 seconds
};

/**
 * Image Processing Options
 */
export interface ImageProcessingOptions {
  maxSize: number; // in pixels
  quality: number; // 0-1
  format: 'jpeg' | 'png' | 'webp';
}

/**
 * Default Image Processing Options
 */
export const defaultImageOptions: ImageProcessingOptions = {
  maxSize: 1024,
  quality: 0.8,
  format: 'jpeg',
};

/**
 * Species Identification Request
 */
export interface SpeciesIdentificationRequest {
  image: string; // base64 encoded image
  prompt: string;
  maxTokens: number;
  temperature: number;
}

/**
 * Species Identification Result
 */
export interface SpeciesIdentificationResult {
  species: {
    commonName: string;
    scientificName: string;
    confidence: number;
    family?: string;
    order?: string;
    class?: string;
  };
  summary: string;
  additionalSpecies?: Array<{
    commonName: string;
    scientificName: string;
    confidence: number;
  }>;
  details?: {
    habitat?: string;
    behavior?: string;
    conservation?: string;
    interestingFacts?: string[];
  };
  imageQuality?: {
    clarity: 'high' | 'medium' | 'low';
    lighting: 'good' | 'fair' | 'poor';
    angle: 'frontal' | 'side' | 'top' | 'obscured';
  };
  error?: string;
  reasons?: string[];
  suggestions?: string[];
}

/**
 * OpenAI API Request Format
 */
export interface OpenAIRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'system' | 'assistant';
    content: Array<{
      type: 'text' | 'image_url';
      text?: string;
      image_url?: {
        url: string;
        detail: 'low' | 'high' | 'auto';
      };
    }>;
  }>;
  max_tokens: number;
  temperature: number;
}

/**
 * OpenAI API Response Format
 */
export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Error Types
 */
export enum ErrorType {
  NETWORK_ERROR = 'network_error',
  API_ERROR = 'api_error',
  VALIDATION_ERROR = 'validation_error',
  TIMEOUT_ERROR = 'timeout_error',
  RATE_LIMIT_ERROR = 'rate_limit_error',
  AUTHENTICATION_ERROR = 'auth_error',
  PROCESSING_ERROR = 'processing_error',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * API Error Interface
 */
export interface APIError {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: any;
  retryable: boolean;
  suggestedAction: string;
}

/**
 * Response Validation Result
 */
export interface ResponseValidationResult {
  isValid: boolean;
  isTruncated: boolean;
  suggestedActions: string[];
}

/**
 * Circuit Breaker State
 */
export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * API Metrics
 */
export interface APIMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  totalResponseTime: number;
}

/**
 * Performance Statistics
 */
export interface PerformanceStats {
  totalRequests: number;
  successRate: number;
  errorRate: number;
  averageResponseTime: number;
}

/**
 * Retry Configuration
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

/**
 * Default Retry Configuration
 */
export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

/**
 * Circuit Breaker Configuration
 */
export interface CircuitBreakerConfig {
  threshold: number;
  timeout: number;
}

/**
 * Default Circuit Breaker Configuration
 */
export const defaultCircuitBreakerConfig: CircuitBreakerConfig = {
  threshold: 5,
  timeout: 60000, // 1 minute
};
