import { BaseProps } from '../../BaseComponent';

// Tabs variants
export type TabsVariants = 
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

// Tabs sizes
export type TabsSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Tabs states
export type TabsStates = 
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

// Tabs types
export type TabsType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// Tabs style
export type TabsStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Tab item interface
export interface TabItem {
  id: string;
  label: string;
  content: string;
  icon?: string;
  disabled?: boolean;
  closable?: boolean;
  metadata?: Record<string, any>;
}

// Tabs props interface
export interface TabsProps extends BaseProps {
  // Optional props
  variant?: TabsVariants;
  size?: TabsSizes;
  state?: TabsStates;
  
  // Tabs content
  title?: string;
  emptyMessage?: string;
  noActiveTabMessage?: string;
  
  // Tabs-specific styling
  tabsStyle?: TabsStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: TabsType;
  style?: TabsStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Tabs behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  
  // Tabs dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Tabs appearance
  tabs?: TabItem[];
  defaultActiveTab?: string;
  borderStyle?: string;
  
  // Tabs display options
  showTabIcons?: boolean;
  showSeparators?: boolean;
  closable?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onTabActivate?: (event: TabsTabActivateEvent) => void;
  onTabFocus?: (event: TabsTabFocusEvent) => void;
  onTabAdd?: (event: TabsTabAddEvent) => void;
  onTabRemove?: (event: TabsTabRemoveEvent) => void;
  onTabUpdate?: (event: TabsTabUpdateEvent) => void;
  onTabsChange?: (event: TabsTabsChangeEvent) => void;
  onTabsClear?: (event: TabsTabsClearEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Tabs configuration for theming
export interface TabsConfig {
  variant: TabsVariants;
  size: TabsSizes;
  state: TabsStates;
  theme: any;
  type: TabsType;
  style: TabsStyle;
  title?: string;
  tabs: TabItem[];
  showTabIcons: boolean;
  showSeparators: boolean;
  closable: boolean;
}

// Tabs style configuration
export interface TabsStyleConfig {
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

// Tabs event types
export interface TabsTabActivateEvent {
  type: 'tabactivate';
  target: any;
  tabId: string;
  tab: TabItem;
  previousActiveTab: string | null;
}

export interface TabsTabFocusEvent {
  type: 'tabfocus';
  target: any;
  tabIndex: number;
  tab: TabItem;
}

export interface TabsTabAddEvent {
  type: 'tabadd';
  target: any;
  tab: TabItem;
  totalTabs: number;
}

export interface TabsTabRemoveEvent {
  type: 'tabremove';
  target: any;
  tab: TabItem;
  totalTabs: number;
}

export interface TabsTabUpdateEvent {
  type: 'tabupdate';
  target: any;
  tab: TabItem;
  previousTab: TabItem;
}

export interface TabsTabsChangeEvent {
  type: 'tabschange';
  target: any;
  tabs: TabItem[];
  previousTabs: TabItem[];
}

export interface TabsTabsClearEvent {
  type: 'tabsclear';
  target: any;
}

export interface TabsClickEvent {
  type: 'click';
  target: any;
  tabs: TabItem[];
  activeTabId: string | null;
  focusedTabIndex: number;
}

export interface TabsFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface TabsMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface TabsKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Tabs validation result
export interface TabsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: TabsProps;
}

// Tabs factory options
export interface TabsFactoryOptions {
  defaultVariant?: TabsVariants;
  defaultSize?: TabsSizes;
  defaultState?: TabsStates;
  theme?: any;
  parent?: any;
  defaultType?: TabsType;
  defaultStyle?: TabsStyle;
  defaultTitle?: string;
  defaultTabs?: TabItem[];
  defaultDefaultActiveTab?: string;
  defaultShowTabIcons?: boolean;
  defaultShowSeparators?: boolean;
  defaultClosable?: boolean;
}

// Tabs group props
export interface TabsGroupProps extends BaseProps {
  tabsComponents: TabsProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: TabsVariants;
  size?: TabsSizes;
  onTabsClick?: (tabsIndex: number, event: any) => void;
}

// Tabs layout props
export interface TabsLayoutProps extends BaseProps {
  tabsComponents: TabsProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: TabsVariants;
  size?: TabsSizes;
  onLayoutChange?: (layout: any) => void;
}

// Tabs theme props
export interface TabsThemeProps extends TabsProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}