# API Integration Strategy

## Overview
AniVision integrates with OpenAI's Vision API to identify animal species from images. This document outlines the comprehensive API integration strategy, including error handling, response processing, and optimization techniques for handling various edge cases.

## OpenAI Vision API Integration

### API Configuration
```typescript
interface APIConfig {
  url: string;
  apiKey: string;
  model: 'gpt-4-vision-preview' | 'gpt-4o';
  maxTokens: number;
  temperature: number;
  timeout: number;
}

const defaultConfig: APIConfig = {
  url: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o',
  maxTokens: 500,
  temperature: 0.1,
  timeout: 30000, // 30 seconds
};
```

### API Client Setup
```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class OpenAIClient {
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
  
  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error);
        return Promise.reject(this.handleAPIError(error));
      }
    );
  }
}
```

## Request Processing

### Image Preparation
```typescript
interface ImageProcessingOptions {
  maxSize: number; // in pixels
  quality: number; // 0-1
  format: 'jpeg' | 'png' | 'webp';
}

class ImageProcessor {
  static async prepareForAPI(
    imageUri: string, 
    options: ImageProcessingOptions = {
      maxSize: 1024,
      quality: 0.8,
      format: 'jpeg'
    }
  ): Promise<string> {
    try {
      // Resize image if needed
      const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        {
          resize: {
            width: options.maxSize,
            height: options.maxSize,
          },
        },
        {
          compress: options.quality,
          format: options.format === 'jpeg' ? ImageManipulator.FormatType.JPEG :
                  options.format === 'png' ? ImageManipulator.FormatType.PNG :
                  ImageManipulator.FormatType.WEBP,
        }
      );
      
      // Convert to base64
      const base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      return `data:image/${options.format};base64,${base64}`;
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }
}
```

### Request Construction
```typescript
interface SpeciesIdentificationRequest {
  image: string; // base64 encoded image
  prompt: string;
  maxTokens: number;
  temperature: number;
}

class OpenAIService {
  private client: OpenAIClient;
  
  constructor(config: APIConfig) {
    this.client = new OpenAIClient(config);
  }
  
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
  
  async identifySpecies(imageUri: string): Promise<SpeciesIdentificationResult> {
    try {
      // Prepare image
      const base64Image = await ImageProcessor.prepareForAPI(imageUri);
      
      // Build request
      const request: SpeciesIdentificationRequest = {
        image: base64Image,
        prompt: this.buildPrompt(),
        maxTokens: 500,
        temperature: 0.1,
      };
      
      // Make API call
      const response = await this.client.post('/chat/completions', {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: request.prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: request.image,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: request.maxTokens,
        temperature: request.temperature,
      });
      
      // Process response
      return this.processResponse(response.data);
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }
}
```

## Response Processing

### Response Parser
```typescript
interface SpeciesIdentificationResult {
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

class ResponseProcessor {
  static processResponse(apiResponse: any): SpeciesIdentificationResult {
    try {
      const content = apiResponse.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from API');
      }
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize response
      return this.validateAndSanitize(parsed);
    } catch (error) {
      console.error('Response processing failed:', error);
      throw new Error(`Failed to process API response: ${error.message}`);
    }
  }
  
  private static validateAndSanitize(data: any): SpeciesIdentificationResult {
    // Handle error responses
    if (data.error) {
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
      throw new Error('Missing required species information');
    }
    
    // Sanitize confidence values
    const sanitizeConfidence = (value: any): number => {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : Math.min(1, Math.max(0, num));
    };
    
    return {
      species: {
        commonName: data.species.commonName,
        scientificName: data.species.scientificName,
        confidence: sanitizeConfidence(data.species.confidence),
        family: data.species.family,
        order: data.species.order,
        class: data.species.class,
      },
      summary: data.summary || 'No summary available',
      additionalSpecies: data.additionalSpecies?.map((sp: any) => ({
        commonName: sp.commonName,
        scientificName: sp.scientificName,
        confidence: sanitizeConfidence(sp.confidence),
      })) || [],
      details: data.details,
      imageQuality: data.imageQuality,
    };
  }
}
```

### Response Length Handling
```typescript
class ResponseLengthHandler {
  static handleLongResponse(
    response: string, 
    maxLength: number = 1000
  ): string {
    if (response.length <= maxLength) {
      return response;
    }
    
    // Try to extract complete JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch && jsonMatch[0].length <= maxLength) {
      return jsonMatch[0];
    }
    
    // If JSON is too long, try to truncate gracefully
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Remove optional fields to reduce length
      const truncated = {
        species: parsed.species,
        summary: parsed.summary,
        error: 'Response truncated due to length',
      };
      
      return JSON.stringify(truncated);
    } catch {
      // Fallback: return first part of response
      return response.substring(0, maxLength) + '...';
    }
  }
  
  static validateResponseLength(response: string): {
    isValid: boolean;
    isTruncated: boolean;
    suggestedActions: string[];
  } {
    const maxLength = 1000;
    const isValid = response.length <= maxLength;
    const isTruncated = response.length > maxLength;
    
    const suggestedActions = [];
    if (isTruncated) {
      suggestedActions.push('Consider reducing image resolution');
      suggestedActions.push('Simplify the prompt');
      suggestedActions.push('Reduce max_tokens parameter');
    }
    
    return {
      isValid,
      isTruncated,
      suggestedActions,
    };
  }
}
```

## Error Handling Strategy

### Error Classification
```typescript
enum ErrorType {
  NETWORK_ERROR = 'network_error',
  API_ERROR = 'api_error',
  VALIDATION_ERROR = 'validation_error',
  TIMEOUT_ERROR = 'timeout_error',
  RATE_LIMIT_ERROR = 'rate_limit_error',
  AUTHENTICATION_ERROR = 'auth_error',
  PROCESSING_ERROR = 'processing_error',
  UNKNOWN_ERROR = 'unknown_error',
}

interface APIError {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: any;
  retryable: boolean;
  suggestedAction: string;
}

class ErrorHandler {
  static classifyError(error: any): APIError {
    // Network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return {
          type: ErrorType.TIMEOUT_ERROR,
          message: 'Request timed out',
          code: error.code,
          retryable: true,
          suggestedAction: 'Check your internet connection and try again',
        };
      }
      
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network connection failed',
        code: error.code,
        retryable: true,
        suggestedAction: 'Please check your internet connection',
      };
    }
    
    // API errors
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return {
          type: ErrorType.VALIDATION_ERROR,
          message: data?.error?.message || 'Invalid request',
          code: status,
          details: data,
          retryable: false,
          suggestedAction: 'Please check the image and try again',
        };
        
      case 401:
        return {
          type: ErrorType.AUTHENTICATION_ERROR,
          message: 'Invalid API key',
          code: status,
          retryable: false,
          suggestedAction: 'Please check your API configuration',
        };
        
      case 429:
        return {
          type: ErrorType.RATE_LIMIT_ERROR,
          message: 'Rate limit exceeded',
          code: status,
          details: data,
          retryable: true,
          suggestedAction: 'Please wait before trying again',
        };
        
      case 500:
      case 502:
      case 503:
        return {
          type: ErrorType.API_ERROR,
          message: 'Server error',
          code: status,
          retryable: true,
          suggestedAction: 'The service is temporarily unavailable, please try again later',
        };
        
      default:
        return {
          type: ErrorType.UNKNOWN_ERROR,
          message: data?.error?.message || 'Unknown error occurred',
          code: status,
          details: data,
          retryable: false,
          suggestedAction: 'Please try again or contact support',
        };
    }
  }
}
```

### Retry Logic
```typescript
class RetryManager {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        const apiError = ErrorHandler.classifyError(error);
        
        // Don't retry if error is not retryable
        if (!apiError.retryable || attempt === maxRetries) {
          throw apiError;
        }
        
        // Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}
```

### Circuit Breaker Pattern
```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold = 5,
    private timeout = 60000 // 1 minute
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
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
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

## API Service Implementation

### Main Service Class
```typescript
export class OpenAIService {
  private client: OpenAIClient;
  private circuitBreaker: CircuitBreaker;
  private retryManager: RetryManager;
  
  constructor(config: APIConfig) {
    this.client = new OpenAIClient(config);
    this.circuitBreaker = new CircuitBreaker();
    this.retryManager = new RetryManager();
  }
  
  async identifySpecies(imageUri: string): Promise<SpeciesIdentificationResult> {
    return this.circuitBreaker.execute(async () => {
      return this.retryManager.withRetry(async () => {
        const response = await this.client.identifySpecies(imageUri);
        return ResponseProcessor.processResponse(response);
      });
    });
  }
  
  async testConnection(): Promise<boolean> {
    try {
      // Test with a simple request
      await this.client.post('/models');
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
  
  async validateConfig(config: APIConfig): Promise<boolean> {
    try {
      const testClient = new OpenAIClient(config);
      await testClient.post('/models');
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

## Integration with React Query

### Custom Hook
```typescript
export const useSpeciesIdentification = () => {
  const config = useSelector(selectApiConfig);
  const dispatch = useDispatch();
  
  const queryClient = useQueryClient();
  
  const mutation = useMutation(
    (imageUri: string) => {
      const service = new OpenAIService(config);
      return service.identifySpecies(imageUri);
    },
    {
      onSuccess: (result) => {
        // Handle successful identification
        dispatch(showToast({
          message: 'Species identified successfully!',
          type: 'success',
        }));
      },
      onError: (error: APIError) => {
        // Handle error
        dispatch(showToast({
          message: error.suggestedAction || 'Identification failed',
          type: 'error',
        }));
        
        // Log error for debugging
        console.error('Species identification error:', error);
      },
      onSettled: () => {
        // Invalidate related queries if needed
        queryClient.invalidateQueries('identification-history');
      },
    }
  );
  
  return {
    identifySpecies: mutation.mutate,
    isLoading: mutation.isLoading,
    error: mutation.error,
    result: mutation.data,
    reset: mutation.reset,
  };
};
```

## Monitoring and Analytics

### API Usage Tracking
```typescript
class APIMonitor {
  static trackRequest(endpoint: string, success: boolean, duration: number) {
    // Track API usage metrics
    analytics.track('api_request', {
      endpoint,
      success,
      duration,
      timestamp: Date.now(),
    });
  }
  
  static trackError(error: APIError) {
    // Track error patterns
    analytics.track('api_error', {
      type: error.type,
      message: error.message,
      code: error.code,
      timestamp: Date.now(),
    });
  }
  
  static trackUsage(stats: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
  }) {
    // Track overall usage statistics
    analytics.track('api_usage', stats);
  }
}
```

### Performance Monitoring
```typescript
class PerformanceMonitor {
  private static metrics = {
    requestCount: 0,
    successCount: 0,
    errorCount: 0,
    totalResponseTime: 0,
  };
  
  static recordRequest(success: boolean, responseTime: number) {
    this.metrics.requestCount++;
    this.metrics.totalResponseTime += responseTime;
    
    if (success) {
      this.metrics.successCount++;
    } else {
      this.metrics.errorCount++;
    }
  }
  
  static getMetrics() {
    const { requestCount, successCount, errorCount, totalResponseTime } = this.metrics;
    
    return {
      totalRequests: requestCount,
      successRate: requestCount > 0 ? successCount / requestCount : 0,
      errorRate: requestCount > 0 ? errorCount / requestCount : 0,
      averageResponseTime: requestCount > 0 ? totalResponseTime / requestCount : 0,
    };
  }
  
  static reset() {
    this.metrics = {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      totalResponseTime: 0,
    };
  }
}
```

## Testing Strategy

### Mock Service
```typescript
export class MockOpenAIService {
  async identifySpecies(imageUri: string): Promise<SpeciesIdentificationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data based on image name or pattern
    if (imageUri.includes('cat')) {
      return {
        species: {
          commonName: 'Domestic Cat',
          scientificName: 'Felis catus',
          confidence: 0.95,
          family: 'Felidae',
          order: 'Carnivora',
          class: 'Mammalia',
        },
        summary: 'A domestic cat showing typical feline characteristics with pointed ears and whiskers.',
        details: {
          habitat: 'Human households worldwide',
          behavior: 'Territorial, nocturnal hunting patterns',
          conservation: 'Least Concern',
          interestingFacts: ['Cats spend 70% of their lives sleeping', 'Cats have 32 teeth'],
        },
        imageQuality: {
          clarity: 'high',
          lighting: 'good',
          angle: 'frontal',
        },
      };
    }
    
    // Default mock response
    return {
      species: {
        commonName: 'Unknown Species',
        scientificName: 'Unknown',
        confidence: 0.1,
      },
      summary: 'Unable to identify species from the provided image.',
      error: 'No animal species could be clearly identified',
      reasons: ['Image quality too low', 'Species not in training data'],
      suggestions: ['Try a clearer image', 'Ensure the animal is clearly visible'],
    };
  }
}
```

### Integration Tests
```typescript
describe('OpenAI Service Integration', () => {
  let service: OpenAIService;
  let mockConfig: APIConfig;
  
  beforeEach(() => {
    mockConfig = {
      url: 'https://api.openai.com/v1/chat/completions',
      apiKey: 'test-key',
      model: 'gpt-4o',
      maxTokens: 500,
      temperature: 0.1,
      timeout: 30000,
    };
    
    service = new OpenAIService(mockConfig);
  });
  
  test('should identify species successfully', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              species: {
                commonName: 'Test Species',
                scientificName: 'Testus scientificus',
                confidence: 0.9,
              },
              summary: 'Test summary',
            }),
          },
        },
      ],
    };
    
    jest.spyOn(service['client'], 'post').mockResolvedValue(mockResponse);
    
    const result = await service.identifySpecies('test-image.jpg');
    
    expect(result.species.commonName).toBe('Test Species');
    expect(result.species.scientificName).toBe('Testus scientificus');
    expect(result.species.confidence).toBe(0.9);
  });
  
  test('should handle API errors gracefully', async () => {
    const mockError = {
      response: {
        status: 429,
        data: { error: { message: 'Rate limit exceeded' } },
      },
    };
    
    jest.spyOn(service['client'], 'post').mockRejectedValue(mockError);
    
    await expect(service.identifySpecies('test-image.jpg')).rejects.toMatchObject({
      type: ErrorType.RATE_LIMIT_ERROR,
      retryable: true,
    });
  });
});