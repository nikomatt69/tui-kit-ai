import { BaseProps } from '../../BaseComponent';

// Divider variants
export type DividerVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'subtle';

// Divider sizes
export type DividerSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Divider states
export type DividerStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success';

// Divider style types
export type DividerStyle = 
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'thick'
  | 'thin';

// Divider orientation
export type DividerOrientation = 'horizontal' | 'vertical';

// Divider props interface
export interface DividerProps extends BaseProps {
  // Optional props
  orientation?: DividerOrientation;
  dividerStyle?: DividerStyle;
  length?: number;
  variant?: DividerVariants;
  size?: DividerSizes;
  state?: DividerStates;
  
  // Divider-specific styling
  color?: string;
  spacing?: number;
  margin?: number;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Divider behavior
  clickable?: boolean;
  interactive?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
}

// Divider configuration for theming
export interface DividerConfig {
  variant: DividerVariants;
  size: DividerSizes;
  state: DividerStates;
  theme: any;
  orientation: DividerOrientation;
  dividerStyle: DividerStyle;
  length: number;
  color?: string;
  spacing?: number;
}

// Divider style configuration
export interface DividerStyleConfig {
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
}

// Divider event types
export interface DividerClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

export interface DividerFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface DividerMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

// Divider validation result
export interface DividerValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: DividerProps;
}

// Divider factory options
export interface DividerFactoryOptions {
  defaultVariant?: DividerVariants;
  defaultSize?: DividerSizes;
  defaultState?: DividerStates;
  theme?: any;
  parent?: any;
  defaultOrientation?: DividerOrientation;
  defaultDividerStyle?: DividerStyle;
  defaultLength?: number;
}

// Divider group props
export interface DividerGroupProps extends BaseProps {
  dividers: DividerProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: DividerVariants;
  size?: DividerSizes;
  onDividerClick?: (dividerIndex: number, event: any) => void;
}

// Divider item
export interface DividerItem {
  orientation: DividerOrientation;
  style: DividerStyle;
  length: number;
  variant?: DividerVariants;
  size?: DividerSizes;
  color?: string;
  spacing?: number;
}