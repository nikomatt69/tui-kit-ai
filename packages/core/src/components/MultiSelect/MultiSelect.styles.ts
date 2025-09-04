import { MultiSelectProps, MultiSelectVariants, MultiSelectSizes, MultiSelectStates } from './MultiSelect.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class MultiSelectStyles {
  /**
   * Get multi select style based on props
   */
  static getStyle(props: MultiSelectProps) {
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
   * Base multi select style
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
      align: 'left' as const,
      valign: 'middle' as const,
      bold: false,
      underline: false,
      selectionBg: tokens.colors.primary[100],
      selectionFg: tokens.colors.primary[800],
      dropdownBg: tokens.colors.white,
      dropdownFg: tokens.colors.gray[800],
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: MultiSelectVariants) {
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
          selectionBg: tokens.colors.primary[200],
          selectionFg: tokens.colors.primary[900],
          dropdownBg: tokens.colors.primary[50],
          dropdownFg: tokens.colors.primary[900],
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
          selectionBg: tokens.colors.gray[200],
          selectionFg: tokens.colors.gray[800],
          dropdownBg: tokens.colors.gray[50],
          dropdownFg: tokens.colors.gray[800],
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
          selectionBg: tokens.colors.success[200],
          selectionFg: tokens.colors.success[900],
          dropdownBg: tokens.colors.success[50],
          dropdownFg: tokens.colors.success[900],
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
          selectionBg: tokens.colors.warning[200],
          selectionFg: tokens.colors.warning[900],
          dropdownBg: tokens.colors.warning[50],
          dropdownFg: tokens.colors.warning[900],
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
          selectionBg: tokens.colors.error[200],
          selectionFg: tokens.colors.error[900],
          dropdownBg: tokens.colors.error[50],
          dropdownFg: tokens.colors.error[900],
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
          selectionBg: tokens.colors.info[200],
          selectionFg: tokens.colors.info[900],
          dropdownBg: tokens.colors.info[50],
          dropdownFg: tokens.colors.info[900],
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
          selectionBg: tokens.colors.primary[100],
          selectionFg: tokens.colors.primary[800],
          dropdownBg: tokens.colors.white,
          dropdownFg: tokens.colors.gray[800],
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
          selectionBg: tokens.colors.gray[100],
          selectionFg: tokens.colors.gray[800],
          dropdownBg: tokens.colors.white,
          dropdownFg: tokens.colors.gray[800],
        };
      
      case 'filled':
        return {
          bg: tokens.colors.gray[100],
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: 'transparent',
            bg: tokens.colors.gray[100],
          },
          selectionBg: tokens.colors.primary[200],
          selectionFg: tokens.colors.primary[900],
          dropdownBg: tokens.colors.white,
          dropdownFg: tokens.colors.gray[800],
        };
      
      case 'bordered':
        return {
          bg: tokens.colors.white,
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: tokens.colors.gray[400],
            bg: tokens.colors.white,
          },
          selectionBg: tokens.colors.primary[100],
          selectionFg: tokens.colors.primary[800],
          dropdownBg: tokens.colors.white,
          dropdownFg: tokens.colors.gray[800],
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
          selectionBg: tokens.colors.primary[100],
          selectionFg: tokens.colors.primary[800],
          dropdownBg: tokens.colors.white,
          dropdownFg: tokens.colors.gray[800],
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: MultiSelectSizes) {
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
  private static getStateStyle(state: MultiSelectStates) {
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
      
      case 'open':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: this.getCurrentBg(),
          },
          bold: true,
        };
      
      case 'closed':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.gray[400],
            bg: this.getCurrentBg(),
          },
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on multi select props
   */
  private static getCustomStyle(props: MultiSelectProps) {
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

    if (props.selectionColor) {
      customStyle.selectionBg = props.selectionColor;
    }

    // Multi select style variants
    if (props.multiSelectStyle === 'compact') {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 0,
        bottom: 0,
      };
    }

    if (props.multiSelectStyle === 'detailed') {
      customStyle.padding = {
        left: 6,
        right: 6,
        top: 4,
        bottom: 4,
      };
    }

    if (props.multiSelectStyle === 'minimal') {
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

    if (props.multiSelectStyle === 'modern') {
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

    // Display mode specific styles
    if (props.displayMode === 'tags') {
      customStyle.selectionBg = tokens.colors.primary[200];
      customStyle.selectionFg = tokens.colors.primary[900];
    }

    if (props.displayMode === 'chips') {
      customStyle.selectionBg = tokens.colors.primary[100];
      customStyle.selectionFg = tokens.colors.primary[800];
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Interactive multi select
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Searchable multi select
    if (props.searchable) {
      customStyle.searchable = true;
    }

    // Dropdown dimensions
    if (props.dropdownHeight) {
      customStyle.dropdownHeight = props.dropdownHeight;
    }

    if (props.dropdownWidth) {
      customStyle.dropdownWidth = props.dropdownWidth;
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
   * Get multi select style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: MultiSelectVariants,
    size: MultiSelectSizes,
    state: MultiSelectStates
  ) {
    const mockProps: MultiSelectProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available multi select styles
   */
  static getAllStyles() {
    const variants: MultiSelectVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'filled', 'bordered'];
    const sizes: MultiSelectSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const states: MultiSelectStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'loading', 'open', 'closed'];
    
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