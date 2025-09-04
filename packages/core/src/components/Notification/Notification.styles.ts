import { NotificationProps, NotificationVariants, NotificationSizes, NotificationStates } from './Notification.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class NotificationStyles {
  /**
   * Get notification style based on props
   */
  static getStyle(props: NotificationProps) {
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
   * Base notification style
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
      valign: 'top' as const,
      bold: false,
      underline: false,
      shadow: true,
      zIndex: 1000,
      iconColor: tokens.colors.gray[600],
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: NotificationVariants) {
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
          iconColor: tokens.colors.primary[600],
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
          iconColor: tokens.colors.gray[600],
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
          iconColor: tokens.colors.success[600],
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
          iconColor: tokens.colors.warning[600],
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
          iconColor: tokens.colors.error[600],
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
          iconColor: tokens.colors.info[600],
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
          iconColor: tokens.colors.primary[600],
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
          iconColor: tokens.colors.gray[500],
        };
      
      case 'toast':
        return {
          bg: tokens.colors.gray[800],
          fg: tokens.colors.white,
          border: {
            type: 'line',
            fg: tokens.colors.gray[600],
            bg: tokens.colors.gray[800],
          },
          iconColor: tokens.colors.gray[300],
          shadow: true,
        };
      
      case 'alert':
        return {
          bg: tokens.colors.warning[100],
          fg: tokens.colors.warning[900],
          border: {
            type: 'line',
            fg: tokens.colors.warning[400],
            bg: tokens.colors.warning[100],
          },
          iconColor: tokens.colors.warning[600],
          bold: true,
        };
      
      case 'banner':
        return {
          bg: tokens.colors.primary[100],
          fg: tokens.colors.primary[900],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: tokens.colors.primary[100],
          },
          iconColor: tokens.colors.primary[600],
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
          iconColor: tokens.colors.gray[600],
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: NotificationSizes) {
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
  private static getStateStyle(state: NotificationStates) {
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
        };
      
      case 'visible':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: this.getCurrentBg(),
          },
          bold: true,
          zIndex: 1001,
        };
      
      case 'hidden':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.gray[400],
            bg: this.getCurrentBg(),
          },
          zIndex: 1000,
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on notification props
   */
  private static getCustomStyle(props: NotificationProps) {
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

    if (props.iconColor) {
      customStyle.iconColor = props.iconColor;
    }

    // Notification style variants
    if (props.notificationStyle === 'compact') {
      customStyle.padding = {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1,
      };
    }

    if (props.notificationStyle === 'detailed') {
      customStyle.padding = {
        left: 8,
        right: 8,
        top: 6,
        bottom: 6,
      };
    }

    if (props.notificationStyle === 'minimal') {
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

    if (props.notificationStyle === 'modern') {
      customStyle.border = {
        type: 'line',
        fg: tokens.colors.primary[400],
        bg: this.getCurrentBg(),
      };
      customStyle.bold = true;
      customStyle.shadow = true;
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

    // Position and alignment
    if (props.position === 'top') {
      customStyle.valign = 'top';
    } else if (props.position === 'bottom') {
      customStyle.valign = 'bottom';
    } else if (props.position === 'top-left') {
      customStyle.valign = 'top';
      customStyle.align = 'left';
    } else if (props.position === 'top-right') {
      customStyle.valign = 'top';
      customStyle.align = 'right';
    } else if (props.position === 'bottom-left') {
      customStyle.valign = 'bottom';
      customStyle.align = 'left';
    } else if (props.position === 'bottom-right') {
      customStyle.valign = 'bottom';
      customStyle.align = 'right';
    } else if (props.position === 'center') {
      customStyle.valign = 'middle';
      customStyle.align = 'center';
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Notification dimensions
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

    // Interactive notification
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Draggable notification
    if (props.draggable) {
      customStyle.draggable = true;
    }

    // Auto-hide notification
    if (props.autoHide && props.autoHide > 0) {
      customStyle.autoHide = true;
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
   * Get notification style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: NotificationVariants,
    size: NotificationSizes,
    state: NotificationStates
  ) {
    const mockProps: NotificationProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available notification styles
   */
  static getAllStyles() {
    const variants: NotificationVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'toast', 'alert', 'banner'];
    const sizes: NotificationSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: NotificationStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'loading', 'visible', 'hidden'];
    
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