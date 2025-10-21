/**
 * API Services Barrel Export
 * Central export point for all API-related services, types, and utilities
 */

// Main Services
export { ApiClient } from './ApiClient';
export { OpenAIService, ResponseProcessor, CircuitBreaker, RetryManager } from './OpenAIService';

// Types
export type {
  APIConfig,
  APIError,
  ImageProcessingOptions,
  SpeciesIdentificationRequest,
  SpeciesIdentificationResult,
  OpenAIRequest,
  OpenAIResponse,
  ResponseValidationResult,
  CircuitBreakerState,
  APIMetrics,
  PerformanceStats,
  RetryConfig,
  CircuitBreakerConfig,
} from './ApiTypes';

// Enums
export { ErrorType } from './ApiTypes';

// Default Configurations
export {
  defaultConfig,
  defaultImageOptions,
  defaultRetryConfig,
  defaultCircuitBreakerConfig,
} from './ApiTypes';
