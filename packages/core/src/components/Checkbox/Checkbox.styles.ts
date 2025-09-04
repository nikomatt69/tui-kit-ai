import { CheckboxProps, CheckboxVariants, CheckboxSizes, CheckboxStates } from './Checkbox.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class CheckboxStyles {
  /**
   * Get checkbox style based on props
   */
  static getStyle(props: CheckboxProps) {
    const variant = props.variant || 'default';
    const size = props.size || 'md';
    const state = props.state || 'default';
    
    const baseStyle = this.getBaseStyle();
    const variantStyle = this.getVariantStyle(variant);
    const sizeStyle = this.getSizeStyle(size);
    const stateStyle = this.getStateStyle(state, props);
    
    return {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      ...stateStyle,
      ...this.getCustomStyle(props),
    };
  }

  /**
   * Base checkbox style
   */
  private static getBaseStyle() {
    return {
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
      },
      align: 'left' as const,
      valign: 'middle' as const,
      bold: false,
      underline: false,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: CheckboxVariants) {
    switch (variant) {
      case 'primary':
        return {
          bg: tokens.colors.primary[50],
          fg: tokens.colors.primary[700],
          border: {
            type: 'line',
            fg: tokens.colors.primary[300],
            bg: tokens.colors.primary[50],
          },
        };
      
      case 'secondary':
        return {
          bg: tokens.colors.gray[50],
          fg: tokens.colors.gray[700],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[50],
          },
        };
      
      case 'success':
        return {
          bg: tokens.colors.success[50],
          fg: tokens.colors.success[700],
          border: {
            type: 'line',
            fg: tokens.colors.success[300],
            bg: tokens.colors.success[50],
          },
        };
      
      case 'warning':
        return {
          bg: tokens.colors.warning[50],
          fg: tokens.colors.warning[700],
          border: {
            type: 'line',
            fg: tokens.colors.warning[300],
            bg: tokens.colors.warning[50],
          },
        };
      
      case 'error':
        return {
          bg: tokens.colors.error[50],
          fg: tokens.colors.error[700],
          border: {
            type: 'line',
            fg: tokens.colors.error[300],
            bg: tokens.colors.error[50],
          },
        };
      
      case 'info':
        return {
          bg: tokens.colors.info[50],
          fg: tokens.colors.info[700],
          border: {
            type: 'line',
            fg: tokens.colors.info[300],
            bg: tokens.colors.info[50],
          },
        };
      
      case 'outline':
        return {
          bg: 'transparent',
          fg: tokens.colors.primary[600],
          border: {
            type: 'line',
            fg: tokens.colors.primary[300],
            bg: 'transparent',
          },
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
        };
      
      default:
        return {
          bg: tokens.colors.gray[50],
          fg: tokens.colors.gray[700],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.gray[50],
          },
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: CheckboxSizes) {
    switch (size) {
      case 'xs':
        return {
          padding: {
            left: 1,
            right: 1,
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
        };
      
      case 'md':
        return {
          padding: {
            left: 3,
            right: 3,
            top: 1,
            bottom: 1,
          },
        };
      
      case 'lg':
        return {
          padding: {
            left: 4,
            right: 4,
            top: 2,
            bottom: 2,
          },
        };
      
      case 'xl':
        return {
          padding: {
            left: 6,
            right: 6,
            top: 2,
            bottom: 2,
          },
        };
      
      default:
        return {
          padding: {
            left: 3,
            right: 3,
            top: 1,
            bottom: 1,
          },
        };
    }
  }

  /**
   * Get state-specific styles
   */
  private static getStateStyle(state: CheckboxStates, props: CheckboxProps) {
    switch (state) {
      case 'hover':
        return {
          bg: this.adjustColor(this.getCurrentBg(), -5),
          fg: this.adjustColor(this.getCurrentFg(), 5),
        };
      
      case 'active':
        return {
          bg: this.adjustColor(this.getCurrentBg(), -10),
          fg: this.adjustColor(this.getCurrentFg(), 10),
        };
      
      case 'disabled':
        return {
          bg: tokens.colors.gray[100],
          fg: tokens.colors.gray[400],
          border: {
            type: 'line',
            fg: tokens.colors.gray[200],
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
      
      case 'checked':
        return {
          bg: tokens.colors.primary[100],
          fg: tokens.colors.primary[800],
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: tokens.colors.primary[100],
          },
        };
      
      case 'indeterminate':
        return {
          bg: tokens.colors.warning[100],
          fg: tokens.colors.warning[800],
          border: {
            type: 'line',
            fg: tokens.colors.warning[400],
            bg: tokens.colors.warning[100],
          },
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
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on checkbox props
   */
  private static getCustomStyle(props: CheckboxProps) {
    const customStyle: any = {};

    // Checkbox style variants
    if (props.checkboxStyle === 'outline') {
      customStyle.border = {
        type: 'line',
        fg: tokens.colors.primary[400],
        bg: 'transparent',
      };
    }

    if (props.checkboxStyle === 'ghost') {
      customStyle.border = {
        type: 'line',
        fg: 'transparent',
        bg: 'transparent',
      };
    }

    if (props.checkboxStyle === 'filled') {
      customStyle.bg = tokens.colors.primary[100];
      customStyle.fg = tokens.colors.primary[800];
    }

    // Label position
    if (props.labelPosition === 'right') {
      customStyle.align = 'left';
    } else if (props.labelPosition === 'left') {
      customStyle.align = 'right';
    }

    // Label alignment
    if (props.labelAlign) {
      customStyle.align = props.labelAlign;
    }

    // Required checkbox
    if (props.required) {
      customStyle.border = {
        ...customStyle.border,
        fg: tokens.colors.error[400],
      };
    }

    // Read-only checkbox
    if (props.readOnly) {
      customStyle.dim = true;
    }

    return customStyle;
  }

  /**
   * Get current background color for state changes
   */
  private static getCurrentBg(): string {
    return tokens.colors.gray[50];
  }

  /**
   * Get current foreground color for state changes
   */
  private static getCurrentFg(): string {
    return tokens.colors.gray[700];
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
   * Get checkbox style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: CheckboxVariants,
    size: CheckboxSizes,
    state: CheckboxStates
  ) {
    const mockProps: CheckboxProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available checkbox styles
   */
  static getAllStyles() {
    const variants: CheckboxVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost'];
    const sizes: CheckboxSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: CheckboxStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'checked', 'indeterminate', 'error', 'success'];
    
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