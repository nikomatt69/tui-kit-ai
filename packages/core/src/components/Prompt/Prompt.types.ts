import { BaseProps } from '../../BaseComponent';

// Prompt variants
export type PromptVariants = 
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

// Prompt sizes
export type PromptSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Prompt states
export type PromptStates = 
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

// Prompt types
export type PromptType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// Prompt style
export type PromptStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Prompt input types
export type PromptInputType = 'input' | 'password' | 'select' | 'confirm';

// Prompt props interface
export interface PromptProps extends BaseProps {
  // Optional props
  variant?: PromptVariants;
  size?: PromptSizes;
  state?: PromptStates;
  
  // Prompt content
  title?: string;
  message?: string;
  label?: string;
  placeholder?: string;
  
  // Prompt-specific styling
  promptStyle?: PromptStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: PromptType;
  style?: PromptStyle;
  inputType?: PromptInputType;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Prompt behavior
  clickable?: boolean;
  interactive?: boolean;
  autoShow?: boolean;
  autoHide?: boolean;
  showCancel?: boolean;
  
  // Prompt dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Prompt appearance
  options?: string[];
  confirmText?: string;
  cancelText?: string;
  borderStyle?: string;
  
  // Prompt validation
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onSubmit?: (event: PromptSubmitEvent) => void;
  onCancel?: (event: PromptCancelEvent) => void;
  onInputChange?: (event: PromptInputChangeEvent) => void;
  onShow?: (event: PromptShowEvent) => void;
  onHide?: (event: PromptHideEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Prompt configuration for theming
export interface PromptConfig {
  variant: PromptVariants;
  size: PromptSizes;
  state: PromptStates;
  theme: any;
  type: PromptType;
  style: PromptStyle;
  inputType: PromptInputType;
  title?: string;
  message?: string;
  label?: string;
  placeholder?: string;
  options: string[];
  showCancel: boolean;
  confirmText: string;
  cancelText: string;
}

// Prompt style configuration
export interface PromptStyleConfig {
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

// Prompt event types
export interface PromptSubmitEvent {
  type: 'submit';
  target: any;
  result: any;
  inputValue: string;
  selectedOption: number;
}

export interface PromptCancelEvent {
  type: 'cancel';
  target: any;
}

export interface PromptInputChangeEvent {
  type: 'inputchange';
  target: any;
  value: string;
}

export interface PromptShowEvent {
  type: 'show';
  target: any;
}

export interface PromptHideEvent {
  type: 'hide';
  target: any;
}

export interface PromptClickEvent {
  type: 'click';
  target: any;
}

export interface PromptFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface PromptMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface PromptKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Prompt validation result
export interface PromptValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: PromptProps;
}

// Prompt factory options
export interface PromptFactoryOptions {
  defaultVariant?: PromptVariants;
  defaultSize?: PromptSizes;
  defaultState?: PromptStates;
  theme?: any;
  parent?: any;
  defaultType?: PromptType;
  defaultStyle?: PromptStyle;
  defaultInputType?: PromptInputType;
  defaultTitle?: string;
  defaultMessage?: string;
  defaultLabel?: string;
  defaultPlaceholder?: string;
  defaultOptions?: string[];
  defaultShowCancel?: boolean;
  defaultConfirmText?: string;
  defaultCancelText?: string;
  defaultAutoShow?: boolean;
  defaultAutoHide?: boolean;
}

// Prompt group props
export interface PromptGroupProps extends BaseProps {
  prompts: PromptProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: PromptVariants;
  size?: PromptSizes;
  onPromptClick?: (promptIndex: number, event: any) => void;
}

// Prompt layout props
export interface PromptLayoutProps extends BaseProps {
  prompts: PromptProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: PromptVariants;
  size?: PromptSizes;
  onLayoutChange?: (layout: any) => void;
}

// Prompt validation props
export interface PromptValidationProps extends PromptProps {
  validators: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

// Prompt theme props
export interface PromptThemeProps extends PromptProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}