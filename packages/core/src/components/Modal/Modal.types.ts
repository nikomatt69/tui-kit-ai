import { BaseProps } from '../../BaseComponent';

// Modal variants
export type ModalVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'dialog'
  | 'alert'
  | 'confirm';

// Modal sizes
export type ModalSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// Modal states
export type ModalStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'open'
  | 'closed';

// Modal types
export type ModalType = 'dialog' | 'alert' | 'confirm' | 'custom';

// Modal position
export type ModalPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// Modal props interface
export interface ModalProps extends BaseProps {
  // Optional props
  variant?: ModalVariants;
  size?: ModalSizes;
  state?: ModalStates;
  
  // Modal content
  title?: string;
  content?: string;
  footer?: string;
  
  // Modal-specific styling
  modalStyle?: 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  overlayColor?: string;
  
  // Display options
  type?: ModalType;
  position?: ModalPosition;
  showOverlay?: boolean;
  overlayOpacity?: number;
  backdropBlur?: boolean;
  
  // Modal behavior
  clickable?: boolean;
  interactive?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  closeOnEscape?: boolean;
  closeOnEnter?: boolean;
  closeOnOverlayClick?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Modal dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onShow?: (event: ModalShowEvent) => void;
  onHide?: (event: ModalHideEvent) => void;
  onClose?: (event: ModalCloseEvent) => void;
  onOpen?: (event: ModalOpenEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Modal configuration for theming
export interface ModalConfig {
  variant: ModalVariants;
  size: ModalSizes;
  state: ModalStates;
  theme: any;
  title?: string;
  content?: string;
  footer?: string;
  type: ModalType;
  position: ModalPosition;
  showOverlay: boolean;
  closeOnEscape: boolean;
  closeOnEnter: boolean;
}

// Modal style configuration
export interface ModalStyleConfig {
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
}

// Modal event types
export interface ModalShowEvent {
  type: 'show';
  target: any;
}

export interface ModalHideEvent {
  type: 'hide';
  target: any;
}

export interface ModalCloseEvent {
  type: 'close';
  target: any;
}

export interface ModalOpenEvent {
  type: 'open';
  target: any;
}

export interface ModalClickEvent {
  type: 'click';
  target: any;
  isVisible: boolean;
}

export interface ModalFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface ModalMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface ModalKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Modal validation result
export interface ModalValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: ModalProps;
}

// Modal factory options
export interface ModalFactoryOptions {
  defaultVariant?: ModalVariants;
  defaultSize?: ModalSizes;
  defaultState?: ModalStates;
  theme?: any;
  parent?: any;
  defaultTitle?: string;
  defaultContent?: string;
  defaultFooter?: string;
  defaultType?: ModalType;
  defaultPosition?: ModalPosition;
  defaultShowOverlay?: boolean;
  defaultCloseOnEscape?: boolean;
  defaultCloseOnEnter?: boolean;
}

// Modal group props
export interface ModalGroupProps extends BaseProps {
  modals: ModalProps[];
  stackOrder?: 'ascending' | 'descending';
  maxVisible?: number;
  variant?: ModalVariants;
  size?: ModalSizes;
  onModalClick?: (modalIndex: number, event: any) => void;
}

// Modal manager props
export interface ModalManagerProps extends BaseProps {
  modals: ModalProps[];
  autoStack?: boolean;
  maxStackDepth?: number;
  variant?: ModalVariants;
  size?: ModalSizes;
  onModalStackChange?: (stack: ModalProps[]) => void;
}

// Modal overlay props
export interface ModalOverlayProps extends BaseProps {
  color?: string;
  opacity?: number;
  blur?: boolean;
  zIndex?: number;
  onClick?: (event: any) => void;
}