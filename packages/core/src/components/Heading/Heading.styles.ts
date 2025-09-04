import { HeadingProps, HeadingVariants, HeadingSizes, HeadingStates } from './Heading.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class HeadingStyles {
  /**
   * Get heading style based on props
   */
  static getStyle(props: HeadingProps) {
    const variant = props.variant || 'default';
    const size = props.size || 'md';
    const state = props.state || 'default';
    const level = props.level || 1;
    
    const baseStyle = this.getBaseStyle();
    const variantStyle = this.getVariantStyle(variant);
    const sizeStyle = this.getSizeStyle(size, level);
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
   * Base heading style
   */
  private static getBaseStyle() {
    return {
      bg: 'transparent',
      fg: tokens.colors.gray[900],
      border: {
        type: 'none',
        fg: 'transparent',
        bg: 'transparent',
      },
      align: 'left' as const,
      valign: 'top' as const,
      bold: true,
      underline: false,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: HeadingVariants) {
    switch (variant) {
      case 'primary':
        return {
          fg: tokens.colors.primary[700],
        };
      
      case 'secondary':
        return {
          fg: tokens.colors.gray[700],
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[700],
        };
      
      case 'warning':
        return {
          fg: tokens.colors.warning[700],
        };
      
      case 'error':
        return {
          fg: tokens.colors.error[700],
        };
      
      case 'info':
        return {
          fg: tokens.colors.info[700],
        };
      
      case 'outline':
        return {
          fg: tokens.colors.primary[600],
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
      
      case 'gradient':
        return {
          fg: tokens.colors.primary[600],
          bold: true,
        };
      
      default:
        return {
          fg: tokens.colors.gray[900],
        };
    }
  }

  /**
   * Get size-specific styles based on heading level
   */
  private static getSizeStyle(size: HeadingSizes, level: number) {
    // Base size from level
    let baseSize = level === 1 ? 'xl' : 
                   level === 2 ? 'lg' : 
                   level === 3 ? 'md' : 
                   level === 4 ? 'sm' : 'xs';
    
    // Override with explicit size if provided
    if (size !== 'md') {
      baseSize = size;
    }
    
    switch (baseSize) {
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
          bold: false,
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
          bold: true,
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
          bold: true,
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
          bold: true,
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
          bold: true,
        };
      
      case '2xl':
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
          bold: true,
        };
      
      case '3xl':
        return {
          padding: {
            left: 10,
            right: 10,
            top: 8,
            bottom: 8,
          },
          margin: {
            left: 8,
            right: 8,
            top: 8,
            bottom: 8,
          },
          bold: true,
        };
      
      case '4xl':
        return {
          padding: {
            left: 12,
            right: 12,
            top: 10,
            bottom: 10,
          },
          margin: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
          },
          bold: true,
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
          bold: true,
        };
    }
  }

  /**
   * Get state-specific styles
   */
  private static getStateStyle(state: HeadingStates) {
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
   * Get custom styles based on heading props
   */
  private static getCustomStyle(props: HeadingProps) {
    const customStyle: any = {};

    // Custom color
    if (props.color) {
      customStyle.fg = props.color;
    }

    // Heading style variants
    if (props.headingStyle === 'outline') {
      customStyle.border = {
        type: 'line',
        fg: tokens.colors.primary[400],
        bg: 'transparent',
      };
    }

    if (props.headingStyle === 'ghost') {
      customStyle.border = {
        type: 'line',
        fg: 'transparent',
        bg: 'transparent',
      };
    }

    if (props.headingStyle === 'gradient') {
      customStyle.bold = true;
    }

    if (props.headingStyle === 'elevated') {
      customStyle.shadow = tokens.shadows.lg;
    }

    // Font weight
    if (props.fontWeight === 'normal') {
      customStyle.bold = false;
    } else if (props.fontWeight === 'bolder') {
      customStyle.bold = true;
    }

    // Text transform
    if (props.textTransform === 'uppercase') {
      customStyle.uppercase = true;
    }

    // Text behavior
    if (props.truncate) {
      customStyle.truncate = true;
    }

    if (props.ellipsis) {
      customStyle.ellipsis = true;
    }

    if (props.wrap) {
      customStyle.wrap = true;
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Interactive heading
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    return customStyle;
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
   * Get heading style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: HeadingVariants,
    size: HeadingSizes,
    state: HeadingStates,
    level: number = 1
  ) {
    const mockProps: HeadingProps = {
      variant,
      size,
      state,
      level,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available heading styles
   */
  static getAllStyles() {
    const variants: HeadingVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'gradient'];
    const sizes: HeadingSizes[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
    const states: HeadingStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success'];
    const levels = [1, 2, 3, 4, 5, 6];
    
    const allStyles: Record<string, any> = {};
    
    variants.forEach(variant => {
      sizes.forEach(size => {
        states.forEach(state => {
          levels.forEach(level => {
            const key = `${variant}-${size}-${state}-h${level}`;
            allStyles[key] = this.getStyleForCombination(variant, size, state, level);
          });
        });
      });
    });
    
    return allStyles;
  }
}