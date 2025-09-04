import { BoxProps, BoxVariants, BoxSizes, BoxStates } from './Box.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class BoxStyles {
  /**
   * Get box style based on props
   */
  static getStyle(props: BoxProps) {
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
   * Base box style
   */
  private static getBaseStyle() {
    return {
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
      },
      align: 'left' as const,
      valign: 'top' as const,
      bold: false,
      underline: false,
      blink: false,
      dim: false,
      inverse: false,
      invisible: false,
      transparent: false,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: BoxVariants) {
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
          bg: tokens.colors.gray[100],
          fg: tokens.colors.gray[900],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[100],
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
      
      case 'ghost':
        return {
          bg: 'transparent',
          fg: tokens.colors.gray[700],
          border: {
            type: 'line',
            fg: 'transparent',
            bg: 'transparent',
          },
        };
      
      case 'elevated':
        return {
          bg: tokens.colors.white,
          fg: tokens.colors.gray[900],
          border: {
            type: 'line',
            fg: tokens.colors.gray[200],
            bg: tokens.colors.white,
          },
          shadow: true,
        };
      
      default:
        return {
          bg: tokens.colors.gray[50],
          fg: tokens.colors.gray[900],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[50],
          },
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: BoxSizes) {
    switch (size) {
      case 'xs':
        return {
          padding: {
            left: 1,
            right: 1,
            top: 1,
            bottom: 1,
          },
          margin: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        };
      
      case 'sm':
        return {
          padding: {
            left: 2,
            right: 2,
            top: 2,
            bottom: 2,
          },
          margin: {
            left: 1,
            right: 1,
            top: 1,
            bottom: 1,
          },
        };
      
      case 'md':
        return {
          padding: {
            left: 4,
            right: 4,
            top: 4,
            bottom: 4,
          },
          margin: {
            left: 2,
            right: 2,
            top: 2,
            bottom: 2,
          },
        };
      
      case 'lg':
        return {
          padding: {
            left: 6,
            right: 6,
            top: 6,
            bottom: 6,
          },
          margin: {
            left: 4,
            right: 4,
            top: 4,
            bottom: 4,
          },
        };
      
      case 'xl':
        return {
          padding: {
            left: 8,
            right: 8,
            top: 8,
            bottom: 8,
          },
          margin: {
            left: 6,
            right: 6,
            top: 6,
            bottom: 6,
          },
        };
      
      case 'full':
        return {
          padding: {
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          },
          margin: {
            left: 8,
            right: 8,
            top: 8,
            bottom: 8,
          },
        };
      
      default:
        return {
          padding: {
            left: 4,
            right: 4,
            top: 4,
            bottom: 4,
          },
          margin: {
            left: 2,
            right: 2,
            top: 2,
            bottom: 2,
          },
        };
    }
  }

  /**
   * Get state-specific styles
   */
  private static getStateStyle(state: BoxStates) {
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
   * Get custom styles based on box props
   */
  private static getCustomStyle(props: BoxProps) {
    const customStyle: any = {};

    // Rounded box
    if (props.rounded) {
      customStyle.border = {
        ...customStyle.border,
        type: 'round',
      };
    }

    // Shadow
    if (props.shadow) {
      customStyle.shadow = tokens.shadows.md;
    }

    // Glow
    if (props.glow) {
      customStyle.border = {
        ...customStyle.border,
        fg: tokens.colors.primary[400],
      };
    }

    // Flex layout
    if (props.flex) {
      customStyle.flex = true;
      if (props.flexDirection) {
        customStyle.flexDirection = props.flexDirection;
      }
      if (props.flexWrap) {
        customStyle.flexWrap = props.flexWrap;
      }
      if (props.justifyContent) {
        customStyle.justifyContent = props.justifyContent;
      }
      if (props.alignItems) {
        customStyle.alignItems = props.alignItems;
      }
    }

    return customStyle;
  }

  /**
   * Get current background color for state changes
   */
  private static getCurrentBg(): string {
    return tokens.colors.gray[50];
  }

  /**
   * Get current foreground color for state changes
   */
  private static getCurrentFg(): string {
    return tokens.colors.gray[900];
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
   * Get box style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: BoxVariants,
    size: BoxSizes,
    state: BoxStates
  ) {
    const mockProps: BoxProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available box styles
   */
  static getAllStyles() {
    const variants: BoxVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'elevated'];
    const sizes: BoxSizes[] = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
    const states: BoxStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success'];
    
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