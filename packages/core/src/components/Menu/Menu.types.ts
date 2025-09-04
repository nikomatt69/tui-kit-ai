import { BaseProps } from '../../BaseComponent';

// Menu variants
export type MenuVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'dropdown'
  | 'context'
  | 'navigation';

// Menu sizes
export type MenuSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Menu states
export type MenuStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'open'
  | 'closed';

// Menu item interface
export interface MenuItem {
  id?: string;
  label: string;
  value?: any;
  disabled?: boolean;
  hidden?: boolean;
  icon?: string;
  shortcut?: string;
  items?: MenuItem[]; // For submenus
  action?: () => void;
  metadata?: Record<string, any>;
}

// Menu orientation
export type MenuOrientation = 'horizontal' | 'vertical';

// Menu alignment
export type MenuAlignment = 'left' | 'center' | 'right';

// Menu props interface
export interface MenuProps extends BaseProps {
  // Optional props
  variant?: MenuVariants;
  size?: MenuSizes;
  state?: MenuStates;
  
  // Menu content
  items?: MenuItem[];
  title?: string;
  emptyMessage?: string;
  
  // Menu-specific styling
  menuStyle?: 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  selectionColor?: string;
  
  // Display options
  orientation?: MenuOrientation;
  alignment?: MenuAlignment;
  compact?: boolean;
  showIcons?: boolean;
  showShortcuts?: boolean;
  showSelectionIndicator?: boolean;
  
  // Menu behavior
  clickable?: boolean;
  interactive?: boolean;
  keyboardNavigation?: boolean;
  autoClose?: boolean;
  closeOnSelect?: boolean;
  
  // Selection and navigation
  selectionIndicator?: string;
  submenuIndicator?: string;
  separator?: string;
  multiSelect?: boolean;
  allowEmptySelection?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onItemSelect?: (event: MenuItemSelectEvent) => void;
  onItemClick?: (event: MenuItemClickEvent) => void;
  onMenuOpen?: (event: MenuOpenEvent) => void;
  onMenuClose?: (event: MenuCloseEvent) => void;
  onSelectionChange?: (event: MenuSelectionChangeEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Menu configuration for theming
export interface MenuConfig {
  variant: MenuVariants;
  size: MenuSizes;
  state: MenuStates;
  theme: any;
  items: MenuItem[];
  orientation: MenuOrientation;
  alignment: MenuAlignment;
  showSelectionIndicator: boolean;
  showIcons: boolean;
  showShortcuts: boolean;
}

// Menu style configuration
export interface MenuStyleConfig {
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
}

// Menu event types
export interface MenuItemSelectEvent {
  type: 'itemselect';
  target: any;
  item: MenuItem;
  index: number;
}

export interface MenuItemClickEvent {
  type: 'itemclick';
  target: any;
  item: MenuItem;
  index: number;
}

export interface MenuOpenEvent {
  type: 'menuopen';
  target: any;
}

export interface MenuCloseEvent {
  type: 'menuclose';
  target: any;
}

export interface MenuSelectionChangeEvent {
  type: 'selectionchange';
  target: any;
  selectedItem: MenuItem;
  selectedIndex: number;
  previousIndex: number;
}

export interface MenuClickEvent {
  type: 'click';
  target: any;
  selectedItem?: MenuItem;
  selectedIndex?: number;
}

export interface MenuFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface MenuMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface MenuKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Menu validation result
export interface MenuValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: MenuProps;
}

// Menu factory options
export interface MenuFactoryOptions {
  defaultVariant?: MenuVariants;
  defaultSize?: MenuSizes;
  defaultState?: MenuStates;
  theme?: any;
  parent?: any;
  defaultItems?: MenuItem[];
  defaultOrientation?: MenuOrientation;
  defaultAlignment?: MenuAlignment;
  defaultShowSelectionIndicator?: boolean;
  defaultShowIcons?: boolean;
  defaultShowShortcuts?: boolean;
}

// Menu group props
export interface MenuGroupProps extends BaseProps {
  menus: MenuProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: MenuVariants;
  size?: MenuSizes;
  onMenuClick?: (menuIndex: number, event: any) => void;
}

// Menu bar props
export interface MenuBarProps extends BaseProps {
  menus: MenuProps[];
  orientation?: 'horizontal' | 'vertical';
  variant?: MenuVariants;
  size?: MenuSizes;
  onMenuSelect?: (menuIndex: number, itemIndex: number, event: any) => void;
}

// Menu item group
export interface MenuItemGroup {
  label: string;
  items: MenuItem[];
  disabled?: boolean;
  hidden?: boolean;
}