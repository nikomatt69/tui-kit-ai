import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { LogViewerProps, LogViewerVariants, LogViewerSizes, LogViewerStates } from './LogViewer.types';
import { LogViewerStyles } from './LogViewer.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class LogViewer implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: LogViewerProps;
  private validationResult: ValidationResult;
  private logs: any[] = [];
  private currentIndex: number = 0;
  private maxLines: number = 100;

  constructor(props: LogViewerProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('LogViewer', props);
    
    if (!this.validationResult.success) {
      console.error('❌ LogViewer validation failed:', this.validationResult.errors);
      throw new Error(`LogViewer validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ LogViewer warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: LogViewerStyles.getStyle(this.props),
      content: this.renderLogs(),
      align: 'left',
      valign: 'top',
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: ' ',
        style: { bg: 'blue' }
      }
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focus');
    });

    this.el.on('blur', () => {
      this.setState('default');
    });

    // Handle mouse events
    this.el.on('mouseover', () => {
      this.setState('hover');
    });

    this.el.on('mouseout', () => {
      this.setState('default');
    });

    // Handle scroll events
    this.el.on('scroll', () => {
      this.updateScrollPosition();
    });

    // Handle key events for navigation
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
    });
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'up':
      case 'k':
        this.scrollUp();
        break;
      case 'down':
      case 'j':
        this.scrollDown();
        break;
      case 'home':
        this.scrollToTop();
        break;
      case 'end':
        this.scrollToBottom();
        break;
      case 'pageup':
        this.pageUp();
        break;
      case 'pagedown':
        this.pageDown();
        break;
    }
  }

  private updateScrollPosition() {
    if (this.props.onScroll) {
      this.props.onScroll({
        type: 'scroll',
        target: this.el,
        position: this.el.scrollTop,
        maxScroll: this.el.maxScroll,
      });
    }
  }

  private renderLogs(): string {
    if (this.logs.length === 0) {
      return this.props.emptyMessage || 'No logs available';
    }

    let content = '';
    const startIndex = Math.max(0, this.currentIndex);
    const endIndex = Math.min(this.logs.length, startIndex + this.maxLines);

    for (let i = startIndex; i < endIndex; i++) {
      const log = this.logs[i];
      content += this.formatLogEntry(log, i);
      if (i < endIndex - 1) {
        content += '\n';
      }
    }

    return content;
  }

  private formatLogEntry(log: any, index: number): string {
    const timestamp = log.timestamp ? `[${log.timestamp}] ` : '';
    const level = log.level ? `[${log.level.toUpperCase()}] ` : '';
    const message = log.message || log;
    
    let formatted = '';
    
    if (this.props.showLineNumbers) {
      formatted += `${(index + 1).toString().padStart(4)} `;
    }
    
    if (this.props.showTimestamp && timestamp) {
      formatted += timestamp;
    }
    
    if (this.props.showLevel && level) {
      formatted += level;
    }
    
    formatted += message;
    
    return formatted;
  }

  // Variant system methods
  setVariant(variant: LogViewerVariants) {
    this.props.variant = variant;
    this.el.style = LogViewerStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: LogViewerSizes) {
    this.props.size = size;
    this.el.style = LogViewerStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: LogViewerStates) {
    this.props.state = state;
    this.el.style = LogViewerStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // LogViewer-specific methods
  addLog(log: any) {
    this.logs.push(log);
    
    // Maintain max lines limit
    if (this.logs.length > this.maxLines) {
      this.logs.shift();
    }
    
    // Auto-scroll to bottom if enabled
    if (this.props.autoScroll) {
      this.scrollToBottom();
    }
    
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
    
    if (this.props.onLogAdded) {
      this.props.onLogAdded({
        type: 'logadded',
        target: this.el,
        log,
        totalLogs: this.logs.length,
      });
    }
  }

  addLogs(logs: any[]) {
    logs.forEach(log => this.addLog(log));
  }

  clearLogs() {
    this.logs = [];
    this.currentIndex = 0;
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
    
    if (this.props.onLogsCleared) {
      this.props.onLogsCleared({
        type: 'logscleared',
        target: this.el,
      });
    }
  }

  setMaxLines(maxLines: number) {
    this.maxLines = maxLines;
    if (this.logs.length > maxLines) {
      this.logs = this.logs.slice(-maxLines);
    }
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
  }

  setShowLineNumbers(show: boolean) {
    this.props.showLineNumbers = show;
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
  }

  setShowTimestamp(show: boolean) {
    this.props.showTimestamp = show;
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
  }

  setShowLevel(show: boolean) {
    this.props.showLevel = show;
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
  }

  setAutoScroll(autoScroll: boolean) {
    this.props.autoScroll = autoScroll;
  }

  // Scroll methods
  scrollUp() {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
  }

  scrollDown() {
    this.currentIndex = Math.min(this.logs.length - this.maxLines, this.currentIndex + 1);
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
  }

  scrollToTop() {
    this.currentIndex = 0;
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
  }

  scrollToBottom() {
    this.currentIndex = Math.max(0, this.logs.length - this.maxLines);
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
  }

  pageUp() {
    this.currentIndex = Math.max(0, this.currentIndex - Math.floor(this.maxLines / 2));
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
  }

  pageDown() {
    this.currentIndex = Math.min(this.logs.length - this.maxLines, this.currentIndex + Math.floor(this.maxLines / 2));
    this.el.setContent(this.renderLogs());
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      logs: this.logs,
      currentIndex: this.currentIndex,
      maxLines: this.maxLines,
      totalLogs: this.logs.length,
      showLineNumbers: this.props.showLineNumbers,
      showTimestamp: this.props.showTimestamp,
      showLevel: this.props.showLevel,
      autoScroll: this.props.autoScroll,
    };
  }

  // Get log viewer properties
  getLogs(): any[] {
    return [...this.logs];
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getMaxLines(): number {
    return this.maxLines;
  }

  getTotalLogs(): number {
    return this.logs.length;
  }

  // Update component with new props
  update(newProps: Partial<LogViewerProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('LogViewer', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ LogViewer update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = LogViewerStyles.getStyle(this.props);
    
    // Update content if display options changed
    if (newProps.showLineNumbers !== undefined || 
        newProps.showTimestamp !== undefined || 
        newProps.showLevel !== undefined) {
      this.el.setContent(this.renderLogs());
    }
    
    this.el.screen.render();
  }

  // Focus management
  focus() {
    this.el.focus();
  }

  blur() {
    this.el.blur();
  }

  // Visibility management
  show() {
    this.el.show();
    this.el.screen.render();
  }

  hide() {
    this.el.hide();
    this.el.screen.render();
  }

  // Get validation result for debugging
  getValidationResult(): ValidationResult {
    return this.validationResult;
  }
}