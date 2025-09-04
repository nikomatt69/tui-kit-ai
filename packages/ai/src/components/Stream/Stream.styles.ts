import { StreamProps, StreamVariants, StreamSizes, StreamStates } from './Stream.types';
import { tokens, semanticColors } from '../../../core/src/theming/tokens';

export class StreamStyles {
  /**
   * Get stream style based on props
   */
  static getStyle(props: StreamProps) {
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
   * Get base stream style
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
  static getVariantStyle(variant: StreamVariants) {
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
      realtime: {
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
      buffered: {
        border: {
          fg: tokens.colors.yellow[400],
          bg: tokens.colors.yellow[50],
        },
        style: {
          bg: tokens.colors.yellow[50],
          border: {
            fg: tokens.colors.yellow[400],
            bg: tokens.colors.yellow[50],
          },
        },
      },
      chunked: {
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
          bg: tokens.colors.gray[25],
        },
        style: {
          bg: tokens.colors.gray[25],
          border: {
            fg: tokens.colors.gray[200],
            bg: tokens.colors.gray[25],
          },
        },
        padding: {
          left: 1,
          right: 1,
          top: 0,
          bottom: 0,
        },
      },
    };

    return variants[variant] || variants.default;
  }

  /**
   * Get size-specific styles
   */
  static getSizeStyle(size: StreamSizes) {
    const sizes = {
      xs: {
        height: 8,
        padding: {
          left: 1,
          right: 1,
          top: 0,
          bottom: 0,
        },
      },
      sm: {
        height: 12,
        padding: {
          left: 2,
          right: 2,
          top: 1,
          bottom: 1,
        },
      },
      md: {
        height: 16,
        padding: {
          left: 2,
          right: 2,
          top: 1,
          bottom: 1,
        },
      },
      lg: {
        height: 20,
        padding: {
          left: 3,
          right: 3,
          top: 2,
          bottom: 2,
        },
      },
      xl: {
        height: 24,
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
  static getStateStyle(state: StreamStates) {
    const states = {
      default: {
        style: {
          fg: tokens.colors.gray[900],
        },
      },
      connecting: {
        style: {
          fg: tokens.colors.blue[600],
        },
        border: {
          fg: tokens.colors.blue[400],
        },
      },
      streaming: {
        style: {
          fg: tokens.colors.green[600],
        },
        border: {
          fg: tokens.colors.green[400],
        },
      },
      paused: {
        style: {
          fg: tokens.colors.yellow[600],
        },
        border: {
          fg: tokens.colors.yellow[400],
        },
      },
      completed: {
        style: {
          fg: tokens.colors.green[700],
        },
        border: {
          fg: tokens.colors.green[500],
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
      focused: {
        style: {
          fg: tokens.colors.blue[700],
        },
        border: {
          fg: tokens.colors.blue[500],
        },
      },
    };

    return states[state] || states.default;
  }

  /**
   * Get custom style overrides
   */
  static getCustomStyle(props: StreamProps) {
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
  static getHeaderStyle(props: StreamProps) {
    const variant = props.variant || 'default';
    const size = props.size || 'md';
    
    const baseHeaderStyle = {
      bg: tokens.colors.gray[100],
      fg: tokens.colors.gray[900],
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
        bg: tokens.colors.gray[100],
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

    // Add variant-specific header styling
    const variantHeaders = {
      realtime: {
        bg: tokens.colors.green[100],
        fg: tokens.colors.green[900],
        border: {
          fg: tokens.colors.green[300],
          bg: tokens.colors.green[100],
        },
      },
      buffered: {
        bg: tokens.colors.yellow[100],
        fg: tokens.colors.yellow[900],
        border: {
          fg: tokens.colors.yellow[300],
          bg: tokens.colors.yellow[100],
        },
      },
      chunked: {
        bg: tokens.colors.purple[100],
        fg: tokens.colors.purple[900],
        border: {
          fg: tokens.colors.purple[300],
          bg: tokens.colors.purple[100],
        },
      },
    };

    return {
      ...baseHeaderStyle,
      ...(variantHeaders[variant] || {}),
    };
  }

  /**
   * Get content area style
   */
  static getContentStyle(props: StreamProps) {
    return {
      bg: tokens.colors.white,
      fg: tokens.colors.gray[900],
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
   * Get progress bar style
   */
  static getProgressStyle(props: StreamProps) {
    const variant = props.variant || 'default';
    
    const progressColors = {
      default: {
        filled: tokens.colors.blue[500],
        empty: tokens.colors.gray[200],
      },
      realtime: {
        filled: tokens.colors.green[500],
        empty: tokens.colors.gray[200],
      },
      buffered: {
        filled: tokens.colors.yellow[500],
        empty: tokens.colors.gray[200],
      },
      chunked: {
        filled: tokens.colors.purple[500],
        empty: tokens.colors.gray[200],
      },
      minimal: {
        filled: tokens.colors.gray[500],
        empty: tokens.colors.gray[200],
      },
    };

    return {
      ...progressColors[variant],
      height: 1,
      style: {
        bg: progressColors[variant].empty,
        fg: progressColors[variant].filled,
      },
    };
  }

  /**
   * Get stats display style
   */
  static getStatsStyle(props: StreamProps) {
    return {
      bg: tokens.colors.gray[50],
      fg: tokens.colors.gray[700],
      border: {
        type: 'line',
        fg: tokens.colors.gray[200],
        bg: tokens.colors.gray[50],
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
   * Get chunk style based on type
   */
  static getChunkStyle(chunkType: string) {
    const chunkStyles = {
      text: {
        fg: tokens.colors.gray[900],
        bg: tokens.colors.white,
      },
      code: {
        fg: tokens.colors.blue[700],
        bg: tokens.colors.blue[50],
        bold: true,
      },
      json: {
        fg: tokens.colors.purple[700],
        bg: tokens.colors.purple[50],
      },
      markdown: {
        fg: tokens.colors.gray[800],
        bg: tokens.colors.gray[25],
      },
      error: {
        fg: tokens.colors.red[700],
        bg: tokens.colors.red[50],
        bold: true,
      },
      progress: {
        fg: tokens.colors.green[700],
        bg: tokens.colors.green[50],
      },
      metadata: {
        fg: tokens.colors.gray[600],
        bg: tokens.colors.gray[25],
        dim: true,
      },
    };

    return chunkStyles[chunkType] || chunkStyles.text;
  }

  /**
   * Get timestamp style
   */
  static getTimestampStyle() {
    return {
      fg: tokens.colors.gray[500],
      dim: true,
      bold: false,
    };
  }

  /**
   * Get chunk type indicator style
   */
  static getChunkTypeStyle(chunkType: string) {
    const typeStyles = {
      text: { fg: tokens.colors.gray[500] },
      code: { fg: tokens.colors.blue[500] },
      json: { fg: tokens.colors.purple[500] },
      markdown: { fg: tokens.colors.gray[600] },
      error: { fg: tokens.colors.red[500] },
      progress: { fg: tokens.colors.green[500] },
      metadata: { fg: tokens.colors.gray[400] },
    };

    return typeStyles[chunkType] || typeStyles.text;
  }
}