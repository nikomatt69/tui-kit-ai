import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../core/src/components/BaseComponent';
import { ModelSelectorProps, ModelSelectorVariants, ModelSelectorSizes, ModelSelectorStates, AIModel, ModelFilter, AIProvider, ModelCapability } from './ModelSelector.types';
import { ModelSelectorStyles } from './ModelSelector.styles';
import { validateComponent, ValidationResult } from '../../../core/src/validation/component-validator';

export class ModelSelector implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: ModelSelectorProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private searchElement?: Widgets.BoxElement;
  private filterElement?: Widgets.BoxElement;
  private contentElement?: Widgets.BoxElement;
  private comparisonElement?: Widgets.BoxElement;
  private models: AIModel[] = [];
  private selectedModel?: AIModel;
  private filteredModels: AIModel[] = [];
  private currentFilter: ModelFilter = {};
  private searchTerm: string = '';
  private currentIndex: number = 0;

  constructor(props: ModelSelectorProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('ModelSelector', props);
    
    if (!this.validationResult.success) {
      console.error('❌ ModelSelector validation failed:', this.validationResult.errors);
      throw new Error(`ModelSelector validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ ModelSelector warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.models = this.props.models || this.getDefaultModels();
    this.selectedModel = this.props.selectedModel;
    this.currentFilter = this.props.filter || {};
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: ModelSelectorStyles.getStyle(this.props),
      content: '',
      align: 'left',
      valign: 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupModelSelectorStructure();
    this.setupEventHandlers();
    this.applyFilters();
  }
  
  private getDefaultModels(): AIModel[] {
    return [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        version: '4.0',
        description: 'Most capable GPT-4 model',
        capabilities: ['text-generation', 'function-calling', 'multimodal'],
        performance: 'premium',
        availability: 'available',
        contextWindow: 128000,
        maxTokens: 4096,
        inputCostPer1K: 0.03,
        outputCostPer1K: 0.06,
        speed: 'medium',
        quality: 'excellent',
        languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
        features: ['reasoning', 'creativity', 'analysis'],
        limitations: ['rate limits', 'cost'],
        lastUpdated: '2024-01-01',
      },
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        version: '3.0',
        description: 'Most powerful Claude model',
        capabilities: ['text-generation', 'function-calling', 'tool-use'],
        performance: 'premium',
        availability: 'available',
        contextWindow: 200000,
        maxTokens: 4096,
        inputCostPer1K: 0.015,
        outputCostPer1K: 0.075,
        speed: 'medium',
        quality: 'excellent',
        languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
        features: ['reasoning', 'analysis', 'safety'],
        limitations: ['rate limits'],
        lastUpdated: '2024-01-01',
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'google',
        version: '1.0',
        description: 'Google\'s advanced language model',
        capabilities: ['text-generation', 'multimodal'],
        performance: 'advanced',
        availability: 'available',
        contextWindow: 1000000,
        maxTokens: 8192,
        inputCostPer1K: 0.0005,
        outputCostPer1K: 0.0015,
        speed: 'fast',
        quality: 'excellent',
        languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
        features: ['reasoning', 'multimodal'],
        limitations: ['beta features'],
        lastUpdated: '2024-01-01',
      },
    ];
  }
  
  private setupModelSelectorStructure() {
    const { showSearch, showFilters, showComparison } = this.props;
    let topOffset = 0;
    
    // Create header
    this.headerElement = this.el.parent?.append({
      type: 'box',
      content: '🤖 AI Model Selector',
      style: ModelSelectorStyles.getHeaderStyle(this.props),
      top: topOffset,
      left: 0,
      width: '100%',
      height: 3,
    }) as Widgets.BoxElement;
    topOffset += 3;
    
    // Create search bar if enabled
    if (showSearch) {
      this.searchElement = this.el.parent?.append({
        type: 'box',
        content: `🔍 Search: ${this.searchTerm}`,
        style: ModelSelectorStyles.getSearchStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 2,
      }) as Widgets.BoxElement;
      topOffset += 2;
    }
    
    // Create filter bar if enabled
    if (showFilters) {
      this.filterElement = this.el.parent?.append({
        type: 'box',
        content: this.formatFilters(),
        style: ModelSelectorStyles.getFilterStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 3,
      }) as Widgets.BoxElement;
      topOffset += 3;
    }
    
    // Create main content area
    const contentHeight = this.calculateContentHeight();
    this.contentElement = this.el.parent?.append({
      type: 'box',
      content: this.formatModels(),
      style: ModelSelectorStyles.getContentStyle(this.props),
      top: topOffset,
      left: 0,
      width: '100%',
      height: contentHeight,
      scrollable: true,
      alwaysScroll: true,
    }) as Widgets.BoxElement;
    topOffset += contentHeight;
    
    // Create comparison view if enabled
    if (showComparison && this.props.comparison) {
      this.comparisonElement = this.el.parent?.append({
        type: 'box',
        content: this.formatComparison(),
        style: ModelSelectorStyles.getComparisonStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 6,
      }) as Widgets.BoxElement;
    }
  }
  
  private calculateContentHeight(): number {
    const { showSearch, showFilters, showComparison } = this.props;
    let height = 12; // Base content height
    
    if (showSearch) height += 2;
    if (showFilters) height += 3;
    if (showComparison) height += 6;
    
    return Math.min(height, 20); // Cap at 20 lines
  }
  
  private setupEventHandlers() {
    // Handle keyboard events
    this.el.key(['up'], () => {
      this.navigateUp();
    });
    
    this.el.key(['down'], () => {
      this.navigateDown();
    });
    
    this.el.key(['enter'], () => {
      this.selectCurrentModel();
    });
    
    this.el.key(['space'], () => {
      this.toggleCurrentModel();
    });
    
    this.el.key(['f'], () => {
      this.toggleFilters();
    });
    
    this.el.key(['s'], () => {
      this.toggleSearch();
    });
    
    this.el.key(['c'], () => {
      this.toggleComparison();
    });
    
    this.el.key(['r'], () => {
      this.refreshModels();
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
  
  private formatModels(): string {
    if (this.filteredModels.length === 0) {
      return 'No models found matching the current filters.';
    }
    
    return this.filteredModels
      .map((model, index) => {
        const isSelected = this.selectedModel?.id === model.id;
        const isCurrent = index === this.currentIndex;
        const prefix = isCurrent ? '→ ' : '  ';
        const selection = isSelected ? '✓ ' : '  ';
        const provider = ModelSelectorStyles.getProviderStyle(model.provider);
        const availability = ModelSelectorStyles.getAvailabilityStyle(model.availability);
        
        return `${prefix}${selection}${model.name} (${model.provider}) - ${model.availability}`;
      })
      .join('\n');
  }
  
  private formatFilters(): string {
    const filters = [];
    
    if (this.currentFilter.providers?.length) {
      filters.push(`Providers: ${this.currentFilter.providers.join(', ')}`);
    }
    
    if (this.currentFilter.capabilities?.length) {
      filters.push(`Capabilities: ${this.currentFilter.capabilities.join(', ')}`);
    }
    
    if (this.currentFilter.performance?.length) {
      filters.push(`Performance: ${this.currentFilter.performance.join(', ')}`);
    }
    
    if (this.currentFilter.availability?.length) {
      filters.push(`Availability: ${this.currentFilter.availability.join(', ')}`);
    }
    
    if (this.currentFilter.maxCost) {
      filters.push(`Max Cost: $${this.currentFilter.maxCost}/1K`);
    }
    
    return filters.length > 0 ? `Filters: ${filters.join(' | ')}` : 'No filters applied';
  }
  
  private formatComparison(): string {
    if (!this.props.comparison) return 'No comparison data available';
    
    return this.props.comparison.models
      .map(model => `${model.name}: ${model.capabilities.join(', ')} - $${model.inputCostPer1K}/1K`)
      .join('\n');
  }
  
  private applyFilters() {
    this.filteredModels = this.models.filter(model => {
      // Provider filter
      if (this.currentFilter.providers?.length && !this.currentFilter.providers.includes(model.provider)) {
        return false;
      }
      
      // Capability filter
      if (this.currentFilter.capabilities?.length) {
        const hasCapability = this.currentFilter.capabilities.some(cap => 
          model.capabilities.includes(cap)
        );
        if (!hasCapability) return false;
      }
      
      // Performance filter
      if (this.currentFilter.performance?.length && !this.currentFilter.performance.includes(model.performance)) {
        return false;
      }
      
      // Availability filter
      if (this.currentFilter.availability?.length && !this.currentFilter.availability.includes(model.availability)) {
        return false;
      }
      
      // Cost filter
      if (this.currentFilter.maxCost && model.inputCostPer1K > this.currentFilter.maxCost) {
        return false;
      }
      
      // Context window filter
      if (this.currentFilter.minContextWindow && model.contextWindow < this.currentFilter.minContextWindow) {
        return false;
      }
      
      if (this.currentFilter.maxContextWindow && model.contextWindow > this.currentFilter.maxContextWindow) {
        return false;
      }
      
      // Speed filter
      if (this.currentFilter.speed?.length && !this.currentFilter.speed.includes(model.speed)) {
        return false;
      }
      
      // Quality filter
      if (this.currentFilter.quality?.length && !this.currentFilter.quality.includes(model.quality)) {
        return false;
      }
      
      // Language filter
      if (this.currentFilter.languages?.length) {
        const hasLanguage = this.currentFilter.languages.some(lang => 
          model.languages.includes(lang)
        );
        if (!hasLanguage) return false;
      }
      
      // Search term filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        const matchesName = model.name.toLowerCase().includes(searchLower);
        const matchesDescription = model.description.toLowerCase().includes(searchLower);
        const matchesProvider = model.provider.toLowerCase().includes(searchLower);
        
        if (!matchesName && !matchesDescription && !matchesProvider) {
          return false;
        }
      }
      
      return true;
    });
    
    // Reset current index if it's out of bounds
    if (this.currentIndex >= this.filteredModels.length) {
      this.currentIndex = Math.max(0, this.filteredModels.length - 1);
    }
    
    this.updateDisplay();
  }
  
  private navigateUp() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateDisplay();
    }
  }
  
  private navigateDown() {
    if (this.currentIndex < this.filteredModels.length - 1) {
      this.currentIndex++;
      this.updateDisplay();
    }
  }
  
  private selectCurrentModel() {
    if (this.filteredModels.length === 0) return;
    
    const model = this.filteredModels[this.currentIndex];
    this.selectedModel = model;
    this.props.onModelSelect?.(model);
    this.updateDisplay();
  }
  
  private toggleCurrentModel() {
    if (this.filteredModels.length === 0) return;
    
    const model = this.filteredModels[this.currentIndex];
    
    if (this.selectedModel?.id === model.id) {
      if (this.props.allowDeselect) {
        this.selectedModel = undefined;
        this.props.onModelDeselect?.(model);
      }
    } else {
      this.selectedModel = model;
      this.props.onModelSelect?.(model);
    }
    
    this.updateDisplay();
  }
  
  private toggleFilters() {
    this.props.showFilters = !this.props.showFilters;
    this.setupModelSelectorStructure();
    this.render();
  }
  
  private toggleSearch() {
    this.props.showSearch = !this.props.showSearch;
    this.setupModelSelectorStructure();
    this.render();
  }
  
  private toggleComparison() {
    this.props.showComparison = !this.props.showComparison;
    this.setupModelSelectorStructure();
    this.render();
  }
  
  private refreshModels() {
    this.models = this.props.models || this.getDefaultModels();
    this.applyFilters();
  }
  
  private updateDisplay() {
    if (this.contentElement) {
      this.contentElement.setContent(this.formatModels());
    }
    
    if (this.filterElement) {
      this.filterElement.setContent(this.formatFilters());
    }
    
    if (this.comparisonElement) {
      this.comparisonElement.setContent(this.formatComparison());
    }
    
    this.render();
  }
  
  private render() {
    this.el.screen?.render();
  }
  
  // Public methods
  setModels(models: AIModel[]) {
    this.models = models;
    this.applyFilters();
  }
  
  setFilter(filter: ModelFilter) {
    this.currentFilter = filter;
    this.applyFilters();
    this.props.onFilterChange?.(filter);
  }
  
  setSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.applyFilters();
    this.props.onSearchChange?.(searchTerm);
  }
  
  selectModel(model: AIModel) {
    this.selectedModel = model;
    this.props.onModelSelect?.(model);
    this.updateDisplay();
  }
  
  // Implement required methods by delegating to base component
  setVariant = (variant: ModelSelectorVariants) => {
    this.props.variant = variant;
    this.el.style = ModelSelectorStyles.getStyle(this.props);
    this.render();
  };
  
  setSize = (size: ModelSelectorSizes) => {
    this.props.size = size;
    this.el.style = ModelSelectorStyles.getStyle(this.props);
    this.render();
  };
  
  setState = (state: ModelSelectorStates) => {
    this.props.state = state;
    this.el.style = ModelSelectorStyles.getStyle(this.props);
    this.render();
  };
  
  getConfig = () => ({
    variant: this.props.variant || 'default',
    size: this.props.size || 'md',
    state: this.props.state || 'default',
    modelsCount: this.models.length,
    filteredCount: this.filteredModels.length,
    selectedModel: this.selectedModel,
    currentFilter: this.currentFilter,
  });
  
  update = (props: Partial<ModelSelectorProps>) => {
    this.props = { ...this.props, ...props };
    this.el.style = ModelSelectorStyles.getStyle(this.props);
    this.render();
  };
  
  // Static method to create model selector with specific configuration
  static create(props: ModelSelectorProps): ModelSelector {
    return new ModelSelector(props);
  }
  
  // Utility methods
  getModels(): AIModel[] {
    return [...this.models];
  }
  
  getFilteredModels(): AIModel[] {
    return [...this.filteredModels];
  }
  
  getSelectedModel(): AIModel | undefined {
    return this.selectedModel;
  }
  
  getCurrentFilter(): ModelFilter {
    return { ...this.currentFilter };
  }
  
  getSearchTerm(): string {
    return this.searchTerm;
  }
}