import { BaseProps } from '../../BaseComponent';

// Flex variants
export type FlexVariants = 
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

// Flex sizes
export type FlexSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// Flex states
export type FlexStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success';

// Flex direction
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

// Flex justify content
export type FlexJustifyContent = 
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

// Flex align items
export type FlexAlignItems = 
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'stretch'
  | 'baseline';

// Flex wrap
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

// Flex props interface
export interface FlexProps extends BaseProps {
  // Optional props
  direction?: FlexDirection;
  justifyContent?: FlexJustifyContent;
  alignItems?: FlexAlignItems;
  wrap?: FlexWrap;
  spacing?: number;
  gap?: number;
  variant?: FlexVariants;
  size?: FlexSizes;
  state?: FlexStates;
  
  // Flex-specific styling
  flexStyle?: 'default' | 'outline' | 'ghost' | 'elevated' | 'bordered';
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  
  // Layout props
  minHeight?: number;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  
  // Flex behavior
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
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Flex configuration for theming
export interface FlexConfig {
  variant: FlexVariants;
  size: FlexSizes;
  state: FlexStates;
  theme: any;
  direction: FlexDirection;
  justifyContent: FlexJustifyContent;
  alignItems: FlexAlignItems;
  wrap: FlexWrap;
  spacing: number;
  gap: number;
}

// Flex style configuration
export interface FlexStyleConfig {
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

// Flex event types
export interface FlexClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

export interface FlexFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface FlexMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface FlexKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Flex validation result
export interface FlexValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: FlexProps;
}

// Flex factory options
export interface FlexFactoryOptions {
  defaultVariant?: FlexVariants;
  defaultSize?: FlexSizes;
  defaultState?: FlexStates;
  theme?: any;
  parent?: any;
  defaultDirection?: FlexDirection;
  defaultJustifyContent?: FlexJustifyContent;
  defaultAlignItems?: FlexAlignItems;
  defaultSpacing?: number;
}

// Flex group props
export interface FlexGroupProps extends BaseProps {
  flexes: FlexProps[];
  direction?: FlexDirection;
  spacing?: number;
  variant?: FlexVariants;
  size?: FlexSizes;
  onFlexClick?: (flexIndex: number, event: any) => void;
}

// Flex item
export interface FlexItem {
  direction: FlexDirection;
  justifyContent: FlexJustifyContent;
  alignItems: FlexAlignItems;
  wrap: FlexWrap;
  spacing: number;
  gap: number;
  variant?: FlexVariants;
  size?: FlexSizes;
  children?: any[];
}