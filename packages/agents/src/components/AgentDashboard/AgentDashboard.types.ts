import { Widgets } from 'blessed';
import { BaseProps, ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/components/BaseComponent';
import { AgentConfig, AgentStatus, AgentMetrics, AgentLog } from '../Agent/Agent.types';

export type AgentDashboardLayout = 'grid' | 'rows' | 'columns' | 'tabs' | 'split';
export type AgentDashboardViewMode = 'overview' | 'detailed' | 'monitoring' | 'management';
export type AgentDashboardRefreshMode = 'manual' | 'auto' | 'realtime';

export interface AgentDashboardProps extends BaseProps {
  agents: Array<{
    config: AgentConfig;
    status: AgentStatus;
    metrics?: AgentMetrics;
    logs?: AgentLog[];
  }>;
  layout?: AgentDashboardLayout;
  viewMode?: AgentDashboardViewMode;
  refreshMode?: AgentDashboardRefreshMode;
  refreshInterval?: number;
  showAgentList?: boolean;
  showAgentDetails?: boolean;
  showMetrics?: boolean;
  showLogs?: boolean;
  showSystemStats?: boolean;
  showAlerts?: boolean;
  showNotifications?: boolean;
  maxAgents?: number;
  selectedAgentId?: string;
  onAgentSelect?: (agentId: string) => void;
  onAgentStart?: (agentId: string) => void;
  onAgentStop?: (agentId: string) => void;
  onAgentPause?: (agentId: string) => void;
  onAgentResume?: (agentId: string) => void;
  onAgentConfigure?: (agentId: string) => void;
  onViewModeChange?: (viewMode: AgentDashboardViewMode) => void;
  onLayoutChange?: (layout: AgentDashboardLayout) => void;
  onRefresh?: () => void;
}

export type AgentDashboardVariants = ComponentVariant;
export type AgentDashboardSizes = ComponentSize;
export type AgentDashboardStates = ComponentState;

export interface AgentDashboardEvent {
  type: 'agent_select' | 'agent_start' | 'agent_stop' | 'agent_pause' | 'agent_resume' | 'agent_configure' | 'view_mode_change' | 'layout_change' | 'refresh' | 'alert' | 'notification';
  data: any;
  timestamp: Date;
}

export interface AgentDashboardAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  agentId?: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface AgentDashboardNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface AgentDashboardStats {
  totalAgents: number;
  activeAgents: number;
  idleAgents: number;
  errorAgents: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  systemLoad: number;
  memoryUsage: number;
  cpuUsage: number;
  uptime: number;
}

export interface AgentDashboardLayoutConfig {
  layout: AgentDashboardLayout;
  panels: Array<{
    id: string;
    type: 'agent-list' | 'agent-details' | 'metrics' | 'logs' | 'system-stats' | 'alerts' | 'notifications';
    position: { x: number; y: number; width: number; height: number };
    visible: boolean;
    config?: any;
  }>;
}

export interface AgentDashboardViewConfig {
  viewMode: AgentDashboardViewMode;
  layout: AgentDashboardLayoutConfig;
  refreshMode: AgentDashboardRefreshMode;
  refreshInterval: number;
  showPanels: Record<string, boolean>;
}

export interface AgentDashboardExport {
  format: 'json' | 'yaml' | 'html' | 'pdf';
  data: {
    agents: any[];
    stats: AgentDashboardStats;
    alerts: AgentDashboardAlert[];
    notifications: AgentDashboardNotification[];
    layout: AgentDashboardLayoutConfig;
  };
  timestamp: Date;
}