import { ModelSelectorProps, ModelSelectorVariants, ModelSelectorSizes, ModelSelectorStates, AIProvider, ModelCapability, ModelPerformance, ModelAvailability } from './ModelSelector.types';
import { tokens, semanticColors } from '../../../core/src/theming/tokens';

export class ModelSelectorStyles {
  /**
   * Get model selector style based on props
   */
  static getStyle(props: ModelSelectorProps) {
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
   * Get base model selector style
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
  static getVariantStyle(variant: ModelSelectorVariants) {
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
  static getSizeStyle(size: ModelSelectorSizes) {
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
  static getStateStyle(state: ModelSelectorStates) {
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
  static getCustomStyle(props: ModelSelectorProps) {
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
  static getHeaderStyle(props: ModelSelectorProps) {
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
  static getContentStyle(props: ModelSelectorProps) {
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
   * Get model item style
   */
  static getModelStyle(props: ModelSelectorProps, selected: boolean = false) {
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
   * Get filter bar style
   */
  static getFilterStyle(props: ModelSelectorProps) {
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
   * Get search bar style
   */
  static getSearchStyle(props: ModelSelectorProps) {
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
   * Get comparison view style
   */
  static getComparisonStyle(props: ModelSelectorProps) {
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
   * Get provider color
   */
  static getProviderColor(provider: AIProvider) {
    const providerColors = {
      openai: tokens.colors.green[500],
      anthropic: tokens.colors.blue[500],
      google: tokens.colors.red[500],
      meta: tokens.colors.purple[500],
      microsoft: tokens.colors.blue[600],
      amazon: tokens.colors.orange[500],
      cohere: tokens.colors.pink[500],
      huggingface: tokens.colors.yellow[500],
      local: tokens.colors.gray[500],
      custom: tokens.colors.gray[600],
    };

    return providerColors[provider] || tokens.colors.gray[500];
  }

  /**
   * Get provider style
   */
  static getProviderStyle(provider: AIProvider) {
    const color = this.getProviderColor(provider);
    
    return {
      fg: color,
      bold: true,
    };
  }

  /**
   * Get capability color
   */
  static getCapabilityColor(capability: ModelCapability) {
    const capabilityColors = {
      'text-generation': tokens.colors.blue[500],
      'code-generation': tokens.colors.green[500],
      'image-generation': tokens.colors.purple[500],
      'function-calling': tokens.colors.orange[500],
      'tool-use': tokens.colors.red[500],
      'multimodal': tokens.colors.pink[500],
      'embeddings': tokens.colors.cyan[500],
      'fine-tuning': tokens.colors.yellow[500],
      'chat': tokens.colors.blue[600],
      'completion': tokens.colors.green[600],
    };

    return capabilityColors[capability] || tokens.colors.gray[500];
  }

  /**
   * Get capability style
   */
  static getCapabilityStyle(capability: ModelCapability) {
    const color = this.getCapabilityColor(capability);
    
    return {
      fg: color,
      bold: false,
    };
  }

  /**
   * Get performance color
   */
  static getPerformanceColor(performance: ModelPerformance) {
    const performanceColors = {
      basic: tokens.colors.gray[500],
      standard: tokens.colors.blue[500],
      advanced: tokens.colors.green[500],
      premium: tokens.colors.purple[500],
      enterprise: tokens.colors.orange[500],
    };

    return performanceColors[performance] || tokens.colors.gray[500];
  }

  /**
   * Get performance style
   */
  static getPerformanceStyle(performance: ModelPerformance) {
    const color = this.getPerformanceColor(performance);
    
    return {
      fg: color,
      bold: true,
    };
  }

  /**
   * Get availability color
   */
  static getAvailabilityColor(availability: ModelAvailability) {
    const availabilityColors = {
      available: tokens.colors.green[500],
      beta: tokens.colors.yellow[500],
      deprecated: tokens.colors.red[500],
      unavailable: tokens.colors.gray[500],
      'coming-soon': tokens.colors.blue[500],
    };

    return availabilityColors[availability] || tokens.colors.gray[500];
  }

  /**
   * Get availability style
   */
  static getAvailabilityStyle(availability: ModelAvailability) {
    const color = this.getAvailabilityColor(availability);
    
    return {
      fg: color,
      bold: availability === 'available' || availability === 'beta',
    };
  }

  /**
   * Get cost style
   */
  static getCostStyle(cost: number, threshold: number = 0.01) {
    if (cost >= threshold) {
      return {
        fg: tokens.colors.red[500],
        bold: true,
      };
    } else if (cost >= threshold / 2) {
      return {
        fg: tokens.colors.yellow[500],
        bold: false,
      };
    } else {
      return {
        fg: tokens.colors.green[500],
        bold: false,
      };
    }
  }
}