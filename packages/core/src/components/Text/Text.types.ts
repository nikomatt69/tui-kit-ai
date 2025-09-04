import { BaseProps } from '../../BaseComponent';

// Text variants
export type TextVariants = 
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

// Text sizes
export type TextSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Text states
export type TextStates = 
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

// Text types
export type TextType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// Text style
export type TextStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Text weight types
export type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';

// Text props interface
export interface TextProps extends BaseProps {
  // Optional props
  variant?: TextVariants;
  size?: TextSizes;
  state?: TextStates;
  
  // Text content
  content?: string;
  
  // Text-specific styling
  textStyle?: TextStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: TextType;
  style?: TextStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Text behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  
  // Text dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Text appearance
  borderStyle?: string;
  
  // Text formatting options
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  weight?: TextWeight;
  
  // Text transformation options
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  trim?: boolean;
  
  // Text truncation options
  truncate?: boolean;
  maxLength?: number;
  truncateSymbol?: string;
  
  // Text wrapping options
  wrap?: boolean;
  maxWidth?: number;
  
  // Text highlighting options
  highlight?: boolean;
  highlightText?: string;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onContentChange?: (event: TextContentChangeEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Text configuration for theming
export interface TextConfig {
  variant: TextVariants;
  size: TextSizes;
  state: TextStates;
  theme: any;
  type: TextType;
  style: TextStyle;
  content: string;
  align: 'left' | 'center' | 'right';
  valign: 'top' | 'middle' | 'bottom';
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  weight: TextWeight;
  uppercase: boolean;
  lowercase: boolean;
  capitalize: boolean;
  trim: boolean;
  truncate: boolean;
  maxLength?: number;
  truncateSymbol?: string;
  wrap: boolean;
  maxWidth?: number;
  highlight: boolean;
  highlightText?: string;
}

// Text style configuration
export interface TextStyleConfig {
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
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  weight?: TextWeight;
  fillColor?: string;
  emptyColor?: string;
  striped?: boolean;
  animated?: boolean;
  gradient?: boolean;
}

// Text event types
export interface TextContentChangeEvent {
  type: 'contentchange';
  target: any;
  content: string;
  previousContent: string;
}

export interface TextClickEvent {
  type: 'click';
  target: any;
  content: string;
  text: string;
}

export interface TextFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface TextMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface TextKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Text validation result
export interface TextValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: TextProps;
}

// Text factory options
export interface TextFactoryOptions {
  defaultVariant?: TextVariants;
  defaultSize?: TextSizes;
  defaultState?: TextStates;
  theme?: any;
  parent?: any;
  defaultType?: TextType;
  defaultStyle?: TextStyle;
  defaultContent?: string;
  defaultAlign?: 'left' | 'center' | 'right';
  defaultValign?: 'top' | 'middle' | 'bottom';
  defaultBold?: boolean;
  defaultItalic?: boolean;
  defaultUnderline?: boolean;
  defaultStrikethrough?: boolean;
  defaultWeight?: TextWeight;
  defaultUppercase?: boolean;
  defaultLowercase?: boolean;
  defaultCapitalize?: boolean;
  defaultTrim?: boolean;
  defaultTruncate?: boolean;
  defaultMaxLength?: number;
  defaultTruncateSymbol?: string;
  defaultWrap?: boolean;
  defaultMaxWidth?: number;
  defaultHighlight?: boolean;
  defaultHighlightText?: string;
}

// Text group props
export interface TextGroupProps extends BaseProps {
  textComponents: TextProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: TextVariants;
  size?: TextSizes;
  onTextClick?: (textIndex: number, event: any) => void;
}

// Text layout props
export interface TextLayoutProps extends BaseProps {
  textComponents: TextProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: TextVariants;
  size?: TextSizes;
  onLayoutChange?: (layout: any) => void;
}

// Text theme props
export interface TextThemeProps extends TextProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}