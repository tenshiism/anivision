// API Configuration Types
export interface APIConfig {
  url: string;
  apiKey: string;
  model: 'gpt-4-vision-preview' | 'gpt-4o';
  maxTokens: number;
  temperature: number;
  timeout: number;
}

// Species Identification Types
export interface SpeciesInfo {
  commonName: string;
  scientificName: string;
  confidence: number;
  family?: string;
  order?: string;
  class?: string;
}

export interface AdditionalSpecies {
  commonName: string;
  scientificName: string;
  confidence: number;
}

export interface SpeciesDetails {
  habitat?: string;
  behavior?: string;
  conservation?: string;
  interestingFacts?: string[];
}

export interface ImageQuality {
  clarity: 'high' | 'medium' | 'low';
  lighting: 'good' | 'fair' | 'poor';
  angle: 'frontal' | 'side' | 'top' | 'obscured';
}

export interface SpeciesIdentificationResult {
  species: SpeciesInfo;
  summary: string;
  additionalSpecies?: AdditionalSpecies[];
  details?: SpeciesDetails;
  imageQuality?: ImageQuality;
  error?: string;
  reasons?: string[];
  suggestions?: string[];
}

// API Error Types
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

export interface APIError {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: unknown;
  retryable: boolean;
  suggestedAction: string;
}
