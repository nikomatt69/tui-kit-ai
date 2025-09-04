import { BaseProps } from '../../BaseComponent';

// Tree variants
export type TreeVariants = 
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

// Tree sizes
export type TreeSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// Tree states
export type TreeStates = 
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

// Tree types
export type TreeType = 'default' | 'compact' | 'detailed' | 'minimal' | 'modern';

// Tree style
export type TreeStyle = 'default' | 'striped' | 'gradient' | 'minimal' | 'modern';

// Tree node interface
export interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  info?: string;
  children?: TreeNode[];
  defaultExpanded?: boolean;
  disabled?: boolean;
  selectable?: boolean;
  expandable?: boolean;
  data?: any;
}

// Tree props interface
export interface TreeProps extends BaseProps {
  // Optional props
  variant?: TreeVariants;
  size?: TreeSizes;
  state?: TreeStates;
  
  // Tree content
  nodes?: TreeNode[];
  emptyMessage?: string;
  
  // Tree-specific styling
  treeStyle?: TreeStyle;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fillColor?: string;
  emptyColor?: string;
  
  // Display options
  type?: TreeType;
  style?: TreeStyle;
  showBorder?: boolean;
  compact?: boolean;
  elevated?: boolean;
  
  // Layout props
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  
  // Tree behavior
  clickable?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  
  // Tree dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Tree appearance
  borderStyle?: string;
  
  // Tree display options
  defaultExpanded?: boolean;
  showIcons?: boolean;
  showInfo?: boolean;
  multiSelect?: boolean;
  selectOnClick?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Event handlers
  onNodesChange?: (event: TreeNodesChangeEvent) => void;
  onNodeAdd?: (event: TreeNodeAddEvent) => void;
  onNodeRemove?: (event: TreeNodeRemoveEvent) => void;
  onNodeUpdate?: (event: TreeNodeUpdateEvent) => void;
  onNodeSelect?: (event: TreeNodeSelectEvent) => void;
  onNodeExpand?: (event: TreeNodeExpandEvent) => void;
  onNodeCollapse?: (event: TreeNodeCollapseEvent) => void;
  onNodeClick?: (event: TreeNodeClickEvent) => void;
  onScroll?: (event: TreeScrollEvent) => void;
  onClick?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
}

// Tree configuration for theming
export interface TreeConfig {
  variant: TreeVariants;
  size: TreeSizes;
  state: TreeStates;
  theme: any;
  type: TreeType;
  style: TreeStyle;
  nodes: TreeNode[];
  defaultExpanded: boolean;
  showIcons: boolean;
  showInfo: boolean;
  multiSelect: boolean;
  selectOnClick: boolean;
}

// Tree style configuration
export interface TreeStyleConfig {
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

// Tree event types
export interface TreeNodesChangeEvent {
  type: 'nodeschange';
  target: any;
  nodes: TreeNode[];
}

export interface TreeNodeAddEvent {
  type: 'nodeadd';
  target: any;
  node: TreeNode;
  parentId?: string;
}

export interface TreeNodeRemoveEvent {
  type: 'noderemove';
  target: any;
  nodeId: string;
}

export interface TreeNodeUpdateEvent {
  type: 'nodeupdate';
  target: any;
  nodeId: string;
  node: TreeNode;
  updates: Partial<TreeNode>;
}

export interface TreeNodeSelectEvent {
  type: 'nodeselect';
  target: any;
  nodeId: string;
  node: TreeNode | null;
}

export interface TreeNodeExpandEvent {
  type: 'nodeexpand';
  target: any;
  nodeId: string;
}

export interface TreeNodeCollapseEvent {
  type: 'nodecollapse';
  target: any;
  nodeId: string;
}

export interface TreeNodeClickEvent {
  type: 'nodeclick';
  target: any;
  nodeId: string | null;
  node: TreeNode | null;
}

export interface TreeScrollEvent {
  type: 'scroll';
  target: any;
  scrollOffset: number;
}

export interface TreeClickEvent {
  type: 'click';
  target: any;
}

export interface TreeFocusEvent {
  type: 'focus' | 'blur';
  target: any;
}

export interface TreeMouseEvent {
  type: 'mouseenter' | 'mouseleave';
  target: any;
  x: number;
  y: number;
}

export interface TreeKeyboardEvent {
  type: 'keydown' | 'keyup';
  target: any;
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

// Tree validation result
export interface TreeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: TreeProps;
}

// Tree factory options
export interface TreeFactoryOptions {
  defaultVariant?: TreeVariants;
  defaultSize?: TreeSizes;
  defaultState?: TreeStates;
  theme?: any;
  parent?: any;
  defaultType?: TreeType;
  defaultStyle?: TreeStyle;
  defaultNodes?: TreeNode[];
  defaultExpanded?: boolean;
  defaultShowIcons?: boolean;
  defaultShowInfo?: boolean;
  defaultMultiSelect?: boolean;
  defaultSelectOnClick?: boolean;
}

// Tree group props
export interface TreeGroupProps extends BaseProps {
  treeComponents: TreeProps[];
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  variant?: TreeVariants;
  size?: TreeSizes;
  onTreeClick?: (treeIndex: number, event: any) => void;
}

// Tree layout props
export interface TreeLayoutProps extends BaseProps {
  treeComponents: TreeProps[];
  layout?: 'grid' | 'flex' | 'stack' | 'columns';
  columns?: number;
  spacing?: number;
  variant?: TreeVariants;
  size?: TreeSizes;
  onLayoutChange?: (layout: any) => void;
}

// Tree theme props
export interface TreeThemeProps extends TreeProps {
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, any>;
  };
  onThemeChange?: (theme: any) => void;
}