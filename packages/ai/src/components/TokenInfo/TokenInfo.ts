import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../core/src/components/BaseComponent';
import { TokenInfoProps, TokenInfoVariants, TokenInfoSizes, TokenInfoStates, TokenUsage, TokenStats, ModelInfo, TokenType } from './TokenInfo.types';
import { TokenInfoStyles } from './TokenInfo.styles';
import { validateComponent, ValidationResult } from '../../../core/src/validation/component-validator';

export class TokenInfo implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: TokenInfoProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private contentElement?: Widgets.BoxElement;
  private progressElement?: Widgets.BoxElement;
  private breakdownElement?: Widgets.BoxElement;
  private costElement?: Widgets.BoxElement;
  private modelElement?: Widgets.BoxElement;
  private historyElement?: Widgets.BoxElement;
  private usage: TokenUsage[] = [];
  private stats: TokenStats;
  private modelInfo?: ModelInfo;

  constructor(props: TokenInfoProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('TokenInfo', props);
    
    if (!this.validationResult.success) {
      console.error('❌ TokenInfo validation failed:', this.validationResult.errors);
      throw new Error(`TokenInfo validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ TokenInfo warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.usage = this.props.usage || [];
    this.stats = this.props.stats || this.createDefaultStats();
    this.modelInfo = this.props.modelInfo;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: TokenInfoStyles.getStyle(this.props),
      content: '',
      align: 'left',
      valign: 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupTokenInfoStructure();
    this.setupEventHandlers();
    this.updateDisplay();
  }
  
  private createDefaultStats(): TokenStats {
    return {
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
      totalCost: 0,
      inputCost: 0,
      outputCost: 0,
      averageTokensPerRequest: 0,
      requestsCount: 0,
      startTime: Date.now(),
    };
  }
  
  private setupTokenInfoStructure() {
    const { showProgress, showBreakdown, showCost, showModelInfo, showHistory } = this.props;
    let topOffset = 0;
    
    // Create header
    this.headerElement = this.el.parent?.append({
      type: 'box',
      content: '🔢 Token Usage',
      style: TokenInfoStyles.getHeaderStyle(this.props),
      top: topOffset,
      left: 0,
      width: '100%',
      height: 3,
    }) as Widgets.BoxElement;
    topOffset += 3;
    
    // Create main content area
    const contentHeight = this.calculateContentHeight();
    this.contentElement = this.el.parent?.append({
      type: 'box',
      content: this.formatMainContent(),
      style: TokenInfoStyles.getContentStyle(this.props),
      top: topOffset,
      left: 0,
      width: '100%',
      height: contentHeight,
      scrollable: true,
      alwaysScroll: true,
    }) as Widgets.BoxElement;
    topOffset += contentHeight;
    
    // Create progress bar if enabled
    if (showProgress) {
      this.progressElement = this.el.parent?.append({
        type: 'box',
        content: this.formatProgress(),
        style: TokenInfoStyles.getProgressStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 1,
      }) as Widgets.BoxElement;
      topOffset += 1;
    }
    
    // Create breakdown display if enabled
    if (showBreakdown) {
      this.breakdownElement = this.el.parent?.append({
        type: 'box',
        content: this.formatBreakdown(),
        style: TokenInfoStyles.getBreakdownStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 4,
      }) as Widgets.BoxElement;
      topOffset += 4;
    }
    
    // Create cost display if enabled
    if (showCost) {
      this.costElement = this.el.parent?.append({
        type: 'box',
        content: this.formatCost(),
        style: TokenInfoStyles.getCostStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 2,
      }) as Widgets.BoxElement;
      topOffset += 2;
    }
    
    // Create model info display if enabled
    if (showModelInfo && this.modelInfo) {
      this.modelElement = this.el.parent?.append({
        type: 'box',
        content: this.formatModelInfo(),
        style: TokenInfoStyles.getModelStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 3,
      }) as Widgets.BoxElement;
      topOffset += 3;
    }
    
    // Create history display if enabled
    if (showHistory) {
      this.historyElement = this.el.parent?.append({
        type: 'box',
        content: this.formatHistory(),
        style: TokenInfoStyles.getHistoryStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 4,
        scrollable: true,
        alwaysScroll: true,
      }) as Widgets.BoxElement;
    }
  }
  
  private calculateContentHeight(): number {
    const { showProgress, showBreakdown, showCost, showModelInfo, showHistory } = this.props;
    let height = 6; // Base content height
    
    if (showProgress) height += 1;
    if (showBreakdown) height += 4;
    if (showCost) height += 2;
    if (showModelInfo) height += 3;
    if (showHistory) height += 4;
    
    return Math.min(height, 20); // Cap at 20 lines
  }
  
  private setupEventHandlers() {
    // Handle keyboard events
    this.el.key(['r'], () => {
      this.refreshStats();
    });
    
    this.el.key(['c'], () => {
      this.clearStats();
    });
    
    this.el.key(['m'], () => {
      this.toggleModelInfo();
    });
    
    this.el.key(['h'], () => {
      this.toggleHistory();
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
  }
  
  private formatMainContent(): string {
    const { totalTokens, inputTokens, outputTokens, requestsCount } = this.stats;
    const duration = this.stats.duration || (Date.now() - this.stats.startTime);
    const durationSeconds = duration / 1000;
    
    return `Total Tokens: ${totalTokens.toLocaleString()}\n` +
           `Input: ${inputTokens.toLocaleString()} | Output: ${outputTokens.toLocaleString()}\n` +
           `Requests: ${requestsCount} | Duration: ${durationSeconds.toFixed(1)}s\n` +
           `Avg per Request: ${this.stats.averageTokensPerRequest.toFixed(0)} tokens`;
  }
  
  private formatProgress(): string {
    const { totalTokens } = this.stats;
    const maxTokens = this.props.maxTokens || 100000;
    const percentage = Math.min(100, (totalTokens / maxTokens) * 100);
    const progressBar = '█'.repeat(Math.floor(percentage / 2)) + 
                       '░'.repeat(50 - Math.floor(percentage / 2));
    const statusColor = TokenInfoStyles.getProgressStatusColor(percentage);
    
    return `Progress: [${progressBar}] ${percentage.toFixed(1)}% (${totalTokens}/${maxTokens})`;
  }
  
  private formatBreakdown(): string {
    if (this.usage.length === 0) return 'No breakdown data available';
    
    return this.usage
      .map(usage => {
        const color = TokenInfoStyles.getTokenTypeColor(usage.type);
        return `${usage.type.toUpperCase()}: ${usage.count.toLocaleString()} (${usage.percentage.toFixed(1)}%)`;
      })
      .join('\n');
  }
  
  private formatCost(): string {
    const { totalCost, inputCost, outputCost } = this.stats;
    const currency = this.props.currency || '$';
    const costColor = TokenInfoStyles.getCostStatusColor(totalCost);
    
    return `Total Cost: ${currency}${totalCost.toFixed(4)}\n` +
           `Input: ${currency}${inputCost.toFixed(4)} | Output: ${currency}${outputCost.toFixed(4)}`;
  }
  
  private formatModelInfo(): string {
    if (!this.modelInfo) return 'No model information available';
    
    return `Model: ${this.modelInfo.name} (${this.modelInfo.provider})\n` +
           `Context: ${this.modelInfo.contextWindow.toLocaleString()} | ` +
           `Input: ${this.modelInfo.inputCostPer1K}/1K | ` +
           `Output: ${this.modelInfo.outputCostPer1K}/1K`;
  }
  
  private formatHistory(): string {
    // In a real implementation, this would show historical token usage
    return 'Token usage history:\n' +
           '10:30 AM - 1,250 tokens ($0.0025)\n' +
           '10:25 AM - 890 tokens ($0.0018)\n' +
           '10:20 AM - 1,100 tokens ($0.0022)';
  }
  
  // Public methods
  updateUsage(usage: TokenUsage[]) {
    this.usage = usage;
    this.updateDisplay();
    this.props.onTokenUpdate?.(this.stats);
  }
  
  updateStats(stats: TokenStats) {
    this.stats = stats;
    this.updateDisplay();
    this.props.onTokenUpdate?.(stats);
  }
  
  updateModelInfo(modelInfo: ModelInfo) {
    this.modelInfo = modelInfo;
    this.updateDisplay();
    this.props.onModelChange?.(modelInfo);
  }
  
  addTokenUsage(type: TokenType, count: number) {
    const existingUsage = this.usage.find(u => u.type === type);
    if (existingUsage) {
      existingUsage.count += count;
    } else {
      this.usage.push({
        type,
        count,
        percentage: 0,
        description: this.getTokenTypeDescription(type),
      });
    }
    
    // Update stats
    this.stats.totalTokens += count;
    this.stats.requestsCount++;
    this.stats.averageTokensPerRequest = this.stats.totalTokens / this.stats.requestsCount;
    
    // Update percentages
    this.updatePercentages();
    
    // Calculate costs
    this.calculateCosts();
    
    this.updateDisplay();
    this.props.onTokenUpdate?.(this.stats);
  }
  
  private getTokenTypeDescription(type: TokenType): string {
    const descriptions = {
      input: 'Input tokens from user',
      output: 'Output tokens from model',
      total: 'Total tokens used',
      prompt: 'Prompt tokens',
      completion: 'Completion tokens',
      system: 'System message tokens',
      user: 'User message tokens',
      assistant: 'Assistant message tokens',
      context: 'Context tokens',
      response: 'Response tokens',
    };
    
    return descriptions[type] || 'Unknown token type';
  }
  
  private updatePercentages() {
    const total = this.stats.totalTokens;
    this.usage.forEach(usage => {
      usage.percentage = total > 0 ? (usage.count / total) * 100 : 0;
    });
  }
  
  private calculateCosts() {
    const inputCostPer1K = this.props.inputCostPer1K || 0.001;
    const outputCostPer1K = this.props.outputCostPer1K || 0.002;
    
    this.stats.inputCost = (this.stats.inputTokens / 1000) * inputCostPer1K;
    this.stats.outputCost = (this.stats.outputTokens / 1000) * outputCostPer1K;
    this.stats.totalCost = this.stats.inputCost + this.stats.outputCost;
    
    this.props.onCostUpdate?.(this.stats.totalCost);
  }
  
  private updateDisplay() {
    if (this.contentElement) {
      this.contentElement.setContent(this.formatMainContent());
    }
    
    if (this.progressElement) {
      this.progressElement.setContent(this.formatProgress());
    }
    
    if (this.breakdownElement) {
      this.breakdownElement.setContent(this.formatBreakdown());
    }
    
    if (this.costElement) {
      this.costElement.setContent(this.formatCost());
    }
    
    if (this.modelElement) {
      this.modelElement.setContent(this.formatModelInfo());
    }
    
    if (this.historyElement) {
      this.historyElement.setContent(this.formatHistory());
    }
    
    this.render();
  }
  
  private refreshStats() {
    this.stats.startTime = Date.now();
    this.stats.endTime = undefined;
    this.stats.duration = undefined;
    this.updateDisplay();
  }
  
  private clearStats() {
    this.stats = this.createDefaultStats();
    this.usage = [];
    this.updateDisplay();
  }
  
  private toggleModelInfo() {
    this.props.showModelInfo = !this.props.showModelInfo;
    this.setupTokenInfoStructure();
    this.render();
  }
  
  private toggleHistory() {
    this.props.showHistory = !this.props.showHistory;
    this.setupTokenInfoStructure();
    this.render();
  }
  
  private render() {
    this.el.screen?.render();
  }
  
  // Implement required methods by delegating to base component
  setVariant = (variant: TokenInfoVariants) => {
    this.props.variant = variant;
    this.el.style = TokenInfoStyles.getStyle(this.props);
    this.render();
  };
  
  setSize = (size: TokenInfoSizes) => {
    this.props.size = size;
    this.el.style = TokenInfoStyles.getStyle(this.props);
    this.render();
  };
  
  setState = (state: TokenInfoStates) => {
    this.props.state = state;
    this.el.style = TokenInfoStyles.getStyle(this.props);
    this.render();
  };
  
  getConfig = () => ({
    variant: this.props.variant || 'default',
    size: this.props.size || 'md',
    state: this.props.state || 'default',
    totalTokens: this.stats.totalTokens,
    totalCost: this.stats.totalCost,
    requestsCount: this.stats.requestsCount,
    modelInfo: this.modelInfo,
  });
  
  update = (props: Partial<TokenInfoProps>) => {
    this.props = { ...this.props, ...props };
    this.el.style = TokenInfoStyles.getStyle(this.props);
    this.render();
  };
  
  // Static method to create token info with specific configuration
  static create(props: TokenInfoProps): TokenInfo {
    return new TokenInfo(props);
  }
  
  // Utility methods
  getUsage(): TokenUsage[] {
    return [...this.usage];
  }
  
  getStats(): TokenStats {
    return { ...this.stats };
  }
  
  getModelInfo(): ModelInfo | undefined {
    return this.modelInfo;
  }
  
  getTotalCost(): number {
    return this.stats.totalCost;
  }
  
  getTotalTokens(): number {
    return this.stats.totalTokens;
  }
}