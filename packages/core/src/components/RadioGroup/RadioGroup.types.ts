import { BaseProps } from '../../BaseComponent';

// RadioGroup variants
export type RadioGroupVariants = 
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

// RadioGroup sizes
export type RadioGroupSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// RadioGroup states
export type RadioGroupStates = 
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

// RadioGroup types
export type RadioGroupType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// RadioGroup style
export type RadioGroupStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// RadioGroup layout
export type RadioGroupLayout = 'vertical' | 'horizontal' | 'grid' | 'inline';

// Radio option interface
export interface RadioOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

// RadioGroup props interface
export interface RadioGroupProps extends BaseProps {
  // Optional props
  variant?: RadioGroupVariants;
  size?: RadioGroupSizes;
  state?: RadioGroupStates;
  
  // RadioGroup content
  label?: string;
  helpText?: string;
  emptyMessage?: string;
  
  // RadioGroup-specific styling
  radioGroupStyle?: RadioGroupStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: RadioGroupType;
  style?: RadioGroupStyle;
  layout?: RadioGroupLayout;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // RadioGroup behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  required?: boolean;
  
  // RadioGroup dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // RadioGroup appearance
  options?: RadioOption[];
  defaultValue?: any;
  borderStyle?: string;
  
  // RadioGroup validation
  minOptions?: number;
  maxOptions?: number;
  allowMultiple?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onChange?: (event: RadioGroupChangeEvent) => void;
  onOptionAdd?: (event: RadioGroupOptionAddEvent) => void;
  onOptionRemove?: (event: RadioGroupOptionRemoveEvent) => void;
  onOptionUpdate?: (event: RadioGroupOptionUpdateEvent) => void;
  onOptionsChange?: (event: RadioGroupOptionsChangeEvent) => void;
  onOptionsClear?: (event: RadioGroupOptionsClearEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// RadioGroup configuration for theming
export interface RadioGroupConfig {
  variant: RadioGroupVariants;
  size: RadioGroupSizes;
  state: RadioGroupStates;
  theme: any;
  type: RadioGroupType;
  style: RadioGroupStyle;
  layout: RadioGroupLayout;
  label?: string;
  helpText?: string;
  options: RadioOption[];
  disabled: boolean;
  required: boolean;
}

// RadioGroup style configuration
export interface RadioGroupStyleConfig {
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

// RadioGroup event types
export interface RadioGroupChangeEvent {
  type: 'change';
  target: any;
  value: any;
  previousValue: any;
}

export interface RadioGroupOptionAddEvent {
  type: 'optionadd';
  target: any;
  option: RadioOption;
  totalOptions: number;
}

export interface RadioGroupOptionRemoveEvent {
  type: 'optionremove';
  target: any;
  option: RadioOption;
  totalOptions: number;
}

export interface RadioGroupOptionUpdateEvent {
  type: 'optionupdate';
  target: any;
  option: RadioOption;
  previousOption: RadioOption;
}

export interface RadioGroupOptionsChangeEvent {
  type: 'optionschange';
  target: any;
  options: RadioOption[];
  previousOptions: RadioOption[];
}

export interface RadioGroupOptionsClearEvent {
  type: 'optionsclear';
  target: any;
}

export interface RadioGroupClickEvent {
  type: 'click';
  target: any;
  selectedValue: any;
  options: RadioOption[];
}

export interface RadioGroupFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface RadioGroupMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface RadioGroupKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// RadioGroup validation result
export interface RadioGroupValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: RadioGroupProps;
}

// RadioGroup factory options
export interface RadioGroupFactoryOptions {
  defaultVariant?: RadioGroupVariants;
  defaultSize?: RadioGroupSizes;
  defaultState?: RadioGroupStates;
  theme?: any;
  parent?: any;
  defaultType?: RadioGroupType;
  defaultStyle?: RadioGroupStyle;
  defaultLayout?: RadioGroupLayout;
  defaultLabel?: string;
  defaultHelpText?: string;
  defaultOptions?: RadioOption[];
  defaultDisabled?: boolean;
  defaultRequired?: boolean;
}

// RadioGroup group props
export interface RadioGroupGroupProps extends BaseProps {
  radioGroups: RadioGroupProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: RadioGroupVariants;
  size?: RadioGroupSizes;
  onRadioGroupClick?: (groupIndex: number, event: any) => void;
}

// RadioGroup layout props
export interface RadioGroupLayoutProps extends BaseProps {
  radioGroups: RadioGroupProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: RadioGroupVariants;
  size?: RadioGroupSizes;
  onLayoutChange?: (layout: any) => void;
}

// RadioGroup validation props
export interface RadioGroupValidationProps extends RadioGroupProps {
  validators: {
    required?: boolean;
    minOptions?: number;
    maxOptions?: number;
    custom?: (value: any) => boolean | string;
  };
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

// RadioGroup theme props
export interface RadioGroupThemeProps extends RadioGroupProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}