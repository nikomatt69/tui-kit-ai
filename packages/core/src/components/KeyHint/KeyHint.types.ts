import { BaseProps } from '../../BaseComponent';

// KeyHint variants
export type KeyHintVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'highlighted';

// KeyHint sizes
export type KeyHintSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// KeyHint states
export type KeyHintStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success';

// KeyHint style types
export type KeyHintStyle = 
  | 'default'
  | 'brackets'
  | 'parentheses'
  | 'chevrons'
  | 'highlight'
  | 'minimal';

// KeyHint props interface
export interface KeyHintProps extends BaseProps {
  // Optional props
  variant?: KeyHintVariants;
  size?: KeyHintSizes;
  state?: KeyHintStates;
  
  // KeyHint content
  key?: string;
  description?: string;
  separator?: string;
  
  // KeyHint-specific styling
  keyStyle?: KeyHintStyle;
  color?: string;
  keyColor?: string;
  descriptionColor?: string;
  
  // Display options
  showKey?: boolean;
  showDescription?: boolean;
  compact?: boolean;
  monospace?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // KeyHint behavior
  clickable?: boolean;
  interactive?: boolean;
  tooltip?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onClick?: (event: KeyHintClickEvent) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// KeyHint configuration for theming
export interface KeyHintConfig {
  variant: KeyHintVariants;
  size: KeyHintSizes;
  state: KeyHintStates;
  theme: any;
  key?: string;
  description?: string;
  separator: string;
  keyStyle: KeyHintStyle;
  showKey: boolean;
  showDescription: boolean;
}

// KeyHint style configuration
export interface KeyHintStyleConfig {
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
  monospace?: boolean;
}

// KeyHint event types
export interface KeyHintClickEvent {
  type: 'click';
  target: any;
  key?: string;
  description?: string;
}

export interface KeyHintFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface KeyHintMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface KeyHintKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// KeyHint validation result
export interface KeyHintValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: KeyHintProps;
}

// KeyHint factory options
export interface KeyHintFactoryOptions {
  defaultVariant?: KeyHintVariants;
  defaultSize?: KeyHintSizes;
  defaultState?: KeyHintStates;
  theme?: any;
  parent?: any;
  defaultKey?: string;
  defaultDescription?: string;
  defaultSeparator?: string;
  defaultKeyStyle?: KeyHintStyle;
}

// KeyHint group props
export interface KeyHintGroupProps extends BaseProps {
  keyHints: KeyHintProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: KeyHintVariants;
  size?: KeyHintSizes;
  onKeyHintClick?: (hintIndex: number, event: KeyHintClickEvent) => void;
}

// KeyHint item
export interface KeyHintItem {
  key?: string;
  description?: string;
  separator?: string;
  keyStyle?: KeyHintStyle;
  variant?: KeyHintVariants;
  size?: KeyHintSizes;
  color?: string;
}