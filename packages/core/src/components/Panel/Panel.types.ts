import { BaseProps } from '../../BaseComponent';

// Panel variants
export type PanelVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'elevated'
  | 'bordered'
  | 'transparent';

// Panel sizes
export type PanelSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// Panel states
export type PanelStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'loading'
  | 'collapsed'
  | 'expanded';

// Panel types
export type PanelType = 'default' | 'sidebar' | 'toolbar' | 'statusbar' | 'content' | 'custom';

// Panel position
export type PanelPosition = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'floating';

// Panel props interface
export interface PanelProps extends BaseProps {
  // Optional props
  variant?: PanelVariants;
  size?: PanelSizes;
  state?: PanelStates;
  
  // Panel content
  header?: string;
  content?: string;
  footer?: string;
  
  // Panel-specific styling
  panelStyle?: 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  headerColor?: string;
  footerColor?: string;
  
  // Display options
  type?: PanelType;
  position?: PanelPosition;
  showHeader?: boolean;
  showFooter?: boolean;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Panel behavior
  clickable?: boolean;
  interactive?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  scrollable?: boolean;
  
  // Panel dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Panel layout
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onShow?: (event: PanelShowEvent) => void;
  onHide?: (event: PanelHideEvent) => void;
  onResize?: (event: PanelResizeEvent) => void;
  onChildAdd?: (event: PanelChildAddEvent) => void;
  onChildRemove?: (event: PanelChildRemoveEvent) => void;
  onChildrenClear?: (event: PanelChildrenClearEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Panel configuration for theming
export interface PanelConfig {
  variant: PanelVariants;
  size: PanelSizes;
  state: PanelStates;
  theme: any;
  header?: string;
  content?: string;
  footer?: string;
  type: PanelType;
  position: PanelPosition;
  showHeader: boolean;
  showFooter: boolean;
  showBorder: boolean;
  collapsible: boolean;
  resizable: boolean;
  draggable: boolean;
}

// Panel style configuration
export interface PanelStyleConfig {
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
  shadow?: boolean;
  zIndex?: number;
  headerColor?: string;
  footerColor?: string;
}

// Panel event types
export interface PanelShowEvent {
  type: 'show';
  target: any;
}

export interface PanelHideEvent {
  type: 'hide';
  target: any;
}

export interface PanelResizeEvent {
  type: 'resize';
  target: any;
  width: number;
  height: number;
}

export interface PanelChildAddEvent {
  type: 'childadd';
  target: any;
  child: any;
  totalChildren: number;
}

export interface PanelChildRemoveEvent {
  type: 'childremove';
  target: any;
  child: any;
  totalChildren: number;
}

export interface PanelChildrenClearEvent {
  type: 'childrenclear';
  target: any;
}

export interface PanelClickEvent {
  type: 'click';
  target: any;
  children: any[];
}

export interface PanelFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface PanelMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface PanelKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Panel validation result
export interface PanelValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: PanelProps;
}

// Panel factory options
export interface PanelFactoryOptions {
  defaultVariant?: PanelVariants;
  defaultSize?: PanelSizes;
  defaultState?: PanelStates;
  theme?: any;
  parent?: any;
  defaultHeader?: string;
  defaultContent?: string;
  defaultFooter?: string;
  defaultType?: PanelType;
  defaultPosition?: PanelPosition;
  defaultShowHeader?: boolean;
  defaultShowFooter?: boolean;
  defaultShowBorder?: boolean;
  defaultCollapsible?: boolean;
  defaultResizable?: boolean;
  defaultDraggable?: boolean;
}

// Panel group props
export interface PanelGroupProps extends BaseProps {
  panels: PanelProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: PanelVariants;
  size?: PanelSizes;
  onPanelClick?: (panelIndex: number, event: any) => void;
}

// Panel layout props
export interface PanelLayoutProps extends BaseProps {
  panels: PanelProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'tabs';
  columns?: number;
  rows?: number;
  spacing?: number;
  variant?: PanelVariants;
  size?: PanelSizes;
  onLayoutChange?: (layout: any) => void;
}

// Panel sidebar props
export interface PanelSidebarProps extends PanelProps {
  side: 'left' | 'right';
  width: number;
  collapsible: boolean;
  collapsed: boolean;
  onToggle?: (collapsed: boolean) => void;
}

// Panel toolbar props
export interface PanelToolbarProps extends PanelProps {
  orientation: 'horizontal' | 'vertical';
  items: any[];
  onItemClick?: (item: any, index: number) => void;
}