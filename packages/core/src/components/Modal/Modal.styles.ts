import { ModalProps, ModalVariants, ModalSizes, ModalStates } from './Modal.types';
import { tokens, semanticColors } from '../../theming/tokens';

export class ModalStyles {
  /**
   * Get modal style based on props
   */
  static getStyle(props: ModalProps) {
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
   * Base modal style
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
      valign: 'middle' as const,
      bold: false,
      underline: false,
      shadow: true,
      zIndex: 1000,
    };
  }

  /**
   * Get variant-specific styles
   */
  private static getVariantStyle(variant: ModalVariants) {
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
      
      case 'dialog':
        return {
          bg: tokens.colors.white,
          fg: tokens.colors.gray[800],
          border: {
            type: 'line',
            fg: tokens.colors.gray[300],
            bg: tokens.colors.white,
          },
          shadow: true,
        };
      
      case 'alert':
        return {
          bg: tokens.colors.warning[50],
          fg: tokens.colors.warning[900],
          border: {
            type: 'line',
            fg: tokens.colors.warning[400],
            bg: tokens.colors.warning[50],
          },
          bold: true,
        };
      
      case 'confirm':
        return {
          bg: tokens.colors.info[50],
          fg: tokens.colors.info[900],
          border: {
            type: 'line',
            fg: tokens.colors.info[400],
            bg: tokens.colors.info[50],
          },
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
        };
    }
  }

  /**
   * Get size-specific styles
   */
  private static getSizeStyle(size: ModalSizes) {
    switch (size) {
      case 'xs':
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
      
      case 'sm':
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
      
      case 'md':
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
  private static getStateStyle(state: ModalStates) {
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
      
      case 'open':
        return {
          border: {
            type: 'line',
            fg: tokens.colors.primary[400],
            bg: this.getCurrentBg(),
          },
          bold: true,
          zIndex: 1001,
        };
      
      case 'closed':
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
   * Get custom styles based on modal props
   */
  private static getCustomStyle(props: ModalProps) {
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

    if (props.overlayColor) {
      customStyle.overlayColor = props.overlayColor;
    }

    // Modal style variants
    if (props.modalStyle === 'compact') {
      customStyle.padding = {
        left: 2,
        right: 2,
        top: 2,
        bottom: 2,
      };
    }

    if (props.modalStyle === 'detailed') {
      customStyle.padding = {
        left: 8,
        right: 8,
        top: 8,
        bottom: 8,
      };
    }

    if (props.modalStyle === 'minimal') {
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

    if (props.modalStyle === 'modern') {
      customStyle.border = {
        type: 'line',
        fg: tokens.colors.primary[400],
        bg: this.getCurrentBg(),
      };
      customStyle.bold = true;
      customStyle.shadow = true;
    }

    // Display options
    if (props.showOverlay) {
      customStyle.zIndex = 1001;
    }

    if (props.backdropBlur) {
      customStyle.backdropBlur = true;
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
    }

    // Custom alignment
    if (props.align) {
      customStyle.align = props.align;
    }

    if (props.valign) {
      customStyle.valign = props.valign;
    }

    // Modal dimensions
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

    // Interactive modal
    if (props.interactive || props.clickable) {
      customStyle.cursor = 'pointer';
    }

    // Draggable modal
    if (props.draggable) {
      customStyle.draggable = true;
    }

    // Resizable modal
    if (props.resizable) {
      customStyle.resizable = true;
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
   * Get modal style for specific variant/size/state combination
   */
  static getStyleForCombination(
    variant: ModalVariants,
    size: ModalSizes,
    state: ModalStates
  ) {
    const mockProps: ModalProps = {
      variant,
      size,
      state,
    };
    
    return this.getStyle(mockProps);
  }

  /**
   * Get all available modal styles
   */
  static getAllStyles() {
    const variants: ModalVariants[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost', 'dialog', 'alert', 'confirm'];
    const sizes: ModalSizes[] = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
    const states: ModalStates[] = ['default', 'hover', 'active', 'disabled', 'focus', 'error', 'success', 'open', 'closed'];
    
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