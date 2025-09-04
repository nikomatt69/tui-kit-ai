import { ProgressBarProps, ProgressBarVariants, ProgressBarSizes, ProgressBarStates } from './ProgressBar.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class ProgressBarStyles {
  /**
   * Get progress bar style based on props
   */
  static getStyle(props: ProgressBarProps) {
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
   * Base progress bar style
   */
  private static getBaseStyle() {
    return {
      bg: tokens.colors.gray[100],
      fg: tokens.colors.gray[800],
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
        bg: tokens.colors.gray[100],
      },
      align: 'left' as const,
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
  private static getVariantStyle(variant: ProgressBarVariants) {
    switch (variant) {
      case 'primary':
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
        };
      
      case 'secondary':
        return {
          bg: tokens.colors.gray[100],
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: tokens.colors.gray[400],
            bg: tokens.colors.gray[100],
          },
          fillColor: tokens.colors.gray[500],
          emptyColor: tokens.colors.gray[200],
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
          fillColor: tokens.colors.success[500],
          emptyColor: tokens.colors.success[200],
        };
      
      case 'warning':
        return {
          bg: tokens.colors.warning[100],
          fg: tokens.colors.warning[800],
          border: {
            type: 'line',
            fg: tokens.colors.warning[400],
            bg: tokens.colors.warning[100],
          },
          fillColor: tokens.colors.warning[500],
          emptyColor: tokens.colors.warning[200],
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
          fillColor: tokens.colors.error[500],
          emptyColor: tokens.colors.error[200],
        };
      
      case 'info':
        return {
          bg: tokens.colors.info[100],
          fg: tokens.colors.info[800],
          border: {
            type: 'line',
            fg: tokens.colors.info[400],
            bg: tokens.colors.info[100],
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
          bg: tokens.colors.primary[100],
          fg: tokens.colors.primary[800],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: tokens.colors.primary[100],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          striped: true,
        };
      
      case 'animated':
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
      
      case 'gradient':
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
          gradient: true,
        };
      
      default:
        return {
          bg: tokens.colors.gray[100],
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[100],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.gray[300],
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: ProgressBarSizes) {
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
  private static getStateStyle(state: ProgressBarStates) {
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
   * Get custom styles based on progress bar props
   */
  private static getCustomStyle(props: ProgressBarProps) {
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

    // Progress bar style variants
    if (props.progressBarStyle === 'compact') {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 0,
        bottom: 0,
      };
    }

    if (props.progressBarStyle === 'detailed') {
      customStyle.padding = {
        left: 6,
        right: 6,
        top: 4,
        bottom: 4,
      };
    }

    if (props.progressBarStyle === 'minimal') {
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

    if (props.progressBarStyle === 'modern') {
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

    // Progress bar dimensions
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

    // Progress bar behavior
    if (props.animated) {
      customStyle.animated = true;
    }

    if (props.smooth) {
      customStyle.smooth = true;
    }

    // Interactive progress bar
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
    return tokens.colors.gray[100];
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
   * Get progress bar style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: ProgressBarVariants,
    size: ProgressBarSizes,
    state: ProgressBarStates
  ) {
    const mockProps: ProgressBarProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available progress bar styles
   */
  static getAllStyles() {
    const variants: ProgressBarVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'striped', 'animated', 'gradient'];
    const sizes: ProgressBarSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: ProgressBarStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'loading', 'complete', 'indeterminate'];
    
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