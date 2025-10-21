/**
 * Theme System Index
 * Central export for the complete AniVision theme
 */

import { lightColors, darkColors, ColorPalette, semanticColors, gradients, opacity } from './colors';
import { typography, TypographyTheme, fontFamilies, fontWeights, fontSizes, lineHeights } from './typography';
import { spacing, SpacingTheme, responsiveSpacing, insets, grid } from './spacing';
import { shadows, ShadowTheme, cssShadows, glowEffects, textShadows, platformShadows, getShadow } from './shadows';
import { borderRadius, BorderRadiusTheme, cornerRadius, shapes, getBorderRadiusStyle, responsiveBorderRadius } from './borderRadius';

/**
 * Complete Theme Interface
 */
export interface Theme {
  mode: 'light' | 'dark';
  colors: ColorPalette;
  typography: TypographyTheme;
  spacing: SpacingTheme;
  shadows: ShadowTheme;
  borderRadius: BorderRadiusTheme;
}

/**
 * Create theme based on mode
 */
export const createTheme = (mode: 'light' | 'dark' = 'light'): Theme => ({
  mode,
  colors: mode === 'light' ? lightColors : darkColors,
  typography,
  spacing,
  shadows,
  borderRadius,
});

/**
 * Default themes
 */
export const lightTheme: Theme = createTheme('light');
export const darkTheme: Theme = createTheme('dark');

/**
 * Theme context default value
 */
export const defaultTheme = lightTheme;

/**
 * Export individual theme modules
 */
export {
  // Colors
  lightColors,
  darkColors,
  semanticColors,
  gradients,
  opacity,

  // Typography
  typography,
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,

  // Spacing
  spacing,
  responsiveSpacing,
  insets,
  grid,

  // Shadows
  shadows,
  cssShadows,
  glowEffects,
  textShadows,
  platformShadows,
  getShadow,

  // Border Radius
  borderRadius,
  cornerRadius,
  shapes,
  getBorderRadiusStyle,
  responsiveBorderRadius,
};

/**
 * Export types
 */
export type {
  Theme,
  ColorPalette,
  TypographyTheme,
  SpacingTheme,
  ShadowTheme,
  BorderRadiusTheme,
};

/**
 * Theme utility functions
 */
export const themeUtils = {
  /**
   * Check if theme is dark mode
   */
  isDark: (theme: Theme): boolean => theme.mode === 'dark',

  /**
   * Get opposite theme mode
   */
  getOppositeMode: (mode: 'light' | 'dark'): 'light' | 'dark' =>
    mode === 'light' ? 'dark' : 'light',

  /**
   * Toggle theme between light and dark
   */
  toggleTheme: (currentTheme: Theme): Theme =>
    createTheme(themeUtils.getOppositeMode(currentTheme.mode)),

  /**
   * Get color with opacity
   */
  withOpacity: (color: string, opacityValue: number): string => {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacityValue})`;
    }

    // Handle rgb/rgba colors
    if (color.startsWith('rgb')) {
      return color.replace(/rgba?\(([\d,\s]+)(?:,[^)]+)?\)/, `rgba($1, ${opacityValue})`);
    }

    return color;
  },

  /**
   * Get responsive value based on screen width
   */
  getResponsiveValue: <T>(
    value: T,
    screenWidth: number,
    breakpoints: { small: T; medium: T; large: T }
  ): T => {
    if (screenWidth < 360) return breakpoints.small;
    if (screenWidth < 768) return breakpoints.medium;
    return breakpoints.large;
  },

  /**
   * Interpolate between two values
   */
  interpolate: (
    value: number,
    inputRange: [number, number],
    outputRange: [number, number]
  ): number => {
    const [inputMin, inputMax] = inputRange;
    const [outputMin, outputMax] = outputRange;

    const clampedValue = Math.max(inputMin, Math.min(inputMax, value));
    const progress = (clampedValue - inputMin) / (inputMax - inputMin);

    return outputMin + progress * (outputMax - outputMin);
  },

  /**
   * Get contrasting text color based on background
   */
  getContrastText: (backgroundColor: string, theme: Theme): string => {
    // Simple luminance calculation
    const getLuminance = (color: string): number => {
      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      }
      return 0.5; // Default to medium luminance
    };

    const luminance = getLuminance(backgroundColor);
    return luminance > 0.5 ? theme.colors.text : '#FFFFFF';
  },

  /**
   * Mix two colors
   */
  mixColors: (color1: string, color2: string, ratio: number = 0.5): string => {
    const parseHex = (hex: string) => {
      const h = hex.replace('#', '');
      return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16),
      };
    };

    if (color1.startsWith('#') && color2.startsWith('#')) {
      const c1 = parseHex(color1);
      const c2 = parseHex(color2);

      const r = Math.round(c1.r * (1 - ratio) + c2.r * ratio);
      const g = Math.round(c1.g * (1 - ratio) + c2.g * ratio);
      const b = Math.round(c1.b * (1 - ratio) + c2.b * ratio);

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    return color1;
  },
};

/**
 * Theme constants for easy access
 */
export const themeConstants = {
  // Animation durations
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
    verySlow: 500,
  },

  // Transition easings
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    notification: 1700,
  },

  // Breakpoints (pixels)
  breakpoints: {
    xs: 0,
    sm: 360,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1920,
  },

  // Common dimensions
  dimensions: {
    maxContentWidth: 1200,
    minTouchTarget: 44,
    imageAspectRatio: 4 / 3,
    thumbnailSize: 80,
    previewSize: 200,
  },
};

/**
 * Default export
 */
export default {
  lightTheme,
  darkTheme,
  createTheme,
  themeUtils,
  themeConstants,
};
