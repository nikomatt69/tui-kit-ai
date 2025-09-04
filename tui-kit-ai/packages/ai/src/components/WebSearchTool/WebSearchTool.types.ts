import { z } from 'zod';

// Search Engines
export const SearchEngineSchema = z.enum([
  'google',
  'bing',
  'duckduckgo',
  'yahoo',
  'brave',
  'custom'
]);

export type SearchEngine = z.infer<typeof SearchEngineSchema>;

// Search Result Types
export const SearchResultTypeSchema = z.enum([
  'webpage',
  'news',
  'image',
  'video',
  'shopping',
  'academic',
  'social',
  'local',
  'definition',
  'calculator',
  'conversion',
  'weather',
  'stock',
  'flight',
  'recipe'
]);

export type SearchResultType = z.infer<typeof SearchResultTypeSchema>;

// Search Result
export interface SearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
  snippet: string;
  type: SearchResultType;
  source: string;
  publishedDate?: Date;
  author?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  domain: string;
  language: string;
  relevanceScore: number;
  metadata: Record<string, any>;
}

// Search Query
export interface SearchQuery {
  query: string;
  engine: SearchEngine;
  type: SearchResultType;
  language: string;
  region: string;
  safeSearch: boolean;
  numResults: number;
  startIndex: number;
  filters: SearchFilter;
  customParams: Record<string, any>;
}

// Search Filter
export interface SearchFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  domain?: string[];
  excludeDomain?: string[];
  fileType?: string[];
  language?: string[];
  region?: string[];
  safeSearch?: boolean;
  exactPhrase?: boolean;
  excludeWords?: string[];
  includeWords?: string[];
}

// Search History
export interface SearchHistory {
  id: string;
  query: string;
  engine: SearchEngine;
  timestamp: Date;
  resultCount: number;
  results: SearchResult[];
}

// Search Statistics
export interface SearchStats {
  totalQueries: number;
  totalResults: number;
  averageResultsPerQuery: number;
  mostUsedEngine: SearchEngine;
  mostUsedType: SearchResultType;
  searchFrequency: Record<string, number>;
  successRate: number;
  averageResponseTime: number;
}

// Web Search Tool Variants
export const WebSearchToolVariantSchema = z.enum([
  'default',
  'compact',
  'detailed',
  'minimal',
  'expanded'
]);

export type WebSearchToolVariant = z.infer<typeof WebSearchToolVariantSchema>;

// Web Search Tool States
export const WebSearchToolStateSchema = z.enum([
  'default',
  'loading',
  'error',
  'success',
  'focused',
  'disabled'
]);

export type WebSearchToolState = z.infer<typeof WebSearchToolStateSchema>;

// Web Search Tool Props Schema
export const WebSearchToolPropsSchema = z.object({
  variant: WebSearchToolVariantSchema.default('default'),
  state: WebSearchToolStateSchema.default('default'),
  defaultEngine: SearchEngineSchema.default('google'),
  defaultType: SearchResultTypeSchema.default('webpage'),
  searchHistory: z.array(z.object({
    id: z.string(),
    query: z.string(),
    engine: SearchEngineSchema,
    timestamp: z.date(),
    resultCount: z.number(),
    results: z.array(z.object({
      id: z.string(),
      title: z.string(),
      url: z.string(),
      description: z.string(),
      snippet: z.string(),
      type: SearchResultTypeSchema,
      source: z.string(),
      publishedDate: z.date().optional(),
      author: z.string().optional(),
      imageUrl: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      domain: z.string(),
      language: z.string(),
      relevanceScore: z.number(),
      metadata: z.record(z.any())
    }))
  })).default([]),
  currentResults: z.array(z.object({
    id: z.string(),
    title: z.string(),
    url: z.string(),
    description: z.string(),
    snippet: z.string(),
    type: SearchResultTypeSchema,
    source: z.string(),
    publishedDate: z.date().optional(),
    author: z.string().optional(),
    imageUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    domain: z.string(),
    language: z.string(),
    relevanceScore: z.number(),
    metadata: z.record(z.any())
  })).default([]),
  stats: z.object({
    totalQueries: z.number().default(0),
    totalResults: z.number().default(0),
    averageResultsPerQuery: z.number().default(0),
    mostUsedEngine: SearchEngineSchema.default('google'),
    mostUsedType: SearchResultTypeSchema.default('webpage'),
    searchFrequency: z.record(z.number()).default({}),
    successRate: z.number().default(0),
    averageResponseTime: z.number().default(0)
  }).optional(),
  showFilters: z.boolean().default(true),
  showHistory: z.boolean().default(true),
  showStats: z.boolean().default(false),
  showResults: z.boolean().default(true),
  showEngines: z.boolean().default(true),
  showTypes: z.boolean().default(true),
  maxHistoryItems: z.number().default(50),
  maxResultsPerPage: z.number().default(10),
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
  onSearch: z.function().optional(),
  onResultClick: z.function().optional(),
  onEngineChange: z.function().optional(),
  onTypeChange: z.function().optional(),
  onFilterChange: z.function().optional(),
  onHistoryItemClick: z.function().optional(),
  onHistoryClear: z.function().optional(),
  onStatsUpdate: z.function().optional()
});

export type WebSearchToolProps = z.infer<typeof WebSearchToolPropsSchema>;

// Web Search Tool Events
export interface WebSearchToolEvents {
  search: (query: SearchQuery) => void;
  resultClick: (result: SearchResult) => void;
  engineChange: (engine: SearchEngine) => void;
  typeChange: (type: SearchResultType) => void;
  filterChange: (filter: SearchFilter) => void;
  historyItemClick: (historyItem: SearchHistory) => void;
  historyClear: () => void;
  statsUpdate: (stats: SearchStats) => void;
  export: (data: any) => void;
  refresh: () => void;
}

// Web Search Tool Methods
export interface WebSearchToolMethods {
  search: (query: string, options?: Partial<SearchQuery>) => Promise<SearchResult[]>;
  getResults: () => SearchResult[];
  getHistory: () => SearchHistory[];
  getStats: () => SearchStats;
  clearHistory: () => void;
  setEngine: (engine: SearchEngine) => void;
  getEngine: () => SearchEngine;
  setType: (type: SearchResultType) => void;
  getType: () => SearchResultType;
  setFilter: (filter: SearchFilter) => void;
  getFilter: () => SearchFilter;
  clearFilter: () => void;
  exportResults: (format: 'json' | 'csv' | 'txt') => string;
  exportHistory: (format: 'json' | 'csv' | 'txt') => string;
  refreshStats: () => void;
  addToHistory: (query: string, results: SearchResult[]) => void;
  removeFromHistory: (historyId: string) => void;
  getResultById: (resultId: string) => SearchResult | null;
  getResultsByType: (type: SearchResultType) => SearchResult[];
  getResultsByDomain: (domain: string) => SearchResult[];
  sortResults: (criteria: string, order: 'asc' | 'desc') => SearchResult[];
  filterResults: (filter: SearchFilter) => SearchResult[];
  getSearchSuggestions: (query: string) => string[];
  validateQuery: (query: string) => boolean;
  getQueryStats: (query: string) => {
    frequency: number;
    lastUsed: Date;
    averageResults: number;
    successRate: number;
  };
}

// Search Engine Interface
export interface SearchEngineInterface {
  name: SearchEngine;
  displayName: string;
  baseUrl: string;
  apiEndpoint?: string;
  supportedTypes: SearchResultType[];
  maxResults: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  features: string[];
  search: (query: SearchQuery) => Promise<SearchResult[]>;
  getSuggestions: (query: string) => Promise<string[]>;
  validateQuery: (query: string) => boolean;
}

// Search Result Processor
export interface SearchResultProcessor {
  process: (rawResults: any[], engine: SearchEngine) => SearchResult[];
  validate: (result: SearchResult) => boolean;
  enhance: (result: SearchResult) => SearchResult;
  deduplicate: (results: SearchResult[]) => SearchResult[];
  rank: (results: SearchResult[], query: string) => SearchResult[];
}

// Search Analytics
export interface SearchAnalytics {
  trackSearch: (query: string, engine: SearchEngine, resultCount: number, responseTime: number) => void;
  trackClick: (result: SearchResult) => void;
  getTrends: (period: 'daily' | 'weekly' | 'monthly') => {
    queries: string[];
    engines: Record<SearchEngine, number>;
    types: Record<SearchResultType, number>;
    domains: Record<string, number>;
  };
  getInsights: () => {
    popularQueries: string[];
    trendingTopics: string[];
    searchPatterns: string[];
    userBehavior: Record<string, any>;
  };
}

// Search Cache
export interface SearchCache {
  get: (key: string) => SearchResult[] | null;
  set: (key: string, results: SearchResult[], ttl?: number) => void;
  clear: () => void;
  has: (key: string) => boolean;
  size: () => number;
  keys: () => string[];
}

// Search Validator
export interface SearchValidator {
  validateQuery: (query: string) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  };
  validateFilter: (filter: SearchFilter) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  validateResult: (result: SearchResult) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}