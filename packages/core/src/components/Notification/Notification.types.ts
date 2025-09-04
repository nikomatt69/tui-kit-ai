import { BaseProps } from '../../BaseComponent';

// Notification variants
export type NotificationVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'toast'
  | 'alert'
  | 'banner';

// Notification sizes
export type NotificationSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Notification states
export type NotificationStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'loading'
  | 'visible'
  | 'hidden';

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'custom';

// Notification position
export type NotificationPosition = 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

// Notification props interface
export interface NotificationProps extends BaseProps {
  // Optional props
  variant?: NotificationVariants;
  size?: NotificationSizes;
  state?: NotificationStates;
  
  // Notification content
  title?: string;
  message?: string;
  icon?: string;
  
  // Notification-specific styling
  notificationStyle?: 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  iconColor?: string;
  
  // Display options
  type?: NotificationType;
  position?: NotificationPosition;
  showIcon?: boolean;
  showTitle?: boolean;
  showMessage?: boolean;
  showCloseButton?: boolean;
  closeButtonText?: string;
  compact?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Notification behavior
  clickable?: boolean;
  interactive?: boolean;
  draggable?: boolean;
  autoHide?: number;
  closeOnEscape?: boolean;
  closeOnEnter?: boolean;
  closeOnClick?: boolean;
  
  // Notification dimensions
  width?: number | string;
  height?: number | string;
  maxWidth?: number;
  maxHeight?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onShow?: (event: NotificationShowEvent) => void;
  onHide?: (event: NotificationHideEvent) => void;
  onClose?: (event: NotificationCloseEvent) => void;
  onOpen?: (event: NotificationOpenEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Notification configuration for theming
export interface NotificationConfig {
  variant: NotificationVariants;
  size: NotificationSizes;
  state: NotificationStates;
  theme: any;
  title?: string;
  message?: string;
  icon?: string;
  type: NotificationType;
  position: NotificationPosition;
  showCloseButton: boolean;
  autoHide: number;
  closeOnEscape: boolean;
  closeOnEnter: boolean;
}

// Notification style configuration
export interface NotificationStyleConfig {
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
  iconColor?: string;
}

// Notification event types
export interface NotificationShowEvent {
  type: 'show';
  target: any;
}

export interface NotificationHideEvent {
  type: 'hide';
  target: any;
}

export interface NotificationCloseEvent {
  type: 'close';
  target: any;
}

export interface NotificationOpenEvent {
  type: 'open';
  target: any;
}

export interface NotificationClickEvent {
  type: 'click';
  target: any;
  isVisible: boolean;
}

export interface NotificationFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface NotificationMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface NotificationKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Notification validation result
export interface NotificationValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: NotificationProps;
}

// Notification factory options
export interface NotificationFactoryOptions {
  defaultVariant?: NotificationVariants;
  defaultSize?: NotificationSizes;
  defaultState?: NotificationStates;
  theme?: any;
  parent?: any;
  defaultTitle?: string;
  defaultMessage?: string;
  defaultIcon?: string;
  defaultType?: NotificationType;
  defaultPosition?: NotificationPosition;
  defaultShowCloseButton?: boolean;
  defaultAutoHide?: number;
  defaultCloseOnEscape?: boolean;
  defaultCloseOnEnter?: boolean;
}

// Notification group props
export interface NotificationGroupProps extends BaseProps {
  notifications: NotificationProps[];
  stackOrder?: 'ascending' | 'descending';
  maxVisible?: number;
  variant?: NotificationVariants;
  size?: NotificationSizes;
  onNotificationClick?: (notificationIndex: number, event: any) => void;
}

// Notification manager props
export interface NotificationManagerProps extends BaseProps {
  notifications: NotificationProps[];
  autoStack?: boolean;
  maxStackDepth?: number;
  variant?: NotificationVariants;
  size?: NotificationSizes;
  onNotificationStackChange?: (stack: NotificationProps[]) => void;
}

// Notification toast props
export interface NotificationToastProps extends BaseProps {
  title?: string;
  message?: string;
  icon?: string;
  variant?: NotificationVariants;
  size?: NotificationSizes;
  autoHide?: number;
  position?: NotificationPosition;
  onClick?: (event: any) => void;
}

// Notification banner props
export interface NotificationBannerProps extends BaseProps {
  title?: string;
  message?: string;
  icon?: string;
  variant?: NotificationVariants;
  size?: NotificationSizes;
  dismissible?: boolean;
  persistent?: boolean;
  onClick?: (event: any) => void;
}