import { BaseProps } from '../../BaseComponent';

// Heading variants
export type HeadingVariants = 
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

// Heading sizes
export type HeadingSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';

// Heading states
export type HeadingStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success';

// Heading props interface
export interface HeadingProps extends BaseProps {
  // Required props
  text?: string;
  
  // Optional props
  variant?: HeadingVariants;
  size?: HeadingSizes;
  state?: HeadingStates;
  level?: number;
  
  // Heading-specific styling
  color?: string;
  headingStyle?: 'default' | 'outline' | 'ghost' | 'gradient' | 'elevated';
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Text behavior
  truncate?: boolean;
  ellipsis?: boolean;
  wrap?: boolean;
  clickable?: boolean;
  interactive?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onClick?: (event: HeadingClickEvent) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Heading configuration for theming
export interface HeadingConfig {
  variant: HeadingVariants;
  size: HeadingSizes;
  state: HeadingStates;
  theme: any;
  text: string;
  level: number;
  color?: string;
  align: 'left' | 'center' | 'right';
  valign: 'top' | 'middle' | 'bottom';
}

// Heading style configuration
export interface HeadingStyleConfig {
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
  font?: string;
}

// Heading event types
export interface HeadingClickEvent {
  type: 'click';
  target: any;
  text?: string;
  level?: number;
}

export interface HeadingFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface HeadingMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface HeadingKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Heading validation result
export interface HeadingValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: HeadingProps;
}

// Heading factory options
export interface HeadingFactoryOptions {
  defaultVariant?: HeadingVariants;
  defaultSize?: HeadingSizes;
  defaultState?: HeadingStates;
  theme?: any;
  parent?: any;
  defaultText?: string;
  defaultLevel?: number;
  defaultColor?: string;
}

// Heading group props
export interface HeadingGroupProps extends BaseProps {
  headings: HeadingProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: HeadingVariants;
  size?: HeadingSizes;
  onHeadingClick?: (headingIndex: number, event: HeadingClickEvent) => void;
}

// Heading item
export interface HeadingItem {
  text: string;
  level: number;
  variant?: HeadingVariants;
  size?: HeadingSizes;
  color?: string;
  align?: 'left' | 'center' | 'right';
}