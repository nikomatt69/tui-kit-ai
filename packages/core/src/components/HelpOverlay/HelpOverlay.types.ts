import { BaseProps } from '../../BaseComponent';

// HelpOverlay variants
export type HelpOverlayVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'modal';

// HelpOverlay sizes
export type HelpOverlaySizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// HelpOverlay states
export type HelpOverlayStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'visible'
  | 'hidden';

// Help item interface
export interface HelpItem {
  key: string;
  description: string;
  category?: string;
  shortcut?: string;
  action?: () => void;
}

// HelpOverlay props interface
export interface HelpOverlayProps extends BaseProps {
  // Optional props
  variant?: HelpOverlayVariants;
  size?: HelpOverlaySizes;
  state?: HelpOverlayStates;
  
  // Help content
  title?: string;
  footer?: string;
  helpItems?: HelpItem[];
  
  // HelpOverlay-specific styling
  helpStyle?: 'default' | 'outline' | 'modal' | 'ghost' | 'elevated';
  overlayColor?: string;
  textColor?: string;
  borderColor?: string;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Help behavior
  clickable?: boolean;
  interactive?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  
  // Help display options
  showShortcuts?: boolean;
  showCategories?: boolean;
  showSearch?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onShow?: () => void;
  onHide?: () => void;
  onToggle?: (visible: boolean) => void;
  onHelpItemClick?: (item: HelpItem) => void;
  onQuit?: () => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// HelpOverlay configuration for theming
export interface HelpOverlayConfig {
  variant: HelpOverlayVariants;
  size: HelpOverlaySizes;
  state: HelpOverlayStates;
  theme: any;
  title?: string;
  footer?: string;
  helpItems: HelpItem[];
  isVisible: boolean;
}

// HelpOverlay style configuration
export interface HelpOverlayStyleConfig {
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
}

// HelpOverlay event types
export interface HelpOverlayShowEvent {
  type: 'show';
  target: any;
  timestamp: number;
}

export interface HelpOverlayHideEvent {
  type: 'hide';
  target: any;
  timestamp: number;
}

export interface HelpOverlayToggleEvent {
  type: 'toggle';
  target: any;
  visible: boolean;
  timestamp: number;
}

export interface HelpOverlayHelpItemClickEvent {
  type: 'helpitemclick';
  target: any;
  item: HelpItem;
}

export interface HelpOverlayClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

export interface HelpOverlayFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface HelpOverlayMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface HelpOverlayKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// HelpOverlay validation result
export interface HelpOverlayValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: HelpOverlayProps;
}

// HelpOverlay factory options
export interface HelpOverlayFactoryOptions {
  defaultVariant?: HelpOverlayVariants;
  defaultSize?: HelpOverlaySizes;
  defaultState?: HelpOverlayStates;
  theme?: any;
  parent?: any;
  defaultTitle?: string;
  defaultFooter?: string;
  defaultHelpItems?: HelpItem[];
  defaultPosition?: { x: number; y: number };
}

// HelpOverlay group props
export interface HelpOverlayGroupProps extends BaseProps {
  helpOverlays: HelpOverlayProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: HelpOverlayVariants;
  size?: HelpOverlaySizes;
  onHelpOverlayToggle?: (overlayIndex: number, visible: boolean) => void;
}

// HelpOverlay item
export interface HelpOverlayItem {
  title?: string;
  footer?: string;
  helpItems: HelpItem[];
  variant?: HelpOverlayVariants;
  size?: HelpOverlaySizes;
  position?: { x: number; y: number };
}