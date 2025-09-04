import { Widgets } from 'blessed';
import { BaseProps, ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/components/BaseComponent';

export type AgentStatus = 'idle' | 'running' | 'paused' | 'error' | 'completed' | 'stopped';
export type AgentType = 'chat' | 'code' | 'data' | 'web' | 'file' | 'custom';
export type AgentPriority = 'low' | 'normal' | 'high' | 'critical';

export interface AgentConfig {
  id: string;
  name: string;
  type: AgentType;
  description?: string;
  version?: string;
  author?: string;
  capabilities: string[];
  settings: Record<string, any>;
  dependencies?: string[];
  timeout?: number;
  retryCount?: number;
  priority?: AgentPriority;
}

export interface AgentMetrics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageExecutionTime: number;
  lastRunTime?: Date;
  memoryUsage: number;
  cpuUsage: number;
  errorRate: number;
  uptime: number;
}

export interface AgentLog {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  agentId: string;
}

export interface AgentTask {
  id: string;
  agentId: string;
  type: string;
  payload: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

export interface AgentProps extends BaseProps {
  config: AgentConfig;
  status?: AgentStatus;
  metrics?: AgentMetrics;
  logs?: AgentLog[];
  tasks?: AgentTask[];
  onStatusChange?: (status: AgentStatus) => void;
  onTaskComplete?: (task: AgentTask) => void;
  onError?: (error: Error) => void;
  onStart?: () => void;
  onStop?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  showMetrics?: boolean;
  showLogs?: boolean;
  showTasks?: boolean;
  maxLogs?: number;
  autoScroll?: boolean;
  refreshInterval?: number;
}

export type AgentVariants = ComponentVariant;
export type AgentSizes = ComponentSize;
export type AgentStates = ComponentState;

export interface AgentEvent {
  type: 'status_change' | 'task_complete' | 'error' | 'start' | 'stop' | 'pause' | 'resume' | 'metrics_update' | 'log_add';
  data: any;
  timestamp: Date;
}

export interface AgentStats {
  totalAgents: number;
  activeAgents: number;
  idleAgents: number;
  errorAgents: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageTaskTime: number;
  systemLoad: number;
}