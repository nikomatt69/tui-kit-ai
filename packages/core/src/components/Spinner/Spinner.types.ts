import { BaseProps } from '../../BaseComponent';

// Spinner variants
export type SpinnerVariants = 
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

// Spinner sizes
export type SpinnerSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Spinner states
export type SpinnerStates = 
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

// Spinner types
export type SpinnerType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// Spinner style
export type SpinnerStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Spinner animation types
export type SpinnerAnimationType = 'dots' | 'line' | 'pulse' | 'bounce' | 'bar' | 'custom';

// Spinner props interface
export interface SpinnerProps extends BaseProps {
  // Optional props
  variant?: SpinnerVariants;
  size?: SpinnerSizes;
  state?: SpinnerStates;
  
  // Spinner content
  label?: string;
  message?: string;
  
  // Spinner-specific styling
  spinnerStyle?: SpinnerStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: SpinnerType;
  style?: SpinnerStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Spinner behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  
  // Spinner dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Spinner appearance
  spinnerType?: SpinnerAnimationType;
  frames?: string[];
  stoppedFrame?: string;
  borderStyle?: string;
  
  // Spinner animation options
  autoStart?: boolean;
  speed?: number;
  showSeparator?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onStart?: (event: SpinnerStartEvent) => void;
  onStop?: (event: SpinnerStopEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Spinner configuration for theming
export interface SpinnerConfig {
  variant: SpinnerVariants;
  size: SpinnerSizes;
  state: SpinnerStates;
  theme: any;
  type: SpinnerType;
  style: SpinnerStyle;
  label?: string;
  message?: string;
  spinnerType: SpinnerAnimationType;
  frames: string[];
  autoStart: boolean;
  speed: number;
  showSeparator: boolean;
}

// Spinner style configuration
export interface SpinnerStyleConfig {
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

// Spinner event types
export interface SpinnerStartEvent {
  type: 'start';
  target: any;
  frames: string[];
  speed: number;
}

export interface SpinnerStopEvent {
  type: 'stop';
  target: any;
  finalFrame: number;
}

export interface SpinnerClickEvent {
  type: 'click';
  target: any;
  isSpinning: boolean;
  currentFrame: number;
}

export interface SpinnerFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface SpinnerMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface SpinnerKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Spinner validation result
export interface SpinnerValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: SpinnerProps;
}

// Spinner factory options
export interface SpinnerFactoryOptions {
  defaultVariant?: SpinnerVariants;
  defaultSize?: SpinnerSizes;
  defaultState?: SpinnerStates;
  theme?: any;
  parent?: any;
  defaultType?: SpinnerType;
  defaultStyle?: SpinnerStyle;
  defaultLabel?: string;
  defaultMessage?: string;
  defaultSpinnerType?: SpinnerAnimationType;
  defaultFrames?: string[];
  defaultAutoStart?: boolean;
  defaultSpeed?: number;
  defaultShowSeparator?: boolean;
}

// Spinner group props
export interface SpinnerGroupProps extends BaseProps {
  spinners: SpinnerProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: SpinnerVariants;
  size?: SpinnerSizes;
  onSpinnerClick?: (spinnerIndex: number, event: any) => void;
}

// Spinner layout props
export interface SpinnerLayoutProps extends BaseProps {
  spinners: SpinnerProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: SpinnerVariants;
  size?: SpinnerSizes;
  onLayoutChange?: (layout: any) => void;
}

// Spinner animation props
export interface SpinnerAnimationProps extends SpinnerProps {
  animationOptions: {
    type: SpinnerAnimationType;
    speed: number;
    frames: string[];
    autoStart: boolean;
  };
  onAnimationChange?: (animationData: any) => void;
}

// Spinner theme props
export interface SpinnerThemeProps extends SpinnerProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}