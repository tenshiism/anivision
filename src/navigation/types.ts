/**
 * Navigation Types
 *
 * This file contains all TypeScript type definitions for React Navigation.
 * It provides type safety for navigation props, routes, and parameters
 * across the entire application.
 */

import { NavigationProp, RouteProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';

/**
 * Image-related types for navigation parameters
 */
export interface ImageInfo {
  uri: string;
  fileName: string;
  type: string;
  fileSize: number;
}

export interface SpeciesIdentification {
  commonName: string;
  scientificName: string;
  confidence: number;
  summary: string;
  additionalDetails?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
}

export interface IdentifiedImage {
  id: string;
  imageUri: string;
  identification: SpeciesIdentification;
  timestamp: Date;
  thumbnailUri?: string;
}

export interface ScanResult {
  image: ImageInfo;
  identification: SpeciesIdentification;
  timestamp: Date;
  rawResponse?: string;
}

/**
 * API Configuration type
 */
export interface APIConfig {
  apiUrl: string;
  apiKey: string;
}

/**
 * Root Stack Navigator Parameter List
 * Defines all screens in the main stack navigation
 */
export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Camera: undefined;
  Gallery: undefined;
  ImageDetail: {
    imageId: string;
    image: IdentifiedImage;
  };
  ScanResult: {
    result: ScanResult;
  };
};

/**
 * Drawer Navigator Parameter List
 * Defines all screens accessible from the drawer
 */
export type DrawerParamList = {
  Main: undefined;
  Settings: {
    returnTo?: keyof RootStackParamList;
  };
  About: undefined;
};

/**
 * Combined Root Navigator Parameter List
 * Combines Stack and Drawer navigation types
 */
export type RootNavigatorParamList = RootStackParamList & DrawerParamList;

/**
 * Navigation Props for Stack Screens
 */
export type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type CameraScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Camera'
>;

export type GalleryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Gallery'
>;

export type ImageDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ImageDetail'
>;

export type ScanResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ScanResult'
>;

/**
 * Route Props for Stack Screens
 */
export type WelcomeScreenRouteProp = RouteProp<RootStackParamList, 'Welcome'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;
export type GalleryScreenRouteProp = RouteProp<RootStackParamList, 'Gallery'>;
export type ImageDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ImageDetail'
>;
export type ScanResultScreenRouteProp = RouteProp<
  RootStackParamList,
  'ScanResult'
>;

/**
 * Navigation Props for Drawer Screens
 */
export type SettingsScreenNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  'Settings'
>;

export type AboutScreenNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  'About'
>;

/**
 * Route Props for Drawer Screens
 */
export type SettingsScreenRouteProp = RouteProp<DrawerParamList, 'Settings'>;
export type AboutScreenRouteProp = RouteProp<DrawerParamList, 'About'>;

/**
 * Combined Screen Props
 * Combines navigation and route props for easier usage
 */
export interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
  route: WelcomeScreenRouteProp;
}

export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

export interface CameraScreenProps {
  navigation: CameraScreenNavigationProp;
  route: CameraScreenRouteProp;
}

export interface GalleryScreenProps {
  navigation: GalleryScreenNavigationProp;
  route: GalleryScreenRouteProp;
}

export interface ImageDetailScreenProps {
  navigation: ImageDetailScreenNavigationProp;
  route: ImageDetailScreenRouteProp;
}

export interface ScanResultScreenProps {
  navigation: ScanResultScreenNavigationProp;
  route: ScanResultScreenRouteProp;
}

export interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
  route: SettingsScreenRouteProp;
}

export interface AboutScreenProps {
  navigation: AboutScreenNavigationProp;
  route: AboutScreenRouteProp;
}

/**
 * Navigation Helper Types
 */
export type RootNavigationProp = NavigationProp<RootNavigatorParamList>;

/**
 * Screen Names as Constants
 * Provides type-safe screen name references
 */
export const SCREEN_NAMES = {
  WELCOME: 'Welcome' as const,
  HOME: 'Home' as const,
  CAMERA: 'Camera' as const,
  GALLERY: 'Gallery' as const,
  IMAGE_DETAIL: 'ImageDetail' as const,
  SCAN_RESULT: 'ScanResult' as const,
  SETTINGS: 'Settings' as const,
  ABOUT: 'About' as const,
  MAIN: 'Main' as const,
} as const;

/**
 * Screen Name Type
 */
export type ScreenName = typeof SCREEN_NAMES[keyof typeof SCREEN_NAMES];

/**
 * Navigation Animation Types
 */
export type AnimationType = 'slide' | 'fade' | 'none';

/**
 * Drawer Position Type
 */
export type DrawerPosition = 'left' | 'right';

/**
 * Screen Orientation Type
 */
export type ScreenOrientation = 'portrait' | 'landscape' | 'all';

/**
 * Navigation Options Type
 */
export interface NavigationOptions {
  headerShown?: boolean;
  headerTitle?: string;
  headerBackTitle?: string;
  gestureEnabled?: boolean;
  animationEnabled?: boolean;
  animationType?: AnimationType;
}

/**
 * Drawer Configuration Type
 */
export interface DrawerConfig {
  position: DrawerPosition;
  width: number | string;
  backgroundColor: string;
  overlayColor: string;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootNavigatorParamList {}
  }
}
