import { Widgets } from 'blessed';
import { BaseProps, ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/components/BaseComponent';
import { AgentLog } from '../Agent/Agent.types';

export type AgentLogsDisplayMode = 'list' | 'table' | 'compact' | 'detailed' | 'timeline';
export type AgentLogsFilterLevel = 'all' | 'debug' | 'info' | 'warn' | 'error';
export type AgentLogsSortBy = 'timestamp' | 'level' | 'message' | 'agentId';
export type AgentLogsTimeRange = '1h' | '6h' | '24h' | '7d' | '30d' | 'all';

export interface AgentLogsProps extends BaseProps {
  logs: AgentLog[];
  agentId?: string;
  agentName?: string;
  displayMode?: AgentLogsDisplayMode;
  filterLevel?: AgentLogsFilterLevel;
  sortBy?: AgentLogsSortBy;
  timeRange?: AgentLogsTimeRange;
  showTimestamp?: boolean;
  showLevel?: boolean;
  showAgentId?: boolean;
  showMessage?: boolean;
  showData?: boolean;
  maxLogs?: number;
  autoScroll?: boolean;
  followMode?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  refreshInterval?: number;
  onLogAdd?: (log: AgentLog) => void;
  onLogFilter?: (filter: AgentLogsFilter) => void;
  onLogSearch?: (query: string, results: AgentLog[]) => void;
  onLogSelect?: (log: AgentLog) => void;
  onTimeRangeChange?: (timeRange: AgentLogsTimeRange) => void;
  onDisplayModeChange?: (displayMode: AgentLogsDisplayMode) => void;
}

export type AgentLogsVariants = ComponentVariant;
export type AgentLogsSizes = ComponentSize;
export type AgentLogsStates = ComponentState;

export interface AgentLogsEvent {
  type: 'log_add' | 'log_filter' | 'log_search' | 'log_select' | 'time_range_change' | 'display_mode_change' | 'follow_mode_toggle';
  data: any;
  timestamp: Date;
}

export interface AgentLogsFilter {
  level?: AgentLogsFilterLevel;
  agentId?: string;
  message?: string;
  timeRange?: AgentLogsTimeRange;
  custom?: (log: AgentLog) => boolean;
}

export interface AgentLogsSearchResult {
  query: string;
  results: AgentLog[];
  totalResults: number;
  searchTime: number;
}

export interface AgentLogsStats {
  totalLogs: number;
  logsByLevel: Record<string, number>;
  logsByAgent: Record<string, number>;
  averageLogsPerMinute: number;
  lastLogTime?: Date;
  oldestLogTime?: Date;
}

export interface AgentLogsConfig {
  displayMode: AgentLogsDisplayMode;
  filterLevel: AgentLogsFilterLevel;
  sortBy: AgentLogsSortBy;
  timeRange: AgentLogsTimeRange;
  showTimestamp: boolean;
  showLevel: boolean;
  showAgentId: boolean;
  showMessage: boolean;
  showData: boolean;
  maxLogs: number;
  autoScroll: boolean;
  followMode: boolean;
  searchable: boolean;
  filterable: boolean;
  refreshInterval: number;
}

export interface AgentLogsExport {
  format: 'json' | 'csv' | 'txt' | 'html';
  logs: AgentLog[];
  filters?: AgentLogsFilter;
  timeRange?: AgentLogsTimeRange;
  timestamp: Date;
}