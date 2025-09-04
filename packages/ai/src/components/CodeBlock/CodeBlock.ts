import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../core/src/components/BaseComponent';
import { CodeBlockProps, CodeBlockVariants, CodeBlockSizes, CodeBlockStates, CodeLanguage, CodeTheme, CodeBlockAction, CodeError, SyntaxToken } from './CodeBlock.types';
import { CodeBlockStyles } from './CodeBlock.styles';
import { validateComponent, ValidationResult } from '../../../core/src/validation/component-validator';

export class CodeBlock implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: CodeBlockProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private contentElement?: Widgets.BoxElement;
  private lineNumbersElement?: Widgets.BoxElement;
  private actionsElement?: Widgets.BoxElement;
  private errorElement?: Widgets.BoxElement;
  private filenameElement?: Widgets.BoxElement;
  private code: string = '';
  private language: CodeLanguage = 'plaintext';
  private isExpanded: boolean = false;
  private isCollapsed: boolean = false;
  private syntaxTokens: SyntaxToken[] = [];

  constructor(props: CodeBlockProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('CodeBlock', props);
    
    if (!this.validationResult.success) {
      console.error('❌ CodeBlock validation failed:', this.validationResult.errors);
      throw new Error(`CodeBlock validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ CodeBlock warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.code = this.props.code || '';
    this.language = this.props.language || 'plaintext';
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: CodeBlockStyles.getStyle(this.props),
      content: '',
      align: 'left',
      valign: 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupCodeBlockStructure();
    this.setupEventHandlers();
    this.parseSyntax();
  }
  
  private setupCodeBlockStructure() {
    const { showLineNumbers, showActions, showErrors, filename } = this.props;
    let topOffset = 0;
    
    // Create filename display if provided
    if (filename) {
      this.filenameElement = this.el.parent?.append({
        type: 'box',
        content: `📄 ${filename}`,
        style: CodeBlockStyles.getFilenameStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 1,
      }) as Widgets.BoxElement;
      topOffset += 1;
    }
    
    // Create header with language info
    this.headerElement = this.el.parent?.append({
      type: 'box',
      content: `🔤 ${this.language.toUpperCase()}`,
      style: CodeBlockStyles.getHeaderStyle(this.props),
      top: topOffset,
      left: 0,
      width: '100%',
      height: 3,
    }) as Widgets.BoxElement;
    topOffset += 3;
    
    // Create line numbers if enabled
    if (showLineNumbers) {
      this.lineNumbersElement = this.el.parent?.append({
        type: 'box',
        content: this.generateLineNumbers(),
        style: CodeBlockStyles.getLineNumbersStyle(this.props),
        top: topOffset,
        left: 0,
        width: 4,
        height: this.props.size === 'full' ? '100%-6' : 16,
      }) as Widgets.BoxElement;
    }
    
    // Create content area
    const contentLeft = showLineNumbers ? 4 : 0;
    const contentWidth = showLineNumbers ? '100%-4' : '100%';
    
    this.contentElement = this.el.parent?.append({
      type: 'box',
      content: this.formatCode(),
      style: CodeBlockStyles.getContentStyle(this.props),
      top: topOffset,
      left: contentLeft,
      width: contentWidth,
      height: this.props.size === 'full' ? '100%-6' : 16,
      scrollable: true,
      alwaysScroll: true,
    }) as Widgets.BoxElement;
    
    // Create actions bar if enabled
    if (showActions && this.props.actions && this.props.actions.length > 0) {
      this.actionsElement = this.el.parent?.append({
        type: 'box',
        content: this.formatActions(),
        style: CodeBlockStyles.getActionsStyle(this.props),
        top: '100%-3',
        left: 0,
        width: '100%',
        height: 2,
      }) as Widgets.BoxElement;
    }
    
    // Create error display if there are errors
    if (showErrors && this.props.errors && this.props.errors.length > 0) {
      this.errorElement = this.el.parent?.append({
        type: 'box',
        content: this.formatErrors(),
        style: CodeBlockStyles.getErrorStyle(this.props),
        top: '100%-1',
        left: 0,
        width: '100%',
        height: 1,
      }) as Widgets.BoxElement;
    }
  }
  
  private setupEventHandlers() {
    // Handle keyboard events
    this.el.key(['c'], () => {
      if (this.props.copyable) {
        this.copyCode();
      }
    });
    
    this.el.key(['e'], () => {
      if (this.props.expandable) {
        this.toggleExpand();
      }
    });
    
    this.el.key(['h'], () => {
      if (this.props.collapsible) {
        this.toggleCollapse();
      }
    });
    
    this.el.key(['l'], () => {
      this.toggleLineNumbers();
    });
    
    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focused');
      this.props.onFocus?.();
    });
    
    this.el.on('blur', () => {
      this.setState('default');
      this.props.onBlur?.();
    });
    
    // Handle action shortcuts
    if (this.props.actions) {
      this.props.actions.forEach(action => {
        if (action.shortcut) {
          this.el.key([action.shortcut], () => {
            if (action.enabled !== false) {
              action.action();
            }
          });
        }
      });
    }
  }
  
  private parseSyntax() {
    if (!this.props.highlightSyntax || this.language === 'plaintext') {
      return;
    }
    
    // Simple syntax highlighting implementation
    this.syntaxTokens = this.highlightSyntax(this.code, this.language);
  }
  
  private highlightSyntax(code: string, language: CodeLanguage): SyntaxToken[] {
    const tokens: SyntaxToken[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, lineIndex) => {
      let currentPos = 0;
      
      // Simple keyword highlighting
      const keywords = this.getLanguageKeywords(language);
      const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
      
      let match;
      while ((match = keywordRegex.exec(line)) !== null) {
        // Add text before keyword
        if (match.index > currentPos) {
          tokens.push({
            type: 'text',
            value: line.substring(currentPos, match.index),
            start: currentPos,
            end: match.index,
          });
        }
        
        // Add keyword
        tokens.push({
          type: 'keyword',
          value: match[0],
          start: match.index,
          end: match.index + match[0].length,
          style: CodeBlockStyles.getSyntaxStyle('keyword', this.props.theme),
        });
        
        currentPos = match.index + match[0].length;
      }
      
      // Add remaining text
      if (currentPos < line.length) {
        tokens.push({
          type: 'text',
          value: line.substring(currentPos),
          start: currentPos,
          end: line.length,
        });
      }
    });
    
    return tokens;
  }
  
  private getLanguageKeywords(language: CodeLanguage): string[] {
    const keywordMap: Record<CodeLanguage, string[]> = {
      javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
      typescript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'interface', 'type', 'enum'],
      python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally'],
      java: ['public', 'private', 'protected', 'class', 'interface', 'if', 'else', 'for', 'while', 'return', 'import', 'package'],
      cpp: ['#include', 'using', 'namespace', 'class', 'struct', 'if', 'else', 'for', 'while', 'return', 'public', 'private'],
      c: ['#include', 'if', 'else', 'for', 'while', 'return', 'struct', 'typedef', 'enum'],
      csharp: ['using', 'namespace', 'class', 'interface', 'if', 'else', 'for', 'while', 'return', 'public', 'private'],
      go: ['package', 'import', 'func', 'if', 'else', 'for', 'return', 'type', 'struct', 'interface'],
      rust: ['fn', 'let', 'mut', 'if', 'else', 'for', 'while', 'return', 'struct', 'enum', 'impl', 'trait'],
      php: ['<?php', 'function', 'class', 'if', 'else', 'for', 'while', 'return', 'public', 'private'],
      ruby: ['def', 'class', 'if', 'else', 'for', 'while', 'return', 'require', 'module'],
      swift: ['func', 'class', 'struct', 'if', 'else', 'for', 'while', 'return', 'import', 'let', 'var'],
      kotlin: ['fun', 'class', 'interface', 'if', 'else', 'for', 'while', 'return', 'import', 'val', 'var'],
      scala: ['def', 'class', 'object', 'trait', 'if', 'else', 'for', 'while', 'return', 'import', 'val', 'var'],
      html: ['<html>', '<head>', '<body>', '<div>', '<span>', '<p>', '<h1>', '<h2>', '<h3>', '<a>', '<img>'],
      css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position'],
      scss: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', '@mixin', '@include'],
      sass: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', '@mixin', '@include'],
      less: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position'],
      json: ['true', 'false', 'null'],
      xml: ['<?xml', '<', '>', '</', '/>'],
      yaml: ['---', '...', 'true', 'false', 'null'],
      toml: ['true', 'false'],
      ini: ['true', 'false'],
      sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'],
      bash: ['if', 'then', 'else', 'fi', 'for', 'while', 'do', 'done', 'function'],
      shell: ['if', 'then', 'else', 'fi', 'for', 'while', 'do', 'done', 'function'],
      powershell: ['if', 'else', 'for', 'while', 'function', 'param', 'return'],
      dockerfile: ['FROM', 'RUN', 'COPY', 'ADD', 'WORKDIR', 'EXPOSE', 'CMD', 'ENTRYPOINT'],
      markdown: ['#', '##', '###', '**', '*', '`', '```'],
      plaintext: [],
    };
    
    return keywordMap[language] || [];
  }
  
  private formatCode(): string {
    if (this.isCollapsed) {
      return '... (collapsed) ...';
    }
    
    if (!this.props.highlightSyntax || this.syntaxTokens.length === 0) {
      return this.code;
    }
    
    // Format code with syntax highlighting
    let formattedCode = '';
    this.syntaxTokens.forEach(token => {
      formattedCode += token.value;
    });
    
    return formattedCode;
  }
  
  private generateLineNumbers(): string {
    const lines = this.code.split('\n');
    return lines.map((_, index) => `${index + 1}`).join('\n');
  }
  
  private formatActions(): string {
    if (!this.props.actions) return '';
    
    return this.props.actions
      .filter(action => action.enabled !== false)
      .map(action => `${action.shortcut ? `[${action.shortcut}]` : ''} ${action.label}`)
      .join(' | ');
  }
  
  private formatErrors(): string {
    if (!this.props.errors) return '';
    
    return this.props.errors
      .map(error => `Line ${error.line}: ${error.message}`)
      .join(' | ');
  }
  
  // Public methods
  setCode(code: string) {
    this.code = code;
    this.parseSyntax();
    this.updateContent();
    this.props.onCodeChange?.(code);
    this.render();
  }
  
  setLanguage(language: CodeLanguage) {
    this.language = language;
    this.parseSyntax();
    this.updateContent();
    this.updateHeader();
    this.props.onLanguageChange?.(language);
    this.render();
  }
  
  setTheme(theme: CodeTheme) {
    this.props.theme = theme;
    this.parseSyntax();
    this.updateContent();
    this.updateStyles();
    this.render();
  }
  
  copyCode() {
    // In a real implementation, this would copy to clipboard
    console.log('Code copied to clipboard:', this.code);
    this.props.onCopy?.(this.code);
  }
  
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    this.isCollapsed = false;
    this.updateContent();
    this.props.onExpand?.();
    this.render();
  }
  
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.isExpanded = false;
    this.updateContent();
    this.props.onCollapse?.();
    this.render();
  }
  
  toggleLineNumbers() {
    this.props.showLineNumbers = !this.props.showLineNumbers;
    this.setupCodeBlockStructure();
    this.render();
  }
  
  private updateContent() {
    if (this.contentElement) {
      this.contentElement.setContent(this.formatCode());
    }
  }
  
  private updateHeader() {
    if (this.headerElement) {
      this.headerElement.setContent(`🔤 ${this.language.toUpperCase()}`);
    }
  }
  
  private updateStyles() {
    const newStyle = CodeBlockStyles.getStyle(this.props);
    this.el.style = newStyle;
    
    if (this.headerElement) {
      this.headerElement.style = CodeBlockStyles.getHeaderStyle(this.props);
    }
    
    if (this.contentElement) {
      this.contentElement.style = CodeBlockStyles.getContentStyle(this.props);
    }
  }
  
  private render() {
    this.el.screen?.render();
  }
  
  // Implement required methods by delegating to base component
  setVariant = (variant: CodeBlockVariants) => {
    this.props.variant = variant;
    this.el.style = CodeBlockStyles.getStyle(this.props);
    this.render();
  };
  
  setSize = (size: CodeBlockSizes) => {
    this.props.size = size;
    this.el.style = CodeBlockStyles.getStyle(this.props);
    this.render();
  };
  
  setState = (state: CodeBlockStates) => {
    this.props.state = state;
    this.el.style = CodeBlockStyles.getStyle(this.props);
    this.render();
  };
  
  getConfig = () => ({
    variant: this.props.variant || 'default',
    size: this.props.size || 'md',
    state: this.props.state || 'default',
    language: this.language,
    theme: this.props.theme || 'dark',
    codeLength: this.code.length,
    lines: this.code.split('\n').length,
  });
  
  update = (props: Partial<CodeBlockProps>) => {
    this.props = { ...this.props, ...props };
    this.el.style = CodeBlockStyles.getStyle(this.props);
    this.render();
  };
  
  // Static method to create code block with specific configuration
  static create(props: CodeBlockProps): CodeBlock {
    return new CodeBlock(props);
  }
  
  // Utility methods
  getCode(): string {
    return this.code;
  }
  
  getLanguage(): CodeLanguage {
    return this.language;
  }
  
  getTheme(): CodeTheme {
    return this.props.theme || 'dark';
  }
  
  isExpandedState(): boolean {
    return this.isExpanded;
  }
  
  isCollapsedState(): boolean {
    return this.isCollapsed;
  }
}