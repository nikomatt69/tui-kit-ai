import { TextProps, TextVariants, TextSizes, TextStates, TextWeight } from './Text.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class TextStyles {
  /**
   * Get text style based on props
   */
  static getStyle(props: TextProps) {
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
   * Base text style
   */
  private static getBaseStyle() {
    return {
      bg: 'transparent',
      fg: tokens.colors.gray[800],
      border: {
        type: 'none',
        fg: 'transparent',
        bg: 'transparent',
      },
      align: 'left' as const,
      valign: 'top' as const,
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      weight: 'normal' as TextWeight,
      fillColor: tokens.colors.primary[500],
      emptyColor: tokens.colors.gray[300],
      striped: false,
      animated: false,
      gradient: false,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: TextVariants) {
    switch (variant) {
      case 'primary':
        return {
          fg: tokens.colors.primary[700],
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
        };
      
      case 'secondary':
        return {
          fg: tokens.colors.gray[600],
          fillColor: tokens.colors.gray[500],
          emptyColor: tokens.colors.gray[200],
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[700],
          fillColor: tokens.colors.success[500],
          emptyColor: tokens.colors.success[200],
        };
      
      case 'warning':
        return {
          fg: tokens.colors.warning[700],
          fillColor: tokens.colors.warning[500],
          emptyColor: tokens.colors.warning[200],
        };
      
      case 'error':
        return {
          fg: tokens.colors.error[700],
          fillColor: tokens.colors.error[500],
          emptyColor: tokens.colors.error[200],
        };
      
      case 'info':
        return {
          fg: tokens.colors.info[700],
          fillColor: tokens.colors.info[500],
          emptyColor: tokens.colors.info[200],
        };
      
      case 'outline':
        return {
          fg: tokens.colors.primary[700],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: 'transparent',
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[100],
        };
      
      case 'ghost':
        return {
          fg: tokens.colors.gray[500],
          fillColor: tokens.colors.gray[400],
          emptyColor: tokens.colors.gray[100],
        };
      
      case 'striped':
        return {
          fg: tokens.colors.primary[700],
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          striped: true,
        };
      
      case 'animated':
        return {
          fg: tokens.colors.primary[700],
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          animated: true,
        };
      
      case 'gradient':
        return {
          fg: tokens.colors.primary[700],
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          gradient: true,
        };
      
      default:
        return {
          fg: tokens.colors.gray[800],
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.gray[300],
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: TextSizes) {
    switch (size) {
      case 'xs':
        return {
          padding: {
            left: 0,
            right: 0,
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
      
      case 'md':
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
      
      case 'lg':
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
      
      case 'xl':
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
      
      default:
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
    }
  }

  /**
   * Get state-specific styles
   */
  private static getStateStyle(state: TextStates) {
    switch (state) {
      case 'hover':
        return {
          fg: this.adjustColor(this.getCurrentFg(), -10),
        };
      
      case 'active':
        return {
          fg: this.adjustColor(this.getCurrentFg(), -20),
        };
      
      case 'disabled':
        return {
          fg: tokens.colors.gray[400],
          dim: true,
        };
      
      case 'focus':
        return {
          bold: true,
        };
      
      case 'error':
        return {
          fg: tokens.colors.error[600],
          fillColor: tokens.colors.error[600],
          emptyColor: tokens.colors.error[200],
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[600],
          fillColor: tokens.colors.success[600],
          emptyColor: tokens.colors.success[200],
        };
      
      case 'loading':
        return {
          fg: tokens.colors.primary[600],
          fillColor: tokens.colors.primary[600],
          emptyColor: tokens.colors.primary[200],
          animated: true,
        };
      
      case 'complete':
        return {
          fg: tokens.colors.success[600],
          fillColor: tokens.colors.success[600],
          emptyColor: tokens.colors.success[200],
        };
      
      case 'indeterminate':
        return {
          fg: tokens.colors.primary[600],
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          animated: true,
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on text props
   */
  private static getCustomStyle(props: TextProps) {
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

    if (props.fillColor) {
      customStyle.fillColor = props.fillColor;
    }

    if (props.emptyColor) {
      customStyle.emptyColor = props.emptyColor;
    }

    // Text style variants
    if (props.textStyle === 'compact') {
      customStyle.padding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      };
    }

    if (props.textStyle === 'detailed') {
      customStyle.padding = {
        left: 3,
        right: 3,
        top: 2,
        bottom: 2,
      };
    }

    if (props.textStyle === 'minimal') {
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

    if (props.textStyle === 'modern') {
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
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      };
    }

    if (props.elevated) {
      customStyle.shadow = true;
      customStyle.zIndex = 10;
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Text dimensions
    if (props.width) {
      customStyle.width = props.width;
    }

    if (props.height) {
      customStyle.height = props.height;
    }

    if (props.minWidth) {
      customStyle.minWidth = props.minWidth;
    }

    if (props.maxWidth) {
      customStyle.maxWidth = props.maxWidth;
    }

    if (props.minHeight) {
      customStyle.minHeight = props.minHeight;
    }

    if (props.maxHeight) {
      customStyle.maxHeight = props.maxHeight;
    }

    // Text formatting
    if (props.bold) {
      customStyle.bold = true;
    }

    if (props.italic) {
      customStyle.italic = true;
    }

    if (props.underline) {
      customStyle.underline = true;
    }

    if (props.strikethrough) {
      customStyle.strikethrough = true;
    }

    if (props.weight) {
      customStyle.weight = props.weight;
      // Map weight to bold for blessed compatibility
      if (props.weight === 'bold' || props.weight === 'semibold' || props.weight === 'extrabold') {
        customStyle.bold = true;
      }
    }

    // Interactive text
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    return customStyle;
  }

  /**
   * Get current background color for state changes
   */
  private static getCurrentBg(): string {
    return 'transparent';
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
   * Get text style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: TextVariants,
    size: TextSizes,
    state: TextStates
  ) {
    const mockProps: TextProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available text styles
   */
  static getAllStyles() {
    const variants: TextVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'striped', 'animated', 'gradient'];
    const sizes: TextSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: TextStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'loading', 'complete', 'indeterminate'];
    
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