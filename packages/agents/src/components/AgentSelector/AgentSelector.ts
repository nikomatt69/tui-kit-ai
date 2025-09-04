import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../../core/src/components/BaseComponent';
import { AgentSelectorProps, AgentSelectorVariants, AgentSelectorSizes, AgentSelectorStates, AgentSelectorMode, AgentSelectorDisplayMode, AgentSelectorOption, AgentSelectorEvent, AgentSelectorStats, AgentSelectorSearchResult, AgentSelectorFilter, AgentSelectorSort } from './AgentSelector.types';
import { AgentSelectorStyles } from './AgentSelector.styles';
import { validateComponent, ValidationResult } from '../../../../core/src/validation/component-validator';

export class AgentSelector implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: AgentSelectorProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private searchElement?: Widgets.TextInputElement;
  private listElement?: Widgets.BoxElement;
  private statsElement?: Widgets.BoxElement;
  private controlElement?: Widgets.BoxElement;
  private filteredOptions: AgentSelectorOption[] = [];
  private selectedIds: Set<string> = new Set();
  private currentSearchQuery: string = '';
  private currentFilters: AgentSelectorFilter[] = [];
  private currentSort: AgentSelectorSort = { field: 'name', direction: 'asc' };
  private refreshTimer?: NodeJS.Timeout;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(props: AgentSelectorProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('AgentSelector', props);
    
    if (!this.validationResult.success) {
      console.error('❌ AgentSelector validation failed:', this.validationResult.errors);
      throw new Error(`AgentSelector validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ AgentSelector warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Initialize selected IDs
    if (this.props.selectedIds) {
      this.selectedIds = new Set(this.props.selectedIds);
    }
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: AgentSelectorStyles.getContainerStyle(
        this.props.variant,
        this.props.size,
        this.props.state,
        this.props.mode || 'single',
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
    
    const headerStyle = AgentSelectorStyles.getHeaderStyle(
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

    const searchStyle = AgentSelectorStyles.getSearchStyle(this.props.variant, this.theme);
    this.searchElement.style = searchStyle;
  }

  private createList(): void {
    this.listElement = this.el.children[1] as Widgets.BoxElement || this.el;
    
    const listStyle = AgentSelectorStyles.getListStyle(
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

    const statsStyle = AgentSelectorStyles.getStatsStyle(this.props.variant, this.theme);
    this.statsElement.style = statsStyle;
  }

  private createControls(): void {
    this.controlElement = this.el.children[3] as Widgets.BoxElement;
    if (!this.controlElement) {
      this.controlElement = this.el;
    }

    const controlStyle = AgentSelectorStyles.getControlStyle(this.props.variant, this.props.state, this.theme);
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

    const title = `Select Agent${this.props.mode === 'multiple' ? 's' : ''} (${this.selectedIds.size} selected)`;
    this.headerElement.setContent(title);
  }

  private updateList(): void {
    if (!this.listElement) return;

    this.filterAndSortOptions();
    
    if (this.filteredOptions.length === 0) {
      this.showEmptyState();
      return;
    }

    const content = this.renderOptions();
    this.listElement.setContent(content);
  }

  private filterAndSortOptions(): void {
    let filtered = [...this.props.options];

    // Apply search filter
    if (this.currentSearchQuery) {
      filtered = filtered.filter(option => 
        option.config.name.toLowerCase().includes(this.currentSearchQuery.toLowerCase()) ||
        option.config.type.toLowerCase().includes(this.currentSearchQuery.toLowerCase()) ||
        option.config.description?.toLowerCase().includes(this.currentSearchQuery.toLowerCase())
      );
    }

    // Apply custom filters
    this.currentFilters.forEach(filter => {
      filtered = filtered.filter(option => {
        switch (filter.type) {
          case 'status':
            return this.matchesFilter(option.status || 'idle', filter.value, filter.operator);
          case 'type':
            return this.matchesFilter(option.config.type, filter.value, filter.operator);
          case 'capability':
            return option.config.capabilities.some(cap => 
              this.matchesFilter(cap, filter.value, filter.operator)
            );
          case 'custom':
            return this.matchesFilter(option.metadata?.[filter.value] || '', filter.value, filter.operator);
          default:
            return true;
        }
      });
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (this.currentSort.field) {
        case 'name':
          aValue = a.config.name;
          bValue = b.config.name;
          break;
        case 'type':
          aValue = a.config.type;
          bValue = b.config.type;
          break;
        case 'status':
          aValue = a.status || 'idle';
          bValue = b.status || 'idle';
          break;
        case 'created':
          aValue = a.config.id;
          bValue = b.config.id;
          break;
        case 'lastUsed':
          aValue = a.metadata?.lastUsed || 0;
          bValue = b.metadata?.lastUsed || 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.currentSort.direction === 'asc' ? 
          aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return this.currentSort.direction === 'asc' ? 
          aValue - bValue : bValue - aValue;
      }
    });

    this.filteredOptions = filtered;
  }

  private matchesFilter(value: string, filterValue: string, operator: string): boolean {
    switch (operator) {
      case 'equals':
        return value === filterValue;
      case 'contains':
        return value.toLowerCase().includes(filterValue.toLowerCase());
      case 'startsWith':
        return value.toLowerCase().startsWith(filterValue.toLowerCase());
      case 'endsWith':
        return value.toLowerCase().endsWith(filterValue.toLowerCase());
      case 'regex':
        try {
          const regex = new RegExp(filterValue, 'i');
          return regex.test(value);
        } catch {
          return false;
        }
      default:
        return true;
    }
  }

  private renderOptions(): string {
    switch (this.props.displayMode) {
      case 'list':
        return this.renderListView();
      case 'grid':
        return this.renderGridView();
      case 'compact':
        return this.renderCompactView();
      case 'cards':
        return this.renderCardsView();
      default:
        return this.renderListView();
    }
  }

  private renderListView(): string {
    return this.filteredOptions.map(option => {
      const isSelected = this.selectedIds.has(option.config.id);
      const isEnabled = option.enabled !== false;
      const statusIcon = this.getStatusIcon(option.status || 'idle');
      const selectionIcon = this.getSelectionIcon(isSelected);
      const description = this.props.showDescription && option.description ? 
        ` - ${option.description}` : '';
      
      return `${selectionIcon} ${statusIcon} ${option.config.name} (${option.config.type})${description}`;
    }).join('\n');
  }

  private renderGridView(): string {
    const cols = 2;
    const rows = Math.ceil(this.filteredOptions.length / cols);
    const grid: string[][] = Array(rows).fill(null).map(() => Array(cols).fill(''));

    this.filteredOptions.forEach((option, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const isSelected = this.selectedIds.has(option.config.id);
      const statusIcon = this.getStatusIcon(option.status || 'idle');
      const selectionIcon = this.getSelectionIcon(isSelected);
      
      grid[row][col] = `${selectionIcon} ${statusIcon} ${option.config.name}`;
    });

    return grid.map(row => row.join(' | ')).join('\n');
  }

  private renderCompactView(): string {
    return this.filteredOptions.map(option => {
      const isSelected = this.selectedIds.has(option.config.id);
      const statusIcon = this.getStatusIcon(option.status || 'idle');
      const selectionIcon = this.getSelectionIcon(isSelected);
      
      return `${selectionIcon}${statusIcon}${option.config.name}`;
    }).join(' ');
  }

  private renderCardsView(): string {
    return this.filteredOptions.map(option => {
      const isSelected = this.selectedIds.has(option.config.id);
      const statusIcon = this.getStatusIcon(option.status || 'idle');
      const selectionIcon = this.getSelectionIcon(isSelected);
      const capabilities = this.props.showCapabilities ? 
        ` | Capabilities: ${option.config.capabilities.slice(0, 2).join(', ')}` : '';
      
      return `${selectionIcon} ${statusIcon} ${option.config.name}\n  Type: ${option.config.type}${capabilities}`;
    }).join('\n\n');
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

  private getSelectionIcon(isSelected: boolean): string {
    switch (this.props.mode) {
      case 'single':
      case 'radio':
        return isSelected ? '●' : '○';
      case 'multiple':
      case 'checkbox':
        return isSelected ? '☑' : '☐';
      case 'dropdown':
        return isSelected ? '►' : ' ';
      default:
        return isSelected ? '►' : ' ';
    }
  }

  private showEmptyState(): void {
    if (!this.listElement) return;

    const message = this.currentSearchQuery ? 
      `No agents found for "${this.currentSearchQuery}"` : 
      (this.props.emptyMessage || 'No agents available');
    
    this.listElement.setContent(message);
  }

  private updateStats(): void {
    if (!this.statsElement) return;

    const stats = this.getStats();
    const statsText = `Total: ${stats.totalOptions} | Selected: ${stats.selectedOptions} | Enabled: ${stats.enabledOptions} | Filtered: ${stats.filteredOptions}`;
    this.statsElement.setContent(statsText);
  }

  private updateControls(): void {
    if (!this.controlElement) return;

    const controls = [
      `Mode: ${this.props.mode}`,
      `Display: ${this.props.displayMode}`,
      `Sort: ${this.currentSort.field} ${this.currentSort.direction}`,
      `Filters: ${this.currentFilters.length}`
    ].join(' | ');

    this.controlElement.setContent(controls);
  }

  private getStats(): AgentSelectorStats {
    const totalOptions = this.props.options.length;
    const selectedOptions = this.selectedIds.size;
    const enabledOptions = this.props.options.filter(o => o.enabled !== false).length;
    const disabledOptions = totalOptions - enabledOptions;
    const filteredOptions = this.filteredOptions.length;
    const searchResults = this.currentSearchQuery ? this.filteredOptions.length : totalOptions;

    return {
      totalOptions,
      selectedOptions,
      enabledOptions,
      disabledOptions,
      filteredOptions,
      searchResults,
    };
  }

  private setupEventListeners(): void {
    if (this.props.keys) {
      this.el.key(['up', 'k'], () => this.navigateUp());
      this.el.key(['down', 'j'], () => this.navigateDown());
      this.el.key(['enter', 'space'], () => this.toggleSelection());
      this.el.key(['s', 'S'], () => this.cycleSort());
      this.el.key(['f', 'F'], () => this.cycleFilter());
      this.el.key(['d', 'D'], () => this.cycleDisplayMode());
      this.el.key(['r', 'R'], () => this.refresh());
      this.el.key(['escape'], () => this.clearSelection());
    }

    if (this.props.mouse) {
      this.el.on('click', () => this.el.focus());
    }

    if (this.searchElement) {
      this.searchElement.on('submit', (value: string) => {
        this.currentSearchQuery = value;
        this.emitEvent('search', { query: value, results: this.filteredOptions });
        this.props.onSearch?.(value, this.filteredOptions);
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
    const event: AgentSelectorEvent = {
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

  private toggleSelection(): void {
    // Implementation for toggling selection
    this.updateDisplay();
  }

  private cycleSort(): void {
    const sortFields = ['name', 'type', 'status', 'created', 'lastUsed'];
    const currentIndex = sortFields.indexOf(this.currentSort.field);
    const nextIndex = (currentIndex + 1) % sortFields.length;
    this.currentSort.field = sortFields[nextIndex] as any;
    
    this.emitEvent('sort', this.currentSort);
    this.props.onSort?.(this.currentSort.field, this.filteredOptions);
    this.updateDisplay();
  }

  private cycleFilter(): void {
    // Implementation for cycling through filters
    this.updateDisplay();
  }

  private cycleDisplayMode(): void {
    const displayModes: AgentSelectorDisplayMode[] = ['list', 'grid', 'compact', 'cards'];
    const currentIndex = displayModes.indexOf(this.props.displayMode || 'list');
    const nextIndex = (currentIndex + 1) % displayModes.length;
    this.props.displayMode = displayModes[nextIndex];
    this.updateDisplay();
  }

  private refresh(): void {
    this.emitEvent('refresh', { timestamp: new Date() });
    this.props.onRefresh?.();
    this.updateDisplay();
  }

  private clearSelection(): void {
    this.selectedIds.clear();
    this.emitSelectionChange();
    this.updateDisplay();
  }

  private emitSelectionChange(): void {
    const selectedOptions = this.props.options.filter(option => 
      this.selectedIds.has(option.config.id)
    );
    
    this.emitEvent('selection_change', {
      selectedIds: Array.from(this.selectedIds),
      selectedOptions
    });
    
    this.props.onSelectionChange?.(Array.from(this.selectedIds), selectedOptions);
  }

  // Public methods
  setVariant(variant: AgentSelectorVariants): void {
    this.props.variant = variant;
    this.updateDisplay();
  }

  setSize(size: AgentSelectorSizes): void {
    this.props.size = size;
    this.updateDisplay();
  }

  setState(state: AgentSelectorStates): void {
    this.props.state = state;
    this.updateDisplay();
  }

  getConfig(): any {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      mode: this.props.mode,
      displayMode: this.props.displayMode,
      selectedIds: Array.from(this.selectedIds),
      stats: this.getStats(),
    };
  }

  update(props: Partial<AgentSelectorProps>): void {
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

  // Selection management
  selectOption(optionId: string): void {
    if (this.props.mode === 'single' || this.props.mode === 'radio') {
      this.selectedIds.clear();
    }
    
    this.selectedIds.add(optionId);
    this.emitSelectionChange();
    this.updateDisplay();
  }

  deselectOption(optionId: string): void {
    this.selectedIds.delete(optionId);
    this.emitSelectionChange();
    this.updateDisplay();
  }

  toggleOption(optionId: string): void {
    if (this.selectedIds.has(optionId)) {
      this.deselectOption(optionId);
    } else {
      this.selectOption(optionId);
    }
  }

  clearSelection(): void {
    this.selectedIds.clear();
    this.emitSelectionChange();
    this.updateDisplay();
  }

  getSelectedIds(): string[] {
    return Array.from(this.selectedIds);
  }

  getSelectedOptions(): AgentSelectorOption[] {
    return this.props.options.filter(option => 
      this.selectedIds.has(option.config.id)
    );
  }

  // Search functionality
  search(query: string): AgentSelectorSearchResult {
    const startTime = Date.now();
    this.currentSearchQuery = query;
    this.filterAndSortOptions();
    const searchTime = Date.now() - startTime;

    const result: AgentSelectorSearchResult = {
      query,
      results: this.filteredOptions,
      totalResults: this.filteredOptions.length,
      searchTime,
    };

    this.emitEvent('search', result);
    this.props.onSearch?.(query, this.filteredOptions);
    this.updateDisplay();
    
    return result;
  }

  // Filter management
  addFilter(filter: AgentSelectorFilter): void {
    this.currentFilters.push(filter);
    this.emitEvent('filter', { filter, results: this.filteredOptions });
    this.props.onFilter?.(filter.value, this.filteredOptions);
    this.updateDisplay();
  }

  removeFilter(filter: AgentSelectorFilter): void {
    this.currentFilters = this.currentFilters.filter(f => f !== filter);
    this.updateDisplay();
  }

  clearFilters(): void {
    this.currentFilters = [];
    this.updateDisplay();
  }

  // Sort management
  setSort(sort: AgentSelectorSort): void {
    this.currentSort = sort;
    this.emitEvent('sort', sort);
    this.props.onSort?.(sort.field, this.filteredOptions);
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