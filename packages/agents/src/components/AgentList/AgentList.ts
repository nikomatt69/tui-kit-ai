import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../../core/src/components/BaseComponent';
import { AgentListProps, AgentListVariants, AgentListSizes, AgentListStates, AgentListViewMode, AgentListSortBy, AgentListFilterBy, AgentListItem, AgentListEvent, AgentListStats, AgentListSearchResult } from './AgentList.types';
import { AgentListStyles } from './AgentList.styles';
import { validateComponent, ValidationResult } from '../../../../core/src/validation/component-validator';

export class AgentList implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: AgentListProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private searchElement?: Widgets.TextInputElement;
  private listElement?: Widgets.BoxElement;
  private statsElement?: Widgets.BoxElement;
  private controlElement?: Widgets.BoxElement;
  private filteredAgents: AgentListItem[] = [];
  private selectedAgentIds: Set<string> = new Set();
  private currentSortBy: AgentListSortBy;
  private currentFilterBy: AgentListFilterBy;
  private currentViewMode: AgentListViewMode;
  private searchQuery: string = '';
  private refreshTimer?: NodeJS.Timeout;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(props: AgentListProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('AgentList', props);
    
    if (!this.validationResult.success) {
      console.error('❌ AgentList validation failed:', this.validationResult.errors);
      throw new Error(`AgentList validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ AgentList warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.currentSortBy = this.props.sortBy || 'name';
    this.currentFilterBy = this.props.filterBy || 'all';
    this.currentViewMode = this.props.viewMode || 'list';
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: AgentListStyles.getContainerStyle(
        this.props.variant,
        this.props.size,
        this.props.state,
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
    
    this.createList();
    this.createStats();
    this.createControls();
  }

  private createHeader(): void {
    this.headerElement = this.el.children[0] as Widgets.BoxElement || this.el;
    
    const headerStyle = AgentListStyles.getHeaderStyle(
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

    const searchStyle = AgentListStyles.getSearchStyle(this.props.variant, this.theme);
    this.searchElement.style = searchStyle;
  }

  private createList(): void {
    this.listElement = this.el.children[1] as Widgets.BoxElement || this.el;
    
    const listStyle = AgentListStyles.getListStyle(
      this.props.variant,
      this.props.size,
      this.theme
    );

    this.listElement.style = listStyle;
  }

  private createStats(): void {
    this.statsElement = this.el.children[2] as Widgets.BoxElement;
    if (!this.statsElement) {
      this.statsElement = this.el;
    }

    const statsStyle = AgentListStyles.getStatsStyle(this.props.variant, this.theme);
    this.statsElement.style = statsStyle;
  }

  private createControls(): void {
    this.controlElement = this.el.children[3] as Widgets.BoxElement;
    if (!this.controlElement) {
      this.controlElement = this.el;
    }

    const controlStyle = AgentListStyles.getControlStyle(this.props.variant, this.props.state, this.theme);
    this.controlElement.style = controlStyle;
  }

  private updateDisplay(): void {
    this.updateHeader();
    this.updateList();
    this.updateStats();
    this.updateControls();
  }

  private updateHeader(): void {
    if (!this.headerElement) return;

    const title = `Agents (${this.filteredAgents.length}/${this.props.agents.length})`;
    this.headerElement.setContent(title);
  }

  private updateList(): void {
    if (!this.listElement) return;

    this.filterAndSortAgents();
    
    if (this.filteredAgents.length === 0) {
      this.showEmptyState();
      return;
    }

    const content = this.renderAgents();
    this.listElement.setContent(content);
  }

  private filterAndSortAgents(): void {
    let filtered = [...this.props.agents];

    // Apply search filter
    if (this.searchQuery) {
      filtered = filtered.filter(agent => 
        agent.config.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        agent.config.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        agent.config.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (this.currentFilterBy !== 'all') {
      filtered = filtered.filter(agent => {
        switch (this.currentFilterBy) {
          case 'active':
            return agent.status === 'running';
          case 'idle':
            return agent.status === 'idle';
          case 'error':
            return agent.status === 'error';
          case 'type':
            return agent.config.type === this.currentFilterBy;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.currentSortBy) {
        case 'name':
          return a.config.name.localeCompare(b.config.name);
        case 'type':
          return a.config.type.localeCompare(b.config.type);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'lastRun':
          return (b.lastActivity?.getTime() || 0) - (a.lastActivity?.getTime() || 0);
        case 'successRate':
          const aRate = a.metrics ? (a.metrics.successfulRuns / a.metrics.totalRuns) : 0;
          const bRate = b.metrics ? (b.metrics.successfulRuns / b.metrics.totalRuns) : 0;
          return bRate - aRate;
        case 'created':
          return (b.config.id.localeCompare(a.config.id));
        default:
          return 0;
      }
    });

    // Apply max items limit
    if (this.props.maxItems && filtered.length > this.props.maxItems) {
      filtered = filtered.slice(0, this.props.maxItems);
    }

    this.filteredAgents = filtered;
  }

  private renderAgents(): string {
    switch (this.currentViewMode) {
      case 'list':
        return this.renderListView();
      case 'grid':
        return this.renderGridView();
      case 'compact':
        return this.renderCompactView();
      default:
        return this.renderListView();
    }
  }

  private renderListView(): string {
    return this.filteredAgents.map(agent => {
      const isSelected = this.selectedAgentIds.has(agent.config.id);
      const statusIcon = this.getStatusIcon(agent.status);
      const metrics = this.props.showMetrics && agent.metrics ? 
        ` | Runs: ${agent.metrics.totalRuns} | Success: ${agent.metrics.successfulRuns}` : '';
      const lastActivity = this.props.showLastActivity && agent.lastActivity ? 
        ` | Last: ${agent.lastActivity.toLocaleTimeString()}` : '';
      
      return `${isSelected ? '► ' : '  '}${statusIcon} ${agent.config.name} (${agent.config.type})${metrics}${lastActivity}`;
    }).join('\n');
  }

  private renderGridView(): string {
    const cols = 2;
    const rows = Math.ceil(this.filteredAgents.length / cols);
    const grid: string[][] = Array(rows).fill(null).map(() => Array(cols).fill(''));

    this.filteredAgents.forEach((agent, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const isSelected = this.selectedAgentIds.has(agent.config.id);
      const statusIcon = this.getStatusIcon(agent.status);
      
      grid[row][col] = `${isSelected ? '► ' : '  '}${statusIcon} ${agent.config.name}`;
    });

    return grid.map(row => row.join(' | ')).join('\n');
  }

  private renderCompactView(): string {
    return this.filteredAgents.map(agent => {
      const isSelected = this.selectedAgentIds.has(agent.config.id);
      const statusIcon = this.getStatusIcon(agent.status);
      
      return `${isSelected ? '►' : ' '}${statusIcon}${agent.config.name}`;
    }).join(' ');
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

  private showEmptyState(): void {
    if (!this.listElement) return;

    const message = this.searchQuery ? 
      `No agents found for "${this.searchQuery}"` : 
      (this.props.emptyMessage || 'No agents available');
    
    this.listElement.setContent(message);
  }

  private updateStats(): void {
    if (!this.statsElement || !this.props.showMetrics) return;

    const stats = this.getStats();
    const statsText = `Total: ${stats.totalAgents} | Active: ${stats.activeAgents} | Idle: ${stats.idleAgents} | Errors: ${stats.errorAgents}`;
    this.statsElement.setContent(statsText);
  }

  private updateControls(): void {
    if (!this.controlElement) return;

    const controls = [
      `Sort: ${this.currentSortBy}`,
      `Filter: ${this.currentFilterBy}`,
      `View: ${this.currentViewMode}`,
      `Selected: ${this.selectedAgentIds.size}`
    ].join(' | ');

    this.controlElement.setContent(controls);
  }

  private getStats(): AgentListStats {
    const totalAgents = this.props.agents.length;
    const activeAgents = this.props.agents.filter(a => a.status === 'running').length;
    const idleAgents = this.props.agents.filter(a => a.status === 'idle').length;
    const errorAgents = this.props.agents.filter(a => a.status === 'error').length;
    const selectedAgents = this.selectedAgentIds.size;
    const filteredAgents = this.filteredAgents.length;

    return {
      totalAgents,
      activeAgents,
      idleAgents,
      errorAgents,
      selectedAgents,
      filteredAgents,
    };
  }

  private setupEventListeners(): void {
    if (this.props.keys) {
      this.el.key(['up', 'k'], () => this.navigateUp());
      this.el.key(['down', 'j'], () => this.navigateDown());
      this.el.key(['enter', 'space'], () => this.selectCurrent());
      this.el.key(['s', 'S'], () => this.cycleSort());
      this.el.key(['f', 'F'], () => this.cycleFilter());
      this.el.key(['v', 'V'], () => this.cycleViewMode());
      this.el.key(['r', 'R'], () => this.refresh());
      this.el.key(['escape'], () => this.clearSelection());
    }

    if (this.props.mouse) {
      this.el.on('click', () => this.el.focus());
    }

    if (this.searchElement) {
      this.searchElement.on('submit', (value: string) => {
        this.searchQuery = value;
        this.emitEvent('search', { query: value, results: this.filteredAgents });
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
    const event: AgentListEvent = {
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
    // Implementation for selecting current item
    this.updateDisplay();
  }

  private cycleSort(): void {
    const sortOptions: AgentListSortBy[] = ['name', 'type', 'status', 'lastRun', 'successRate', 'created'];
    const currentIndex = sortOptions.indexOf(this.currentSortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    this.currentSortBy = sortOptions[nextIndex];
    
    this.emitEvent('sort_change', this.currentSortBy);
    this.props.onSortChange?.(this.currentSortBy);
    this.updateDisplay();
  }

  private cycleFilter(): void {
    const filterOptions: AgentListFilterBy[] = ['all', 'active', 'idle', 'error'];
    const currentIndex = filterOptions.indexOf(this.currentFilterBy);
    const nextIndex = (currentIndex + 1) % filterOptions.length;
    this.currentFilterBy = filterOptions[nextIndex];
    
    this.emitEvent('filter_change', this.currentFilterBy);
    this.props.onFilterChange?.(this.currentFilterBy);
    this.updateDisplay();
  }

  private cycleViewMode(): void {
    const viewModes: AgentListViewMode[] = ['list', 'grid', 'compact'];
    const currentIndex = viewModes.indexOf(this.currentViewMode);
    const nextIndex = (currentIndex + 1) % viewModes.length;
    this.currentViewMode = viewModes[nextIndex];
    
    this.emitEvent('view_mode_change', this.currentViewMode);
    this.props.onViewModeChange?.(this.currentViewMode);
    this.updateDisplay();
  }

  private refresh(): void {
    this.emitEvent('refresh', { timestamp: new Date() });
    this.props.onRefresh?.();
    this.updateDisplay();
  }

  private clearSelection(): void {
    this.selectedAgentIds.clear();
    this.updateDisplay();
  }

  // Public methods
  setVariant(variant: AgentListVariants): void {
    this.props.variant = variant;
    this.updateDisplay();
  }

  setSize(size: AgentListSizes): void {
    this.props.size = size;
    this.updateDisplay();
  }

  setState(state: AgentListStates): void {
    this.props.state = state;
    this.updateDisplay();
  }

  getConfig(): any {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      sortBy: this.currentSortBy,
      filterBy: this.currentFilterBy,
      viewMode: this.currentViewMode,
      selectedAgents: Array.from(this.selectedAgentIds),
      stats: this.getStats(),
    };
  }

  update(props: Partial<AgentListProps>): void {
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

  // Agent management
  addAgent(agent: AgentListItem): void {
    this.props.agents.push(agent);
    this.updateDisplay();
  }

  removeAgent(agentId: string): void {
    this.props.agents = this.props.agents.filter(a => a.config.id !== agentId);
    this.selectedAgentIds.delete(agentId);
    this.updateDisplay();
  }

  updateAgent(agentId: string, updates: Partial<AgentListItem>): void {
    const agent = this.props.agents.find(a => a.config.id === agentId);
    if (agent) {
      Object.assign(agent, updates);
      this.updateDisplay();
    }
  }

  selectAgent(agentId: string): void {
    if (this.props.multiSelect) {
      this.selectedAgentIds.add(agentId);
    } else {
      this.selectedAgentIds.clear();
      this.selectedAgentIds.add(agentId);
    }
    
    const agent = this.props.agents.find(a => a.config.id === agentId);
    if (agent) {
      this.emitEvent('agent_select', agent);
      this.props.onAgentSelect?.(agent);
    }
    
    this.updateDisplay();
  }

  deselectAgent(agentId: string): void {
    this.selectedAgentIds.delete(agentId);
    this.updateDisplay();
  }

  clearSelection(): void {
    this.selectedAgentIds.clear();
    this.updateDisplay();
  }

  // Search functionality
  search(query: string): AgentListSearchResult {
    const startTime = Date.now();
    this.searchQuery = query;
    this.filterAndSortAgents();
    const searchTime = Date.now() - startTime;

    const result: AgentListSearchResult = {
      query,
      results: this.filteredAgents,
      totalResults: this.filteredAgents.length,
      searchTime,
    };

    this.emitEvent('search', result);
    this.updateDisplay();
    
    return result;
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