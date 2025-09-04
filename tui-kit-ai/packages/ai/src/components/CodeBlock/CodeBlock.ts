import blessed from 'blessed';
import { CodeBlockProps, CodeBlockEvents, CodeBlockMethods } from './CodeBlock.types';

export class CodeBlock implements CodeBlockMethods {
  private screen: blessed.Widgets.Screen;
  private container: blessed.Widgets.BoxElement;
  private header: blessed.Widgets.BoxElement;
  private content: blessed.Widgets.BoxElement;
  private lineNumbers: blessed.Widgets.BoxElement | null = null;
  private codeText: blessed.Widgets.BoxElement;
  private footer: blessed.Widgets.BoxElement;
  
  private props: CodeBlockProps;
  private events: CodeBlockEvents;
  private isExpanded: boolean = true;
  private maxHeight: number = 20;

  constructor(props: Partial<CodeBlockProps> = {}) {
    this.props = {
      language: 'javascript',
      theme: 'dark',
      code: '',
      showLineNumbers: true,
      showCopyButton: true,
      expandable: false,
      width: 80,
      height: 20,
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        keyword: '#ff6b6b',
        string: '#4ecdc4',
        comment: '#888888',
        number: '#feca57',
        function: '#00ff00',
        variable: '#0088ff',
        border: '#333333'
      },
      ...props
    };

    this.events = {
      copy: props.onCopy || (() => {}),
      expand: props.onExpand || (() => {}),
      languageChange: props.onLanguageChange || (() => {}),
      themeChange: props.onThemeChange || (() => {})
    };

    this.initialize();
  }

  private initialize(): void {
    this.createScreen();
    this.createContainer();
    this.createHeader();
    this.createContent();
    this.createFooter();
    this.setupEventHandlers();
  }

  private createScreen(): void {
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'CodeBlock Component',
      fullUnicode: true
    });
  }

  private createContainer(): void {
    this.container = blessed.box({
      parent: this.screen,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: this.getThemeColor('border')
        }
      }
    });
  }

  private createHeader(): void {
    this.header = blessed.box({
      parent: this.container,
      top: 0,
      left: 0,
      width: '100%',
      height: 3,
      content: `{green-fg}${this.props.language.toUpperCase()}{white-fg} - ${this.getLineCount()} lines`,
      tags: true,
      style: {
        bg: 'blue',
        fg: 'white'
      }
    });
  }

  private createContent(): void {
    const contentTop = 3;
    const contentHeight = this.props.expandable ? '80%' : '85%';
    
    this.content = blessed.box({
      parent: this.container,
      top: contentTop,
      left: 0,
      width: '100%',
      height: contentHeight,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: this.getThemeColor('border')
        }
      }
    });

    if (this.props.showLineNumbers) {
      this.createLineNumbers();
    }

    this.createCodeText();
  }

  private createLineNumbers(): void {
    this.lineNumbers = blessed.box({
      parent: this.content,
      top: 0,
      left: 0,
      width: 8,
      height: '100%',
      border: {
        type: 'line',
        right: true
      },
      style: {
        border: {
          fg: this.getThemeColor('border')
        },
        fg: this.getThemeColor('comment')
      },
      scrollable: true,
      alwaysScroll: true
    });
  }

  private createCodeText(): void {
    const leftOffset = this.props.showLineNumbers ? 8 : 0;
    const width = this.props.showLineNumbers ? '90%' : '100%';
    
    this.codeText = blessed.box({
      parent: this.content,
      top: 0,
      left: leftOffset,
      width: width,
      height: '100%',
      style: {
        fg: this.getThemeColor('foreground')
      },
      scrollable: true,
      alwaysScroll: true,
      mouse: true,
      keys: true,
      vi: true
    });
  }

  private createFooter(): void {
    this.footer = blessed.box({
      parent: this.container,
      bottom: 0,
      left: 0,
      width: '100%',
      height: 1,
      content: this.getFooterContent(),
      style: {
        bg: 'black',
        fg: 'white'
      }
    });
  }

  private getFooterContent(): string {
    const controls = [];
    
    if (this.props.showCopyButton) {
      controls.push('c: Copy');
    }
    
    if (this.props.expandable) {
      controls.push('e: Toggle Expand');
    }
    
    controls.push('q: Quit');
    
    return controls.join(' | ');
  }

  private setupEventHandlers(): void {
    this.screen.key(['q', 'C-c'], () => {
      process.exit(0);
    });
    
    if (this.props.showCopyButton) {
      this.screen.key(['c'], () => {
        this.copyToClipboard();
      });
    }
    
    if (this.props.expandable) {
      this.screen.key(['e'], () => {
        this.toggleExpanded();
      });
    }
  }

  private getThemeColor(color: keyof CodeBlockProps['theme']): string {
    const colorMap = {
      background: 'black',
      foreground: 'white',
      keyword: 'red',
      string: 'cyan',
      comment: 'gray',
      number: 'yellow',
      function: 'green',
      variable: 'blue',
      border: 'white'
    };
    return colorMap[color] || 'white';
  }

  private getLineCount(): number {
    return this.props.code.split('\n').length;
  }

  private highlightCode(code: string, language: string): string {
    // Simple syntax highlighting for terminal
    let highlighted = code;
    
    // Highlight keywords
    const keywords = this.getKeywords(language);
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `{${this.getThemeColor('keyword')}-fg}${keyword}{white-fg}`);
    });
    
    // Highlight strings
    highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, `{${this.getThemeColor('string')}-fg}$1$2$1{white-fg}`);
    
    // Highlight comments
    if (language === 'javascript' || language === 'typescript') {
      highlighted = highlighted.replace(/\/\/.*$/gm, `{${this.getThemeColor('comment')}-fg}$&{white-fg}`);
      highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, `{${this.getThemeColor('comment')}-fg}$&{white-fg}`);
    } else if (language === 'python') {
      highlighted = highlighted.replace(/#.*$/gm, `{${this.getThemeColor('comment')}-fg}$&{white-fg}`);
    } else if (language === 'java' || language === 'cpp') {
      highlighted = highlighted.replace(/\/\/.*$/gm, `{${this.getThemeColor('comment')}-fg}$&{white-fg}`);
      highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, `{${this.getThemeColor('comment')}-fg}$&{white-fg}`);
    }
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, `{${this.getThemeColor('number')}-fg}$&{white-fg}`);
    
    return highlighted;
  }

  private getKeywords(language: string): string[] {
    const keywords = {
      javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await'],
      typescript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await', 'interface', 'type', 'enum'],
      python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'with'],
      java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'if', 'else', 'for', 'while', 'return', 'import', 'package'],
      cpp: ['#include', 'using', 'namespace', 'class', 'struct', 'if', 'else', 'for', 'while', 'return', 'int', 'float', 'double', 'char', 'bool'],
      go: ['package', 'import', 'func', 'var', 'const', 'type', 'struct', 'interface', 'if', 'else', 'for', 'range', 'return', 'go', 'chan'],
      rust: ['fn', 'let', 'mut', 'const', 'struct', 'enum', 'impl', 'trait', 'if', 'else', 'for', 'while', 'loop', 'return', 'use', 'mod'],
      html: ['<html>', '<head>', '<body>', '<div>', '<span>', '<p>', '<h1>', '<h2>', '<h3>', '<a>', '<img>', '<script>', '<style>'],
      css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'float', 'clear', 'font-size', 'font-weight'],
      sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER']
    };
    
    return keywords[language] || [];
  }

  private updateLineNumbers(): void {
    if (!this.lineNumbers) return;
    
    const lines = this.props.code.split('\n');
    const lineNumbers = lines.map((_, i) => {
      const lineNum = (i + 1).toString().padStart(3, ' ');
      return `{${this.getThemeColor('comment')}-fg}${lineNum}{white-fg}`;
    }).join('\n');
    
    this.lineNumbers.setContent(lineNumbers);
  }

  private updateCode(): void {
    const highlightedCode = this.highlightCode(this.props.code, this.props.language);
    this.codeText.setContent(highlightedCode);
  }

  private updateHeader(): void {
    this.header.setContent(
      `{green-fg}${this.props.language.toUpperCase()}{white-fg} - ${this.getLineCount()} lines`
    );
  }

  // Public Methods
  public setCode(code: string): void {
    this.props.code = code;
    this.updateCode();
    this.updateLineNumbers();
    this.updateHeader();
  }

  public setLanguage(language: string): void {
    this.props.language = language;
    this.updateCode();
    this.updateHeader();
    this.events.languageChange(language);
  }

  public setTheme(theme: string): void {
    this.props.theme = theme;
    this.updateCode();
    this.events.themeChange(theme);
  }

  public toggleLineNumbers(): void {
    this.props.showLineNumbers = !this.props.showLineNumbers;
    this.createContent(); // Recreate content with new line number setting
  }

  public toggleCopyButton(): void {
    this.props.showCopyButton = !this.props.showCopyButton;
    this.footer.setContent(this.getFooterContent());
  }

  public toggleExpandable(): void {
    this.props.expandable = !this.props.expandable;
    this.createContent(); // Recreate content with new expandable setting
  }

  public toggleExpanded(): void {
    if (!this.props.expandable) return;
    
    this.isExpanded = !this.isExpanded;
    this.events.expand(this.isExpanded);
    
    if (this.isExpanded) {
      this.content.height = '80%';
    } else {
      this.content.height = this.maxHeight;
    }
    
    this.screen.render();
  }

  public copyToClipboard(): void {
    // In a real implementation, this would copy to system clipboard
    // For now, we'll just log the code
    console.log('Code copied to clipboard:');
    console.log(this.props.code);
    this.events.copy(this.props.code);
    
    // Show feedback
    const originalContent = this.footer.content;
    this.footer.setContent('{green-fg}Code copied to clipboard!{white-fg}');
    this.screen.render();
    
    setTimeout(() => {
      this.footer.setContent(originalContent);
      this.screen.render();
    }, 2000);
  }

  public getCode(): string {
    return this.props.code;
  }

  public getLanguage(): string {
    return this.props.language;
  }

  public getTheme(): string {
    return this.props.theme;
  }

  public updateProps(newProps: Partial<CodeBlockProps>): void {
    this.props = { ...this.props, ...newProps };
    this.updateCode();
    this.updateLineNumbers();
    this.updateHeader();
  }

  public render(): void {
    this.screen.render();
  }

  public destroy(): void {
    // Cleanup if needed
  }
}