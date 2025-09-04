import { CollapsibleProps, CollapsibleVariants, CollapsibleSizes, CollapsibleStates } from './Collapsible.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class CollapsibleStyles {
  /**
   * Get collapsible style based on props
   */
  static getStyle(props: CollapsibleProps) {
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
  static getHeaderStyle(props: CollapsibleProps) {
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
      cursor: 'pointer',
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

    // Apply header style variants
    if (props.headerStyle === 'minimal') {
      baseHeaderStyle.border.type = 'none';
      baseHeaderStyle.bg = 'transparent';
      baseHeaderStyle.border.bg = 'transparent';
    } else if (props.headerStyle === 'prominent') {
      baseHeaderStyle.bold = true;
      baseHeaderStyle.border.type = 'double';
    } else if (props.headerStyle === 'subtle') {
      baseHeaderStyle.bg = tokens.colors.gray[50];
      baseHeaderStyle.fg = tokens.colors.gray[700];
      baseHeaderStyle.border.fg = tokens.colors.gray[200];
      baseHeaderStyle.border.bg = tokens.colors.gray[50];
    }

    return baseHeaderStyle;
  }

  /**
   * Get content style
   */
  static getContentStyle(props: CollapsibleProps) {
    const variant = props.variant || 'default';
    const size = props.size || 'md';
    
    const baseContentStyle = {
      bg: tokens.colors.white,
      fg: tokens.colors.gray[900],
      padding: {
        left: 4,
        right: 4,
        top: 3,
        bottom: 3,
      },
      align: (props.contentAlign || 'left') as 'left' | 'center' | 'right',
      border: {
        type: 'line',
        fg: tokens.colors.gray[200],
        bg: tokens.colors.white,
      },
    };

    // Apply variant-specific content styles
    switch (variant) {
      case 'primary':
        baseContentStyle.bg = tokens.colors.primary[50];
        baseContentStyle.border.fg = tokens.colors.primary[200];
        baseContentStyle.border.bg = tokens.colors.primary[50];
        break;
      case 'success':
        baseContentStyle.bg = tokens.colors.success[50];
        baseContentStyle.border.fg = tokens.colors.success[200];
        baseContentStyle.border.bg = tokens.colors.success[50];
        break;
      case 'warning':
        baseContentStyle.bg = tokens.colors.warning[50];
        baseContentStyle.border.fg = tokens.colors.warning[200];
        baseContentStyle.border.bg = tokens.colors.warning[50];
        break;
      case 'error':
        baseContentStyle.bg = tokens.colors.error[50];
        baseContentStyle.border.fg = tokens.colors.error[200];
        baseContentStyle.border.bg = tokens.colors.error[50];
        break;
    }

    return baseContentStyle;
  }

  /**
   * Base collapsible style
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
  private static getVariantStyle(variant: CollapsibleVariants) {
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
  private static getSizeStyle(size: CollapsibleSizes) {
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
  private static getStateStyle(state: CollapsibleStates) {
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
      
      case 'expanded':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: this.getCurrentBg(),
          },
        };
      
      case 'collapsed':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.gray[400],
            bg: this.getCurrentBg(),
          },
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
   * Get custom styles based on collapsible props
   */
  private static getCustomStyle(props: CollapsibleProps) {
    const customStyle: any = {};

    // Collapsible style variants
    if (props.collapsibleStyle === 'outline') {
      customStyle.border = {
        type: 'line',
        fg: tokens.colors.primary[400],
        bg: 'transparent',
      };
    }

    if (props.collapsibleStyle === 'ghost') {
      customStyle.border = {
        type: 'line',
        fg: 'transparent',
        bg: 'transparent',
      };
    }

    if (props.collapsibleStyle === 'elevated') {
      customStyle.shadow = tokens.shadows.lg;
    }

    if (props.collapsibleStyle === 'bordered') {
      customStyle.border = {
        type: 'double',
        fg: tokens.colors.gray[400],
        bg: this.getCurrentBg(),
      };
    }

    // Animated
    if (props.animated) {
      customStyle.transition = tokens.transitions.default;
    }

    // Clickable
    if (props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Header height
    if (props.headerHeight) {
      customStyle.headerHeight = props.headerHeight;
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
   * Get collapsible style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: CollapsibleVariants,
    size: CollapsibleSizes,
    state: CollapsibleStates
  ) {
    const mockProps: CollapsibleProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available collapsible styles
   */
  static getAllStyles() {
    const variants: CollapsibleVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'elevated'];
    const sizes: CollapsibleSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: CollapsibleStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'expanded', 'collapsed', 'error', 'success'];
    
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