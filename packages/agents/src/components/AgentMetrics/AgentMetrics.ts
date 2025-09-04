import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../../core/src/components/BaseComponent';
import { AgentMetricsProps, AgentMetricsVariants, AgentMetricsSizes, AgentMetricsStates, AgentMetricsDisplayMode, AgentMetricsChartType, AgentMetricsTimeRange, AgentMetricsEvent, AgentMetricsAlert, AgentMetricsHistory, AgentMetricsTrend, AgentMetricsComparison, AgentMetricsChart, AgentMetricsConfig, AgentMetricsStats } from './AgentMetrics.types';
import { AgentMetricsStyles } from './AgentMetrics.styles';
import { validateComponent, ValidationResult } from '../../../../core/src/validation/component-validator';

export class AgentMetrics implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: AgentMetricsProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private contentElement?: Widgets.BoxElement;
  private statsElement?: Widgets.BoxElement;
  private controlElement?: Widgets.BoxElement;
  private currentMetrics: any;
  private metricsHistory: AgentMetricsHistory[] = [];
  private alerts: AgentMetricsAlert[] = [];
  private trends: AgentMetricsTrend[] = [];
  private comparisons: AgentMetricsComparison[] = [];
  private refreshTimer?: NodeJS.Timeout;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(props: AgentMetricsProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('AgentMetrics', props);
    
    if (!this.validationResult.success) {
      console.error('❌ AgentMetrics validation failed:', this.validationResult.errors);
      throw new Error(`AgentMetrics validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ AgentMetrics warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.currentMetrics = this.props.metrics;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: AgentMetricsStyles.getContainerStyle(
        this.props.variant,
        this.props.size,
        this.props.state,
        this.props.displayMode || 'table',
        this.props.theme
      ),
    });

    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;

    this.initializeComponents();
    this.setupEventListeners();
    this.startRefreshTimer();
    this.updateDisplay();
  }

  private initializeComponents(): void {
    this.createHeader();
    this.createContent();
    this.createStats();
    this.createControls();
  }

  private createHeader(): void {
    this.headerElement = this.el.children[0] as Widgets.BoxElement || this.el;
    
    const headerStyle = AgentMetricsStyles.getHeaderStyle(
      this.props.variant,
      this.props.size,
      this.theme
    );

    this.headerElement.style = headerStyle;
  }

  private createContent(): void {
    this.contentElement = this.el.children[1] as Widgets.BoxElement || this.el;
    
    const contentStyle = this.getContentStyle();
    this.contentElement.style = contentStyle;
  }

  private createStats(): void {
    this.statsElement = this.el.children[2] as Widgets.BoxElement;
    if (!this.statsElement) {
      this.statsElement = this.el;
    }

    const statsStyle = AgentMetricsStyles.getStatsStyle(this.props.variant, this.theme);
    this.statsElement.style = statsStyle;
  }

  private createControls(): void {
    this.controlElement = this.el.children[3] as Widgets.BoxElement;
    if (!this.controlElement) {
      this.controlElement = this.el;
    }

    const controlStyle = AgentMetricsStyles.getControlStyle(this.props.variant, this.props.state, this.theme);
    this.controlElement.style = controlStyle;
  }

  private getContentStyle(): any {
    const displayMode = this.props.displayMode || 'table';
    
    switch (displayMode) {
      case 'table':
        return AgentMetricsStyles.getTableStyle(this.props.variant, this.theme);
      case 'cards':
        return AgentMetricsStyles.getCardStyle(this.props.variant, this.props.size, this.theme);
      case 'charts':
        return AgentMetricsStyles.getChartStyle(this.props.variant, this.props.chartType, this.theme);
      case 'summary':
        return AgentMetricsStyles.getSummaryStyle(this.props.variant, this.theme);
      case 'detailed':
        return AgentMetricsStyles.getDetailedStyle(this.props.variant, this.theme);
      default:
        return AgentMetricsStyles.getTableStyle(this.props.variant, this.theme);
    }
  }

  private updateDisplay(): void {
    this.updateHeader();
    this.updateContent();
    this.updateStats();
    this.updateControls();
  }

  private updateHeader(): void {
    if (!this.headerElement) return;

    const title = `Metrics${this.props.agentName ? ` - ${this.props.agentName}` : ''}`;
    this.headerElement.setContent(title);
  }

  private updateContent(): void {
    if (!this.contentElement) return;

    const content = this.renderContent();
    this.contentElement.setContent(content);
  }

  private renderContent(): string {
    const displayMode = this.props.displayMode || 'table';
    
    switch (displayMode) {
      case 'table':
        return this.renderTableView();
      case 'cards':
        return this.renderCardsView();
      case 'charts':
        return this.renderChartsView();
      case 'summary':
        return this.renderSummaryView();
      case 'detailed':
        return this.renderDetailedView();
      default:
        return this.renderTableView();
    }
  }

  private renderTableView(): string {
    const metrics = this.currentMetrics;
    const rows = [
      '┌─────────────────────────────────────────┐',
      '│ Metric                │ Value          │',
      '├─────────────────────────────────────────┤',
      `│ Total Runs            │ ${metrics.totalRuns.toString().padEnd(13)} │`,
      `│ Successful Runs       │ ${metrics.successfulRuns.toString().padEnd(13)} │`,
      `│ Failed Runs           │ ${metrics.failedRuns.toString().padEnd(13)} │`,
      `│ Average Execution Time│ ${metrics.averageExecutionTime.toString().padEnd(13)} │`,
      `│ Memory Usage          │ ${metrics.memoryUsage.toString().padEnd(13)} │`,
      `│ CPU Usage             │ ${metrics.cpuUsage.toString().padEnd(13)} │`,
      `│ Error Rate            │ ${metrics.errorRate.toString().padEnd(13)} │`,
      `│ Uptime                │ ${metrics.uptime.toString().padEnd(13)} │`,
      '└─────────────────────────────────────────┘'
    ];
    
    return rows.join('\n');
  }

  private renderCardsView(): string {
    const metrics = this.currentMetrics;
    const cards = [
      `┌─ Runs ─────────────┐  ┌─ Performance ─────┐`,
      `│ Total: ${metrics.totalRuns.toString().padEnd(8)} │  │ Avg Time: ${metrics.averageExecutionTime.toString().padEnd(6)} │`,
      `│ Success: ${metrics.successfulRuns.toString().padEnd(6)} │  │ Memory: ${metrics.memoryUsage.toString().padEnd(8)} │`,
      `│ Failed: ${metrics.failedRuns.toString().padEnd(7)} │  │ CPU: ${metrics.cpuUsage.toString().padEnd(10)} │`,
      `└────────────────────┘  └────────────────────┘`,
      `┌─ Status ───────────┐  ┌─ Health ──────────┐`,
      `│ Error Rate: ${metrics.errorRate.toString().padEnd(6)} │  │ Uptime: ${metrics.uptime.toString().padEnd(8)} │`,
      `│ Last Run: ${metrics.lastRunTime ? new Date(metrics.lastRunTime).toLocaleTimeString() : 'N/A'.padEnd(6)} │  │ Status: ${this.getHealthStatus()} │`,
      `└────────────────────┘  └────────────────────┘`
    ];
    
    return cards.join('\n');
  }

  private renderChartsView(): string {
    const metrics = this.currentMetrics;
    const chartType = this.props.chartType || 'line';
    
    switch (chartType) {
      case 'line':
        return this.renderLineChart();
      case 'bar':
        return this.renderBarChart();
      case 'pie':
        return this.renderPieChart();
      case 'gauge':
        return this.renderGaugeChart();
      case 'sparkline':
        return this.renderSparklineChart();
      default:
        return this.renderLineChart();
    }
  }

  private renderLineChart(): string {
    const metrics = this.currentMetrics;
    const maxValue = Math.max(metrics.totalRuns, metrics.successfulRuns, metrics.failedRuns);
    const scale = 20 / maxValue;
    
    const runs = Math.round(metrics.totalRuns * scale);
    const success = Math.round(metrics.successfulRuns * scale);
    const failed = Math.round(metrics.failedRuns * scale);
    
    return [
      'Runs Over Time:',
      `Total:    ${'█'.repeat(runs)}`,
      `Success:  ${'█'.repeat(success)}`,
      `Failed:   ${'█'.repeat(failed)}`,
      `Scale: 0${'─'.repeat(18)}${maxValue}`
    ].join('\n');
  }

  private renderBarChart(): string {
    const metrics = this.currentMetrics;
    const maxValue = Math.max(metrics.totalRuns, metrics.successfulRuns, metrics.failedRuns);
    const scale = 15 / maxValue;
    
    const runs = Math.round(metrics.totalRuns * scale);
    const success = Math.round(metrics.successfulRuns * scale);
    const failed = Math.round(metrics.failedRuns * scale);
    
    return [
      'Performance Metrics:',
      `Total Runs:    │${'█'.repeat(runs)}`,
      `Success:       │${'█'.repeat(success)}`,
      `Failed:        │${'█'.repeat(failed)}`,
      `               └${'─'.repeat(15)}`
    ].join('\n');
  }

  private renderPieChart(): string {
    const metrics = this.currentMetrics;
    const total = metrics.totalRuns;
    const success = metrics.successfulRuns;
    const failed = metrics.failedRuns;
    
    if (total === 0) {
      return 'No data available';
    }
    
    const successPercent = Math.round((success / total) * 100);
    const failedPercent = Math.round((failed / total) * 100);
    
    return [
      'Run Distribution:',
      `Success: ${successPercent}% (${success})`,
      `Failed:  ${failedPercent}% (${failed})`,
      `Total:   ${total}`
    ].join('\n');
  }

  private renderGaugeChart(): string {
    const metrics = this.currentMetrics;
    const successRate = metrics.totalRuns > 0 ? (metrics.successfulRuns / metrics.totalRuns) * 100 : 0;
    const gauge = this.createGauge(successRate, 100);
    
    return [
      'Success Rate:',
      gauge,
      `${successRate.toFixed(1)}%`
    ].join('\n');
  }

  private renderSparklineChart(): string {
    const metrics = this.currentMetrics;
    const values = [metrics.totalRuns, metrics.successfulRuns, metrics.failedRuns, metrics.averageExecutionTime];
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue;
    
    if (range === 0) {
      return '─'.repeat(20);
    }
    
    const sparkline = values.map(value => {
      const normalized = (value - minValue) / range;
      const height = Math.round(normalized * 3);
      return ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'][height];
    }).join('');
    
    return sparkline;
  }

  private createGauge(value: number, max: number): string {
    const percentage = (value / max) * 100;
    const filled = Math.round((percentage / 100) * 10);
    const empty = 10 - filled;
    
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percentage.toFixed(1)}%`;
  }

  private renderSummaryView(): string {
    const metrics = this.currentMetrics;
    const successRate = metrics.totalRuns > 0 ? (metrics.successfulRuns / metrics.totalRuns) * 100 : 0;
    
    return [
      `Total Runs: ${metrics.totalRuns}`,
      `Success Rate: ${successRate.toFixed(1)}%`,
      `Avg Time: ${metrics.averageExecutionTime}ms`,
      `Memory: ${metrics.memoryUsage}MB`,
      `CPU: ${metrics.cpuUsage}%`,
      `Uptime: ${metrics.uptime}s`
    ].join(' | ');
  }

  private renderDetailedView(): string {
    const metrics = this.currentMetrics;
    const successRate = metrics.totalRuns > 0 ? (metrics.successfulRuns / metrics.totalRuns) * 100 : 0;
    
    return [
      'Detailed Metrics:',
      `Total Runs: ${metrics.totalRuns}`,
      `  ├─ Successful: ${metrics.successfulRuns} (${successRate.toFixed(1)}%)`,
      `  └─ Failed: ${metrics.failedRuns} (${(100 - successRate).toFixed(1)}%)`,
      `Average Execution Time: ${metrics.averageExecutionTime}ms`,
      `Resource Usage:`,
      `  ├─ Memory: ${metrics.memoryUsage}MB`,
      `  └─ CPU: ${metrics.cpuUsage}%`,
      `Error Rate: ${metrics.errorRate}%`,
      `Uptime: ${metrics.uptime}s`,
      `Last Run: ${metrics.lastRunTime ? new Date(metrics.lastRunTime).toLocaleString() : 'Never'}`
    ].join('\n');
  }

  private getHealthStatus(): string {
    const metrics = this.currentMetrics;
    const successRate = metrics.totalRuns > 0 ? (metrics.successfulRuns / metrics.totalRuns) * 100 : 100;
    
    if (successRate >= 95) return 'Excellent';
    if (successRate >= 80) return 'Good';
    if (successRate >= 60) return 'Fair';
    return 'Poor';
  }

  private updateStats(): void {
    if (!this.statsElement) return;

    const stats = this.getStats();
    const statsText = `Data Points: ${stats.totalDataPoints} | Alerts: ${stats.alertsCount} | Trends: ${stats.trendsCount} | Last Update: ${stats.lastUpdate.toLocaleTimeString()}`;
    this.statsElement.setContent(statsText);
  }

  private updateControls(): void {
    if (!this.controlElement) return;

    const controls = [
      `Mode: ${this.props.displayMode}`,
      `Chart: ${this.props.chartType}`,
      `Range: ${this.props.timeRange}`,
      `Refresh: ${this.props.refreshInterval || 0}ms`
    ].join(' | ');

    this.controlElement.setContent(controls);
  }

  private getStats(): AgentMetricsStats {
    return {
      totalDataPoints: this.metricsHistory.length,
      averageUpdateInterval: this.props.refreshInterval || 0,
      lastUpdate: new Date(),
      alertsCount: this.alerts.length,
      trendsCount: this.trends.length,
      comparisonsCount: this.comparisons.length,
    };
  }

  private setupEventListeners(): void {
    if (this.props.keys) {
      this.el.key(['m', 'M'], () => this.cycleDisplayMode());
      this.el.key(['c', 'C'], () => this.cycleChartType());
      this.el.key(['t', 'T'], () => this.cycleTimeRange());
      this.el.key(['r', 'R'], () => this.refresh());
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

  private emitEvent(type: string, data: any): void {
    const event: AgentMetricsEvent = {
      type: type as any,
      data,
      timestamp: new Date()
    };

    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(event));
  }

  // Control methods
  private cycleDisplayMode(): void {
    const displayModes: AgentMetricsDisplayMode[] = ['table', 'cards', 'charts', 'summary', 'detailed'];
    const currentIndex = displayModes.indexOf(this.props.displayMode || 'table');
    const nextIndex = (currentIndex + 1) % displayModes.length;
    this.props.displayMode = displayModes[nextIndex];
    
    this.emitEvent('display_mode_change', this.props.displayMode);
    this.props.onDisplayModeChange?.(this.props.displayMode);
    this.updateDisplay();
  }

  private cycleChartType(): void {
    const chartTypes: AgentMetricsChartType[] = ['line', 'bar', 'pie', 'gauge', 'sparkline'];
    const currentIndex = chartTypes.indexOf(this.props.chartType || 'line');
    const nextIndex = (currentIndex + 1) % chartTypes.length;
    this.props.chartType = chartTypes[nextIndex];
    
    this.emitEvent('chart_interaction', this.props.chartType);
    this.updateDisplay();
  }

  private cycleTimeRange(): void {
    const timeRanges: AgentMetricsTimeRange[] = ['1h', '6h', '24h', '7d', '30d', 'all'];
    const currentIndex = timeRanges.indexOf(this.props.timeRange || '24h');
    const nextIndex = (currentIndex + 1) % timeRanges.length;
    this.props.timeRange = timeRanges[nextIndex];
    
    this.emitEvent('time_range_change', this.props.timeRange);
    this.props.onTimeRangeChange?.(this.props.timeRange);
    this.updateDisplay();
  }

  private refresh(): void {
    this.emitEvent('metrics_update', this.currentMetrics);
    this.props.onMetricsUpdate?.(this.currentMetrics);
    this.updateDisplay();
  }

  // Public methods
  setVariant(variant: AgentMetricsVariants): void {
    this.props.variant = variant;
    this.updateDisplay();
  }

  setSize(size: AgentMetricsSizes): void {
    this.props.size = size;
    this.updateDisplay();
  }

  setState(state: AgentMetricsStates): void {
    this.props.state = state;
    this.updateDisplay();
  }

  getConfig(): any {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      displayMode: this.props.displayMode,
      chartType: this.props.chartType,
      timeRange: this.props.timeRange,
      stats: this.getStats(),
    };
  }

  update(props: Partial<AgentMetricsProps>): void {
    Object.assign(this.props, props);
    if (props.metrics) {
      this.currentMetrics = props.metrics;
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

  // Metrics management
  updateMetrics(metrics: any): void {
    this.currentMetrics = metrics;
    this.emitEvent('metrics_update', metrics);
    this.props.onMetricsUpdate?.(metrics);
    this.updateDisplay();
  }

  // Alert management
  addAlert(alert: AgentMetricsAlert): void {
    this.alerts.push(alert);
    this.emitEvent('alert', alert);
    this.props.onAlert?.(alert);
    this.updateDisplay();
  }

  removeAlert(alertId: string): void {
    this.alerts = this.alerts.filter(alert => alert.id !== alertId);
    this.updateDisplay();
  }

  clearAlerts(): void {
    this.alerts = [];
    this.updateDisplay();
  }

  // Cleanup
  cleanup(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    this.eventListeners.clear();
    this.destroy();
  }
}