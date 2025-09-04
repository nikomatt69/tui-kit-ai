import { BaseProps } from '../../../core/src/components/BaseComponent';

// ModelSelector variants
export type ModelSelectorVariants = 
  | 'default'
  | 'compact'
  | 'detailed'
  | 'minimal'
  | 'expanded';

// ModelSelector sizes
export type ModelSelectorSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// ModelSelector states
export type ModelSelectorStates = 
  | 'default'
  | 'loading'
  | 'error'
  | 'success'
  | 'focused'
  | 'disabled';

// AI Providers
export type AIProvider = 
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'meta'
  | 'microsoft'
  | 'amazon'
  | 'cohere'
  | 'huggingface'
  | 'local'
  | 'custom';

// Model capabilities
export type ModelCapability = 
  | 'text-generation'
  | 'code-generation'
  | 'image-generation'
  | 'function-calling'
  | 'tool-use'
  | 'multimodal'
  | 'embeddings'
  | 'fine-tuning'
  | 'chat'
  | 'completion';

// Model performance levels
export type ModelPerformance = 
  | 'basic'
  | 'standard'
  | 'advanced'
  | 'premium'
  | 'enterprise';

// Model availability
export type ModelAvailability = 
  | 'available'
  | 'beta'
  | 'deprecated'
  | 'unavailable'
  | 'coming-soon';

// Model interface
export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  version: string;
  description: string;
  capabilities: ModelCapability[];
  performance: ModelPerformance;
  availability: ModelAvailability;
  contextWindow: number;
  maxTokens: number;
  inputCostPer1K: number;
  outputCostPer1K: number;
  speed: 'slow' | 'medium' | 'fast';
  quality: 'basic' | 'good' | 'excellent';
  languages: string[];
  features: string[];
  limitations: string[];
  lastUpdated: string;
  documentation?: string;
  apiEndpoint?: string;
}

// Model filter interface
export interface ModelFilter {
  providers?: AIProvider[];
  capabilities?: ModelCapability[];
  performance?: ModelPerformance[];
  availability?: ModelAvailability[];
  maxCost?: number;
  minContextWindow?: number;
  maxContextWindow?: number;
  speed?: ('slow' | 'medium' | 'fast')[];
  quality?: ('basic' | 'good' | 'excellent')[];
  languages?: string[];
  searchTerm?: string;
}

// Model comparison interface
export interface ModelComparison {
  models: AIModel[];
  comparisonFields: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ModelSelector props interface
export interface ModelSelectorProps extends BaseProps {
  // Display configuration
  variant?: ModelSelectorVariants;
  size?: ModelSelectorSizes;
  state?: ModelSelectorStates;
  
  // Model data
  models?: AIModel[];
  selectedModel?: AIModel;
  filter?: ModelFilter;
  comparison?: ModelComparison;
  
  // Display options
  showProvider?: boolean;
  showCapabilities?: boolean;
  showPerformance?: boolean;
  showCost?: boolean;
  showAvailability?: boolean;
  showComparison?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  
  // Selection behavior
  multiSelect?: boolean;
  allowDeselect?: boolean;
  autoSelect?: boolean;
  
  // Filtering and search
  enableFiltering?: boolean;
  enableSearch?: boolean;
  enableSorting?: boolean;
  
  // Event handlers
  onModelSelect?: (model: AIModel) => void;
  onModelDeselect?: (model: AIModel) => void;
  onFilterChange?: (filter: ModelFilter) => void;
  onSearchChange?: (searchTerm: string) => void;
  onComparisonChange?: (comparison: ModelComparison) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// ModelSelector configuration interface
export interface ModelSelectorConfig {
  variant: ModelSelectorVariants;
  size: ModelSelectorSizes;
  state: ModelSelectorStates;
  showProvider: boolean;
  showCapabilities: boolean;
  showPerformance: boolean;
  showCost: boolean;
  showAvailability: boolean;
  showComparison: boolean;
  showFilters: boolean;
  showSearch: boolean;
  multiSelect: boolean;
  allowDeselect: boolean;
  autoSelect: boolean;
  enableFiltering: boolean;
  enableSearch: boolean;
  enableSorting: boolean;
}

// ModelSelector style configuration
export interface ModelSelectorStyleConfig {
  container: Record<string, any>;
  header: Record<string, any>;
  content: Record<string, any>;
  model: Record<string, any>;
  selected: Record<string, any>;
  filter: Record<string, any>;
  search: Record<string, any>;
  comparison: Record<string, any>;
  provider: Record<string, any>;
  capability: Record<string, any>;
  performance: Record<string, any>;
  cost: Record<string, any>;
  availability: Record<string, any>;
}

// ModelSelector events
export interface ModelSelectorModelSelectEvent {
  type: 'modelSelect';
  model: AIModel;
}

export interface ModelSelectorModelDeselectEvent {
  type: 'modelDeselect';
  model: AIModel;
}

export interface ModelSelectorFilterChangeEvent {
  type: 'filterChange';
  filter: ModelFilter;
}

export interface ModelSelectorSearchChangeEvent {
  type: 'searchChange';
  searchTerm: string;
}

export interface ModelSelectorComparisonChangeEvent {
  type: 'comparisonChange';
  comparison: ModelComparison;
}

export interface ModelSelectorFocusEvent {
  type: 'focus';
}

export interface ModelSelectorBlurEvent {
  type: 'blur';
}

export type ModelSelectorEvent = 
  | ModelSelectorModelSelectEvent
  | ModelSelectorModelDeselectEvent
  | ModelSelectorFilterChangeEvent
  | ModelSelectorSearchChangeEvent
  | ModelSelectorComparisonChangeEvent
  | ModelSelectorFocusEvent
  | ModelSelectorBlurEvent;

// ModelSelector validation result
export interface ModelSelectorValidationResult {
  success: boolean;
  data?: ModelSelectorProps;
  errors?: Error;
  warnings?: string[];
}

// ModelSelector factory options
export interface ModelSelectorFactoryOptions {
  defaultVariant?: ModelSelectorVariants;
  defaultSize?: ModelSelectorSizes;
  defaultState?: ModelSelectorStates;
  defaultProvider?: AIProvider;
  theme?: any;
  parent?: any;
}

// ModelSelector group props for multiple selectors
export interface ModelSelectorGroupProps extends BaseProps {
  selectors: ModelSelectorProps[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showGroupComparison?: boolean;
  onSelectorSelect?: (selectorId: string) => void;
}

// Model list item interface
export interface ModelListItem {
  model: AIModel;
  selected: boolean;
  filtered: boolean;
  highlighted: boolean;
  index: number;
}

// Model search result interface
export interface ModelSearchResult {
  models: AIModel[];
  totalCount: number;
  filteredCount: number;
  searchTerm: string;
  filters: ModelFilter;
}

// Model recommendation interface
export interface ModelRecommendation {
  model: AIModel;
  reason: string;
  score: number;
  useCase: string;
  alternatives: AIModel[];
}