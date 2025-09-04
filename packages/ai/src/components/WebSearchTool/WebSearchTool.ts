import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../core/src/components/BaseComponent';
import { WebSearchToolProps, WebSearchToolVariants, WebSearchToolSizes, WebSearchToolStates, SearchEngine, SearchResult, SearchQuery, SearchFilters, SearchResultType } from './WebSearchTool.types';
import { WebSearchToolStyles } from './WebSearchTool.styles';
import { validateComponent, ValidationResult } from '../../../core/src/validation/component-validator';

export class WebSearchTool implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: WebSearchToolProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private searchBarElement?: Widgets.BoxElement;
  private filtersElement?: Widgets.BoxElement;
  private historyElement?: Widgets.BoxElement;
  private resultsElement?: Widgets.BoxElement;
  private previewElement?: Widgets.BoxElement;
  private statsElement?: Widgets.BoxElement;
  private currentQuery: string = '';
  private currentEngine: SearchEngine = 'google';
  private currentFilters: SearchFilters = {};
  private results: SearchResult[] = [];
  private currentIndex: number = 0;
  private searchHistory: any[] = [];
  private isSearching: boolean = false;

  constructor(props: WebSearchToolProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('WebSearchTool', props);
    
    if (!this.validationResult.success) {
      console.error('❌ WebSearchTool validation failed:', this.validationResult.errors);
      throw new Error(`WebSearchTool validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ WebSearchTool warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.currentEngine = this.props.defaultEngine || 'google';
    this.searchHistory = this.props.searchHistory || [];
    this.results = this.props.results || [];
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: WebSearchToolStyles.getStyle(this.props),
      content: '',
      align: 'left',
      valign: 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupWebSearchToolStructure();
    this.setupEventHandlers();
    this.updateDisplay();
  }
  
  private setupWebSearchToolStructure() {
    const { showSearchBar, showFilters, showHistory, showResults, showPreview, showStats } = this.props;
    let topOffset = 0;
    
    // Create header
    this.headerElement = this.el.parent?.append({
      type: 'box',
      content: '🔍 Web Search Tool',
      style: WebSearchToolStyles.getHeaderStyle(this.props),
      top: topOffset,
      left: 0,
      width: '100%',
      height: 3,
    }) as Widgets.BoxElement;
    topOffset += 3;
    
    // Create search bar if enabled
    if (showSearchBar) {
      this.searchBarElement = this.el.parent?.append({
        type: 'box',
        content: this.formatSearchBar(),
        style: WebSearchToolStyles.getSearchBarStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 3,
      }) as Widgets.BoxElement;
      topOffset += 3;
    }
    
    // Create filters if enabled
    if (showFilters) {
      this.filtersElement = this.el.parent?.append({
        type: 'box',
        content: this.formatFilters(),
        style: WebSearchToolStyles.getFiltersStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 3,
      }) as Widgets.BoxElement;
      topOffset += 3;
    }
    
    // Create history if enabled
    if (showHistory) {
      this.historyElement = this.el.parent?.append({
        type: 'box',
        content: this.formatHistory(),
        style: WebSearchToolStyles.getHistoryStyle(this.props),
        top: topOffset,
        left: 0,
        width: '30%',
        height: 8,
        scrollable: true,
        alwaysScroll: true,
      }) as Widgets.BoxElement;
    }
    
    // Create results area
    const resultsLeft = showHistory ? '30%' : 0;
    const resultsWidth = showHistory ? '70%' : '100%';
    const resultsHeight = this.calculateResultsHeight();
    
    if (showResults) {
      this.resultsElement = this.el.parent?.append({
        type: 'box',
        content: this.formatResults(),
        style: WebSearchToolStyles.getResultsStyle(this.props),
        top: topOffset,
        left: resultsLeft,
        width: resultsWidth,
        height: resultsHeight,
        scrollable: true,
        alwaysScroll: true,
      }) as Widgets.BoxElement;
    }
    
    // Create preview if enabled
    if (showPreview) {
      this.previewElement = this.el.parent?.append({
        type: 'box',
        content: this.formatPreview(),
        style: WebSearchToolStyles.getPreviewStyle(this.props),
        top: '100%-3',
        left: 0,
        width: '100%',
        height: 3,
        scrollable: true,
        alwaysScroll: true,
      }) as Widgets.BoxElement;
    }
    
    // Create stats if enabled
    if (showStats) {
      this.statsElement = this.el.parent?.append({
        type: 'box',
        content: this.formatStats(),
        style: WebSearchToolStyles.getStatsStyle(this.props),
        top: '100%-1',
        left: 0,
        width: '100%',
        height: 1,
      }) as Widgets.BoxElement;
    }
  }
  
  private calculateResultsHeight(): number {
    const { showPreview, showStats } = this.props;
    let height = 12; // Base results height
    
    if (showPreview) height -= 3;
    if (showStats) height -= 1;
    
    return Math.max(height, 6); // Minimum 6 lines
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
      this.selectCurrentResult();
    });
    
    this.el.key(['space'], () => {
      this.previewCurrentResult();
    });
    
    this.el.key(['s'], () => {
      this.startSearch();
    });
    
    this.el.key(['f'], () => {
      this.toggleFilters();
    });
    
    this.el.key(['h'], () => {
      this.toggleHistory();
    });
    
    this.el.key(['e'], () => {
      this.cycleEngine();
    });
    
    this.el.key(['r'], () => {
      this.refreshResults();
    });
    
    this.el.key(['c'], () => {
      this.clearResults();
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
  
  private formatSearchBar(): string {
    const engineStyle = WebSearchToolStyles.getSearchEngineStyle(this.currentEngine);
    return `🔍 [${this.currentEngine.toUpperCase()}] Search: ${this.currentQuery || 'Enter search query...'}`;
  }
  
  private formatFilters(): string {
    const filters = [];
    
    if (this.currentFilters.resultType?.length) {
      filters.push(`Types: ${this.currentFilters.resultType.join(', ')}`);
    }
    
    if (this.currentFilters.language) {
      filters.push(`Language: ${this.currentFilters.language}`);
    }
    
    if (this.currentFilters.timeRange) {
      filters.push(`Time: ${this.currentFilters.timeRange}`);
    }
    
    if (this.currentFilters.safeSearch) {
      filters.push(`Safe: ${this.currentFilters.safeSearch}`);
    }
    
    return filters.length > 0 ? `Filters: ${filters.join(' | ')}` : 'No filters applied';
  }
  
  private formatHistory(): string {
    if (this.searchHistory.length === 0) {
      return 'No search history';
    }
    
    return this.searchHistory
      .slice(-10) // Show last 10 searches
      .map((item, index) => `${index + 1}. ${item.query} (${item.engine})`)
      .join('\n');
  }
  
  private formatResults(): string {
    if (this.isSearching) {
      return 'Searching... Please wait.';
    }
    
    if (this.results.length === 0) {
      return 'No results found. Press [S] to search.';
    }
    
    return this.results
      .map((result, index) => {
        const isCurrent = index === this.currentIndex;
        const prefix = isCurrent ? '→ ' : '  ';
        const typeStyle = WebSearchToolStyles.getResultTypeStyle(result.type);
        const relevanceStyle = WebSearchToolStyles.getRelevanceStyle(result.relevance);
        
        return `${prefix}${result.title}\n    ${result.description}\n    ${result.url}`;
      })
      .join('\n\n');
  }
  
  private formatPreview(): string {
    if (this.results.length === 0 || this.currentIndex >= this.results.length) {
      return 'No preview available';
    }
    
    const result = this.results[this.currentIndex];
    return `Preview: ${result.title}\n${result.description}`;
  }
  
  private formatStats(): string {
    const totalResults = this.results.length;
    const searchTime = this.isSearching ? 'Searching...' : 'Ready';
    
    return `Results: ${totalResults} | Engine: ${this.currentEngine} | Status: ${searchTime}`;
  }
  
  private navigateUp() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateDisplay();
    }
  }
  
  private navigateDown() {
    if (this.currentIndex < this.results.length - 1) {
      this.currentIndex++;
      this.updateDisplay();
    }
  }
  
  private selectCurrentResult() {
    if (this.results.length === 0) return;
    
    const result = this.results[this.currentIndex];
    this.props.onResultClick?.(result);
    
    // Add to history
    this.addToHistory(this.currentQuery, this.currentEngine);
  }
  
  private previewCurrentResult() {
    if (this.results.length === 0) return;
    
    const result = this.results[this.currentIndex];
    this.props.onResultPreview?.(result);
    this.updateDisplay();
  }
  
  private startSearch() {
    if (!this.currentQuery.trim()) return;
    
    this.isSearching = true;
    this.setState('loading');
    this.updateDisplay();
    
    // Simulate search (in real implementation, this would call actual search API)
    setTimeout(() => {
      this.performSearch();
    }, 1000);
  }
  
  private performSearch() {
    // Simulate search results
    this.results = [
      {
        id: '1',
        title: 'Example Search Result 1',
        url: 'https://example.com/result1',
        description: 'This is an example search result description that provides relevant information about the search query.',
        type: 'webpage' as SearchResultType,
        source: this.currentEngine,
        timestamp: Date.now(),
        relevance: 0.95,
        metadata: {
          author: 'Example Author',
          publishedDate: '2024-01-01',
        },
      },
      {
        id: '2',
        title: 'Example Search Result 2',
        url: 'https://example.com/result2',
        description: 'Another example search result with different content and information.',
        type: 'webpage' as SearchResultType,
        source: this.currentEngine,
        timestamp: Date.now(),
        relevance: 0.87,
        metadata: {
          author: 'Another Author',
          publishedDate: '2024-01-02',
        },
      },
      {
        id: '3',
        title: 'Example News Article',
        url: 'https://news.example.com/article',
        description: 'A news article related to the search query with current information.',
        type: 'news' as SearchResultType,
        source: this.currentEngine,
        timestamp: Date.now(),
        relevance: 0.82,
        metadata: {
          author: 'News Author',
          publishedDate: '2024-01-03',
        },
      },
    ];
    
    this.isSearching = false;
    this.setState('success');
    this.currentIndex = 0;
    
    this.props.onSearch?.(this.currentQuery, this.currentEngine, this.currentFilters);
    this.updateDisplay();
  }
  
  private addToHistory(query: string, engine: SearchEngine) {
    const historyItem = {
      id: Date.now().toString(),
      query,
      engine,
      timestamp: Date.now(),
      resultCount: this.results.length,
      clickedResults: [],
    };
    
    this.searchHistory.push(historyItem);
    
    // Keep only last 50 searches
    if (this.searchHistory.length > 50) {
      this.searchHistory = this.searchHistory.slice(-50);
    }
  }
  
  private toggleFilters() {
    this.props.showFilters = !this.props.showFilters;
    this.setupWebSearchToolStructure();
    this.render();
  }
  
  private toggleHistory() {
    this.props.showHistory = !this.props.showHistory;
    this.setupWebSearchToolStructure();
    this.render();
  }
  
  private cycleEngine() {
    const engines: SearchEngine[] = ['google', 'bing', 'duckduckgo', 'yahoo', 'brave'];
    const currentIndex = engines.indexOf(this.currentEngine);
    this.currentEngine = engines[(currentIndex + 1) % engines.length];
    
    this.props.onEngineChange?.(this.currentEngine);
    this.updateDisplay();
  }
  
  private refreshResults() {
    if (this.currentQuery.trim()) {
      this.startSearch();
    }
  }
  
  private clearResults() {
    this.results = [];
    this.currentIndex = 0;
    this.currentQuery = '';
    this.updateDisplay();
  }
  
  private updateDisplay() {
    if (this.searchBarElement) {
      this.searchBarElement.setContent(this.formatSearchBar());
    }
    
    if (this.filtersElement) {
      this.filtersElement.setContent(this.formatFilters());
    }
    
    if (this.historyElement) {
      this.historyElement.setContent(this.formatHistory());
    }
    
    if (this.resultsElement) {
      this.resultsElement.setContent(this.formatResults());
    }
    
    if (this.previewElement) {
      this.previewElement.setContent(this.formatPreview());
    }
    
    if (this.statsElement) {
      this.statsElement.setContent(this.formatStats());
    }
    
    this.render();
  }
  
  private render() {
    this.el.screen?.render();
  }
  
  // Public methods
  setQuery(query: string) {
    this.currentQuery = query;
    this.updateDisplay();
  }
  
  setEngine(engine: SearchEngine) {
    this.currentEngine = engine;
    this.props.onEngineChange?.(engine);
    this.updateDisplay();
  }
  
  setFilters(filters: SearchFilters) {
    this.currentFilters = filters;
    this.props.onFilterChange?.(filters);
    this.updateDisplay();
  }
  
  setResults(results: SearchResult[]) {
    this.results = results;
    this.currentIndex = 0;
    this.updateDisplay();
  }
  
  // Implement required methods by delegating to base component
  setVariant = (variant: WebSearchToolVariants) => {
    this.props.variant = variant;
    this.el.style = WebSearchToolStyles.getStyle(this.props);
    this.render();
  };
  
  setSize = (size: WebSearchToolSizes) => {
    this.props.size = size;
    this.el.style = WebSearchToolStyles.getStyle(this.props);
    this.render();
  };
  
  setState = (state: WebSearchToolStates) => {
    this.props.state = state;
    this.el.style = WebSearchToolStyles.getStyle(this.props);
    this.render();
  };
  
  getConfig = () => ({
    variant: this.props.variant || 'default',
    size: this.props.size || 'md',
    state: this.props.state || 'default',
    currentQuery: this.currentQuery,
    currentEngine: this.currentEngine,
    resultsCount: this.results.length,
    historyCount: this.searchHistory.length,
  });
  
  update = (props: Partial<WebSearchToolProps>) => {
    this.props = { ...this.props, ...props };
    this.el.style = WebSearchToolStyles.getStyle(this.props);
    this.render();
  };
  
  // Static method to create web search tool with specific configuration
  static create(props: WebSearchToolProps): WebSearchTool {
    return new WebSearchTool(props);
  }
  
  // Utility methods
  getCurrentQuery(): string {
    return this.currentQuery;
  }
  
  getCurrentEngine(): SearchEngine {
    return this.currentEngine;
  }
  
  getCurrentFilters(): SearchFilters {
    return { ...this.currentFilters };
  }
  
  getResults(): SearchResult[] {
    return [...this.results];
  }
  
  getSearchHistory(): any[] {
    return [...this.searchHistory];
  }
  
  isSearchingState(): boolean {
    return this.isSearching;
  }
}