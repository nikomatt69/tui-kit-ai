import { BaseProps } from '../../BaseComponent';

// Table variants
export type TableVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'striped'
  | 'animated'
  | 'gradient';

// Table sizes
export type TableSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Table states
export type TableStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'loading'
  | 'complete'
  | 'indeterminate';

// Table types
export type TableType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// Table style
export type TableStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Column alignment types
export type ColumnAlign = 'left' | 'center' | 'right';

// Sort direction types
export type SortDirection = 'asc' | 'desc';

// Table column interface
export interface TableColumn {
  id: string;
  label: string;
  width?: number;
  align?: ColumnAlign;
  sortable?: boolean;
  formatter?: (value: any) => string;
}

// Table row interface
export interface TableRow {
  id: string;
  data: Record<string, any>;
  selected?: boolean;
  highlighted?: boolean;
  metadata?: Record<string, any>;
}

// Table props interface
export interface TableProps extends BaseProps {
  // Optional props
  variant?: TableVariants;
  size?: TableSizes;
  state?: TableStates;
  
  // Table content
  title?: string;
  emptyMessage?: string;
  noDataMessage?: string;
  
  // Table-specific styling
  tableStyle?: TableStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: TableType;
  style?: TableStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Table behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  
  // Table dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Table appearance
  columns?: TableColumn[];
  rows?: TableRow[];
  borderStyle?: string;
  
  // Table display options
  showHeader?: boolean;
  showSeparators?: boolean;
  defaultColumnWidth?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onRowSelect?: (event: TableRowSelectEvent) => void;
  onRowDeselect?: (event: TableRowDeselectEvent) => void;
  onSelectAll?: (event: TableSelectAllEvent) => void;
  onSelectionClear?: (event: TableSelectionClearEvent) => void;
  onRowFocus?: (event: TableRowFocusEvent) => void;
  onColumnFocus?: (event: TableColumnFocusEvent) => void;
  onSort?: (event: TableSortEvent) => void;
  onRowAdd?: (event: TableRowAddEvent) => void;
  onRowRemove?: (event: TableRowRemoveEvent) => void;
  onRowUpdate?: (event: TableRowUpdateEvent) => void;
  onColumnAdd?: (event: TableColumnAddEvent) => void;
  onColumnRemove?: (event: TableColumnRemoveEvent) => void;
  onColumnsChange?: (event: TableColumnsChangeEvent) => void;
  onRowsChange?: (event: TableRowsChangeEvent) => void;
  onTableClear?: (event: TableTableClearEvent) => void;
  onScroll?: (event: any) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Table configuration for theming
export interface TableConfig {
  variant: TableVariants;
  size: TableSizes;
  state: TableStates;
  theme: any;
  type: TableType;
  style: TableStyle;
  title?: string;
  columns: TableColumn[];
  rows: TableRow[];
  showHeader: boolean;
  showSeparators: boolean;
  defaultColumnWidth?: number;
}

// Table style configuration
export interface TableStyleConfig {
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
  fillColor?: string;
  emptyColor?: string;
  striped?: boolean;
  animated?: boolean;
  gradient?: boolean;
}

// Table event types
export interface TableRowSelectEvent {
  type: 'rowselect';
  target: any;
  rowId: string;
  selectedRows: string[];
}

export interface TableRowDeselectEvent {
  type: 'rowdeselect';
  target: any;
  rowId: string;
  selectedRows: string[];
}

export interface TableSelectAllEvent {
  type: 'selectall';
  target: any;
  selectedRows: string[];
}

export interface TableSelectionClearEvent {
  type: 'selectionclear';
  target: any;
}

export interface TableRowFocusEvent {
  type: 'rowfocus';
  target: any;
  rowIndex: number;
  row: TableRow;
}

export interface TableColumnFocusEvent {
  type: 'columnfocus';
  target: any;
  columnIndex: number;
  column: TableColumn;
}

export interface TableSortEvent {
  type: 'sort';
  target: any;
  columnId: string;
  direction: SortDirection;
}

export interface TableRowAddEvent {
  type: 'rowadd';
  target: any;
  row: TableRow;
  totalRows: number;
}

export interface TableRowRemoveEvent {
  type: 'rowremove';
  target: any;
  row: TableRow;
  totalRows: number;
}

export interface TableRowUpdateEvent {
  type: 'rowupdate';
  target: any;
  row: TableRow;
  previousRow: TableRow;
}

export interface TableColumnAddEvent {
  type: 'columnadd';
  target: any;
  column: TableColumn;
  totalColumns: number;
}

export interface TableColumnRemoveEvent {
  type: 'columnremove';
  target: any;
  column: TableColumn;
  totalColumns: number;
}

export interface TableColumnsChangeEvent {
  type: 'columnschange';
  target: any;
  columns: TableColumn[];
  previousColumns: TableColumn[];
}

export interface TableRowsChangeEvent {
  type: 'rowschange';
  target: any;
  rows: TableRow[];
  previousRows: TableRow[];
}

export interface TableTableClearEvent {
  type: 'tableclear';
  target: any;
}

export interface TableClickEvent {
  type: 'click';
  target: any;
  columns: TableColumn[];
  rows: TableRow[];
  selectedRows: string[];
  focusedRowIndex: number;
  focusedColumnIndex: number;
}

export interface TableFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface TableMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface TableKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Table validation result
export interface TableValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: TableProps;
}

// Table factory options
export interface TableFactoryOptions {
  defaultVariant?: TableVariants;
  defaultSize?: TableSizes;
  defaultState?: TableStates;
  theme?: any;
  parent?: any;
  defaultType?: TableType;
  defaultStyle?: TableStyle;
  defaultTitle?: string;
  defaultColumns?: TableColumn[];
  defaultRows?: TableRow[];
  defaultShowHeader?: boolean;
  defaultShowSeparators?: boolean;
  defaultDefaultColumnWidth?: number;
}

// Table group props
export interface TableGroupProps extends BaseProps {
  tables: TableProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: TableVariants;
  size?: TableSizes;
  onTableClick?: (tableIndex: number, event: any) => void;
}

// Table layout props
export interface TableLayoutProps extends BaseProps {
  tables: TableProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: TableVariants;
  size?: TableSizes;
  onLayoutChange?: (layout: any) => void;
}

// Table theme props
export interface TableThemeProps extends TableProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}