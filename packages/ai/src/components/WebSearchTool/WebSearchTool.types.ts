import { BaseProps } from '../../../core/src/components/BaseComponent';

// WebSearchTool variants
export type WebSearchToolVariants = 
  | 'default'
  | 'compact'
  | 'detailed'
  | 'minimal'
  | 'expanded';

// WebSearchTool sizes
export type WebSearchToolSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// WebSearchTool states
export type WebSearchToolStates = 
  | 'default'
  | 'loading'
  | 'error'
  | 'success'
  | 'focused'
  | 'disabled';

// Search engines
export type SearchEngine = 
  | 'google'
  | 'bing'
  | 'duckduckgo'
  | 'yahoo'
  | 'brave'
  | 'custom';

// Search result types
export type SearchResultType = 
  | 'webpage'
  | 'news'
  | 'image'
  | 'video'
  | 'shopping'
  | 'academic'
  | 'social'
  | 'local'
  | 'definition'
  | 'calculator';

// Search result interface
export interface SearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
  type: SearchResultType;
  source: string;
  timestamp: number;
  relevance: number;
  metadata?: {
    author?: string;
    publishedDate?: string;
    imageUrl?: string;
    videoUrl?: string;
    price?: string;
    rating?: number;
    reviews?: number;
    location?: string;
    category?: string;
    tags?: string[];
  };
}

// Search query interface
export interface SearchQuery {
  id: string;
  query: string;
  engine: SearchEngine;
  filters: SearchFilters;
  timestamp: number;
  results: SearchResult[];
  totalResults: number;
  searchTime: number;
}

// Search filters interface
export interface SearchFilters {
  resultType?: SearchResultType[];
  language?: string;
  region?: string;
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
  safeSearch?: 'off' | 'moderate' | 'strict';
  domain?: string;
  excludeDomain?: string[];
  fileType?: string;
  imageSize?: 'small' | 'medium' | 'large' | 'xlarge';
  imageColor?: 'color' | 'grayscale' | 'transparent';
  videoDuration?: 'short' | 'medium' | 'long';
  videoQuality?: 'hd' | 'sd';
}

// Search history item interface
export interface SearchHistoryItem {
  id: string;
  query: string;
  engine: SearchEngine;
  timestamp: number;
  resultCount: number;
  clickedResults: string[];
}

// WebSearchTool props interface
export interface WebSearchToolProps extends BaseProps {
  // Display configuration
  variant?: WebSearchToolVariants;
  size?: WebSearchToolSizes;
  state?: WebSearchToolStates;
  
  // Search configuration
  defaultEngine?: SearchEngine;
  searchHistory?: SearchHistoryItem[];
  currentQuery?: SearchQuery;
  results?: SearchResult[];
  
  // Display options
  showSearchBar?: boolean;
  showFilters?: boolean;
  showHistory?: boolean;
  showResults?: boolean;
  showMetadata?: boolean;
  showPreview?: boolean;
  showStats?: boolean;
  
  // Search behavior
  autoSearch?: boolean;
  searchOnEnter?: boolean;
  maxResults?: number;
  cacheResults?: boolean;
  cacheTimeout?: number;
  
  // Filtering and sorting
  enableFiltering?: boolean;
  enableSorting?: boolean;
  defaultSort?: 'relevance' | 'date' | 'title';
  
  // Event handlers
  onSearch?: (query: string, engine: SearchEngine, filters: SearchFilters) => void;
  onResultClick?: (result: SearchResult) => void;
  onResultPreview?: (result: SearchResult) => void;
  onFilterChange?: (filters: SearchFilters) => void;
  onEngineChange?: (engine: SearchEngine) => void;
  onHistorySelect?: (historyItem: SearchHistoryItem) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// WebSearchTool configuration interface
export interface WebSearchToolConfig {
  variant: WebSearchToolVariants;
  size: WebSearchToolSizes;
  state: WebSearchToolStates;
  defaultEngine: SearchEngine;
  showSearchBar: boolean;
  showFilters: boolean;
  showHistory: boolean;
  showResults: boolean;
  showMetadata: boolean;
  showPreview: boolean;
  showStats: boolean;
  autoSearch: boolean;
  searchOnEnter: boolean;
  maxResults: number;
  cacheResults: boolean;
  cacheTimeout: number;
  enableFiltering: boolean;
  enableSorting: boolean;
  defaultSort: 'relevance' | 'date' | 'title';
}

// WebSearchTool style configuration
export interface WebSearchToolStyleConfig {
  container: Record<string, any>;
  header: Record<string, any>;
  searchBar: Record<string, any>;
  filters: Record<string, any>;
  history: Record<string, any>;
  results: Record<string, any>;
  result: Record<string, any>;
  metadata: Record<string, any>;
  preview: Record<string, any>;
  stats: Record<string, any>;
}

// WebSearchTool events
export interface WebSearchToolSearchEvent {
  type: 'search';
  query: string;
  engine: SearchEngine;
  filters: SearchFilters;
}

export interface WebSearchToolResultClickEvent {
  type: 'resultClick';
  result: SearchResult;
}

export interface WebSearchToolResultPreviewEvent {
  type: 'resultPreview';
  result: SearchResult;
}

export interface WebSearchToolFilterChangeEvent {
  type: 'filterChange';
  filters: SearchFilters;
}

export interface WebSearchToolEngineChangeEvent {
  type: 'engineChange';
  engine: SearchEngine;
}

export interface WebSearchToolHistorySelectEvent {
  type: 'historySelect';
  historyItem: SearchHistoryItem;
}

export interface WebSearchToolFocusEvent {
  type: 'focus';
}

export interface WebSearchToolBlurEvent {
  type: 'blur';
}

export type WebSearchToolEvent = 
  | WebSearchToolSearchEvent
  | WebSearchToolResultClickEvent
  | WebSearchToolResultPreviewEvent
  | WebSearchToolFilterChangeEvent
  | WebSearchToolEngineChangeEvent
  | WebSearchToolHistorySelectEvent
  | WebSearchToolFocusEvent
  | WebSearchToolBlurEvent;

// WebSearchTool validation result
export interface WebSearchToolValidationResult {
  success: boolean;
  data?: WebSearchToolProps;
  errors?: Error;
  warnings?: string[];
}

// WebSearchTool factory options
export interface WebSearchToolFactoryOptions {
  defaultVariant?: WebSearchToolVariants;
  defaultSize?: WebSearchToolSizes;
  defaultState?: WebSearchToolStates;
  defaultEngine?: SearchEngine;
  theme?: any;
  parent?: any;
}

// WebSearchTool group props for multiple search tools
export interface WebSearchToolGroupProps extends BaseProps {
  searchTools: WebSearchToolProps[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showGroupHistory?: boolean;
  onSearchToolSelect?: (searchToolId: string) => void;
}

// Search suggestion interface
export interface SearchSuggestion {
  text: string;
  type: 'query' | 'url' | 'history';
  relevance: number;
}

// Search statistics interface
export interface SearchStats {
  totalQueries: number;
  totalResults: number;
  averageResultsPerQuery: number;
  mostUsedEngine: SearchEngine;
  searchTime: number;
  cacheHitRate: number;
  topQueries: string[];
  topDomains: string[];
}

// Search cache interface
export interface SearchCache {
  queries: Map<string, SearchQuery>;
  results: Map<string, SearchResult[]>;
  lastUpdated: number;
  maxSize: number;
  timeout: number;
}

// Search API configuration interface
export interface SearchAPIConfig {
  engine: SearchEngine;
  apiKey?: string;
  baseUrl?: string;
  rateLimit?: number;
  timeout?: number;
  userAgent?: string;
  proxy?: string;
}

// Search result preview interface
export interface SearchResultPreview {
  result: SearchResult;
  content: string;
  images: string[];
  links: string[];
  metadata: Record<string, any>;
  loading: boolean;
  error?: string;
}