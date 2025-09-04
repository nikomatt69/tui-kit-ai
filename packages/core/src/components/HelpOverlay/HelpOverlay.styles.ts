import { HelpOverlayProps, HelpOverlayVariants, HelpOverlaySizes, HelpOverlayStates } from './HelpOverlay.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class HelpOverlayStyles {
  /**
   * Get help overlay style based on props
   */
  static getStyle(props: HelpOverlayProps) {
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
   * Base help overlay style
   */
  private static getBaseStyle() {
    return {
      bg: tokens.colors.white,
      fg: tokens.colors.gray[900],
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
        bg: tokens.colors.white,
      },
      align: 'center' as const,
      valign: 'middle' as const,
      bold: false,
      underline: false,
      shadow: true,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: HelpOverlayVariants) {
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
      
      case 'modal':
        return {
          bg: tokens.colors.white,
          fg: tokens.colors.gray[900],
          border: {
            type: 'double',
            fg: tokens.colors.primary[400],
            bg: tokens.colors.white,
          },
          shadow: tokens.shadows.xl,
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
  private static getSizeStyle(size: HelpOverlaySizes) {
    switch (size) {
      case 'xs':
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
      
      case 'sm':
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
      
      case 'md':
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
      
      case 'lg':
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
      
      case 'xl':
        return {
          padding: {
            left: 8,
            right: 8,
            top: 6,
            bottom: 6,
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
            top: 8,
            bottom: 8,
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
    }
  }

  /**
   * Get state-specific styles
   */
  private static getStateStyle(state: HelpOverlayStates) {
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
      
      case 'visible':
        return {
          shadow: tokens.shadows.lg,
        };
      
      case 'hidden':
        return {
          shadow: 'none',
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on help overlay props
   */
  private static getCustomStyle(props: HelpOverlayProps) {
    const customStyle: any = {};

    // Custom colors
    if (props.overlayColor) {
      customStyle.bg = props.overlayColor;
    }

    if (props.textColor) {
      customStyle.fg = props.textColor;
    }

    if (props.borderColor) {
      customStyle.border = {
        type: 'line',
        fg: props.borderColor,
        bg: this.getCurrentBg(),
      };
    }

    // Help style variants
    if (props.helpStyle === 'outline') {
      customStyle.border = {
        type: 'line',
        fg: tokens.colors.primary[400],
        bg: 'transparent',
      };
    }

    if (props.helpStyle === 'modal') {
      customStyle.border = {
        type: 'double',
        fg: tokens.colors.primary[400],
        bg: this.getCurrentBg(),
      };
      customStyle.shadow = tokens.shadows.xl;
    }

    if (props.helpStyle === 'ghost') {
      customStyle.border = {
        type: 'line',
        fg: 'transparent',
        bg: 'transparent',
      };
    }

    if (props.helpStyle === 'elevated') {
      customStyle.shadow = tokens.shadows.lg;
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Interactive help overlay
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Draggable help overlay
    if (props.draggable) {
      customStyle.bold = true;
    }

    // Resizable help overlay
    if (props.resizable) {
      customStyle.border = {
        type: 'double',
        fg: tokens.colors.primary[400],
        bg: this.getCurrentBg(),
      };
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
   * Get help overlay style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: HelpOverlayVariants,
    size: HelpOverlaySizes,
    state: HelpOverlayStates
  ) {
    const mockProps: HelpOverlayProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available help overlay styles
   */
  static getAllStyles() {
    const variants: HelpOverlayVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'modal'];
    const sizes: HelpOverlaySizes[] = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
    const states: HelpOverlayStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'visible', 'hidden'];
    
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