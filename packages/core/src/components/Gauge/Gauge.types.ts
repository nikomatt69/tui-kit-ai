import { BaseProps } from '../../BaseComponent';

// Gauge variants
export type GaugeVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'gradient';

// Gauge sizes
export type GaugeSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Gauge states
export type GaugeStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'loading';

// Gauge style types
export type GaugeStyle = 
  | 'block'
  | 'bar'
  | 'line'
  | 'dots'
  | 'squares'
  | 'circles';

// Gauge props interface
export interface GaugeProps extends BaseProps {
  // Required props
  value?: number;
  minValue?: number;
  maxValue?: number;
  
  // Optional props
  variant?: GaugeVariants;
  size?: GaugeSizes;
  state?: GaugeStates;
  
  // Gauge-specific styling
  gaugeStyle?: GaugeStyle;
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  showValue?: boolean;
  showPercentage?: boolean;
  prefix?: string;
  suffix?: string;
  label?: string;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Gauge behavior
  interactive?: boolean;
  clickable?: boolean;
  animated?: boolean;
  smooth?: boolean;
  
  // Thresholds for color changes
  thresholds?: GaugeThreshold[];
  warningThreshold?: number;
  errorThreshold?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onChange?: (event: GaugeChangeEvent) => void;
  onValueChange?: (value: number, percentage: number) => void;
  onThresholdReached?: (threshold: GaugeThreshold) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
}

// Gauge threshold interface
export interface GaugeThreshold {
  value: number;
  color: string;
  label?: string;
  variant?: GaugeVariants;
}

// Gauge configuration for theming
export interface GaugeConfig {
  variant: GaugeVariants;
  size: GaugeSizes;
  state: GaugeStates;
  theme: any;
  value: number;
  minValue: number;
  maxValue: number;
  percentage: number;
  gaugeStyle: GaugeStyle;
  width: number;
  interactive: boolean;
}

// Gauge style configuration
export interface GaugeStyleConfig {
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
}

// Gauge event types
export interface GaugeChangeEvent {
  type: 'change';
  target: any;
  value: number;
  percentage: number;
  previousValue?: number;
  previousPercentage?: number;
}

export interface GaugeThresholdEvent {
  type: 'threshold';
  target: any;
  threshold: GaugeThreshold;
  value: number;
  percentage: number;
}

export interface GaugeClickEvent {
  type: 'click';
  target: any;
  x: number;
  y: number;
  value: number;
  percentage: number;
}

export interface GaugeFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface GaugeMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

// Gauge validation result
export interface GaugeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: GaugeProps;
}

// Gauge factory options
export interface GaugeFactoryOptions {
  defaultVariant?: GaugeVariants;
  defaultSize?: GaugeSizes;
  defaultState?: GaugeStates;
  theme?: any;
  parent?: any;
  defaultValue?: number;
  defaultMinValue?: number;
  defaultMaxValue?: number;
  defaultGaugeStyle?: GaugeStyle;
  defaultWidth?: number;
  defaultInteractive?: boolean;
}

// Gauge group props
export interface GaugeGroupProps extends BaseProps {
  gauges: GaugeProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: GaugeVariants;
  size?: GaugeSizes;
  onGaugeChange?: (gaugeIndex: number, event: GaugeChangeEvent) => void;
}

// Gauge item
export interface GaugeItem {
  value: number;
  minValue: number;
  maxValue: number;
  gaugeStyle: GaugeStyle;
  width: number;
  variant?: GaugeVariants;
  size?: GaugeSizes;
  label?: string;
  thresholds?: GaugeThreshold[];
}