/**
 * Border Radius System for AniVision
 * Consistent border radius values for components
 */

export interface BorderRadiusTheme {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  full: number;

  // Component-specific radius
  component: {
    button: number;
    card: number;
    input: number;
    modal: number;
    badge: number;
    avatar: number;
    chip: number;
    image: number;
    thumbnail: number;
    fab: number;
  };
}

export const borderRadius: BorderRadiusTheme = {
  // Standard border radius values
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999, // For fully rounded elements

  // Component-specific border radius
  component: {
    button: 8,           // Standard button
    card: 12,            // Card container
    input: 8,            // Input field
    modal: 16,           // Modal dialog
    badge: 12,           // Badge/tag
    avatar: 9999,        // Circular avatar
    chip: 16,            // Chip/tag
    image: 8,            // Standard image
    thumbnail: 4,        // Small thumbnail
    fab: 9999,           // Floating action button (circular)
  },
};

// Corner-specific radius for complex shapes
export interface CornerRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

// Preset corner radius combinations
export const cornerRadius = {
  topRounded: (radius: number = borderRadius.md): CornerRadius => ({
    topLeft: radius,
    topRight: radius,
    bottomLeft: 0,
    bottomRight: 0,
  }),

  bottomRounded: (radius: number = borderRadius.md): CornerRadius => ({
    topLeft: 0,
    topRight: 0,
    bottomLeft: radius,
    bottomRight: radius,
  }),

  leftRounded: (radius: number = borderRadius.md): CornerRadius => ({
    topLeft: radius,
    topRight: 0,
    bottomLeft: radius,
    bottomRight: 0,
  }),

  rightRounded: (radius: number = borderRadius.md): CornerRadius => ({
    topLeft: 0,
    topRight: radius,
    bottomLeft: 0,
    bottomRight: radius,
  }),

  diagonalTopLeft: (radius: number = borderRadius.md): CornerRadius => ({
    topLeft: radius,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: radius,
  }),

  diagonalTopRight: (radius: number = borderRadius.md): CornerRadius => ({
    topLeft: 0,
    topRight: radius,
    bottomLeft: radius,
    bottomRight: 0,
  }),

  custom: (
    topLeft: number,
    topRight: number,
    bottomRight: number,
    bottomLeft: number
  ): CornerRadius => ({
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  }),
};

// Helper function to generate border radius style object
export const getBorderRadiusStyle = (
  radius: number | CornerRadius
): Record<string, number> => {
  if (typeof radius === 'number') {
    return { borderRadius: radius };
  }

  return {
    borderTopLeftRadius: radius.topLeft,
    borderTopRightRadius: radius.topRight,
    borderBottomLeftRadius: radius.bottomLeft,
    borderBottomRightRadius: radius.bottomRight,
  };
};

// Responsive border radius based on component size
export const responsiveBorderRadius = {
  getForSize: (size: 'small' | 'medium' | 'large'): number => {
    switch (size) {
      case 'small':
        return borderRadius.sm;
      case 'medium':
        return borderRadius.md;
      case 'large':
        return borderRadius.lg;
      default:
        return borderRadius.md;
    }
  },

  getForDimension: (dimension: number): number => {
    // Calculate proportional radius based on dimension
    if (dimension <= 40) return borderRadius.sm;
    if (dimension <= 100) return borderRadius.md;
    if (dimension <= 200) return borderRadius.lg;
    return borderRadius.xl;
  },
};

// Special shape definitions
export const shapes = {
  circle: borderRadius.full,
  pill: borderRadius.full,
  rounded: borderRadius.md,
  sharp: borderRadius.none,

  // Shape presets for common components
  presets: {
    buttonPrimary: borderRadius.component.button,
    buttonSecondary: borderRadius.lg,
    buttonOutline: borderRadius.md,
    cardElevated: borderRadius.component.card,
    cardFlat: borderRadius.md,
    imageStandard: borderRadius.component.image,
    imageCircular: borderRadius.full,
    modalStandard: borderRadius.component.modal,
    modalFullscreen: borderRadius.none,
    inputStandard: borderRadius.component.input,
    inputRounded: borderRadius.lg,
  },
};

// Border radius animations
export const animatedRadius = {
  // Transition from one radius to another
  transition: {
    duration: 200,
    easing: 'ease-in-out',
  },

  // Expand/contract animations
  expand: {
    from: borderRadius.sm,
    to: borderRadius.lg,
  },
  contract: {
    from: borderRadius.lg,
    to: borderRadius.sm,
  },
};
