/**
 * Typography System for AniVision
 * Text styles and font definitions
 */

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';
  lineHeight: number;
  letterSpacing?: number;
}

export interface TypographyTheme {
  // Headings
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;

  // Body text
  body: TextStyle;
  bodyLarge: TextStyle;
  bodySmall: TextStyle;

  // Captions and labels
  caption: TextStyle;
  label: TextStyle;
  labelLarge: TextStyle;
  labelSmall: TextStyle;

  // Buttons
  button: TextStyle;
  buttonLarge: TextStyle;
  buttonSmall: TextStyle;

  // Special text
  overline: TextStyle;
  subtitle1: TextStyle;
  subtitle2: TextStyle;
}

// Font families
export const fontFamilies = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
  // For iOS
  ios: {
    regular: 'SF Pro Text',
    medium: 'SF Pro Text',
    bold: 'SF Pro Text',
    light: 'SF Pro Text',
  },
  // For Android
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    light: 'Roboto-Light',
  },
};

// Font weights
export const fontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

// Font sizes
export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
  massive: 40,
};

// Line heights
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

// Typography theme
export const typography: TypographyTheme = {
  // Headings
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.huge,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.huge * lineHeights.tight,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.xxxl * lineHeights.tight,
    letterSpacing: -0.25,
  },
  h3: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.xxl * lineHeights.normal,
    letterSpacing: 0,
  },
  h4: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.xl * lineHeights.normal,
    letterSpacing: 0,
  },
  h5: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.lg * lineHeights.normal,
    letterSpacing: 0,
  },
  h6: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.base * lineHeights.normal,
    letterSpacing: 0.15,
  },

  // Body text
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.base * lineHeights.normal,
    letterSpacing: 0.15,
  },
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.lg * lineHeights.normal,
    letterSpacing: 0.15,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.md * lineHeights.normal,
    letterSpacing: 0.25,
  },

  // Captions and labels
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: 0.4,
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.md * lineHeights.normal,
    letterSpacing: 0.5,
  },
  labelLarge: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.base * lineHeights.normal,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: 0.5,
  },

  // Buttons
  button: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.md * lineHeights.tight,
    letterSpacing: 1.25,
  },
  buttonLarge: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.base * lineHeights.tight,
    letterSpacing: 1.25,
  },
  buttonSmall: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.tight,
    letterSpacing: 1.25,
  },

  // Special text
  overline: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: 1.5,
  },
  subtitle1: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.base * lineHeights.relaxed,
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.md * lineHeights.normal,
    letterSpacing: 0.1,
  },
};

// Helper function to create custom text style
export const createTextStyle = (
  size: number,
  weight: typeof fontWeights[keyof typeof fontWeights],
  lineHeightMultiplier: number = 1.5,
  letterSpacing: number = 0
): TextStyle => ({
  fontFamily: fontFamilies.regular,
  fontSize: size,
  fontWeight: weight,
  lineHeight: size * lineHeightMultiplier,
  letterSpacing,
});
