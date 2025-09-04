import { MenuProps, MenuVariants, MenuSizes, MenuStates } from './Menu.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class MenuStyles {
  /**
   * Get menu style based on props
   */
  static getStyle(props: MenuProps) {
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
   * Base menu style
   */
  private static getBaseStyle() {
    return {
      bg: tokens.colors.gray[800],
      fg: tokens.colors.gray[100],
      border: {
        type: 'line',
        fg: tokens.colors.gray[600],
        bg: tokens.colors.gray[800],
      },
      align: 'left' as const,
      valign: 'top' as const,
      bold: false,
      underline: false,
      selectionBg: tokens.colors.primary[600],
      selectionFg: tokens.colors.white,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: MenuVariants) {
    switch (variant) {
      case 'primary':
        return {
          bg: tokens.colors.primary[800],
          fg: tokens.colors.primary[100],
          border: {
            type: 'line',
            fg: tokens.colors.primary[600],
            bg: tokens.colors.primary[800],
          },
          selectionBg: tokens.colors.primary[600],
          selectionFg: tokens.colors.white,
        };
      
      case 'secondary':
        return {
          bg: tokens.colors.gray[700],
          fg: tokens.colors.gray[200],
          border: {
            type: 'line',
            fg: tokens.colors.gray[500],
            bg: tokens.colors.gray[700],
          },
          selectionBg: tokens.colors.gray[600],
          selectionFg: tokens.colors.white,
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[800],
          fg: tokens.colors.success[100],
          border: {
            type: 'line',
            fg: tokens.colors.success[600],
            bg: tokens.colors.success[800],
          },
          selectionBg: tokens.colors.success[600],
          selectionFg: tokens.colors.white,
        };
      
      case 'warning':
        return {
          bg: tokens.colors.warning[800],
          fg: tokens.colors.warning[100],
          border: {
            type: 'line',
            fg: tokens.colors.warning[600],
            bg: tokens.colors.warning[800],
          },
          selectionBg: tokens.colors.warning[600],
          selectionFg: tokens.colors.white,
        };
      
      case 'error':
        return {
          bg: tokens.colors.error[800],
          fg: tokens.colors.error[100],
          border: {
            type: 'line',
            fg: tokens.colors.error[600],
            bg: tokens.colors.error[800],
          },
          selectionBg: tokens.colors.error[600],
          selectionFg: tokens.colors.white,
        };
      
      case 'info':
        return {
          bg: tokens.colors.info[800],
          fg: tokens.colors.info[100],
          border: {
            type: 'line',
            fg: tokens.colors.info[600],
            bg: tokens.colors.info[800],
          },
          selectionBg: tokens.colors.info[600],
          selectionFg: tokens.colors.white,
        };
      
      case 'outline':
        return {
          bg: 'transparent',
          fg: tokens.colors.primary[300],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: 'transparent',
          },
          selectionBg: tokens.colors.primary[100],
          selectionFg: tokens.colors.primary[800],
        };
      
      case 'ghost':
        return {
          bg: 'transparent',
          fg: tokens.colors.gray[400],
          border: {
            type: 'line',
            fg: 'transparent',
            bg: 'transparent',
          },
          selectionBg: tokens.colors.gray[100],
          selectionFg: tokens.colors.gray[800],
        };
      
      case 'dropdown':
        return {
          bg: tokens.colors.white,
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.white,
          },
          selectionBg: tokens.colors.primary[100],
          selectionFg: tokens.colors.primary[800],
        };
      
      case 'context':
        return {
          bg: tokens.colors.gray[900],
          fg: tokens.colors.gray[100],
          border: {
            type: 'line',
            fg: tokens.colors.gray[600],
            bg: tokens.colors.gray[900],
          },
          selectionBg: tokens.colors.primary[600],
          selectionFg: tokens.colors.white,
        };
      
      case 'navigation':
        return {
          bg: tokens.colors.gray[800],
          fg: tokens.colors.gray[200],
          border: {
            type: 'line',
            fg: tokens.colors.gray[500],
            bg: tokens.colors.gray[800],
          },
          selectionBg: tokens.colors.primary[600],
          selectionFg: tokens.colors.white,
        };
      
      default:
        return {
          bg: tokens.colors.gray[800],
          fg: tokens.colors.gray[100],
          border: {
            type: 'line',
            fg: tokens.colors.gray[600],
            bg: tokens.colors.gray[800],
          },
          selectionBg: tokens.colors.primary[600],
          selectionFg: tokens.colors.white,
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: MenuSizes) {
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
            left: 3,
            right: 3,
            top: 3,
            bottom: 3,
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
            top: 4,
            bottom: 4,
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
      
      default:
        return {
          padding: {
            left: 3,
            right: 3,
            top: 3,
            bottom: 3,
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
  private static getStateStyle(state: MenuStates) {
    switch (state) {
      case 'hover':
        return {
          bg: this.adjustColor(this.getCurrentBg(), 5),
          fg: this.adjustColor(this.getCurrentFg(), -5),
        };
      
      case 'active':
        return {
          bg: this.adjustColor(this.getCurrentBg(), 10),
          fg: this.adjustColor(this.getCurrentFg(), -10),
        };
      
      case 'disabled':
        return {
          bg: tokens.colors.gray[700],
          fg: tokens.colors.gray[500],
          border: {
            type: 'line',
            fg: tokens.colors.gray[400],
            bg: tokens.colors.gray[700],
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
          bg: tokens.colors.error[700],
          fg: tokens.colors.error[200],
          border: {
            type: 'line',
            fg: tokens.colors.error[500],
            bg: tokens.colors.error[700],
          },
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[700],
          fg: tokens.colors.success[200],
          border: {
            type: 'line',
            fg: tokens.colors.success[500],
            bg: tokens.colors.success[700],
          },
        };
      
      case 'open':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: this.getCurrentBg(),
          },
          bold: true,
        };
      
      case 'closed':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.gray[500],
            bg: this.getCurrentBg(),
          },
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on menu props
   */
  private static getCustomStyle(props: MenuProps) {
    const customStyle: any = {};

    // Custom colors
    if (props.color) {
      customStyle.fg = props.color;
    }

    if (props.backgroundColor) {
      customStyle.bg = props.backgroundColor;
    }

    if (props.borderColor) {
      customStyle.border = {
        type: 'line',
        fg: props.borderColor,
        bg: this.getCurrentBg(),
      };
    }

    if (props.selectionColor) {
      customStyle.selectionBg = props.selectionColor;
    }

    // Menu style variants
    if (props.menuStyle === 'compact') {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 1,
        bottom: 1,
      };
    }

    if (props.menuStyle === 'detailed') {
      customStyle.padding = {
        left: 6,
        right: 6,
        top: 6,
        bottom: 6,
      };
    }

    if (props.menuStyle === 'minimal') {
      customStyle.padding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      };
      customStyle.border = {
        type: 'none',
        fg: 'transparent',
        bg: 'transparent',
      };
    }

    if (props.menuStyle === 'modern') {
      customStyle.border = {
        type: 'line',
        fg: tokens.colors.primary[400],
        bg: this.getCurrentBg(),
      };
      customStyle.bold = true;
    }

    // Display options
    if (props.compact) {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 1,
        bottom: 1,
      };
    }

    // Orientation and alignment
    if (props.orientation === 'horizontal') {
      customStyle.align = 'center';
      customStyle.valign = 'middle';
    }

    if (props.alignment === 'center') {
      customStyle.align = 'center';
    } else if (props.alignment === 'right') {
      customStyle.align = 'right';
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Interactive menu
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Selection indicator
    if (props.showSelectionIndicator) {
      customStyle.selectionBg = this.getCurrentSelectionBg();
      customStyle.selectionFg = this.getCurrentSelectionFg();
    }

    return customStyle;
  }

  /**
   * Get current background color for state changes
   */
  private static getCurrentBg(): string {
    return tokens.colors.gray[800];
  }

  /**
   * Get current foreground color for state changes
   */
  private static getCurrentFg(): string {
    return tokens.colors.gray[100];
  }

  /**
   * Get current selection background color
   */
  private static getCurrentSelectionBg(): string {
    return tokens.colors.primary[600];
  }

  /**
   * Get current selection foreground color
   */
  private static getCurrentSelectionFg(): string {
    return tokens.colors.white;
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
   * Get menu style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: MenuVariants,
    size: MenuSizes,
    state: MenuStates
  ) {
    const mockProps: MenuProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available menu styles
   */
  static getAllStyles() {
    const variants: MenuVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'dropdown', 'context', 'navigation'];
    const sizes: MenuSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: MenuStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'open', 'closed'];
    
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