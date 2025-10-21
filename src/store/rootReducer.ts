/**
 * Root Reducer
 * Combines all Redux slices into a single root reducer
 */

import { combineReducers } from '@reduxjs/toolkit';

// Import all slice reducers
import settingsReducer from './slices/settingsSlice';
import uiReducer from './slices/uiSlice';
import navigationReducer from './slices/navigationSlice';
import cacheReducer from './slices/cacheSlice';

/**
 * Root reducer combining all slices
 * This is the main reducer that will be used by the Redux store
 */
const rootReducer = combineReducers({
  settings: settingsReducer,
  ui: uiReducer,
  navigation: navigationReducer,
  cache: cacheReducer,
});

export default rootReducer;

/**
 * Export RootState type for use in selectors and components
 */
export type RootState = ReturnType<typeof rootReducer>;
