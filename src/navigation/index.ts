/**
 * Navigation Module Barrel Export
 *
 * This file exports all navigation-related components, types, and utilities
 * for easy importing throughout the application.
 *
 * Usage:
 * import { AppNavigator, SCREEN_NAMES } from '@/navigation';
 * import type { WelcomeScreenProps, RootStackParamList } from '@/navigation';
 */

// Main Navigator Components
export { default as AppNavigator } from './AppNavigator';
export { default as DrawerNavigator } from './DrawerNavigator';
export { default as StackNavigator } from './StackNavigator';

// Navigation Utilities
export {
  getCurrentRouteName,
  getCurrentRouteParams,
  defaultNavigationConfig,
} from './AppNavigator';

// Type Exports - Parameter Lists
export type {
  RootStackParamList,
  DrawerParamList,
  RootNavigatorParamList,
} from './types';

// Type Exports - Navigation Props
export type {
  WelcomeScreenNavigationProp,
  HomeScreenNavigationProp,
  CameraScreenNavigationProp,
  GalleryScreenNavigationProp,
  ImageDetailScreenNavigationProp,
  ScanResultScreenNavigationProp,
  SettingsScreenNavigationProp,
  AboutScreenNavigationProp,
} from './types';

// Type Exports - Route Props
export type {
  WelcomeScreenRouteProp,
  HomeScreenRouteProp,
  CameraScreenRouteProp,
  GalleryScreenRouteProp,
  ImageDetailScreenRouteProp,
  ScanResultScreenRouteProp,
  SettingsScreenRouteProp,
  AboutScreenRouteProp,
} from './types';

// Type Exports - Combined Screen Props
export type {
  WelcomeScreenProps,
  HomeScreenProps,
  CameraScreenProps,
  GalleryScreenProps,
  ImageDetailScreenProps,
  ScanResultScreenProps,
  SettingsScreenProps,
  AboutScreenProps,
} from './types';

// Type Exports - Data Types
export type {
  ImageInfo,
  SpeciesIdentification,
  IdentifiedImage,
  ScanResult,
  APIConfig,
} from './types';

// Type Exports - Helper Types
export type {
  RootNavigationProp,
  ScreenName,
  AnimationType,
  DrawerPosition,
  ScreenOrientation,
  NavigationOptions,
  DrawerConfig,
} from './types';

// Type Exports - Configuration Types
export type { NavigationConfig } from './AppNavigator';

// Constants
export { SCREEN_NAMES } from './types';

/**
 * Re-export commonly used navigation hooks for convenience
 * These are from @react-navigation/native
 */
export {
  useNavigation,
  useRoute,
  useFocusEffect,
  useIsFocused,
  useNavigationState,
} from '@react-navigation/native';

/**
 * Re-export drawer navigation hooks
 * These are from @react-navigation/drawer
 */
export {
  useDrawerStatus,
  useDrawerProgress,
} from '@react-navigation/drawer';

/**
 * Navigation Helper Functions
 */

/**
 * Type-safe navigation helper
 * Ensures navigation calls are type-checked
 */
import { NavigationProp } from '@react-navigation/native';
import type { RootNavigatorParamList } from './types';

/**
 * Navigate to a screen with type safety
 */
export const navigateTo = <RouteName extends keyof RootNavigatorParamList>(
  navigation: NavigationProp<RootNavigatorParamList>,
  routeName: RouteName,
  params?: RootNavigatorParamList[RouteName]
) => {
  navigation.navigate(routeName as never, params as never);
};

/**
 * Go back with type safety
 */
export const goBack = (navigation: NavigationProp<RootNavigatorParamList>) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  }
};

/**
 * Reset navigation stack
 */
export const resetNavigation = (
  navigation: NavigationProp<RootNavigatorParamList>,
  routeName: keyof RootNavigatorParamList
) => {
  navigation.reset({
    index: 0,
    routes: [{ name: routeName as never }],
  });
};

/**
 * Check if can go back
 */
export const canGoBack = (
  navigation: NavigationProp<RootNavigatorParamList>
): boolean => {
  return navigation.canGoBack();
};

/**
 * Open drawer
 */
export const openDrawer = (navigation: any) => {
  if (navigation.openDrawer) {
    navigation.openDrawer();
  } else if (navigation.getParent()?.openDrawer) {
    navigation.getParent().openDrawer();
  }
};

/**
 * Close drawer
 */
export const closeDrawer = (navigation: any) => {
  if (navigation.closeDrawer) {
    navigation.closeDrawer();
  } else if (navigation.getParent()?.closeDrawer) {
    navigation.getParent().closeDrawer();
  }
};

/**
 * Toggle drawer
 */
export const toggleDrawer = (navigation: any) => {
  if (navigation.toggleDrawer) {
    navigation.toggleDrawer();
  } else if (navigation.getParent()?.toggleDrawer) {
    navigation.getParent().toggleDrawer();
  }
};

/**
 * Navigation Constants
 */
export const NAVIGATION_CONSTANTS = {
  HEADER_HEIGHT: 56,
  DRAWER_WIDTH: 280,
  TAB_BAR_HEIGHT: 60,
  ANIMATION_DURATION: 300,
} as const;

/**
 * Navigation Event Names
 */
export const NAVIGATION_EVENTS = {
  FOCUS: 'focus',
  BLUR: 'blur',
  STATE_CHANGE: 'state',
  BEFORE_REMOVE: 'beforeRemove',
} as const;

/**
 * Default export - AppNavigator
 */
export { default } from './AppNavigator';
