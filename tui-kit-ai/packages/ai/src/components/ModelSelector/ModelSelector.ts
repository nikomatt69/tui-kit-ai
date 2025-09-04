import { ModelSelectorProps, ModelInfo, ModelFilter, ModelComparison, ModelSelectorEvents, ModelSelectorMethods, Provider, Capability, PerformanceLevel, Availability } from './ModelSelector.types';
import { generateModelSelectorStyles, getModelSelectorVariantClass, getModelSelectorStateClass, getProviderClass, getCapabilityClass, getPerformanceClass, getAvailabilityClass } from './ModelSelector.styles';

export class ModelSelector implements ModelSelectorMethods {
  private props: ModelSelectorProps;
  private element: HTMLElement | null = null;
  private events: ModelSelectorEvents;
  private filteredModels: ModelInfo[] = [];
  private selectedModel: ModelInfo | null = null;
  private comparisonEnabled: boolean = false;
  private comparisonModels: ModelInfo[] = [];

  constructor(props: Partial<ModelSelectorProps> = {}) {
    this.props = {
      variant: 'default',
      state: 'default',
      models: [],
      showProvider: true,
      showCapabilities: true,
      showPerformance: true,
      showCost: true,
      showAvailability: true,
      showComparison: false,
      showFilters: true,
      showSearch: true,
      showDetails: false,
      width: 80,
      height: 20,
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
      modelSelect: props.onModelSelect || (() => {}),
      modelChange: props.onModelChange || (() => {}),
      filterChange: props.onFilterChange || (() => {}),
      comparisonToggle: props.onComparisonToggle || (() => {}),
      providerChange: props.onProviderChange || (() => {}),
      capabilityChange: props.onCapabilityChange || (() => {}),
      performanceChange: props.onPerformanceChange || (() => {}),
      costChange: props.onCostChange || (() => {}),
      availabilityChange: props.onAvailabilityChange || (() => {}),
      search: () => {},
      refresh: () => {},
      export: () => {}
    };

    this.initialize();
  }

  private initialize(): void {
    this.createElement();
    this.attachEventListeners();
    this.applyFilters();
    this.updateStyles();
    this.render();
  }

  private createElement(): void {
    this.element = document.createElement('div');
    this.element.className = `modelselector-container ${getModelSelectorVariantClass(this.props.variant)} ${getModelSelectorStateClass(this.props.state)}`;
    this.element.setAttribute('data-modelselector-id', this.generateId());
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
    
    if (target.classList.contains('modelselector-action')) {
      const actionId = target.getAttribute('data-action-id');
      if (actionId) {
        this.handleAction(actionId);
      }
    } else if (target.classList.contains('modelselector-model')) {
      const modelId = target.getAttribute('data-model-id');
      if (modelId) {
        this.selectModel(modelId);
      }
    } else if (target.classList.contains('modelselector-filter-select')) {
      this.handleFilterChange(target as HTMLSelectElement);
    } else if (target.classList.contains('modelselector-search-input')) {
      this.handleSearchInput(target as HTMLInputElement);
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        if (event.target?.classList.contains('modelselector-model')) {
          const modelId = (event.target as HTMLElement).getAttribute('data-model-id');
          if (modelId) {
            this.selectModel(modelId);
          }
        }
        break;
      case 'f':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.focusSearch();
        }
        break;
      case 'c':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.toggleComparison();
        }
        break;
      case 'Escape':
        this.clearFilters();
        break;
    }
  }

  private handleAction(actionId: string): void {
    switch (actionId) {
      case 'refresh':
        this.refreshModels();
        break;
      case 'export':
        this.exportModels('json');
        break;
      case 'toggle-filters':
        this.props.showFilters = !this.props.showFilters;
        this.render();
        break;
      case 'toggle-comparison':
        this.toggleComparison();
        break;
      case 'toggle-details':
        this.props.showDetails = !this.props.showDetails;
        this.render();
        break;
    }
  }

  private handleFilterChange(select: HTMLSelectElement): void {
    const filterType = select.getAttribute('data-filter-type');
    const value = select.value;
    
    if (!this.props.filter) {
      this.props.filter = {};
    }
    
    switch (filterType) {
      case 'provider':
        this.props.filter.providers = value ? [value as Provider] : undefined;
        break;
      case 'capability':
        this.props.filter.capabilities = value ? [value as Capability] : undefined;
        break;
      case 'performance':
        this.props.filter.performance = value ? [value as PerformanceLevel] : undefined;
        break;
      case 'availability':
        this.props.filter.availability = value ? [value as Availability] : undefined;
        break;
      case 'max-cost':
        this.props.filter.maxCost = value ? parseFloat(value) : undefined;
        break;
      case 'min-tokens':
        this.props.filter.minTokens = value ? parseInt(value) : undefined;
        break;
      case 'max-tokens':
        this.props.filter.maxTokens = value ? parseInt(value) : undefined;
        break;
    }
    
    this.applyFilters();
    this.events.filterChange(this.props.filter);
    this.render();
  }

  private handleSearchInput(input: HTMLInputElement): void {
    const query = input.value.toLowerCase();
    
    if (!this.props.filter) {
      this.props.filter = {};
    }
    
    this.props.filter.searchQuery = query;
    this.applyFilters();
    this.events.search(query);
    this.render();
  }

  private focusSearch(): void {
    const searchInput = this.element?.querySelector('.modelselector-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  private toggleComparison(): void {
    this.comparisonEnabled = !this.comparisonEnabled;
    this.events.comparisonToggle(this.comparisonEnabled);
    this.render();
  }

  private generateId(): string {
    return `modelselector-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private applyFilters(): void {
    this.filteredModels = this.props.models.filter(model => {
      if (!this.props.filter) return true;
      
      const { providers, capabilities, performance, availability, maxCost, minTokens, maxTokens, searchQuery } = this.props.filter;
      
      // Provider filter
      if (providers && providers.length > 0 && !providers.includes(model.provider)) {
        return false;
      }
      
      // Capability filter
      if (capabilities && capabilities.length > 0 && !capabilities.some(cap => model.capabilities.includes(cap))) {
        return false;
      }
      
      // Performance filter
      if (performance && performance.length > 0 && !performance.includes(model.performance)) {
        return false;
      }
      
      // Availability filter
      if (availability && availability.length > 0 && !availability.includes(model.availability)) {
        return false;
      }
      
      // Cost filter
      if (maxCost && (model.inputCostPer1K > maxCost || model.outputCostPer1K > maxCost)) {
        return false;
      }
      
      // Token filters
      if (minTokens && model.maxTokens < minTokens) {
        return false;
      }
      if (maxTokens && model.maxTokens > maxTokens) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchText = `${model.name} ${model.description} ${model.provider} ${model.capabilities.join(' ')}`.toLowerCase();
        if (!searchText.includes(query)) {
          return false;
        }
      }
      
      return true;
    });
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

    const styles = generateModelSelectorStyles(styleConfig);
    
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

    const { variant, state, showProvider, showCapabilities, showPerformance, showCost, showAvailability, showComparison, showFilters, showSearch, showDetails } = this.props;
    
    this.element.className = `modelselector-container ${getModelSelectorVariantClass(variant)} ${getModelSelectorStateClass(state)}`;
    
    this.element.innerHTML = `
      <div class="modelselector-header">
        <div class="modelselector-title">
          <span>AI Model Selector</span>
          <span class="modelselector-status">${state}</span>
        </div>
        <div class="modelselector-actions">
          <button class="modelselector-action" data-action-id="refresh" title="Refresh Models">🔄</button>
          <button class="modelselector-action" data-action-id="export" title="Export Models">📊</button>
          ${showFilters ? `<button class="modelselector-action" data-action-id="toggle-filters" title="Toggle Filters">🔍</button>` : ''}
          ${showComparison ? `<button class="modelselector-action" data-action-id="toggle-comparison" title="Toggle Comparison (Ctrl+C)">📊</button>` : ''}
          ${showDetails ? `<button class="modelselector-action" data-action-id="toggle-details" title="Toggle Details">ℹ️</button>` : ''}
        </div>
      </div>
      
      ${showSearch ? this.renderSearch() : ''}
      ${showFilters ? this.renderFilters() : ''}
      
      <div class="modelselector-content">
        ${this.renderModels()}
      </div>
      
      ${showComparison ? this.renderComparison() : ''}
      ${showDetails ? this.renderDetails() : ''}
      
      <div class="modelselector-footer">
        <div class="modelselector-footer-info">
          <div class="modelselector-footer-info-item">
            <span>📊</span>
            <span>${this.filteredModels.length} models</span>
          </div>
          <div class="modelselector-footer-info-item">
            <span>🎯</span>
            <span>${this.selectedModel ? this.selectedModel.name : 'No selection'}</span>
          </div>
          <div class="modelselector-footer-info-item">
            <span>🔍</span>
            <span>${this.props.filter?.searchQuery || 'No filter'}</span>
          </div>
        </div>
        <div class="modelselector-footer-actions">
          <span>Press F to search, C to compare</span>
        </div>
      </div>
    `;
  }

  private renderSearch(): string {
    return `
      <div class="modelselector-search">
        <input 
          type="text" 
          class="modelselector-search-input" 
          placeholder="Search models..." 
          value="${this.props.filter?.searchQuery || ''}"
        />
      </div>
    `;
  }

  private renderFilters(): string {
    if (!this.props.showFilters) return '';
    
    const providers = [...new Set(this.props.models.map(m => m.provider))];
    const capabilities = [...new Set(this.props.models.flatMap(m => m.capabilities))];
    const performanceLevels = [...new Set(this.props.models.map(m => m.performance))];
    const availabilityLevels = [...new Set(this.props.models.map(m => m.availability))];
    
    return `
      <div class="modelselector-filters">
        <div class="modelselector-filters-title">Filters</div>
        <div class="modelselector-filters-grid">
          <div class="modelselector-filter">
            <div class="modelselector-filter-label">Provider</div>
            <select class="modelselector-filter-select" data-filter-type="provider">
              <option value="">All Providers</option>
              ${providers.map(provider => `
                <option value="${provider}" ${this.props.filter?.providers?.includes(provider) ? 'selected' : ''}>${provider}</option>
              `).join('')}
            </select>
          </div>
          <div class="modelselector-filter">
            <div class="modelselector-filter-label">Capability</div>
            <select class="modelselector-filter-select" data-filter-type="capability">
              <option value="">All Capabilities</option>
              ${capabilities.map(capability => `
                <option value="${capability}" ${this.props.filter?.capabilities?.includes(capability) ? 'selected' : ''}>${capability}</option>
              `).join('')}
            </select>
          </div>
          <div class="modelselector-filter">
            <div class="modelselector-filter-label">Performance</div>
            <select class="modelselector-filter-select" data-filter-type="performance">
              <option value="">All Levels</option>
              ${performanceLevels.map(level => `
                <option value="${level}" ${this.props.filter?.performance?.includes(level) ? 'selected' : ''}>${level}</option>
              `).join('')}
            </select>
          </div>
          <div class="modelselector-filter">
            <div class="modelselector-filter-label">Availability</div>
            <select class="modelselector-filter-select" data-filter-type="availability">
              <option value="">All Status</option>
              ${availabilityLevels.map(status => `
                <option value="${status}" ${this.props.filter?.availability?.includes(status) ? 'selected' : ''}>${status}</option>
              `).join('')}
            </select>
          </div>
          <div class="modelselector-filter">
            <div class="modelselector-filter-label">Max Cost</div>
            <select class="modelselector-filter-select" data-filter-type="max-cost">
              <option value="">No Limit</option>
              <option value="0.01" ${this.props.filter?.maxCost === 0.01 ? 'selected' : ''}>$0.01</option>
              <option value="0.05" ${this.props.filter?.maxCost === 0.05 ? 'selected' : ''}>$0.05</option>
              <option value="0.10" ${this.props.filter?.maxCost === 0.10 ? 'selected' : ''}>$0.10</option>
              <option value="0.50" ${this.props.filter?.maxCost === 0.50 ? 'selected' : ''}>$0.50</option>
            </select>
          </div>
          <div class="modelselector-filter">
            <div class="modelselector-filter-label">Min Tokens</div>
            <select class="modelselector-filter-select" data-filter-type="min-tokens">
              <option value="">No Limit</option>
              <option value="1000" ${this.props.filter?.minTokens === 1000 ? 'selected' : ''}>1K</option>
              <option value="4000" ${this.props.filter?.minTokens === 4000 ? 'selected' : ''}>4K</option>
              <option value="8000" ${this.props.filter?.minTokens === 8000 ? 'selected' : ''}>8K</option>
              <option value="16000" ${this.props.filter?.minTokens === 16000 ? 'selected' : ''}>16K</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  private renderModels(): string {
    if (this.filteredModels.length === 0) {
      return '<div class="modelselector-empty">No models found matching your criteria</div>';
    }
    
    return `
      <div class="modelselector-models">
        ${this.filteredModels.map(model => `
          <div class="modelselector-model ${this.selectedModel?.id === model.id ? 'selected' : ''}" data-model-id="${model.id}">
            <div class="modelselector-model-performance ${getPerformanceClass(model.performance)}"></div>
            <div class="modelselector-model-header">
              <div class="modelselector-model-name">${model.name}</div>
              ${showProvider ? `<div class="modelselector-model-provider ${getProviderClass(model.provider)}">${model.provider}</div>` : ''}
            </div>
            <div class="modelselector-model-description">${model.description}</div>
            ${showCapabilities ? `
              <div class="modelselector-model-capabilities">
                ${model.capabilities.slice(0, 3).map(cap => `
                  <span class="modelselector-capability ${getCapabilityClass(cap)}">${cap}</span>
                `).join('')}
                ${model.capabilities.length > 3 ? `<span class="modelselector-capability">+${model.capabilities.length - 3}</span>` : ''}
              </div>
            ` : ''}
            <div class="modelselector-model-meta">
              ${showCost ? `<span class="modelselector-model-cost">$${model.inputCostPer1K.toFixed(3)}/1K</span>` : ''}
              <span class="modelselector-model-tokens">${this.formatTokens(model.maxTokens)} tokens</span>
              ${showAvailability ? `<span class="modelselector-model-availability ${getAvailabilityClass(model.availability)}">${model.availability}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderComparison(): string {
    if (!this.comparisonEnabled || this.comparisonModels.length === 0) {
      return '';
    }
    
    return `
      <div class="modelselector-comparison">
        <div class="modelselector-comparison-title">Model Comparison</div>
        <table class="modelselector-comparison-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Provider</th>
              <th>Max Tokens</th>
              <th>Input Cost/1K</th>
              <th>Output Cost/1K</th>
              <th>Performance</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            ${this.comparisonModels.map(model => `
              <tr>
                <td>${model.name}</td>
                <td>${model.provider}</td>
                <td>${this.formatTokens(model.maxTokens)}</td>
                <td>$${model.inputCostPer1K.toFixed(3)}</td>
                <td>$${model.outputCostPer1K.toFixed(3)}</td>
                <td>${model.performance}</td>
                <td>${model.availability}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderDetails(): string {
    if (!this.props.showDetails || !this.selectedModel) {
      return '';
    }
    
    const model = this.selectedModel;
    
    return `
      <div class="modelselector-details">
        <div class="modelselector-details-title">Model Details</div>
        <div class="modelselector-details-grid">
          <div class="modelselector-details-item">
            <div class="modelselector-details-item-label">Version</div>
            <div class="modelselector-details-item-value">${model.version}</div>
          </div>
          <div class="modelselector-details-item">
            <div class="modelselector-details-item-label">Context Window</div>
            <div class="modelselector-details-item-value">${this.formatTokens(model.contextWindow)}</div>
          </div>
          <div class="modelselector-details-item">
            <div class="modelselector-details-item-label">Training Data</div>
            <div class="modelselector-details-item-value">${model.trainingData}</div>
          </div>
          <div class="modelselector-details-item">
            <div class="modelselector-details-item-label">Release Date</div>
            <div class="modelselector-details-item-value">${model.releaseDate}</div>
          </div>
          <div class="modelselector-details-item">
            <div class="modelselector-details-item-label">Last Updated</div>
            <div class="modelselector-details-item-value">${model.lastUpdated}</div>
          </div>
          <div class="modelselector-details-item">
            <div class="modelselector-details-item-label">Documentation</div>
            <div class="modelselector-details-item-value">
              <a href="${model.documentation}" target="_blank">View Docs</a>
            </div>
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

  private setState(newState: string): void {
    if (this.props.state !== newState) {
      this.props.state = newState as any;
      this.updateStyles();
      this.render();
    }
  }

  // Public Methods
  public selectModel(modelId: string): void {
    const model = this.props.models.find(m => m.id === modelId);
    if (model) {
      this.selectedModel = model;
      this.props.selectedModel = modelId;
      this.events.modelSelect(model);
      this.events.modelChange(model);
      this.render();
    }
  }

  public getSelectedModel(): ModelInfo | null {
    return this.selectedModel;
  }

  public getModels(): ModelInfo[] {
    return [...this.props.models];
  }

  public getFilteredModels(): ModelInfo[] {
    return [...this.filteredModels];
  }

  public setFilter(filter: ModelFilter): void {
    this.props.filter = { ...filter };
    this.applyFilters();
    this.events.filterChange(this.props.filter);
    this.render();
  }

  public getFilter(): ModelFilter {
    return { ...this.props.filter } || {};
  }

  public clearFilter(): void {
    this.props.filter = {};
    this.applyFilters();
    this.events.filterChange(this.props.filter);
    this.render();
  }

  public searchModels(query: string): ModelInfo[] {
    const searchQuery = query.toLowerCase();
    return this.props.models.filter(model => {
      const searchText = `${model.name} ${model.description} ${model.provider} ${model.capabilities.join(' ')}`.toLowerCase();
      return searchText.includes(searchQuery);
    });
  }

  public compareModels(modelIds: string[]): ModelComparison {
    const models = modelIds.map(id => this.props.models.find(m => m.id === id)).filter(Boolean) as ModelInfo[];
    
    const criteria = ['maxTokens', 'inputCostPer1K', 'outputCostPer1K', 'performance', 'availability'];
    const scores: Record<string, Record<string, number>> = {};
    
    models.forEach(model => {
      scores[model.id] = {
        maxTokens: model.maxTokens,
        inputCostPer1K: model.inputCostPer1K,
        outputCostPer1K: model.outputCostPer1K,
        performance: this.getPerformanceScore(model.performance),
        availability: this.getAvailabilityScore(model.availability)
      };
    });
    
    const recommendations = this.getRecommendations(criteria);
    
    return {
      models,
      criteria,
      scores,
      recommendations: recommendations.map(m => m.name)
    };
  }

  private getPerformanceScore(performance: PerformanceLevel): number {
    const scores = {
      basic: 1,
      standard: 2,
      advanced: 3,
      premium: 4,
      enterprise: 5
    };
    return scores[performance] || 0;
  }

  private getAvailabilityScore(availability: Availability): number {
    const scores = {
      available: 5,
      limited: 3,
      beta: 2,
      deprecated: 1,
      unavailable: 0
    };
    return scores[availability] || 0;
  }

  public getRecommendations(criteria: string[]): ModelInfo[] {
    // Simple recommendation logic based on criteria
    return this.filteredModels
      .filter(model => model.availability === 'available')
      .sort((a, b) => {
        // Sort by performance and cost efficiency
        const aScore = this.getPerformanceScore(a.performance) - (a.inputCostPer1K + a.outputCostPer1K) / 2;
        const bScore = this.getPerformanceScore(b.performance) - (b.inputCostPer1K + b.outputCostPer1K) / 2;
        return bScore - aScore;
      })
      .slice(0, 5);
  }

  public refreshModels(): void {
    this.events.refresh();
    this.render();
  }

  public exportModels(format: 'json' | 'csv' | 'txt'): string {
    const data = this.filteredModels;
    
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

  private convertToCSV(models: ModelInfo[]): string {
    const headers = ['Name', 'Provider', 'Version', 'Max Tokens', 'Input Cost/1K', 'Output Cost/1K', 'Performance', 'Availability'];
    const rows = models.map(model => [
      model.name,
      model.provider,
      model.version,
      model.maxTokens.toString(),
      model.inputCostPer1K.toString(),
      model.outputCostPer1K.toString(),
      model.performance,
      model.availability
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertToText(models: ModelInfo[]): string {
    return models.map(model => `
${model.name} (${model.provider})
  Version: ${model.version}
  Max Tokens: ${this.formatTokens(model.maxTokens)}
  Cost: $${model.inputCostPer1K.toFixed(3)}/$1K input, $${model.outputCostPer1K.toFixed(3)}/$1K output
  Performance: ${model.performance}
  Availability: ${model.availability}
  Capabilities: ${model.capabilities.join(', ')}
  Description: ${model.description}
    `).join('\n');
  }

  public addModel(model: ModelInfo): void {
    this.props.models.push(model);
    this.applyFilters();
    this.render();
  }

  public removeModel(modelId: string): void {
    this.props.models = this.props.models.filter(m => m.id !== modelId);
    if (this.selectedModel?.id === modelId) {
      this.selectedModel = null;
      this.props.selectedModel = undefined;
    }
    this.applyFilters();
    this.render();
  }

  public updateModel(modelId: string, updates: Partial<ModelInfo>): void {
    const index = this.props.models.findIndex(m => m.id === modelId);
    if (index !== -1) {
      this.props.models[index] = { ...this.props.models[index], ...updates };
      if (this.selectedModel?.id === modelId) {
        this.selectedModel = this.props.models[index];
      }
      this.applyFilters();
      this.render();
    }
  }

  public getModelById(modelId: string): ModelInfo | null {
    return this.props.models.find(m => m.id === modelId) || null;
  }

  public getModelsByProvider(provider: Provider): ModelInfo[] {
    return this.props.models.filter(m => m.provider === provider);
  }

  public getModelsByCapability(capability: Capability): ModelInfo[] {
    return this.props.models.filter(m => m.capabilities.includes(capability));
  }

  public getModelsByPerformance(performance: PerformanceLevel): ModelInfo[] {
    return this.props.models.filter(m => m.performance === performance);
  }

  public getModelsByAvailability(availability: Availability): ModelInfo[] {
    return this.props.models.filter(m => m.availability === availability);
  }

  public getModelsByCost(maxCost: number): ModelInfo[] {
    return this.props.models.filter(m => m.inputCostPer1K <= maxCost && m.outputCostPer1K <= maxCost);
  }

  public getModelsByTokens(minTokens: number, maxTokens?: number): ModelInfo[] {
    return this.props.models.filter(m => {
      if (m.maxTokens < minTokens) return false;
      if (maxTokens && m.maxTokens > maxTokens) return false;
      return true;
    });
  }

  public sortModels(criteria: string, order: 'asc' | 'desc'): ModelInfo[] {
    const sorted = [...this.filteredModels].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (criteria) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'provider':
          aValue = a.provider;
          bValue = b.provider;
          break;
        case 'maxTokens':
          aValue = a.maxTokens;
          bValue = b.maxTokens;
          break;
        case 'inputCost':
          aValue = a.inputCostPer1K;
          bValue = b.inputCostPer1K;
          break;
        case 'outputCost':
          aValue = a.outputCostPer1K;
          bValue = b.outputCostPer1K;
          break;
        case 'performance':
          aValue = this.getPerformanceScore(a.performance);
          bValue = this.getPerformanceScore(b.performance);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }

  public getModelStats(): {
    total: number;
    byProvider: Record<Provider, number>;
    byCapability: Record<Capability, number>;
    byPerformance: Record<PerformanceLevel, number>;
    byAvailability: Record<Availability, number>;
  } {
    const stats = {
      total: this.props.models.length,
      byProvider: {} as Record<Provider, number>,
      byCapability: {} as Record<Capability, number>,
      byPerformance: {} as Record<PerformanceLevel, number>,
      byAvailability: {} as Record<Availability, number>
    };
    
    this.props.models.forEach(model => {
      // Provider stats
      stats.byProvider[model.provider] = (stats.byProvider[model.provider] || 0) + 1;
      
      // Capability stats
      model.capabilities.forEach(cap => {
        stats.byCapability[cap] = (stats.byCapability[cap] || 0) + 1;
      });
      
      // Performance stats
      stats.byPerformance[model.performance] = (stats.byPerformance[model.performance] || 0) + 1;
      
      // Availability stats
      stats.byAvailability[model.availability] = (stats.byAvailability[model.availability] || 0) + 1;
    });
    
    return stats;
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

  public updateProps(newProps: Partial<ModelSelectorProps>): void {
    this.props = { ...this.props, ...newProps };
    this.applyFilters();
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