import { BaseProps } from '../../BaseComponent';

// MultiSelect variants
export type MultiSelectVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'filled'
  | 'bordered';

// MultiSelect sizes
export type MultiSelectSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// MultiSelect states
export type MultiSelectStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'loading'
  | 'open'
  | 'closed';

// MultiSelect option interface
export interface MultiSelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  hidden?: boolean;
  icon?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// MultiSelect display mode
export type MultiSelectDisplayMode = 'tags' | 'list' | 'compact' | 'chips';

// MultiSelect search mode
export type MultiSelectSearchMode = 'none' | 'basic' | 'advanced' | 'fuzzy';

// MultiSelect props interface
export interface MultiSelectProps extends BaseProps {
  // Optional props
  variant?: MultiSelectVariants;
  size?: MultiSelectSizes;
  state?: MultiSelectStates;
  
  // MultiSelect content
  options?: MultiSelectOption[];
  defaultValue?: any[];
  placeholder?: string;
  
  // MultiSelect-specific styling
  multiSelectStyle?: 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  selectionColor?: string;
  
  // Display options
  displayMode?: MultiSelectDisplayMode;
  maxDisplayValues?: number;
  showCheckboxes?: boolean;
  showIcons?: boolean;
  showDescriptions?: boolean;
  compact?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // MultiSelect behavior
  clickable?: boolean;
  interactive?: boolean;
  searchable?: boolean;
  searchMode?: MultiSelectSearchMode;
  searchPlaceholder?: string;
  searchDebounce?: number;
  
  // Selection behavior
  maxSelections?: number;
  minSelections?: number;
  allowEmptySelection?: boolean;
  selectAllOption?: boolean;
  deselectAllOption?: boolean;
  
  // Dropdown behavior
  autoClose?: boolean;
  closeOnSelect?: boolean;
  closeOnBlur?: boolean;
  dropdownHeight?: number;
  dropdownWidth?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onChange?: (event: MultiSelectChangeEvent) => void;
  onDropdownOpen?: (event: MultiSelectDropdownOpenEvent) => void;
  onDropdownClose?: (event: MultiSelectDropdownCloseEvent) => void;
  onOptionSelect?: (event: MultiSelectOptionSelectEvent) => void;
  onOptionDeselect?: (event: MultiSelectOptionDeselectEvent) => void;
  onSearch?: (event: MultiSelectSearchEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// MultiSelect configuration for theming
export interface MultiSelectConfig {
  variant: MultiSelectVariants;
  size: MultiSelectSizes;
  state: MultiSelectStates;
  theme: any;
  options: MultiSelectOption[];
  selectedValues: any[];
  displayMode: MultiSelectDisplayMode;
  searchable: boolean;
  maxSelections: number;
  allowEmptySelection: boolean;
}

// MultiSelect style configuration
export interface MultiSelectStyleConfig {
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
  selectionBg?: string;
  selectionFg?: string;
  dropdownBg?: string;
  dropdownFg?: string;
}

// MultiSelect event types
export interface MultiSelectChangeEvent {
  type: 'change';
  target: any;
  selectedValues: any[];
  previousValues: any[];
}

export interface MultiSelectDropdownOpenEvent {
  type: 'dropdownopen';
  target: any;
}

export interface MultiSelectDropdownCloseEvent {
  type: 'dropdownclose';
  target: any;
}

export interface MultiSelectOptionSelectEvent {
  type: 'optionselect';
  target: any;
  option: MultiSelectOption;
  selectedValues: any[];
}

export interface MultiSelectOptionDeselectEvent {
  type: 'optiondeselect';
  target: any;
  option: MultiSelectOption;
  selectedValues: any[];
}

export interface MultiSelectSearchEvent {
  type: 'search';
  target: any;
  query: string;
  results: MultiSelectOption[];
}

export interface MultiSelectClickEvent {
  type: 'click';
  target: any;
  selectedValues: any[];
  isOpen: boolean;
}

export interface MultiSelectFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface MultiSelectMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface MultiSelectKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// MultiSelect validation result
export interface MultiSelectValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: MultiSelectProps;
}

// MultiSelect factory options
export interface MultiSelectFactoryOptions {
  defaultVariant?: MultiSelectVariants;
  defaultSize?: MultiSelectSizes;
  defaultState?: MultiSelectStates;
  theme?: any;
  parent?: any;
  defaultOptions?: MultiSelectOption[];
  defaultSelectedValues?: any[];
  defaultDisplayMode?: MultiSelectDisplayMode;
  defaultSearchable?: boolean;
  defaultMaxSelections?: number;
  defaultAllowEmptySelection?: boolean;
}

// MultiSelect group props
export interface MultiSelectGroupProps extends BaseProps {
  multiSelects: MultiSelectProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: MultiSelectVariants;
  size?: MultiSelectSizes;
  onMultiSelectClick?: (selectIndex: number, event: any) => void;
}

// MultiSelect option group
export interface MultiSelectOptionGroup {
  label: string;
  options: MultiSelectOption[];
  disabled?: boolean;
  hidden?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
}

// MultiSelect search result
export interface MultiSelectSearchResult {
  query: string;
  results: MultiSelectOption[];
  totalResults: number;
  filteredResults: MultiSelectOption[];
  highlightedIndices: number[];
}