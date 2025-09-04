import { Widgets } from 'blessed';
import { BaseProps, ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/components/BaseComponent';
import { AgentConfig, AgentStatus, AgentMetrics } from '../Agent/Agent.types';

export type AgentListSortBy = 'name' | 'type' | 'status' | 'lastRun' | 'successRate' | 'created';
export type AgentListFilterBy = 'all' | 'active' | 'idle' | 'error' | 'type';
export type AgentListViewMode = 'list' | 'grid' | 'compact';

export interface AgentListItem {
  config: AgentConfig;
  status: AgentStatus;
  metrics?: AgentMetrics;
  lastActivity?: Date;
  isSelected?: boolean;
}

export interface AgentListProps extends BaseProps {
  agents: AgentListItem[];
  selectedAgentId?: string;
  sortBy?: AgentListSortBy;
  filterBy?: AgentListFilterBy;
  viewMode?: AgentListViewMode;
  showMetrics?: boolean;
  showStatus?: boolean;
  showType?: boolean;
  showLastActivity?: boolean;
  maxItems?: number;
  autoSelect?: boolean;
  multiSelect?: boolean;
  onAgentSelect?: (agent: AgentListItem) => void;
  onAgentDoubleClick?: (agent: AgentListItem) => void;
  onAgentStart?: (agent: AgentListItem) => void;
  onAgentStop?: (agent: AgentListItem) => void;
  onAgentPause?: (agent: AgentListItem) => void;
  onAgentResume?: (agent: AgentListItem) => void;
  onSortChange?: (sortBy: AgentListSortBy) => void;
  onFilterChange?: (filterBy: AgentListFilterBy) => void;
  onViewModeChange?: (viewMode: AgentListViewMode) => void;
  onRefresh?: () => void;
  refreshInterval?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}

export type AgentListVariants = ComponentVariant;
export type AgentListSizes = ComponentSize;
export type AgentListStates = ComponentState;

export interface AgentListEvent {
  type: 'agent_select' | 'agent_double_click' | 'agent_start' | 'agent_stop' | 'agent_pause' | 'agent_resume' | 'sort_change' | 'filter_change' | 'view_mode_change' | 'refresh' | 'search';
  data: any;
  timestamp: Date;
}

export interface AgentListStats {
  totalAgents: number;
  activeAgents: number;
  idleAgents: number;
  errorAgents: number;
  selectedAgents: number;
  filteredAgents: number;
}

export interface AgentListSearchResult {
  query: string;
  results: AgentListItem[];
  totalResults: number;
  searchTime: number;
}