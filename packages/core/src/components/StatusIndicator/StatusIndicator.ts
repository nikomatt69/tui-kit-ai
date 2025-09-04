import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { StatusIndicatorProps, StatusIndicatorVariants, StatusIndicatorSizes, StatusIndicatorStates } from './StatusIndicator.types';
import { StatusIndicatorStyles } from './StatusIndicator.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class StatusIndicator implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: StatusIndicatorProps;
  private validationResult: ValidationResult;
  private currentStatus: string = 'idle';
  private statusHistory: Array<{ status: string; timestamp: number }> = [];

  constructor(props: StatusIndicatorProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('StatusIndicator', props);
    
    if (!this.validationResult.success) {
      console.error('❌ StatusIndicator validation failed:', this.validationResult.errors);
      throw new Error(`StatusIndicator validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ StatusIndicator warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.currentStatus = this.props.status || 'idle';
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: StatusIndicatorStyles.getStyle(this.props),
      content: this.renderStatusIndicator(),
      align: 'center',
      valign: 'middle',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
    
    // Add initial status to history
    this.addToHistory(this.currentStatus);
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

    // Handle click events
    if (this.props.clickable) {
      this.el.on('click', (event: any) => {
        this.handleClick(event);
      });
    }

    // Handle key events
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
    });
  }

  private handleClick(event: any) {
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        currentStatus: this.currentStatus,
        statusHistory: this.statusHistory,
      });
    }
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'enter':
      case 'space':
        this.cycleStatus();
        break;
      case 'r':
        this.resetStatus();
        break;
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown({
        type: 'keydown',
        target: this.el,
        key: event.key,
        ctrl: event.ctrl,
        shift: event.shift,
        alt: event.alt,
      });
    }
  }

  private renderStatusIndicator(): string {
    let content = '';
    
    // Icon
    if (this.props.showIcon) {
      content += this.getStatusIcon();
      if (this.props.showSeparator) {
        content += ' ';
      }
    }
    
    // Label
    if (this.props.label) {
      content += this.props.label;
      if (this.props.showSeparator) {
        content += ': ';
      }
    }
    
    // Status text
    content += this.getStatusText();
    
    // Timestamp
    if (this.props.showTimestamp) {
      if (this.props.showSeparator) {
        content += ' ';
      }
      content += `(${this.getFormattedTimestamp()})`;
    }
    
    // Progress indicator
    if (this.props.showProgress && this.props.progress !== undefined) {
      if (this.props.showSeparator) {
        content += ' ';
      }
      content += this.renderProgress();
    }
    
    return content;
  }

  private getStatusIcon(): string {
    switch (this.currentStatus) {
      case 'success':
        return this.props.successIcon || '✓';
      case 'error':
        return this.props.errorIcon || '✗';
      case 'warning':
        return this.props.warningIcon || '⚠';
      case 'info':
        return this.props.infoIcon || 'ℹ';
      case 'loading':
        return this.props.loadingIcon || '⟳';
      case 'idle':
        return this.props.idleIcon || '○';
      case 'pending':
        return this.props.pendingIcon || '⋯';
      case 'complete':
        return this.props.completeIcon || '●';
      default:
        return this.props.defaultIcon || '○';
    }
  }

  private getStatusText(): string {
    switch (this.currentStatus) {
      case 'success':
        return this.props.successText || 'Success';
      case 'error':
        return this.props.errorText || 'Error';
      case 'warning':
        return this.props.warningText || 'Warning';
      case 'info':
        return this.props.infoText || 'Info';
      case 'loading':
        return this.props.loadingText || 'Loading';
      case 'idle':
        return this.props.idleText || 'Idle';
      case 'pending':
        return this.props.pendingText || 'Pending';
      case 'complete':
        return this.props.completeText || 'Complete';
      default:
        return this.props.defaultText || this.currentStatus;
    }
  }

  private getFormattedTimestamp(): string {
    const now = new Date();
    if (this.props.timestampFormat === 'time') {
      return now.toLocaleTimeString();
    } else if (this.props.timestampFormat === 'date') {
      return now.toLocaleDateString();
    } else if (this.props.timestampFormat === 'datetime') {
      return now.toLocaleString();
    } else {
      return now.toLocaleTimeString();
    }
  }

  private renderProgress(): string {
    if (this.props.progress === undefined) return '';
    
    const progress = Math.min(Math.max(this.props.progress, 0), 100);
    const barWidth = 10;
    const filledWidth = Math.round((progress / 100) * barWidth);
    
    let bar = '[';
    for (let i = 0; i < barWidth; i++) {
      if (i < filledWidth) {
        bar += '=';
      } else {
        bar += ' ';
      }
    }
    bar += ']';
    
    return `${bar} ${progress}%`;
  }

  private addToHistory(status: string) {
    this.statusHistory.push({
      status,
      timestamp: Date.now(),
    });
    
    // Keep only the last N entries
    if (this.statusHistory.length > (this.props.maxHistory || 10)) {
      this.statusHistory.shift();
    }
  }

  // Variant system methods
  setVariant(variant: StatusIndicatorVariants) {
    this.props.variant = variant;
    this.el.style = StatusIndicatorStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: StatusIndicatorSizes) {
    this.props.size = size;
    this.el.style = StatusIndicatorStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: StatusIndicatorStates) {
    this.props.state = state;
    this.el.style = StatusIndicatorStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // StatusIndicator-specific methods
  setStatus(status: string) {
    const previousStatus = this.currentStatus;
    this.currentStatus = status;
    this.addToHistory(status);
    
    this.el.setContent(this.renderStatusIndicator());
    this.el.screen.render();
    
    if (this.props.onStatusChange) {
      this.props.onStatusChange({
        type: 'statuschange',
        target: this.el,
        previousStatus,
        currentStatus: this.currentStatus,
        timestamp: Date.now(),
      });
    }
  }

  setProgress(progress: number) {
    this.props.progress = Math.min(Math.max(progress, 0), 100);
    this.el.setContent(this.renderStatusIndicator());
    this.el.screen.render();
    
    if (this.props.onProgressChange) {
      this.props.onProgressChange({
        type: 'progresschange',
        target: this.el,
        progress: this.props.progress,
        timestamp: Date.now(),
      });
    }
  }

  setLabel(label: string) {
    this.props.label = label;
    this.el.setContent(this.renderStatusIndicator());
    this.el.screen.render();
  }

  setShowIcon(show: boolean) {
    this.props.showIcon = show;
    this.el.setContent(this.renderStatusIndicator());
    this.el.screen.render();
  }

  setShowTimestamp(show: boolean) {
    this.props.showTimestamp = show;
    this.el.setContent(this.renderStatusIndicator());
    this.el.screen.render();
  }

  setShowProgress(show: boolean) {
    this.props.showProgress = show;
    this.el.setContent(this.renderStatusIndicator());
    this.el.screen.render();
  }

  setShowSeparator(show: boolean) {
    this.props.showSeparator = show;
    this.el.setContent(this.renderStatusIndicator());
    this.el.screen.render();
  }

  setTimestampFormat(format: string) {
    this.props.timestampFormat = format;
    this.el.setContent(this.renderStatusIndicator());
    this.el.screen.render();
  }

  // Status control methods
  setSuccess() {
    this.setStatus('success');
  }

  setError() {
    this.setStatus('error');
  }

  setWarning() {
    this.setStatus('warning');
  }

  setInfo() {
    this.setStatus('info');
  }

  setLoading() {
    this.setStatus('loading');
  }

  setIdle() {
    this.setStatus('idle');
  }

  setPending() {
    this.setStatus('pending');
  }

  setComplete() {
    this.setStatus('complete');
  }

  cycleStatus() {
    const statuses = ['idle', 'loading', 'pending', 'success', 'complete', 'warning', 'error', 'info'];
    const currentIndex = statuses.indexOf(this.currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    this.setStatus(statuses[nextIndex]);
  }

  resetStatus() {
    this.setStatus('idle');
    this.setProgress(0);
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      status: this.currentStatus,
      progress: this.props.progress,
      label: this.props.label,
      statusHistory: this.statusHistory,
      showIcon: this.props.showIcon,
      showTimestamp: this.props.showTimestamp,
      showProgress: this.props.showProgress,
      showSeparator: this.props.showSeparator,
    };
  }

  // Get status indicator properties
  getStatus(): string {
    return this.currentStatus;
  }

  getProgress(): number | undefined {
    return this.props.progress;
  }

  getLabel(): string | undefined {
    return this.props.label;
  }

  getStatusHistory(): Array<{ status: string; timestamp: number }> {
    return [...this.statusHistory];
  }

  getLastStatus(): string | undefined {
    if (this.statusHistory.length > 1) {
      return this.statusHistory[this.statusHistory.length - 2].status;
    }
    return undefined;
  }

  getStatusCount(): number {
    return this.statusHistory.length;
  }

  // Update component with new props
  update(newProps: Partial<StatusIndicatorProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('StatusIndicator', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ StatusIndicator update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = StatusIndicatorStyles.getStyle(this.props);
    
    // Update status if changed
    if (newProps.status !== undefined && newProps.status !== this.currentStatus) {
      this.setStatus(newProps.status);
    }
    
    // Update progress if changed
    if (newProps.progress !== undefined) {
      this.setProgress(newProps.progress);
    }
    
    // Update content if any display properties changed
    if (newProps.label !== undefined ||
        newProps.showIcon !== undefined ||
        newProps.showTimestamp !== undefined ||
        newProps.showProgress !== undefined ||
        newProps.showSeparator !== undefined ||
        newProps.timestampFormat !== undefined) {
      this.el.setContent(this.renderStatusIndicator());
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