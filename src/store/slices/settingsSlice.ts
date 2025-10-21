import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

/**
 * Settings State Interface
 * Manages API configuration, user preferences, and app settings
 */
export interface SettingsState {
  apiConfig: {
    url: string;
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  preferences: {
    autoSaveImages: boolean;
    imageQuality: 'low' | 'medium' | 'high';
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
  isFirstLaunch: boolean;
  lastSyncTime: number | null;
  connectionStatus: {
    isConnected: boolean;
    lastTestedAt: number | null;
    error: string | null;
  };
}

/**
 * Initial state for settings slice
 */
const initialState: SettingsState = {
  apiConfig: {
    url: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4-vision-preview',
    maxTokens: 500,
    temperature: 0.7,
  },
  preferences: {
    autoSaveImages: false,
    imageQuality: 'high',
    theme: 'auto',
    language: 'en',
  },
  isFirstLaunch: true,
  lastSyncTime: null,
  connectionStatus: {
    isConnected: false,
    lastTestedAt: null,
    error: null,
  },
};

/**
 * Async thunk to test API connection
 * Validates the API configuration by making a test request
 */
export const testConnection = createAsyncThunk<
  { isConnected: boolean; error: string | null },
  void,
  { state: RootState }
>(
  'settings/testConnection',
  async (_, { getState }) => {
    try {
      const { apiConfig } = getState().settings;

      // Validate API key
      if (!apiConfig.apiKey || apiConfig.apiKey.trim() === '') {
        throw new Error('API key is required');
      }

      // Validate URL
      if (!apiConfig.url || apiConfig.url.trim() === '') {
        throw new Error('API URL is required');
      }

      // Make a test request to OpenAI API
      const response = await fetch(`${apiConfig.url}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to connect to API');
      }

      return { isConnected: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { isConnected: false, error: errorMessage };
    }
  }
);

/**
 * Async thunk to save configuration
 * Validates and persists the API configuration
 */
export const saveConfig = createAsyncThunk<
  void,
  Partial<SettingsState['apiConfig']>,
  { state: RootState }
>(
  'settings/saveConfig',
  async (config, { dispatch, getState }) => {
    // Update the config first
    dispatch(setApiConfig(config));

    // Test the connection with new config
    await dispatch(testConnection());

    // Update last sync time
    dispatch(updateLastSyncTime());
  }
);

/**
 * Settings slice definition
 * Contains reducers for managing app settings and configuration
 */
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    /**
     * Update API configuration
     */
    setApiConfig: (state, action: PayloadAction<Partial<SettingsState['apiConfig']>>) => {
      state.apiConfig = { ...state.apiConfig, ...action.payload };
    },

    /**
     * Update user preferences
     */
    setPreferences: (state, action: PayloadAction<Partial<SettingsState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    /**
     * Mark first launch as complete
     */
    setFirstLaunchComplete: (state) => {
      state.isFirstLaunch = false;
    },

    /**
     * Update last sync timestamp
     */
    updateLastSyncTime: (state) => {
      state.lastSyncTime = Date.now();
    },

    /**
     * Reset connection status
     */
    resetConnectionStatus: (state) => {
      state.connectionStatus = {
        isConnected: false,
        lastTestedAt: null,
        error: null,
      };
    },

    /**
     * Reset all settings to default
     */
    resetSettings: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Test connection pending
      .addCase(testConnection.pending, (state) => {
        state.connectionStatus.error = null;
      })
      // Test connection fulfilled
      .addCase(testConnection.fulfilled, (state, action) => {
        state.connectionStatus = {
          isConnected: action.payload.isConnected,
          lastTestedAt: Date.now(),
          error: action.payload.error,
        };
      })
      // Test connection rejected
      .addCase(testConnection.rejected, (state, action) => {
        state.connectionStatus = {
          isConnected: false,
          lastTestedAt: Date.now(),
          error: action.error.message || 'Connection test failed',
        };
      });
  },
});

// Export actions
export const {
  setApiConfig,
  setPreferences,
  setFirstLaunchComplete,
  updateLastSyncTime,
  resetConnectionStatus,
  resetSettings,
} = settingsSlice.actions;

// Export reducer
export default settingsSlice.reducer;

// Selectors
export const selectApiConfig = (state: RootState) => state.settings.apiConfig;
export const selectPreferences = (state: RootState) => state.settings.preferences;
export const selectIsFirstLaunch = (state: RootState) => state.settings.isFirstLaunch;
export const selectLastSyncTime = (state: RootState) => state.settings.lastSyncTime;
export const selectConnectionStatus = (state: RootState) => state.settings.connectionStatus;
