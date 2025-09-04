import { TokenInfoProps, TokenStats, CostInfo, TokenLimits, TokenBreakdown, TokenUsage, TokenType, TokenInfoEvents, TokenInfoMethods } from './TokenInfo.types';
import { generateTokenInfoStyles, getTokenInfoVariantClass, getTokenInfoStateClass } from './TokenInfo.styles';

export class TokenInfo implements TokenInfoMethods {
  private props: TokenInfoProps;
  private element: HTMLElement | null = null;
  private events: TokenInfoEvents;
  private stats: TokenStats;
  private costInfo: CostInfo;
  private limits: TokenLimits;
  private breakdown: TokenBreakdown;

  constructor(props: Partial<TokenInfoProps> = {}) {
    this.props = {
      variant: 'default',
      state: 'default',
      width: 80,
      height: 20,
      showCost: true,
      showBreakdown: true,
      showLimits: true,
      showTrends: false,
      showProgress: true,
      showDetails: false,
      theme: {
        primary: '#00ff00',
        secondary: '#0088ff',
        success: '#00ff00',
        warning: '#ffaa00',
        error: '#ff0000',
        background: '#000000',
        foreground: '#ffffff',
        border: '#333333',
        accent: '#ff6b6b',
        info: '#4ecdc4'
      },
      ...props
    };

    this.events = {
      tokenUpdate: props.onTokenUpdate || (() => {}),
      costUpdate: props.onCostUpdate || (() => {}),
      limitReached: props.onLimitReached || (() => {}),
      breakdownChange: props.onBreakdownChange || (() => {}),
      trendUpdate: props.onTrendUpdate || (() => {}),
      refresh: () => {},
      export: () => {}
    };

    this.stats = {
      totalTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      systemTokens: 0,
      userTokens: 0,
      assistantTokens: 0,
      contextTokens: 0,
      responseTokens: 0,
      customTokens: 0,
      totalCost: 0,
      averageCostPerToken: 0,
      tokensPerSecond: 0,
      startTime: Date.now(),
      ...props.stats
    };

    this.costInfo = {
      model: '',
      inputCostPer1K: 0,
      outputCostPer1K: 0,
      currency: 'USD',
      totalCost: 0,
      breakdown: {
        input: 0,
        output: 0,
        system: 0,
        custom: 0
      },
      ...props.costInfo
    };

    this.limits = {
      maxTokens: 4096,
      maxInputTokens: 2048,
      maxOutputTokens: 2048,
      maxContextTokens: 4096,
      currentUsage: 0,
      remainingTokens: 4096,
      usagePercentage: 0,
      ...props.limits
    };

    this.breakdown = {
      byType: [],
      byModel: [],
      byTime: [],
      trends: {
        hourly: [],
        daily: [],
        weekly: []
      },
      ...props.breakdown
    };

    this.initialize();
  }

  private initialize(): void {
    this.createElement();
    this.attachEventListeners();
    this.updateStyles();
    this.render();
  }

  private createElement(): void {
    this.element = document.createElement('div');
    this.element.className = `tokeninfo-container ${getTokenInfoVariantClass(this.props.variant)} ${getTokenInfoStateClass(this.props.state)}`;
    this.element.setAttribute('data-tokeninfo-id', this.generateId());
  }

  private attachEventListeners(): void {
    if (!this.element) return;

    // Focus events
    this.element.addEventListener('focus', () => {
      this.setState('focused');
    });

    this.element.addEventListener('blur', () => {
      if (this.props.state === 'focused') {
        this.setState('default');
      }
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
    
    if (target.classList.contains('tokeninfo-action')) {
      const actionId = target.getAttribute('data-action-id');
      if (actionId) {
        this.handleAction(actionId);
      }
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'r':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.refreshData();
        }
        break;
      case 'e':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.exportData('json');
        }
        break;
      case 'Escape':
        this.setState('default');
        break;
    }
  }

  private handleAction(actionId: string): void {
    switch (actionId) {
      case 'refresh':
        this.refreshData();
        break;
      case 'export':
        this.exportData('json');
        break;
      case 'reset':
        this.resetStats();
        break;
      case 'toggle-breakdown':
        this.props.showBreakdown = !this.props.showBreakdown;
        this.render();
        break;
      case 'toggle-trends':
        this.props.showTrends = !this.props.showTrends;
        this.render();
        break;
      case 'toggle-details':
        this.props.showDetails = !this.props.showDetails;
        this.render();
        break;
    }
  }

  private generateId(): string {
    return `tokeninfo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateStyles(): void {
    if (!this.element) return;

    const styleConfig = {
      variant: this.props.variant,
      state: this.props.state,
      width: this.props.width,
      height: this.props.height,
      theme: this.props.theme
    };

    const styles = generateTokenInfoStyles(styleConfig);
    
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

    const { variant, state, showCost, showBreakdown, showLimits, showTrends, showProgress, showDetails } = this.props;
    
    this.element.className = `tokeninfo-container ${getTokenInfoVariantClass(variant)} ${getTokenInfoStateClass(state)}`;
    
    this.element.innerHTML = `
      <div class="tokeninfo-header">
        <div class="tokeninfo-title">
          <span class="tokeninfo-model">${this.costInfo.model || 'AI Model'}</span>
          <span>Token Usage</span>
        </div>
        <div class="tokeninfo-actions">
          <button class="tokeninfo-action" data-action-id="refresh" title="Refresh (Ctrl+R)">🔄</button>
          <button class="tokeninfo-action" data-action-id="export" title="Export (Ctrl+E)">📊</button>
          <button class="tokeninfo-action" data-action-id="reset" title="Reset Stats">🔄</button>
          ${showBreakdown ? `<button class="tokeninfo-action" data-action-id="toggle-breakdown" title="Toggle Breakdown">📈</button>` : ''}
          ${showTrends ? `<button class="tokeninfo-action" data-action-id="toggle-trends" title="Toggle Trends">📊</button>` : ''}
          ${showDetails ? `<button class="tokeninfo-action" data-action-id="toggle-details" title="Toggle Details">ℹ️</button>` : ''}
        </div>
      </div>
      
      <div class="tokeninfo-content">
        ${this.renderStats()}
        ${showProgress ? this.renderProgress() : ''}
        ${showBreakdown ? this.renderBreakdown() : ''}
        ${showTrends ? this.renderTrends() : ''}
        ${showDetails ? this.renderDetails() : ''}
      </div>
      
      <div class="tokeninfo-footer">
        <div class="tokeninfo-footer-info">
          <div class="tokeninfo-footer-info-item">
            <span>⏱️</span>
            <span>${this.formatDuration(this.stats.duration || 0)}</span>
          </div>
          <div class="tokeninfo-footer-info-item">
            <span>💰</span>
            <span>${this.formatCost(this.stats.totalCost, this.costInfo.currency)}</span>
          </div>
          <div class="tokeninfo-footer-info-item">
            <span>📊</span>
            <span>${this.limits.usagePercentage.toFixed(1)}% used</span>
          </div>
        </div>
        <div class="tokeninfo-footer-actions">
          <span class="tokeninfo-status">${state}</span>
        </div>
      </div>
    `;
  }

  private renderStats(): string {
    const { totalTokens, inputTokens, outputTokens, totalCost, tokensPerSecond } = this.stats;
    
    return `
      <div class="tokeninfo-stats">
        <div class="tokeninfo-stat">
          <div class="tokeninfo-stat-value">${this.formatTokens(totalTokens)}</div>
          <div class="tokeninfo-stat-label">Total Tokens</div>
          ${showCost ? `<div class="tokeninfo-stat-cost">${this.formatCost(totalCost, this.costInfo.currency)}</div>` : ''}
        </div>
        <div class="tokeninfo-stat">
          <div class="tokeninfo-stat-value">${this.formatTokens(inputTokens)}</div>
          <div class="tokeninfo-stat-label">Input Tokens</div>
          <div class="tokeninfo-stat-percentage">${this.getPercentage(inputTokens, totalTokens)}%</div>
        </div>
        <div class="tokeninfo-stat">
          <div class="tokeninfo-stat-value">${this.formatTokens(outputTokens)}</div>
          <div class="tokeninfo-stat-label">Output Tokens</div>
          <div class="tokeninfo-stat-percentage">${this.getPercentage(outputTokens, totalTokens)}%</div>
        </div>
        <div class="tokeninfo-stat">
          <div class="tokeninfo-stat-value">${tokensPerSecond.toFixed(1)}</div>
          <div class="tokeninfo-stat-label">Tokens/sec</div>
          <div class="tokeninfo-stat-percentage">Speed</div>
        </div>
        ${this.props.showLimits ? `
          <div class="tokeninfo-stat">
            <div class="tokeninfo-stat-value">${this.formatTokens(this.limits.remainingTokens)}</div>
            <div class="tokeninfo-stat-label">Remaining</div>
            <div class="tokeninfo-stat-percentage">${this.limits.usagePercentage.toFixed(1)}% used</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderProgress(): string {
    const { currentUsage, maxTokens, usagePercentage } = this.limits;
    
    return `
      <div class="tokeninfo-progress">
        <div class="tokeninfo-progress-label">
          <span>Token Usage</span>
          <span>${this.formatTokens(currentUsage)} / ${this.formatTokens(maxTokens)}</span>
        </div>
        <div class="tokeninfo-progress-bar" style="width: ${usagePercentage}%"></div>
      </div>
    `;
  }

  private renderBreakdown(): string {
    if (!this.props.showBreakdown || this.breakdown.byType.length === 0) {
      return '';
    }
    
    return `
      <div class="tokeninfo-breakdown">
        <div class="tokeninfo-breakdown-title">Token Breakdown</div>
        <div class="tokeninfo-breakdown-list">
          ${this.breakdown.byType.map(item => `
            <div class="tokeninfo-breakdown-item">
              <span class="tokeninfo-breakdown-item-type">${item.type}</span>
              <span class="tokeninfo-breakdown-item-count">${this.formatTokens(item.count)}</span>
              <span class="tokeninfo-breakdown-item-percentage">${item.percentage.toFixed(1)}%</span>
              ${item.cost ? `<span class="tokeninfo-breakdown-item-cost">${this.formatCost(item.cost, this.costInfo.currency)}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private renderTrends(): string {
    if (!this.props.showTrends || !this.breakdown.trends) {
      return '';
    }
    
    const { hourly, daily, weekly } = this.breakdown.trends;
    const maxValue = Math.max(...hourly, ...daily, ...weekly, 1);
    
    return `
      <div class="tokeninfo-trends">
        <div class="tokeninfo-trends-title">Usage Trends</div>
        <div class="tokeninfo-trends-chart">
          <div class="tokeninfo-trends-line"></div>
          <div class="tokeninfo-trends-points">
            ${hourly.map((value, index) => `
              <div class="tokeninfo-trends-point" style="left: ${(index / (hourly.length - 1)) * 100}%; bottom: ${(value / maxValue) * 100}%;"></div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  private renderDetails(): string {
    if (!this.props.showDetails) {
      return '';
    }
    
    return `
      <div class="tokeninfo-details">
        <div class="tokeninfo-details-title">Detailed Information</div>
        <div class="tokeninfo-details-grid">
          <div class="tokeninfo-details-item">
            <div class="tokeninfo-details-item-label">Model</div>
            <div class="tokeninfo-details-item-value">${this.costInfo.model || 'Unknown'}</div>
          </div>
          <div class="tokeninfo-details-item">
            <div class="tokeninfo-details-item-label">Input Cost/1K</div>
            <div class="tokeninfo-details-item-value">${this.formatCost(this.costInfo.inputCostPer1K, this.costInfo.currency)}</div>
          </div>
          <div class="tokeninfo-details-item">
            <div class="tokeninfo-details-item-label">Output Cost/1K</div>
            <div class="tokeninfo-details-item-value">${this.formatCost(this.costInfo.outputCostPer1K, this.costInfo.currency)}</div>
          </div>
          <div class="tokeninfo-details-item">
            <div class="tokeninfo-details-item-label">Average Cost/Token</div>
            <div class="tokeninfo-details-item-value">${this.formatCost(this.stats.averageCostPerToken, this.costInfo.currency)}</div>
          </div>
          <div class="tokeninfo-details-item">
            <div class="tokeninfo-details-item-label">Start Time</div>
            <div class="tokeninfo-details-item-value">${new Date(this.stats.startTime).toLocaleTimeString()}</div>
          </div>
          <div class="tokeninfo-details-item">
            <div class="tokeninfo-details-item-label">Duration</div>
            <div class="tokeninfo-details-item-value">${this.formatDuration(this.stats.duration || 0)}</div>
          </div>
        </div>
      </div>
    `;
  }

  private formatTokens(count: number): string {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
    return (count / 1000000).toFixed(1) + 'M';
  }

  private formatCost(cost: number, currency: string = 'USD'): string {
    if (cost === 0) return `$0.00`;
    if (cost < 0.01) return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(2)}`;
  }

  private formatPercentage(percentage: number): string {
    return `${percentage.toFixed(1)}%`;
  }

  private formatDuration(duration: number): string {
    if (duration === 0) return '0s';
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    if (duration < 3600000) return `${(duration / 60000).toFixed(1)}m`;
    return `${(duration / 3600000).toFixed(1)}h`;
  }

  private getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
  }

  private setState(newState: string): void {
    if (this.props.state !== newState) {
      this.props.state = newState as any;
      this.updateStyles();
      this.render();
    }
  }

  private updateBreakdown(): void {
    const { inputTokens, outputTokens, systemTokens, customTokens, totalTokens } = this.stats;
    
    this.breakdown.byType = [
      { type: 'input', count: inputTokens, percentage: this.getPercentage(inputTokens, totalTokens), cost: this.calculateCost(inputTokens, 'input') },
      { type: 'output', count: outputTokens, percentage: this.getPercentage(outputTokens, totalTokens), cost: this.calculateCost(outputTokens, 'output') },
      { type: 'system', count: systemTokens, percentage: this.getPercentage(systemTokens, totalTokens), cost: this.calculateCost(systemTokens, 'input') },
      { type: 'custom', count: customTokens, percentage: this.getPercentage(customTokens, totalTokens), cost: this.calculateCost(customTokens, 'input') }
    ].filter(item => item.count > 0);
    
    this.events.breakdownChange(this.breakdown);
  }

  private updateLimits(): void {
    this.limits.currentUsage = this.stats.totalTokens;
    this.limits.remainingTokens = Math.max(0, this.limits.maxTokens - this.limits.currentUsage);
    this.limits.usagePercentage = (this.limits.currentUsage / this.limits.maxTokens) * 100;
    
    if (this.limits.usagePercentage >= 90) {
      this.setState('warning');
    }
    if (this.limits.usagePercentage >= 100) {
      this.setState('critical');
      this.events.limitReached(this.limits);
    }
  }

  // Public Methods
  public updateStats(stats: Partial<TokenStats>): void {
    this.stats = { ...this.stats, ...stats };
    this.updateBreakdown();
    this.updateLimits();
    this.events.tokenUpdate(this.stats);
    this.render();
  }

  public getStats(): TokenStats {
    return { ...this.stats };
  }

  public updateCostInfo(costInfo: Partial<CostInfo>): void {
    this.costInfo = { ...this.costInfo, ...costInfo };
    this.events.costUpdate(this.costInfo);
    this.render();
  }

  public getCostInfo(): CostInfo {
    return { ...this.costInfo };
  }

  public updateLimits(limits: Partial<TokenLimits>): void {
    this.limits = { ...this.limits, ...limits };
    this.updateLimits();
    this.render();
  }

  public getLimits(): TokenLimits {
    return { ...this.limits };
  }

  public updateBreakdown(breakdown: Partial<TokenBreakdown>): void {
    this.breakdown = { ...this.breakdown, ...breakdown };
    this.events.breakdownChange(this.breakdown);
    this.render();
  }

  public getBreakdown(): TokenBreakdown {
    return { ...this.breakdown };
  }

  public addTokenUsage(type: TokenType, count: number, cost?: number): void {
    const now = Date.now();
    
    // Update stats
    this.stats.totalTokens += count;
    this.stats[`${type}Tokens` as keyof TokenStats] = (this.stats[`${type}Tokens` as keyof TokenStats] as number) + count;
    
    if (cost) {
      this.stats.totalCost += cost;
    }
    
    // Update timing
    if (this.stats.startTime === 0) {
      this.stats.startTime = now;
    }
    this.stats.endTime = now;
    this.stats.duration = now - this.stats.startTime;
    this.stats.tokensPerSecond = this.stats.duration > 0 ? (this.stats.totalTokens / this.stats.duration) * 1000 : 0;
    this.stats.averageCostPerToken = this.stats.totalTokens > 0 ? this.stats.totalCost / this.stats.totalTokens : 0;
    
    // Update breakdown
    this.updateBreakdown();
    this.updateLimits();
    
    // Add to time series
    this.breakdown.byTime.push({
      timestamp: now,
      tokens: count,
      cost: cost || 0
    });
    
    // Keep only last 100 entries
    if (this.breakdown.byTime.length > 100) {
      this.breakdown.byTime.shift();
    }
    
    this.events.tokenUpdate(this.stats);
    this.render();
  }

  public resetStats(): void {
    this.stats = {
      totalTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      systemTokens: 0,
      userTokens: 0,
      assistantTokens: 0,
      contextTokens: 0,
      responseTokens: 0,
      customTokens: 0,
      totalCost: 0,
      averageCostPerToken: 0,
      tokensPerSecond: 0,
      startTime: Date.now()
    };
    
    this.breakdown.byType = [];
    this.breakdown.byTime = [];
    
    this.updateLimits();
    this.events.tokenUpdate(this.stats);
    this.render();
  }

  public calculateCost(tokens: number, type: 'input' | 'output'): number {
    const costPer1K = type === 'input' ? this.costInfo.inputCostPer1K : this.costInfo.outputCostPer1K;
    return (tokens / 1000) * costPer1K;
  }

  public getUsagePercentage(): number {
    return this.limits.usagePercentage;
  }

  public isLimitReached(): boolean {
    return this.limits.usagePercentage >= 100;
  }

  public getRemainingTokens(): number {
    return this.limits.remainingTokens;
  }

  public exportData(format: 'json' | 'csv' | 'txt'): string {
    const data = {
      stats: this.stats,
      costInfo: this.costInfo,
      limits: this.limits,
      breakdown: this.breakdown,
      timestamp: new Date().toISOString()
    };
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertToCSV(data);
      case 'txt':
        return this.convertToText(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  private convertToCSV(data: any): string {
    const headers = ['Metric', 'Value', 'Unit'];
    const rows = [
      ['Total Tokens', data.stats.totalTokens, 'tokens'],
      ['Input Tokens', data.stats.inputTokens, 'tokens'],
      ['Output Tokens', data.stats.outputTokens, 'tokens'],
      ['Total Cost', data.stats.totalCost, data.costInfo.currency],
      ['Usage Percentage', data.limits.usagePercentage, '%'],
      ['Remaining Tokens', data.limits.remainingTokens, 'tokens']
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertToText(data: any): string {
    return `
Token Usage Report
==================

Total Tokens: ${data.stats.totalTokens}
Input Tokens: ${data.stats.inputTokens}
Output Tokens: ${data.stats.outputTokens}
Total Cost: ${this.formatCost(data.stats.totalCost, data.costInfo.currency)}
Usage: ${data.limits.usagePercentage.toFixed(1)}%
Remaining: ${data.limits.remainingTokens} tokens

Generated: ${new Date().toLocaleString()}
    `.trim();
  }

  public refreshData(): void {
    this.events.refresh();
    this.render();
  }

  public setModel(model: string): void {
    this.costInfo.model = model;
    this.render();
  }

  public getModel(): string {
    return this.costInfo.model;
  }

  public setCurrency(currency: string): void {
    this.costInfo.currency = currency;
    this.render();
  }

  public getCurrency(): string {
    return this.costInfo.currency;
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

  public updateProps(newProps: Partial<TokenInfoProps>): void {
    this.props = { ...this.props, ...newProps };
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