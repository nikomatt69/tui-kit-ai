import { BaseProps } from '../../BaseComponent';

// Stepper variants
export type StepperVariants = 
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

// Stepper sizes
export type StepperSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Stepper states
export type StepperStates = 
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

// Stepper types
export type StepperType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// Stepper style
export type StepperStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Step status types
export type StepStatus = 'pending' | 'active' | 'completed' | 'error' | 'skipped';

// Stepper step interface
export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
  icon?: string;
  metadata?: Record<string, any>;
}

// Stepper props interface
export interface StepperProps extends BaseProps {
  // Optional props
  variant?: StepperVariants;
  size?: StepperSizes;
  state?: StepperStates;
  
  // Stepper content
  title?: string;
  emptyMessage?: string;
  
  // Stepper-specific styling
  stepperStyle?: StepperStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: StepperType;
  style?: StepperStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Stepper behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  
  // Stepper dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Stepper appearance
  steps?: StepperStep[];
  borderStyle?: string;
  
  // Step display options
  showStepNumbers?: boolean;
  showStepIcons?: boolean;
  showStepDescriptions?: boolean;
  showStepStatus?: boolean;
  showStepMetadata?: boolean;
  
  // Custom icons
  completedIcon?: string;
  errorIcon?: string;
  skippedIcon?: string;
  currentIcon?: string;
  pendingIcon?: string;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onStepChange?: (event: StepperStepChangeEvent) => void;
  onStepFocus?: (event: StepperStepFocusEvent) => void;
  onStepActivate?: (event: StepperStepActivateEvent) => void;
  onStepAdd?: (event: StepperStepAddEvent) => void;
  onStepRemove?: (event: StepperStepRemoveEvent) => void;
  onStepUpdate?: (event: StepperStepUpdateEvent) => void;
  onStepsChange?: (event: StepperStepsChangeEvent) => void;
  onStepsClear?: (event: StepperStepsClearEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Stepper configuration for theming
export interface StepperConfig {
  variant: StepperVariants;
  size: StepperSizes;
  state: StepperStates;
  theme: any;
  type: StepperType;
  style: StepperStyle;
  title?: string;
  steps: StepperStep[];
  showStepNumbers: boolean;
  showStepIcons: boolean;
  showStepDescriptions: boolean;
  showStepStatus: boolean;
  showStepMetadata: boolean;
}

// Stepper style configuration
export interface StepperStyleConfig {
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

// Stepper event types
export interface StepperStepChangeEvent {
  type: 'stepchange';
  target: any;
  previousStepIndex: number;
  currentStepIndex: number;
  step: StepperStep;
}

export interface StepperStepFocusEvent {
  type: 'stepfocus';
  target: any;
  stepIndex: number;
  step: StepperStep;
}

export interface StepperStepActivateEvent {
  type: 'stepactivate';
  target: any;
  stepIndex: number;
  step: StepperStep;
}

export interface StepperStepAddEvent {
  type: 'stepadd';
  target: any;
  step: StepperStep;
  totalSteps: number;
}

export interface StepperStepRemoveEvent {
  type: 'stepremove';
  target: any;
  step: StepperStep;
  totalSteps: number;
}

export interface StepperStepUpdateEvent {
  type: 'stepupdate';
  target: any;
  step: StepperStep;
  previousStep: StepperStep;
}

export interface StepperStepsChangeEvent {
  type: 'stepschange';
  target: any;
  steps: StepperStep[];
  previousSteps: StepperStep[];
}

export interface StepperStepsClearEvent {
  type: 'stepsclear';
  target: any;
}

export interface StepperClickEvent {
  type: 'click';
  target: any;
  steps: StepperStep[];
  currentStepIndex: number;
  focusedStepIndex: number;
}

export interface StepperFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface StepperMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface StepperKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Stepper validation result
export interface StepperValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: StepperProps;
}

// Stepper factory options
export interface StepperFactoryOptions {
  defaultVariant?: StepperVariants;
  defaultSize?: StepperSizes;
  defaultState?: StepperStates;
  theme?: any;
  parent?: any;
  defaultType?: StepperType;
  defaultStyle?: StepperStyle;
  defaultTitle?: string;
  defaultSteps?: StepperStep[];
  defaultShowStepNumbers?: boolean;
  defaultShowStepIcons?: boolean;
  defaultShowStepDescriptions?: boolean;
  defaultShowStepStatus?: boolean;
  defaultShowStepMetadata?: boolean;
}

// Stepper group props
export interface StepperGroupProps extends BaseProps {
  steppers: StepperProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: StepperVariants;
  size?: StepperSizes;
  onStepperClick?: (stepperIndex: number, event: any) => void;
}

// Stepper layout props
export interface StepperLayoutProps extends BaseProps {
  steppers: StepperProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: StepperVariants;
  size?: StepperSizes;
  onLayoutChange?: (layout: any) => void;
}

// Stepper theme props
export interface StepperThemeProps extends StepperProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}