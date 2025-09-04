import { ButtonProps, ButtonVariants, ButtonSizes, ButtonStates } from './Button.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class ButtonStyles {
  /**
   * Get button style based on props
   */
  static getStyle(props: ButtonProps) {
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
   * Base button style
   */
  private static getBaseStyle() {
    return {
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
      },
      align: 'center' as const,
      bold: false,
      underline: false,
      blink: false,
      dim: false,
      inverse: false,
      invisible: false,
      transparent: false,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: ButtonVariants) {
    switch (variant) {
      case 'primary':
        return {
          bg: tokens.colors.primary[500],
          fg: 'white',
          border: {
            type: 'line',
            fg: tokens.colors.primary[600],
            bg: tokens.colors.primary[500],
          },
        };
      
      case 'secondary':
        return {
          bg: tokens.colors.gray[100],
          fg: tokens.colors.gray[900],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[100],
          },
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[500],
          fg: 'white',
          border: {
            type: 'line',
            fg: tokens.colors.success[600],
            bg: tokens.colors.success[500],
          },
        };
      
      case 'warning':
        return {
          bg: tokens.colors.warning[500],
          fg: 'white',
          border: {
            type: 'line',
            fg: tokens.colors.warning[600],
            bg: tokens.colors.warning[500],
          },
        };
      
      case 'error':
        return {
          bg: tokens.colors.error[500],
          fg: 'white',
          border: {
            type: 'line',
            fg: tokens.colors.error[600],
            bg: tokens.colors.error[500],
          },
        };
      
      case 'info':
        return {
          bg: tokens.colors.info[500],
          fg: 'white',
          border: {
            type: 'line',
            fg: tokens.colors.info[600],
            bg: tokens.colors.info[500],
          },
        };
      
      case 'outline':
        return {
          bg: 'transparent',
          fg: tokens.colors.primary[500],
          border: {
            type: 'line',
            fg: tokens.colors.primary[500],
            bg: 'transparent',
          },
        };
      
      case 'ghost':
        return {
          bg: 'transparent',
          fg: tokens.colors.gray[700],
          border: {
            type: 'line',
            fg: 'transparent',
            bg: 'transparent',
          },
        };
      
      case 'destructive':
        return {
          bg: tokens.colors.error[500],
          fg: 'white',
          border: {
            type: 'line',
            fg: tokens.colors.error[600],
            bg: tokens.colors.error[500],
          },
        };
      
      case 'link':
        return {
          bg: 'transparent',
          fg: tokens.colors.primary[500],
          border: {
            type: 'line',
            fg: 'transparent',
            bg: 'transparent',
          },
          underline: true,
        };
      
      default:
        return {
          bg: tokens.colors.gray[100],
          fg: tokens.colors.gray[900],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[100],
          },
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: ButtonSizes) {
    switch (size) {
      case 'xs':
        return {
          padding: {
            left: 2,
            right: 2,
            top: 0,
            bottom: 0,
          },
        };
      
      case 'sm':
        return {
          padding: {
            left: 3,
            right: 3,
            top: 1,
            bottom: 1,
          },
        };
      
      case 'md':
        return {
          padding: {
            left: 4,
            right: 4,
            top: 2,
            bottom: 2,
          },
        };
      
      case 'lg':
        return {
          padding: {
            left: 6,
            right: 6,
            top: 3,
            bottom: 3,
          },
        };
      
      case 'xl':
        return {
          padding: {
            left: 8,
            right: 8,
            top: 4,
            bottom: 4,
          },
        };
      
      case 'icon':
        return {
          padding: {
            left: 2,
            right: 2,
            top: 2,
            bottom: 2,
          },
        };
      
      default:
        return {
          padding: {
            left: 4,
            right: 4,
            top: 2,
            bottom: 2,
          },
        };
    }
  }

  /**
   * Get state-specific styles
   */
  private static getStateStyle(state: ButtonStates) {
    switch (state) {
      case 'hover':
        return {
          bg: this.adjustColor(this.getCurrentBg(), -10),
          fg: this.adjustColor(this.getCurrentFg(), 10),
        };
      
      case 'active':
        return {
          bg: this.adjustColor(this.getCurrentBg(), -20),
          fg: this.adjustColor(this.getCurrentFg(), 20),
        };
      
      case 'disabled':
        return {
          bg: tokens.colors.gray[200],
          fg: tokens.colors.gray[400],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[200],
          },
          dim: true,
        };
      
      case 'loading':
        return {
          dim: true,
          blink: true,
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
          fg: tokens.colors.error[700],
          border: {
            type: 'line',
            fg: tokens.colors.error[500],
            bg: tokens.colors.error[100],
          },
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[100],
          fg: tokens.colors.success[700],
          border: {
            type: 'line',
            fg: tokens.colors.success[500],
            bg: tokens.colors.success[100],
          },
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on button props
   */
  private static getCustomStyle(props: ButtonProps) {
    const customStyle: any = {};

    // Full width button
    if (props.fullWidth) {
      customStyle.width = '100%';
    }

    // Rounded button
    if (props.rounded) {
      customStyle.border = {
        ...customStyle.border,
        type: 'round',
      };
    }

    // Icon button
    if (props.icon) {
      customStyle.align = 'center';
      if (props.size === 'icon') {
        customStyle.width = 'auto';
        customStyle.height = 'auto';
      }
    }

    return customStyle;
  }

  /**
   * Get current background color for state changes
   */
  private static getCurrentBg(): string {
    // This would need to be implemented based on the current button state
    // For now, return a default color
    return tokens.colors.gray[100];
  }

  /**
   * Get current foreground color for state changes
   */
  private static getCurrentFg(): string {
    // This would need to be implemented based on the current button state
    // For now, return a default color
    return tokens.colors.gray[900];
  }

  /**
   * Adjust color brightness (helper function)
   */
  private static adjustColor(color: string, amount: number): string {
    // This is a simplified color adjustment
    // In a real implementation, you'd want proper color manipulation
    if (color.includes('#')) {
      // Basic hex color adjustment
      return color;
    }
    return color;
  }

  /**
   * Get button style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: ButtonVariants,
    size: ButtonSizes,
    state: ButtonStates
  ) {
    const mockProps: ButtonProps = {
      label: '',
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available button styles
   */
  static getAllStyles() {
    const variants: ButtonVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'destructive', 'link'];
    const sizes: ButtonSizes[] = ['xs', 'sm', 'md', 'lg', 'xl', 'icon'];
    const states: ButtonStates[] = ['default', 'hover', 'active', 'disabled', 'loading', 'focus', 'error', 'success'];
    
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