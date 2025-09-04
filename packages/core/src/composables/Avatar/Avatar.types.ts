import { BaseProps } from '../../BaseComponent';

// Avatar variants
export type AvatarVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

// Avatar sizes
export type AvatarSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl';

// Avatar shapes
export type AvatarShapes = 
  | 'circle'
  | 'square'
  | 'rounded';

// Avatar props interface
export interface AvatarProps extends BaseProps {
  // Optional props
  src?: string;
  alt?: string;
  text?: string;
  icon?: string;
  size?: AvatarSizes;
  shape?: AvatarShapes;
  variant?: AvatarVariants;
  
  // Avatar-specific styling
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusColor?: string;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
}

// Avatar configuration for theming
export interface AvatarConfig {
  variant: AvatarVariants;
  size: AvatarSizes;
  shape: AvatarShapes;
  theme: any;
  status?: string;
}

// Avatar style configuration
export interface AvatarStyleConfig {
  bg: string;
  fg: string;
  border: {
    type: string;
    fg: string;
    bg?: string;
  };
  width: number;
  height: number;
  align: 'left' | 'center' | 'right';
  valign: 'top' | 'middle' | 'bottom';
  bold?: boolean;
  underline?: boolean;
}

// Avatar status configuration
export interface AvatarStatusConfig {
  online: string;
  offline: string;
  away: string;
  busy: string;
}

// Avatar event types
export interface AvatarClickEvent {
  type: 'click';
  target: any;
  data?: any;
}

export interface AvatarFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

// Avatar validation result
export interface AvatarValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: AvatarProps;
}

// Avatar factory options
export interface AvatarFactoryOptions {
  defaultVariant?: AvatarVariants;
  defaultSize?: AvatarSizes;
  defaultShape?: AvatarShapes;
  theme?: any;
  parent?: any;
}

// Avatar group props
export interface AvatarGroupProps extends BaseProps {
  avatars: AvatarProps[];
  max?: number;
  spacing?: number;
  size?: AvatarSizes;
  variant?: AvatarVariants;
  onAvatarClick?: (avatarIndex: number, event: any) => void;
}