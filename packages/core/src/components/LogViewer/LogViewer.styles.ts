import { LogViewerProps, LogViewerVariants, LogViewerSizes, LogViewerStates } from './LogViewer.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class LogViewerStyles {
  /**
   * Get log viewer style based on props
   */
  static getStyle(props: LogViewerProps) {
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
   * Base log viewer style
   */
  private static getBaseStyle() {
    return {
      bg: tokens.colors.gray[900],
      fg: tokens.colors.gray[100],
      border: {
        type: 'line',
        fg: tokens.colors.gray[600],
        bg: tokens.colors.gray[900],
      },
      align: 'left' as const,
      valign: 'top' as const,
      bold: false,
      underline: false,
      monospace: true,
      scrollable: true,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: LogViewerVariants) {
    switch (variant) {
      case 'primary':
        return {
          bg: tokens.colors.primary[900],
          fg: tokens.colors.primary[100],
          border: {
            type: 'line',
            fg: tokens.colors.primary[600],
            bg: tokens.colors.primary[900],
          },
        };
      
      case 'secondary':
        return {
          bg: tokens.colors.gray[800],
          fg: tokens.colors.gray[200],
          border: {
            type: 'line',
            fg: tokens.colors.gray[500],
            bg: tokens.colors.gray[800],
          },
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[900],
          fg: tokens.colors.success[100],
          border: {
            type: 'line',
            fg: tokens.colors.success[600],
            bg: tokens.colors.success[900],
          },
        };
      
      case 'warning':
        return {
          bg: tokens.colors.warning[900],
          fg: tokens.colors.warning[100],
          border: {
            type: 'line',
            fg: tokens.colors.warning[600],
            bg: tokens.colors.warning[900],
          },
        };
      
      case 'error':
        return {
          bg: tokens.colors.error[900],
          fg: tokens.colors.error[100],
          border: {
            type: 'line',
            fg: tokens.colors.error[600],
            bg: tokens.colors.error[900],
          },
        };
      
      case 'info':
        return {
          bg: tokens.colors.info[900],
          fg: tokens.colors.info[100],
          border: {
            type: 'line',
            fg: tokens.colors.info[600],
            bg: tokens.colors.info[900],
          },
        };
      
      case 'outline':
        return {
          bg: 'transparent',
          fg: tokens.colors.primary[300],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: 'transparent',
          },
        };
      
      case 'ghost':
        return {
          bg: 'transparent',
          fg: tokens.colors.gray[400],
          border: {
            type: 'line',
            fg: 'transparent',
            bg: 'transparent',
          },
        };
      
      case 'terminal':
        return {
          bg: tokens.colors.black,
          fg: tokens.colors.green[400],
          border: {
            type: 'line',
            fg: tokens.colors.green[600],
            bg: tokens.colors.black,
          },
          monospace: true,
        };
      
      default:
        return {
          bg: tokens.colors.gray[900],
          fg: tokens.colors.gray[100],
          border: {
            type: 'line',
            fg: tokens.colors.gray[600],
            bg: tokens.colors.gray[900],
          },
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: LogViewerSizes) {
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
            left: 4,
            right: 4,
            top: 4,
            bottom: 4,
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
      
      case 'xl':
        return {
          padding: {
            left: 8,
            right: 8,
            top: 8,
            bottom: 8,
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
            top: 12,
            bottom: 12,
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
            top: 4,
            bottom: 4,
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
  private static getStateStyle(state: LogViewerStates) {
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
          bg: tokens.colors.gray[800],
          fg: tokens.colors.gray[500],
          border: {
            type: 'line',
            fg: tokens.colors.gray[400],
            bg: tokens.colors.gray[800],
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
          bg: tokens.colors.error[800],
          fg: tokens.colors.error[200],
          border: {
            type: 'line',
            fg: tokens.colors.error[500],
            bg: tokens.colors.error[800],
          },
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[800],
          fg: tokens.colors.success[200],
          border: {
            type: 'line',
            fg: tokens.colors.success[500],
            bg: tokens.colors.success[800],
          },
        };
      
      case 'loading':
        return {
          bg: tokens.colors.primary[800],
          fg: tokens.colors.primary[200],
          border: {
            type: 'line',
            fg: tokens.colors.primary[500],
            bg: tokens.colors.primary[800],
          },
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on log viewer props
   */
  private static getCustomStyle(props: LogViewerProps) {
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

    // Log style variants
    if (props.logStyle === 'compact') {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 1,
        bottom: 1,
      };
    }

    if (props.logStyle === 'detailed') {
      customStyle.padding = {
        left: 6,
        right: 6,
        top: 6,
        bottom: 6,
      };
    }

    if (props.logStyle === 'minimal') {
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

    if (props.logStyle === 'terminal') {
      customStyle.monospace = true;
      customStyle.bold = false;
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

    // Interactive log viewer
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Scrollable log viewer
    if (props.maxLines && props.maxLines > 0) {
      customStyle.scrollable = true;
      customStyle.alwaysScroll = true;
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
    return tokens.colors.gray[100];
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
   * Get log viewer style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: LogViewerVariants,
    size: LogViewerSizes,
    state: LogViewerStates
  ) {
    const mockProps: LogViewerProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available log viewer styles
   */
  static getAllStyles() {
    const variants: LogViewerVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'terminal'];
    const sizes: LogViewerSizes[] = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
    const states: LogViewerStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'loading'];
    
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