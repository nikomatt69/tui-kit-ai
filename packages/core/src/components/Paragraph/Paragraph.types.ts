import { BaseProps } from '../../BaseComponent';

// Paragraph variants
export type ParagraphVariants = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'body'
  | 'lead'
  | 'small'
  | 'caption';

// Paragraph sizes
export type ParagraphSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Paragraph states
export type ParagraphStates = 
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'focus'
  | 'error'
  | 'success'
  | 'loading'
  | 'highlighted'
  | 'muted';

// Paragraph types
export type ParagraphType = 'body' | 'lead' | 'small' | 'caption' | 'custom';

// Paragraph weight
export type ParagraphWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';

// Paragraph props interface
export interface ParagraphProps extends BaseProps {
  // Optional props
  variant?: ParagraphVariants;
  size?: ParagraphSizes;
  state?: ParagraphStates;
  
  // Paragraph content
  text?: string;
  
  // Paragraph-specific styling
  paragraphStyle?: 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  
  // Display options
  type?: ParagraphType;
  weight?: ParagraphWeight;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Paragraph behavior
  clickable?: boolean;
  interactive?: boolean;
  selectable?: boolean;
  copyable?: boolean;
  
  // Paragraph dimensions
  width?: number | string;
  height?: number | string;
  maxWidth?: number;
  maxHeight?: number;
  
  // Text formatting
  truncate?: boolean;
  ellipsis?: boolean;
  wrap?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  monospace?: boolean;
  
  // Paragraph layout
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
  onCopy?: (event: any) => void;
  onSelect?: (event: any) => void;
}

// Paragraph configuration for theming
export interface ParagraphConfig {
  variant: ParagraphVariants;
  size: ParagraphSizes;
  state: ParagraphStates;
  theme: any;
  text?: string;
  type: ParagraphType;
  weight: ParagraphWeight;
  showBorder: boolean;
  truncate: boolean;
  ellipsis: boolean;
  wrap: boolean;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  monospace: boolean;
}

// Paragraph style configuration
export interface ParagraphStyleConfig {
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
  italic?: boolean;
  monospace?: boolean;
  weight?: string;
  truncate?: boolean;
  ellipsis?: boolean;
  wrap?: boolean;
}

// Paragraph event types
export interface ParagraphClickEvent {
  type: 'click';
  target: any;
  text?: string;
}

export interface ParagraphFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface ParagraphMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface ParagraphKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

export interface ParagraphCopyEvent {
  type: 'copy';
  target: any;
  text?: string;
}

export interface ParagraphSelectEvent {
  type: 'select';
  target: any;
  selectedText?: string;
}

// Paragraph validation result
export interface ParagraphValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: ParagraphProps;
}

// Paragraph factory options
export interface ParagraphFactoryOptions {
  defaultVariant?: ParagraphVariants;
  defaultSize?: ParagraphSizes;
  defaultState?: ParagraphStates;
  theme?: any;
  parent?: any;
  defaultText?: string;
  defaultType?: ParagraphType;
  defaultWeight?: ParagraphWeight;
  defaultShowBorder?: boolean;
  defaultTruncate?: boolean;
  defaultEllipsis?: boolean;
  defaultWrap?: boolean;
  defaultBold?: boolean;
  defaultItalic?: boolean;
  defaultUnderline?: boolean;
  defaultMonospace?: boolean;
}

// Paragraph group props
export interface ParagraphGroupProps extends BaseProps {
  paragraphs: ParagraphProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: ParagraphVariants;
  size?: ParagraphSizes;
  onParagraphClick?: (paragraphIndex: number, event: any) => void;
}

// Paragraph layout props
export interface ParagraphLayoutProps extends BaseProps {
  paragraphs: ParagraphProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: ParagraphVariants;
  size?: ParagraphSizes;
  onLayoutChange?: (layout: any) => void;
}

// Paragraph text props
export interface ParagraphTextProps extends BaseProps {
  text: string;
  variant?: ParagraphVariants;
  size?: ParagraphSizes;
  weight?: ParagraphWeight;
  color?: string;
  align?: 'left' | 'center' | 'right';
  onClick?: (event: any) => void;
}

// Paragraph link props
export interface ParagraphLinkProps extends BaseProps {
  text: string;
  href?: string;
  variant?: ParagraphVariants;
  size?: ParagraphSizes;
  underline?: boolean;
  color?: string;
  onClick?: (event: any) => void;
}