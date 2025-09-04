import { StatusIndicatorProps, StatusIndicatorVariants, StatusIndicatorSizes, StatusIndicatorStates } from './StatusIndicator.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class StatusIndicatorStyles {
  /**
   * Get status indicator style based on props
   */
  static getStyle(props: StatusIndicatorProps) {
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
   * Base status indicator style
   */
  private static getBaseStyle() {
    return {
      bg: tokens.colors.white,
      fg: tokens.colors.gray[800],
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
        bg: tokens.colors.white,
      },
      align: 'center' as const,
      valign: 'middle' as const,
      bold: false,
      underline: false,
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
  private static getVariantStyle(variant: StatusIndicatorVariants) {
    switch (variant) {
      case 'primary':
        return {
          bg: tokens.colors.primary[50],
          fg: tokens.colors.primary[900],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: tokens.colors.primary[50],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
        };
      
      case 'secondary':
        return {
          bg: tokens.colors.gray[50],
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: tokens.colors.gray[400],
            bg: tokens.colors.gray[50],
          },
          fillColor: tokens.colors.gray[500],
          emptyColor: tokens.colors.gray[200],
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[50],
          fg: tokens.colors.success[900],
          border: {
            type: 'line',
            fg: tokens.colors.success[400],
            bg: tokens.colors.success[50],
          },
          fillColor: tokens.colors.success[500],
          emptyColor: tokens.colors.success[200],
        };
      
      case 'warning':
        return {
          bg: tokens.colors.warning[50],
          fg: tokens.colors.warning[900],
          border: {
            type: 'line',
            fg: tokens.colors.warning[400],
            bg: tokens.colors.warning[50],
          },
          fillColor: tokens.colors.warning[500],
          emptyColor: tokens.colors.warning[200],
        };
      
      case 'error':
        return {
          bg: tokens.colors.error[50],
          fg: tokens.colors.error[900],
          border: {
            type: 'line',
            fg: tokens.colors.error[400],
            bg: tokens.colors.error[50],
          },
          fillColor: tokens.colors.error[500],
          emptyColor: tokens.colors.error[200],
        };
      
      case 'info':
        return {
          bg: tokens.colors.info[50],
          fg: tokens.colors.info[900],
          border: {
            type: 'line',
            fg: tokens.colors.info[400],
            bg: tokens.colors.info[50],
          },
          fillColor: tokens.colors.info[500],
          emptyColor: tokens.colors.info[200],
        };
      
      case 'outline':
        return {
          bg: 'transparent',
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
          bg: 'transparent',
          fg: tokens.colors.gray[600],
          border: {
            type: 'line',
            fg: 'transparent',
            bg: 'transparent',
          },
          fillColor: tokens.colors.gray[400],
          emptyColor: tokens.colors.gray[100],
        };
      
      case 'striped':
        return {
          bg: tokens.colors.primary[50],
          fg: tokens.colors.primary[900],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: tokens.colors.primary[50],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          striped: true,
        };
      
      case 'animated':
        return {
          bg: tokens.colors.primary[50],
          fg: tokens.colors.primary[900],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: tokens.colors.primary[50],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          animated: true,
        };
      
      case 'gradient':
        return {
          bg: tokens.colors.primary[50],
          fg: tokens.colors.primary[900],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: tokens.colors.primary[50],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          gradient: true,
        };
      
      default:
        return {
          bg: tokens.colors.white,
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.white,
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.gray[300],
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: StatusIndicatorSizes) {
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
  private static getStateStyle(state: StatusIndicatorStates) {
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
          bg: tokens.colors.gray[100],
          fg: tokens.colors.gray[500],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
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
            fg: tokens.colors.error[500],
            bg: tokens.colors.error[100],
          },
          fillColor: tokens.colors.error[600],
          emptyColor: tokens.colors.error[200],
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[100],
          fg: tokens.colors.success[800],
          border: {
            type: 'line',
            fg: tokens.colors.success[500],
            bg: tokens.colors.success[100],
          },
          fillColor: tokens.colors.success[600],
          emptyColor: tokens.colors.success[200],
        };
      
      case 'loading':
        return {
          bg: tokens.colors.primary[100],
          fg: tokens.colors.primary[800],
          border: {
            type: 'line',
            fg: tokens.colors.primary[500],
            bg: tokens.colors.primary[100],
          },
          fillColor: tokens.colors.primary[600],
          emptyColor: tokens.colors.primary[200],
          animated: true,
        };
      
      case 'complete':
        return {
          bg: tokens.colors.success[100],
          fg: tokens.colors.success[800],
          border: {
            type: 'line',
            fg: tokens.colors.success[500],
            bg: tokens.colors.success[100],
          },
          fillColor: tokens.colors.success[600],
          emptyColor: tokens.colors.success[200],
        };
      
      case 'indeterminate':
        return {
          bg: tokens.colors.primary[100],
          fg: tokens.colors.primary[800],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: tokens.colors.primary[100],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          animated: true,
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on status indicator props
   */
  private static getCustomStyle(props: StatusIndicatorProps) {
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

    // Status indicator style variants
    if (props.statusIndicatorStyle === 'compact') {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 1,
        bottom: 1,
      };
    }

    if (props.statusIndicatorStyle === 'detailed') {
      customStyle.padding = {
        left: 4,
        right: 4,
        top: 3,
        bottom: 3,
      };
    }

    if (props.statusIndicatorStyle === 'minimal') {
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

    if (props.statusIndicatorStyle === 'modern') {
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

    // Status indicator dimensions
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

    // Interactive status indicator
    if (props.interactive || props.clickable) {
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
   * Get status indicator style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: StatusIndicatorVariants,
    size: StatusIndicatorSizes,
    state: StatusIndicatorStates
  ) {
    const mockProps: StatusIndicatorProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available status indicator styles
   */
  static getAllStyles() {
    const variants: StatusIndicatorVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'striped', 'animated', 'gradient'];
    const sizes: StatusIndicatorSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: StatusIndicatorStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'loading', 'complete', 'indeterminate'];
    
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