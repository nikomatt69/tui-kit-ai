import { CardProps, CardVariants, CardSizes, CardStates } from './Card.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class CardStyles {
  /**
   * Get card style based on props
   */
  static getStyle(props: CardProps) {
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
   * Get header style
   */
  static getHeaderStyle(props: CardProps) {
    const variant = props.variant || 'default';
    const size = props.size || 'md';
    
    const baseHeaderStyle = {
      bg: tokens.colors.gray[100],
      fg: tokens.colors.gray[900],
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
        bg: tokens.colors.gray[100],
      },
      padding: {
        left: 4,
        right: 4,
        top: 2,
        bottom: 2,
      },
      align: (props.headerAlign || 'left') as 'left' | 'center' | 'right',
      bold: true,
    };

    // Apply variant-specific header styles
    switch (variant) {
      case 'primary':
        baseHeaderStyle.bg = tokens.colors.primary[100];
        baseHeaderStyle.fg = tokens.colors.primary[900];
        baseHeaderStyle.border.fg = tokens.colors.primary[300];
        baseHeaderStyle.border.bg = tokens.colors.primary[100];
        break;
      case 'success':
        baseHeaderStyle.bg = tokens.colors.success[100];
        baseHeaderStyle.fg = tokens.colors.success[900];
        baseHeaderStyle.border.fg = tokens.colors.success[300];
        baseHeaderStyle.border.bg = tokens.colors.success[100];
        break;
      case 'warning':
        baseHeaderStyle.bg = tokens.colors.warning[100];
        baseHeaderStyle.fg = tokens.colors.warning[900];
        baseHeaderStyle.border.fg = tokens.colors.warning[300];
        baseHeaderStyle.border.bg = tokens.colors.warning[100];
        break;
      case 'error':
        baseHeaderStyle.bg = tokens.colors.error[100];
        baseHeaderStyle.fg = tokens.colors.error[900];
        baseHeaderStyle.border.fg = tokens.colors.error[300];
        baseHeaderStyle.border.bg = tokens.colors.error[100];
        break;
    }

    return baseHeaderStyle;
  }

  /**
   * Get body style
   */
  static getBodyStyle(props: CardProps) {
    const variant = props.variant || 'default';
    const size = props.size || 'md';
    
    const baseBodyStyle = {
      bg: tokens.colors.white,
      fg: tokens.colors.gray[900],
      padding: {
        left: 4,
        right: 4,
        top: 3,
        bottom: 3,
      },
      align: (props.contentAlign || 'left') as 'left' | 'center' | 'right',
    };

    // Apply variant-specific body styles
    switch (variant) {
      case 'primary':
        baseBodyStyle.bg = tokens.colors.primary[50];
        break;
      case 'success':
        baseBodyStyle.bg = tokens.colors.success[50];
        break;
      case 'warning':
        baseBodyStyle.bg = tokens.colors.warning[50];
        break;
      case 'error':
        baseBodyStyle.bg = tokens.colors.error[50];
        break;
    }

    return baseBodyStyle;
  }

  /**
   * Get footer style
   */
  static getFooterStyle(props: CardProps) {
    const variant = props.variant || 'default';
    const size = props.size || 'md';
    
    const baseFooterStyle = {
      bg: tokens.colors.gray[50],
      fg: tokens.colors.gray[700],
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
        bg: tokens.colors.gray[50],
      },
      padding: {
        left: 4,
        right: 4,
        top: 2,
        bottom: 2,
      },
      align: (props.footerAlign || 'left') as 'left' | 'center' | 'right',
      bold: false,
    };

    // Apply variant-specific footer styles
    switch (variant) {
      case 'primary':
        baseFooterStyle.bg = tokens.colors.primary[50];
        baseFooterStyle.fg = tokens.colors.primary[700];
        baseFooterStyle.border.fg = tokens.colors.primary[300];
        baseFooterStyle.border.bg = tokens.colors.primary[50];
        break;
      case 'success':
        baseFooterStyle.bg = tokens.colors.success[50];
        baseFooterStyle.fg = tokens.colors.success[700];
        baseFooterStyle.border.fg = tokens.colors.success[300];
        baseFooterStyle.border.bg = tokens.colors.success[50];
        break;
      case 'warning':
        baseFooterStyle.bg = tokens.colors.warning[50];
        baseFooterStyle.fg = tokens.colors.warning[700];
        baseFooterStyle.border.fg = tokens.colors.warning[300];
        baseFooterStyle.border.bg = tokens.colors.warning[50];
        break;
      case 'error':
        baseFooterStyle.bg = tokens.colors.error[50];
        baseFooterStyle.fg = tokens.colors.error[700];
        baseFooterStyle.border.fg = tokens.colors.error[300];
        baseFooterStyle.border.bg = tokens.colors.error[50];
        break;
    }

    return baseFooterStyle;
  }

  /**
   * Base card style
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
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: CardVariants) {
    switch (variant) {
      case 'primary':
        return {
          bg: tokens.colors.primary[50],
          fg: tokens.colors.primary[900],
          border: {
            type: 'line',
            fg: tokens.colors.primary[300],
            bg: tokens.colors.primary[50],
          },
        };
      
      case 'secondary':
        return {
          bg: tokens.colors.gray[50],
          fg: tokens.colors.gray[900],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[50],
          },
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[50],
          fg: tokens.colors.success[900],
          border: {
            type: 'line',
            fg: tokens.colors.success[300],
            bg: tokens.colors.success[50],
          },
        };
      
      case 'warning':
        return {
          bg: tokens.colors.warning[50],
          fg: tokens.colors.warning[900],
          border: {
            type: 'line',
            fg: tokens.colors.warning[300],
            bg: tokens.colors.warning[50],
          },
        };
      
      case 'error':
        return {
          bg: tokens.colors.error[50],
          fg: tokens.colors.error[900],
          border: {
            type: 'line',
            fg: tokens.colors.error[300],
            bg: tokens.colors.error[50],
          },
        };
      
      case 'info':
        return {
          bg: tokens.colors.info[50],
          fg: tokens.colors.info[900],
          border: {
            type: 'line',
            fg: tokens.colors.info[300],
            bg: tokens.colors.info[50],
          },
        };
      
      case 'outline':
        return {
          bg: 'transparent',
          fg: tokens.colors.primary[700],
          border: {
            type: 'line',
            fg: tokens.colors.primary[300],
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
          bg: tokens.colors.white,
          fg: tokens.colors.gray[900],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.white,
          },
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: CardSizes) {
    switch (size) {
      case 'xs':
        return {
          padding: {
            left: 2,
            right: 2,
            top: 2,
            bottom: 2,
          },
        };
      
      case 'sm':
        return {
          padding: {
            left: 3,
            right: 3,
            top: 3,
            bottom: 3,
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
        };
      
      case 'lg':
        return {
          padding: {
            left: 6,
            right: 6,
            top: 6,
            bottom: 6,
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
        };
      
      case 'full':
        return {
          padding: {
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
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
        };
    }
  }

  /**
   * Get state-specific styles
   */
  private static getStateStyle(state: CardStates) {
    switch (state) {
      case 'hover':
        return {
          bg: this.adjustColor(this.getCurrentBg(), -5),
          fg: this.adjustColor(this.getCurrentFg(), 5),
        };
      
      case 'active':
        return {
          bg: this.adjustColor(this.getCurrentBg(), -10),
          fg: this.adjustColor(this.getCurrentFg(), 10),
        };
      
      case 'disabled':
        return {
          bg: tokens.colors.gray[100],
          fg: tokens.colors.gray[400],
          border: {
            type: 'line',
            fg: tokens.colors.gray[200],
            bg: tokens.colors.gray[100],
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
          fg: tokens.colors.error[800],
          border: {
            type: 'line',
            fg: tokens.colors.error[400],
            bg: tokens.colors.error[100],
          },
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[100],
          fg: tokens.colors.success[800],
          border: {
            type: 'line',
            fg: tokens.colors.success[400],
            bg: tokens.colors.success[100],
          },
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on card props
   */
  private static getCustomStyle(props: CardProps) {
    const customStyle: any = {};

    // Elevated card
    if (props.elevated) {
      customStyle.shadow = tokens.shadows.lg;
    }

    // Rounded card
    if (props.rounded) {
      customStyle.borderRadius = tokens.borderRadius.lg;
    }

    // Shadow
    if (props.shadow) {
      customStyle.shadow = tokens.shadows.md;
    }

    // Bordered
    if (props.bordered === false) {
      customStyle.border = {
        type: 'none',
        fg: 'transparent',
        bg: 'transparent',
      };
    }

    // Clickable
    if (props.clickable) {
      customStyle.cursor = 'pointer';
    }

    return customStyle;
  }

  /**
   * Get current background color for state changes
   */
  private static getCurrentBg(): string {
    return tokens.colors.white;
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
   * Get card style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: CardVariants,
    size: CardSizes,
    state: CardStates
  ) {
    const mockProps: CardProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available card styles
   */
  static getAllStyles() {
    const variants: CardVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'elevated'];
    const sizes: CardSizes[] = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
    const states: CardStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success'];
    
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