import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../../core/src/components/BaseComponent';
import { AgentStatusProps, AgentStatusVariants, AgentStatusSizes, AgentStatusStates, AgentStatusDisplayMode, AgentStatusAnimation, AgentStatusEvent, AgentStatusInfo, AgentStatusConfig, AgentStatusStats } from './AgentStatus.types';
import { AgentStatusStyles } from './AgentStatus.styles';
import { validateComponent, ValidationResult } from '../../../../core/src/validation/component-validator';

export class AgentStatus implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: AgentStatusProps;
  private validationResult: ValidationResult;
  private iconElement?: Widgets.BoxElement;
  private textElement?: Widgets.BoxElement;
  private progressElement?: Widgets.BoxElement;
  private detailsElement?: Widgets.BoxElement;
  private timestampElement?: Widgets.BoxElement;
  private durationElement?: Widgets.BoxElement;
  private messageElement?: Widgets.BoxElement;
  private currentStatus: string;
  private statusHistory: Array<{ status: string; timestamp: Date; duration: number }> = [];
  private statusStartTime: Date = new Date();
  private animationTimer?: NodeJS.Timeout;
  private refreshTimer?: NodeJS.Timeout;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(props: AgentStatusProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('AgentStatus', props);
    
    if (!this.validationResult.success) {
      console.error('❌ AgentStatus validation failed:', this.validationResult.errors);
      throw new Error(`AgentStatus validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ AgentStatus warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.currentStatus = this.props.status;
    this.statusStartTime = new Date();
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: AgentStatusStyles.getContainerStyle(
        this.props.variant,
        this.props.size,
        this.props.state,
        this.props.status,
        this.props.displayMode || 'both',
        this.props.theme
      ),
    });

    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;

    this.initializeComponents();
    this.setupEventListeners();
    this.startRefreshTimer();
    this.startAnimation();
    this.updateDisplay();
  }

  private initializeComponents(): void {
    this.createIcon();
    this.createText();
    
    if (this.props.displayMode === 'progress' || this.props.showProgress) {
      this.createProgress();
    }
    
    if (this.props.displayMode === 'detailed') {
      this.createDetails();
    }
    
    if (this.props.showTimestamp) {
      this.createTimestamp();
    }
    
    if (this.props.showDuration) {
      this.createDuration();
    }
    
    if (this.props.message) {
      this.createMessage();
    }
  }

  private createIcon(): void {
    this.iconElement = this.el.children[0] as Widgets.BoxElement || this.el;
    
    const iconStyle = AgentStatusStyles.getIconStyle(
      this.props.status,
      this.props.animation || 'none',
      this.theme
    );

    this.iconElement.style = iconStyle;
  }

  private createText(): void {
    this.textElement = this.el.children[1] as Widgets.BoxElement;
    if (!this.textElement) {
      this.textElement = this.el;
    }

    const textStyle = AgentStatusStyles.getTextStyle(
      this.props.status,
      this.props.size,
      this.theme
    );

    this.textElement.style = textStyle;
  }

  private createProgress(): void {
    if (!this.textElement) return;

    this.progressElement = this.textElement.children[0] as Widgets.BoxElement;
    if (!this.progressElement) {
      this.progressElement = this.textElement;
    }

    const progressStyle = AgentStatusStyles.getProgressStyle(this.props.status, this.theme);
    this.progressElement.style = progressStyle;
  }

  private createDetails(): void {
    this.detailsElement = this.el.children[2] as Widgets.BoxElement;
    if (!this.detailsElement) {
      this.detailsElement = this.el;
    }

    const detailsStyle = AgentStatusStyles.getDetailsStyle(this.props.status, this.theme);
    this.detailsElement.style = detailsStyle;
  }

  private createTimestamp(): void {
    if (!this.detailsElement) return;

    this.timestampElement = this.detailsElement.children[0] as Widgets.BoxElement;
    if (!this.timestampElement) {
      this.timestampElement = this.detailsElement;
    }

    const timestampStyle = AgentStatusStyles.getTimestampStyle(this.theme);
    this.timestampElement.style = timestampStyle;
  }

  private createDuration(): void {
    if (!this.detailsElement) return;

    this.durationElement = this.detailsElement.children[1] as Widgets.BoxElement;
    if (!this.durationElement) {
      this.durationElement = this.detailsElement;
    }

    const durationStyle = AgentStatusStyles.getDurationStyle(this.theme);
    this.durationElement.style = durationStyle;
  }

  private createMessage(): void {
    if (!this.detailsElement) return;

    this.messageElement = this.detailsElement.children[2] as Widgets.BoxElement;
    if (!this.messageElement) {
      this.messageElement = this.detailsElement;
    }

    const messageStyle = AgentStatusStyles.getMessageStyle(this.props.status, this.theme);
    this.messageElement.style = messageStyle;
  }

  private updateDisplay(): void {
    this.updateIcon();
    this.updateText();
    this.updateProgress();
    this.updateDetails();
    this.updateTimestamp();
    this.updateDuration();
    this.updateMessage();
  }

  private updateIcon(): void {
    if (!this.iconElement) return;

    const icon = this.getStatusIcon(this.currentStatus);
    this.iconElement.setContent(icon);
  }

  private updateText(): void {
    if (!this.textElement) return;

    const text = this.getStatusText(this.currentStatus);
    this.textElement.setContent(text);
  }

  private updateProgress(): void {
    if (!this.progressElement || !this.props.showProgress) return;

    const progress = this.props.progress || 0;
    const progressBar = this.createProgressBar(progress);
    this.progressElement.setContent(progressBar);
  }

  private updateDetails(): void {
    if (!this.detailsElement || this.props.displayMode !== 'detailed') return;

    const details = this.props.details || '';
    this.detailsElement.setContent(details);
  }

  private updateTimestamp(): void {
    if (!this.timestampElement || !this.props.showTimestamp) return;

    const timestamp = new Date().toLocaleTimeString();
    this.timestampElement.setContent(`Time: ${timestamp}`);
  }

  private updateDuration(): void {
    if (!this.durationElement || !this.props.showDuration) return;

    const duration = this.getStatusDuration();
    this.durationElement.setContent(`Duration: ${duration}`);
  }

  private updateMessage(): void {
    if (!this.messageElement || !this.props.message) return;

    this.messageElement.setContent(this.props.message);
  }

  private getStatusIcon(status: string): string {
    const icons = {
      idle: '○',
      running: '●',
      paused: '◐',
      error: '✗',
      completed: '✓',
      stopped: '■',
    };
    return icons[status as keyof typeof icons] || '○';
  }

  private getStatusText(status: string): string {
    return status.toUpperCase();
  }

  private createProgressBar(progress: number): string {
    const width = 10;
    const filled = Math.round((progress / 100) * width);
    const empty = width - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${progress}%`;
  }

  private getStatusDuration(): string {
    const now = new Date();
    const duration = Math.floor((now.getTime() - this.statusStartTime.getTime()) / 1000);
    
    if (duration < 60) {
      return `${duration}s`;
    } else if (duration < 3600) {
      return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    } else {
      return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
    }
  }

  private setupEventListeners(): void {
    if (this.props.clickable) {
      this.el.on('click', () => {
        this.emitEvent('click', this.currentStatus);
        this.props.onStatusClick?.(this.currentStatus as any);
      });
    }

    if (this.props.keys) {
      this.el.key(['enter', 'space'], () => {
        this.emitEvent('click', this.currentStatus);
        this.props.onStatusClick?.(this.currentStatus as any);
      });
    }

    if (this.props.mouse) {
      this.el.on('click', () => this.el.focus());
    }
  }

  private startRefreshTimer(): void {
    if (this.props.refreshInterval && this.props.refreshInterval > 0) {
      this.refreshTimer = setInterval(() => {
        this.updateDisplay();
      }, this.props.refreshInterval);
    }
  }

  private startAnimation(): void {
    if (this.props.animation && this.props.animation !== 'none') {
      this.animationTimer = setInterval(() => {
        this.updateAnimation();
      }, 500);
    }
  }

  private updateAnimation(): void {
    if (!this.iconElement) return;

    const icon = this.getStatusIcon(this.currentStatus);
    
    switch (this.props.animation) {
      case 'pulse':
        // Toggle between normal and bright
        this.iconElement.style.fg = this.iconElement.style.fg === 'bright' ? 'normal' : 'bright';
        break;
      case 'blink':
        // Toggle visibility
        this.iconElement.style.fg = this.iconElement.style.fg === 'black' ? 'normal' : 'black';
        break;
      case 'rotate':
        // Rotate through different icons
        const rotatingIcons = ['○', '◐', '●', '◑'];
        const currentIndex = rotatingIcons.indexOf(icon);
        const nextIndex = (currentIndex + 1) % rotatingIcons.length;
        this.iconElement.setContent(rotatingIcons[nextIndex]);
        break;
      case 'bounce':
        // Bounce effect (simplified)
        this.iconElement.style.fg = this.iconElement.style.fg === 'bright' ? 'normal' : 'bright';
        break;
    }
  }

  private emitEvent(type: string, data: any): void {
    const event: AgentStatusEvent = {
      type: type as any,
      data,
      timestamp: new Date()
    };

    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(event));
  }

  // Public methods
  setVariant(variant: AgentStatusVariants): void {
    this.props.variant = variant;
    this.updateDisplay();
  }

  setSize(size: AgentStatusSizes): void {
    this.props.size = size;
    this.updateDisplay();
  }

  setState(state: AgentStatusStates): void {
    this.props.state = state;
    this.updateDisplay();
  }

  getConfig(): any {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      displayMode: this.props.displayMode,
      animation: this.props.animation,
      status: this.currentStatus,
      stats: this.getStats(),
    };
  }

  update(props: Partial<AgentStatusProps>): void {
    const oldStatus = this.currentStatus;
    Object.assign(this.props, props);
    
    if (props.status && props.status !== this.currentStatus) {
      this.setStatus(props.status);
    }
    
    this.updateDisplay();
  }

  // Event handling
  on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  // Status management
  setStatus(status: string): void {
    const oldStatus = this.currentStatus;
    
    // Record status change in history
    if (oldStatus !== status) {
      const now = new Date();
      const duration = Math.floor((now.getTime() - this.statusStartTime.getTime()) / 1000);
      
      this.statusHistory.push({
        status: oldStatus,
        timestamp: this.statusStartTime,
        duration
      });
      
      this.currentStatus = status;
      this.statusStartTime = now;
      
      this.emitEvent('status_change', { oldStatus, newStatus: status });
      this.props.onStatusChange?.(oldStatus as any, status as any);
      this.updateDisplay();
    }
  }

  getStatus(): string {
    return this.currentStatus;
  }

  // Animation management
  setAnimation(animation: AgentStatusAnimation): void {
    this.props.animation = animation;
    
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }
    
    if (animation !== 'none') {
      this.startAnimation();
    }
  }

  // Progress management
  setProgress(progress: number): void {
    this.props.progress = Math.max(0, Math.min(100, progress));
    this.updateDisplay();
  }

  getProgress(): number {
    return this.props.progress || 0;
  }

  // Message management
  setMessage(message: string): void {
    this.props.message = message;
    this.updateDisplay();
  }

  getMessage(): string {
    return this.props.message || '';
  }

  // Info getter
  getInfo(): AgentStatusInfo {
    return {
      status: this.currentStatus as any,
      agentId: this.props.agentId,
      agentName: this.props.agentName,
      timestamp: this.statusStartTime,
      duration: this.getStatusDuration(),
      progress: this.props.progress,
      message: this.props.message,
      details: this.props.details,
    };
  }

  // Stats calculation
  getStats(): AgentStatusStats {
    const totalStatusChanges = this.statusHistory.length;
    const averageStatusDuration = this.statusHistory.length > 0 ? 
      this.statusHistory.reduce((sum, entry) => sum + entry.duration, 0) / this.statusHistory.length : 0;
    
    // Find most common status
    const statusCounts = this.statusHistory.reduce((counts, entry) => {
      counts[entry.status] = (counts[entry.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const mostCommonStatus = Object.keys(statusCounts).reduce((a, b) => 
      statusCounts[a] > statusCounts[b] ? a : b, 'idle') as any;

    return {
      totalStatusChanges,
      currentStatus: this.currentStatus as any,
      statusHistory: this.statusHistory,
      averageStatusDuration,
      mostCommonStatus,
    };
  }

  // Cleanup
  cleanup(): void {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    this.eventListeners.clear();
    this.destroy();
  }
}