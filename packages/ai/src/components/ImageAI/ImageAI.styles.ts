import { ImageAIProps, ImageAIVariants, ImageAISizes, ImageAIStates, ImageGenerationModel, ImageAnalysisModel, ImageStyle, ImageQuality } from './ImageAI.types';
import { tokens, semanticColors } from '../../../core/src/theming/tokens';

export class ImageAIStyles {
  /**
   * Get image AI style based on props
   */
  static getStyle(props: ImageAIProps) {
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
   * Get base image AI style
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
  static getVariantStyle(variant: ImageAIVariants) {
    const variants = {
      default: {
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
  static getSizeStyle(size: ImageAISizes) {
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
  static getStateStyle(state: ImageAIStates) {
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
  static getCustomStyle(props: ImageAIProps) {
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
  static getHeaderStyle(props: ImageAIProps) {
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
   * Get prompt editor style
   */
  static getPromptEditorStyle(props: ImageAIProps) {
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
   * Get image gallery style
   */
  static getImageGalleryStyle(props: ImageAIProps) {
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
  static getAnalysisResultsStyle(props: ImageAIProps) {
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
   * Get generation history style
   */
  static getGenerationHistoryStyle(props: ImageAIProps) {
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
   * Get model selector style
   */
  static getModelSelectorStyle(props: ImageAIProps) {
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
   * Get style selector style
   */
  static getStyleSelectorStyle(props: ImageAIProps) {
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
   * Get quality selector style
   */
  static getQualitySelectorStyle(props: ImageAIProps) {
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
   * Get toolbar style
   */
  static getToolbarStyle(props: ImageAIProps) {
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
   * Get image item style
   */
  static getImageStyle(props: ImageAIProps, selected: boolean = false) {
    const variant = props.variant || 'default';
    const variantStyle = this.getVariantStyle(variant);
    
    if (selected) {
      return {
        bg: tokens.colors.purple[100],
        fg: tokens.colors.purple[900],
        border: {
          fg: tokens.colors.purple[400],
          bg: tokens.colors.purple[100],
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
   * Get generation model color
   */
  static getGenerationModelColor(model: ImageGenerationModel) {
    const modelColors = {
      'dall-e-2': tokens.colors.blue[500],
      'dall-e-3': tokens.colors.blue[600],
      'midjourney': tokens.colors.purple[500],
      'stable-diffusion': tokens.colors.green[500],
      'imagen': tokens.colors.orange[500],
      'parti': tokens.colors.red[500],
      'firefly': tokens.colors.yellow[500],
      'custom': tokens.colors.gray[500],
    };

    return modelColors[model] || tokens.colors.gray[500];
  }

  /**
   * Get generation model style
   */
  static getGenerationModelStyle(model: ImageGenerationModel) {
    const color = this.getGenerationModelColor(model);
    
    return {
      fg: color,
      bold: true,
    };
  }

  /**
   * Get analysis model color
   */
  static getAnalysisModelColor(model: ImageAnalysisModel) {
    const modelColors = {
      'gpt-4-vision': tokens.colors.green[500],
      'claude-3-vision': tokens.colors.blue[500],
      'gemini-vision': tokens.colors.orange[500],
      'llava': tokens.colors.purple[500],
      'blip': tokens.colors.cyan[500],
      'custom': tokens.colors.gray[500],
    };

    return modelColors[model] || tokens.colors.gray[500];
  }

  /**
   * Get analysis model style
   */
  static getAnalysisModelStyle(model: ImageAnalysisModel) {
    const color = this.getAnalysisModelColor(model);
    
    return {
      fg: color,
      bold: true,
    };
  }

  /**
   * Get image style color
   */
  static getImageStyleColor(style: ImageStyle) {
    const styleColors = {
      realistic: tokens.colors.gray[500],
      artistic: tokens.colors.purple[500],
      cartoon: tokens.colors.blue[500],
      anime: tokens.colors.pink[500],
      photographic: tokens.colors.gray[600],
      painting: tokens.colors.orange[500],
      sketch: tokens.colors.gray[700],
      'digital-art': tokens.colors.cyan[500],
      vintage: tokens.colors.yellow[600],
      modern: tokens.colors.green[500],
    };

    return styleColors[style] || tokens.colors.gray[500];
  }

  /**
   * Get image style style
   */
  static getImageStyleStyle(style: ImageStyle) {
    const color = this.getImageStyleColor(style);
    
    return {
      fg: color,
      bold: false,
    };
  }

  /**
   * Get image quality color
   */
  static getImageQualityColor(quality: ImageQuality) {
    const qualityColors = {
      low: tokens.colors.red[500],
      medium: tokens.colors.yellow[500],
      high: tokens.colors.green[500],
      ultra: tokens.colors.blue[500],
    };

    return qualityColors[quality] || tokens.colors.gray[500];
  }

  /**
   * Get image quality style
   */
  static getImageQualityStyle(quality: ImageQuality) {
    const color = this.getImageQualityColor(quality);
    
    return {
      fg: color,
      bold: quality === 'ultra',
    };
  }

  /**
   * Get confidence color
   */
  static getConfidenceColor(confidence: number) {
    if (confidence >= 0.8) {
      return tokens.colors.green[500];
    } else if (confidence >= 0.6) {
      return tokens.colors.yellow[500];
    } else if (confidence >= 0.4) {
      return tokens.colors.orange[500];
    } else {
      return tokens.colors.red[500];
    }
  }

  /**
   * Get confidence style
   */
  static getConfidenceStyle(confidence: number) {
    const color = this.getConfidenceColor(confidence);
    
    return {
      fg: color,
      bold: confidence >= 0.8,
    };
  }
}