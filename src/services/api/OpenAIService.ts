/**
 * OpenAI Service
 * Complete OpenAI Vision API integration with circuit breaker, retry logic,
 * response processing, and comprehensive error handling.
 */

import { ApiClient } from './ApiClient';
import {
  APIConfig,
  APIError,
  ErrorType,
  SpeciesIdentificationResult,
  OpenAIRequest,
  OpenAIResponse,
  CircuitBreakerState,
  defaultRetryConfig,
  defaultCircuitBreakerConfig,
  ResponseValidationResult,
} from './ApiTypes';

/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by temporarily blocking requests after repeated failures
 */
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: CircuitBreakerState = 'CLOSED';
  private threshold: number;
  private timeout: number;

  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        console.log('[Circuit Breaker] Transitioning to HALF_OPEN state');
        this.state = 'HALF_OPEN';
      } else {
        const waitTime = Math.ceil((this.timeout - (Date.now() - this.lastFailureTime)) / 1000);
        throw {
          type: ErrorType.API_ERROR,
          message: `Circuit breaker is OPEN. Service temporarily unavailable.`,
          code: 'CIRCUIT_BREAKER_OPEN',
          retryable: true,
          suggestedAction: `Too many failed requests. Please wait ${waitTime} seconds before trying again.`,
        } as APIError;
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      console.log('[Circuit Breaker] Transitioning to CLOSED state');
    }
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      console.log(`[Circuit Breaker] Threshold reached (${this.failures}/${this.threshold}). Transitioning to OPEN state`);
      this.state = 'OPEN';
    }
  }

  getState(): CircuitBreakerState {
    return this.state;
  }

  reset(): void {
    this.failures = 0;
    this.lastFailureTime = 0;
    this.state = 'CLOSED';
    console.log('[Circuit Breaker] Reset to CLOSED state');
  }
}

/**
 * Retry Manager with Exponential Backoff
 * Automatically retries failed requests with increasing delays
 */
class RetryManager {
  private maxRetries: number;
  private baseDelay: number;

  constructor(maxRetries = 3, baseDelay = 1000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }

  async withRetry<T>(
    operation: () => Promise<T>,
    shouldRetry?: (error: APIError) => boolean
  ): Promise<T> {
    let lastError: APIError | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`[Retry Manager] Attempt ${attempt}/${this.maxRetries}`);
        }
        return await operation();
      } catch (error) {
        lastError = error as APIError;

        // Check if we should retry
        const isRetryable = shouldRetry ? shouldRetry(lastError) : lastError.retryable;

        if (!isRetryable || attempt === this.maxRetries) {
          console.log(`[Retry Manager] Max retries reached or error not retryable`);
          throw lastError;
        }

        // Calculate delay with exponential backoff and jitter
        const exponentialDelay = this.baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 1000; // Add up to 1 second of random jitter
        const delay = Math.min(exponentialDelay + jitter, 10000); // Cap at 10 seconds

        console.log(`[Retry Manager] Retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${this.maxRetries})`);
        console.log(`[Retry Manager] Error: ${lastError.message}`);

        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Response Processor
 * Handles parsing, validation, and sanitization of API responses
 */
class ResponseProcessor {
  /**
   * Process and validate OpenAI API response
   */
  static processResponse(apiResponse: OpenAIResponse): SpeciesIdentificationResult {
    try {
      // Extract message content
      const content = apiResponse.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from API');
      }

      console.log(`[Response Processor] Processing response (${content.length} characters)`);

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      // Parse JSON
      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and sanitize
      return this.validateAndSanitize(parsed);
    } catch (error) {
      console.error('[Response Processor] Processing failed:', error);
      throw {
        type: ErrorType.PROCESSING_ERROR,
        message: `Failed to process API response: ${(error as Error).message}`,
        code: 'RESPONSE_PROCESSING_ERROR',
        retryable: false,
        suggestedAction: 'The API returned an unexpected response. Please try again.',
      } as APIError;
    }
  }

  /**
   * Validate and sanitize parsed response data
   */
  private static validateAndSanitize(data: any): SpeciesIdentificationResult {
    // Handle error responses
    if (data.error) {
      console.log('[Response Processor] API returned error response');
      return {
        error: data.error,
        reasons: data.reasons || [],
        suggestions: data.suggestions || [],
        species: {
          commonName: 'Unknown',
          scientificName: 'Unknown',
          confidence: 0,
        },
        summary: 'No species could be identified',
      };
    }

    // Validate required fields
    if (!data.species?.commonName || !data.species?.scientificName) {
      throw new Error('Missing required species information in response');
    }

    // Sanitize confidence values
    const sanitizeConfidence = (value: any): number => {
      const num = parseFloat(value);
      if (isNaN(num)) {
        console.warn('[Response Processor] Invalid confidence value, defaulting to 0');
        return 0;
      }
      return Math.min(1, Math.max(0, num));
    };

    // Build validated result
    const result: SpeciesIdentificationResult = {
      species: {
        commonName: String(data.species.commonName),
        scientificName: String(data.species.scientificName),
        confidence: sanitizeConfidence(data.species.confidence),
        family: data.species.family ? String(data.species.family) : undefined,
        order: data.species.order ? String(data.species.order) : undefined,
        class: data.species.class ? String(data.species.class) : undefined,
      },
      summary: data.summary ? String(data.summary) : 'No summary available',
      additionalSpecies: data.additionalSpecies?.map((sp: any) => ({
        commonName: String(sp.commonName),
        scientificName: String(sp.scientificName),
        confidence: sanitizeConfidence(sp.confidence),
      })) || [],
      details: data.details ? {
        habitat: data.details.habitat ? String(data.details.habitat) : undefined,
        behavior: data.details.behavior ? String(data.details.behavior) : undefined,
        conservation: data.details.conservation ? String(data.details.conservation) : undefined,
        interestingFacts: Array.isArray(data.details.interestingFacts)
          ? data.details.interestingFacts.map((fact: any) => String(fact))
          : undefined,
      } : undefined,
      imageQuality: data.imageQuality ? {
        clarity: data.imageQuality.clarity || 'medium',
        lighting: data.imageQuality.lighting || 'fair',
        angle: data.imageQuality.angle || 'frontal',
      } : undefined,
    };

    console.log(`[Response Processor] Successfully processed species: ${result.species.commonName}`);
    return result;
  }

  /**
   * Handle long responses by truncating gracefully
   */
  static handleLongResponse(response: string, maxLength = 1000): string {
    if (response.length <= maxLength) {
      return response;
    }

    console.warn(`[Response Processor] Long response detected (${response.length} chars), truncating...`);

    // Try to extract complete JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch && jsonMatch[0].length <= maxLength) {
      return jsonMatch[0];
    }

    // If JSON is too long, try to truncate gracefully
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);

        // Keep only essential fields
        const truncated = {
          species: parsed.species,
          summary: parsed.summary,
          error: 'Response truncated due to length',
        };

        return JSON.stringify(truncated);
      } catch {
        // Fallback: return first part of response
        console.error('[Response Processor] Failed to truncate JSON gracefully');
      }
    }

    return response.substring(0, maxLength) + '...';
  }

  /**
   * Validate response length and provide feedback
   */
  static validateResponseLength(response: string): ResponseValidationResult {
    const maxLength = 1000;
    const isValid = response.length <= maxLength;
    const isTruncated = response.length > maxLength;

    const suggestedActions: string[] = [];
    if (isTruncated) {
      suggestedActions.push('Consider reducing image resolution');
      suggestedActions.push('Simplify the prompt to request less detail');
      suggestedActions.push('Reduce max_tokens parameter in API configuration');
    }

    return {
      isValid,
      isTruncated,
      suggestedActions,
    };
  }
}

/**
 * OpenAI Service
 * Main service class for OpenAI Vision API integration
 */
export class OpenAIService {
  private client: ApiClient;
  private circuitBreaker: CircuitBreaker;
  private retryManager: RetryManager;
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
    this.client = new ApiClient(config);
    this.circuitBreaker = new CircuitBreaker(
      defaultCircuitBreakerConfig.threshold,
      defaultCircuitBreakerConfig.timeout
    );
    this.retryManager = new RetryManager(
      defaultRetryConfig.maxRetries,
      defaultRetryConfig.baseDelay
    );
  }

  /**
   * Build the prompt for species identification
   */
  private buildPrompt(): string {
    return `You are an expert animal species identifier. Analyze the provided image and identify the animal species present.

Please provide your response in the following JSON format:
{
  "species": {
    "commonName": "Common name of the main species",
    "scientificName": "Scientific name (binomial nomenclature)",
    "confidence": 0.95,
    "family": "Taxonomic family",
    "order": "Taxonomic order",
    "class": "Taxonomic class"
  },
  "summary": "One sentence summary of the animal and its key characteristics",
  "additionalSpecies": [
    {
      "commonName": "Other species name",
      "scientificName": "Scientific name",
      "confidence": 0.85
    }
  ],
  "details": {
    "habitat": "Natural habitat information",
    "behavior": "Typical behavior patterns",
    "conservation": "Conservation status if known",
    "interestingFacts": ["Interesting fact 1", "Interesting fact 2"]
  },
  "imageQuality": {
    "clarity": "high" | "medium" | "low",
    "lighting": "good" | "fair" | "poor",
    "angle": "frontal" | "side" | "top" | "obscured"
  }
}

If no animal is clearly visible, respond with:
{
  "error": "No animal species could be clearly identified in the image",
  "reasons": ["Reason 1", "Reason 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}

Be concise but accurate. Focus on the most prominent species if multiple animals are present.`;
  }

  /**
   * Identify species from image
   */
  async identifySpecies(base64Image: string): Promise<SpeciesIdentificationResult> {
    console.log('[OpenAI Service] Starting species identification');

    return this.circuitBreaker.execute(async () => {
      return this.retryManager.withRetry(async () => {
        const startTime = Date.now();

        try {
          // Build request
          const request: OpenAIRequest = {
            model: this.config.model,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: this.buildPrompt(),
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: base64Image,
                      detail: 'high',
                    },
                  },
                ],
              },
            ],
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature,
          };

          console.log('[OpenAI Service] Sending request to OpenAI API');

          // Make API call
          const response = await this.client.post<OpenAIResponse>('', request);

          const duration = Date.now() - startTime;
          console.log(`[OpenAI Service] Request completed in ${duration}ms`);

          // Check for finish reason
          const finishReason = response.data.choices[0]?.finish_reason;
          if (finishReason === 'length') {
            console.warn('[OpenAI Service] Response was truncated due to length limit');
          }

          // Process response
          const result = ResponseProcessor.processResponse(response.data);

          // Log usage statistics
          if (response.data.usage) {
            console.log('[OpenAI Service] Token usage:', {
              prompt: response.data.usage.prompt_tokens,
              completion: response.data.usage.completion_tokens,
              total: response.data.usage.total_tokens,
            });
          }

          return result;
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[OpenAI Service] Request failed after ${duration}ms:`, error);
          throw error;
        }
      });
    });
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('[OpenAI Service] Testing API connection');

      // Test with a simple request to the models endpoint
      await this.client.get('/models');

      console.log('[OpenAI Service] Connection test successful');
      return true;
    } catch (error) {
      console.error('[OpenAI Service] Connection test failed:', error);
      return false;
    }
  }

  /**
   * Validate API configuration
   */
  async validateConfig(config: APIConfig): Promise<boolean> {
    try {
      console.log('[OpenAI Service] Validating API configuration');

      const testClient = new ApiClient(config);
      await testClient.get('/models');

      console.log('[OpenAI Service] Configuration validation successful');
      return true;
    } catch (error) {
      console.error('[OpenAI Service] Configuration validation failed:', error);
      return false;
    }
  }

  /**
   * Get circuit breaker state
   */
  getCircuitBreakerState(): CircuitBreakerState {
    return this.circuitBreaker.getState();
  }

  /**
   * Reset circuit breaker
   */
  resetCircuitBreaker(): void {
    this.circuitBreaker.reset();
  }

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<APIConfig>): void {
    this.config = { ...this.config, ...config };
    this.client.updateConfig(config);
    console.log('[OpenAI Service] Configuration updated');
  }
}

/**
 * Export response processor utilities for external use
 */
export { ResponseProcessor, CircuitBreaker, RetryManager };
