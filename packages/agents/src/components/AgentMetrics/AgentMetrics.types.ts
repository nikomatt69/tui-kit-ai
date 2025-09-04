import { Widgets } from 'blessed';
import { BaseProps, ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/components/BaseComponent';
import { AgentMetrics as AgentMetricsType } from '../Agent/Agent.types';

export type AgentMetricsDisplayMode = 'table' | 'cards' | 'charts' | 'summary' | 'detailed';
export type AgentMetricsChartType = 'line' | 'bar' | 'pie' | 'gauge' | 'sparkline';
export type AgentMetricsTimeRange = '1h' | '6h' | '24h' | '7d' | '30d' | 'all';

export interface AgentMetricsProps extends BaseProps {
  metrics: AgentMetricsType;
  agentId?: string;
  agentName?: string;
  displayMode?: AgentMetricsDisplayMode;
  chartType?: AgentMetricsChartType;
  timeRange?: AgentMetricsTimeRange;
  showCharts?: boolean;
  showHistory?: boolean;
  showTrends?: boolean;
  showComparisons?: boolean;
  showAlerts?: boolean;
  refreshInterval?: number;
  onMetricsUpdate?: (metrics: AgentMetricsType) => void;
  onAlert?: (alert: AgentMetricsAlert) => void;
  onTimeRangeChange?: (timeRange: AgentMetricsTimeRange) => void;
  onDisplayModeChange?: (displayMode: AgentMetricsDisplayMode) => void;
}

export type AgentMetricsVariants = ComponentVariant;
export type AgentMetricsSizes = ComponentSize;
export type AgentMetricsStates = ComponentState;

export interface AgentMetricsEvent {
  type: 'metrics_update' | 'alert' | 'time_range_change' | 'display_mode_change' | 'chart_interaction';
  data: any;
  timestamp: Date;
}

export interface AgentMetricsAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  agentId?: string;
}

export interface AgentMetricsHistory {
  timestamp: Date;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageExecutionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  errorRate: number;
  uptime: number;
}

export interface AgentMetricsTrend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  change: number;
  changePercent: number;
  period: string;
}

export interface AgentMetricsComparison {
  metric: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  better: boolean;
}

export interface AgentMetricsChart {
  type: AgentMetricsChartType;
  title: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  timeRange: AgentMetricsTimeRange;
  maxValue?: number;
  minValue?: number;
}

export interface AgentMetricsConfig {
  displayMode: AgentMetricsDisplayMode;
  chartType: AgentMetricsChartType;
  timeRange: AgentMetricsTimeRange;
  showCharts: boolean;
  showHistory: boolean;
  showTrends: boolean;
  showComparisons: boolean;
  showAlerts: boolean;
  refreshInterval: number;
}

export interface AgentMetricsStats {
  totalDataPoints: number;
  averageUpdateInterval: number;
  lastUpdate: Date;
  alertsCount: number;
  trendsCount: number;
  comparisonsCount: number;
}