import { BaseProps } from '../../BaseComponent';

// ProgressBar variants
export type ProgressBarVariants = 
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

// ProgressBar sizes
export type ProgressBarSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// ProgressBar states
export type ProgressBarStates = 
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

// ProgressBar types
export type ProgressBarType = 'default' | 'circular' | 'linear' | 'custom';

// ProgressBar style
export type ProgressBarStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// ProgressBar props interface
export interface ProgressBarProps extends BaseProps {
  // Optional props
  variant?: ProgressBarVariants;
  size?: ProgressBarSizes;
  state?: ProgressBarStates;
  
  // ProgressBar content
  value?: number;
  minValue?: number;
  maxValue?: number;
  
  // ProgressBar-specific styling
  progressBarStyle?: ProgressBarStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: ProgressBarType;
  style?: ProgressBarStyle;
  showValue?: boolean;
  showPercentage?: boolean;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // ProgressBar behavior
  clickable?: boolean;
  interactive?: boolean;
  animated?: boolean;
  smooth?: boolean;
  
  // ProgressBar dimensions
  width?: number;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // ProgressBar appearance
  prefix?: string;
  suffix?: string;
  filledCharacter?: string;
  emptyCharacter?: string;
  borderStyle?: string;
  
  // ProgressBar thresholds
  warningThreshold?: number;
  errorThreshold?: number;
  successThreshold?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onChange?: (event: ProgressBarChangeEvent) => void;
  onComplete?: (event: ProgressBarCompleteEvent) => void;
  onThreshold?: (event: ProgressBarThresholdEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// ProgressBar configuration for theming
export interface ProgressBarConfig {
  variant: ProgressBarVariants;
  size: ProgressBarSizes;
  state: ProgressBarStates;
  theme: any;
  value: number;
  minValue: number;
  maxValue: number;
  type: ProgressBarType;
  style: ProgressBarStyle;
  showValue: boolean;
  showPercentage: boolean;
  animated: boolean;
  smooth: boolean;
}

// ProgressBar style configuration
export interface ProgressBarStyleConfig {
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

// ProgressBar event types
export interface ProgressBarChangeEvent {
  type: 'change';
  target: any;
  value: number;
  percentage: number;
  previousValue: number;
}

export interface ProgressBarCompleteEvent {
  type: 'complete';
  target: any;
  value: number;
  percentage: number;
}

export interface ProgressBarThresholdEvent {
  type: 'threshold';
  target: any;
  threshold: number;
  value: number;
  percentage: number;
}

export interface ProgressBarClickEvent {
  type: 'click';
  target: any;
  value: number;
  percentage: number;
}

export interface ProgressBarFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface ProgressBarMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface ProgressBarKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// ProgressBar validation result
export interface ProgressBarValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: ProgressBarProps;
}

// ProgressBar factory options
export interface ProgressBarFactoryOptions {
  defaultVariant?: ProgressBarVariants;
  defaultSize?: ProgressBarSizes;
  defaultState?: ProgressBarStates;
  theme?: any;
  parent?: any;
  defaultValue?: number;
  defaultMinValue?: number;
  defaultMaxValue?: number;
  defaultType?: ProgressBarType;
  defaultStyle?: ProgressBarStyle;
  defaultShowValue?: boolean;
  defaultShowPercentage?: boolean;
  defaultAnimated?: boolean;
  defaultSmooth?: boolean;
}

// ProgressBar group props
export interface ProgressBarGroupProps extends BaseProps {
  progressBars: ProgressBarProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: ProgressBarVariants;
  size?: ProgressBarSizes;
  onProgressBarClick?: (barIndex: number, event: any) => void;
}

// ProgressBar layout props
export interface ProgressBarLayoutProps extends BaseProps {
  progressBars: ProgressBarProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: ProgressBarVariants;
  size?: ProgressBarSizes;
  onLayoutChange?: (layout: any) => void;
}

// ProgressBar circular props
export interface ProgressBarCircularProps extends ProgressBarProps {
  radius: number;
  strokeWidth: number;
  startAngle: number;
  endAngle: number;
  clockwise: boolean;
}

// ProgressBar indeterminate props
export interface ProgressBarIndeterminateProps extends ProgressBarProps {
  animationSpeed: number;
  animationType: 'pulse' | 'wave' | 'spinner';
  showProgress: boolean;
}