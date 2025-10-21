/**
 * Color Palette for AniVision
 * Comprehensive color system supporting light and dark modes
 */

export interface ColorPalette {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  error: string;
  errorLight: string;
  errorDark: string;
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  info: string;
  infoLight: string;
  infoDark: string;
  border: string;
  borderLight: string;
  divider: string;
  overlay: string;
  disabled: string;
  placeholder: string;
  card: string;
  shadow: string;
}

// Light mode colors
export const lightColors: ColorPalette = {
  // Primary colors - Nature-inspired green
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#4CAF50',

  // Secondary colors - Wildlife-inspired amber/orange
  secondary: '#F57C00',
  secondaryDark: '#E65100',
  secondaryLight: '#FF9800',

  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',

  // Surfaces
  surface: '#FFFFFF',
  surfaceSecondary: '#FAFAFA',

  // Text colors
  text: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',

  // Error colors
  error: '#D32F2F',
  errorLight: '#EF5350',
  errorDark: '#C62828',

  // Success colors
  success: '#388E3C',
  successLight: '#66BB6A',
  successDark: '#2E7D32',

  // Warning colors
  warning: '#F57C00',
  warningLight: '#FFA726',
  warningDark: '#EF6C00',

  // Info colors
  info: '#1976D2',
  infoLight: '#42A5F5',
  infoDark: '#1565C0',

  // Borders and dividers
  border: '#E0E0E0',
  borderLight: '#F5F5F5',
  divider: '#EEEEEE',

  // Overlay and states
  overlay: 'rgba(0, 0, 0, 0.5)',
  disabled: '#E0E0E0',
  placeholder: '#9E9E9E',

  // Cards and shadows
  card: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Dark mode colors
export const darkColors: ColorPalette = {
  // Primary colors - Adjusted for dark mode
  primary: '#66BB6A',
  primaryDark: '#4CAF50',
  primaryLight: '#81C784',

  // Secondary colors
  secondary: '#FFB74D',
  secondaryDark: '#FFA726',
  secondaryLight: '#FFCC80',

  // Backgrounds
  background: '#121212',
  backgroundSecondary: '#1E1E1E',

  // Surfaces
  surface: '#1E1E1E',
  surfaceSecondary: '#2C2C2C',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textDisabled: '#6E6E6E',

  // Error colors
  error: '#EF5350',
  errorLight: '#E57373',
  errorDark: '#D32F2F',

  // Success colors
  success: '#66BB6A',
  successLight: '#81C784',
  successDark: '#4CAF50',

  // Warning colors
  warning: '#FFB74D',
  warningLight: '#FFCC80',
  warningDark: '#FFA726',

  // Info colors
  info: '#42A5F5',
  infoLight: '#64B5F6',
  infoDark: '#1976D2',

  // Borders and dividers
  border: '#424242',
  borderLight: '#383838',
  divider: '#303030',

  // Overlay and states
  overlay: 'rgba(0, 0, 0, 0.7)',
  disabled: '#424242',
  placeholder: '#757575',

  // Cards and shadows
  card: '#1E1E1E',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// Semantic color mappings
export const semanticColors = {
  confidence: {
    high: '#4CAF50',      // Green for high confidence (>0.8)
    medium: '#FF9800',    // Orange for medium confidence (0.5-0.8)
    low: '#F44336',       // Red for low confidence (<0.5)
  },
  imageQuality: {
    high: '#4CAF50',
    medium: '#FF9800',
    low: '#F44336',
  },
  status: {
    active: '#4CAF50',
    inactive: '#757575',
    pending: '#FF9800',
    failed: '#F44336',
  },
};

// Gradient definitions
export const gradients = {
  primary: ['#1B5E20', '#2E7D32', '#4CAF50'],
  secondary: ['#E65100', '#F57C00', '#FF9800'],
  success: ['#2E7D32', '#388E3C', '#66BB6A'],
  error: ['#C62828', '#D32F2F', '#EF5350'],
  background: ['#FFFFFF', '#F5F5F5', '#EEEEEE'],
  backgroundDark: ['#121212', '#1E1E1E', '#2C2C2C'],
};

// Opacity levels
export const opacity = {
  disabled: 0.38,
  divider: 0.12,
  overlay: 0.5,
  hover: 0.08,
  focus: 0.12,
  active: 0.16,
  selected: 0.24,
};
