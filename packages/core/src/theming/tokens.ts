// Design Tokens for TUI Kit
// Inspired by modern design systems like Tailwind CSS and shadcn/ui

export const tokens = {
  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    
    // Gray Colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
    
    // Success Colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    
    // Warning Colors
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    
    // Error Colors
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    
    // Info Colors
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
  },
  
  // Spacing Scale
  spacing: {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    8: '8',
    10: '10',
    12: '12',
    16: '16',
    20: '20',
    24: '24',
    32: '32',
    40: '40',
    48: '48',
    56: '56',
    64: '64',
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '2',
    base: '4',
    md: '6',
    lg: '8',
    xl: '12',
    '2xl': '16',
    '3xl': '24',
    full: '9999',
  },
  
  // Border Width
  borderWidth: {
    0: '0',
    1: '1',
    2: '2',
    4: '4',
    8: '8',
  },
  
  // Font Sizes
  fontSize: {
    xs: '12',
    sm: '14',
    base: '16',
    lg: '18',
    xl: '20',
    '2xl': '24',
    '3xl': '30',
    '4xl': '36',
    '5xl': '48',
    '6xl': '60',
  },
  
  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },
  
  // Z-Index
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modal: '1040',
    popover: '1050',
    tooltip: '1060',
  },
  
  // Transitions
  transitions: {
    none: 'none',
    all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 150ms cubic-bezier(0.4, 0, 0.2, 1), fill 150ms cubic-bezier(0.4, 0, 0.2, 1), stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Animations
  animations: {
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
    fadeIn: 'fadeIn 0.5s ease-in-out',
    fadeOut: 'fadeOut 0.5s ease-in-out',
    slideIn: 'slideIn 0.3s ease-out',
    slideOut: 'slideOut 0.3s ease-in',
  },
} as const;

// Semantic color tokens
export const semanticColors = {
  // Background colors
  background: {
    primary: tokens.colors.gray[50],
    secondary: tokens.colors.gray[100],
    tertiary: tokens.colors.gray[200],
    inverse: tokens.colors.gray[900],
  },
  
  // Surface colors
  surface: {
    primary: tokens.colors.white,
    secondary: tokens.colors.gray[50],
    tertiary: tokens.colors.gray[100],
    elevated: tokens.colors.white,
  },
  
  // Text colors
  text: {
    primary: tokens.colors.gray[900],
    secondary: tokens.colors.gray[700],
    tertiary: tokens.colors.gray[500],
    inverse: tokens.colors.white,
    disabled: tokens.colors.gray[400],
  },
  
  // Border colors
  border: {
    primary: tokens.colors.gray[200],
    secondary: tokens.colors.gray[300],
    tertiary: tokens.colors.gray[400],
    focus: tokens.colors.primary[500],
    error: tokens.colors.error[500],
    success: tokens.colors.success[500],
    warning: tokens.colors.warning[500],
  },
  
  // Interactive colors
  interactive: {
    primary: tokens.colors.primary[500],
    primaryHover: tokens.colors.primary[600],
    primaryActive: tokens.colors.primary[700],
    secondary: tokens.colors.gray[500],
    secondaryHover: tokens.colors.gray[600],
    secondaryActive: tokens.colors.gray[700],
  },
} as const;

// Export types
export type ColorToken = typeof tokens.colors;
export type SemanticColorToken = typeof semanticColors;
export type SpacingToken = typeof tokens.spacing;
export type BorderRadiusToken = typeof tokens.borderRadius;
export type FontSizeToken = typeof tokens.fontSize;
export type FontWeightToken = typeof tokens.fontWeight;
export type ShadowToken = typeof tokens.shadows;
export type ZIndexToken = typeof tokens.zIndex;
export type TransitionToken = typeof tokens.transitions;
export type AnimationToken = typeof tokens.animations;

// Utility function to get token value
export function getTokenValue<T extends Record<string, any>>(
  tokenGroup: T,
  key: keyof T
): T[keyof T] {
  return tokenGroup[key];
}

// Utility function to resolve semantic color
export function resolveSemanticColor(
  colorKey: keyof SemanticColorToken,
  variant?: keyof SemanticColorToken[keyof SemanticColorToken]
): string {
  if (variant) {
    return semanticColors[colorKey][variant];
  }
  return semanticColors[colorKey] as string;
}