/**
 * Spacing System for AniVision
 * Consistent spacing constants for layout and components
 */

export interface SpacingTheme {
  // Base spacing unit (4px)
  unit: number;

  // Common spacing values
  none: number;
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;

  // Semantic spacing
  padding: {
    screen: number;
    container: number;
    card: number;
    section: number;
    item: number;
  };

  margin: {
    section: number;
    component: number;
    element: number;
    tight: number;
  };

  gap: {
    grid: number;
    list: number;
    inline: number;
    tight: number;
  };

  // Component-specific spacing
  component: {
    buttonPaddingHorizontal: number;
    buttonPaddingVertical: number;
    inputPaddingHorizontal: number;
    inputPaddingVertical: number;
    cardPadding: number;
    modalPadding: number;
    drawerPadding: number;
    headerHeight: number;
    footerHeight: number;
    tabBarHeight: number;
    iconSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    avatarSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
}

// Base spacing unit (4px system)
const SPACING_UNIT = 4;

// Generate spacing values based on the unit
const generateSpacing = (multiplier: number): number => SPACING_UNIT * multiplier;

export const spacing: SpacingTheme = {
  // Base unit
  unit: SPACING_UNIT,

  // Common spacing values (multiples of base unit)
  none: 0,
  xxs: generateSpacing(1),    // 4px
  xs: generateSpacing(2),     // 8px
  sm: generateSpacing(3),     // 12px
  md: generateSpacing(4),     // 16px
  lg: generateSpacing(6),     // 24px
  xl: generateSpacing(8),     // 32px
  xxl: generateSpacing(12),   // 48px
  xxxl: generateSpacing(16),  // 64px

  // Semantic spacing
  padding: {
    screen: generateSpacing(4),      // 16px - Main screen padding
    container: generateSpacing(5),   // 20px - Container padding
    card: generateSpacing(4),        // 16px - Card padding
    section: generateSpacing(6),     // 24px - Section padding
    item: generateSpacing(3),        // 12px - Item padding
  },

  margin: {
    section: generateSpacing(6),     // 24px - Between sections
    component: generateSpacing(4),   // 16px - Between components
    element: generateSpacing(2),     // 8px - Between elements
    tight: generateSpacing(1),       // 4px - Tight spacing
  },

  gap: {
    grid: generateSpacing(3),        // 12px - Grid gap
    list: generateSpacing(2),        // 8px - List item gap
    inline: generateSpacing(2),      // 8px - Inline element gap
    tight: generateSpacing(1),       // 4px - Tight gap
  },

  // Component-specific spacing
  component: {
    // Button spacing
    buttonPaddingHorizontal: generateSpacing(6),  // 24px
    buttonPaddingVertical: generateSpacing(3),    // 12px

    // Input spacing
    inputPaddingHorizontal: generateSpacing(4),   // 16px
    inputPaddingVertical: generateSpacing(3),     // 12px

    // Container spacing
    cardPadding: generateSpacing(4),              // 16px
    modalPadding: generateSpacing(6),             // 24px
    drawerPadding: generateSpacing(4),            // 16px

    // Layout heights
    headerHeight: generateSpacing(14),            // 56px
    footerHeight: generateSpacing(16),            // 64px
    tabBarHeight: generateSpacing(14),            // 56px

    // Icon sizes
    iconSize: {
      xs: generateSpacing(4),    // 16px
      sm: generateSpacing(5),    // 20px
      md: generateSpacing(6),    // 24px
      lg: generateSpacing(8),    // 32px
      xl: generateSpacing(12),   // 48px
    },

    // Avatar sizes
    avatarSize: {
      xs: generateSpacing(6),    // 24px
      sm: generateSpacing(8),    // 32px
      md: generateSpacing(10),   // 40px
      lg: generateSpacing(15),   // 60px
      xl: generateSpacing(20),   // 80px
    },
  },
};

// Helper functions for responsive spacing
export const responsiveSpacing = {
  /**
   * Get spacing based on screen size
   */
  getResponsive: (
    base: number,
    scale: { small?: number; medium?: number; large?: number } = {}
  ): { small: number; medium: number; large: number } => ({
    small: scale.small !== undefined ? base * scale.small : base,
    medium: scale.medium !== undefined ? base * scale.medium : base * 1.5,
    large: scale.large !== undefined ? base * scale.large : base * 2,
  }),

  /**
   * Get horizontal padding for screen
   */
  getScreenHorizontal: (screenWidth: number): number => {
    if (screenWidth < 360) return spacing.md;
    if (screenWidth < 768) return spacing.lg;
    return spacing.xl;
  },

  /**
   * Get vertical padding for screen
   */
  getScreenVertical: (screenHeight: number): number => {
    if (screenHeight < 600) return spacing.md;
    if (screenHeight < 900) return spacing.lg;
    return spacing.xl;
  },
};

// Inset spacing for safe areas (iOS notches, Android navigation)
export const insets = {
  top: {
    small: spacing.md,
    medium: spacing.lg,
    large: spacing.xl,
  },
  bottom: {
    small: spacing.md,
    medium: spacing.lg,
    large: spacing.xl,
  },
  horizontal: spacing.md,
};

// Grid system
export const grid = {
  columns: 12,
  gutter: spacing.md,
  margin: spacing.lg,
  containerMaxWidth: 1200,
};
