import { BaseProps } from '../../BaseComponent';

// Box variants
export type BoxVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'elevated';

// Box sizes
export type BoxSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// Box states
export type BoxStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success';

// Box props interface
export interface BoxProps extends BaseProps {
  // Optional props
  content?: string;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  variant?: BoxVariants;
  size?: BoxSizes;
  state?: BoxStates;
  
  // Box-specific styling
  boxStyle?: 'solid' | 'outline' | 'ghost' | 'elevated';
  rounded?: boolean;
  shadow?: boolean;
  glow?: boolean;
  
  // Layout props
  flex?: boolean;
  flexDirection?: 'row' | 'column';
  flexWrap?: 'nowrap' | 'wrap';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Box configuration for theming
export interface BoxConfig {
  variant: BoxVariants;
  size: BoxSizes;
  state: BoxStates;
  theme: any;
  content?: string;
  align?: string;
  valign?: string;
}

// Box style configuration
export interface BoxStyleConfig {
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
  blink?: boolean;
  dim?: boolean;
  inverse?: boolean;
  invisible?: boolean;
  transparent?: boolean;
}

// Box event types
export interface BoxClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

export interface BoxFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface BoxKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Box validation result
export interface BoxValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: BoxProps;
}

// Box factory options
export interface BoxFactoryOptions {
  defaultVariant?: BoxVariants;
  defaultSize?: BoxSizes;
  defaultState?: BoxStates;
  theme?: any;
  parent?: any;
}

// Box group props
export interface BoxGroupProps extends BaseProps {
  boxes: BoxProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: BoxVariants;
  size?: BoxSizes;
  onBoxClick?: (boxIndex: number, event: any) => void;
}