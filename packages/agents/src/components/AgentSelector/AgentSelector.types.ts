import { Widgets } from 'blessed';
import { BaseProps, ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/components/BaseComponent';
import { AgentConfig, AgentStatus } from '../Agent/Agent.types';

export type AgentSelectorMode = 'single' | 'multiple' | 'dropdown' | 'radio' | 'checkbox';
export type AgentSelectorDisplayMode = 'list' | 'grid' | 'compact' | 'cards';

export interface AgentSelectorOption {
  config: AgentConfig;
  status?: AgentStatus;
  enabled?: boolean;
  selected?: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

export interface AgentSelectorProps extends BaseProps {
  options: AgentSelectorOption[];
  selectedIds?: string[];
  mode?: AgentSelectorMode;
  displayMode?: AgentSelectorDisplayMode;
  showStatus?: boolean;
  showDescription?: boolean;
  showType?: boolean;
  showCapabilities?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  maxSelections?: number;
  minSelections?: number;
  placeholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  onSelectionChange?: (selectedIds: string[], selectedOptions: AgentSelectorOption[]) => void;
  onOptionSelect?: (option: AgentSelectorOption) => void;
  onOptionDeselect?: (option: AgentSelectorOption) => void;
  onSearch?: (query: string, results: AgentSelectorOption[]) => void;
  onFilter?: (filter: string, results: AgentSelectorOption[]) => void;
  onSort?: (sortBy: string, results: AgentSelectorOption[]) => void;
  onRefresh?: () => void;
  refreshInterval?: number;
}

export type AgentSelectorVariants = ComponentVariant;
export type AgentSelectorSizes = ComponentSize;
export type AgentSelectorStates = ComponentState;

export interface AgentSelectorEvent {
  type: 'selection_change' | 'option_select' | 'option_deselect' | 'search' | 'filter' | 'sort' | 'refresh';
  data: any;
  timestamp: Date;
}

export interface AgentSelectorStats {
  totalOptions: number;
  selectedOptions: number;
  enabledOptions: number;
  disabledOptions: number;
  filteredOptions: number;
  searchResults: number;
}

export interface AgentSelectorSearchResult {
  query: string;
  results: AgentSelectorOption[];
  totalResults: number;
  searchTime: number;
}

export interface AgentSelectorFilter {
  type: 'status' | 'type' | 'capability' | 'custom';
  value: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
}

export interface AgentSelectorSort {
  field: 'name' | 'type' | 'status' | 'created' | 'lastUsed';
  direction: 'asc' | 'desc';
}