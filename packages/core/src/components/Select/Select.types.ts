import { BaseProps } from '../../BaseComponent';

// Select variants
export type SelectVariants = 
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

// Select sizes
export type SelectSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Select states
export type SelectStates = 
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

// Select types
export type SelectType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// Select style
export type SelectStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Select option interface
export interface SelectOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

// Select props interface
export interface SelectProps extends BaseProps {
  // Optional props
  variant?: SelectVariants;
  size?: SelectSizes;
  state?: SelectStates;
  
  // Select content
  label?: string;
  placeholder?: string;
  
  // Select-specific styling
  selectStyle?: SelectStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: SelectType;
  style?: SelectStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Select behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  required?: boolean;
  
  // Select dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Select appearance
  options?: SelectOption[];
  defaultValue?: any;
  borderStyle?: string;
  
  // Select validation
  minOptions?: number;
  maxOptions?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onChange?: (event: SelectChangeEvent) => void;
  onOpen?: (event: SelectOpenEvent) => void;
  onClose?: (event: SelectCloseEvent) => void;
  onOptionAdd?: (event: SelectOptionAddEvent) => void;
  onOptionRemove?: (event: SelectOptionRemoveEvent) => void;
  onOptionUpdate?: (event: SelectOptionUpdateEvent) => void;
  onOptionsChange?: (event: SelectOptionsChangeEvent) => void;
  onOptionsClear?: (event: SelectOptionsClearEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Select configuration for theming
export interface SelectConfig {
  variant: SelectVariants;
  size: SelectSizes;
  state: SelectStates;
  theme: any;
  type: SelectType;
  style: SelectStyle;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled: boolean;
  required: boolean;
}

// Select style configuration
export interface SelectStyleConfig {
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

// Select event types
export interface SelectChangeEvent {
  type: 'change';
  target: any;
  value: any;
  previousValue: any;
}

export interface SelectOpenEvent {
  type: 'open';
  target: any;
  options: SelectOption[];
}

export interface SelectCloseEvent {
  type: 'close';
  target: any;
}

export interface SelectOptionAddEvent {
  type: 'optionadd';
  target: any;
  option: SelectOption;
  totalOptions: number;
}

export interface SelectOptionRemoveEvent {
  type: 'optionremove';
  target: any;
  option: SelectOption;
  totalOptions: number;
}

export interface SelectOptionUpdateEvent {
  type: 'optionupdate';
  target: any;
  option: SelectOption;
  previousOption: SelectOption;
}

export interface SelectOptionsChangeEvent {
  type: 'optionschange';
  target: any;
  options: SelectOption[];
  previousOptions: SelectOption[];
}

export interface SelectOptionsClearEvent {
  type: 'optionsclear';
  target: any;
}

export interface SelectClickEvent {
  type: 'click';
  target: any;
  selectedValue: any;
  options: SelectOption[];
  isOpen: boolean;
}

export interface SelectFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface SelectMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface SelectKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Select validation result
export interface SelectValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: SelectProps;
}

// Select factory options
export interface SelectFactoryOptions {
  defaultVariant?: SelectVariants;
  defaultSize?: SelectSizes;
  defaultState?: SelectStates;
  theme?: any;
  parent?: any;
  defaultType?: SelectType;
  defaultStyle?: SelectStyle;
  defaultLabel?: string;
  defaultPlaceholder?: string;
  defaultOptions?: SelectOption[];
  defaultDisabled?: boolean;
  defaultRequired?: boolean;
}

// Select group props
export interface SelectGroupProps extends BaseProps {
  selects: SelectProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: SelectVariants;
  size?: SelectSizes;
  onSelectClick?: (selectIndex: number, event: any) => void;
}

// Select layout props
export interface SelectLayoutProps extends BaseProps {
  selects: SelectProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: SelectVariants;
  size?: SelectSizes;
  onLayoutChange?: (layout: any) => void;
}

// Select validation props
export interface SelectValidationProps extends SelectProps {
  validators: {
    required?: boolean;
    minOptions?: number;
    maxOptions?: number;
    custom?: (value: any) => boolean | string;
  };
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

// Select theme props
export interface SelectThemeProps extends SelectProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}