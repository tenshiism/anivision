import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

/**
 * UI Selectors
 * Memoized selectors for UI state
 */

// Base selectors
const selectUIState = (state: RootState) => state.ui;

/**
 * Select drawer open state
 */
export const selectIsDrawerOpen = createSelector(
  [selectUIState],
  (ui) => ui.isDrawerOpen
);

/**
 * Select active screen
 */
export const selectActiveScreen = createSelector(
  [selectUIState],
  (ui) => ui.activeScreen
);

/**
 * Select all loading states
 */
export const selectLoading = createSelector(
  [selectUIState],
  (ui) => ui.loading
);

/**
 * Select global loading state
 */
export const selectGlobalLoading = createSelector(
  [selectLoading],
  (loading) => loading.global
);

/**
 * Select scan loading state
 */
export const selectScanLoading = createSelector(
  [selectLoading],
  (loading) => loading.scan
);

/**
 * Select upload loading state
 */
export const selectUploadLoading = createSelector(
  [selectLoading],
  (loading) => loading.upload
);

/**
 * Select save loading state
 */
export const selectSaveLoading = createSelector(
  [selectLoading],
  (loading) => loading.save
);

/**
 * Select if any loading is active
 */
export const selectIsAnyLoading = createSelector(
  [selectLoading],
  (loading) => Object.values(loading).some((value) => value === true)
);

/**
 * Select toast notification
 */
export const selectToast = createSelector(
  [selectUIState],
  (ui) => ui.toast
);

/**
 * Select if toast is visible
 */
export const selectIsToastVisible = createSelector(
  [selectToast],
  (toast) => toast?.visible || false
);

/**
 * Select toast message
 */
export const selectToastMessage = createSelector(
  [selectToast],
  (toast) => toast?.message || null
);

/**
 * Select toast type
 */
export const selectToastType = createSelector(
  [selectToast],
  (toast) => toast?.type || null
);

/**
 * Select modal state
 */
export const selectModal = createSelector(
  [selectUIState],
  (ui) => ui.modal
);

/**
 * Select if modal is open
 */
export const selectIsModalOpen = createSelector(
  [selectModal],
  (modal) => modal.isOpen
);

/**
 * Select modal type
 */
export const selectModalType = createSelector(
  [selectModal],
  (modal) => modal.modalType
);

/**
 * Select modal props
 */
export const selectModalProps = createSelector(
  [selectModal],
  (modal) => modal.modalProps
);

/**
 * Select network status
 */
export const selectNetworkStatus = createSelector(
  [selectUIState],
  (ui) => ui.networkStatus
);

/**
 * Select if online
 */
export const selectIsOnline = createSelector(
  [selectNetworkStatus],
  (networkStatus) => networkStatus === 'online'
);

/**
 * Select if offline
 */
export const selectIsOffline = createSelector(
  [selectNetworkStatus],
  (networkStatus) => networkStatus === 'offline'
);

/**
 * Select all errors
 */
export const selectErrors = createSelector(
  [selectUIState],
  (ui) => ui.errors
);

/**
 * Select specific error by key
 */
export const selectErrorByKey = (key: string) =>
  createSelector([selectErrors], (errors) => errors[key] || null);

/**
 * Select if any errors exist
 */
export const selectHasErrors = createSelector(
  [selectErrors],
  (errors) => Object.keys(errors).length > 0
);

/**
 * Select error count
 */
export const selectErrorCount = createSelector(
  [selectErrors],
  (errors) => Object.keys(errors).length
);

/**
 * Select if UI is busy (loading or modal open)
 */
export const selectIsUIBusy = createSelector(
  [selectIsAnyLoading, selectIsModalOpen],
  (isLoading, isModalOpen) => isLoading || isModalOpen
);

/**
 * Select if user can interact (not busy and online)
 */
export const selectCanInteract = createSelector(
  [selectIsUIBusy, selectIsOnline],
  (isBusy, isOnline) => !isBusy && isOnline
);
