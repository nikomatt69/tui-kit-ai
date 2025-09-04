import { BaseProps } from '../../BaseComponent';

// StatusIndicator variants
export type StatusIndicatorVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'striped'
  | 'animated'
  | 'gradient';

// StatusIndicator sizes
export type StatusIndicatorSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// StatusIndicator states
export type StatusIndicatorStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'loading'
  | 'complete'
  | 'indeterminate';

// StatusIndicator types
export type StatusIndicatorType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// StatusIndicator style
export type StatusIndicatorStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Status types
export type StatusType = 'idle' | 'loading' | 'pending' | 'success' | 'complete' | 'warning' | 'error' | 'info';

// Timestamp format types
export type TimestampFormat = 'time' | 'date' | 'datetime';

// StatusIndicator props interface
export interface StatusIndicatorProps extends BaseProps {
  // Optional props
  variant?: StatusIndicatorVariants;
  size?: StatusIndicatorSizes;
  state?: StatusIndicatorStates;
  
  // StatusIndicator content
  status?: StatusType;
  label?: string;
  progress?: number;
  
  // StatusIndicator-specific styling
  statusIndicatorStyle?: StatusIndicatorStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: StatusIndicatorType;
  style?: StatusIndicatorStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // StatusIndicator behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  
  // StatusIndicator dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // StatusIndicator appearance
  borderStyle?: string;
  
  // Status display options
  showIcon?: boolean;
  showTimestamp?: boolean;
  showProgress?: boolean;
  showSeparator?: boolean;
  timestampFormat?: TimestampFormat;
  maxHistory?: number;
  
  // Custom icons
  successIcon?: string;
  errorIcon?: string;
  warningIcon?: string;
  infoIcon?: string;
  loadingIcon?: string;
  idleIcon?: string;
  pendingIcon?: string;
  completeIcon?: string;
  defaultIcon?: string;
  
  // Custom text
  successText?: string;
  errorText?: string;
  warningText?: string;
  infoText?: string;
  loadingText?: string;
  idleText?: string;
  pendingText?: string;
  completeText?: string;
  defaultText?: string;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onStatusChange?: (event: StatusIndicatorStatusChangeEvent) => void;
  onProgressChange?: (event: StatusIndicatorProgressChangeEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// StatusIndicator configuration for theming
export interface StatusIndicatorConfig {
  variant: StatusIndicatorVariants;
  size: StatusIndicatorSizes;
  state: StatusIndicatorStates;
  theme: any;
  type: StatusIndicatorType;
  style: StatusIndicatorStyle;
  status: StatusType;
  label?: string;
  progress?: number;
  showIcon: boolean;
  showTimestamp: boolean;
  showProgress: boolean;
  showSeparator: boolean;
}

// StatusIndicator style configuration
export interface StatusIndicatorStyleConfig {
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
  fillColor?: string;
  emptyColor?: string;
  striped?: boolean;
  animated?: boolean;
  gradient?: boolean;
}

// StatusIndicator event types
export interface StatusIndicatorStatusChangeEvent {
  type: 'statuschange';
  target: any;
  previousStatus: string;
  currentStatus: string;
  timestamp: number;
}

export interface StatusIndicatorProgressChangeEvent {
  type: 'progresschange';
  target: any;
  progress: number;
  timestamp: number;
}

export interface StatusIndicatorClickEvent {
  type: 'click';
  target: any;
  currentStatus: string;
  statusHistory: Array<{ status: string; timestamp: number }>;
}

export interface StatusIndicatorFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface StatusIndicatorMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface StatusIndicatorKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// StatusIndicator validation result
export interface StatusIndicatorValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: StatusIndicatorProps;
}

// StatusIndicator factory options
export interface StatusIndicatorFactoryOptions {
  defaultVariant?: StatusIndicatorVariants;
  defaultSize?: StatusIndicatorSizes;
  defaultState?: StatusIndicatorStates;
  theme?: any;
  parent?: any;
  defaultType?: StatusIndicatorType;
  defaultStyle?: StatusIndicatorStyle;
  defaultStatus?: StatusType;
  defaultLabel?: string;
  defaultProgress?: number;
  defaultShowIcon?: boolean;
  defaultShowTimestamp?: boolean;
  defaultShowProgress?: boolean;
  defaultShowSeparator?: boolean;
}

// StatusIndicator group props
export interface StatusIndicatorGroupProps extends BaseProps {
  statusIndicators: StatusIndicatorProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: StatusIndicatorVariants;
  size?: StatusIndicatorSizes;
  onStatusIndicatorClick?: (statusIndicatorIndex: number, event: any) => void;
}

// StatusIndicator layout props
export interface StatusIndicatorLayoutProps extends BaseProps {
  statusIndicators: StatusIndicatorProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: StatusIndicatorVariants;
  size?: StatusIndicatorSizes;
  onLayoutChange?: (layout: any) => void;
}

// StatusIndicator theme props
export interface StatusIndicatorThemeProps extends StatusIndicatorProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}