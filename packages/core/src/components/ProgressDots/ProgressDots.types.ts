import { BaseProps } from '../../BaseComponent';

// ProgressDots variants
export type ProgressDotsVariants = 
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

// ProgressDots sizes
export type ProgressDotsSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// ProgressDots states
export type ProgressDotsStates = 
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

// ProgressDots types
export type ProgressDotsType = 'default' | 'circular' | 'linear' | 'custom';

// ProgressDots style
export type ProgressDotsStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// ProgressDots props interface
export interface ProgressDotsProps extends BaseProps {
  // Optional props
  variant?: ProgressDotsVariants;
  size?: ProgressDotsSizes;
  state?: ProgressDotsStates;
  
  // ProgressDots content
  value?: number;
  minValue?: number;
  maxValue?: number;
  
  // ProgressDots-specific styling
  progressDotsStyle?: ProgressDotsStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: ProgressDotsType;
  style?: ProgressDotsStyle;
  showValue?: boolean;
  showPercentage?: boolean;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // ProgressDots behavior
  clickable?: boolean;
  interactive?: boolean;
  animated?: boolean;
  smooth?: boolean;
  
  // ProgressDots dimensions
  width?: number;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // ProgressDots appearance
  totalDots?: number;
  dotSpacing?: string;
  prefix?: string;
  suffix?: string;
  filledCharacter?: string;
  emptyCharacter?: string;
  animatedCharacter?: string;
  borderStyle?: string;
  
  // ProgressDots thresholds
  warningThreshold?: number;
  errorThreshold?: number;
  successThreshold?: number;
  
  // Animation
  animationSpeed?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onChange?: (event: ProgressDotsChangeEvent) => void;
  onComplete?: (event: ProgressDotsCompleteEvent) => void;
  onThreshold?: (event: ProgressDotsThresholdEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// ProgressDots configuration for theming
export interface ProgressDotsConfig {
  variant: ProgressDotsVariants;
  size: ProgressDotsSizes;
  state: ProgressDotsStates;
  theme: any;
  value: number;
  minValue: number;
  maxValue: number;
  type: ProgressDotsType;
  style: ProgressDotsStyle;
  totalDots: number;
  dotSpacing: string;
  showValue: boolean;
  showPercentage: boolean;
  animated: boolean;
  smooth: boolean;
}

// ProgressDots style configuration
export interface ProgressDotsStyleConfig {
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

// ProgressDots event types
export interface ProgressDotsChangeEvent {
  type: 'change';
  target: any;
  value: number;
  percentage: number;
  previousValue: number;
}

export interface ProgressDotsCompleteEvent {
  type: 'complete';
  target: any;
  value: number;
  percentage: number;
}

export interface ProgressDotsThresholdEvent {
  type: 'threshold';
  target: any;
  threshold: number;
  value: number;
  percentage: number;
}

export interface ProgressDotsClickEvent {
  type: 'click';
  target: any;
  value: number;
  percentage: number;
}

export interface ProgressDotsFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface ProgressDotsMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface ProgressDotsKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// ProgressDots validation result
export interface ProgressDotsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: ProgressDotsProps;
}

// ProgressDots factory options
export interface ProgressDotsFactoryOptions {
  defaultVariant?: ProgressDotsVariants;
  defaultSize?: ProgressDotsSizes;
  defaultState?: ProgressDotsStates;
  theme?: any;
  parent?: any;
  defaultValue?: number;
  defaultMinValue?: number;
  defaultMaxValue?: number;
  defaultType?: ProgressDotsType;
  defaultStyle?: ProgressDotsStyle;
  defaultTotalDots?: number;
  defaultDotSpacing?: string;
  defaultShowValue?: boolean;
  defaultShowPercentage?: boolean;
  defaultAnimated?: boolean;
  defaultSmooth?: boolean;
  defaultAnimationSpeed?: number;
}

// ProgressDots group props
export interface ProgressDotsGroupProps extends BaseProps {
  progressDots: ProgressDotsProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: ProgressDotsVariants;
  size?: ProgressDotsSizes;
  onProgressDotsClick?: (dotsIndex: number, event: any) => void;
}

// ProgressDots layout props
export interface ProgressDotsLayoutProps extends BaseProps {
  progressDots: ProgressDotsProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: ProgressDotsVariants;
  size?: ProgressDotsSizes;
  onLayoutChange?: (layout: any) => void;
}

// ProgressDots circular props
export interface ProgressDotsCircularProps extends ProgressDotsProps {
  radius: number;
  strokeWidth: number;
  startAngle: number;
  endAngle: number;
  clockwise: boolean;
}

// ProgressDots indeterminate props
export interface ProgressDotsIndeterminateProps extends ProgressDotsProps {
  animationSpeed: number;
  animationType: 'pulse' | 'wave' | 'spinner';
  showProgress: boolean;
}