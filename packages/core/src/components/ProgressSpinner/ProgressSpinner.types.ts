import { BaseProps } from '../../BaseComponent';

// ProgressSpinner variants
export type ProgressSpinnerVariants = 
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

// ProgressSpinner sizes
export type ProgressSpinnerSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// ProgressSpinner states
export type ProgressSpinnerStates = 
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

// ProgressSpinner types
export type ProgressSpinnerType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// ProgressSpinner style
export type ProgressSpinnerStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Spinner animation types
export type SpinnerType = 'dots' | 'bars' | 'spinner' | 'pulse' | 'wave' | 'bounce';

// ProgressSpinner props interface
export interface ProgressSpinnerProps extends BaseProps {
  // Optional props
  variant?: ProgressSpinnerVariants;
  size?: ProgressSpinnerSizes;
  state?: ProgressSpinnerStates;
  
  // ProgressSpinner content
  text?: string;
  
  // ProgressSpinner-specific styling
  progressSpinnerStyle?: ProgressSpinnerStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: ProgressSpinnerType;
  style?: ProgressSpinnerStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // ProgressSpinner behavior
  clickable?: boolean;
  interactive?: boolean;
  spinning?: boolean;
  
  // ProgressSpinner dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // ProgressSpinner appearance
  spinnerType?: SpinnerType;
  prefix?: string;
  suffix?: string;
  borderStyle?: string;
  
  // Animation
  animationSpeed?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onStart?: (event: ProgressSpinnerStartEvent) => void;
  onStop?: (event: ProgressSpinnerStopEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// ProgressSpinner configuration for theming
export interface ProgressSpinnerConfig {
  variant: ProgressSpinnerVariants;
  size: ProgressSpinnerSizes;
  state: ProgressSpinnerStates;
  theme: any;
  type: ProgressSpinnerType;
  style: ProgressSpinnerStyle;
  spinnerType: SpinnerType;
  spinning: boolean;
  animationSpeed: number;
}

// ProgressSpinner style configuration
export interface ProgressSpinnerStyleConfig {
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

// ProgressSpinner event types
export interface ProgressSpinnerStartEvent {
  type: 'start';
  target: any;
  spinning: boolean;
}

export interface ProgressSpinnerStopEvent {
  type: 'stop';
  target: any;
  spinning: boolean;
}

export interface ProgressSpinnerClickEvent {
  type: 'click';
  target: any;
  spinning: boolean;
}

export interface ProgressSpinnerFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface ProgressSpinnerMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface ProgressSpinnerKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// ProgressSpinner validation result
export interface ProgressSpinnerValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: ProgressSpinnerProps;
}

// ProgressSpinner factory options
export interface ProgressSpinnerFactoryOptions {
  defaultVariant?: ProgressSpinnerVariants;
  defaultSize?: ProgressSpinnerSizes;
  defaultState?: ProgressSpinnerStates;
  theme?: any;
  parent?: any;
  defaultType?: ProgressSpinnerType;
  defaultStyle?: ProgressSpinnerStyle;
  defaultSpinnerType?: SpinnerType;
  defaultSpinning?: boolean;
  defaultAnimationSpeed?: number;
  defaultText?: string;
  defaultPrefix?: string;
  defaultSuffix?: string;
}

// ProgressSpinner group props
export interface ProgressSpinnerGroupProps extends BaseProps {
  progressSpinners: ProgressSpinnerProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: ProgressSpinnerVariants;
  size?: ProgressSpinnerSizes;
  onProgressSpinnerClick?: (spinnerIndex: number, event: any) => void;
}

// ProgressSpinner layout props
export interface ProgressSpinnerLayoutProps extends BaseProps {
  progressSpinners: ProgressSpinnerProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: ProgressSpinnerVariants;
  size?: ProgressSpinnerSizes;
  onLayoutChange?: (layout: any) => void;
}

// ProgressSpinner animation props
export interface ProgressSpinnerAnimationProps extends ProgressSpinnerProps {
  animationType: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  animationDuration: number;
  animationDelay: number;
  animationIterationCount: number | 'infinite';
}

// ProgressSpinner custom props
export interface ProgressSpinnerCustomProps extends ProgressSpinnerProps {
  customFrames: string[];
  customColors: string[];
  customSizes: Record<string, any>;
}