import { WebSearchToolProps, WebSearchToolVariants, WebSearchToolSizes, WebSearchToolStates, SearchEngine, SearchResultType } from './WebSearchTool.types';
import { tokens, semanticColors } from '../../../core/src/theming/tokens';

export class WebSearchToolStyles {
  /**
   * Get web search tool style based on props
   */
  static getStyle(props: WebSearchToolProps) {
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
   * Get base web search tool style
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
  static getVariantStyle(variant: WebSearchToolVariants) {
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
  static getSizeStyle(size: WebSearchToolSizes) {
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
  static getStateStyle(state: WebSearchToolStates) {
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
  static getCustomStyle(props: WebSearchToolProps) {
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
  static getHeaderStyle(props: WebSearchToolProps) {
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
   * Get search bar style
   */
  static getSearchBarStyle(props: WebSearchToolProps) {
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
   * Get filters style
   */
  static getFiltersStyle(props: WebSearchToolProps) {
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
   * Get history style
   */
  static getHistoryStyle(props: WebSearchToolProps) {
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
   * Get results style
   */
  static getResultsStyle(props: WebSearchToolProps) {
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
   * Get result item style
   */
  static getResultStyle(props: WebSearchToolProps, selected: boolean = false) {
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
   * Get metadata style
   */
  static getMetadataStyle(props: WebSearchToolProps) {
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
   * Get preview style
   */
  static getPreviewStyle(props: WebSearchToolProps) {
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
   * Get stats style
   */
  static getStatsStyle(props: WebSearchToolProps) {
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
   * Get search engine color
   */
  static getSearchEngineColor(engine: SearchEngine) {
    const engineColors = {
      google: tokens.colors.blue[500],
      bing: tokens.colors.blue[600],
      duckduckgo: tokens.colors.yellow[500],
      yahoo: tokens.colors.purple[500],
      brave: tokens.colors.orange[500],
      custom: tokens.colors.gray[500],
    };

    return engineColors[engine] || tokens.colors.gray[500];
  }

  /**
   * Get search engine style
   */
  static getSearchEngineStyle(engine: SearchEngine) {
    const color = this.getSearchEngineColor(engine);
    
    return {
      fg: color,
      bold: true,
    };
  }

  /**
   * Get result type color
   */
  static getResultTypeColor(resultType: SearchResultType) {
    const typeColors = {
      webpage: tokens.colors.blue[500],
      news: tokens.colors.red[500],
      image: tokens.colors.green[500],
      video: tokens.colors.purple[500],
      shopping: tokens.colors.orange[500],
      academic: tokens.colors.cyan[500],
      social: tokens.colors.pink[500],
      local: tokens.colors.yellow[500],
      definition: tokens.colors.gray[600],
      calculator: tokens.colors.blue[600],
    };

    return typeColors[resultType] || tokens.colors.gray[500];
  }

  /**
   * Get result type style
   */
  static getResultTypeStyle(resultType: SearchResultType) {
    const color = this.getResultTypeColor(resultType);
    
    return {
      fg: color,
      bold: false,
    };
  }

  /**
   * Get relevance color
   */
  static getRelevanceColor(relevance: number) {
    if (relevance >= 0.8) {
      return tokens.colors.green[500];
    } else if (relevance >= 0.6) {
      return tokens.colors.yellow[500];
    } else if (relevance >= 0.4) {
      return tokens.colors.orange[500];
    } else {
      return tokens.colors.red[500];
    }
  }

  /**
   * Get relevance style
   */
  static getRelevanceStyle(relevance: number) {
    const color = this.getRelevanceColor(relevance);
    
    return {
      fg: color,
      bold: relevance >= 0.8,
    };
  }
}