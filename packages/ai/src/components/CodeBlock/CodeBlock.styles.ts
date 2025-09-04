import { CodeBlockProps, CodeBlockVariants, CodeBlockSizes, CodeBlockStates, CodeLanguage, CodeTheme } from './CodeBlock.types';
import { tokens, semanticColors } from '../../../core/src/theming/tokens';

export class CodeBlockStyles {
  /**
   * Get code block style based on props
   */
  static getStyle(props: CodeBlockProps) {
    const variant = props.variant || 'default';
    const size = props.size || 'md';
    const state = props.state || 'default';
    const theme = props.theme || 'dark';
    
    const baseStyle = this.getBaseStyle();
    const variantStyle = this.getVariantStyle(variant);
    const sizeStyle = this.getSizeStyle(size);
    const stateStyle = this.getStateStyle(state);
    const themeStyle = this.getThemeStyle(theme);
    
    return {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      ...stateStyle,
      ...themeStyle,
      ...this.getCustomStyle(props),
    };
  }

  /**
   * Get base code block style
   */
  static getBaseStyle() {
    return {
      border: {
        type: 'line',
        fg: tokens.colors.gray[300],
        bg: tokens.colors.gray[900],
      },
      style: {
        bg: tokens.colors.gray[900],
        fg: tokens.colors.gray[100],
        border: {
          fg: tokens.colors.gray[300],
          bg: tokens.colors.gray[900],
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
          bg: tokens.colors.gray[700],
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
  static getVariantStyle(variant: CodeBlockVariants) {
    const variants = {
      default: {
        border: {
          fg: tokens.colors.blue[400],
          bg: tokens.colors.gray[900],
        },
        style: {
          bg: tokens.colors.gray[900],
          border: {
            fg: tokens.colors.blue[400],
            bg: tokens.colors.gray[900],
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
          bg: tokens.colors.gray[800],
        },
        style: {
          bg: tokens.colors.gray[800],
          border: {
            fg: tokens.colors.gray[400],
            bg: tokens.colors.gray[800],
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
          bg: tokens.colors.gray[900],
        },
        style: {
          bg: tokens.colors.gray[900],
          border: {
            fg: tokens.colors.purple[400],
            bg: tokens.colors.gray[900],
          },
        },
      },
      minimal: {
        border: {
          fg: tokens.colors.gray[200],
          bg: tokens.colors.gray[50],
        },
        style: {
          bg: tokens.colors.gray[50],
          fg: tokens.colors.gray[900],
          border: {
            fg: tokens.colors.gray[200],
            bg: tokens.colors.gray[50],
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
          bg: tokens.colors.gray[900],
        },
        style: {
          bg: tokens.colors.gray[900],
          border: {
            fg: tokens.colors.green[400],
            bg: tokens.colors.gray[900],
          },
        },
      },
    };

    return variants[variant] || variants.default;
  }

  /**
   * Get size-specific styles
   */
  static getSizeStyle(size: CodeBlockSizes) {
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
  static getStateStyle(state: CodeBlockStates) {
    const states = {
      default: {
        style: {
          fg: tokens.colors.gray[100],
        },
      },
      loading: {
        style: {
          fg: tokens.colors.blue[400],
        },
        border: {
          fg: tokens.colors.blue[300],
        },
      },
      error: {
        style: {
          fg: tokens.colors.red[400],
        },
        border: {
          fg: tokens.colors.red[400],
        },
      },
      success: {
        style: {
          fg: tokens.colors.green[400],
        },
        border: {
          fg: tokens.colors.green[400],
        },
      },
      focused: {
        style: {
          fg: tokens.colors.blue[300],
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
   * Get theme-specific styles
   */
  static getThemeStyle(theme: CodeTheme) {
    const themes = {
      dark: {
        style: {
          bg: tokens.colors.gray[900],
          fg: tokens.colors.gray[100],
        },
        border: {
          fg: tokens.colors.gray[600],
          bg: tokens.colors.gray[900],
        },
      },
      light: {
        style: {
          bg: tokens.colors.white,
          fg: tokens.colors.gray[900],
        },
        border: {
          fg: tokens.colors.gray[300],
          bg: tokens.colors.white,
        },
      },
      monokai: {
        style: {
          bg: '#272822',
          fg: '#f8f8f2',
        },
        border: {
          fg: '#75715e',
          bg: '#272822',
        },
      },
      dracula: {
        style: {
          bg: '#282a36',
          fg: '#f8f8f2',
        },
        border: {
          fg: '#6272a4',
          bg: '#282a36',
        },
      },
      github: {
        style: {
          bg: '#f6f8fa',
          fg: '#24292e',
        },
        border: {
          fg: '#d0d7de',
          bg: '#f6f8fa',
        },
      },
      'vs-code': {
        style: {
          bg: '#1e1e1e',
          fg: '#d4d4d4',
        },
        border: {
          fg: '#3e3e42',
          bg: '#1e1e1e',
        },
      },
      atom: {
        style: {
          bg: '#282c34',
          fg: '#abb2bf',
        },
        border: {
          fg: '#5c6370',
          bg: '#282c34',
        },
      },
      solarized: {
        style: {
          bg: '#002b36',
          fg: '#839496',
        },
        border: {
          fg: '#586e75',
          bg: '#002b36',
        },
      },
      tomorrow: {
        style: {
          bg: '#ffffff',
          fg: '#4d4d4c',
        },
        border: {
          fg: '#d6d6d6',
          bg: '#ffffff',
        },
      },
      ocean: {
        style: {
          bg: '#2b303b',
          fg: '#c0c5ce',
        },
        border: {
          fg: '#65737e',
          bg: '#2b303b',
        },
      },
    };

    return themes[theme] || themes.dark;
  }

  /**
   * Get custom style overrides
   */
  static getCustomStyle(props: CodeBlockProps) {
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
  static getHeaderStyle(props: CodeBlockProps) {
    const theme = props.theme || 'dark';
    const themeStyle = this.getThemeStyle(theme);
    
    return {
      bg: themeStyle.style.bg,
      fg: themeStyle.style.fg,
      border: {
        type: 'line',
        fg: themeStyle.border.fg,
        bg: themeStyle.style.bg,
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
  static getContentStyle(props: CodeBlockProps) {
    const theme = props.theme || 'dark';
    const themeStyle = this.getThemeStyle(theme);
    
    return {
      bg: themeStyle.style.bg,
      fg: themeStyle.style.fg,
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
          bg: themeStyle.border.fg,
        },
        style: {
          inverse: true,
        },
      },
    };
  }

  /**
   * Get line numbers style
   */
  static getLineNumbersStyle(props: CodeBlockProps) {
    const theme = props.theme || 'dark';
    const themeStyle = this.getThemeStyle(theme);
    
    return {
      bg: themeStyle.style.bg,
      fg: themeStyle.border.fg,
      dim: true,
      bold: false,
      align: 'right' as 'left' | 'center' | 'right',
    };
  }

  /**
   * Get actions bar style
   */
  static getActionsStyle(props: CodeBlockProps) {
    const theme = props.theme || 'dark';
    const themeStyle = this.getThemeStyle(theme);
    
    return {
      bg: themeStyle.style.bg,
      fg: themeStyle.style.fg,
      border: {
        type: 'line',
        fg: themeStyle.border.fg,
        bg: themeStyle.style.bg,
      },
      padding: {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1,
      },
      align: 'right' as 'left' | 'center' | 'right',
    };
  }

  /**
   * Get error display style
   */
  static getErrorStyle(props: CodeBlockProps) {
    return {
      bg: tokens.colors.red[50],
      fg: tokens.colors.red[700],
      border: {
        type: 'line',
        fg: tokens.colors.red[300],
        bg: tokens.colors.red[50],
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
   * Get filename display style
   */
  static getFilenameStyle(props: CodeBlockProps) {
    const theme = props.theme || 'dark';
    const themeStyle = this.getThemeStyle(theme);
    
    return {
      bg: themeStyle.style.bg,
      fg: themeStyle.border.fg,
      bold: true,
      dim: false,
    };
  }

  /**
   * Get syntax highlighting styles for different token types
   */
  static getSyntaxStyle(tokenType: string, theme: CodeTheme = 'dark') {
    const syntaxThemes = {
      dark: {
        keyword: { fg: '#c678dd', bold: true },
        string: { fg: '#98c379' },
        number: { fg: '#d19a66' },
        comment: { fg: '#5c6370', dim: true },
        function: { fg: '#61dafb' },
        variable: { fg: '#e06c75' },
        operator: { fg: '#56b6c2' },
        punctuation: { fg: '#abb2bf' },
        type: { fg: '#e5c07b' },
        constant: { fg: '#d19a66', bold: true },
        default: { fg: '#abb2bf' },
      },
      light: {
        keyword: { fg: '#d73a49', bold: true },
        string: { fg: '#032f62' },
        number: { fg: '#005cc5' },
        comment: { fg: '#6a737d', dim: true },
        function: { fg: '#6f42c1' },
        variable: { fg: '#e36209' },
        operator: { fg: '#d73a49' },
        punctuation: { fg: '#24292e' },
        type: { fg: '#005cc5' },
        constant: { fg: '#005cc5', bold: true },
        default: { fg: '#24292e' },
      },
      monokai: {
        keyword: { fg: '#f92672', bold: true },
        string: { fg: '#e6db74' },
        number: { fg: '#ae81ff' },
        comment: { fg: '#75715e', dim: true },
        function: { fg: '#a6e22e' },
        variable: { fg: '#f8f8f2' },
        operator: { fg: '#f92672' },
        punctuation: { fg: '#f8f8f2' },
        type: { fg: '#66d9ef' },
        constant: { fg: '#ae81ff', bold: true },
        default: { fg: '#f8f8f2' },
      },
      dracula: {
        keyword: { fg: '#ff79c6', bold: true },
        string: { fg: '#f1fa8c' },
        number: { fg: '#bd93f9' },
        comment: { fg: '#6272a4', dim: true },
        function: { fg: '#50fa7b' },
        variable: { fg: '#f8f8f2' },
        operator: { fg: '#ff79c6' },
        punctuation: { fg: '#f8f8f2' },
        type: { fg: '#8be9fd' },
        constant: { fg: '#bd93f9', bold: true },
        default: { fg: '#f8f8f2' },
      },
    };

    const themeStyles = syntaxThemes[theme] || syntaxThemes.dark;
    return themeStyles[tokenType] || themeStyles.default;
  }
}