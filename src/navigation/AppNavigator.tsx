/**
 * App Navigator (Root Navigator)
 *
 * This is the root navigation component that orchestrates the entire
 * navigation hierarchy. It combines the Drawer Navigator with the
 * Stack Navigator to provide the complete navigation structure.
 *
 * Navigation Hierarchy:
 * AppNavigator (Root)
 *   └── DrawerNavigator
 *       ├── Main (StackNavigator)
 *       │   ├── Welcome (initial)
 *       │   ├── Home
 *       │   ├── Camera
 *       │   ├── Gallery
 *       │   ├── ImageDetail
 *       │   └── ScanResult
 *       ├── Settings
 *       └── About
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DrawerNavigator from './DrawerNavigator';

/**
 * Navigation Theme Configuration
 * Provides consistent colors and styles for navigation
 */
const navigationTheme = {
  dark: false,
  colors: {
    primary: '#007AFF',
    background: '#fff',
    card: '#fff',
    text: '#333',
    border: '#e0e0e0',
    notification: '#FF3B30',
  },
};

/**
 * Loading Screen Component
 * Displayed while the app is initializing
 */
const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading AniVision...</Text>
    </View>
  );
};

/**
 * Error Screen Component
 * Displayed when navigation initialization fails
 */
interface ErrorScreenProps {
  error: Error;
  retry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, retry }) => {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Navigation Error</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
    </View>
  );
};

/**
 * App Navigator Component
 * Root navigation component that manages the entire navigation structure
 */
const AppNavigator: React.FC = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Initialize Navigation
   * Performs any necessary setup before navigation is ready
   */
  useEffect(() => {
    const initializeNavigation = async () => {
      try {
        // Simulate initialization delay (can be replaced with actual setup)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Add any navigation initialization logic here
        // - Load saved navigation state
        // - Check authentication status
        // - Verify API configuration
        // - Load user preferences

        setIsReady(true);
      } catch (err) {
        console.error('Navigation initialization error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    initializeNavigation();
  }, []);

  /**
   * Navigation State Change Handler
   * Logs navigation state changes for debugging
   */
  const handleNavigationStateChange = (state: any) => {
    // Log navigation state changes in development
    if (__DEV__) {
      console.log('Navigation state changed:', state);
    }

    // Add analytics tracking here if needed
    // trackScreenView(getCurrentRouteName(state));
  };

  /**
   * Navigation Ready Handler
   * Called when navigation container is ready
   */
  const handleNavigationReady = () => {
    if (__DEV__) {
      console.log('Navigation ready');
    }
  };

  /**
   * Retry Initialization
   * Retries navigation initialization after an error
   */
  const retryInitialization = () => {
    setError(null);
    setIsReady(false);

    setTimeout(() => {
      setIsReady(true);
    }, 500);
  };

  // Show loading screen while initializing
  if (!isReady && !error) {
    return (
      <SafeAreaProvider>
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }

  // Show error screen if initialization failed
  if (error) {
    return (
      <SafeAreaProvider>
        <ErrorScreen error={error} retry={retryInitialization} />
      </SafeAreaProvider>
    );
  }

  // Render navigation container with drawer navigator
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />
      <NavigationContainer
        theme={navigationTheme}
        onStateChange={handleNavigationStateChange}
        onReady={handleNavigationReady}
        documentTitle={{
          formatter: (options, route) =>
            `AniVision - ${options?.title ?? route?.name ?? 'Home'}`,
        }}
      >
        <DrawerNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

/**
 * Navigation Utilities
 */

/**
 * Get Current Route Name
 * Extracts the current route name from navigation state
 */
export const getCurrentRouteName = (state: any): string | undefined => {
  if (!state || !state.routes || state.routes.length === 0) {
    return undefined;
  }

  const route = state.routes[state.index];

  if (route.state) {
    return getCurrentRouteName(route.state);
  }

  return route.name;
};

/**
 * Get Current Route Params
 * Extracts the current route parameters from navigation state
 */
export const getCurrentRouteParams = (state: any): any => {
  if (!state || !state.routes || state.routes.length === 0) {
    return undefined;
  }

  const route = state.routes[state.index];

  if (route.state) {
    return getCurrentRouteParams(route.state);
  }

  return route.params;
};

/**
 * Navigation Configuration Type
 * For advanced navigation configuration
 */
export interface NavigationConfig {
  initialRouteName?: string;
  enableDeepLinking?: boolean;
  persistNavigation?: boolean;
  analyticsEnabled?: boolean;
}

/**
 * Default Navigation Configuration
 */
export const defaultNavigationConfig: NavigationConfig = {
  initialRouteName: 'Welcome',
  enableDeepLinking: false,
  persistNavigation: false,
  analyticsEnabled: false,
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default AppNavigator;
