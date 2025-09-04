import { BaseProps } from '../../BaseComponent';

// Breadcrumb variants
export type BreadcrumbVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost';

// Breadcrumb sizes
export type BreadcrumbSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Breadcrumb states
export type BreadcrumbStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success';

// Breadcrumb item interface
export interface BreadcrumbItem {
  label: string;
  path: string;
  active?: boolean;
  disabled?: boolean;
  icon?: string;
}

// Breadcrumb props interface
export interface BreadcrumbProps extends BaseProps {
  // Required props
  items: BreadcrumbItem[];
  
  // Optional props
  separator?: string;
  maxItems?: number;
  variant?: BreadcrumbVariants;
  size?: BreadcrumbSizes;
  state?: BreadcrumbStates;
  
  // Breadcrumb-specific styling
  breadcrumbStyle?: 'default' | 'compact' | 'expanded';
  showIcons?: boolean;
  truncate?: boolean;
  ellipsis?: string;
  
  // Layout props
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onNavigate?: (path: string, index: number) => void;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
}

// Breadcrumb configuration for theming
export interface BreadcrumbConfig {
  variant: BreadcrumbVariants;
  size: BreadcrumbSizes;
  state: BreadcrumbStates;
  theme: any;
  items: BreadcrumbItem[];
  separator: string;
}

// Breadcrumb style configuration
export interface BreadcrumbStyleConfig {
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

// Breadcrumb event types
export interface BreadcrumbNavigateEvent {
  type: 'navigate';
  target: any;
  path: string;
  index: number;
}

export interface BreadcrumbItemClickEvent {
  type: 'itemClick';
  target: any;
  item: BreadcrumbItem;
  index: number;
}

export interface BreadcrumbFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

// Breadcrumb validation result
export interface BreadcrumbValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: BreadcrumbProps;
}

// Breadcrumb factory options
export interface BreadcrumbFactoryOptions {
  defaultVariant?: BreadcrumbVariants;
  defaultSize?: BreadcrumbSizes;
  defaultState?: BreadcrumbStates;
  theme?: any;
  parent?: any;
  separator?: string;
}

// Breadcrumb group props
export interface BreadcrumbGroupProps extends BaseProps {
  breadcrumbs: BreadcrumbProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: BreadcrumbVariants;
  size?: BreadcrumbSizes;
  onBreadcrumbClick?: (breadcrumbIndex: number, event: any) => void;
}