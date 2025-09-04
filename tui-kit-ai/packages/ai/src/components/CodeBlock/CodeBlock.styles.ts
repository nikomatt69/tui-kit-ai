import { CodeBlockVariant, CodeBlockState, CodeTheme, Language } from './CodeBlock.types';

// Code Block Style Configuration
export interface CodeBlockStyleConfig {
  variant: CodeBlockVariant;
  state: CodeBlockState;
  theme: CodeTheme;
  language: Language;
  width: number;
  height: number;
  maxHeight?: number;
  customTheme?: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    foreground: string;
    border: string;
    selection: string;
    comment: string;
    keyword: string;
    string: string;
    number: string;
    function: string;
    variable: string;
    type: string;
    constant: string;
  };
}

// Generate Code Block Styles
export function generateCodeBlockStyles(config: CodeBlockStyleConfig): string {
  const { variant, state, theme, language, width, height, maxHeight, customTheme } = config;
  
  const styles: string[] = [];
  
  // Base container styles
  styles.push(`
    .codeblock-container {
      width: ${width}ch;
      height: ${height}em;
      ${maxHeight ? `max-height: ${maxHeight}em;` : ''}
      background: ${customTheme?.background || getThemeBackground(theme)};
      color: ${customTheme?.foreground || getThemeForeground(theme)};
      border: 1px solid ${customTheme?.border || getThemeBorder(theme)};
      border-radius: 6px;
      font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
    }
  `);
  
  // Variant-specific styles
  switch (variant) {
    case 'compact':
      styles.push(`
        .codeblock-container.compact {
          height: auto;
          min-height: 3em;
          padding: 0.5em;
        }
        .codeblock-container.compact .codeblock-header {
          padding: 0.25em 0.5em;
          font-size: 0.8em;
        }
        .codeblock-container.compact .codeblock-content {
          padding: 0.25em 0.5em;
          font-size: 0.9em;
        }
      `);
      break;
      
    case 'expanded':
      styles.push(`
        .codeblock-container.expanded {
          height: auto;
          min-height: 20em;
        }
        .codeblock-container.expanded .codeblock-content {
          flex: 1;
          overflow-y: auto;
        }
      `);
      break;
      
    case 'minimal':
      styles.push(`
        .codeblock-container.minimal {
          border: none;
          background: transparent;
          border-radius: 0;
        }
        .codeblock-container.minimal .codeblock-header,
        .codeblock-container.minimal .codeblock-footer {
          display: none;
        }
      `);
      break;
      
    case 'detailed':
      styles.push(`
        .codeblock-container.detailed {
          border: 2px solid ${customTheme?.border || getThemeBorder(theme)};
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .codeblock-container.detailed .codeblock-header {
          background: ${customTheme?.background || getThemeBackground(theme)}dd;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid ${customTheme?.border || getThemeBorder(theme)};
        }
        .codeblock-container.detailed .codeblock-footer {
          background: ${customTheme?.background || getThemeBackground(theme)}dd;
          backdrop-filter: blur(10px);
          border-top: 1px solid ${customTheme?.border || getThemeBorder(theme)};
        }
      `);
      break;
  }
  
  // State-specific styles
  switch (state) {
    case 'loading':
      styles.push(`
        .codeblock-container.loading {
          border-color: ${customTheme?.warning || getThemeWarning(theme)};
        }
        .codeblock-container.loading .codeblock-content {
          opacity: 0.6;
        }
        .codeblock-container.loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border: 2px solid ${customTheme?.warning || getThemeWarning(theme)};
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `);
      break;
      
    case 'error':
      styles.push(`
        .codeblock-container.error {
          border-color: ${customTheme?.error || getThemeError(theme)};
          background: ${customTheme?.error || getThemeError(theme)}11;
        }
        .codeblock-container.error .codeblock-status {
          color: ${customTheme?.error || getThemeError(theme)};
        }
        .codeblock-container.error .codeblock-status::after {
          content: ' ❌';
        }
      `);
      break;
      
    case 'success':
      styles.push(`
        .codeblock-container.success {
          border-color: ${customTheme?.success || getThemeSuccess(theme)};
        }
        .codeblock-container.success .codeblock-status {
          color: ${customTheme?.success || getThemeSuccess(theme)};
        }
        .codeblock-container.success .codeblock-status::after {
          content: ' ✅';
        }
      `);
      break;
      
    case 'focused':
      styles.push(`
        .codeblock-container.focused {
          border-color: ${customTheme?.primary || getThemePrimary(theme)};
          box-shadow: 0 0 15px ${customTheme?.primary || getThemePrimary(theme)}44;
          transform: scale(1.01);
          transition: all 0.2s ease;
        }
      `);
      break;
      
    case 'collapsed':
      styles.push(`
        .codeblock-container.collapsed {
          height: auto;
        }
        .codeblock-container.collapsed .codeblock-content {
          display: none;
        }
        .codeblock-container.collapsed .codeblock-footer {
          display: none;
        }
        .codeblock-container.collapsed .codeblock-toggle::after {
          content: ' ▶';
        }
      `);
      break;
      
    case 'expanded':
      styles.push(`
        .codeblock-container.expanded .codeblock-toggle::after {
          content: ' ▼';
        }
      `);
      break;
  }
  
  // Header styles
  styles.push(`
    .codeblock-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75em 1em;
      background: ${customTheme?.background || getThemeBackground(theme)}dd;
      border-bottom: 1px solid ${customTheme?.border || getThemeBorder(theme)};
      font-size: 0.9em;
    }
    .codeblock-title {
      display: flex;
      align-items: center;
      gap: 0.5em;
      font-weight: 600;
      color: ${customTheme?.primary || getThemePrimary(theme)};
    }
    .codeblock-language {
      background: ${customTheme?.primary || getThemePrimary(theme)}22;
      color: ${customTheme?.primary || getThemePrimary(theme)};
      padding: 0.25em 0.5em;
      border-radius: 4px;
      font-size: 0.8em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .codeblock-status {
      font-size: 0.8em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .codeblock-actions {
      display: flex;
      gap: 0.5em;
    }
    .codeblock-action {
      background: none;
      border: none;
      color: ${customTheme?.foreground || getThemeForeground(theme)};
      cursor: pointer;
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.8em;
      transition: all 0.2s ease;
    }
    .codeblock-action:hover {
      background: ${customTheme?.primary || getThemePrimary(theme)}22;
      color: ${customTheme?.primary || getThemePrimary(theme)};
    }
    .codeblock-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .codeblock-toggle {
      background: none;
      border: none;
      color: ${customTheme?.foreground || getThemeForeground(theme)};
      cursor: pointer;
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.8em;
      transition: all 0.2s ease;
    }
    .codeblock-toggle:hover {
      background: ${customTheme?.primary || getThemePrimary(theme)}22;
    }
  `);
  
  // Content styles
  styles.push(`
    .codeblock-content {
      flex: 1;
      overflow: auto;
      padding: 1em;
      line-height: 1.5;
      font-size: 0.9em;
      position: relative;
    }
    .codeblock-code {
      margin: 0;
      white-space: pre;
      word-wrap: break-word;
      font-family: inherit;
    }
    .codeblock-line-numbers {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3em;
      background: ${customTheme?.background || getThemeBackground(theme)}88;
      border-right: 1px solid ${customTheme?.border || getThemeBorder(theme)};
      padding: 1em 0.5em;
      text-align: right;
      font-size: 0.8em;
      color: ${customTheme?.foreground || getThemeForeground(theme)}66;
      user-select: none;
    }
    .codeblock-code.with-line-numbers {
      padding-left: 4em;
    }
    .codeblock-line {
      display: block;
      min-height: 1.5em;
    }
    .codeblock-line.highlighted {
      background: ${customTheme?.selection || getThemeSelection(theme)}44;
      border-left: 3px solid ${customTheme?.primary || getThemePrimary(theme)};
      padding-left: 0.5em;
      margin-left: -0.5em;
    }
  `);
  
  // Syntax highlighting styles
  styles.push(`
    .codeblock-keyword { color: ${customTheme?.keyword || getThemeKeyword(theme)}; font-weight: bold; }
    .codeblock-string { color: ${customTheme?.string || getThemeString(theme)}; }
    .codeblock-number { color: ${customTheme?.number || getThemeNumber(theme)}; }
    .codeblock-comment { color: ${customTheme?.comment || getThemeComment(theme)}; font-style: italic; }
    .codeblock-function { color: ${customTheme?.function || getThemeFunction(theme)}; }
    .codeblock-variable { color: ${customTheme?.variable || getThemeVariable(theme)}; }
    .codeblock-type { color: ${customTheme?.type || getThemeType(theme)}; }
    .codeblock-constant { color: ${customTheme?.constant || getThemeConstant(theme)}; }
    .codeblock-operator { color: ${customTheme?.foreground || getThemeForeground(theme)}; }
    .codeblock-punctuation { color: ${customTheme?.foreground || getThemeForeground(theme)}; }
    .codeblock-regex { color: ${customTheme?.string || getThemeString(theme)}; }
    .codeblock-tag { color: ${customTheme?.keyword || getThemeKeyword(theme)}; }
    .codeblock-attribute { color: ${customTheme?.variable || getThemeVariable(theme)}; }
    .codeblock-value { color: ${customTheme?.string || getThemeString(theme)}; }
  `);
  
  // Footer styles
  styles.push(`
    .codeblock-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5em 1em;
      background: ${customTheme?.background || getThemeBackground(theme)}dd;
      border-top: 1px solid ${customTheme?.border || getThemeBorder(theme)};
      font-size: 0.8em;
      color: ${customTheme?.foreground || getThemeForeground(theme)}88;
    }
    .codeblock-metadata {
      display: flex;
      gap: 1em;
    }
    .codeblock-metadata-item {
      display: flex;
      align-items: center;
      gap: 0.25em;
    }
    .codeblock-search {
      display: flex;
      align-items: center;
      gap: 0.5em;
    }
    .codeblock-search-input {
      background: ${customTheme?.background || getThemeBackground(theme)};
      border: 1px solid ${customTheme?.border || getThemeBorder(theme)};
      color: ${customTheme?.foreground || getThemeForeground(theme)};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.8em;
      width: 8em;
    }
    .codeblock-search-input:focus {
      outline: none;
      border-color: ${customTheme?.primary || getThemePrimary(theme)};
    }
  `);
  
  // Scrollbar styles
  styles.push(`
    .codeblock-content::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .codeblock-content::-webkit-scrollbar-track {
      background: ${customTheme?.background || getThemeBackground(theme)};
    }
    .codeblock-content::-webkit-scrollbar-thumb {
      background: ${customTheme?.border || getThemeBorder(theme)};
      border-radius: 4px;
    }
    .codeblock-content::-webkit-scrollbar-thumb:hover {
      background: ${customTheme?.primary || getThemePrimary(theme)};
    }
    .codeblock-content::-webkit-scrollbar-corner {
      background: ${customTheme?.background || getThemeBackground(theme)};
    }
  `);
  
  return styles.join('\n');
}

// Theme color getters
function getThemeBackground(theme: CodeTheme): string {
  const themes = {
    dark: '#1e1e1e',
    light: '#ffffff',
    monokai: '#272822',
    dracula: '#282a36',
    github: '#f6f8fa',
    'vs-code': '#1e1e1e',
    atom: '#1d1f21',
    solarized: '#002b36',
    tomorrow: '#1d1f21',
    oceanic: '#1b2632',
    material: '#263238',
    nord: '#2e3440',
    gruvbox: '#282828',
    'one-dark': '#282c34',
    'one-light': '#fafafa'
  };
  return themes[theme] || themes.dark;
}

function getThemeForeground(theme: CodeTheme): string {
  const themes = {
    dark: '#d4d4d4',
    light: '#333333',
    monokai: '#f8f8f2',
    dracula: '#f8f8f2',
    github: '#24292e',
    'vs-code': '#d4d4d4',
    atom: '#c5c8c6',
    solarized: '#839496',
    tomorrow: '#c5c8c6',
    oceanic: '#b0b7bc',
    material: '#eeffff',
    nord: '#d8dee9',
    gruvbox: '#ebdbb2',
    'one-dark': '#abb2bf',
    'one-light': '#383a42'
  };
  return themes[theme] || themes.dark;
}

function getThemeBorder(theme: CodeTheme): string {
  const themes = {
    dark: '#333333',
    light: '#e1e4e8',
    monokai: '#49483e',
    dracula: '#44475a',
    github: '#e1e4e8',
    'vs-code': '#333333',
    atom: '#373b41',
    solarized: '#073642',
    tomorrow: '#373b41',
    oceanic: '#2c3e50',
    material: '#37474f',
    nord: '#3b4252',
    gruvbox: '#3c3836',
    'one-dark': '#3e4451',
    'one-light': '#e1e4e8'
  };
  return themes[theme] || themes.dark;
}

function getThemePrimary(theme: CodeTheme): string {
  const themes = {
    dark: '#007acc',
    light: '#0366d6',
    monokai: '#a6e22e',
    dracula: '#bd93f9',
    github: '#0366d6',
    'vs-code': '#007acc',
    atom: '#c678dd',
    solarized: '#268bd2',
    tomorrow: '#c678dd',
    oceanic: '#5dade2',
    material: '#80cbc4',
    nord: '#88c0d0',
    gruvbox: '#b16286',
    'one-dark': '#61afef',
    'one-light': '#4078f2'
  };
  return themes[theme] || themes.dark;
}

function getThemeSuccess(theme: CodeTheme): string {
  return '#00ff00';
}

function getThemeWarning(theme: CodeTheme): string {
  return '#ffaa00';
}

function getThemeError(theme: CodeTheme): string {
  return '#ff0000';
}

function getThemeSelection(theme: CodeTheme): string {
  const themes = {
    dark: '#264f78',
    light: '#b3d4fc',
    monokai: '#49483e',
    dracula: '#44475a',
    github: '#b3d4fc',
    'vs-code': '#264f78',
    atom: '#373b41',
    solarized: '#073642',
    tomorrow: '#373b41',
    oceanic: '#2c3e50',
    material: '#37474f',
    nord: '#3b4252',
    gruvbox: '#3c3836',
    'one-dark': '#3e4451',
    'one-light': '#b3d4fc'
  };
  return themes[theme] || themes.dark;
}

function getThemeComment(theme: CodeTheme): string {
  const themes = {
    dark: '#6a9955',
    light: '#6a737d',
    monokai: '#75715e',
    dracula: '#6272a4',
    github: '#6a737d',
    'vs-code': '#6a9955',
    atom: '#969896',
    solarized: '#93a1a1',
    tomorrow: '#969896',
    oceanic: '#7f8c8d',
    material: '#546e7a',
    nord: '#4c566a',
    gruvbox: '#928374',
    'one-dark': '#5c6370',
    'one-light': '#a0a1a7'
  };
  return themes[theme] || themes.dark;
}

function getThemeKeyword(theme: CodeTheme): string {
  const themes = {
    dark: '#569cd6',
    light: '#d73a49',
    monokai: '#f92672',
    dracula: '#ff79c6',
    github: '#d73a49',
    'vs-code': '#569cd6',
    atom: '#c678dd',
    solarized: '#859900',
    tomorrow: '#c678dd',
    oceanic: '#5dade2',
    material: '#c792ea',
    nord: '#81a1c1',
    gruvbox: '#fb4934',
    'one-dark': '#c678dd',
    'one-light': '#a626a4'
  };
  return themes[theme] || themes.dark;
}

function getThemeString(theme: CodeTheme): string {
  const themes = {
    dark: '#ce9178',
    light: '#032f62',
    monokai: '#e6db74',
    dracula: '#f1fa8c',
    github: '#032f62',
    'vs-code': '#ce9178',
    atom: '#e6db74',
    solarized: '#2aa198',
    tomorrow: '#e6db74',
    oceanic: '#5dade2',
    material: '#c3e88d',
    nord: '#a3be8c',
    gruvbox: '#b8bb26',
    'one-dark': '#98c379',
    'one-light': '#50a14f'
  };
  return themes[theme] || themes.dark;
}

function getThemeNumber(theme: CodeTheme): string {
  const themes = {
    dark: '#b5cea8',
    light: '#005cc5',
    monokai: '#ae81ff',
    dracula: '#bd93f9',
    github: '#005cc5',
    'vs-code': '#b5cea8',
    atom: '#ae81ff',
    solarized: '#d33682',
    tomorrow: '#ae81ff',
    oceanic: '#5dade2',
    material: '#f78c6c',
    nord: '#b48ead',
    gruvbox: '#d3869b',
    'one-dark': '#d19a66',
    'one-light': '#986801'
  };
  return themes[theme] || themes.dark;
}

function getThemeFunction(theme: CodeTheme): string {
  const themes = {
    dark: '#dcdcaa',
    light: '#6f42c1',
    monokai: '#a6e22e',
    dracula: '#50fa7b',
    github: '#6f42c1',
    'vs-code': '#dcdcaa',
    atom: '#a6e22e',
    solarized: '#268bd2',
    tomorrow: '#a6e22e',
    oceanic: '#5dade2',
    material: '#82aaff',
    nord: '#88c0d0',
    gruvbox: '#fabd2f',
    'one-dark': '#61afef',
    'one-light': '#4078f2'
  };
  return themes[theme] || themes.dark;
}

function getThemeVariable(theme: CodeTheme): string {
  const themes = {
    dark: '#9cdcfe',
    light: '#e36209',
    monokai: '#f8f8f2',
    dracula: '#f8f8f2',
    github: '#e36209',
    'vs-code': '#9cdcfe',
    atom: '#f8f8f2',
    solarized: '#93a1a1',
    tomorrow: '#f8f8f2',
    oceanic: '#b0b7bc',
    material: '#eeffff',
    nord: '#d8dee9',
    gruvbox: '#ebdbb2',
    'one-dark': '#e06c75',
    'one-light': '#e45649'
  };
  return themes[theme] || themes.dark;
}

function getThemeType(theme: CodeTheme): string {
  const themes = {
    dark: '#4ec9b0',
    light: '#005cc5',
    monokai: '#66d9ef',
    dracula: '#8be9fd',
    github: '#005cc5',
    'vs-code': '#4ec9b0',
    atom: '#66d9ef',
    solarized: '#268bd2',
    tomorrow: '#66d9ef',
    oceanic: '#5dade2',
    material: '#89ddff',
    nord: '#88c0d0',
    gruvbox: '#83a598',
    'one-dark': '#56b6c2',
    'one-light': '#0184bc'
  };
  return themes[theme] || themes.dark;
}

function getThemeConstant(theme: CodeTheme): string {
  const themes = {
    dark: '#4fc1ff',
    light: '#005cc5',
    monokai: '#ae81ff',
    dracula: '#bd93f9',
    github: '#005cc5',
    'vs-code': '#4fc1ff',
    atom: '#ae81ff',
    solarized: '#d33682',
    tomorrow: '#ae81ff',
    oceanic: '#5dade2',
    material: '#f78c6c',
    nord: '#b48ead',
    gruvbox: '#d3869b',
    'one-dark': '#d19a66',
    'one-light': '#986801'
  };
  return themes[theme] || themes.dark;
}

// Get variant-specific class names
export function getCodeBlockVariantClass(variant: CodeBlockVariant): string {
  return `codeblock-${variant}`;
}

// Get state-specific class names
export function getCodeBlockStateClass(state: CodeBlockState): string {
  return `codeblock-${state}`;
}

// Get theme-specific class names
export function getCodeBlockThemeClass(theme: CodeTheme): string {
  return `codeblock-theme-${theme}`;
}

// Generate responsive styles
export function generateResponsiveCodeBlockStyles(): string {
  return `
    @media (max-width: 768px) {
      .codeblock-container {
        width: 100%;
        height: auto;
        min-height: 200px;
      }
      .codeblock-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5em;
      }
      .codeblock-actions {
        width: 100%;
        justify-content: space-between;
      }
      .codeblock-footer {
        flex-direction: column;
        gap: 0.5em;
      }
      .codeblock-metadata {
        flex-wrap: wrap;
      }
    }
    
    @media (max-width: 480px) {
      .codeblock-container {
        padding: 0.5em;
        font-size: 0.8em;
      }
      .codeblock-content {
        padding: 0.5em;
      }
      .codeblock-line-numbers {
        width: 2em;
        font-size: 0.7em;
      }
      .codeblock-code.with-line-numbers {
        padding-left: 3em;
      }
    }
  `;
}