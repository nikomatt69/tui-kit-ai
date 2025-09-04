import { PanelProps, PanelVariants, PanelSizes, PanelStates } from './Panel.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class PanelStyles {
  /**
   * Get panel style based on props
   */
  static getStyle(props: PanelProps) {
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
   * Base panel style
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
      valign: 'top' as const,
      bold: false,
      underline: false,
      shadow: false,
      zIndex: 1,
      headerColor: tokens.colors.gray[700],
      footerColor: tokens.colors.gray[600],
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: PanelVariants) {
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
          headerColor: tokens.colors.primary[700],
          footerColor: tokens.colors.primary[600],
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
          headerColor: tokens.colors.gray[700],
          footerColor: tokens.colors.gray[600],
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
          headerColor: tokens.colors.success[700],
          footerColor: tokens.colors.success[600],
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
          headerColor: tokens.colors.warning[700],
          footerColor: tokens.colors.warning[600],
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
          headerColor: tokens.colors.error[700],
          footerColor: tokens.colors.error[600],
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
          headerColor: tokens.colors.info[700],
          footerColor: tokens.colors.info[600],
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
          headerColor: tokens.colors.primary[600],
          footerColor: tokens.colors.primary[500],
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
          headerColor: tokens.colors.gray[500],
          footerColor: tokens.colors.gray[400],
        };
      
      case 'elevated':
        return {
          bg: tokens.colors.white,
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.white,
          },
          shadow: true,
          zIndex: 10,
          headerColor: tokens.colors.gray[700],
          footerColor: tokens.colors.gray[600],
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
          headerColor: tokens.colors.gray[700],
          footerColor: tokens.colors.gray[600],
        };
      
      case 'transparent':
        return {
          bg: 'transparent',
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: 'transparent',
            bg: 'transparent',
          },
          headerColor: tokens.colors.gray[700],
          footerColor: tokens.colors.gray[600],
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
          headerColor: tokens.colors.gray[700],
          footerColor: tokens.colors.gray[600],
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: PanelSizes) {
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
            left: 3,
            right: 3,
            top: 3,
            bottom: 3,
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
            top: 4,
            bottom: 4,
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
      
      case 'full':
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
      
      default:
        return {
          padding: {
            left: 3,
            right: 3,
            top: 3,
            bottom: 3,
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
  private static getStateStyle(state: PanelStates) {
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
      
      case 'collapsed':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.gray[400],
            bg: this.getCurrentBg(),
          },
          dim: true,
        };
      
      case 'expanded':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: this.getCurrentBg(),
          },
          bold: true,
        };
      
      default:
        return {};
    }
  }

  /**
   * Get custom styles based on panel props
   */
  private static getCustomStyle(props: PanelProps) {
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

    if (props.headerColor) {
      customStyle.headerColor = props.headerColor;
    }

    if (props.footerColor) {
      customStyle.footerColor = props.footerColor;
    }

    // Panel style variants
    if (props.panelStyle === 'compact') {
      customStyle.padding = {
        left: 2,
        right: 2,
        top: 2,
        bottom: 2,
      };
    }

    if (props.panelStyle === 'detailed') {
      customStyle.padding = {
        left: 8,
        right: 8,
        top: 6,
        bottom: 6,
      };
    }

    if (props.panelStyle === 'minimal') {
      customStyle.padding = {
        left: 1,
        right: 1,
        top: 1,
        bottom: 1,
      };
      customStyle.border = {
        type: 'none',
        fg: 'transparent',
        bg: 'transparent',
      };
    }

    if (props.panelStyle === 'modern') {
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
        top: 2,
        bottom: 2,
      };
    }

    if (props.elevated) {
      customStyle.shadow = true;
      customStyle.zIndex = 10;
    }

    // Position and alignment
    if (props.position === 'top') {
      customStyle.valign = 'top';
    } else if (props.position === 'bottom') {
      customStyle.valign = 'bottom';
    } else if (props.position === 'left') {
      customStyle.align = 'left';
    } else if (props.position === 'right') {
      customStyle.align = 'right';
    } else if (props.position === 'center') {
      customStyle.valign = 'middle';
      customStyle.align = 'center';
    } else if (props.position === 'floating') {
      customStyle.zIndex = 100;
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Panel dimensions
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

    // Panel layout
    if (props.flex !== undefined) {
      customStyle.flex = props.flex;
    }

    if (props.flexGrow !== undefined) {
      customStyle.flexGrow = props.flexGrow;
    }

    if (props.flexShrink !== undefined) {
      customStyle.flexShrink = props.flexShrink;
    }

    if (props.flexBasis !== undefined) {
      customStyle.flexBasis = props.flexBasis;
    }

    // Interactive panel
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Collapsible panel
    if (props.collapsible) {
      customStyle.collapsible = true;
    }

    // Resizable panel
    if (props.resizable) {
      customStyle.resizable = true;
    }

    // Draggable panel
    if (props.draggable) {
      customStyle.draggable = true;
    }

    // Scrollable panel
    if (props.scrollable) {
      customStyle.scrollable = true;
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
   * Get panel style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: PanelVariants,
    size: PanelSizes,
    state: PanelStates
  ) {
    const mockProps: PanelProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available panel styles
   */
  static getAllStyles() {
    const variants: PanelVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'elevated', 'bordered', 'transparent'];
    const sizes: PanelSizes[] = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
    const states: PanelStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'loading', 'collapsed', 'expanded'];
    
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