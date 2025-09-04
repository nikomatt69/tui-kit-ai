import { BaseProps } from '../../../core/src/components/BaseComponent';

// TokenInfo variants
export type TokenInfoVariants = 
  | 'default'
  | 'compact'
  | 'detailed'
  | 'minimal'
  | 'expanded';

// TokenInfo sizes
export type TokenInfoSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// TokenInfo states
export type TokenInfoStates = 
  | 'default'
  | 'loading'
  | 'error'
  | 'success'
  | 'focused'
  | 'disabled';

// Token types
export type TokenType = 
  | 'input'
  | 'output'
  | 'total'
  | 'prompt'
  | 'completion'
  | 'system'
  | 'user'
  | 'assistant'
  | 'context'
  | 'response';

// Token usage interface
export interface TokenUsage {
  type: TokenType;
  count: number;
  percentage: number;
  cost?: number;
  description?: string;
}

// Token statistics interface
export interface TokenStats {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  promptTokens: number;
  completionTokens: number;
  systemTokens: number;
  userTokens: number;
  assistantTokens: number;
  contextTokens: number;
  responseTokens: number;
  totalCost: number;
  inputCost: number;
  outputCost: number;
  averageTokensPerRequest: number;
  requestsCount: number;
  startTime: number;
  endTime?: number;
  duration?: number;
}

// Model information interface
export interface ModelInfo {
  name: string;
  provider: string;
  version: string;
  contextWindow: number;
  inputCostPer1K: number;
  outputCostPer1K: number;
  maxTokens: number;
  capabilities: string[];
}

// TokenInfo props interface
export interface TokenInfoProps extends BaseProps {
  // Display configuration
  variant?: TokenInfoVariants;
  size?: TokenInfoSizes;
  state?: TokenInfoStates;
  
  // Token data
  usage?: TokenUsage[];
  stats?: TokenStats;
  modelInfo?: ModelInfo;
  
  // Display options
  showCost?: boolean;
  showBreakdown?: boolean;
  showProgress?: boolean;
  showModelInfo?: boolean;
  showHistory?: boolean;
  showRealTime?: boolean;
  
  // Cost calculation
  inputCostPer1K?: number;
  outputCostPer1K?: number;
  currency?: string;
  
  // Progress tracking
  maxTokens?: number;
  showProgressBar?: boolean;
  progressColor?: string;
  
  // History tracking
  maxHistoryItems?: number;
  showHistoryChart?: boolean;
  
  // Event handlers
  onTokenUpdate?: (stats: TokenStats) => void;
  onCostUpdate?: (cost: number) => void;
  onLimitReached?: (limit: number) => void;
  onModelChange?: (model: ModelInfo) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// TokenInfo configuration interface
export interface TokenInfoConfig {
  variant: TokenInfoVariants;
  size: TokenInfoSizes;
  state: TokenInfoStates;
  showCost: boolean;
  showBreakdown: boolean;
  showProgress: boolean;
  showModelInfo: boolean;
  showHistory: boolean;
  showRealTime: boolean;
  inputCostPer1K: number;
  outputCostPer1K: number;
  currency: string;
  maxTokens: number;
  showProgressBar: boolean;
  maxHistoryItems: number;
  showHistoryChart: boolean;
}

// TokenInfo style configuration
export interface TokenInfoStyleConfig {
  container: Record<string, any>;
  header: Record<string, any>;
  content: Record<string, any>;
  progress: Record<string, any>;
  breakdown: Record<string, any>;
  cost: Record<string, any>;
  model: Record<string, any>;
  history: Record<string, any>;
}

// TokenInfo events
export interface TokenInfoTokenUpdateEvent {
  type: 'tokenUpdate';
  stats: TokenStats;
}

export interface TokenInfoCostUpdateEvent {
  type: 'costUpdate';
  cost: number;
}

export interface TokenInfoLimitReachedEvent {
  type: 'limitReached';
  limit: number;
}

export interface TokenInfoModelChangeEvent {
  type: 'modelChange';
  model: ModelInfo;
}

export interface TokenInfoFocusEvent {
  type: 'focus';
}

export interface TokenInfoBlurEvent {
  type: 'blur';
}

export type TokenInfoEvent = 
  | TokenInfoTokenUpdateEvent
  | TokenInfoCostUpdateEvent
  | TokenInfoLimitReachedEvent
  | TokenInfoModelChangeEvent
  | TokenInfoFocusEvent
  | TokenInfoBlurEvent;

// TokenInfo validation result
export interface TokenInfoValidationResult {
  success: boolean;
  data?: TokenInfoProps;
  errors?: Error;
  warnings?: string[];
}

// TokenInfo factory options
export interface TokenInfoFactoryOptions {
  defaultVariant?: TokenInfoVariants;
  defaultSize?: TokenInfoSizes;
  defaultState?: TokenInfoStates;
  defaultModel?: ModelInfo;
  theme?: any;
  parent?: any;
}

// TokenInfo group props for multiple token info displays
export interface TokenInfoGroupProps extends BaseProps {
  tokenInfos: TokenInfoProps[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showGroupStats?: boolean;
  onTokenInfoSelect?: (tokenInfoId: string) => void;
}

// Token breakdown item interface
export interface TokenBreakdownItem {
  type: TokenType;
  count: number;
  percentage: number;
  cost: number;
  color: string;
  description: string;
}

// Token history item interface
export interface TokenHistoryItem {
  timestamp: number;
  tokens: number;
  cost: number;
  type: TokenType;
  model: string;
}

// Token progress interface
export interface TokenProgress {
  current: number;
  max: number;
  percentage: number;
  remaining: number;
  color: string;
  status: 'normal' | 'warning' | 'critical';
}

// Cost breakdown interface
export interface CostBreakdown {
  input: number;
  output: number;
  total: number;
  currency: string;
  perRequest: number;
  perToken: number;
}

// Token rate interface
export interface TokenRate {
  tokensPerSecond: number;
  requestsPerMinute: number;
  averageResponseTime: number;
  peakTokensPerSecond: number;
}