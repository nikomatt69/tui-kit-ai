import { BaseProps } from '../../BaseComponent';

// Tooltip variants
export type TooltipVariants = 
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

// Tooltip sizes
export type TooltipSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Tooltip states
export type TooltipStates = 
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

// Tooltip types
export type TooltipType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// Tooltip style
export type TooltipStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Tooltip positions
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// Tooltip animation directions
export type TooltipAnimationDirection = 'left' | 'right' | 'up' | 'down';

// Tooltip props interface
export interface TooltipProps extends BaseProps {
  // Optional props
  variant?: TooltipVariants;
  size?: TooltipSizes;
  state?: TooltipStates;
  
  // Tooltip content
  content?: string;
  title?: string;
  icon?: string;
  
  // Tooltip-specific styling
  tooltipStyle?: TooltipStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: TooltipType;
  style?: TooltipStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Tooltip behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  
  // Tooltip dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Tooltip appearance
  borderStyle?: string;
  
  // Tooltip display options
  position?: TooltipPosition;
  showDelay?: number;
  hideDelay?: number;
  showIcon?: boolean;
  showTitle?: boolean;
  followCursor?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onContentChange?: (event: TooltipContentChangeEvent) => void;
  onShow?: (event: TooltipShowEvent) => void;
  onHide?: (event: TooltipHideEvent) => void;
  onSlideIn?: (event: TooltipSlideInEvent) => void;
  onSlideOut?: (event: TooltipSlideOutEvent) => void;
  onFadeIn?: (event: TooltipFadeInEvent) => void;
  onFadeOut?: (event: TooltipFadeOutEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Tooltip configuration for theming
export interface TooltipConfig {
  variant: TooltipVariants;
  size: TooltipSizes;
  state: TooltipStates;
  theme: any;
  type: TooltipType;
  style: TooltipStyle;
  content: string;
  title: string;
  icon: string;
  position: TooltipPosition;
  showDelay: number;
  hideDelay: number;
  showIcon: boolean;
  showTitle: boolean;
  followCursor: boolean;
}

// Tooltip style configuration
export interface TooltipStyleConfig {
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
  shadow?: boolean;
  zIndex?: number;
}

// Tooltip event types
export interface TooltipContentChangeEvent {
  type: 'contentchange';
  target: any;
  content: string;
  previousContent: string;
}

export interface TooltipShowEvent {
  type: 'show';
  target: any;
  content: string;
  title: string;
  icon: string;
  position: TooltipPosition;
}

export interface TooltipHideEvent {
  type: 'hide';
  target: any;
  content: string;
  title: string;
  icon: string;
  position: TooltipPosition;
}

export interface TooltipSlideInEvent {
  type: 'slidein';
  target: any;
  direction: TooltipAnimationDirection;
  content: string;
  title: string;
  icon: string;
  position: TooltipPosition;
}

export interface TooltipSlideOutEvent {
  type: 'slideout';
  target: any;
  direction: TooltipAnimationDirection;
  content: string;
  title: string;
  icon: string;
  position: TooltipPosition;
}

export interface TooltipFadeInEvent {
  type: 'fadein';
  target: any;
  content: string;
  title: string;
  icon: string;
  position: TooltipPosition;
}

export interface TooltipFadeOutEvent {
  type: 'fadeout';
  target: any;
  content: string;
  title: string;
  icon: string;
  position: TooltipPosition;
}

export interface TooltipClickEvent {
  type: 'click';
  target: any;
  content: string;
  title: string;
  icon: string;
  position: TooltipPosition;
}

export interface TooltipFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface TooltipMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface TooltipKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Tooltip validation result
export interface TooltipValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: TooltipProps;
}

// Tooltip factory options
export interface TooltipFactoryOptions {
  defaultVariant?: TooltipVariants;
  defaultSize?: TooltipSizes;
  defaultState?: TooltipStates;
  theme?: any;
  parent?: any;
  defaultType?: TooltipType;
  defaultStyle?: TooltipStyle;
  defaultContent?: string;
  defaultTitle?: string;
  defaultIcon?: string;
  defaultPosition?: TooltipPosition;
  defaultShowDelay?: number;
  defaultHideDelay?: number;
  defaultShowIcon?: boolean;
  defaultShowTitle?: boolean;
  defaultFollowCursor?: boolean;
}

// Tooltip group props
export interface TooltipGroupProps extends BaseProps {
  tooltipComponents: TooltipProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: TooltipVariants;
  size?: TooltipSizes;
  onTooltipClick?: (tooltipIndex: number, event: any) => void;
}

// Tooltip layout props
export interface TooltipLayoutProps extends BaseProps {
  tooltipComponents: TooltipProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: TooltipVariants;
  size?: TooltipSizes;
  onLayoutChange?: (layout: any) => void;
}

// Tooltip theme props
export interface TooltipThemeProps extends TooltipProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}