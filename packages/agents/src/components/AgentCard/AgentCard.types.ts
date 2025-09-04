import { Widgets } from 'blessed';
import { BaseProps, ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/components/BaseComponent';
import { AgentConfig, AgentStatus, AgentMetrics } from '../Agent/Agent.types';

export type AgentCardLayout = 'horizontal' | 'vertical' | 'compact';
export type AgentCardDisplayMode = 'full' | 'summary' | 'minimal';

export interface AgentCardProps extends BaseProps {
  config: AgentConfig;
  status?: AgentStatus;
  metrics?: AgentMetrics;
  layout?: AgentCardLayout;
  displayMode?: AgentCardDisplayMode;
  showMetrics?: boolean;
  showStatus?: boolean;
  showType?: boolean;
  showDescription?: boolean;
  showCapabilities?: boolean;
  showLastActivity?: boolean;
  showControls?: boolean;
  clickable?: boolean;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: (config: AgentConfig) => void;
  onDoubleClick?: (config: AgentConfig) => void;
  onStart?: (config: AgentConfig) => void;
  onStop?: (config: AgentConfig) => void;
  onPause?: (config: AgentConfig) => void;
  onResume?: (config: AgentConfig) => void;
  onConfigure?: (config: AgentConfig) => void;
  onViewLogs?: (config: AgentConfig) => void;
  onViewMetrics?: (config: AgentConfig) => void;
}

export type AgentCardVariants = ComponentVariant;
export type AgentCardSizes = ComponentSize;
export type AgentCardStates = ComponentState;

export interface AgentCardEvent {
  type: 'select' | 'double_click' | 'start' | 'stop' | 'pause' | 'resume' | 'configure' | 'view_logs' | 'view_metrics';
  data: AgentConfig;
  timestamp: Date;
}

export interface AgentCardStats {
  totalRuns: number;
  successRate: number;
  averageTime: number;
  lastRun?: Date;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface AgentCardInfo {
  name: string;
  type: string;
  description?: string;
  version?: string;
  author?: string;
  capabilities: string[];
  status: AgentStatus;
  stats: AgentCardStats;
}