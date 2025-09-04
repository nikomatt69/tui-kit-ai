import { BaseProps } from '../../BaseComponent';

// Checkbox variants
export type CheckboxVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost';

// Checkbox sizes
export type CheckboxSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Checkbox states
export type CheckboxStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'checked'
  | 'indeterminate';

// Checkbox props interface
export interface CheckboxProps extends BaseProps {
  // Optional props
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  variant?: CheckboxVariants;
  size?: CheckboxSizes;
  state?: CheckboxStates;
  
  // Checkbox-specific styling
  checkboxStyle?: 'default' | 'outline' | 'ghost' | 'filled';
  labelSpacing?: number;
  checkboxSymbol?: {
    checked?: string;
    unchecked?: string;
    indeterminate?: string;
  };
  
  // Layout props
  labelPosition?: 'left' | 'right';
  labelAlign?: 'left' | 'center' | 'right';
  
  // Checkbox behavior
  autoFocus?: boolean;
  readOnly?: boolean;
  name?: string;
  value?: string;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  ariaChecked?: boolean | 'mixed';
  
  // Event handlers
  onChange?: (checked: boolean, indeterminate: boolean) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
}

// Checkbox configuration for theming
export interface CheckboxConfig {
  variant: CheckboxVariants;
  size: CheckboxSizes;
  state: CheckboxStates;
  theme: any;
  label?: string;
  checked: boolean;
  indeterminate: boolean;
  disabled?: boolean;
  required?: boolean;
}

// Checkbox style configuration
export interface CheckboxStyleConfig {
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
  align: 'left' | 'center' | 'right';
  valign: 'top' | 'middle' | 'bottom';
  bold?: boolean;
  underline?: boolean;
}

// Checkbox event types
export interface CheckboxChangeEvent {
  type: 'change';
  target: any;
  checked: boolean;
  indeterminate: boolean;
  value: string;
}

export interface CheckboxFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface CheckboxKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

export interface CheckboxClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

// Checkbox validation result
export interface CheckboxValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: CheckboxProps;
}

// Checkbox factory options
export interface CheckboxFactoryOptions {
  defaultVariant?: CheckboxVariants;
  defaultSize?: CheckboxSizes;
  defaultState?: CheckboxStates;
  theme?: any;
  parent?: any;
  defaultChecked?: boolean;
  defaultIndeterminate?: boolean;
}

// Checkbox group props
export interface CheckboxGroupProps extends BaseProps {
  checkboxes: CheckboxProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: CheckboxVariants;
  size?: CheckboxSizes;
  onGroupChange?: (values: string[], checkedStates: boolean[]) => void;
  allowMultiple?: boolean;
  allowIndeterminate?: boolean;
}

// Checkbox group item
export interface CheckboxGroupItem {
  label: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
}