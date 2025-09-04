import { CodeBlockProps, CodeAction, CodeMetadata, SearchResult, CodeBlockEvents, CodeBlockMethods, Language, CodeTheme } from './CodeBlock.types';
import { generateCodeBlockStyles, getCodeBlockVariantClass, getCodeBlockStateClass, getCodeBlockThemeClass } from './CodeBlock.styles';

export class CodeBlock implements CodeBlockMethods {
  private props: CodeBlockProps;
  private element: HTMLElement | null = null;
  private events: CodeBlockEvents;
  private metadata: CodeMetadata;
  private searchResults: SearchResult[] = [];
  private currentSearchIndex: number = -1;
  private highlightedLines: Set<number> = new Set();

  constructor(props: Partial<CodeBlockProps> = {}) {
    this.props = {
      code: '',
      language: 'plaintext',
      theme: 'dark',
      variant: 'default',
      state: 'default',
      width: 80,
      height: 20,
      collapsible: false,
      collapsed: false,
      copyable: true,
      downloadable: false,
      searchable: true,
      editable: false,
      actions: [],
      theme: {
        primary: '#00ff00',
        secondary: '#0088ff',
        success: '#00ff00',
        warning: '#ffaa00',
        error: '#ff0000',
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        border: '#333333',
        selection: '#264f78',
        comment: '#6a9955',
        keyword: '#569cd6',
        string: '#ce9178',
        number: '#b5cea8',
        function: '#dcdcaa',
        variable: '#9cdcfe',
        type: '#4ec9b0',
        constant: '#4fc1ff'
      },
      syntaxHighlighting: {
        enabled: true,
        theme: 'dark',
        showLineNumbers: true,
        wrapLines: false,
        tabSize: 2,
        insertSpaces: true
      },
      ...props
    };

    this.events = {
      codeChange: props.onCodeChange || (() => {}),
      languageChange: props.onLanguageChange || (() => {}),
      themeChange: props.onThemeChange || (() => {}),
      action: props.onAction || (() => {}),
      copy: props.onCopy || (() => {}),
      download: props.onDownload || (() => {}),
      search: props.onSearch || (() => {}),
      focus: props.onFocus || (() => {}),
      blur: props.onBlur || (() => {}),
      collapse: () => {},
      expand: () => {}
    };

    this.metadata = {
      language: this.props.language,
      lines: 0,
      characters: 0,
      size: 0,
      encoding: 'utf-8',
      ...props.metadata
    };

    this.initialize();
  }

  private initialize(): void {
    this.createElement();
    this.attachEventListeners();
    this.updateMetadata();
    this.updateStyles();
    this.render();
  }

  private createElement(): void {
    this.element = document.createElement('div');
    this.element.className = `codeblock-container ${getCodeBlockVariantClass(this.props.variant)} ${getCodeBlockStateClass(this.props.state)} ${getCodeBlockThemeClass(this.props.theme)}`;
    this.element.setAttribute('data-codeblock-id', this.generateId());
  }

  private attachEventListeners(): void {
    if (!this.element) return;

    // Focus events
    this.element.addEventListener('focus', () => {
      this.setState('focused');
      this.events.focus();
    });

    this.element.addEventListener('blur', () => {
      if (this.props.state === 'focused') {
        this.setState('default');
      }
      this.events.blur();
    });

    // Click events
    this.element.addEventListener('click', (event) => {
      this.handleClick(event);
    });

    // Keyboard events
    this.element.addEventListener('keydown', (event) => {
      this.handleKeydown(event);
    });

    // Make element focusable
    this.element.setAttribute('tabindex', '0');
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    if (target.classList.contains('codeblock-action')) {
      const actionId = target.getAttribute('data-action-id');
      if (actionId) {
        this.handleAction(actionId);
      }
    } else if (target.classList.contains('codeblock-toggle')) {
      this.toggleCollapse();
    } else if (target.classList.contains('codeblock-copy')) {
      this.copyToClipboard();
    } else if (target.classList.contains('codeblock-download')) {
      this.downloadCode();
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'c':
        if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
          event.preventDefault();
          this.copyToClipboard();
        }
        break;
      case 's':
        if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
          event.preventDefault();
          this.downloadCode();
        }
        break;
      case 'f':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.focusSearch();
        }
        break;
      case 'Escape':
        this.clearSearch();
        break;
      case 'Enter':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.toggleCollapse();
        }
        break;
    }
  }

  private handleAction(actionId: string): void {
    const action = this.props.actions.find(a => a.id === actionId);
    if (action && action.enabled) {
      action.action();
      this.events.action(actionId);
    }
  }

  private focusSearch(): void {
    const searchInput = this.element?.querySelector('.codeblock-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  private clearSearch(): void {
    this.searchResults = [];
    this.currentSearchIndex = -1;
    this.highlightedLines.clear();
    this.render();
  }

  private generateId(): string {
    return `codeblock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateMetadata(): void {
    const lines = this.props.code.split('\n').length;
    const characters = this.props.code.length;
    const size = new Blob([this.props.code]).size;

    this.metadata = {
      ...this.metadata,
      language: this.props.language,
      lines,
      characters,
      size,
      lastModified: new Date()
    };
  }

  private updateStyles(): void {
    if (!this.element) return;

    const styleConfig = {
      variant: this.props.variant,
      state: this.props.state,
      theme: this.props.theme,
      language: this.props.language,
      width: this.props.width,
      height: this.props.height,
      maxHeight: this.props.maxHeight,
      customTheme: this.props.theme
    };

    const styles = generateCodeBlockStyles(styleConfig);
    
    // Remove existing styles
    const existingStyle = this.element.querySelector('style');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new styles
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    this.element.appendChild(styleElement);
  }

  private render(): void {
    if (!this.element) return;

    const { variant, state, language, code, collapsible, collapsed, copyable, downloadable, searchable, actions } = this.props;
    
    this.element.className = `codeblock-container ${getCodeBlockVariantClass(variant)} ${getCodeBlockStateClass(state)} ${getCodeBlockThemeClass(this.props.theme)}`;
    
    this.element.innerHTML = `
      <div class="codeblock-header">
        <div class="codeblock-title">
          <span class="codeblock-language">${language}</span>
          ${this.metadata.filename ? `<span class="codeblock-filename">${this.metadata.filename}</span>` : ''}
        </div>
        <div class="codeblock-actions">
          ${collapsible ? `<button class="codeblock-toggle" data-action="toggle">Toggle</button>` : ''}
          ${copyable ? `<button class="codeblock-action codeblock-copy" data-action-id="copy" title="Copy (Ctrl+Shift+C)">📋</button>` : ''}
          ${downloadable ? `<button class="codeblock-action codeblock-download" data-action-id="download" title="Download (Ctrl+Shift+S)">💾</button>` : ''}
          ${actions.map(action => `
            <button class="codeblock-action" data-action-id="${action.id}" title="${action.label}" ${!action.enabled ? 'disabled' : ''}>
              ${action.icon}
            </button>
          `).join('')}
        </div>
      </div>
      
      ${!collapsed ? `
        <div class="codeblock-content">
          ${this.renderCode()}
        </div>
      ` : ''}
      
      <div class="codeblock-footer">
        <div class="codeblock-metadata">
          <div class="codeblock-metadata-item">
            <span>📄</span>
            <span>${this.metadata.lines} lines</span>
          </div>
          <div class="codeblock-metadata-item">
            <span>🔤</span>
            <span>${this.metadata.characters} chars</span>
          </div>
          <div class="codeblock-metadata-item">
            <span>💾</span>
            <span>${this.formatBytes(this.metadata.size)}</span>
          </div>
        </div>
        ${searchable ? `
          <div class="codeblock-search">
            <input type="text" class="codeblock-search-input" placeholder="Search..." />
            <button class="codeblock-action" data-action-id="search">🔍</button>
          </div>
        ` : ''}
      </div>
    `;

    // Attach search functionality
    if (searchable) {
      this.attachSearchListeners();
    }
  }

  private renderCode(): string {
    const { code, syntaxHighlighting } = this.props;
    const { showLineNumbers, highlightLines } = syntaxHighlighting || {};
    
    if (!code.trim()) {
      return '<div class="codeblock-empty">No code to display</div>';
    }

    const lines = code.split('\n');
    const highlightedCode = this.highlightSyntax(code);
    
    let html = '';
    
    if (showLineNumbers) {
      html += '<div class="codeblock-line-numbers">';
      lines.forEach((_, index) => {
        const lineNumber = index + 1;
        html += `<div class="codeblock-line-number">${lineNumber}</div>`;
      });
      html += '</div>';
    }
    
    html += '<div class="codeblock-code' + (showLineNumbers ? ' with-line-numbers' : '') + '">';
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const isHighlighted = highlightLines?.includes(lineNumber) || this.highlightedLines.has(lineNumber);
      const className = isHighlighted ? 'codeblock-line highlighted' : 'codeblock-line';
      
      html += `<div class="${className}" data-line="${lineNumber}">${this.escapeHtml(line)}</div>`;
    });
    
    html += '</div>';
    
    return html;
  }

  private highlightSyntax(code: string): string {
    if (!this.props.syntaxHighlighting?.enabled) {
      return this.escapeHtml(code);
    }

    // Simple syntax highlighting based on language
    const language = this.props.language;
    
    switch (language) {
      case 'javascript':
      case 'typescript':
        return this.highlightJavaScript(code);
      case 'python':
        return this.highlightPython(code);
      case 'html':
        return this.highlightHTML(code);
      case 'css':
        return this.highlightCSS(code);
      case 'json':
        return this.highlightJSON(code);
      default:
        return this.escapeHtml(code);
    }
  }

  private highlightJavaScript(code: string): string {
    return code
      .replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|namespace|module|declare|public|private|protected|static|readonly|abstract|override)\b/g, '<span class="codeblock-keyword">$1</span>')
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="codeblock-string">$1$2$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="codeblock-number">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="codeblock-comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="codeblock-comment">$1</span>')
      .replace(/\b(function|class|interface|type|enum)\s+(\w+)/g, '<span class="codeblock-keyword">$1</span> <span class="codeblock-function">$2</span>');
  }

  private highlightPython(code: string): string {
    return code
      .replace(/\b(def|class|if|elif|else|for|while|try|except|finally|with|import|from|as|return|yield|lambda|and|or|not|in|is|None|True|False|pass|break|continue|raise|assert|del|global|nonlocal)\b/g, '<span class="codeblock-keyword">$1</span>')
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="codeblock-string">$1$2$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="codeblock-number">$1</span>')
      .replace(/(#.*$)/gm, '<span class="codeblock-comment">$1</span>')
      .replace(/\b(def|class)\s+(\w+)/g, '<span class="codeblock-keyword">$1</span> <span class="codeblock-function">$2</span>');
  }

  private highlightHTML(code: string): string {
    return code
      .replace(/(<[^>]+>)/g, '<span class="codeblock-tag">$1</span>')
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="codeblock-string">$1$2$1</span>')
      .replace(/(<!--[\s\S]*?-->)/g, '<span class="codeblock-comment">$1</span>');
  }

  private highlightCSS(code: string): string {
    return code
      .replace(/([.#]?[\w-]+)\s*\{/g, '<span class="codeblock-selector">$1</span> {')
      .replace(/([\w-]+)\s*:/g, '<span class="codeblock-property">$1</span>:')
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="codeblock-string">$1$2$1</span>')
      .replace(/\b(\d+\.?\d*[a-z%]*)\b/g, '<span class="codeblock-number">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="codeblock-comment">$1</span>');
  }

  private highlightJSON(code: string): string {
    return code
      .replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1\s*:/g, '<span class="codeblock-property">$1$2$1</span>:')
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="codeblock-string">$1$2$1</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="codeblock-constant">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="codeblock-number">$1</span>');
  }

  private attachSearchListeners(): void {
    const searchInput = this.element?.querySelector('.codeblock-search-input') as HTMLInputElement;
    const searchButton = this.element?.querySelector('[data-action-id="search"]') as HTMLButtonElement;
    
    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        const query = (event.target as HTMLInputElement).value;
        if (query.trim()) {
          this.searchCode(query);
        } else {
          this.clearSearch();
        }
      });
      
      searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          const query = searchInput.value;
          if (query.trim()) {
            this.searchCode(query);
          }
        }
      });
    }
    
    if (searchButton) {
      searchButton.addEventListener('click', () => {
        const query = searchInput?.value || '';
        if (query.trim()) {
          this.searchCode(query);
        }
      });
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private setState(newState: string): void {
    if (this.props.state !== newState) {
      this.props.state = newState as any;
      this.updateStyles();
      this.render();
    }
  }

  // Public Methods
  public setCode(code: string): void {
    this.props.code = code;
    this.updateMetadata();
    this.events.codeChange(code);
    this.render();
  }

  public getCode(): string {
    return this.props.code;
  }

  public setLanguage(language: Language): void {
    this.props.language = language;
    this.metadata.language = language;
    this.events.languageChange(language);
    this.render();
  }

  public getLanguage(): Language {
    return this.props.language;
  }

  public setTheme(theme: CodeTheme): void {
    this.props.theme = theme;
    this.events.themeChange(theme);
    this.updateStyles();
    this.render();
  }

  public getTheme(): CodeTheme {
    return this.props.theme;
  }

  public highlightSyntax(): void {
    this.render();
  }

  public copyToClipboard(): void {
    navigator.clipboard.writeText(this.props.code).then(() => {
      this.events.copy(this.props.code);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = this.props.code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.events.copy(this.props.code);
    });
  }

  public downloadCode(filename?: string): void {
    const name = filename || this.metadata.filename || `code.${this.getFileExtension()}`;
    const blob = new Blob([this.props.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.events.download(name, this.props.code);
  }

  private getFileExtension(): string {
    const extensions: Record<Language, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      csharp: 'cs',
      cpp: 'cpp',
      c: 'c',
      go: 'go',
      rust: 'rs',
      php: 'php',
      ruby: 'rb',
      swift: 'swift',
      kotlin: 'kt',
      scala: 'scala',
      r: 'r',
      matlab: 'm',
      sql: 'sql',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sass: 'sass',
      less: 'less',
      json: 'json',
      yaml: 'yaml',
      xml: 'xml',
      markdown: 'md',
      bash: 'sh',
      shell: 'sh',
      powershell: 'ps1',
      dockerfile: 'Dockerfile',
      makefile: 'Makefile',
      ini: 'ini',
      toml: 'toml',
      env: 'env',
      gitignore: 'gitignore',
      plaintext: 'txt'
    };
    
    return extensions[this.props.language] || 'txt';
  }

  public searchCode(query: string): SearchResult[] {
    const results: SearchResult[] = [];
    const lines = this.props.code.split('\n');
    const regex = new RegExp(query, 'gi');
    
    lines.forEach((line, index) => {
      let match;
      while ((match = regex.exec(line)) !== null) {
        results.push({
          line: index + 1,
          column: match.index + 1,
          match: match[0],
          context: line.trim()
        });
      }
    });
    
    this.searchResults = results;
    this.events.search(query, results);
    
    // Highlight search results
    this.highlightedLines.clear();
    results.forEach(result => {
      this.highlightedLines.add(result.line);
    });
    
    this.render();
    return results;
  }

  public toggleCollapse(): void {
    this.props.collapsed = !this.props.collapsed;
    if (this.props.collapsed) {
      this.events.collapse();
    } else {
      this.events.expand();
    }
    this.render();
  }

  public collapse(): void {
    if (!this.props.collapsed) {
      this.props.collapsed = true;
      this.events.collapse();
      this.render();
    }
  }

  public expand(): void {
    if (this.props.collapsed) {
      this.props.collapsed = false;
      this.events.expand();
      this.render();
    }
  }

  public isCollapsed(): boolean {
    return this.props.collapsed;
  }

  public isExpanded(): boolean {
    return !this.props.collapsed;
  }

  public addAction(action: CodeAction): void {
    this.props.actions.push(action);
    this.render();
  }

  public removeAction(actionId: string): void {
    this.props.actions = this.props.actions.filter(a => a.id !== actionId);
    this.render();
  }

  public updateMetadata(metadata: Partial<CodeMetadata>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.render();
  }

  public getMetadata(): CodeMetadata {
    return { ...this.metadata };
  }

  public formatCode(): void {
    // Simple formatting - could be enhanced with proper formatters
    const formatted = this.props.code
      .split('\n')
      .map(line => line.trim())
      .join('\n');
    
    this.setCode(formatted);
  }

  public validateCode(): boolean {
    // Simple validation - could be enhanced with proper validators
    return this.props.code.trim().length > 0;
  }

  public getLineCount(): number {
    return this.metadata.lines;
  }

  public getCharacterCount(): number {
    return this.metadata.characters;
  }

  public getSize(): number {
    return this.metadata.size;
  }

  // DOM Methods
  public mount(container: HTMLElement): void {
    if (this.element && container) {
      container.appendChild(this.element);
    }
  }

  public unmount(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  public updateProps(newProps: Partial<CodeBlockProps>): void {
    this.props = { ...this.props, ...newProps };
    this.updateMetadata();
    this.updateStyles();
    this.render();
  }

  public getElement(): HTMLElement | null {
    return this.element;
  }

  public destroy(): void {
    this.unmount();
    this.element = null;
  }
}