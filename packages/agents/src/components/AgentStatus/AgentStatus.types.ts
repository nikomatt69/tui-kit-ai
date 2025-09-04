import { Widgets } from 'blessed';
import { BaseProps, ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/components/BaseComponent';
import { AgentStatus as AgentStatusType } from '../Agent/Agent.types';

export type AgentStatusDisplayMode = 'icon' | 'text' | 'both' | 'progress' | 'detailed';
export type AgentStatusAnimation = 'none' | 'pulse' | 'blink' | 'rotate' | 'bounce';

export interface AgentStatusProps extends BaseProps {
  status: AgentStatusType;
  agentId?: string;
  agentName?: string;
  displayMode?: AgentStatusDisplayMode;
  animation?: AgentStatusAnimation;
  showTimestamp?: boolean;
  showDuration?: boolean;
  showProgress?: boolean;
  progress?: number;
  message?: string;
  details?: string;
  clickable?: boolean;
  onStatusClick?: (status: AgentStatusType) => void;
  onStatusChange?: (oldStatus: AgentStatusType, newStatus: AgentStatusType) => void;
  refreshInterval?: number;
}

export type AgentStatusVariants = ComponentVariant;
export type AgentStatusSizes = ComponentSize;
export type AgentStatusStates = ComponentState;

export interface AgentStatusEvent {
  type: 'status_change' | 'click' | 'animation_start' | 'animation_stop';
  data: any;
  timestamp: Date;
}

export interface AgentStatusInfo {
  status: AgentStatusType;
  agentId?: string;
  agentName?: string;
  timestamp: Date;
  duration?: number;
  progress?: number;
  message?: string;
  details?: string;
}

export interface AgentStatusConfig {
  displayMode: AgentStatusDisplayMode;
  animation: AgentStatusAnimation;
  showTimestamp: boolean;
  showDuration: boolean;
  showProgress: boolean;
  clickable: boolean;
}

export interface AgentStatusStats {
  totalStatusChanges: number;
  currentStatus: AgentStatusType;
  statusHistory: Array<{
    status: AgentStatusType;
    timestamp: Date;
    duration: number;
  }>;
  averageStatusDuration: number;
  mostCommonStatus: AgentStatusType;
}