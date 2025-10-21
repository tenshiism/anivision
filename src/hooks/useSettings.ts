import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * API Configuration interface
 */
export interface APIConfig {
  url: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  autoSaveImages: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

/**
 * Settings state interface
 */
export interface SettingsState {
  apiConfig: APIConfig;
  preferences: UserPreferences;
  isFirstLaunch: boolean;
  lastSyncTime: number | null;
}

/**
 * Return type for useSettings hook
 */
export interface UseSettingsReturn {
  config: APIConfig;
  preferences: UserPreferences;
  isFirstLaunch: boolean;
  updateConfig: (config: Partial<APIConfig>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  saveConfig: () => Promise<void>;
  testConnection: () => Promise<boolean>;
  resetConfig: () => void;
  isLoading: boolean;
  error: string | null;
  isTesting: boolean;
  clearError: () => void;
}

/**
 * Default API configuration
 */
const DEFAULT_API_CONFIG: APIConfig = {
  url: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  model: 'gpt-4o',
  maxTokens: 500,
  temperature: 0.1,
};

/**
 * Default user preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  autoSaveImages: true,
  imageQuality: 'high',
  theme: 'auto',
  language: 'en',
};

/**
 * Custom hook for managing app settings and configuration
 *
 * Features:
 * - Manages API configuration (URL, API key, model settings)
 * - Manages user preferences
 * - Save/load settings from Redux store
 * - Test API connection
 * - Validation and error handling
 *
 * @returns {UseSettingsReturn} Settings management functionality and state
 *
 * @example
 * ```typescript
 * const {
 *   config,
 *   updateConfig,
 *   saveConfig,
 *   testConnection,
 *   isLoading,
 *   error
 * } = useSettings();
 *
 * // Update API configuration
 * updateConfig({ apiKey: 'sk-...' });
 *
 * // Test connection
 * const isValid = await testConnection();
 *
 * // Save configuration
 * await saveConfig();
 * ```
 */
export const useSettings = (): UseSettingsReturn => {
  const dispatch = useDispatch();

  // Get settings from Redux store
  const reduxSettings = useSelector((state: any) => state.settings);

  // Local state for pending changes
  const [pendingConfig, setPendingConfig] = useState<APIConfig>(
    reduxSettings?.apiConfig || DEFAULT_API_CONFIG
  );
  const [pendingPreferences, setPendingPreferences] = useState<UserPreferences>(
    reduxSettings?.preferences || DEFAULT_PREFERENCES
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync local state with Redux store
  useEffect(() => {
    if (reduxSettings?.apiConfig) {
      setPendingConfig(reduxSettings.apiConfig);
    }
    if (reduxSettings?.preferences) {
      setPendingPreferences(reduxSettings.preferences);
    }
  }, [reduxSettings]);

  /**
   * Validate API configuration
   */
  const validateConfig = (config: APIConfig): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!config.url || config.url.trim() === '') {
      errors.push('API URL is required');
    } else {
      try {
        new URL(config.url);
      } catch {
        errors.push('API URL must be a valid URL');
      }
    }

    if (!config.apiKey || config.apiKey.trim() === '') {
      errors.push('API key is required');
    } else if (config.apiKey.length < 20) {
      errors.push('API key appears to be invalid (too short)');
    }

    if (!config.model || config.model.trim() === '') {
      errors.push('Model is required');
    }

    if (config.maxTokens < 1 || config.maxTokens > 4000) {
      errors.push('Max tokens must be between 1 and 4000');
    }

    if (config.temperature < 0 || config.temperature > 2) {
      errors.push('Temperature must be between 0 and 2');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  /**
   * Update API configuration
   */
  const updateConfig = useCallback((config: Partial<APIConfig>) => {
    setPendingConfig((prev) => ({
      ...prev,
      ...config,
    }));
    setError(null);
  }, []);

  /**
   * Update user preferences
   */
  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setPendingPreferences((prev) => ({
      ...prev,
      ...preferences,
    }));
    setError(null);
  }, []);

  /**
   * Save configuration to Redux store
   */
  const saveConfig = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate configuration
      const validation = validateConfig(pendingConfig);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Dispatch action to save to Redux
      dispatch({
        type: 'settings/setApiConfig',
        payload: pendingConfig,
      });

      dispatch({
        type: 'settings/setPreferences',
        payload: pendingPreferences,
      });

      dispatch({
        type: 'settings/updateLastSyncTime',
      });

      console.log('Settings saved successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
      setError(errorMessage);
      console.error('Error saving settings:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [pendingConfig, pendingPreferences, dispatch]);

  /**
   * Test API connection
   */
  const testConnection = useCallback(async (): Promise<boolean> => {
    setIsTesting(true);
    setError(null);

    try {
      // Validate configuration first
      const validation = validateConfig(pendingConfig);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Test connection to OpenAI API
      const response = await fetch(pendingConfig.url.replace('/chat/completions', '/models'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${pendingConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key');
        } else if (response.status === 404) {
          throw new Error('Invalid API URL');
        } else {
          throw new Error(`Connection test failed with status ${response.status}`);
        }
      }

      console.log('API connection test successful');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMessage);
      console.error('API connection test error:', err);
      return false;
    } finally {
      setIsTesting(false);
    }
  }, [pendingConfig]);

  /**
   * Reset configuration to defaults
   */
  const resetConfig = useCallback(() => {
    setPendingConfig(DEFAULT_API_CONFIG);
    setPendingPreferences(DEFAULT_PREFERENCES);
    setError(null);

    // Optionally dispatch to Redux
    dispatch({
      type: 'settings/setApiConfig',
      payload: DEFAULT_API_CONFIG,
    });

    dispatch({
      type: 'settings/setPreferences',
      payload: DEFAULT_PREFERENCES,
    });
  }, [dispatch]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    config: pendingConfig,
    preferences: pendingPreferences,
    isFirstLaunch: reduxSettings?.isFirstLaunch ?? true,
    updateConfig,
    updatePreferences,
    saveConfig,
    testConnection,
    resetConfig,
    isLoading,
    error,
    isTesting,
    clearError,
  };
};

export default useSettings;
