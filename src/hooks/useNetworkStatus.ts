import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';

/**
 * Network connection type
 */
export type ConnectionType =
  | 'wifi'
  | 'cellular'
  | 'ethernet'
  | 'bluetooth'
  | 'none'
  | 'unknown';

/**
 * Network status interface
 */
export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: ConnectionType;
  details: {
    isConnectionExpensive: boolean;
    cellularGeneration: string | null;
    strength: number | null;
  };
}

/**
 * Return type for useNetworkStatus hook
 */
export interface UseNetworkStatusReturn {
  isOnline: boolean;
  isOffline: boolean;
  networkStatus: NetworkStatus;
  connectionType: ConnectionType;
  isConnected: boolean;
  isInternetReachable: boolean;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for monitoring network connectivity status
 *
 * Features:
 * - Real-time network status monitoring
 * - Connection type detection (wifi, cellular, etc.)
 * - Internet reachability checking
 * - Redux integration for global state updates
 * - Automatic reconnection detection
 *
 * @returns {UseNetworkStatusReturn} Network status information and control
 *
 * @example
 * ```typescript
 * const {
 *   isOnline,
 *   isOffline,
 *   networkStatus,
 *   connectionType,
 *   refresh
 * } = useNetworkStatus();
 *
 * // Check if online
 * if (isOnline) {
 *   console.log('Connected to internet');
 * }
 *
 * // Get connection type
 * console.log(`Connection: ${connectionType}`);
 *
 * // Manually refresh status
 * await refresh();
 * ```
 */
export const useNetworkStatus = (): UseNetworkStatusReturn => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: false,
    isInternetReachable: null,
    type: 'unknown',
    details: {
      isConnectionExpensive: false,
      cellularGeneration: null,
      strength: null,
    },
  });

  const dispatch = useDispatch();

  /**
   * Map NetInfo connection type to our ConnectionType
   */
  const mapConnectionType = (type: NetInfoStateType): ConnectionType => {
    switch (type) {
      case 'wifi':
        return 'wifi';
      case 'cellular':
        return 'cellular';
      case 'ethernet':
        return 'ethernet';
      case 'bluetooth':
        return 'bluetooth';
      case 'none':
        return 'none';
      default:
        return 'unknown';
    }
  };

  /**
   * Process NetInfo state and update network status
   */
  const processNetworkState = useCallback((state: NetInfoState): NetworkStatus => {
    const status: NetworkStatus = {
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable ?? null,
      type: mapConnectionType(state.type),
      details: {
        isConnectionExpensive: state.details?.isConnectionExpensive ?? false,
        cellularGeneration: state.details?.cellularGeneration ?? null,
        strength: state.details?.strength ?? null,
      },
    };

    return status;
  }, []);

  /**
   * Handle network state change
   */
  const handleNetworkStateChange = useCallback(
    (state: NetInfoState) => {
      const status = processNetworkState(state);
      setNetworkStatus(status);

      // Update Redux store
      dispatch({
        type: 'ui/setNetworkStatus',
        payload: status.isConnected ? 'online' : 'offline',
      });

      // Log network status changes in development
      if (__DEV__) {
        console.log('Network status changed:', {
          isConnected: status.isConnected,
          type: status.type,
          isInternetReachable: status.isInternetReachable,
        });
      }

      // Handle reconnection
      if (status.isConnected && status.isInternetReachable) {
        // Dispatch reconnection event for background sync
        dispatch({
          type: 'network/reconnected',
        });
      }

      // Handle disconnection
      if (!status.isConnected) {
        // Dispatch disconnection event
        dispatch({
          type: 'network/disconnected',
        });
      }
    },
    [dispatch, processNetworkState]
  );

  /**
   * Manually refresh network status
   */
  const refresh = useCallback(async (): Promise<void> => {
    try {
      const state = await NetInfo.fetch();
      handleNetworkStateChange(state);
    } catch (error) {
      console.error('Failed to refresh network status:', error);
    }
  }, [handleNetworkStateChange]);

  /**
   * Subscribe to network status changes
   */
  useEffect(() => {
    // Fetch initial network status
    NetInfo.fetch().then(handleNetworkStateChange);

    // Subscribe to network status changes
    const unsubscribe = NetInfo.addEventListener(handleNetworkStateChange);

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [handleNetworkStateChange]);

  /**
   * Set up periodic network check (optional, for additional reliability)
   */
  useEffect(() => {
    // Check network status every 30 seconds as a fallback
    const intervalId = setInterval(() => {
      refresh();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [refresh]);

  return {
    isOnline: networkStatus.isConnected && (networkStatus.isInternetReachable ?? true),
    isOffline: !networkStatus.isConnected,
    networkStatus,
    connectionType: networkStatus.type,
    isConnected: networkStatus.isConnected,
    isInternetReachable: networkStatus.isInternetReachable ?? false,
    refresh,
  };
};

export default useNetworkStatus;
