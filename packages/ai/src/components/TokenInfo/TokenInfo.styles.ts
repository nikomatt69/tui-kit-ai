import { TokenInfoProps, TokenInfoVariants, TokenInfoSizes, TokenInfoStates, TokenType } from './TokenInfo.types';
import { tokens, semanticColors } from '../../../core/src/theming/tokens';

export class TokenInfoStyles {
  /**
   * Get token info style based on props
   */
  static getStyle(props: TokenInfoProps) {
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
   * Get base token info style
   */
  static getBaseStyle() {
    return {
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
        bg: tokens.colors.gray[50],
      },
      style: {
        bg: tokens.colors.gray[50],
        fg: tokens.colors.gray[900],
        border: {
          fg: tokens.colors.gray[300],
          bg: tokens.colors.gray[50],
        },
      },
      padding: {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1,
      },
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: ' ',
        track: {
          bg: tokens.colors.gray[200],
        },
        style: {
          inverse: true,
        },
      },
    };
  }

  /**
   * Get variant-specific styles
   */
  static getVariantStyle(variant: TokenInfoVariants) {
    const variants = {
      default: {
        border: {
          fg: tokens.colors.blue[400],
          bg: tokens.colors.blue[50],
        },
        style: {
          bg: tokens.colors.blue[50],
          border: {
            fg: tokens.colors.blue[400],
            bg: tokens.colors.blue[50],
          },
        },
      },
      compact: {
        padding: {
          left: 1,
          right: 1,
          top: 0,
          bottom: 0,
        },
        border: {
          fg: tokens.colors.gray[400],
          bg: tokens.colors.gray[25],
        },
        style: {
          bg: tokens.colors.gray[25],
          border: {
            fg: tokens.colors.gray[400],
            bg: tokens.colors.gray[25],
          },
        },
      },
      detailed: {
        padding: {
          left: 3,
          right: 3,
          top: 2,
          bottom: 2,
        },
        border: {
          fg: tokens.colors.purple[400],
          bg: tokens.colors.purple[50],
        },
        style: {
          bg: tokens.colors.purple[50],
          border: {
            fg: tokens.colors.purple[400],
            bg: tokens.colors.purple[50],
          },
        },
      },
      minimal: {
        border: {
          fg: tokens.colors.gray[200],
          bg: tokens.colors.white,
        },
        style: {
          bg: tokens.colors.white,
          fg: tokens.colors.gray[900],
          border: {
            fg: tokens.colors.gray[200],
            bg: tokens.colors.white,
          },
        },
        padding: {
          left: 1,
          right: 1,
          top: 0,
          bottom: 0,
        },
      },
      expanded: {
        padding: {
          left: 4,
          right: 4,
          top: 3,
          bottom: 3,
        },
        border: {
          fg: tokens.colors.green[400],
          bg: tokens.colors.green[50],
        },
        style: {
          bg: tokens.colors.green[50],
          border: {
            fg: tokens.colors.green[400],
            bg: tokens.colors.green[50],
          },
        },
      },
    };

    return variants[variant] || variants.default;
  }

  /**
   * Get size-specific styles
   */
  static getSizeStyle(size: TokenInfoSizes) {
    const sizes = {
      xs: {
        height: 6,
        padding: {
          left: 1,
          right: 1,
          top: 0,
          bottom: 0,
        },
      },
      sm: {
        height: 10,
        padding: {
          left: 2,
          right: 2,
          top: 1,
          bottom: 1,
        },
      },
      md: {
        height: 14,
        padding: {
          left: 2,
          right: 2,
          top: 1,
          bottom: 1,
        },
      },
      lg: {
        height: 18,
        padding: {
          left: 3,
          right: 3,
          top: 2,
          bottom: 2,
        },
      },
      xl: {
        height: 22,
        padding: {
          left: 3,
          right: 3,
          top: 2,
          bottom: 2,
        },
      },
      full: {
        height: '100%',
        padding: {
          left: 4,
          right: 4,
          top: 2,
          bottom: 2,
        },
      },
    };

    return sizes[size] || sizes.md;
  }

  /**
   * Get state-specific styles
   */
  static getStateStyle(state: TokenInfoStates) {
    const states = {
      default: {
        style: {
          fg: tokens.colors.gray[900],
        },
      },
      loading: {
        style: {
          fg: tokens.colors.blue[600],
        },
        border: {
          fg: tokens.colors.blue[400],
        },
      },
      error: {
        style: {
          fg: tokens.colors.red[600],
        },
        border: {
          fg: tokens.colors.red[400],
        },
      },
      success: {
        style: {
          fg: tokens.colors.green[600],
        },
        border: {
          fg: tokens.colors.green[400],
        },
      },
      focused: {
        style: {
          fg: tokens.colors.blue[700],
        },
        border: {
          fg: tokens.colors.blue[500],
        },
      },
      disabled: {
        style: {
          fg: tokens.colors.gray[500],
        },
        border: {
          fg: tokens.colors.gray[400],
        },
      },
    };

    return states[state] || states.default;
  }

  /**
   * Get custom style overrides
   */
  static getCustomStyle(props: TokenInfoProps) {
    const customStyle: Record<string, any> = {};

    if (props.borderRadius) {
      customStyle.borderRadius = props.borderRadius;
    }

    if (props.shadow) {
      customStyle.shadow = props.shadow;
    }

    if (props.animation) {
      customStyle.animation = props.animation;
    }

    return customStyle;
  }

  /**
   * Get header style
   */
  static getHeaderStyle(props: TokenInfoProps) {
    const variant = props.variant || 'default';
    const variantStyle = this.getVariantStyle(variant);
    
    return {
      bg: variantStyle.style.bg,
      fg: variantStyle.style.fg,
      border: {
        type: 'line',
        fg: variantStyle.border.fg,
        bg: variantStyle.style.bg,
      },
      padding: {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1,
      },
      align: 'left' as 'left' | 'center' | 'right',
      bold: true,
    };
  }

  /**
   * Get content area style
   */
  static getContentStyle(props: TokenInfoProps) {
    const variant = props.variant || 'default';
    const variantStyle = this.getVariantStyle(variant);
    
    return {
      bg: variantStyle.style.bg,
      fg: variantStyle.style.fg,
      padding: {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1,
      },
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: ' ',
        track: {
          bg: variantStyle.border.fg,
        },
        style: {
          inverse: true,
        },
      },
    };
  }

  /**
   * Get progress bar style
   */
  static getProgressStyle(props: TokenInfoProps) {
    const variant = props.variant || 'default';
    const progressColor = props.progressColor || tokens.colors.blue[500];
    
    return {
      bg: tokens.colors.gray[200],
      fg: progressColor,
      height: 1,
      style: {
        bg: tokens.colors.gray[200],
        fg: progressColor,
      },
    };
  }

  /**
   * Get breakdown display style
   */
  static getBreakdownStyle(props: TokenInfoProps) {
    const variant = props.variant || 'default';
    const variantStyle = this.getVariantStyle(variant);
    
    return {
      bg: variantStyle.style.bg,
      fg: variantStyle.style.fg,
      border: {
        type: 'line',
        fg: variantStyle.border.fg,
        bg: variantStyle.style.bg,
      },
      padding: {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1,
      },
      align: 'left' as 'left' | 'center' | 'right',
    };
  }

  /**
   * Get cost display style
   */
  static getCostStyle(props: TokenInfoProps) {
    return {
      bg: tokens.colors.green[50],
      fg: tokens.colors.green[700],
      border: {
        type: 'line',
        fg: tokens.colors.green[300],
        bg: tokens.colors.green[50],
      },
      padding: {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1,
      },
      align: 'right' as 'left' | 'center' | 'right',
      bold: true,
    };
  }

  /**
   * Get model info style
   */
  static getModelStyle(props: TokenInfoProps) {
    const variant = props.variant || 'default';
    const variantStyle = this.getVariantStyle(variant);
    
    return {
      bg: variantStyle.style.bg,
      fg: variantStyle.style.fg,
      border: {
        type: 'line',
        fg: variantStyle.border.fg,
        bg: variantStyle.style.bg,
      },
      padding: {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1,
      },
      align: 'left' as 'left' | 'center' | 'right',
    };
  }

  /**
   * Get history display style
   */
  static getHistoryStyle(props: TokenInfoProps) {
    const variant = props.variant || 'default';
    const variantStyle = this.getVariantStyle(variant);
    
    return {
      bg: variantStyle.style.bg,
      fg: variantStyle.style.fg,
      border: {
        type: 'line',
        fg: variantStyle.border.fg,
        bg: variantStyle.style.bg,
      },
      padding: {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1,
      },
      align: 'left' as 'left' | 'center' | 'right',
      scrollable: true,
      alwaysScroll: true,
    };
  }

  /**
   * Get token type color
   */
  static getTokenTypeColor(tokenType: TokenType) {
    const tokenColors = {
      input: tokens.colors.blue[500],
      output: tokens.colors.green[500],
      total: tokens.colors.purple[500],
      prompt: tokens.colors.blue[600],
      completion: tokens.colors.green[600],
      system: tokens.colors.gray[600],
      user: tokens.colors.blue[700],
      assistant: tokens.colors.green[700],
      context: tokens.colors.purple[600],
      response: tokens.colors.orange[600],
    };

    return tokenColors[tokenType] || tokens.colors.gray[500];
  }

  /**
   * Get token type style
   */
  static getTokenTypeStyle(tokenType: TokenType) {
    const color = this.getTokenTypeColor(tokenType);
    
    return {
      fg: color,
      bold: true,
    };
  }

  /**
   * Get progress status color
   */
  static getProgressStatusColor(percentage: number) {
    if (percentage >= 90) {
      return tokens.colors.red[500];
    } else if (percentage >= 75) {
      return tokens.colors.yellow[500];
    } else {
      return tokens.colors.green[500];
    }
  }

  /**
   * Get cost status color
   */
  static getCostStatusColor(cost: number, threshold: number = 10) {
    if (cost >= threshold) {
      return tokens.colors.red[500];
    } else if (cost >= threshold / 2) {
      return tokens.colors.yellow[500];
    } else {
      return tokens.colors.green[500];
    }
  }
}