import { TooltipProps, TooltipVariants, TooltipSizes, TooltipStates } from './Tooltip.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class TooltipStyles {
  /**
   * Get tooltip style based on props
   */
  static getStyle(props: TooltipProps) {
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
   * Base tooltip style
   */
  private static getBaseStyle() {
    return {
      bg: tokens.colors.gray[900],
      fg: tokens.colors.white,
      border: {
        type: 'line',
        fg: tokens.colors.gray[700],
        bg: tokens.colors.gray[900],
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
      shadow: true,
      zIndex: 2000,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: TooltipVariants) {
    switch (variant) {
      case 'primary':
        return {
          bg: tokens.colors.primary[900],
          fg: tokens.colors.white,
          border: {
            type: 'line',
            fg: tokens.colors.primary[700],
            bg: tokens.colors.primary[900],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
        };
      
      case 'secondary':
        return {
          bg: tokens.colors.gray[800],
          fg: tokens.colors.white,
          border: {
            type: 'line',
            fg: tokens.colors.gray[600],
            bg: tokens.colors.gray[800],
          },
          fillColor: tokens.colors.gray[500],
          emptyColor: tokens.colors.gray[200],
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[900],
          fg: tokens.colors.white,
          border: {
            type: 'line',
            fg: tokens.colors.success[700],
            bg: tokens.colors.success[900],
          },
          fillColor: tokens.colors.success[500],
          emptyColor: tokens.colors.success[200],
        };
      
      case 'warning':
        return {
          bg: tokens.colors.warning[900],
          fg: tokens.colors.white,
          border: {
            type: 'line',
            fg: tokens.colors.warning[700],
            bg: tokens.colors.warning[900],
          },
          fillColor: tokens.colors.warning[500],
          emptyColor: tokens.colors.warning[200],
        };
      
      case 'error':
        return {
          bg: tokens.colors.error[900],
          fg: tokens.colors.white,
          border: {
            type: 'line',
            fg: tokens.colors.error[700],
            bg: tokens.colors.error[900],
          },
          fillColor: tokens.colors.error[500],
          emptyColor: tokens.colors.error[200],
        };
      
      case 'info':
        return {
          bg: tokens.colors.info[900],
          fg: tokens.colors.white,
          border: {
            type: 'line',
            fg: tokens.colors.info[700],
            bg: tokens.colors.info[900],
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
          bg: tokens.colors.primary[900],
          fg: tokens.colors.white,
          border: {
            type: 'line',
            fg: tokens.colors.primary[700],
            bg: tokens.colors.primary[900],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          striped: true,
        };
      
      case 'animated':
        return {
          bg: tokens.colors.primary[900],
          fg: tokens.colors.white,
          border: {
            type: 'line',
            fg: tokens.colors.primary[700],
            bg: tokens.colors.primary[900],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          animated: true,
        };
      
      case 'gradient':
        return {
          bg: tokens.colors.primary[900],
          fg: tokens.colors.white,
          border: {
            type: 'line',
            fg: tokens.colors.primary[700],
            bg: tokens.colors.primary[900],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.primary[200],
          gradient: true,
        };
      
      default:
        return {
          bg: tokens.colors.gray[900],
          fg: tokens.colors.white,
          border: {
            type: 'line',
            fg: tokens.colors.gray[700],
            bg: tokens.colors.gray[900],
          },
          fillColor: tokens.colors.primary[500],
          emptyColor: tokens.colors.gray[300],
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: TooltipSizes) {
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
  private static getStateStyle(state: TooltipStates) {
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
   * Get custom styles based on tooltip props
   */
  private static getCustomStyle(props: TooltipProps) {
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

    // Tooltip style variants
    if (props.tooltipStyle === 'compact') {
      customStyle.padding = {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1,
      };
    }

    if (props.tooltipStyle === 'detailed') {
      customStyle.padding = {
        left: 6,
        right: 6,
        top: 4,
        bottom: 4,
      };
    }

    if (props.tooltipStyle === 'minimal') {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 0,
        bottom: 0,
      };
      customStyle.border = {
        type: 'none',
        fg: 'transparent',
        bg: 'transparent',
      };
    }

    if (props.tooltipStyle === 'modern') {
      customStyle.border = {
        type: 'line',
        fg: tokens.colors.primary[400],
        bg: this.getCurrentBg(),
      };
      customStyle.bold = true;
      customStyle.shadow = true;
      customStyle.zIndex = 2001;
    }

    // Display options
    if (props.compact) {
      customStyle.padding = {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1,
      };
    }

    if (props.elevated) {
      customStyle.shadow = true;
      customStyle.zIndex = 2002;
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Tooltip dimensions
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

    // Interactive tooltip
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Position-specific styles
    if (props.position) {
      switch (props.position) {
        case 'top':
        case 'top-left':
        case 'top-right':
          customStyle.top = 1;
          break;
        case 'bottom':
        case 'bottom-left':
        case 'bottom-right':
          customStyle.top = '100%-3';
          break;
        case 'left':
        case 'right':
          customStyle.top = 'center';
          break;
      }
      
      switch (props.position) {
        case 'top-left':
        case 'bottom-left':
        case 'left':
          customStyle.left = 1;
          break;
        case 'top':
        case 'bottom':
          customStyle.left = 'center';
          break;
        case 'top-right':
        case 'bottom-right':
        case 'right':
          customStyle.right = 1;
          break;
      }
    }

    return customStyle;
  }

  /**
   * Get current background color for state changes
   */
  private static getCurrentBg(): string {
    return tokens.colors.gray[900];
  }

  /**
   * Get current foreground color for state changes
   */
  private static getCurrentFg(): string {
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
   * Get tooltip style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: TooltipVariants,
    size: TooltipSizes,
    state: TooltipStates
  ) {
    const mockProps: TooltipProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available tooltip styles
   */
  static getAllStyles() {
    const variants: TooltipVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'striped', 'animated', 'gradient'];
    const sizes: TooltipSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: TooltipStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'loading', 'complete', 'indeterminate'];
    
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