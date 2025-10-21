import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Species identification information
 */
export interface SpeciesIdentification {
  commonName: string;
  scientificName: string;
  confidence: number;
  family?: string;
  order?: string;
  class?: string;
}

/**
 * Scan result from species identification
 */
export interface ScanResult {
  species: SpeciesIdentification;
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
  timestamp: number;
  imageUri: string;
}

/**
 * API Configuration
 */
export interface APIConfig {
  url: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

/**
 * Return type for useSpeciesScanner hook
 */
export interface UseSpeciesScannerReturn {
  scanImage: (imageUri: string) => Promise<ScanResult | null>;
  result: ScanResult | null;
  isLoading: boolean;
  error: string | null;
  clearResult: () => void;
  clearError: () => void;
  progress: number;
}

/**
 * Custom hook for managing species identification process
 *
 * Features:
 * - Manages species identification from image
 * - Calls OpenAI Vision API service
 * - Handles loading, error, and result states
 * - Integrates with Redux for API configuration
 * - Progress tracking for scan operations
 *
 * @returns {UseSpeciesScannerReturn} Species scanner functionality and state
 *
 * @example
 * ```typescript
 * const { scanImage, result, isLoading, error, clearResult } = useSpeciesScanner();
 *
 * // Scan an image
 * const scanResult = await scanImage('file:///path/to/image.jpg');
 *
 * // Access results
 * if (result) {
 *   console.log(result.species.commonName);
 *   console.log(result.summary);
 * }
 *
 * // Clear results
 * clearResult();
 * ```
 */
export const useSpeciesScanner = (): UseSpeciesScannerReturn => {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();

  // Get API config from Redux store
  // Note: This selector would be defined in the store
  const apiConfig = useSelector((state: any) => state.settings?.apiConfig);

  /**
   * Validate API configuration
   */
  const validateConfig = (config: APIConfig | undefined): boolean => {
    if (!config) {
      setError('API configuration not found. Please configure your API settings.');
      return false;
    }

    if (!config.apiKey || config.apiKey.trim() === '') {
      setError('API key is required. Please configure your API key in settings.');
      return false;
    }

    if (!config.url || config.url.trim() === '') {
      setError('API URL is required. Please configure your API URL in settings.');
      return false;
    }

    return true;
  };

  /**
   * Build prompt for OpenAI Vision API
   */
  const buildPrompt = (): string => {
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
  };

  /**
   * Process API response
   */
  const processResponse = (response: any, imageUri: string): ScanResult => {
    try {
      const content = response.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from API');
      }

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Create scan result with timestamp and image URI
      const scanResult: ScanResult = {
        ...parsed,
        timestamp: Date.now(),
        imageUri,
        species: {
          commonName: parsed.species?.commonName || 'Unknown',
          scientificName: parsed.species?.scientificName || 'Unknown',
          confidence: Math.min(1, Math.max(0, parseFloat(parsed.species?.confidence || 0))),
          family: parsed.species?.family,
          order: parsed.species?.order,
          class: parsed.species?.class,
        },
        summary: parsed.summary || 'No summary available',
      };

      return scanResult;
    } catch (err) {
      console.error('Failed to process API response:', err);
      throw new Error(`Failed to process API response: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  /**
   * Call OpenAI Vision API for species identification
   */
  const callOpenAIAPI = async (imageUri: string, config: APIConfig): Promise<any> => {
    setProgress(30);

    // Convert image to base64
    // Note: This would use a service to convert the image
    // For now, we'll assume the imageUri is already in the correct format
    const base64Image = imageUri.startsWith('data:')
      ? imageUri
      : `data:image/jpeg;base64,${imageUri}`;

    setProgress(50);

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: buildPrompt(),
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
        max_tokens: config.maxTokens || 500,
        temperature: config.temperature || 0.1,
      }),
    });

    setProgress(80);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
        `API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    setProgress(90);

    return data;
  };

  /**
   * Scan image for species identification
   */
  const scanImage = useCallback(async (imageUri: string): Promise<ScanResult | null> => {
    if (!imageUri) {
      setError('Image URI is required');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Validate configuration
      if (!validateConfig(apiConfig)) {
        return null;
      }

      setProgress(10);

      // Call API
      const response = await callOpenAIAPI(imageUri, apiConfig);

      // Process response
      const scanResult = processResponse(response, imageUri);

      setProgress(100);
      setResult(scanResult);

      // Dispatch action to cache result in Redux (optional)
      // dispatch({ type: 'cache/addScanResult', payload: scanResult });

      return scanResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan image';
      setError(errorMessage);
      console.error('Species scan error:', err);
      return null;
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  }, [apiConfig, dispatch]);

  /**
   * Clear scan result
   */
  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    scanImage,
    result,
    isLoading,
    error,
    clearResult,
    clearError,
    progress,
  };
};

export default useSpeciesScanner;
