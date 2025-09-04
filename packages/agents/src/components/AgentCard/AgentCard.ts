import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../../core/src/components/BaseComponent';
import { AgentCardProps, AgentCardVariants, AgentCardSizes, AgentCardStates, AgentCardLayout, AgentCardDisplayMode, AgentCardEvent, AgentCardStats, AgentCardInfo } from './AgentCard.types';
import { AgentCardStyles } from './AgentCard.styles';
import { validateComponent, ValidationResult } from '../../../../core/src/validation/component-validator';

export class AgentCard implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: AgentCardProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private contentElement?: Widgets.BoxElement;
  private statusElement?: Widgets.BoxElement;
  private metricsElement?: Widgets.BoxElement;
  private infoElement?: Widgets.BoxElement;
  private capabilitiesElement?: Widgets.BoxElement;
  private controlsElement?: Widgets.BoxElement;
  private currentStatus: string;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(props: AgentCardProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('AgentCard', props);
    
    if (!this.validationResult.success) {
      console.error('❌ AgentCard validation failed:', this.validationResult.errors);
      throw new Error(`AgentCard validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ AgentCard warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.currentStatus = this.props.status || 'idle';
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: AgentCardStyles.getContainerStyle(
        this.props.variant,
        this.props.size,
        this.props.state,
        this.props.layout || 'vertical',
        this.props.isSelected || false,
        this.props.theme
      ),
    });

    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;

    this.initializeComponents();
    this.setupEventListeners();
    this.updateDisplay();
  }

  private initializeComponents(): void {
    this.createHeader();
    this.createContent();
    this.createStatusIndicator();
    
    if (this.props.showMetrics) {
      this.createMetrics();
    }
    
    if (this.props.showDescription || this.props.showType) {
      this.createInfo();
    }
    
    if (this.props.showCapabilities) {
      this.createCapabilities();
    }
    
    if (this.props.showControls) {
      this.createControls();
    }
  }

  private createHeader(): void {
    this.headerElement = this.el.children[0] as Widgets.BoxElement || this.el;
    
    const headerStyle = AgentCardStyles.getHeaderStyle(
      this.props.variant,
      this.props.size,
      this.props.layout || 'vertical',
      this.theme
    );

    this.headerElement.style = headerStyle;
  }

  private createContent(): void {
    this.contentElement = this.el.children[1] as Widgets.BoxElement || this.el;
    
    const contentStyle = AgentCardStyles.getContentStyle(
      this.props.variant,
      this.props.size,
      this.props.layout || 'vertical',
      this.theme
    );

    this.contentElement.style = contentStyle;
  }

  private createStatusIndicator(): void {
    if (!this.headerElement) return;

    this.statusElement = this.headerElement.children[0] as Widgets.BoxElement;
    if (!this.statusElement) {
      this.statusElement = this.headerElement;
    }

    const statusStyle = AgentCardStyles.getStatusStyle(this.currentStatus, this.theme);
    this.statusElement.style = statusStyle;
  }

  private createMetrics(): void {
    if (!this.contentElement) return;

    this.metricsElement = this.contentElement.children[0] as Widgets.BoxElement;
    if (!this.metricsElement) {
      this.metricsElement = this.contentElement;
    }

    const metricsStyle = AgentCardStyles.getMetricsStyle(this.props.variant, this.props.size, this.theme);
    this.metricsElement.style = metricsStyle;
  }

  private createInfo(): void {
    if (!this.contentElement) return;

    this.infoElement = this.contentElement.children[1] as Widgets.BoxElement;
    if (!this.infoElement) {
      this.infoElement = this.contentElement;
    }

    const infoStyle = AgentCardStyles.getInfoStyle(this.props.variant, this.props.size, this.theme);
    this.infoElement.style = infoStyle;
  }

  private createCapabilities(): void {
    if (!this.contentElement) return;

    this.capabilitiesElement = this.contentElement.children[2] as Widgets.BoxElement;
    if (!this.capabilitiesElement) {
      this.capabilitiesElement = this.contentElement;
    }

    const capabilitiesStyle = AgentCardStyles.getCapabilitiesStyle(this.props.variant, this.theme);
    this.capabilitiesElement.style = capabilitiesStyle;
  }

  private createControls(): void {
    if (!this.contentElement) return;

    this.controlsElement = this.contentElement.children[3] as Widgets.BoxElement;
    if (!this.controlsElement) {
      this.controlsElement = this.contentElement;
    }

    const controlsStyle = AgentCardStyles.getControlsStyle(this.props.variant, this.props.state, this.theme);
    this.controlsElement.style = controlsStyle;
  }

  private updateDisplay(): void {
    this.updateHeader();
    this.updateStatus();
    this.updateMetrics();
    this.updateInfo();
    this.updateCapabilities();
    this.updateControls();
  }

  private updateHeader(): void {
    if (!this.headerElement) return;

    const title = this.props.config.name;
    this.headerElement.setContent(title);
  }

  private updateStatus(): void {
    if (!this.statusElement) return;

    const statusText = this.props.showStatus ? `Status: ${this.currentStatus.toUpperCase()}` : '';
    this.statusElement.setContent(statusText);
  }

  private updateMetrics(): void {
    if (!this.metricsElement || !this.props.showMetrics || !this.props.metrics) return;

    const metrics = this.props.metrics;
    const metricsText = [
      `Runs: ${metrics.totalRuns}`,
      `Success: ${metrics.successfulRuns}`,
      `Avg: ${metrics.averageExecutionTime}ms`
    ].join(' | ');

    this.metricsElement.setContent(metricsText);
  }

  private updateInfo(): void {
    if (!this.infoElement) return;

    const infoParts = [];
    
    if (this.props.showType) {
      infoParts.push(`Type: ${this.props.config.type}`);
    }
    
    if (this.props.showDescription && this.props.config.description) {
      infoParts.push(this.props.config.description);
    }
    
    if (this.props.config.version) {
      infoParts.push(`v${this.props.config.version}`);
    }

    const infoText = infoParts.join(' | ');
    this.infoElement.setContent(infoText);
  }

  private updateCapabilities(): void {
    if (!this.capabilitiesElement || !this.props.showCapabilities) return;

    const capabilities = this.props.config.capabilities.slice(0, 3).join(', ');
    const capabilitiesText = `Capabilities: ${capabilities}${this.props.config.capabilities.length > 3 ? '...' : ''}`;
    this.capabilitiesElement.setContent(capabilitiesText);
  }

  private updateControls(): void {
    if (!this.controlsElement || !this.props.showControls) return;

    const controls = [];
    
    if (this.currentStatus === 'idle' || this.currentStatus === 'stopped') {
      controls.push('[START]');
    }
    
    if (this.currentStatus === 'running') {
      controls.push('[STOP]', '[PAUSE]');
    }
    
    if (this.currentStatus === 'paused') {
      controls.push('[RESUME]', '[STOP]');
    }

    controls.push('[CONFIG]', '[LOGS]');

    this.controlsElement.setContent(controls.join(' '));
  }

  private setupEventListeners(): void {
    if (this.props.clickable) {
      this.el.on('click', () => {
        this.emitEvent('select', this.props.config);
        this.props.onSelect?.(this.props.config);
      });

      this.el.on('doubleclick', () => {
        this.emitEvent('double_click', this.props.config);
        this.props.onDoubleClick?.(this.props.config);
      });
    }

    if (this.props.keys) {
      this.el.key(['enter', 'space'], () => {
        this.emitEvent('select', this.props.config);
        this.props.onSelect?.(this.props.config);
      });

      this.el.key(['s', 'S'], () => {
        this.emitEvent('start', this.props.config);
        this.props.onStart?.(this.props.config);
      });

      this.el.key(['t', 'T'], () => {
        this.emitEvent('stop', this.props.config);
        this.props.onStop?.(this.props.config);
      });

      this.el.key(['p', 'P'], () => {
        this.emitEvent('pause', this.props.config);
        this.props.onPause?.(this.props.config);
      });

      this.el.key(['r', 'R'], () => {
        this.emitEvent('resume', this.props.config);
        this.props.onResume?.(this.props.config);
      });

      this.el.key(['c', 'C'], () => {
        this.emitEvent('configure', this.props.config);
        this.props.onConfigure?.(this.props.config);
      });

      this.el.key(['l', 'L'], () => {
        this.emitEvent('view_logs', this.props.config);
        this.props.onViewLogs?.(this.props.config);
      });

      this.el.key(['m', 'M'], () => {
        this.emitEvent('view_metrics', this.props.config);
        this.props.onViewMetrics?.(this.props.config);
      });
    }

    if (this.props.mouse) {
      this.el.on('click', () => this.el.focus());
    }
  }

  private emitEvent(type: string, data: any): void {
    const event: AgentCardEvent = {
      type: type as any,
      data,
      timestamp: new Date()
    };

    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(event));
  }

  // Public methods
  setVariant(variant: AgentCardVariants): void {
    this.props.variant = variant;
    this.updateDisplay();
  }

  setSize(size: AgentCardSizes): void {
    this.props.size = size;
    this.updateDisplay();
  }

  setState(state: AgentCardStates): void {
    this.props.state = state;
    this.updateDisplay();
  }

  getConfig(): any {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      layout: this.props.layout,
      displayMode: this.props.displayMode,
      config: this.props.config,
      status: this.currentStatus,
      isSelected: this.props.isSelected,
    };
  }

  update(props: Partial<AgentCardProps>): void {
    Object.assign(this.props, props);
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
    this.currentStatus = status;
    this.updateDisplay();
  }

  getStatus(): string {
    return this.currentStatus;
  }

  // Selection management
  setSelected(selected: boolean): void {
    this.props.isSelected = selected;
    this.updateDisplay();
  }

  isSelected(): boolean {
    return this.props.isSelected || false;
  }

  // Stats calculation
  getStats(): AgentCardStats {
    if (!this.props.metrics) {
      return {
        totalRuns: 0,
        successRate: 0,
        averageTime: 0,
        uptime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
      };
    }

    const metrics = this.props.metrics;
    const successRate = metrics.totalRuns > 0 ? (metrics.successfulRuns / metrics.totalRuns) * 100 : 0;

    return {
      totalRuns: metrics.totalRuns,
      successRate,
      averageTime: metrics.averageExecutionTime,
      lastRun: metrics.lastRunTime,
      uptime: metrics.uptime,
      memoryUsage: metrics.memoryUsage,
      cpuUsage: metrics.cpuUsage,
    };
  }

  // Info getter
  getInfo(): AgentCardInfo {
    const stats = this.getStats();
    
    return {
      name: this.props.config.name,
      type: this.props.config.type,
      description: this.props.config.description,
      version: this.props.config.version,
      author: this.props.config.author,
      capabilities: this.props.config.capabilities,
      status: this.currentStatus as any,
      stats,
    };
  }

  // Cleanup
  cleanup(): void {
    this.eventListeners.clear();
    this.destroy();
  }
}