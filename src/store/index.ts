/**
 * Redux Store Configuration
 * Configures the Redux store with Redux Toolkit and Redux Persist
 */

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './rootReducer';

/**
 * Redux Persist configuration
 * Persists settings and cache slices to AsyncStorage
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settings', 'cache'], // Only persist these slices
  blacklist: ['ui', 'navigation'], // Don't persist UI and navigation state
  throttle: 1000, // Throttle persisted writes to 1 second
};

/**
 * Create persisted reducer
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure Redux store
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['settings.connectionStatus.lastTestedAt'],
      },
      immutableCheck: {
        // Ignore immutability check for persist actions
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * Create persistor for Redux Persist
 */
export const persistor = persistStore(store);

/**
 * Export types for TypeScript support
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Re-export selectors and actions for convenience
 */
export * from './slices';
// Selectors are already exported from slices, no need to re-export
// export * from './selectors';
