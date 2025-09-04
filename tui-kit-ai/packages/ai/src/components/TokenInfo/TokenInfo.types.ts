import { z } from 'zod';

// Token Types
export const TokenTypeSchema = z.enum([
  'input',
  'output',
  'total',
  'prompt',
  'completion',
  'system',
  'user',
  'assistant',
  'context',
  'response',
  'custom'
]);

export type TokenType = z.infer<typeof TokenTypeSchema>;

// Token Info Variants
export const TokenInfoVariantSchema = z.enum([
  'default',
  'compact',
  'detailed',
  'minimal',
  'expanded'
]);

export type TokenInfoVariant = z.infer<typeof TokenInfoVariantSchema>;

// Token Info States
export const TokenInfoStateSchema = z.enum([
  'default',
  'loading',
  'error',
  'success',
  'focused',
  'warning',
  'critical'
]);

export type TokenInfoState = z.infer<typeof TokenInfoStateSchema>;

// Token Usage Data
export interface TokenUsage {
  type: TokenType;
  count: number;
  percentage: number;
  cost?: number;
  rate?: number;
  description?: string;
}

// Token Statistics
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
  customTokens: number;
  totalCost: number;
  averageCostPerToken: number;
  tokensPerSecond: number;
  startTime: number;
  endTime?: number;
  duration?: number;
}

// Cost Information
export interface CostInfo {
  model: string;
  inputCostPer1K: number;
  outputCostPer1K: number;
  currency: string;
  totalCost: number;
  breakdown: {
    input: number;
    output: number;
    system: number;
    custom: number;
  };
}

// Token Limits
export interface TokenLimits {
  maxTokens: number;
  maxInputTokens: number;
  maxOutputTokens: number;
  maxContextTokens: number;
  currentUsage: number;
  remainingTokens: number;
  usagePercentage: number;
}

// Token Breakdown
export interface TokenBreakdown {
  byType: TokenUsage[];
  byModel: Array<{
    model: string;
    tokens: number;
    cost: number;
    percentage: number;
  }>;
  byTime: Array<{
    timestamp: number;
    tokens: number;
    cost: number;
  }>;
  trends: {
    hourly: number[];
    daily: number[];
    weekly: number[];
  };
}

// Token Info Props Schema
export const TokenInfoPropsSchema = z.object({
  variant: TokenInfoVariantSchema.default('default'),
  state: TokenInfoStateSchema.default('default'),
  stats: z.object({
    totalTokens: z.number().default(0),
    inputTokens: z.number().default(0),
    outputTokens: z.number().default(0),
    promptTokens: z.number().default(0),
    completionTokens: z.number().default(0),
    systemTokens: z.number().default(0),
    userTokens: z.number().default(0),
    assistantTokens: z.number().default(0),
    contextTokens: z.number().default(0),
    responseTokens: z.number().default(0),
    customTokens: z.number().default(0),
    totalCost: z.number().default(0),
    averageCostPerToken: z.number().default(0),
    tokensPerSecond: z.number().default(0),
    startTime: z.number().default(0),
    endTime: z.number().optional(),
    duration: z.number().optional()
  }).optional(),
  costInfo: z.object({
    model: z.string().default(''),
    inputCostPer1K: z.number().default(0),
    outputCostPer1K: z.number().default(0),
    currency: z.string().default('USD'),
    totalCost: z.number().default(0),
    breakdown: z.object({
      input: z.number().default(0),
      output: z.number().default(0),
      system: z.number().default(0),
      custom: z.number().default(0)
    }).optional()
  }).optional(),
  limits: z.object({
    maxTokens: z.number().default(4096),
    maxInputTokens: z.number().default(2048),
    maxOutputTokens: z.number().default(2048),
    maxContextTokens: z.number().default(4096),
    currentUsage: z.number().default(0),
    remainingTokens: z.number().default(4096),
    usagePercentage: z.number().default(0)
  }).optional(),
  breakdown: z.object({
    byType: z.array(z.object({
      type: TokenTypeSchema,
      count: z.number(),
      percentage: z.number(),
      cost: z.number().optional(),
      rate: z.number().optional(),
      description: z.string().optional()
    })).default([]),
    byModel: z.array(z.object({
      model: z.string(),
      tokens: z.number(),
      cost: z.number(),
      percentage: z.number()
    })).default([]),
    byTime: z.array(z.object({
      timestamp: z.number(),
      tokens: z.number(),
      cost: z.number()
    })).default([]),
    trends: z.object({
      hourly: z.array(z.number()).default([]),
      daily: z.array(z.number()).default([]),
      weekly: z.array(z.number()).default([])
    }).optional()
  }).optional(),
  showCost: z.boolean().default(true),
  showBreakdown: z.boolean().default(true),
  showLimits: z.boolean().default(true),
  showTrends: z.boolean().default(false),
  showProgress: z.boolean().default(true),
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
  onTokenUpdate: z.function().optional(),
  onCostUpdate: z.function().optional(),
  onLimitReached: z.function().optional(),
  onBreakdownChange: z.function().optional(),
  onTrendUpdate: z.function().optional()
});

export type TokenInfoProps = z.infer<typeof TokenInfoPropsSchema>;

// Token Info Events
export interface TokenInfoEvents {
  tokenUpdate: (stats: TokenStats) => void;
  costUpdate: (costInfo: CostInfo) => void;
  limitReached: (limits: TokenLimits) => void;
  breakdownChange: (breakdown: TokenBreakdown) => void;
  trendUpdate: (trends: TokenBreakdown['trends']) => void;
  refresh: () => void;
  export: (data: any) => void;
}

// Token Info Methods
export interface TokenInfoMethods {
  updateStats: (stats: Partial<TokenStats>) => void;
  getStats: () => TokenStats;
  updateCostInfo: (costInfo: Partial<CostInfo>) => void;
  getCostInfo: () => CostInfo;
  updateLimits: (limits: Partial<TokenLimits>) => void;
  getLimits: () => TokenLimits;
  updateBreakdown: (breakdown: Partial<TokenBreakdown>) => void;
  getBreakdown: () => TokenBreakdown;
  addTokenUsage: (type: TokenType, count: number, cost?: number) => void;
  resetStats: () => void;
  calculateCost: (tokens: number, type: 'input' | 'output') => number;
  getUsagePercentage: () => number;
  isLimitReached: () => boolean;
  getRemainingTokens: () => number;
  exportData: (format: 'json' | 'csv' | 'txt') => string;
  refreshData: () => void;
  setModel: (model: string) => void;
  getModel: () => string;
  setCurrency: (currency: string) => void;
  getCurrency: () => string;
}

// Token Calculator
export interface TokenCalculator {
  calculateTokens: (text: string, model?: string) => number;
  estimateCost: (tokens: number, model: string, type: 'input' | 'output') => number;
  getModelInfo: (model: string) => {
    maxTokens: number;
    inputCostPer1K: number;
    outputCostPer1K: number;
    currency: string;
  };
  getSupportedModels: () => string[];
}

// Token Formatter
export interface TokenFormatter {
  formatTokens: (count: number) => string;
  formatCost: (cost: number, currency?: string) => string;
  formatPercentage: (percentage: number) => string;
  formatDuration: (duration: number) => string;
  formatBytes: (bytes: number) => string;
}

// Token Validator
export interface TokenValidator {
  validateTokenCount: (count: number, limits: TokenLimits) => boolean;
  validateCost: (cost: number) => boolean;
  validateModel: (model: string) => boolean;
  getValidationErrors: (data: any) => string[];
}

// Token Analytics
export interface TokenAnalytics {
  getTrends: (period: 'hourly' | 'daily' | 'weekly') => number[];
  getPeakUsage: () => { time: number; tokens: number };
  getAverageUsage: (period: 'hourly' | 'daily' | 'weekly') => number;
  getCostTrends: (period: 'hourly' | 'daily' | 'weekly') => number[];
  getEfficiencyMetrics: () => {
    tokensPerDollar: number;
    costPerToken: number;
    utilizationRate: number;
  };
}