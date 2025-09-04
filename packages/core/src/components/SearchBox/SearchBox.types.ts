import { BaseProps } from '../../BaseComponent';

// SearchBox variants
export type SearchBoxVariants = 
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

// SearchBox sizes
export type SearchBoxSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// SearchBox states
export type SearchBoxStates = 
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

// SearchBox types
export type SearchBoxType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// SearchBox style
export type SearchBoxStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// SearchBox search behavior
export type SearchBehavior = 'instant' | 'debounced' | 'manual';

// SearchBox props interface
export interface SearchBoxProps extends BaseProps {
  // Optional props
  variant?: SearchBoxVariants;
  size?: SearchBoxSizes;
  state?: SearchBoxStates;
  
  // SearchBox content
  label?: string;
  placeholder?: string;
  searchIcon?: string;
  searchingText?: string;
  
  // SearchBox-specific styling
  searchBoxStyle?: SearchBoxStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: SearchBoxType;
  style?: SearchBoxStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // SearchBox behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  required?: boolean;
  
  // SearchBox dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // SearchBox appearance
  suggestions?: string[];
  borderStyle?: string;
  
  // SearchBox search options
  autoSearch?: boolean;
  minSearchLength?: number;
  searchBehavior?: SearchBehavior;
  searchDelay?: number;
  
  // SearchBox display options
  showIcon?: boolean;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onSearch?: (event: SearchBoxSearchEvent) => void;
  onClear?: (event: SearchBoxClearEvent) => void;
  onInputChange?: (event: SearchBoxInputChangeEvent) => void;
  onSuggestionSelect?: (event: SearchBoxSuggestionSelectEvent) => void;
  onSuggestionAdd?: (event: SearchBoxSuggestionAddEvent) => void;
  onSuggestionRemove?: (event: SearchBoxSuggestionRemoveEvent) => void;
  onSuggestionsChange?: (event: SearchBoxSuggestionsChangeEvent) => void;
  onSuggestionsClear?: (event: SearchBoxSuggestionsClearEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// SearchBox configuration for theming
export interface SearchBoxConfig {
  variant: SearchBoxVariants;
  size: SearchBoxSizes;
  state: SearchBoxStates;
  theme: any;
  type: SearchBoxType;
  style: SearchBoxStyle;
  label?: string;
  placeholder?: string;
  searchIcon?: string;
  suggestions: string[];
  showIcon: boolean;
  showSuggestions: boolean;
  autoSearch: boolean;
  minSearchLength: number;
}

// SearchBox style configuration
export interface SearchBoxStyleConfig {
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

// SearchBox event types
export interface SearchBoxSearchEvent {
  type: 'search';
  target: any;
  query: string;
  suggestions: string[];
}

export interface SearchBoxClearEvent {
  type: 'clear';
  target: any;
}

export interface SearchBoxInputChangeEvent {
  type: 'inputchange';
  target: any;
  value: string;
}

export interface SearchBoxSuggestionSelectEvent {
  type: 'suggestionselect';
  target: any;
  suggestion: string;
}

export interface SearchBoxSuggestionAddEvent {
  type: 'suggestionadd';
  target: any;
  suggestion: string;
  totalSuggestions: number;
}

export interface SearchBoxSuggestionRemoveEvent {
  type: 'suggestionremove';
  target: any;
  suggestion: string;
  totalSuggestions: number;
}

export interface SearchBoxSuggestionsChangeEvent {
  type: 'suggestionschange';
  target: any;
  suggestions: string[];
  previousSuggestions: string[];
}

export interface SearchBoxSuggestionsClearEvent {
  type: 'suggestionsclear';
  target: any;
}

export interface SearchBoxClickEvent {
  type: 'click';
  target: any;
  searchValue: string;
  suggestions: string[];
}

export interface SearchBoxFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface SearchBoxMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface SearchBoxKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// SearchBox validation result
export interface SearchBoxValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: SearchBoxProps;
}

// SearchBox factory options
export interface SearchBoxFactoryOptions {
  defaultVariant?: SearchBoxVariants;
  defaultSize?: SearchBoxSizes;
  defaultState?: SearchBoxStates;
  theme?: any;
  parent?: any;
  defaultType?: SearchBoxType;
  defaultStyle?: SearchBoxStyle;
  defaultLabel?: string;
  defaultPlaceholder?: string;
  defaultSearchIcon?: string;
  defaultSuggestions?: string[];
  defaultShowIcon?: boolean;
  defaultShowSuggestions?: boolean;
  defaultAutoSearch?: boolean;
  defaultMinSearchLength?: number;
}

// SearchBox group props
export interface SearchBoxGroupProps extends BaseProps {
  searchBoxes: SearchBoxProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: SearchBoxVariants;
  size?: SearchBoxSizes;
  onSearchBoxClick?: (searchBoxIndex: number, event: any) => void;
}

// SearchBox layout props
export interface SearchBoxLayoutProps extends BaseProps {
  searchBoxes: SearchBoxProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: SearchBoxVariants;
  size?: SearchBoxSizes;
  onLayoutChange?: (layout: any) => void;
}

// SearchBox search props
export interface SearchBoxSearchProps extends SearchBoxProps {
  searchOptions: {
    behavior: SearchBehavior;
    delay: number;
    minLength: number;
    maxResults: number;
  };
  onSearchChange?: (searchData: any) => void;
}

// SearchBox theme props
export interface SearchBoxThemeProps extends SearchBoxProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}