import { WebSearchToolProps, SearchQuery, SearchResult, SearchHistory, SearchStats, SearchFilter, WebSearchToolEvents, WebSearchToolMethods, SearchEngine, SearchResultType } from './WebSearchTool.types';
import { generateWebSearchToolStyles, getWebSearchToolVariantClass, getWebSearchToolStateClass, getEngineClass, getResultTypeClass } from './WebSearchTool.styles';

export class WebSearchTool implements WebSearchToolMethods {
  private props: WebSearchToolProps;
  private element: HTMLElement | null = null;
  private events: WebSearchToolEvents;
  private currentQuery: string = '';
  private currentEngine: SearchEngine;
  private currentType: SearchResultType;
  private currentFilter: SearchFilter = {};
  private searchCache: Map<string, SearchResult[]> = new Map();
  private searchTimeout: number | null = null;

  constructor(props: Partial<WebSearchToolProps> = {}) {
    this.props = {
      variant: 'default',
      state: 'default',
      defaultEngine: 'google',
      defaultType: 'webpage',
      searchHistory: [],
      currentResults: [],
      showFilters: true,
      showHistory: true,
      showStats: false,
      showResults: true,
      showEngines: true,
      showTypes: true,
      maxHistoryItems: 50,
      maxResultsPerPage: 10,
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
      search: props.onSearch || (() => {}),
      resultClick: props.onResultClick || (() => {}),
      engineChange: props.onEngineChange || (() => {}),
      typeChange: props.onTypeChange || (() => {}),
      filterChange: props.onFilterChange || (() => {}),
      historyItemClick: props.onHistoryItemClick || (() => {}),
      historyClear: props.onHistoryClear || (() => {}),
      statsUpdate: props.onStatsUpdate || (() => {}),
      export: () => {},
      refresh: () => {}
    };

    this.currentEngine = this.props.defaultEngine;
    this.currentType = this.props.defaultType;

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
    this.element.className = `websearchtool-container ${getWebSearchToolVariantClass(this.props.variant)} ${getWebSearchToolStateClass(this.props.state)}`;
    this.element.setAttribute('data-websearchtool-id', this.generateId());
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
    
    if (target.classList.contains('websearchtool-action')) {
      const actionId = target.getAttribute('data-action-id');
      if (actionId) {
        this.handleAction(actionId);
      }
    } else if (target.classList.contains('websearchtool-search-button')) {
      this.performSearch();
    } else if (target.classList.contains('websearchtool-result')) {
      const resultId = target.getAttribute('data-result-id');
      if (resultId) {
        this.handleResultClick(resultId);
      }
    } else if (target.classList.contains('websearchtool-history-item')) {
      const historyId = target.getAttribute('data-history-id');
      if (historyId) {
        this.handleHistoryItemClick(historyId);
      }
    } else if (target.classList.contains('websearchtool-search-select')) {
      this.handleSearchOptionChange(target as HTMLSelectElement);
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        if (event.target?.classList.contains('websearchtool-search-input')) {
          event.preventDefault();
          this.performSearch();
        }
        break;
      case 'Escape':
        this.clearSearch();
        break;
      case 'h':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.toggleHistory();
        }
        break;
      case 'f':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.focusSearch();
        }
        break;
    }
  }

  private handleAction(actionId: string): void {
    switch (actionId) {
      case 'refresh':
        this.refreshStats();
        break;
      case 'export':
        this.exportResults('json');
        break;
      case 'clear-history':
        this.clearHistory();
        break;
      case 'toggle-filters':
        this.props.showFilters = !this.props.showFilters;
        this.render();
        break;
      case 'toggle-history':
        this.toggleHistory();
        break;
      case 'toggle-stats':
        this.props.showStats = !this.props.showStats;
        this.render();
        break;
    }
  }

  private handleResultClick(resultId: string): void {
    const result = this.props.currentResults.find(r => r.id === resultId);
    if (result) {
      this.events.resultClick(result);
      // Track click for analytics
      this.trackClick(result);
    }
  }

  private handleHistoryItemClick(historyId: string): void {
    const historyItem = this.props.searchHistory.find(h => h.id === historyId);
    if (historyItem) {
      this.events.historyItemClick(historyItem);
      // Restore search from history
      this.currentQuery = historyItem.query;
      this.currentEngine = historyItem.engine;
      this.props.currentResults = historyItem.results;
      this.render();
    }
  }

  private handleSearchOptionChange(select: HTMLSelectElement): void {
    const optionType = select.getAttribute('data-option-type');
    const value = select.value;
    
    switch (optionType) {
      case 'engine':
        this.setEngine(value as SearchEngine);
        break;
      case 'type':
        this.setType(value as SearchResultType);
        break;
    }
  }

  private focusSearch(): void {
    const searchInput = this.element?.querySelector('.websearchtool-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  private toggleHistory(): void {
    this.props.showHistory = !this.props.showHistory;
    this.render();
  }

  private clearSearch(): void {
    this.currentQuery = '';
    this.props.currentResults = [];
    this.render();
  }

  private generateId(): string {
    return `websearchtool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

    const styles = generateWebSearchToolStyles(styleConfig);
    
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

    const { variant, state, showFilters, showHistory, showStats, showResults, showEngines, showTypes } = this.props;
    
    this.element.className = `websearchtool-container ${getWebSearchToolVariantClass(variant)} ${getWebSearchToolStateClass(state)}`;
    
    this.element.innerHTML = `
      <div class="websearchtool-header">
        <div class="websearchtool-title">
          <span>Web Search Tool</span>
          <span class="websearchtool-status">${state}</span>
        </div>
        <div class="websearchtool-actions">
          <button class="websearchtool-action" data-action-id="refresh" title="Refresh Stats">🔄</button>
          <button class="websearchtool-action" data-action-id="export" title="Export Results">📊</button>
          ${showFilters ? `<button class="websearchtool-action" data-action-id="toggle-filters" title="Toggle Filters">🔍</button>` : ''}
          ${showHistory ? `<button class="websearchtool-action" data-action-id="toggle-history" title="Toggle History (Ctrl+H)">📚</button>` : ''}
          ${showStats ? `<button class="websearchtool-action" data-action-id="toggle-stats" title="Toggle Stats">📈</button>` : ''}
        </div>
      </div>
      
      ${this.renderSearchBar()}
      ${showFilters ? this.renderFilters() : ''}
      
      <div class="websearchtool-content">
        ${showResults ? this.renderResults() : ''}
      </div>
      
      ${showHistory ? this.renderHistory() : ''}
      ${showStats ? this.renderStats() : ''}
      
      <div class="websearchtool-footer">
        <div class="websearchtool-footer-info">
          <div class="websearchtool-footer-info-item">
            <span>🔍</span>
            <span>${this.props.currentResults.length} results</span>
          </div>
          <div class="websearchtool-footer-info-item">
            <span>🌐</span>
            <span>${this.currentEngine}</span>
          </div>
          <div class="websearchtool-footer-info-item">
            <span>📚</span>
            <span>${this.props.searchHistory.length} searches</span>
          </div>
        </div>
        <div class="websearchtool-footer-actions">
          <span>Press F to search, H for history</span>
        </div>
      </div>
    `;
  }

  private renderSearchBar(): string {
    const engines = ['google', 'bing', 'duckduckgo', 'yahoo', 'brave'];
    const types = ['webpage', 'news', 'image', 'video', 'academic'];
    
    return `
      <div class="websearchtool-search">
        <div class="websearchtool-search-bar">
          <input 
            type="text" 
            class="websearchtool-search-input" 
            placeholder="Search the web..." 
            value="${this.currentQuery}"
          />
          <button class="websearchtool-search-button">Search</button>
        </div>
        <div class="websearchtool-search-options">
          ${showEngines ? `
            <select class="websearchtool-search-select" data-option-type="engine">
              ${engines.map(engine => `
                <option value="${engine}" ${this.currentEngine === engine ? 'selected' : ''}>${engine}</option>
              `).join('')}
            </select>
          ` : ''}
          ${showTypes ? `
            <select class="websearchtool-search-select" data-option-type="type">
              ${types.map(type => `
                <option value="${type}" ${this.currentType === type ? 'selected' : ''}>${type}</option>
              `).join('')}
            </select>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderFilters(): string {
    if (!this.props.showFilters) return '';
    
    return `
      <div class="websearchtool-filters">
        <div class="websearchtool-filters-title">Search Filters</div>
        <div class="websearchtool-filters-grid">
          <div class="websearchtool-filter">
            <div class="websearchtool-filter-label">Date Range</div>
            <select class="websearchtool-filter-select">
              <option value="">Any time</option>
              <option value="day">Past 24 hours</option>
              <option value="week">Past week</option>
              <option value="month">Past month</option>
              <option value="year">Past year</option>
            </select>
          </div>
          <div class="websearchtool-filter">
            <div class="websearchtool-filter-label">Language</div>
            <select class="websearchtool-filter-select">
              <option value="">Any language</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>
          <div class="websearchtool-filter">
            <div class="websearchtool-filter-label">Safe Search</div>
            <div class="websearchtool-filter-checkbox">
              <input type="checkbox" id="safe-search" />
              <label for="safe-search">Enable safe search</label>
            </div>
          </div>
          <div class="websearchtool-filter">
            <div class="websearchtool-filter-label">Exact Phrase</div>
            <div class="websearchtool-filter-checkbox">
              <input type="checkbox" id="exact-phrase" />
              <label for="exact-phrase">Search exact phrase</label>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderResults(): string {
    if (this.props.currentResults.length === 0) {
      return '<div class="websearchtool-empty">No search results. Enter a query to search.</div>';
    }
    
    return `
      <div class="websearchtool-results">
        ${this.props.currentResults.map(result => `
          <div class="websearchtool-result ${getResultTypeClass(result.type)}" data-result-id="${result.id}">
            <div class="websearchtool-result-score">${result.relevanceScore.toFixed(1)}</div>
            <div class="websearchtool-result-header">
              <div class="websearchtool-result-title">${result.title}</div>
              <div class="websearchtool-result-type ${getResultTypeClass(result.type)}">${result.type}</div>
            </div>
            <div class="websearchtool-result-description">${result.description}</div>
            <div class="websearchtool-result-snippet">${result.snippet}</div>
            <div class="websearchtool-result-meta">
              <span class="websearchtool-result-domain">${result.domain}</span>
              ${result.publishedDate ? `<span class="websearchtool-result-date">${this.formatDate(result.publishedDate)}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderHistory(): string {
    if (!this.props.showHistory || this.props.searchHistory.length === 0) {
      return '';
    }
    
    return `
      <div class="websearchtool-history">
        <div class="websearchtool-history-title">Search History</div>
        <div class="websearchtool-history-list">
          ${this.props.searchHistory.slice(0, 10).map(historyItem => `
            <div class="websearchtool-history-item" data-history-id="${historyItem.id}">
              <div class="websearchtool-history-query">${historyItem.query}</div>
              <div class="websearchtool-history-meta">
                <span class="websearchtool-history-engine ${getEngineClass(historyItem.engine)}">${historyItem.engine}</span>
                <span class="websearchtool-history-date">${this.formatDate(historyItem.timestamp)}</span>
                <span class="websearchtool-history-count">${historyItem.resultCount} results</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private renderStats(): string {
    if (!this.props.showStats || !this.props.stats) {
      return '';
    }
    
    const { totalQueries, totalResults, averageResultsPerQuery, mostUsedEngine, successRate, averageResponseTime } = this.props.stats;
    
    return `
      <div class="websearchtool-stats">
        <div class="websearchtool-stats-title">Search Statistics</div>
        <div class="websearchtool-stats-grid">
          <div class="websearchtool-stat">
            <div class="websearchtool-stat-value">${totalQueries}</div>
            <div class="websearchtool-stat-label">Total Queries</div>
          </div>
          <div class="websearchtool-stat">
            <div class="websearchtool-stat-value">${totalResults}</div>
            <div class="websearchtool-stat-label">Total Results</div>
          </div>
          <div class="websearchtool-stat">
            <div class="websearchtool-stat-value">${averageResultsPerQuery.toFixed(1)}</div>
            <div class="websearchtool-stat-label">Avg Results</div>
          </div>
          <div class="websearchtool-stat">
            <div class="websearchtool-stat-value">${mostUsedEngine}</div>
            <div class="websearchtool-stat-label">Top Engine</div>
          </div>
          <div class="websearchtool-stat">
            <div class="websearchtool-stat-value">${(successRate * 100).toFixed(1)}%</div>
            <div class="websearchtool-stat-label">Success Rate</div>
          </div>
          <div class="websearchtool-stat">
            <div class="websearchtool-stat-value">${averageResponseTime.toFixed(0)}ms</div>
            <div class="websearchtool-stat-label">Avg Response</div>
          </div>
        </div>
      </div>
    `;
  }

  private formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  private setState(newState: string): void {
    if (this.props.state !== newState) {
      this.props.state = newState as any;
      this.updateStyles();
      this.render();
    }
  }

  private async performSearch(): Promise<void> {
    const searchInput = this.element?.querySelector('.websearchtool-search-input') as HTMLInputElement;
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    this.currentQuery = query;
    this.setState('loading');
    
    try {
      const results = await this.search(query, {
        engine: this.currentEngine,
        type: this.currentType,
        numResults: this.props.maxResultsPerPage
      });
      
      this.props.currentResults = results;
      this.addToHistory(query, results);
      this.setState('success');
      this.events.search({
        query,
        engine: this.currentEngine,
        type: this.currentType,
        language: 'en',
        region: 'us',
        safeSearch: true,
        numResults: this.props.maxResultsPerPage,
        startIndex: 0,
        filters: this.currentFilter,
        customParams: {}
      });
    } catch (error) {
      this.setState('error');
      console.error('Search error:', error);
    }
  }

  private trackClick(result: SearchResult): void {
    // Track click for analytics
    if (this.props.stats) {
      // Update click tracking in stats
      this.events.statsUpdate(this.props.stats);
    }
  }

  // Public Methods
  public async search(query: string, options: Partial<SearchQuery> = {}): Promise<SearchResult[]> {
    const cacheKey = `${query}-${options.engine || this.currentEngine}-${options.type || this.currentType}`;
    
    // Check cache first
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)!;
    }
    
    // Simulate API call with mock data
    const mockResults: SearchResult[] = this.generateMockResults(query, options);
    
    // Cache results
    this.searchCache.set(cacheKey, mockResults);
    
    return mockResults;
  }

  private generateMockResults(query: string, options: Partial<SearchQuery>): SearchResult[] {
    const results: SearchResult[] = [];
    const domains = ['example.com', 'wikipedia.org', 'github.com', 'stackoverflow.com', 'medium.com'];
    const types: SearchResultType[] = ['webpage', 'news', 'academic', 'social'];
    
    for (let i = 0; i < (options.numResults || 10); i++) {
      const domain = domains[i % domains.length];
      const type = types[i % types.length];
      
      results.push({
        id: `result-${Date.now()}-${i}`,
        title: `${query} - Result ${i + 1}`,
        url: `https://${domain}/${query.replace(/\s+/g, '-').toLowerCase()}-${i + 1}`,
        description: `This is a mock search result for "${query}". It contains relevant information about the topic.`,
        snippet: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${query} is an important topic that requires detailed analysis and understanding.`,
        type,
        source: options.engine || this.currentEngine,
        publishedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        author: `Author ${i + 1}`,
        domain,
        language: 'en',
        relevanceScore: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
        metadata: {
          wordCount: Math.floor(Math.random() * 1000) + 100,
          readingTime: Math.floor(Math.random() * 10) + 2
        }
      });
    }
    
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  public getResults(): SearchResult[] {
    return [...this.props.currentResults];
  }

  public getHistory(): SearchHistory[] {
    return [...this.props.searchHistory];
  }

  public getStats(): SearchStats {
    return this.props.stats || {
      totalQueries: 0,
      totalResults: 0,
      averageResultsPerQuery: 0,
      mostUsedEngine: 'google',
      mostUsedType: 'webpage',
      searchFrequency: {},
      successRate: 0,
      averageResponseTime: 0
    };
  }

  public clearHistory(): void {
    this.props.searchHistory = [];
    this.events.historyClear();
    this.render();
  }

  public setEngine(engine: SearchEngine): void {
    this.currentEngine = engine;
    this.events.engineChange(engine);
    this.render();
  }

  public getEngine(): SearchEngine {
    return this.currentEngine;
  }

  public setType(type: SearchResultType): void {
    this.currentType = type;
    this.events.typeChange(type);
    this.render();
  }

  public getType(): SearchResultType {
    return this.currentType;
  }

  public setFilter(filter: SearchFilter): void {
    this.currentFilter = { ...filter };
    this.events.filterChange(this.currentFilter);
    this.render();
  }

  public getFilter(): SearchFilter {
    return { ...this.currentFilter };
  }

  public clearFilter(): void {
    this.currentFilter = {};
    this.events.filterChange(this.currentFilter);
    this.render();
  }

  public exportResults(format: 'json' | 'csv' | 'txt'): string {
    const data = this.props.currentResults;
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertResultsToCSV(data);
      case 'txt':
        return this.convertResultsToText(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  private convertResultsToCSV(results: SearchResult[]): string {
    const headers = ['Title', 'URL', 'Description', 'Type', 'Domain', 'Relevance Score', 'Published Date'];
    const rows = results.map(result => [
      result.title,
      result.url,
      result.description,
      result.type,
      result.domain,
      result.relevanceScore.toString(),
      result.publishedDate?.toISOString() || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertResultsToText(results: SearchResult[]): string {
    return results.map(result => `
${result.title}
URL: ${result.url}
Type: ${result.type}
Domain: ${result.domain}
Relevance: ${result.relevanceScore.toFixed(2)}
Description: ${result.description}
Snippet: ${result.snippet}
${result.publishedDate ? `Published: ${result.publishedDate.toLocaleDateString()}` : ''}
    `).join('\n');
  }

  public exportHistory(format: 'json' | 'csv' | 'txt'): string {
    const data = this.props.searchHistory;
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertHistoryToCSV(data);
      case 'txt':
        return this.convertHistoryToText(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  private convertHistoryToCSV(history: SearchHistory[]): string {
    const headers = ['Query', 'Engine', 'Timestamp', 'Result Count'];
    const rows = history.map(item => [
      item.query,
      item.engine,
      item.timestamp.toISOString(),
      item.resultCount.toString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertHistoryToText(history: SearchHistory[]): string {
    return history.map(item => `
Query: ${item.query}
Engine: ${item.engine}
Date: ${item.timestamp.toLocaleString()}
Results: ${item.resultCount}
    `).join('\n');
  }

  public refreshStats(): void {
    this.events.refresh();
    this.render();
  }

  public addToHistory(query: string, results: SearchResult[]): void {
    const historyItem: SearchHistory = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      query,
      engine: this.currentEngine,
      timestamp: new Date(),
      resultCount: results.length,
      results
    };
    
    this.props.searchHistory.unshift(historyItem);
    
    // Keep only max history items
    if (this.props.searchHistory.length > this.props.maxHistoryItems) {
      this.props.searchHistory = this.props.searchHistory.slice(0, this.props.maxHistoryItems);
    }
    
    this.render();
  }

  public removeFromHistory(historyId: string): void {
    this.props.searchHistory = this.props.searchHistory.filter(h => h.id !== historyId);
    this.render();
  }

  public getResultById(resultId: string): SearchResult | null {
    return this.props.currentResults.find(r => r.id === resultId) || null;
  }

  public getResultsByType(type: SearchResultType): SearchResult[] {
    return this.props.currentResults.filter(r => r.type === type);
  }

  public getResultsByDomain(domain: string): SearchResult[] {
    return this.props.currentResults.filter(r => r.domain === domain);
  }

  public sortResults(criteria: string, order: 'asc' | 'desc'): SearchResult[] {
    const sorted = [...this.props.currentResults].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (criteria) {
        case 'relevance':
          aValue = a.relevanceScore;
          bValue = b.relevanceScore;
          break;
        case 'date':
          aValue = a.publishedDate?.getTime() || 0;
          bValue = b.publishedDate?.getTime() || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'domain':
          aValue = a.domain.toLowerCase();
          bValue = b.domain.toLowerCase();
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

  public filterResults(filter: SearchFilter): SearchResult[] {
    return this.props.currentResults.filter(result => {
      if (filter.domain && !filter.domain.includes(result.domain)) {
        return false;
      }
      if (filter.excludeDomain && filter.excludeDomain.includes(result.domain)) {
        return false;
      }
      if (filter.language && !filter.language.includes(result.language)) {
        return false;
      }
      if (filter.dateRange && result.publishedDate) {
        if (result.publishedDate < filter.dateRange.start || result.publishedDate > filter.dateRange.end) {
          return false;
        }
      }
      return true;
    });
  }

  public getSearchSuggestions(query: string): string[] {
    // Simple mock suggestions based on query
    const suggestions = [
      `${query} tutorial`,
      `${query} examples`,
      `${query} documentation`,
      `${query} best practices`,
      `${query} guide`
    ];
    
    return suggestions.slice(0, 5);
  }

  public validateQuery(query: string): boolean {
    return query.trim().length > 0 && query.trim().length <= 1000;
  }

  public getQueryStats(query: string): {
    frequency: number;
    lastUsed: Date;
    averageResults: number;
    successRate: number;
  } {
    const historyItems = this.props.searchHistory.filter(h => h.query.toLowerCase() === query.toLowerCase());
    
    return {
      frequency: historyItems.length,
      lastUsed: historyItems.length > 0 ? historyItems[0].timestamp : new Date(0),
      averageResults: historyItems.length > 0 ? historyItems.reduce((sum, h) => sum + h.resultCount, 0) / historyItems.length : 0,
      successRate: historyItems.length > 0 ? 1.0 : 0.0
    };
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

  public updateProps(newProps: Partial<WebSearchToolProps>): void {
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