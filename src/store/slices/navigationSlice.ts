import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

/**
 * Navigation parameters type
 */
export type NavigationParams = Record<string, any>;

/**
 * Screen route interface
 */
export interface ScreenRoute {
  name: string;
  params?: NavigationParams;
  timestamp: number;
}

/**
 * Navigation State Interface
 * Manages navigation stack, parameters, and history
 */
export interface NavigationState {
  stack: ScreenRoute[];
  currentRoute: ScreenRoute | null;
  params: NavigationParams;
  canGoBack: boolean;
  history: ScreenRoute[];
  maxHistorySize: number;
}

/**
 * Initial state for navigation slice
 */
const initialState: NavigationState = {
  stack: [
    {
      name: 'Welcome',
      params: {},
      timestamp: Date.now(),
    },
  ],
  currentRoute: {
    name: 'Welcome',
    params: {},
    timestamp: Date.now(),
  },
  params: {},
  canGoBack: false,
  history: [],
  maxHistorySize: 50,
};

/**
 * Navigation slice definition
 * Contains reducers for managing navigation state
 */
const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    /**
     * Push a new screen to the stack
     */
    pushScreen: (
      state,
      action: PayloadAction<{
        screen: string;
        params?: NavigationParams;
      }>
    ) => {
      const newRoute: ScreenRoute = {
        name: action.payload.screen,
        params: action.payload.params || {},
        timestamp: Date.now(),
      };

      state.stack.push(newRoute);
      state.currentRoute = newRoute;
      state.params = { ...state.params, ...action.payload.params };
      state.canGoBack = state.stack.length > 1;

      // Add to history
      state.history.push(newRoute);
      // Trim history if exceeds max size
      if (state.history.length > state.maxHistorySize) {
        state.history = state.history.slice(-state.maxHistorySize);
      }
    },

    /**
     * Pop the current screen from the stack
     */
    popScreen: (state) => {
      if (state.stack.length > 1) {
        state.stack.pop();
        const previousRoute = state.stack[state.stack.length - 1];
        state.currentRoute = previousRoute;
        state.params = previousRoute.params || {};
        state.canGoBack = state.stack.length > 1;
      }
    },

    /**
     * Navigate to a specific screen (replaces current)
     */
    navigateTo: (
      state,
      action: PayloadAction<{
        screen: string;
        params?: NavigationParams;
      }>
    ) => {
      const newRoute: ScreenRoute = {
        name: action.payload.screen,
        params: action.payload.params || {},
        timestamp: Date.now(),
      };

      // Replace current route
      if (state.stack.length > 0) {
        state.stack[state.stack.length - 1] = newRoute;
      } else {
        state.stack.push(newRoute);
      }

      state.currentRoute = newRoute;
      state.params = { ...state.params, ...action.payload.params };
      state.canGoBack = state.stack.length > 1;

      // Add to history
      state.history.push(newRoute);
      if (state.history.length > state.maxHistorySize) {
        state.history = state.history.slice(-state.maxHistorySize);
      }
    },

    /**
     * Reset navigation stack to a specific screen
     */
    resetStack: (
      state,
      action: PayloadAction<{
        screen: string;
        params?: NavigationParams;
      }>
    ) => {
      const newRoute: ScreenRoute = {
        name: action.payload.screen,
        params: action.payload.params || {},
        timestamp: Date.now(),
      };

      state.stack = [newRoute];
      state.currentRoute = newRoute;
      state.params = action.payload.params || {};
      state.canGoBack = false;

      // Add to history
      state.history.push(newRoute);
      if (state.history.length > state.maxHistorySize) {
        state.history = state.history.slice(-state.maxHistorySize);
      }
    },

    /**
     * Go back to a specific screen in the stack
     */
    goBackToScreen: (state, action: PayloadAction<string>) => {
      const screenIndex = state.stack.findIndex(
        (route) => route.name === action.payload
      );

      if (screenIndex !== -1 && screenIndex < state.stack.length - 1) {
        // Remove all screens after the target screen
        state.stack = state.stack.slice(0, screenIndex + 1);
        const targetRoute = state.stack[state.stack.length - 1];
        state.currentRoute = targetRoute;
        state.params = targetRoute.params || {};
        state.canGoBack = state.stack.length > 1;
      }
    },

    /**
     * Update parameters for the current route
     */
    updateParams: (state, action: PayloadAction<NavigationParams>) => {
      state.params = { ...state.params, ...action.payload };
      if (state.currentRoute) {
        state.currentRoute.params = { ...state.currentRoute.params, ...action.payload };
      }
      if (state.stack.length > 0) {
        const currentIndex = state.stack.length - 1;
        state.stack[currentIndex].params = {
          ...state.stack[currentIndex].params,
          ...action.payload,
        };
      }
    },

    /**
     * Clear navigation parameters
     */
    clearParams: (state) => {
      state.params = {};
    },

    /**
     * Clear navigation history
     */
    clearHistory: (state) => {
      state.history = [];
    },

    /**
     * Set max history size
     */
    setMaxHistorySize: (state, action: PayloadAction<number>) => {
      state.maxHistorySize = action.payload;
      if (state.history.length > action.payload) {
        state.history = state.history.slice(-action.payload);
      }
    },

    /**
     * Reset navigation state
     */
    resetNavigation: () => initialState,
  },
});

// Export actions
export const {
  pushScreen,
  popScreen,
  navigateTo,
  resetStack,
  goBackToScreen,
  updateParams,
  clearParams,
  clearHistory,
  setMaxHistorySize,
  resetNavigation,
} = navigationSlice.actions;

// Export reducer
export default navigationSlice.reducer;

// Selectors
export const selectNavigationStack = (state: RootState) => state.navigation.stack;
export const selectCurrentRoute = (state: RootState) => state.navigation.currentRoute;
export const selectNavigationParams = (state: RootState) => state.navigation.params;
export const selectCanGoBack = (state: RootState) => state.navigation.canGoBack;
export const selectNavigationHistory = (state: RootState) => state.navigation.history;
export const selectCurrentScreenName = (state: RootState) => state.navigation.currentRoute?.name || null;
export const selectStackDepth = (state: RootState) => state.navigation.stack.length;
