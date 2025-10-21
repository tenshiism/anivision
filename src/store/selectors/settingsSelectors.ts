import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

/**
 * Settings Selectors
 * Memoized selectors for settings state
 */

// Base selectors
const selectSettingsState = (state: RootState) => state.settings;

/**
 * Select complete API configuration
 */
export const selectApiConfig = createSelector(
  [selectSettingsState],
  (settings) => settings.apiConfig
);

/**
 * Select API URL
 */
export const selectApiUrl = createSelector(
  [selectApiConfig],
  (apiConfig) => apiConfig.url
);

/**
 * Select API key (masked for security)
 */
export const selectApiKeyMasked = createSelector(
  [selectApiConfig],
  (apiConfig) => {
    const key = apiConfig.apiKey;
    if (!key || key.length < 8) return '****';
    return `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`;
  }
);

/**
 * Select if API key is configured
 */
export const selectIsApiKeyConfigured = createSelector(
  [selectApiConfig],
  (apiConfig) => !!apiConfig.apiKey && apiConfig.apiKey.trim().length > 0
);

/**
 * Select API model
 */
export const selectApiModel = createSelector(
  [selectApiConfig],
  (apiConfig) => apiConfig.model
);

/**
 * Select API max tokens
 */
export const selectApiMaxTokens = createSelector(
  [selectApiConfig],
  (apiConfig) => apiConfig.maxTokens
);

/**
 * Select API temperature
 */
export const selectApiTemperature = createSelector(
  [selectApiConfig],
  (apiConfig) => apiConfig.temperature
);

/**
 * Select user preferences
 */
export const selectPreferences = createSelector(
  [selectSettingsState],
  (settings) => settings.preferences
);

/**
 * Select auto-save images preference
 */
export const selectAutoSaveImages = createSelector(
  [selectPreferences],
  (preferences) => preferences.autoSaveImages
);

/**
 * Select image quality preference
 */
export const selectImageQuality = createSelector(
  [selectPreferences],
  (preferences) => preferences.imageQuality
);

/**
 * Select theme preference
 */
export const selectTheme = createSelector(
  [selectPreferences],
  (preferences) => preferences.theme
);

/**
 * Select language preference
 */
export const selectLanguage = createSelector(
  [selectPreferences],
  (preferences) => preferences.language
);

/**
 * Select if it's first launch
 */
export const selectIsFirstLaunch = createSelector(
  [selectSettingsState],
  (settings) => settings.isFirstLaunch
);

/**
 * Select last sync time
 */
export const selectLastSyncTime = createSelector(
  [selectSettingsState],
  (settings) => settings.lastSyncTime
);

/**
 * Select connection status
 */
export const selectConnectionStatus = createSelector(
  [selectSettingsState],
  (settings) => settings.connectionStatus
);

/**
 * Select if API is connected
 */
export const selectIsApiConnected = createSelector(
  [selectConnectionStatus],
  (connectionStatus) => connectionStatus.isConnected
);

/**
 * Select connection error
 */
export const selectConnectionError = createSelector(
  [selectConnectionStatus],
  (connectionStatus) => connectionStatus.error
);

/**
 * Select if settings are fully configured
 */
export const selectIsFullyConfigured = createSelector(
  [selectApiConfig, selectIsApiConnected],
  (apiConfig, isConnected) => {
    return (
      !!apiConfig.url &&
      !!apiConfig.apiKey &&
      !!apiConfig.model &&
      isConnected
    );
  }
);

/**
 * Select time since last sync in milliseconds
 */
export const selectTimeSinceLastSync = createSelector(
  [selectLastSyncTime],
  (lastSyncTime) => {
    if (!lastSyncTime) return null;
    return Date.now() - lastSyncTime;
  }
);

/**
 * Select if sync is needed (more than 1 hour since last sync)
 */
export const selectNeedsSync = createSelector(
  [selectTimeSinceLastSync],
  (timeSinceLastSync) => {
    if (timeSinceLastSync === null) return true;
    return timeSinceLastSync > 60 * 60 * 1000; // 1 hour
  }
);
