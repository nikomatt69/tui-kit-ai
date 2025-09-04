import { BadgeProps, BadgeVariants, BadgeSizes, BadgeStates } from './Badge.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class BadgeStyles {
  /**
   * Get badge style based on props
   */
  static getStyle(props: BadgeProps) {
    const variant = props.variant || 'default';
    const size = props.size || 'md';
    const state = props.state || 'default';
    
    const baseStyle = this.getBaseStyle();
    const variantStyle = this.getVariantStyle(variant);
    const sizeStyle = this.getSizeStyle(size);
    const stateStyle = this.getStateStyle(state);
    
    return {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      ...stateStyle,
      ...this.getCustomStyle(props),
    };
  }

  /**
   * Base badge style
   */
  private static getBaseStyle() {
    return {
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
      },
      align: 'center' as const,
      bold: false,
      underline: false,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: BadgeVariants) {
    switch (variant) {
      case 'primary':
        return {
          bg: tokens.colors.primary[500],
          fg: 'white',
          border: {
            type: 'line',
            fg: tokens.colors.primary[600],
            bg: tokens.colors.primary[500],
          },
        };
      
      case 'secondary':
        return {
          bg: tokens.colors.gray[200],
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[200],
          },
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[500],
          fg: 'white',
          border: {
            type: 'line',
            fg: tokens.colors.success[600],
            bg: tokens.colors.success[500],
          },
        };
      
      case 'warning':
        return {
          bg: tokens.colors.warning[500],
          fg: 'white',
          border: {
            type: 'line',
            fg: tokens.colors.warning[600],
            bg: tokens.colors.warning[500],
          },
        };
      
      case 'error':
        return {
          bg: tokens.colors.error[500],
          fg: 'white',
          border: {
            type: 'line',
            fg: tokens.colors.error[600],
            bg: tokens.colors.error[500],
          },
        };
      
      case 'info':
        return {
          bg: tokens.colors.info[500],
          fg: 'white',
          border: {
            type: 'line',
            fg: tokens.colors.info[600],
            bg: tokens.colors.info[500],
          },
        };
      
      case 'outline':
        return {
          bg: 'transparent',
          fg: tokens.colors.primary[500],
          border: {
            type: 'line',
            fg: tokens.colors.primary[500],
            bg: 'transparent',
          },
        };
      
      default:
        return {
          bg: tokens.colors.gray[100],
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[100],
          },
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: BadgeSizes) {
    switch (size) {
      case 'xs':
        return {
          padding: {
            left: 1,
            right: 1,
            top: 0,
            bottom: 0,
          },
        };
      
      case 'sm':
        return {
          padding: {
            left: 2,
            right: 2,
            top: 0,
            bottom: 0,
          },
        };
      
      case 'md':
        return {
          padding: {
            left: 2,
            right: 2,
            top: 0,
            bottom: 0,
          },
        };
      
      case 'lg':
        return {
          padding: {
            left: 3,
            right: 3,
            top: 1,
            bottom: 1,
          },
        };
      
      case 'xl':
        return {
          padding: {
            left: 4,
            right: 4,
            top: 1,
            bottom: 1,
          },
        };
      
      default:
        return {
          padding: {
            left: 2,
            right: 2,
            top: 0,
            bottom: 0,
          },
        };
    }
  }

  /**
   * Get state-specific styles
   */
  private static getStateStyle(state: BadgeStates) {
    switch (state) {
      case 'hover':
        return {
          bg: this.adjustColor(this.getCurrentBg(), -10),
          fg: this.adjustColor(this.getCurrentFg(), 10),
        };
      
      case 'active':
        return {
          bg: this.adjustColor(this.getCurrentBg(), -20),
          fg: this.adjustColor(this.getCurrentFg(), 20),
        };
      
      case 'disabled':
        return {
          bg: tokens.colors.gray[200],
          fg: tokens.colors.gray[400],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[200],
          },
          dim: true,
        };
      
      case 'focus':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: this.getCurrentBg(),
          },
          bold: true,
        };
      
      case 'error':
        return {
          bg: tokens.colors.error[100],
          fg: tokens.colors.error[700],
          border: {
            type: 'line',
            fg: tokens.colors.error[500],
            bg: tokens.colors.error[100],
          },
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[100],
          fg: tokens.colors.success[700],
          border: {
            type: 'line',
            fg: tokens.colors.success[500],
            bg: tokens.colors.success[100],
          },
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on badge props
   */
  private static getCustomStyle(props: BadgeProps) {
    const customStyle: any = {};

    // Rounded badge
    if (props.rounded) {
      customStyle.border = {
        ...customStyle.border,
        type: 'round',
      };
    }

    // Custom color
    if (props.color) {
      customStyle.bg = props.color;
      customStyle.fg = 'white';
    }

    return customStyle;
  }

  /**
   * Get current background color for state changes
   */
  private static getCurrentBg(): string {
    return tokens.colors.gray[100];
  }

  /**
   * Get current foreground color for state changes
   */
  private static getCurrentFg(): string {
    return tokens.colors.gray[800];
  }

  /**
   * Adjust color brightness (helper function)
   */
  private static adjustColor(color: string, amount: number): string {
    if (color.includes('#')) {
      return color;
    }
    return color;
  }

  /**
   * Get badge style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: BadgeVariants,
    size: BadgeSizes,
    state: BadgeStates
  ) {
    const mockProps: BadgeProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available badge styles
   */
  static getAllStyles() {
    const variants: BadgeVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline'];
    const sizes: BadgeSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: BadgeStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success'];
    
    const allStyles: Record<string, any> = {};
    
    variants.forEach(variant => {
      sizes.forEach(size => {
        states.forEach(state => {
          const key = `${variant}-${size}-${state}`;
          allStyles[key] = this.getStyleForCombination(variant, size, state);
        });
      });
    });
    
    return allStyles;
  }
}