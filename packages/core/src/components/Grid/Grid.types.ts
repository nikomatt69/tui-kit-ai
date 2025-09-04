import { BaseProps } from '../../BaseComponent';

// Grid variants
export type GridVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'bordered';

// Grid sizes
export type GridSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Grid states
export type GridStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success';

// Grid props interface
export interface GridProps extends BaseProps {
  // Optional props
  variant?: GridVariants;
  size?: GridSizes;
  state?: GridStates;
  
  // Grid layout
  columns?: number;
  rows?: number;
  spacing?: number;
  cellWidth?: number;
  cellHeight?: number;
  
  // Grid behavior
  showGrid?: boolean;
  gridLines?: boolean;
  autoSize?: boolean;
  responsive?: boolean;
  
  // Grid styling
  gridStyle?: 'default' | 'outline' | 'bordered' | 'ghost' | 'elevated';
  cellPadding?: number;
  cellMargin?: number;
  borderStyle?: string;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Grid behavior
  clickable?: boolean;
  interactive?: boolean;
  selectable?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onClick?: (event: any) => void;
  onCellClick?: (row: number, col: number, event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Grid configuration for theming
export interface GridConfig {
  variant: GridVariants;
  size: GridSizes;
  state: GridStates;
  theme: any;
  columns: number;
  rows: number;
  spacing: number;
  cellWidth: number;
  cellHeight: number;
  showGrid: boolean;
}

// Grid style configuration
export interface GridStyleConfig {
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

// Grid event types
export interface GridClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

export interface GridCellClickEvent {
  type: 'cellclick';
  target: any;
  row: number;
  col: number;
  data?: any;
}

export interface GridFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface GridMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface GridKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Grid validation result
export interface GridValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: GridProps;
}

// Grid factory options
export interface GridFactoryOptions {
  defaultVariant?: GridVariants;
  defaultSize?: GridSizes;
  defaultState?: GridStates;
  theme?: any;
  parent?: any;
  defaultColumns?: number;
  defaultRows?: number;
  defaultSpacing?: number;
  defaultCellWidth?: number;
  defaultCellHeight?: number;
}

// Grid group props
export interface GridGroupProps extends BaseProps {
  grids: GridProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: GridVariants;
  size?: GridSizes;
  onGridClick?: (gridIndex: number, event: any) => void;
}

// Grid item
export interface GridItem {
  columns: number;
  rows: number;
  spacing: number;
  cellWidth: number;
  cellHeight: number;
  variant?: GridVariants;
  size?: GridSizes;
  children?: any[];
}

// Grid cell
export interface GridCell {
  row: number;
  col: number;
  data: any;
  width: number;
  height: number;
  selected?: boolean;
  focused?: boolean;
}