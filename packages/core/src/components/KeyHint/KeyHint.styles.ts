import { KeyHintProps, KeyHintVariants, KeyHintSizes, KeyHintStates } from './KeyHint.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class KeyHintStyles {
  /**
   * Get key hint style based on props
   */
  static getStyle(props: KeyHintProps) {
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
   * Base key hint style
   */
  private static getBaseStyle() {
    return {
      bg: 'transparent',
      fg: tokens.colors.gray[700],
      border: {
        type: 'none',
        fg: 'transparent',
        bg: 'transparent',
      },
      align: 'center' as const,
      valign: 'middle' as const,
      bold: false,
      underline: false,
      monospace: false,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: KeyHintVariants) {
    switch (variant) {
      case 'primary':
        return {
          fg: tokens.colors.primary[600],
        };
      
      case 'secondary':
        return {
          fg: tokens.colors.gray[600],
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[600],
        };
      
      case 'warning':
        return {
          fg: tokens.colors.warning[600],
        };
      
      case 'error':
        return {
          fg: tokens.colors.error[600],
        };
      
      case 'info':
        return {
          fg: tokens.colors.info[600],
        };
      
      case 'outline':
        return {
          fg: tokens.colors.primary[700],
          border: {
            type: 'line',
            fg: tokens.colors.primary[300],
            bg: 'transparent',
          },
        };
      
      case 'ghost':
        return {
          fg: tokens.colors.gray[500],
        };
      
      case 'highlighted':
        return {
          fg: tokens.colors.primary[600],
          bold: true,
        };
      
      default:
        return {
          fg: tokens.colors.gray[700],
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: KeyHintSizes) {
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
  private static getStateStyle(state: KeyHintStates) {
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
          fg: tokens.colors.gray[400],
          dim: true,
        };
      
      case 'focus':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: 'transparent',
          },
          bold: true,
        };
      
      case 'error':
        return {
          fg: tokens.colors.error[600],
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[600],
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on key hint props
   */
  private static getCustomStyle(props: KeyHintProps) {
    const customStyle: any = {};

    // Custom colors
    if (props.color) {
      customStyle.fg = props.color;
    }

    if (props.keyColor) {
      customStyle.keyColor = props.keyColor;
    }

    if (props.descriptionColor) {
      customStyle.descriptionColor = props.descriptionColor;
    }

    // Key style variants
    if (props.keyStyle === 'brackets') {
      customStyle.brackets = true;
    }

    if (props.keyStyle === 'parentheses') {
      customStyle.parentheses = true;
    }

    if (props.keyStyle === 'chevrons') {
      customStyle.chevrons = true;
    }

    if (props.keyStyle === 'highlight') {
      customStyle.bold = true;
      customStyle.bg = tokens.colors.primary[100];
    }

    if (props.keyStyle === 'minimal') {
      customStyle.bold = false;
      customStyle.underline = false;
    }

    // Display options
    if (props.compact) {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 0,
        bottom: 0,
      };
    }

    if (props.monospace) {
      customStyle.monospace = true;
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Interactive key hint
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Tooltip key hint
    if (props.tooltip) {
      customStyle.bg = tokens.colors.gray[800];
      customStyle.fg = tokens.colors.white;
      customStyle.border = {
        type: 'line',
        fg: tokens.colors.gray[600],
        bg: tokens.colors.gray[800],
      };
    }

    return customStyle;
  }

  /**
   * Get current foreground color for state changes
   */
  private static getCurrentFg(): string {
    return tokens.colors.gray[700];
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
   * Get key hint style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: KeyHintVariants,
    size: KeyHintSizes,
    state: KeyHintStates
  ) {
    const mockProps: KeyHintProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available key hint styles
   */
  static getAllStyles() {
    const variants: KeyHintVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'highlighted'];
    const sizes: KeyHintSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: KeyHintStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success'];
    
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