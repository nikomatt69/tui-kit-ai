import { BaseProps } from '../../BaseComponent';

// Button-specific variants
export type ButtonVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link';

// Button sizes
export type ButtonSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'icon';

// Button states
export type ButtonStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'loading'
  | 'focus'
  | 'error'
  | 'success';

// Button props interface
export interface ButtonProps extends BaseProps {
  // Required props
  label: string;
  
  // Optional props
  onClick?: (data?: any) => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  variant?: ButtonVariants;
  size?: ButtonSizes;
  state?: ButtonStates;
  fullWidth?: boolean;
  rounded?: boolean;
  
  // Button-specific styling
  buttonStyle?: 'solid' | 'outline' | 'text';
  buttonType?: 'button' | 'submit' | 'reset';
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Button configuration for theming
export interface ButtonConfig {
  variant: ButtonVariants;
  size: ButtonSizes;
  state: ButtonStates;
  theme: any;
  disabled: boolean;
  loading: boolean;
}

// Button style configuration
export interface ButtonStyleConfig {
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
  bold?: boolean;
  underline?: boolean;
  blink?: boolean;
  dim?: boolean;
  inverse?: boolean;
  invisible?: boolean;
  transparent?: boolean;
}

// Button event types
export interface ButtonClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

export interface ButtonFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface ButtonKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Button validation result
export interface ButtonValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: ButtonProps;
}

// Button factory options
export interface ButtonFactoryOptions {
  defaultVariant?: ButtonVariants;
  defaultSize?: ButtonSizes;
  defaultState?: ButtonStates;
  theme?: any;
  parent?: any;
}

// Button group props
export interface ButtonGroupProps extends BaseProps {
  buttons: ButtonProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: ButtonVariants;
  size?: ButtonSizes;
  onButtonClick?: (buttonIndex: number, data?: any) => void;
}