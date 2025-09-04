import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../../core/src/components/BaseComponent';
import { AgentLogsProps, AgentLogsVariants, AgentLogsSizes, AgentLogsStates, AgentLogsDisplayMode, AgentLogsFilterLevel, AgentLogsSortBy, AgentLogsTimeRange, AgentLogsEvent, AgentLogsFilter, AgentLogsSearchResult, AgentLogsStats, AgentLogsConfig, AgentLogsExport } from './AgentLogs.types';
import { AgentLogsStyles } from './AgentLogs.styles';
import { validateComponent, ValidationResult } from '../../../../core/src/validation/component-validator';

export class AgentLogs implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: AgentLogsProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private searchElement?: Widgets.TextInputElement;
  private contentElement?: Widgets.BoxElement;
  private filterElement?: Widgets.BoxElement;
  private statsElement?: Widgets.BoxElement;
  private controlElement?: Widgets.BoxElement;
  private filteredLogs: any[] = [];
  private currentFilter: AgentLogsFilter = {};
  private currentSearchQuery: string = '';
  private selectedLogId?: string;
  private refreshTimer?: NodeJS.Timeout;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(props: AgentLogsProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('AgentLogs', props);
    
    if (!this.validationResult.success) {
      console.error('❌ AgentLogs validation failed:', this.validationResult.errors);
      throw new Error(`AgentLogs validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ AgentLogs warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: AgentLogsStyles.getContainerStyle(
        this.props.variant,
        this.props.size,
        this.props.state,
        this.props.displayMode || 'list',
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
    
    if (this.props.searchable) {
      this.createSearch();
    }
    
    this.createContent();
    
    if (this.props.filterable) {
      this.createFilter();
    }
    
    this.createStats();
    this.createControls();
  }

  private createHeader(): void {
    this.headerElement = this.el.children[0] as Widgets.BoxElement || this.el;
    
    const headerStyle = AgentLogsStyles.getHeaderStyle(
      this.props.variant,
      this.props.size,
      this.theme
    );

    this.headerElement.style = headerStyle;
  }

  private createSearch(): void {
    if (!this.headerElement) return;

    this.searchElement = this.headerElement.children[0] as Widgets.TextInputElement;
    if (!this.searchElement) {
      this.searchElement = this.headerElement as any;
    }

    const searchStyle = AgentLogsStyles.getSearchStyle(this.props.variant, this.theme);
    this.searchElement.style = searchStyle;
  }

  private createContent(): void {
    this.contentElement = this.el.children[1] as Widgets.BoxElement || this.el;
    
    const contentStyle = this.getContentStyle();
    this.contentElement.style = contentStyle;
  }

  private createFilter(): void {
    this.filterElement = this.el.children[2] as Widgets.BoxElement;
    if (!this.filterElement) {
      this.filterElement = this.el;
    }

    const filterStyle = AgentLogsStyles.getFilterStyle(this.props.variant, this.theme);
    this.filterElement.style = filterStyle;
  }

  private createStats(): void {
    this.statsElement = this.el.children[3] as Widgets.BoxElement;
    if (!this.statsElement) {
      this.statsElement = this.el;
    }

    const statsStyle = AgentLogsStyles.getStatsStyle(this.props.variant, this.theme);
    this.statsElement.style = statsStyle;
  }

  private createControls(): void {
    this.controlElement = this.el.children[4] as Widgets.BoxElement;
    if (!this.controlElement) {
      this.controlElement = this.el;
    }

    const controlStyle = AgentLogsStyles.getControlStyle(this.props.variant, this.props.state, this.theme);
    this.controlElement.style = controlStyle;
  }

  private getContentStyle(): any {
    const displayMode = this.props.displayMode || 'list';
    
    switch (displayMode) {
      case 'list':
        return AgentLogsStyles.getListStyle(this.props.variant, this.props.size, this.theme);
      case 'table':
        return AgentLogsStyles.getTableStyle(this.props.variant, this.theme);
      case 'compact':
        return AgentLogsStyles.getCompactStyle(this.props.variant, this.theme);
      case 'detailed':
        return AgentLogsStyles.getDetailedStyle(this.props.variant, this.theme);
      case 'timeline':
        return AgentLogsStyles.getTimelineStyle(this.props.variant, this.theme);
      default:
        return AgentLogsStyles.getListStyle(this.props.variant, this.props.size, this.theme);
    }
  }

  private updateDisplay(): void {
    this.updateHeader();
    this.updateContent();
    this.updateFilter();
    this.updateStats();
    this.updateControls();
  }

  private updateHeader(): void {
    if (!this.headerElement) return;

    const title = `Logs${this.props.agentName ? ` - ${this.props.agentName}` : ''} (${this.filteredLogs.length}/${this.props.logs.length})`;
    this.headerElement.setContent(title);
  }

  private updateContent(): void {
    if (!this.contentElement) return;

    this.filterAndSortLogs();
    
    if (this.filteredLogs.length === 0) {
      this.showEmptyState();
      return;
    }

    const content = this.renderLogs();
    this.contentElement.setContent(content);
    
    if (this.props.autoScroll) {
      this.contentElement.setScrollPerc(100);
    }
  }

  private filterAndSortLogs(): void {
    let filtered = [...this.props.logs];

    // Apply level filter
    if (this.currentFilter.level && this.currentFilter.level !== 'all') {
      filtered = filtered.filter(log => log.level === this.currentFilter.level);
    }

    // Apply agent ID filter
    if (this.currentFilter.agentId) {
      filtered = filtered.filter(log => log.agentId === this.currentFilter.agentId);
    }

    // Apply message filter
    if (this.currentFilter.message) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(this.currentFilter.message!.toLowerCase())
      );
    }

    // Apply time range filter
    if (this.currentFilter.timeRange && this.currentFilter.timeRange !== 'all') {
      const now = new Date();
      const timeRange = this.currentFilter.timeRange;
      let cutoffTime: Date;

      switch (timeRange) {
        case '1h':
          cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '6h':
          cutoffTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
          break;
        case '24h':
          cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffTime = new Date(0);
      }

      filtered = filtered.filter(log => log.timestamp >= cutoffTime);
    }

    // Apply search query
    if (this.currentSearchQuery) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(this.currentSearchQuery.toLowerCase()) ||
        log.level.toLowerCase().includes(this.currentSearchQuery.toLowerCase()) ||
        log.agentId.toLowerCase().includes(this.currentSearchQuery.toLowerCase())
      );
    }

    // Apply custom filter
    if (this.currentFilter.custom) {
      filtered = filtered.filter(this.currentFilter.custom);
    }

    // Apply sorting
    const sortBy = this.props.sortBy || 'timestamp';
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'level':
          return a.level.localeCompare(b.level);
        case 'message':
          return a.message.localeCompare(b.message);
        case 'agentId':
          return a.agentId.localeCompare(b.agentId);
        default:
          return 0;
      }
    });

    // Apply max logs limit
    if (this.props.maxLogs && filtered.length > this.props.maxLogs) {
      filtered = filtered.slice(0, this.props.maxLogs);
    }

    this.filteredLogs = filtered;
  }

  private renderLogs(): string {
    const displayMode = this.props.displayMode || 'list';
    
    switch (displayMode) {
      case 'list':
        return this.renderListView();
      case 'table':
        return this.renderTableView();
      case 'compact':
        return this.renderCompactView();
      case 'detailed':
        return this.renderDetailedView();
      case 'timeline':
        return this.renderTimelineView();
      default:
        return this.renderListView();
    }
  }

  private renderListView(): string {
    return this.filteredLogs.map(log => {
      const isSelected = this.selectedLogId === log.id;
      const levelIcon = this.getLevelIcon(log.level);
      const timestamp = this.props.showTimestamp ? 
        `[${log.timestamp.toLocaleTimeString()}] ` : '';
      const agentId = this.props.showAgentId ? 
        `[${log.agentId}] ` : '';
      const level = this.props.showLevel ? 
        `[${log.level.toUpperCase()}] ` : '';
      
      return `${isSelected ? '► ' : '  '}${timestamp}${agentId}${level}${levelIcon} ${log.message}`;
    }).join('\n');
  }

  private renderTableView(): string {
    const headers = [];
    if (this.props.showTimestamp) headers.push('Timestamp');
    if (this.props.showAgentId) headers.push('Agent ID');
    if (this.props.showLevel) headers.push('Level');
    headers.push('Message');

    const headerRow = `┌${headers.map(h => '─'.repeat(15)).join('┬')}┐\n│${headers.map(h => h.padEnd(15)).join('│')}│\n├${headers.map(h => '─'.repeat(15)).join('┼')}┤`;
    
    const rows = this.filteredLogs.map(log => {
      const cells = [];
      if (this.props.showTimestamp) cells.push(log.timestamp.toLocaleTimeString());
      if (this.props.showAgentId) cells.push(log.agentId);
      if (this.props.showLevel) cells.push(log.level.toUpperCase());
      cells.push(log.message);
      
      return `│${cells.map(c => c.padEnd(15)).join('│')}│`;
    });

    const footer = `└${headers.map(h => '─'.repeat(15)).join('┴')}┘`;
    
    return [headerRow, ...rows, footer].join('\n');
  }

  private renderCompactView(): string {
    return this.filteredLogs.map(log => {
      const isSelected = this.selectedLogId === log.id;
      const levelIcon = this.getLevelIcon(log.level);
      const timestamp = this.props.showTimestamp ? 
        log.timestamp.toLocaleTimeString() : '';
      
      return `${isSelected ? '►' : ' '}${levelIcon}${timestamp} ${log.message}`;
    }).join(' ');
  }

  private renderDetailedView(): string {
    return this.filteredLogs.map(log => {
      const isSelected = this.selectedLogId === log.id;
      const levelIcon = this.getLevelIcon(log.level);
      const timestamp = this.props.showTimestamp ? 
        `[${log.timestamp.toLocaleString()}]` : '';
      const agentId = this.props.showAgentId ? 
        `[${log.agentId}]` : '';
      const level = this.props.showLevel ? 
        `[${log.level.toUpperCase()}]` : '';
      const data = this.props.showData && log.data ? 
        `\n  Data: ${JSON.stringify(log.data)}` : '';
      
      return `${isSelected ? '► ' : '  '}${timestamp} ${agentId} ${level} ${levelIcon}\n  ${log.message}${data}`;
    }).join('\n\n');
  }

  private renderTimelineView(): string {
    return this.filteredLogs.map(log => {
      const isSelected = this.selectedLogId === log.id;
      const levelIcon = this.getLevelIcon(log.level);
      const timestamp = log.timestamp.toLocaleTimeString();
      const timeLine = '│';
      const level = this.props.showLevel ? 
        `[${log.level.toUpperCase()}]` : '';
      
      return `${isSelected ? '►' : ' '}${timestamp} ${timeLine} ${levelIcon} ${level} ${log.message}`;
    }).join('\n');
  }

  private getLevelIcon(level: string): string {
    const icons = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    };
    return icons[level as keyof typeof icons] || 'ℹ️';
  }

  private showEmptyState(): void {
    if (!this.contentElement) return;

    const message = this.currentSearchQuery ? 
      `No logs found for "${this.currentSearchQuery}"` : 
      'No logs available';
    
    this.contentElement.setContent(message);
  }

  private updateFilter(): void {
    if (!this.filterElement || !this.props.filterable) return;

    const filterText = [
      `Level: ${this.currentFilter.level || 'all'}`,
      `Agent: ${this.currentFilter.agentId || 'all'}`,
      `Time: ${this.currentFilter.timeRange || 'all'}`,
      `Search: ${this.currentSearchQuery || 'none'}`
    ].join(' | ');

    this.filterElement.setContent(filterText);
  }

  private updateStats(): void {
    if (!this.statsElement) return;

    const stats = this.getStats();
    const statsText = `Total: ${stats.totalLogs} | Filtered: ${this.filteredLogs.length} | Debug: ${stats.logsByLevel.debug || 0} | Info: ${stats.logsByLevel.info || 0} | Warn: ${stats.logsByLevel.warn || 0} | Error: ${stats.logsByLevel.error || 0}`;
    this.statsElement.setContent(statsText);
  }

  private updateControls(): void {
    if (!this.controlElement) return;

    const controls = [
      `Mode: ${this.props.displayMode}`,
      `Sort: ${this.props.sortBy}`,
      `Follow: ${this.props.followMode ? 'ON' : 'OFF'}`,
      `Auto: ${this.props.autoScroll ? 'ON' : 'OFF'}`
    ].join(' | ');

    this.controlElement.setContent(controls);
  }

  private getStats(): AgentLogsStats {
    const totalLogs = this.props.logs.length;
    const logsByLevel = this.props.logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const logsByAgent = this.props.logs.reduce((acc, log) => {
      acc[log.agentId] = (acc[log.agentId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const lastLogTime = this.props.logs.length > 0 ? 
      this.props.logs[this.props.logs.length - 1].timestamp : undefined;
    
    const oldestLogTime = this.props.logs.length > 0 ? 
      this.props.logs[0].timestamp : undefined;
    
    const averageLogsPerMinute = totalLogs > 0 ? 
      totalLogs / Math.max(1, (Date.now() - (oldestLogTime?.getTime() || Date.now())) / (1000 * 60)) : 0;

    return {
      totalLogs,
      logsByLevel,
      logsByAgent,
      averageLogsPerMinute,
      lastLogTime,
      oldestLogTime,
    };
  }

  private setupEventListeners(): void {
    if (this.props.keys) {
      this.el.key(['up', 'k'], () => this.navigateUp());
      this.el.key(['down', 'j'], () => this.navigateDown());
      this.el.key(['enter', 'space'], () => this.selectCurrent());
      this.el.key(['d', 'D'], () => this.cycleDisplayMode());
      this.el.key(['f', 'F'], () => this.cycleFilterLevel());
      this.el.key(['s', 'S'], () => this.cycleSort());
      this.el.key(['t', 'T'], () => this.cycleTimeRange());
      this.el.key(['r', 'R'], () => this.refresh());
      this.el.key(['escape'], () => this.clearSelection());
    }

    if (this.props.mouse) {
      this.el.on('click', () => this.el.focus());
    }

    if (this.searchElement) {
      this.searchElement.on('submit', (value: string) => {
        this.currentSearchQuery = value;
        this.emitEvent('log_search', { query: value, results: this.filteredLogs });
        this.props.onLogSearch?.(value, this.filteredLogs);
        this.updateDisplay();
      });
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
    const event: AgentLogsEvent = {
      type: type as any,
      data,
      timestamp: new Date()
    };

    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(event));
  }

  // Navigation methods
  private navigateUp(): void {
    // Implementation for navigating up in the list
    this.updateDisplay();
  }

  private navigateDown(): void {
    // Implementation for navigating down in the list
    this.updateDisplay();
  }

  private selectCurrent(): void {
    // Implementation for selecting current log
    this.updateDisplay();
  }

  private cycleDisplayMode(): void {
    const displayModes: AgentLogsDisplayMode[] = ['list', 'table', 'compact', 'detailed', 'timeline'];
    const currentIndex = displayModes.indexOf(this.props.displayMode || 'list');
    const nextIndex = (currentIndex + 1) % displayModes.length;
    this.props.displayMode = displayModes[nextIndex];
    
    this.emitEvent('display_mode_change', this.props.displayMode);
    this.props.onDisplayModeChange?.(this.props.displayMode);
    this.updateDisplay();
  }

  private cycleFilterLevel(): void {
    const filterLevels: AgentLogsFilterLevel[] = ['all', 'debug', 'info', 'warn', 'error'];
    const currentIndex = filterLevels.indexOf(this.currentFilter.level || 'all');
    const nextIndex = (currentIndex + 1) % filterLevels.length;
    this.currentFilter.level = filterLevels[nextIndex];
    
    this.emitEvent('log_filter', this.currentFilter);
    this.props.onLogFilter?.(this.currentFilter);
    this.updateDisplay();
  }

  private cycleSort(): void {
    const sortOptions: AgentLogsSortBy[] = ['timestamp', 'level', 'message', 'agentId'];
    const currentIndex = sortOptions.indexOf(this.props.sortBy || 'timestamp');
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    this.props.sortBy = sortOptions[nextIndex];
    
    this.updateDisplay();
  }

  private cycleTimeRange(): void {
    const timeRanges: AgentLogsTimeRange[] = ['1h', '6h', '24h', '7d', '30d', 'all'];
    const currentIndex = timeRanges.indexOf(this.currentFilter.timeRange || 'all');
    const nextIndex = (currentIndex + 1) % timeRanges.length;
    this.currentFilter.timeRange = timeRanges[nextIndex];
    
    this.emitEvent('time_range_change', this.currentFilter.timeRange);
    this.props.onTimeRangeChange?.(this.currentFilter.timeRange);
    this.updateDisplay();
  }

  private refresh(): void {
    this.emitEvent('log_add', { timestamp: new Date() });
    this.updateDisplay();
  }

  private clearSelection(): void {
    this.selectedLogId = undefined;
    this.updateDisplay();
  }

  // Public methods
  setVariant(variant: AgentLogsVariants): void {
    this.props.variant = variant;
    this.updateDisplay();
  }

  setSize(size: AgentLogsSizes): void {
    this.props.size = size;
    this.updateDisplay();
  }

  setState(state: AgentLogsStates): void {
    this.props.state = state;
    this.updateDisplay();
  }

  getConfig(): any {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      displayMode: this.props.displayMode,
      filterLevel: this.currentFilter.level,
      sortBy: this.props.sortBy,
      timeRange: this.currentFilter.timeRange,
      stats: this.getStats(),
    };
  }

  update(props: Partial<AgentLogsProps>): void {
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

  // Log management
  addLog(log: any): void {
    this.props.logs.push(log);
    this.emitEvent('log_add', log);
    this.props.onLogAdd?.(log);
    this.updateDisplay();
  }

  removeLog(logId: string): void {
    this.props.logs = this.props.logs.filter(log => log.id !== logId);
    this.updateDisplay();
  }

  clearLogs(): void {
    this.props.logs = [];
    this.updateDisplay();
  }

  // Filter management
  setFilter(filter: AgentLogsFilter): void {
    this.currentFilter = filter;
    this.emitEvent('log_filter', filter);
    this.props.onLogFilter?.(filter);
    this.updateDisplay();
  }

  clearFilter(): void {
    this.currentFilter = {};
    this.updateDisplay();
  }

  // Search functionality
  search(query: string): AgentLogsSearchResult {
    const startTime = Date.now();
    this.currentSearchQuery = query;
    this.filterAndSortLogs();
    const searchTime = Date.now() - startTime;

    const result: AgentLogsSearchResult = {
      query,
      results: this.filteredLogs,
      totalResults: this.filteredLogs.length,
      searchTime,
    };

    this.emitEvent('log_search', result);
    this.props.onLogSearch?.(query, this.filteredLogs);
    this.updateDisplay();
    
    return result;
  }

  // Export functionality
  exportLogs(format: 'json' | 'csv' | 'txt' | 'html'): AgentLogsExport {
    const exportData: AgentLogsExport = {
      format,
      logs: this.filteredLogs,
      filters: this.currentFilter,
      timeRange: this.currentFilter.timeRange,
      timestamp: new Date(),
    };

    return exportData;
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