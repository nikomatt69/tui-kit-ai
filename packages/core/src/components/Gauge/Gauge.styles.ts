import { GaugeProps, GaugeVariants, GaugeSizes, GaugeStates } from './Gauge.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class GaugeStyles {
  /**
   * Get gauge style based on props
   */
  static getStyle(props: GaugeProps) {
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
   * Base gauge style
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
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: GaugeVariants) {
    switch (variant) {
      case 'primary':
        return {
          fg: tokens.colors.primary[600],
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[100],
        };
      
      case 'secondary':
        return {
          fg: tokens.colors.gray[600],
          fillColor: tokens.colors.gray[500],
          emptyColor: tokens.colors.gray[100],
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[600],
          fillColor: tokens.colors.success[500],
          emptyColor: tokens.colors.success[100],
        };
      
      case 'warning':
        return {
          fg: tokens.colors.warning[600],
          fillColor: tokens.colors.warning[500],
          emptyColor: tokens.colors.warning[100],
        };
      
      case 'error':
        return {
          fg: tokens.colors.error[600],
          fillColor: tokens.colors.error[500],
          emptyColor: tokens.colors.error[100],
        };
      
      case 'info':
        return {
          fg: tokens.colors.info[600],
          fillColor: tokens.colors.info[500],
          emptyColor: tokens.colors.info[100],
        };
      
      case 'outline':
        return {
          fg: tokens.colors.primary[700],
          fillColor: tokens.colors.primary[400],
          emptyColor: tokens.colors.gray[200],
          border: {
            type: 'line',
            fg: tokens.colors.primary[300],
            bg: 'transparent',
          },
        };
      
      case 'ghost':
        return {
          fg: tokens.colors.gray[500],
          fillColor: tokens.colors.gray[400],
          emptyColor: tokens.colors.gray[100],
        };
      
      case 'gradient':
        return {
          fg: tokens.colors.primary[600],
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.gray[100],
          bold: true,
        };
      
      default:
        return {
          fg: tokens.colors.gray[700],
          fillColor: tokens.colors.gray[500],
          emptyColor: tokens.colors.gray[200],
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: GaugeSizes) {
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
  private static getStateStyle(state: GaugeStates) {
    switch (state) {
      case 'hover':
        return {
          fg: this.adjustColor(this.getCurrentFg(), 10),
          fillColor: this.adjustColor(this.getCurrentFillColor(), 10),
          bold: true,
        };
      
      case 'active':
        return {
          fg: this.adjustColor(this.getCurrentFg(), 20),
          fillColor: this.adjustColor(this.getCurrentFillColor(), 20),
          bold: true,
        };
      
      case 'disabled':
        return {
          fg: tokens.colors.gray[400],
          fillColor: tokens.colors.gray[300],
          emptyColor: tokens.colors.gray[100],
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
          fillColor: tokens.colors.error[500],
          emptyColor: tokens.colors.error[100],
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[600],
          fillColor: tokens.colors.success[500],
          emptyColor: tokens.colors.success[100],
        };
      
      case 'loading':
        return {
          fg: tokens.colors.primary[500],
          fillColor: tokens.colors.primary[400],
          emptyColor: tokens.colors.primary[100],
          bold: true,
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on gauge props
   */
  private static getCustomStyle(props: GaugeProps) {
    const customStyle: any = {};

    // Custom colors
    if (props.color) {
      customStyle.fg = props.color;
    }

    if (props.fillColor) {
      customStyle.fillColor = props.fillColor;
    }

    if (props.emptyColor) {
      customStyle.emptyColor = props.emptyColor;
    }

    // Custom dimensions
    if (props.width) {
      customStyle.width = props.width;
    }

    if (props.height) {
      customStyle.height = props.height;
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Interactive gauge
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Animated gauge
    if (props.animated) {
      customStyle.bold = true;
    }

    // Smooth gauge
    if (props.smooth) {
      customStyle.underline = true;
    }

    // Threshold-based styling
    if (props.thresholds && props.thresholds.length > 0) {
      const currentValue = props.value || 0;
      const threshold = props.thresholds.find(t => currentValue >= t.value);
      
      if (threshold) {
        customStyle.fg = threshold.color;
        customStyle.fillColor = threshold.color;
      }
    }

    // Warning threshold
    if (props.warningThreshold !== undefined && props.value !== undefined) {
      if (props.value >= props.warningThreshold) {
        customStyle.fg = tokens.colors.warning[600];
        customStyle.fillColor = tokens.colors.warning[500];
      }
    }

    // Error threshold
    if (props.errorThreshold !== undefined && props.value !== undefined) {
      if (props.value >= props.errorThreshold) {
        customStyle.fg = tokens.colors.error[600];
        customStyle.fillColor = tokens.colors.error[500];
      }
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
   * Get current fill color for state changes
   */
  private static getCurrentFillColor(): string {
    return tokens.colors.gray[500];
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
   * Get gauge style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: GaugeVariants,
    size: GaugeSizes,
    state: GaugeStates
  ) {
    const mockProps: GaugeProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available gauge styles
   */
  static getAllStyles() {
    const variants: GaugeVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'gradient'];
    const sizes: GaugeSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: GaugeStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'loading'];
    
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