import { BaseProps } from '../../BaseComponent';

// Toast variants
export type ToastVariants = 
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

// Toast sizes
export type ToastSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Toast states
export type ToastStates = 
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

// Toast types
export type ToastType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// Toast style
export type ToastStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Toast positions
export type ToastPosition = 'top' | 'center' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// Toast animation directions
export type ToastAnimationDirection = 'left' | 'right' | 'up' | 'down';

// Toast props interface
export interface ToastProps extends BaseProps {
  // Optional props
  variant?: ToastVariants;
  size?: ToastSizes;
  state?: ToastStates;
  
  // Toast content
  content?: string;
  title?: string;
  icon?: string;
  
  // Toast-specific styling
  toastStyle?: ToastStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: ToastType;
  style?: ToastStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Toast behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  
  // Toast dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Toast appearance
  borderStyle?: string;
  
  // Toast display options
  position?: ToastPosition;
  autoHide?: boolean;
  duration?: number;
  showProgress?: boolean;
  showIcon?: boolean;
  showTitle?: boolean;
  autoHideOnClick?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onContentChange?: (event: ToastContentChangeEvent) => void;
  onShow?: (event: ToastShowEvent) => void;
  onHide?: (event: ToastHideEvent) => void;
  onSlideIn?: (event: ToastSlideInEvent) => void;
  onSlideOut?: (event: ToastSlideOutEvent) => void;
  onFadeIn?: (event: ToastFadeInEvent) => void;
  onFadeOut?: (event: ToastFadeOutEvent) => void;
  onProgressChange?: (event: ToastProgressChangeEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Toast configuration for theming
export interface ToastConfig {
  variant: ToastVariants;
  size: ToastSizes;
  state: ToastStates;
  theme: any;
  type: ToastType;
  style: ToastStyle;
  content: string;
  title: string;
  icon: string;
  position: ToastPosition;
  autoHide: boolean;
  duration?: number;
  showProgress: boolean;
  showIcon: boolean;
  showTitle: boolean;
  autoHideOnClick: boolean;
}

// Toast style configuration
export interface ToastStyleConfig {
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

// Toast event types
export interface ToastContentChangeEvent {
  type: 'contentchange';
  target: any;
  content: string;
  previousContent: string;
}

export interface ToastShowEvent {
  type: 'show';
  target: any;
  content: string;
  title: string;
  icon: string;
}

export interface ToastHideEvent {
  type: 'hide';
  target: any;
  content: string;
  title: string;
  icon: string;
}

export interface ToastSlideInEvent {
  type: 'slidein';
  target: any;
  direction: ToastAnimationDirection;
  content: string;
  title: string;
  icon: string;
}

export interface ToastSlideOutEvent {
  type: 'slideout';
  target: any;
  direction: ToastAnimationDirection;
  content: string;
  title: string;
  icon: string;
}

export interface ToastFadeInEvent {
  type: 'fadein';
  target: any;
  content: string;
  title: string;
  icon: string;
}

export interface ToastFadeOutEvent {
  type: 'fadeout';
  target: any;
  content: string;
  title: string;
  icon: string;
}

export interface ToastProgressChangeEvent {
  type: 'progresschange';
  target: any;
  progress: number;
}

export interface ToastClickEvent {
  type: 'click';
  target: any;
  content: string;
  title: string;
  icon: string;
}

export interface ToastFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface ToastMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface ToastKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Toast validation result
export interface ToastValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: ToastProps;
}

// Toast factory options
export interface ToastFactoryOptions {
  defaultVariant?: ToastVariants;
  defaultSize?: ToastSizes;
  defaultState?: ToastStates;
  theme?: any;
  parent?: any;
  defaultType?: ToastType;
  defaultStyle?: ToastStyle;
  defaultContent?: string;
  defaultTitle?: string;
  defaultIcon?: string;
  defaultPosition?: ToastPosition;
  defaultAutoHide?: boolean;
  defaultDuration?: number;
  defaultShowProgress?: boolean;
  defaultShowIcon?: boolean;
  defaultShowTitle?: boolean;
  defaultAutoHideOnClick?: boolean;
}

// Toast group props
export interface ToastGroupProps extends BaseProps {
  toastComponents: ToastProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: ToastVariants;
  size?: ToastSizes;
  onToastClick?: (toastIndex: number, event: any) => void;
}

// Toast layout props
export interface ToastLayoutProps extends BaseProps {
  toastComponents: ToastProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: ToastVariants;
  size?: ToastSizes;
  onLayoutChange?: (layout: any) => void;
}

// Toast theme props
export interface ToastThemeProps extends ToastProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}