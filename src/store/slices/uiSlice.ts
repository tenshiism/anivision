import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

/**
 * Toast notification type
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast notification interface
 */
export interface Toast {
  message: string;
  type: ToastType;
  visible: boolean;
  duration?: number;
}

/**
 * Loading state interface
 */
export interface LoadingState {
  global: boolean;
  scan: boolean;
  upload: boolean;
  save: boolean;
}

/**
 * Modal state interface
 */
export interface ModalState {
  isOpen: boolean;
  modalType: string | null;
  modalProps?: Record<string, any>;
}

/**
 * Network status type
 */
export type NetworkStatus = 'online' | 'offline' | 'unknown';

/**
 * UI State Interface
 * Manages UI-related state like drawer, loading, toasts, and network status
 */
export interface UIState {
  isDrawerOpen: boolean;
  activeScreen: string;
  loading: LoadingState;
  toast: Toast | null;
  modal: ModalState;
  networkStatus: NetworkStatus;
  errors: Record<string, string>;
}

/**
 * Initial state for UI slice
 */
const initialState: UIState = {
  isDrawerOpen: false,
  activeScreen: 'Welcome',
  loading: {
    global: false,
    scan: false,
    upload: false,
    save: false,
  },
  toast: null,
  modal: {
    isOpen: false,
    modalType: null,
    modalProps: undefined,
  },
  networkStatus: 'unknown',
  errors: {},
};

/**
 * UI slice definition
 * Contains reducers for managing UI state
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Toggle drawer open/close
     */
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },

    /**
     * Open drawer
     */
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },

    /**
     * Close drawer
     */
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },

    /**
     * Set global loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },

    /**
     * Set specific loading state
     */
    setLoadingState: (
      state,
      action: PayloadAction<{ key: keyof LoadingState; value: boolean }>
    ) => {
      state.loading[action.payload.key] = action.payload.value;
    },

    /**
     * Set active screen
     */
    setActiveScreen: (state, action: PayloadAction<string>) => {
      state.activeScreen = action.payload;
    },

    /**
     * Show toast notification
     */
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type: ToastType;
        duration?: number;
      }>
    ) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type,
        visible: true,
        duration: action.payload.duration || 3000,
      };
    },

    /**
     * Hide toast notification
     */
    hideToast: (state) => {
      if (state.toast) {
        state.toast.visible = false;
      }
    },

    /**
     * Clear toast notification
     */
    clearToast: (state) => {
      state.toast = null;
    },

    /**
     * Set network status
     */
    setNetworkStatus: (state, action: PayloadAction<NetworkStatus>) => {
      state.networkStatus = action.payload;
    },

    /**
     * Open modal
     */
    openModal: (
      state,
      action: PayloadAction<{
        modalType: string;
        modalProps?: Record<string, any>;
      }>
    ) => {
      state.modal = {
        isOpen: true,
        modalType: action.payload.modalType,
        modalProps: action.payload.modalProps,
      };
    },

    /**
     * Close modal
     */
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        modalType: null,
        modalProps: undefined,
      };
    },

    /**
     * Set error for a specific key
     */
    setError: (
      state,
      action: PayloadAction<{ key: string; message: string }>
    ) => {
      state.errors[action.payload.key] = action.payload.message;
    },

    /**
     * Clear error for a specific key
     */
    clearError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload];
    },

    /**
     * Clear all errors
     */
    clearAllErrors: (state) => {
      state.errors = {};
    },

    /**
     * Reset UI state
     */
    resetUIState: () => initialState,
  },
});

// Export actions
export const {
  toggleDrawer,
  openDrawer,
  closeDrawer,
  setLoading,
  setLoadingState,
  setActiveScreen,
  showToast,
  hideToast,
  clearToast,
  setNetworkStatus,
  openModal,
  closeModal,
  setError,
  clearError,
  clearAllErrors,
  resetUIState,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;

// Selectors
export const selectIsDrawerOpen = (state: RootState) => state.ui.isDrawerOpen;
export const selectActiveScreen = (state: RootState) => state.ui.activeScreen;
export const selectLoading = (state: RootState) => state.ui.loading;
export const selectGlobalLoading = (state: RootState) => state.ui.loading.global;
export const selectToast = (state: RootState) => state.ui.toast;
export const selectModal = (state: RootState) => state.ui.modal;
export const selectNetworkStatus = (state: RootState) => state.ui.networkStatus;
export const selectErrors = (state: RootState) => state.ui.errors;
export const selectError = (key: string) => (state: RootState) => state.ui.errors[key];
