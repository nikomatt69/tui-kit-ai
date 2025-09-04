import { ProgressDotsProps, ProgressDotsVariants, ProgressDotsSizes, ProgressDotsStates } from './ProgressDots.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class ProgressDotsStyles {
  /**
   * Get progress dots style based on props
   */
  static getStyle(props: ProgressDotsProps) {
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
   * Base progress dots style
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
  private static getVariantStyle(variant: ProgressDotsVariants) {
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
  private static getSizeStyle(size: ProgressDotsSizes) {
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
  private static getStateStyle(state: ProgressDotsStates) {
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
          fillColor: tokens.colors.gray[300],
          emptyColor: tokens.colors.gray[200],
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
          emptyColor: tokens.colors.error[200],
        };
      
      case 'success':
        return {
          fg: tokens.colors.success[600],
          fillColor: tokens.colors.success[500],
          emptyColor: tokens.colors.success[200],
        };
      
      case 'loading':
        return {
          fg: tokens.colors.primary[600],
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          animated: true,
        };
      
      case 'complete':
        return {
          fg: tokens.colors.success[600],
          fillColor: tokens.colors.success[500],
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
   * Get custom styles based on progress dots props
   */
  private static getCustomStyle(props: ProgressDotsProps) {
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

    // Progress dots style variants
    if (props.progressDotsStyle === 'compact') {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 0,
        bottom: 0,
      };
    }

    if (props.progressDotsStyle === 'detailed') {
      customStyle.padding = {
        left: 6,
        right: 6,
        top: 4,
        bottom: 4,
      };
    }

    if (props.progressDotsStyle === 'minimal') {
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

    if (props.progressDotsStyle === 'modern') {
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

    // Progress dots dimensions
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

    // Progress dots behavior
    if (props.animated) {
      customStyle.animated = true;
    }

    if (props.smooth) {
      customStyle.smooth = true;
    }

    // Interactive progress dots
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Threshold-based styling
    if (props.warningThreshold && props.value && props.value >= props.warningThreshold) {
      customStyle.fillColor = tokens.colors.warning[500];
    }

    if (props.errorThreshold && props.value && props.value >= props.errorThreshold) {
      customStyle.fillColor = tokens.colors.error[500];
    }

    if (props.successThreshold && props.value && props.value >= props.successThreshold) {
      customStyle.fillColor = tokens.colors.success[500];
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
   * Get progress dots style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: ProgressDotsVariants,
    size: ProgressDotsSizes,
    state: ProgressDotsStates
  ) {
    const mockProps: ProgressDotsProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available progress dots styles
   */
  static getAllStyles() {
    const variants: ProgressDotsVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'striped', 'animated', 'gradient'];
    const sizes: ProgressDotsSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: ProgressDotsStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'loading', 'complete', 'indeterminate'];
    
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