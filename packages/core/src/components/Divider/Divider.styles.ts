import { DividerProps, DividerVariants, DividerSizes, DividerStates } from './Divider.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class DividerStyles {
  /**
   * Get divider style based on props
   */
  static getStyle(props: DividerProps) {
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
   * Base divider style
   */
  private static getBaseStyle() {
    return {
      bg: 'transparent',
      fg: tokens.colors.gray[400],
      border: {
        type: 'none',
        fg: 'transparent',
        bg: 'transparent',
      },
      align: 'center' as const,
      valign: 'middle' as const,
      bold: false,
      underline: false,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: DividerVariants) {
    switch (variant) {
      case 'primary':
        return {
          fg: tokens.colors.primary[500],
        };
      
      case 'secondary':
        return {
          fg: tokens.colors.gray[500],
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[500],
        };
      
      case 'warning':
        return {
          fg: tokens.colors.warning[500],
        };
      
      case 'error':
        return {
          fg: tokens.colors.error[500],
        };
      
      case 'info':
        return {
          fg: tokens.colors.info[500],
        };
      
      case 'outline':
        return {
          fg: tokens.colors.primary[400],
          border: {
            type: 'line',
            fg: tokens.colors.primary[300],
            bg: 'transparent',
          },
        };
      
      case 'ghost':
        return {
          fg: tokens.colors.gray[300],
        };
      
      case 'subtle':
        return {
          fg: tokens.colors.gray[200],
        };
      
      default:
        return {
          fg: tokens.colors.gray[400],
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: DividerSizes) {
    switch (size) {
      case 'xs':
        return {
          padding: {
            left: 1,
            right: 1,
            top: 0,
            bottom: 0,
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
            top: 1,
            bottom: 1,
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
            left: 3,
            right: 3,
            top: 2,
            bottom: 2,
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
            left: 4,
            right: 4,
            top: 3,
            bottom: 3,
          },
          margin: {
            left: 3,
            right: 3,
            top: 3,
            bottom: 3,
          },
        };
      
      case 'xl':
        return {
          padding: {
            left: 6,
            right: 6,
            top: 4,
            bottom: 4,
          },
          margin: {
            left: 4,
            right: 4,
            top: 4,
            bottom: 4,
          },
        };
      
      default:
        return {
          padding: {
            left: 3,
            right: 3,
            top: 2,
            bottom: 2,
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
  private static getStateStyle(state: DividerStates) {
    switch (state) {
      case 'hover':
        return {
          fg: this.adjustColor(this.getCurrentFg(), 10),
          bold: true,
        };
      
      case 'active':
        return {
          fg: this.adjustColor(this.getCurrentFg(), 20),
          bold: true,
        };
      
      case 'disabled':
        return {
          fg: tokens.colors.gray[300],
          dim: true,
        };
      
      case 'focus':
        return {
          fg: this.getCurrentFg(),
          bold: true,
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: 'transparent',
          },
        };
      
      case 'error':
        return {
          fg: tokens.colors.error[500],
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[500],
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on divider props
   */
  private static getCustomStyle(props: DividerProps) {
    const customStyle: any = {};

    // Custom color
    if (props.color) {
      customStyle.fg = props.color;
    }

    // Custom spacing
    if (props.spacing) {
      customStyle.margin = {
        left: props.spacing,
        right: props.spacing,
        top: props.spacing,
        bottom: props.spacing,
      };
    }

    // Custom margin
    if (props.margin) {
      customStyle.margin = {
        left: props.margin,
        right: props.margin,
        top: props.margin,
        bottom: props.margin,
      };
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Clickable divider
    if (props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Interactive divider
    if (props.interactive) {
      customStyle.bold = true;
    }

    return customStyle;
  }

  /**
   * Get current foreground color for state changes
   */
  private static getCurrentFg(): string {
    return tokens.colors.gray[400];
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
   * Get divider style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: DividerVariants,
    size: DividerSizes,
    state: DividerStates
  ) {
    const mockProps: DividerProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available divider styles
   */
  static getAllStyles() {
    const variants: DividerVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'subtle'];
    const sizes: DividerSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: DividerStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success'];
    
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