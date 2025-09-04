import { PDFToolProps, PDFToolVariants, PDFToolSizes, PDFToolStates, PDFOperation } from './PDFTool.types';
import { tokens, semanticColors } from '../../../core/src/theming/tokens';

export class PDFToolStyles {
  /**
   * Get PDF tool style based on props
   */
  static getStyle(props: PDFToolProps) {
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
   * Get base PDF tool style
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
  static getVariantStyle(variant: PDFToolVariants) {
    const variants = {
      default: {
        border: {
          fg: tokens.colors.red[400],
          bg: tokens.colors.red[50],
        },
        style: {
          bg: tokens.colors.red[50],
          border: {
            fg: tokens.colors.red[400],
            bg: tokens.colors.red[50],
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
  static getSizeStyle(size: PDFToolSizes) {
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
  static getStateStyle(state: PDFToolStates) {
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
  static getCustomStyle(props: PDFToolProps) {
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
  static getHeaderStyle(props: PDFToolProps) {
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
   * Get document list style
   */
  static getDocumentListStyle(props: PDFToolProps) {
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
   * Get page viewer style
   */
  static getPageViewerStyle(props: PDFToolProps) {
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
   * Get search results style
   */
  static getSearchResultsStyle(props: PDFToolProps) {
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
   * Get analysis results style
   */
  static getAnalysisResultsStyle(props: PDFToolProps) {
    return {
      bg: tokens.colors.blue[50],
      fg: tokens.colors.blue[900],
      border: {
        type: 'line',
        fg: tokens.colors.blue[300],
        bg: tokens.colors.blue[50],
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
   * Get metadata style
   */
  static getMetadataStyle(props: PDFToolProps) {
    return {
      bg: tokens.colors.gray[100],
      fg: tokens.colors.gray[700],
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
      dim: true,
    };
  }

  /**
   * Get bookmarks style
   */
  static getBookmarksStyle(props: PDFToolProps) {
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
   * Get annotations style
   */
  static getAnnotationsStyle(props: PDFToolProps) {
    return {
      bg: tokens.colors.yellow[50],
      fg: tokens.colors.yellow[900],
      border: {
        type: 'line',
        fg: tokens.colors.yellow[300],
        bg: tokens.colors.yellow[50],
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
   * Get toolbar style
   */
  static getToolbarStyle(props: PDFToolProps) {
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
   * Get document item style
   */
  static getDocumentStyle(props: PDFToolProps, selected: boolean = false) {
    const variant = props.variant || 'default';
    const variantStyle = this.getVariantStyle(variant);
    
    if (selected) {
      return {
        bg: tokens.colors.blue[100],
        fg: tokens.colors.blue[900],
        border: {
          fg: tokens.colors.blue[400],
          bg: tokens.colors.blue[100],
        },
        bold: true,
      };
    }
    
    return {
      bg: variantStyle.style.bg,
      fg: variantStyle.style.fg,
      border: {
        fg: variantStyle.border.fg,
        bg: variantStyle.style.bg,
      },
    };
  }

  /**
   * Get search result style
   */
  static getSearchResultStyle(props: PDFToolProps, selected: boolean = false) {
    const variant = props.variant || 'default';
    const variantStyle = this.getVariantStyle(variant);
    
    if (selected) {
      return {
        bg: tokens.colors.green[100],
        fg: tokens.colors.green[900],
        border: {
          fg: tokens.colors.green[400],
          bg: tokens.colors.green[100],
        },
        bold: true,
      };
    }
    
    return {
      bg: variantStyle.style.bg,
      fg: variantStyle.style.fg,
      border: {
        fg: variantStyle.border.fg,
        bg: variantStyle.style.bg,
      },
    };
  }

  /**
   * Get operation color
   */
  static getOperationColor(operation: PDFOperation) {
    const operationColors = {
      load: tokens.colors.blue[500],
      'extract-text': tokens.colors.green[500],
      'extract-tables': tokens.colors.purple[500],
      'extract-images': tokens.colors.orange[500],
      search: tokens.colors.cyan[500],
      summarize: tokens.colors.pink[500],
      translate: tokens.colors.yellow[500],
      analyze: tokens.colors.red[500],
      convert: tokens.colors.gray[500],
      merge: tokens.colors.blue[600],
      split: tokens.colors.green[600],
      compress: tokens.colors.purple[600],
    };

    return operationColors[operation] || tokens.colors.gray[500];
  }

  /**
   * Get operation style
   */
  static getOperationStyle(operation: PDFOperation) {
    const color = this.getOperationColor(operation);
    
    return {
      fg: color,
      bold: true,
    };
  }

  /**
   * Get page number style
   */
  static getPageNumberStyle() {
    return {
      fg: tokens.colors.gray[600],
      bold: true,
    };
  }

  /**
   * Get bookmark level style
   */
  static getBookmarkLevelStyle(level: number) {
    const indent = '  '.repeat(level);
    return {
      fg: tokens.colors.blue[600],
      bold: level === 0,
    };
  }

  /**
   * Get annotation type style
   */
  static getAnnotationTypeStyle(type: string) {
    const typeStyles = {
      text: { fg: tokens.colors.blue[500] },
      highlight: { fg: tokens.colors.yellow[500] },
      note: { fg: tokens.colors.green[500] },
      link: { fg: tokens.colors.cyan[500] },
      stamp: { fg: tokens.colors.purple[500] },
    };

    return typeStyles[type] || { fg: tokens.colors.gray[500] };
  }
}