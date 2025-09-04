import { BaseProps } from '../../BaseComponent';

// Scrollable variants
export type ScrollableVariants = 
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

// Scrollable sizes
export type ScrollableSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Scrollable states
export type ScrollableStates = 
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

// Scrollable types
export type ScrollableType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// Scrollable style
export type ScrollableStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Scrollable scroll behavior
export type ScrollBehavior = 'auto' | 'smooth' | 'instant';

// Scrollable props interface
export interface ScrollableProps extends BaseProps {
  // Optional props
  variant?: ScrollableVariants;
  size?: ScrollableSizes;
  state?: ScrollableStates;
  
  // Scrollable content
  content?: string;
  
  // Scrollable-specific styling
  scrollableStyle?: ScrollableStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: ScrollableType;
  style?: ScrollableStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Scrollable behavior
  clickable?: boolean;
  interactive?: boolean;
  scrollable?: boolean;
  alwaysScroll?: boolean;
  
  // Scrollable dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Scrollable appearance
  scrollbarChar?: string;
  scrollbarColor?: string;
  borderStyle?: string;
  
  // Scrollable scroll options
  scrollBehavior?: ScrollBehavior;
  scrollStep?: number;
  scrollMargin?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onScroll?: (event: ScrollableScrollEvent) => void;
  onChildAdd?: (event: ScrollableChildAddEvent) => void;
  onChildRemove?: (event: ScrollableChildRemoveEvent) => void;
  onChildrenClear?: (event: ScrollableChildrenClearEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Scrollable configuration for theming
export interface ScrollableConfig {
  variant: ScrollableVariants;
  size: ScrollableSizes;
  state: ScrollableStates;
  theme: any;
  type: ScrollableType;
  style: ScrollableStyle;
  content?: string;
  scrollable: boolean;
  alwaysScroll: boolean;
  scrollbarChar: string;
  scrollbarColor: string;
}

// Scrollable style configuration
export interface ScrollableStyleConfig {
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

// Scrollable event types
export interface ScrollableScrollEvent {
  type: 'scroll';
  target: any;
  position: number;
  maxScroll: number;
}

export interface ScrollableChildAddEvent {
  type: 'childadd';
  target: any;
  child: any;
  totalChildren: number;
}

export interface ScrollableChildRemoveEvent {
  type: 'childremove';
  target: any;
  child: any;
  totalChildren: number;
}

export interface ScrollableChildrenClearEvent {
  type: 'childrenclear';
  target: any;
}

export interface ScrollableClickEvent {
  type: 'click';
  target: any;
  children: any[];
  scrollPosition: number;
}

export interface ScrollableFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface ScrollableMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface ScrollableKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Scrollable validation result
export interface ScrollableValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: ScrollableProps;
}

// Scrollable factory options
export interface ScrollableFactoryOptions {
  defaultVariant?: ScrollableVariants;
  defaultSize?: ScrollableSizes;
  defaultState?: ScrollableStates;
  theme?: any;
  parent?: any;
  defaultType?: ScrollableType;
  defaultStyle?: ScrollableStyle;
  defaultContent?: string;
  defaultScrollable?: boolean;
  defaultAlwaysScroll?: boolean;
  defaultScrollbarChar?: string;
  defaultScrollbarColor?: string;
}

// Scrollable group props
export interface ScrollableGroupProps extends BaseProps {
  scrollables: ScrollableProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: ScrollableVariants;
  size?: ScrollableSizes;
  onScrollableClick?: (scrollableIndex: number, event: any) => void;
}

// Scrollable layout props
export interface ScrollableLayoutProps extends BaseProps {
  scrollables: ScrollableProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: ScrollableVariants;
  size?: ScrollableSizes;
  onLayoutChange?: (layout: any) => void;
}

// Scrollable scroll props
export interface ScrollableScrollProps extends ScrollableProps {
  scrollOptions: {
    behavior: ScrollBehavior;
    step: number;
    margin: number;
    threshold: number;
  };
  onScrollChange?: (scrollData: any) => void;
}

// Scrollable theme props
export interface ScrollableThemeProps extends ScrollableProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}