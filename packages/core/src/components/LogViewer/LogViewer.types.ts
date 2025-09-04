import { BaseProps } from '../../BaseComponent';

// LogViewer variants
export type LogViewerVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'terminal';

// LogViewer sizes
export type LogViewerSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// LogViewer states
export type LogViewerStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'loading';

// Log level types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Log entry interface
export interface LogEntry {
  timestamp?: string;
  level?: LogLevel;
  message: string;
  source?: string;
  metadata?: Record<string, any>;
}

// LogViewer props interface
export interface LogViewerProps extends BaseProps {
  // Optional props
  variant?: LogViewerVariants;
  size?: LogViewerSizes;
  state?: LogViewerStates;
  
  // LogViewer content
  logs?: LogEntry[];
  emptyMessage?: string;
  
  // LogViewer-specific styling
  logStyle?: 'default' | 'compact' | 'detailed' | 'minimal' | 'terminal';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  
  // Display options
  showLineNumbers?: boolean;
  showTimestamp?: boolean;
  showLevel?: boolean;
  showSource?: boolean;
  compact?: boolean;
  monospace?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // LogViewer behavior
  clickable?: boolean;
  interactive?: boolean;
  autoScroll?: boolean;
  follow?: boolean;
  
  // Log management
  maxLines?: number;
  maxLogs?: number;
  retention?: 'all' | 'latest' | 'custom';
  
  // Filtering and search
  filterLevel?: LogLevel[];
  searchQuery?: string;
  highlightMatches?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onLogAdded?: (event: LogViewerLogAddedEvent) => void;
  onLogsCleared?: (event: LogViewerLogsClearedEvent) => void;
  onScroll?: (event: LogViewerScrollEvent) => void;
  onFilterChange?: (levels: LogLevel[]) => void;
  onSearchChange?: (query: string) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// LogViewer configuration for theming
export interface LogViewerConfig {
  variant: LogViewerVariants;
  size: LogViewerSizes;
  state: LogViewerStates;
  theme: any;
  logs: LogEntry[];
  maxLines: number;
  showLineNumbers: boolean;
  showTimestamp: boolean;
  showLevel: boolean;
  autoScroll: boolean;
}

// LogViewer style configuration
export interface LogViewerStyleConfig {
  bg: string;
  fg: string;
  border: {
    type: string;
    fg: string;
    bg?: string;
  };
  padding: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  align: 'left' | 'center' | 'right';
  valign: 'top' | 'middle' | 'bottom';
  bold?: boolean;
  underline?: boolean;
  monospace?: boolean;
  scrollable?: boolean;
}

// LogViewer event types
export interface LogViewerLogAddedEvent {
  type: 'logadded';
  target: any;
  log: LogEntry;
  totalLogs: number;
}

export interface LogViewerLogsClearedEvent {
  type: 'logscleared';
  target: any;
}

export interface LogViewerScrollEvent {
  type: 'scroll';
  target: any;
  position: number;
  maxScroll: number;
}

export interface LogViewerFilterEvent {
  type: 'filter';
  target: any;
  levels: LogLevel[];
}

export interface LogViewerSearchEvent {
  type: 'search';
  target: any;
  query: string;
  matches: number;
}

export interface LogViewerClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

export interface LogViewerFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface LogViewerMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface LogViewerKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// LogViewer validation result
export interface LogViewerValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: LogViewerProps;
}

// LogViewer factory options
export interface LogViewerFactoryOptions {
  defaultVariant?: LogViewerVariants;
  defaultSize?: LogViewerSizes;
  defaultState?: LogViewerStates;
  theme?: any;
  parent?: any;
  defaultLogs?: LogEntry[];
  defaultMaxLines?: number;
  defaultShowLineNumbers?: boolean;
  defaultShowTimestamp?: boolean;
  defaultShowLevel?: boolean;
  defaultAutoScroll?: boolean;
}

// LogViewer group props
export interface LogViewerGroupProps extends BaseProps {
  logViewers: LogViewerProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: LogViewerVariants;
  size?: LogViewerSizes;
  onLogViewerClick?: (viewerIndex: number, event: any) => void;
}

// LogViewer item
export interface LogViewerItem {
  logs: LogEntry[];
  maxLines: number;
  showLineNumbers: boolean;
  showTimestamp: boolean;
  showLevel: boolean;
  variant?: LogViewerVariants;
  size?: LogViewerSizes;
  autoScroll?: boolean;
}