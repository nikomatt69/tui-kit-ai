import { ParagraphProps, ParagraphVariants, ParagraphSizes, ParagraphStates } from './Paragraph.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class ParagraphStyles {
  /**
   * Get paragraph style based on props
   */
  static getStyle(props: ParagraphProps) {
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
   * Base paragraph style
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
      underline: false,
      italic: false,
      monospace: false,
      weight: 'normal',
      truncate: false,
      ellipsis: false,
      wrap: true,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: ParagraphVariants) {
    switch (variant) {
      case 'primary':
        return {
          fg: tokens.colors.primary[700],
          bold: false,
        };
      
      case 'secondary':
        return {
          fg: tokens.colors.gray[600],
          bold: false,
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[700],
          bold: false,
        };
      
      case 'warning':
        return {
          fg: tokens.colors.warning[700],
          bold: false,
        };
      
      case 'error':
        return {
          fg: tokens.colors.error[700],
          bold: false,
        };
      
      case 'info':
        return {
          fg: tokens.colors.info[700],
          bold: false,
        };
      
      case 'outline':
        return {
          fg: tokens.colors.primary[700],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: 'transparent',
          },
        };
      
      case 'ghost':
        return {
          fg: tokens.colors.gray[500],
          bold: false,
        };
      
      case 'body':
        return {
          fg: tokens.colors.gray[800],
          bold: false,
        };
      
      case 'lead':
        return {
          fg: tokens.colors.gray[900],
          bold: true,
          weight: 'medium',
        };
      
      case 'small':
        return {
          fg: tokens.colors.gray[600],
          bold: false,
          weight: 'normal',
        };
      
      case 'caption':
        return {
          fg: tokens.colors.gray[500],
          bold: false,
          weight: 'normal',
        };
      
      default:
        return {
          fg: tokens.colors.gray[800],
          bold: false,
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: ParagraphSizes) {
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
            left: 1,
            right: 1,
            top: 1,
            bottom: 1,
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
            left: 2,
            right: 2,
            top: 2,
            bottom: 2,
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
            left: 3,
            right: 3,
            top: 3,
            bottom: 3,
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
            left: 4,
            right: 4,
            top: 4,
            bottom: 4,
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
  private static getStateStyle(state: ParagraphStates) {
    switch (state) {
      case 'hover':
        return {
          fg: this.adjustColor(this.getCurrentFg(), -10),
          bold: true,
        };
      
      case 'active':
        return {
          fg: this.adjustColor(this.getCurrentFg(), -20),
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
          bold: true,
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[600],
          bold: true,
        };
      
      case 'loading':
        return {
          fg: tokens.colors.primary[600],
          bold: true,
        };
      
      case 'highlighted':
        return {
          bg: tokens.colors.primary[100],
          fg: tokens.colors.primary[800],
          bold: true,
        };
      
      case 'muted':
        return {
          fg: tokens.colors.gray[500],
          dim: true,
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on paragraph props
   */
  private static getCustomStyle(props: ParagraphProps) {
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

    if (props.textColor) {
      customStyle.fg = props.textColor;
    }

    // Paragraph style variants
    if (props.paragraphStyle === 'compact') {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 1,
        bottom: 1,
      };
    }

    if (props.paragraphStyle === 'detailed') {
      customStyle.padding = {
        left: 4,
        right: 4,
        top: 3,
        bottom: 3,
      };
    }

    if (props.paragraphStyle === 'minimal') {
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

    if (props.paragraphStyle === 'modern') {
      customStyle.border = {
        type: 'line',
        fg: tokens.colors.primary[400],
        bg: 'transparent',
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

    if (props.elevated) {
      customStyle.bg = tokens.colors.white;
      customStyle.border = {
        type: 'line',
        fg: tokens.colors.gray[300],
        bg: tokens.colors.white,
      };
    }

    // Weight variants
    if (props.weight === 'medium') {
      customStyle.weight = 'medium';
    } else if (props.weight === 'semibold') {
      customStyle.weight = 'semibold';
      customStyle.bold = true;
    } else if (props.weight === 'bold') {
      customStyle.weight = 'bold';
      customStyle.bold = true;
    } else if (props.weight === 'extrabold') {
      customStyle.weight = 'extrabold';
      customStyle.bold = true;
    }

    // Text formatting
    if (props.truncate) {
      customStyle.truncate = true;
    }

    if (props.ellipsis) {
      customStyle.ellipsis = true;
    }

    if (props.wrap) {
      customStyle.wrap = true;
    }

    if (props.bold) {
      customStyle.bold = true;
    }

    if (props.italic) {
      customStyle.italic = true;
    }

    if (props.underline) {
      customStyle.underline = true;
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

    // Paragraph dimensions
    if (props.width) {
      customStyle.width = props.width;
    }

    if (props.height) {
      customStyle.height = props.height;
    }

    if (props.maxWidth) {
      customStyle.maxWidth = props.maxWidth;
    }

    if (props.maxHeight) {
      customStyle.maxHeight = props.maxHeight;
    }

    // Paragraph layout
    if (props.flex !== undefined) {
      customStyle.flex = props.flex;
    }

    if (props.flexGrow !== undefined) {
      customStyle.flexGrow = props.flexGrow;
    }

    if (props.flexShrink !== undefined) {
      customStyle.flexShrink = props.flexShrink;
    }

    if (props.flexBasis !== undefined) {
      customStyle.flexBasis = props.flexBasis;
    }

    // Interactive paragraph
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Selectable paragraph
    if (props.selectable) {
      customStyle.selectable = true;
    }

    // Copyable paragraph
    if (props.copyable) {
      customStyle.copyable = true;
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
   * Get paragraph style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: ParagraphVariants,
    size: ParagraphSizes,
    state: ParagraphStates
  ) {
    const mockProps: ParagraphProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available paragraph styles
   */
  static getAllStyles() {
    const variants: ParagraphVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'body', 'lead', 'small', 'caption'];
    const sizes: ParagraphSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: ParagraphStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'loading', 'highlighted', 'muted'];
    
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