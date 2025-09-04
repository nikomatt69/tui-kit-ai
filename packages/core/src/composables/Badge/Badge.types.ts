import { BaseProps } from '../../BaseComponent';

// Badge variants
export type BadgeVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline';

// Badge sizes
export type BadgeSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Badge states
export type BadgeStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success';

// Badge props interface
export interface BadgeProps extends BaseProps {
  // Optional props
  text?: string;
  count?: number | string;
  dot?: boolean;
  overflowCount?: number;
  showZero?: boolean;
  variant?: BadgeVariants;
  size?: BadgeSizes;
  state?: BadgeStates;
  color?: string;
  
  // Badge-specific styling
  badgeStyle?: 'solid' | 'outline' | 'text';
  rounded?: boolean;
  
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

// Badge configuration for theming
export interface BadgeConfig {
  variant: BadgeVariants;
  size: BadgeSizes;
  state: BadgeStates;
  theme: any;
  color?: string;
}

// Badge style configuration
export interface BadgeStyleConfig {
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

// Badge event types
export interface BadgeClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

export interface BadgeFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

// Badge validation result
export interface BadgeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: BadgeProps;
}

// Badge factory options
export interface BadgeFactoryOptions {
  defaultVariant?: BadgeVariants;
  defaultSize?: BadgeSizes;
  defaultState?: BadgeStates;
  theme?: any;
  parent?: any;
}

// Badge group props
export interface BadgeGroupProps extends BaseProps {
  badges: BadgeProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: BadgeVariants;
  size?: BadgeSizes;
  onBadgeClick?: (badgeIndex: number, event: any) => void;
}