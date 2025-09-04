import { z } from 'zod';

// AI Providers
export const ProviderSchema = z.enum([
  'openai',
  'anthropic',
  'google',
  'meta',
  'microsoft',
  'amazon',
  'cohere',
  'huggingface',
  'local',
  'custom'
]);

export type Provider = z.infer<typeof ProviderSchema>;

// Model Capabilities
export const CapabilitySchema = z.enum([
  'text-generation',
  'code-generation',
  'image-generation',
  'function-calling',
  'tool-use',
  'multimodal',
  'embeddings',
  'fine-tuning',
  'chat',
  'completion',
  'summarization',
  'translation',
  'question-answering',
  'sentiment-analysis',
  'classification'
]);

export type Capability = z.infer<typeof CapabilitySchema>;

// Model Performance Levels
export const PerformanceLevelSchema = z.enum([
  'basic',
  'standard',
  'advanced',
  'premium',
  'enterprise'
]);

export type PerformanceLevel = z.infer<typeof PerformanceLevelSchema>;

// Model Availability
export const AvailabilitySchema = z.enum([
  'available',
  'limited',
  'beta',
  'deprecated',
  'unavailable'
]);

export type Availability = z.infer<typeof AvailabilitySchema>;

// Model Information
export interface ModelInfo {
  id: string;
  name: string;
  provider: Provider;
  version: string;
  description: string;
  capabilities: Capability[];
  performance: PerformanceLevel;
  availability: Availability;
  maxTokens: number;
  inputCostPer1K: number;
  outputCostPer1K: number;
  currency: string;
  contextWindow: number;
  trainingData: string;
  releaseDate: string;
  lastUpdated: string;
  documentation: string;
  apiEndpoint?: string;
  customConfig?: Record<string, any>;
}

// Model Comparison
export interface ModelComparison {
  models: ModelInfo[];
  criteria: string[];
  scores: Record<string, Record<string, number>>;
  recommendations: string[];
}

// Model Filter
export interface ModelFilter {
  providers?: Provider[];
  capabilities?: Capability[];
  performance?: PerformanceLevel[];
  availability?: Availability[];
  maxCost?: number;
  minTokens?: number;
  maxTokens?: number;
  searchQuery?: string;
}

// Model Selector Variants
export const ModelSelectorVariantSchema = z.enum([
  'default',
  'compact',
  'detailed',
  'minimal',
  'expanded'
]);

export type ModelSelectorVariant = z.infer<typeof ModelSelectorVariantSchema>;

// Model Selector States
export const ModelSelectorStateSchema = z.enum([
  'default',
  'loading',
  'error',
  'success',
  'focused',
  'disabled'
]);

export type ModelSelectorState = z.infer<typeof ModelSelectorStateSchema>;

// Model Selector Props Schema
export const ModelSelectorPropsSchema = z.object({
  variant: ModelSelectorVariantSchema.default('default'),
  state: ModelSelectorStateSchema.default('default'),
  models: z.array(z.object({
    id: z.string(),
    name: z.string(),
    provider: ProviderSchema,
    version: z.string(),
    description: z.string(),
    capabilities: z.array(CapabilitySchema),
    performance: PerformanceLevelSchema,
    availability: AvailabilitySchema,
    maxTokens: z.number(),
    inputCostPer1K: z.number(),
    outputCostPer1K: z.number(),
    currency: z.string(),
    contextWindow: z.number(),
    trainingData: z.string(),
    releaseDate: z.string(),
    lastUpdated: z.string(),
    documentation: z.string(),
    apiEndpoint: z.string().optional(),
    customConfig: z.record(z.any()).optional()
  })).default([]),
  selectedModel: z.string().optional(),
  filter: z.object({
    providers: z.array(ProviderSchema).optional(),
    capabilities: z.array(CapabilitySchema).optional(),
    performance: z.array(PerformanceLevelSchema).optional(),
    availability: z.array(AvailabilitySchema).optional(),
    maxCost: z.number().optional(),
    minTokens: z.number().optional(),
    maxTokens: z.number().optional(),
    searchQuery: z.string().optional()
  }).optional(),
  showProvider: z.boolean().default(true),
  showCapabilities: z.boolean().default(true),
  showPerformance: z.boolean().default(true),
  showCost: z.boolean().default(true),
  showAvailability: z.boolean().default(true),
  showComparison: z.boolean().default(false),
  showFilters: z.boolean().default(true),
  showSearch: z.boolean().default(true),
  showDetails: z.boolean().default(false),
  width: z.number().default(80),
  height: z.number().default(20),
  theme: z.object({
    primary: z.string().default('#00ff00'),
    secondary: z.string().default('#0088ff'),
    success: z.string().default('#00ff00'),
    warning: z.string().default('#ffaa00'),
    error: z.string().default('#ff0000'),
    background: z.string().default('#000000'),
    foreground: z.string().default('#ffffff'),
    border: z.string().default('#333333'),
    accent: z.string().default('#ff6b6b'),
    info: z.string().default('#4ecdc4')
  }).optional(),
  onModelSelect: z.function().optional(),
  onModelChange: z.function().optional(),
  onFilterChange: z.function().optional(),
  onComparisonToggle: z.function().optional(),
  onProviderChange: z.function().optional(),
  onCapabilityChange: z.function().optional(),
  onPerformanceChange: z.function().optional(),
  onCostChange: z.function().optional(),
  onAvailabilityChange: z.function().optional()
});

export type ModelSelectorProps = z.infer<typeof ModelSelectorPropsSchema>;

// Model Selector Events
export interface ModelSelectorEvents {
  modelSelect: (model: ModelInfo) => void;
  modelChange: (model: ModelInfo) => void;
  filterChange: (filter: ModelFilter) => void;
  comparisonToggle: (enabled: boolean) => void;
  providerChange: (provider: Provider) => void;
  capabilityChange: (capability: Capability) => void;
  performanceChange: (performance: PerformanceLevel) => void;
  costChange: (cost: number) => void;
  availabilityChange: (availability: Availability) => void;
  search: (query: string) => void;
  refresh: () => void;
  export: (models: ModelInfo[]) => void;
}

// Model Selector Methods
export interface ModelSelectorMethods {
  selectModel: (modelId: string) => void;
  getSelectedModel: () => ModelInfo | null;
  getModels: () => ModelInfo[];
  getFilteredModels: () => ModelInfo[];
  setFilter: (filter: ModelFilter) => void;
  getFilter: () => ModelFilter;
  clearFilter: () => void;
  searchModels: (query: string) => ModelInfo[];
  compareModels: (modelIds: string[]) => ModelComparison;
  getRecommendations: (criteria: string[]) => ModelInfo[];
  refreshModels: () => void;
  exportModels: (format: 'json' | 'csv' | 'txt') => string;
  addModel: (model: ModelInfo) => void;
  removeModel: (modelId: string) => void;
  updateModel: (modelId: string, updates: Partial<ModelInfo>) => void;
  getModelById: (modelId: string) => ModelInfo | null;
  getModelsByProvider: (provider: Provider) => ModelInfo[];
  getModelsByCapability: (capability: Capability) => ModelInfo[];
  getModelsByPerformance: (performance: PerformanceLevel) => ModelInfo[];
  getModelsByAvailability: (availability: Availability) => ModelInfo[];
  getModelsByCost: (maxCost: number) => ModelInfo[];
  getModelsByTokens: (minTokens: number, maxTokens?: number) => ModelInfo[];
  sortModels: (criteria: string, order: 'asc' | 'desc') => ModelInfo[];
  getModelStats: () => {
    total: number;
    byProvider: Record<Provider, number>;
    byCapability: Record<Capability, number>;
    byPerformance: Record<PerformanceLevel, number>;
    byAvailability: Record<Availability, number>;
  };
}

// Model Repository
export interface ModelRepository {
  getModels: () => Promise<ModelInfo[]>;
  getModel: (id: string) => Promise<ModelInfo | null>;
  addModel: (model: ModelInfo) => Promise<void>;
  updateModel: (id: string, updates: Partial<ModelInfo>) => Promise<void>;
  removeModel: (id: string) => Promise<void>;
  searchModels: (query: string) => Promise<ModelInfo[]>;
  getModelsByProvider: (provider: Provider) => Promise<ModelInfo[]>;
  getModelsByCapability: (capability: Capability) => Promise<ModelInfo[]>;
  syncModels: () => Promise<void>;
}

// Model Validator
export interface ModelValidator {
  validateModel: (model: ModelInfo) => boolean;
  validateProvider: (provider: Provider) => boolean;
  validateCapability: (capability: Capability) => boolean;
  validatePerformance: (performance: PerformanceLevel) => boolean;
  validateAvailability: (availability: Availability) => boolean;
  getValidationErrors: (model: ModelInfo) => string[];
}

// Model Comparator
export interface ModelComparator {
  compare: (model1: ModelInfo, model2: ModelInfo, criteria: string[]) => number;
  rank: (models: ModelInfo[], criteria: string[]) => ModelInfo[];
  getSimilarity: (model1: ModelInfo, model2: ModelInfo) => number;
  getRecommendations: (model: ModelInfo, models: ModelInfo[]) => ModelInfo[];
}

// Model Analytics
export interface ModelAnalytics {
  getUsageStats: (modelId: string) => {
    totalRequests: number;
    averageResponseTime: number;
    successRate: number;
    costPerRequest: number;
    lastUsed: Date;
  };
  getTrends: (modelId: string, period: 'daily' | 'weekly' | 'monthly') => {
    usage: number[];
    cost: number[];
    performance: number[];
  };
  getPerformanceMetrics: (modelId: string) => {
    accuracy: number;
    speed: number;
    reliability: number;
    costEfficiency: number;
  };
}