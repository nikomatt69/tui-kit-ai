import { BaseProps } from '../../BaseComponent';

// StatusBar variants
export type StatusBarVariants = 
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

// StatusBar sizes
export type StatusBarSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// StatusBar states
export type StatusBarStates = 
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

// StatusBar types
export type StatusBarType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// StatusBar style
export type StatusBarStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// StatusBar item types
export type StatusItemType = 'info' | 'success' | 'warning' | 'error' | 'neutral';

// StatusBar item interface
export interface StatusItem {
  id: string;
  label: string;
  value: string;
  type?: StatusItemType;
  icon?: string;
  clickable?: boolean;
  metadata?: Record<string, any>;
}

// StatusBar props interface
export interface StatusBarProps extends BaseProps {
  // Optional props
  variant?: StatusBarVariants;
  size?: StatusBarSizes;
  state?: StatusBarStates;
  
  // StatusBar content
  title?: string;
  emptyMessage?: string;
  
  // StatusBar-specific styling
  statusBarStyle?: StatusBarStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: StatusBarType;
  style?: StatusBarStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // StatusBar behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  
  // StatusBar dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // StatusBar appearance
  items?: StatusItem[];
  borderStyle?: string;
  
  // StatusBar display options
  showLeftSection?: boolean;
  showCenterSection?: boolean;
  showRightSection?: boolean;
  showLabels?: boolean;
  showSeparators?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onItemSelect?: (event: StatusBarItemSelectEvent) => void;
  onItemActivate?: (event: StatusBarItemActivateEvent) => void;
  onItemAdd?: (event: StatusBarItemAddEvent) => void;
  onItemRemove?: (event: StatusBarItemRemoveEvent) => void;
  onItemUpdate?: (event: StatusBarItemUpdateEvent) => void;
  onItemsChange?: (event: StatusBarItemsChangeEvent) => void;
  onItemsClear?: (event: StatusBarItemsClearEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// StatusBar configuration for theming
export interface StatusBarConfig {
  variant: StatusBarVariants;
  size: StatusBarSizes;
  state: StatusBarStates;
  theme: any;
  type: StatusBarType;
  style: StatusBarStyle;
  title?: string;
  items: StatusItem[];
  showLeftSection: boolean;
  showCenterSection: boolean;
  showRightSection: boolean;
  showLabels: boolean;
  showSeparators: boolean;
}

// StatusBar style configuration
export interface StatusBarStyleConfig {
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

// StatusBar event types
export interface StatusBarItemSelectEvent {
  type: 'itemselect';
  target: any;
  item: StatusItem;
}

export interface StatusBarItemActivateEvent {
  type: 'itemactivate';
  target: any;
  item: StatusItem;
}

export interface StatusBarItemAddEvent {
  type: 'itemadd';
  target: any;
  item: StatusItem;
  totalItems: number;
}

export interface StatusBarItemRemoveEvent {
  type: 'itemremove';
  target: any;
  item: StatusItem;
  totalItems: number;
}

export interface StatusBarItemUpdateEvent {
  type: 'itemupdate';
  target: any;
  item: StatusItem;
  previousItem: StatusItem;
}

export interface StatusBarItemsChangeEvent {
  type: 'itemschange';
  target: any;
  items: StatusItem[];
  previousItems: StatusItem[];
}

export interface StatusBarItemsClearEvent {
  type: 'itemsclear';
  target: any;
}

export interface StatusBarClickEvent {
  type: 'click';
  target: any;
  items: StatusItem[];
  activeItem: string | null;
}

export interface StatusBarFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface StatusBarMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface StatusBarKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// StatusBar validation result
export interface StatusBarValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: StatusBarProps;
}

// StatusBar factory options
export interface StatusBarFactoryOptions {
  defaultVariant?: StatusBarVariants;
  defaultSize?: StatusBarSizes;
  defaultState?: StatusBarStates;
  theme?: any;
  parent?: any;
  defaultType?: StatusBarType;
  defaultStyle?: StatusBarStyle;
  defaultTitle?: string;
  defaultItems?: StatusItem[];
  defaultShowLeftSection?: boolean;
  defaultShowCenterSection?: boolean;
  defaultShowRightSection?: boolean;
  defaultShowLabels?: boolean;
  defaultShowSeparators?: boolean;
}

// StatusBar group props
export interface StatusBarGroupProps extends BaseProps {
  statusBars: StatusBarProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: StatusBarVariants;
  size?: StatusBarSizes;
  onStatusBarClick?: (statusBarIndex: number, event: any) => void;
}

// StatusBar layout props
export interface StatusBarLayoutProps extends BaseProps {
  statusBars: StatusBarProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: StatusBarVariants;
  size?: StatusBarSizes;
  onLayoutChange?: (layout: any) => void;
}

// StatusBar theme props
export interface StatusBarThemeProps extends StatusBarProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}