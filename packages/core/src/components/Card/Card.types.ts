import { BaseProps } from '../../BaseComponent';

// Card variants
export type CardVariants = 
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

// Card sizes
export type CardSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// Card states
export type CardStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success';

// Card props interface
export interface CardProps extends BaseProps {
  // Optional props
  header?: string;
  content?: string;
  footer?: string;
  variant?: CardVariants;
  size?: CardSizes;
  state?: CardStates;
  
  // Card-specific styling
  cardStyle?: 'default' | 'outline' | 'ghost' | 'elevated';
  elevated?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  bordered?: boolean;
  
  // Layout props
  headerAlign?: 'left' | 'center' | 'right';
  footerAlign?: 'left' | 'center' | 'right';
  contentAlign?: 'left' | 'center' | 'right';
  
  // Card behavior
  clickable?: boolean;
  selectable?: boolean;
  draggable?: boolean;
  
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

// Card configuration for theming
export interface CardConfig {
  variant: CardVariants;
  size: CardSizes;
  state: CardStates;
  theme: any;
  header?: string;
  content?: string;
  footer?: string;
  elevated?: boolean;
  rounded?: boolean;
  shadow?: boolean;
}

// Card style configuration
export interface CardStyleConfig {
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

// Card header style configuration
export interface CardHeaderStyleConfig {
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
}

// Card body style configuration
export interface CardBodyStyleConfig {
  bg: string;
  fg: string;
  padding: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  align: 'left' | 'center' | 'right';
}

// Card footer style configuration
export interface CardFooterStyleConfig {
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
}

// Card event types
export interface CardClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

export interface CardFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface CardKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Card validation result
export interface CardValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: CardProps;
}

// Card factory options
export interface CardFactoryOptions {
  defaultVariant?: CardVariants;
  defaultSize?: CardSizes;
  defaultState?: CardStates;
  theme?: any;
  parent?: any;
  elevated?: boolean;
  rounded?: boolean;
  shadow?: boolean;
}

// Card group props
export interface CardGroupProps extends BaseProps {
  cards: CardProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: CardVariants;
  size?: CardSizes;
  onCardClick?: (cardIndex: number, event: any) => void;
}