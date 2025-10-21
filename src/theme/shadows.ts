/**
 * Shadow Definitions for AniVision
 * Elevation-based shadow system for depth and hierarchy
 */

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android elevation
}

export interface ShadowTheme {
  none: ShadowStyle;
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  xl: ShadowStyle;
  xxl: ShadowStyle;

  // Component-specific shadows
  card: ShadowStyle;
  button: ShadowStyle;
  modal: ShadowStyle;
  drawer: ShadowStyle;
  floating: ShadowStyle;
  dropdown: ShadowStyle;
}

// Base shadow color
const SHADOW_COLOR = '#000000';

// Helper function to create shadow style
const createShadow = (
  offsetHeight: number,
  radius: number,
  opacity: number,
  elevation: number
): ShadowStyle => ({
  shadowColor: SHADOW_COLOR,
  shadowOffset: {
    width: 0,
    height: offsetHeight,
  },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

export const shadows: ShadowTheme = {
  // Standard elevation levels
  none: createShadow(0, 0, 0, 0),
  sm: createShadow(1, 2, 0.1, 2),
  md: createShadow(2, 4, 0.15, 4),
  lg: createShadow(4, 8, 0.2, 8),
  xl: createShadow(8, 16, 0.25, 16),
  xxl: createShadow(12, 24, 0.3, 24),

  // Component-specific shadows
  card: createShadow(2, 4, 0.1, 3),
  button: createShadow(2, 3, 0.15, 4),
  modal: createShadow(8, 16, 0.25, 16),
  drawer: createShadow(4, 8, 0.2, 8),
  floating: createShadow(6, 12, 0.2, 12),
  dropdown: createShadow(4, 8, 0.15, 8),
};

// CSS-style shadow strings for web compatibility
export const cssShadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
  md: '0 2px 4px rgba(0, 0, 0, 0.15)',
  lg: '0 4px 8px rgba(0, 0, 0, 0.2)',
  xl: '0 8px 16px rgba(0, 0, 0, 0.25)',
  xxl: '0 12px 24px rgba(0, 0, 0, 0.3)',

  // Component-specific
  card: '0 2px 4px rgba(0, 0, 0, 0.1)',
  button: '0 2px 3px rgba(0, 0, 0, 0.15)',
  modal: '0 8px 16px rgba(0, 0, 0, 0.25)',
  drawer: '0 4px 8px rgba(0, 0, 0, 0.2)',
  floating: '0 6px 12px rgba(0, 0, 0, 0.2)',
  dropdown: '0 4px 8px rgba(0, 0, 0, 0.15)',
};

// Inner shadows for depth effects
export const innerShadows = {
  sm: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
  md: 'inset 0 2px 4px rgba(0, 0, 0, 0.15)',
  lg: 'inset 0 4px 8px rgba(0, 0, 0, 0.2)',
};

// Glow effects for highlights and focus states
export const glowEffects = {
  primary: '0 0 8px rgba(46, 125, 50, 0.5)',
  secondary: '0 0 8px rgba(245, 124, 0, 0.5)',
  success: '0 0 8px rgba(56, 142, 60, 0.5)',
  error: '0 0 8px rgba(211, 47, 47, 0.5)',
  warning: '0 0 8px rgba(245, 124, 0, 0.5)',
  info: '0 0 8px rgba(25, 118, 210, 0.5)',
};

// Text shadows for legibility
export const textShadows = {
  sm: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  md: {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  lg: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
};

// Platform-specific shadow adjustments
export const platformShadows = {
  ios: {
    // iOS shadows are more subtle
    card: createShadow(1, 3, 0.08, 0),
    button: createShadow(1, 2, 0.12, 0),
    modal: createShadow(6, 12, 0.2, 0),
  },
  android: {
    // Android uses elevation system
    card: { elevation: 3 },
    button: { elevation: 4 },
    modal: { elevation: 16 },
  },
  web: {
    // Web uses CSS box-shadow
    card: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    button: '0 2px 3px rgba(0, 0, 0, 0.15)',
    modal: '0 8px 16px rgba(0, 0, 0, 0.25), 0 4px 8px rgba(0, 0, 0, 0.15)',
  },
};

// Helper function to get shadow based on platform
export const getShadow = (
  platform: 'ios' | 'android' | 'web',
  shadowType: keyof ShadowTheme
): ShadowStyle | { elevation: number } | string => {
  if (platform === 'ios') {
    return platformShadows.ios[shadowType as keyof typeof platformShadows.ios] || shadows[shadowType];
  }
  if (platform === 'android') {
    return platformShadows.android[shadowType as keyof typeof platformShadows.android] || { elevation: shadows[shadowType].elevation };
  }
  return platformShadows.web[shadowType as keyof typeof platformShadows.web] || cssShadows[shadowType as keyof typeof cssShadows];
};

// Animated shadow interpolation values
export const animatedShadows = {
  pressed: {
    scale: 0.5, // Reduce shadow when pressed
    opacity: 0.6,
  },
  hover: {
    scale: 1.5, // Increase shadow on hover
    opacity: 1.2,
  },
  focus: {
    scale: 1.2,
    opacity: 1.1,
  },
};
