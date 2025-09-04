import { BreadcrumbProps, BreadcrumbVariants, BreadcrumbSizes, BreadcrumbStates } from './Breadcrumb.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class BreadcrumbStyles {
  /**
   * Get breadcrumb style based on props
   */
  static getStyle(props: BreadcrumbProps) {
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
   * Base breadcrumb style
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
  private static getVariantStyle(variant: BreadcrumbVariants) {
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
  private static getSizeStyle(size: BreadcrumbSizes) {
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
  private static getStateStyle(state: BreadcrumbStates) {
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
   * Get custom styles based on breadcrumb props
   */
  private static getCustomStyle(props: BreadcrumbProps) {
    const customStyle: any = {};

    // Compact style
    if (props.breadcrumbStyle === 'compact') {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 0,
        bottom: 0,
      };
    }

    // Expanded style
    if (props.breadcrumbStyle === 'expanded') {
      customStyle.padding = {
        left: 6,
        right: 6,
        top: 3,
        bottom: 3,
      };
    }

    // Show icons
    if (props.showIcons) {
      customStyle.bold = true;
    }

    // Truncate
    if (props.truncate) {
      customStyle.ellipsis = props.ellipsis || '...';
    }

    // Direction
    if (props.direction === 'vertical') {
      customStyle.valign = 'top';
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
   * Get breadcrumb style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: BreadcrumbVariants,
    size: BreadcrumbSizes,
    state: BreadcrumbStates
  ) {
    const mockProps: BreadcrumbProps = {
      items: [],
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available breadcrumb styles
   */
  static getAllStyles() {
    const variants: BreadcrumbVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost'];
    const sizes: BreadcrumbSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: BreadcrumbStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success'];
    
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