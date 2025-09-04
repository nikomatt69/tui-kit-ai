import { BaseProps } from '../../BaseComponent';

// TextInput variants
export type TextInputVariants = 
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

// TextInput sizes
export type TextInputSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// TextInput states
export type TextInputStates = 
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

// TextInput types
export type TextInputType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// TextInput style
export type TextInputStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// TextInput input types
export type TextInputInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

// TextInput props interface
export interface TextInputProps extends BaseProps {
  // Optional props
  variant?: TextInputVariants;
  size?: TextInputSizes;
  state?: TextInputStates;
  
  // TextInput content
  value?: string;
  placeholder?: string;
  label?: string;
  icon?: string;
  
  // TextInput-specific styling
  textInputStyle?: TextInputStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: TextInputType;
  style?: TextInputStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // TextInput behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  
  // TextInput dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // TextInput appearance
  borderStyle?: string;
  
  // TextInput input options
  inputType?: TextInputInputType;
  required?: boolean;
  readOnly?: boolean;
  multiline?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: boolean;
  autoFocus?: boolean;
  spellCheck?: boolean;
  typingDelay?: number;
  
  // TextInput validation messages
  requiredMessage?: string;
  minLengthMessage?: string;
  maxLengthMessage?: string;
  patternMessage?: string;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onChange?: (event: TextInputChangeEvent) => void;
  onTyping?: (event: TextInputTypingEvent) => void;
  onTypingEnd?: (event: TextInputTypingEndEvent) => void;
  onSubmit?: (event: TextInputSubmitEvent) => void;
  onCancel?: (event: TextInputCancelEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// TextInput configuration for theming
export interface TextInputConfig {
  variant: TextInputVariants;
  size: TextInputSizes;
  state: TextInputStates;
  theme: any;
  type: TextInputType;
  style: TextInputStyle;
  value: string;
  placeholder: string;
  label?: string;
  icon?: string;
  inputType: TextInputInputType;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  multiline: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete: boolean;
  autoFocus: boolean;
  spellCheck: boolean;
  typingDelay: number;
}

// TextInput style configuration
export interface TextInputStyleConfig {
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

// TextInput event types
export interface TextInputChangeEvent {
  type: 'change';
  target: any;
  value: string;
  previousValue: string;
}

export interface TextInputTypingEvent {
  type: 'typing';
  target: any;
  value: string;
}

export interface TextInputTypingEndEvent {
  type: 'typingend';
  target: any;
  value: string;
}

export interface TextInputSubmitEvent {
  type: 'submit';
  target: any;
  value: string;
}

export interface TextInputCancelEvent {
  type: 'cancel';
  target: any;
  value: string;
}

export interface TextInputClickEvent {
  type: 'click';
  target: any;
  value: string;
  cursorPosition: number;
}

export interface TextInputFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface TextInputMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface TextInputKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// TextInput validation result
export interface TextInputValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: TextInputProps;
}

// TextInput factory options
export interface TextInputFactoryOptions {
  defaultVariant?: TextInputVariants;
  defaultSize?: TextInputSizes;
  defaultState?: TextInputStates;
  theme?: any;
  parent?: any;
  defaultType?: TextInputType;
  defaultStyle?: TextInputStyle;
  defaultValue?: string;
  defaultPlaceholder?: string;
  defaultLabel?: string;
  defaultIcon?: string;
  defaultInputType?: TextInputInputType;
  defaultRequired?: boolean;
  defaultDisabled?: boolean;
  defaultReadOnly?: boolean;
  defaultMultiline?: boolean;
  defaultMaxLength?: number;
  defaultMinLength?: number;
  defaultPattern?: string;
  defaultAutoComplete?: boolean;
  defaultAutoFocus?: boolean;
  defaultSpellCheck?: boolean;
  defaultTypingDelay?: number;
}

// TextInput group props
export interface TextInputGroupProps extends BaseProps {
  textInputComponents: TextInputProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: TextInputVariants;
  size?: TextInputSizes;
  onTextInputClick?: (textInputIndex: number, event: any) => void;
}

// TextInput layout props
export interface TextInputLayoutProps extends BaseProps {
  textInputComponents: TextInputProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: TextInputVariants;
  size?: TextInputSizes;
  onLayoutChange?: (layout: any) => void;
}

// TextInput theme props
export interface TextInputThemeProps extends TextInputProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}