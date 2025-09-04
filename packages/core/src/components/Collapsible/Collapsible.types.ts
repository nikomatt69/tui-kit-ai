import { BaseProps } from '../../BaseComponent';

// Collapsible variants
export type CollapsibleVariants = 
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

// Collapsible sizes
export type CollapsibleSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Collapsible states
export type CollapsibleStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'expanded'
  | 'collapsed'
  | 'error'
  | 'success';

// Collapsible props interface
export interface CollapsibleProps extends BaseProps {
  // Optional props
  title?: string;
  children?: string;
  defaultExpanded?: boolean;
  variant?: CollapsibleVariants;
  size?: CollapsibleSizes;
  state?: CollapsibleStates;
  
  // Collapsible-specific styling
  collapsibleStyle?: 'default' | 'outline' | 'ghost' | 'elevated' | 'bordered';
  headerStyle?: 'default' | 'minimal' | 'prominent' | 'subtle';
  iconSpacing?: number;
  animated?: boolean;
  
  // Layout props
  headerAlign?: 'left' | 'center' | 'right';
  contentAlign?: 'left' | 'center' | 'right';
  headerHeight?: number;
  
  // Collapsible behavior
  clickable?: boolean;
  keyboard?: boolean;
  autoFocus?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  ariaExpanded?: boolean;
  
  // Event handlers
  onToggle?: (expanded: boolean) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
}

// Collapsible configuration for theming
export interface CollapsibleConfig {
  variant: CollapsibleVariants;
  size: CollapsibleSizes;
  state: CollapsibleStates;
  theme: any;
  title?: string;
  defaultExpanded: boolean;
  animated?: boolean;
  iconSpacing?: number;
}

// Collapsible style configuration
export interface CollapsibleStyleConfig {
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

// Collapsible header style configuration
export interface CollapsibleHeaderStyleConfig {
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
  cursor?: string;
}

// Collapsible content style configuration
export interface CollapsibleContentStyleConfig {
  bg: string;
  fg: string;
  padding: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  align: 'left' | 'center' | 'right';
  border?: {
    type: string;
    fg: string;
    bg?: string;
  };
}

// Collapsible event types
export interface CollapsibleToggleEvent {
  type: 'toggle';
  target: any;
  expanded: boolean;
}

export interface CollapsibleExpandEvent {
  type: 'expand';
  target: any;
}

export interface CollapsibleCollapseEvent {
  type: 'collapse';
  target: any;
}

export interface CollapsibleFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface CollapsibleKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

export interface CollapsibleClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

// Collapsible validation result
export interface CollapsibleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: CollapsibleProps;
}

// Collapsible factory options
export interface CollapsibleFactoryOptions {
  defaultVariant?: CollapsibleVariants;
  defaultSize?: CollapsibleSizes;
  defaultState?: CollapsibleStates;
  theme?: any;
  parent?: any;
  defaultExpanded?: boolean;
  animated?: boolean;
}

// Collapsible group props
export interface CollapsibleGroupProps extends BaseProps {
  collapsibles: CollapsibleProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: CollapsibleVariants;
  size?: CollapsibleSizes;
  accordion?: boolean;
  onCollapsibleToggle?: (index: number, expanded: boolean) => void;
}

// Collapsible item
export interface CollapsibleItem {
  title: string;
  content: string;
  defaultExpanded?: boolean;
  disabled?: boolean;
  variant?: CollapsibleVariants;
  size?: CollapsibleSizes;
}