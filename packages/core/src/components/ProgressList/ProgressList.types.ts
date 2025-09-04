import { BaseProps } from '../../BaseComponent';

// ProgressList variants
export type ProgressListVariants = 
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

// ProgressList sizes
export type ProgressListSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// ProgressList states
export type ProgressListStates = 
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

// ProgressList types
export type ProgressListType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// ProgressList style
export type ProgressListStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Progress item status
export type ProgressItemStatus = 'pending' | 'in-progress' | 'completed' | 'error' | 'warning';

// Progress item interface
export interface ProgressItem {
  id: string;
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
  status?: ProgressItemStatus;
  description?: string;
  metadata?: Record<string, any>;
}

// ProgressList props interface
export interface ProgressListProps extends BaseProps {
  // Optional props
  variant?: ProgressListVariants;
  size?: ProgressListSizes;
  state?: ProgressListStates;
  
  // ProgressList content
  items?: ProgressItem[];
  
  // ProgressList-specific styling
  progressListStyle?: ProgressListStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: ProgressListType;
  style?: ProgressListStyle;
  showHeader?: boolean;
  showFooter?: boolean;
  showProgressBars?: boolean;
  showStatus?: boolean;
  showValues?: boolean;
  showDescriptions?: boolean;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // ProgressList behavior
  clickable?: boolean;
  interactive?: boolean;
  selectable?: boolean;
  scrollable?: boolean;
  
  // ProgressList dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // ProgressList appearance
  header?: string;
  footer?: string;
  emptyMessage?: string;
  progressBarWidth?: number;
  filledCharacter?: string;
  emptyCharacter?: string;
  borderStyle?: string;
  
  // ProgressList thresholds
  warningThreshold?: number;
  errorThreshold?: number;
  successThreshold?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onItemAdd?: (event: ProgressListItemAddEvent) => void;
  onItemRemove?: (event: ProgressListItemRemoveEvent) => void;
  onItemUpdate?: (event: ProgressListItemUpdateEvent) => void;
  onItemSelect?: (event: ProgressListItemSelectEvent) => void;
  onItemsChange?: (event: ProgressListItemsChangeEvent) => void;
  onItemsClear?: (event: ProgressListItemsClearEvent) => void;
  onScroll?: (event: ProgressListScrollEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// ProgressList configuration for theming
export interface ProgressListConfig {
  variant: ProgressListVariants;
  size: ProgressListSizes;
  state: ProgressListStates;
  theme: any;
  items: ProgressItem[];
  type: ProgressListType;
  style: ProgressListStyle;
  showHeader: boolean;
  showFooter: boolean;
  showProgressBars: boolean;
  showStatus: boolean;
  showValues: boolean;
  showDescriptions: boolean;
  selectable: boolean;
  scrollable: boolean;
}

// ProgressList style configuration
export interface ProgressListStyleConfig {
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
  scrollable?: boolean;
}

// ProgressList event types
export interface ProgressListItemAddEvent {
  type: 'itemadd';
  target: any;
  item: ProgressItem;
  totalItems: number;
}

export interface ProgressListItemRemoveEvent {
  type: 'itemremove';
  target: any;
  item: ProgressItem;
  totalItems: number;
}

export interface ProgressListItemUpdateEvent {
  type: 'itemupdate';
  target: any;
  item: ProgressItem;
  previousItem: ProgressItem;
}

export interface ProgressListItemSelectEvent {
  type: 'itemselect';
  target: any;
  item: ProgressItem;
  index: number;
}

export interface ProgressListItemsChangeEvent {
  type: 'itemschange';
  target: any;
  items: ProgressItem[];
  previousItems: ProgressItem[];
}

export interface ProgressListItemsClearEvent {
  type: 'itemsclear';
  target: any;
}

export interface ProgressListScrollEvent {
  type: 'scroll';
  target: any;
  position: number;
  maxScroll: number;
}

export interface ProgressListClickEvent {
  type: 'click';
  target: any;
  items: ProgressItem[];
  selectedIndex: number;
}

export interface ProgressListFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface ProgressListMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface ProgressListKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// ProgressList validation result
export interface ProgressListValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: ProgressListProps;
}

// ProgressList factory options
export interface ProgressListFactoryOptions {
  defaultVariant?: ProgressListVariants;
  defaultSize?: ProgressListSizes;
  defaultState?: ProgressListStates;
  theme?: any;
  parent?: any;
  defaultItems?: ProgressItem[];
  defaultType?: ProgressListType;
  defaultStyle?: ProgressListStyle;
  defaultShowHeader?: boolean;
  defaultShowFooter?: boolean;
  defaultShowProgressBars?: boolean;
  defaultShowStatus?: boolean;
  defaultShowValues?: boolean;
  defaultShowDescriptions?: boolean;
  defaultSelectable?: boolean;
  defaultScrollable?: boolean;
}

// ProgressList group props
export interface ProgressListGroupProps extends BaseProps {
  progressLists: ProgressListProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: ProgressListVariants;
  size?: ProgressListSizes;
  onProgressListClick?: (listIndex: number, event: any) => void;
}

// ProgressList layout props
export interface ProgressListLayoutProps extends BaseProps {
  progressLists: ProgressListProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: ProgressListVariants;
  size?: ProgressListSizes;
  onLayoutChange?: (layout: any) => void;
}

// ProgressList filter props
export interface ProgressListFilterProps extends BaseProps {
  progressList: ProgressListProps;
  filters: {
    status?: ProgressItemStatus[];
    minValue?: number;
    maxValue?: number;
    searchQuery?: string;
  };
  onFilterChange?: (filters: any) => void;
}

// ProgressList sort props
export interface ProgressListSortProps extends BaseProps {
  progressList: ProgressListProps;
  sortBy: 'label' | 'value' | 'status' | 'progress';
  sortOrder: 'asc' | 'desc';
  onSortChange?: (sortBy: string, sortOrder: string) => void;
}