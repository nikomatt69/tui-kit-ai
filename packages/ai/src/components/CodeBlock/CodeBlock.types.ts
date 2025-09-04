import { BaseProps } from '../../../core/src/components/BaseComponent';

// CodeBlock variants
export type CodeBlockVariants = 
  | 'default'
  | 'compact'
  | 'detailed'
  | 'minimal'
  | 'expanded';

// CodeBlock sizes
export type CodeBlockSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// CodeBlock states
export type CodeBlockStates = 
  | 'default'
  | 'loading'
  | 'error'
  | 'success'
  | 'focused'
  | 'disabled';

// Supported programming languages
export type CodeLanguage = 
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'c'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'php'
  | 'ruby'
  | 'swift'
  | 'kotlin'
  | 'scala'
  | 'html'
  | 'css'
  | 'scss'
  | 'sass'
  | 'less'
  | 'json'
  | 'xml'
  | 'yaml'
  | 'toml'
  | 'ini'
  | 'sql'
  | 'bash'
  | 'shell'
  | 'powershell'
  | 'dockerfile'
  | 'markdown'
  | 'plaintext';

// Code themes
export type CodeTheme = 
  | 'dark'
  | 'light'
  | 'monokai'
  | 'dracula'
  | 'github'
  | 'vs-code'
  | 'atom'
  | 'solarized'
  | 'tomorrow'
  | 'ocean';

// CodeBlock props interface
export interface CodeBlockProps extends BaseProps {
  // Code content
  code?: string;
  language?: CodeLanguage;
  theme?: CodeTheme;
  
  // Display options
  variant?: CodeBlockVariants;
  size?: CodeBlockSizes;
  state?: CodeBlockStates;
  
  // Syntax highlighting
  highlightSyntax?: boolean;
  showLineNumbers?: boolean;
  wrapLines?: boolean;
  tabSize?: number;
  
  // Interactive features
  copyable?: boolean;
  expandable?: boolean;
  collapsible?: boolean;
  editable?: boolean;
  
  // Action buttons
  showActions?: boolean;
  actions?: CodeBlockAction[];
  
  // File information
  filename?: string;
  filepath?: string;
  filesize?: number;
  
  // Error handling
  showErrors?: boolean;
  errors?: CodeError[];
  
  // Event handlers
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: CodeLanguage) => void;
  onCopy?: (code: string) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onError?: (error: CodeError) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Code block action interface
export interface CodeBlockAction {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
  enabled?: boolean;
}

// Code error interface
export interface CodeError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code?: string;
}

// CodeBlock configuration interface
export interface CodeBlockConfig {
  variant: CodeBlockVariants;
  size: CodeBlockSizes;
  state: CodeBlockStates;
  language: CodeLanguage;
  theme: CodeTheme;
  highlightSyntax: boolean;
  showLineNumbers: boolean;
  wrapLines: boolean;
  tabSize: number;
  copyable: boolean;
  expandable: boolean;
  collapsible: boolean;
  editable: boolean;
  showActions: boolean;
  showErrors: boolean;
}

// CodeBlock style configuration
export interface CodeBlockStyleConfig {
  container: Record<string, any>;
  header: Record<string, any>;
  content: Record<string, any>;
  lineNumbers: Record<string, any>;
  syntax: Record<string, any>;
  actions: Record<string, any>;
  errors: Record<string, any>;
  filename: Record<string, any>;
}

// CodeBlock events
export interface CodeBlockCodeChangeEvent {
  type: 'codeChange';
  code: string;
  language: CodeLanguage;
}

export interface CodeBlockLanguageChangeEvent {
  type: 'languageChange';
  language: CodeLanguage;
}

export interface CodeBlockCopyEvent {
  type: 'copy';
  code: string;
}

export interface CodeBlockExpandEvent {
  type: 'expand';
}

export interface CodeBlockCollapseEvent {
  type: 'collapse';
}

export interface CodeBlockErrorEvent {
  type: 'error';
  error: CodeError;
}

export interface CodeBlockFocusEvent {
  type: 'focus';
}

export interface CodeBlockBlurEvent {
  type: 'blur';
}

export type CodeBlockEvent = 
  | CodeBlockCodeChangeEvent
  | CodeBlockLanguageChangeEvent
  | CodeBlockCopyEvent
  | CodeBlockExpandEvent
  | CodeBlockCollapseEvent
  | CodeBlockErrorEvent
  | CodeBlockFocusEvent
  | CodeBlockBlurEvent;

// CodeBlock validation result
export interface CodeBlockValidationResult {
  success: boolean;
  data?: CodeBlockProps;
  errors?: Error;
  warnings?: string[];
}

// CodeBlock factory options
export interface CodeBlockFactoryOptions {
  defaultVariant?: CodeBlockVariants;
  defaultSize?: CodeBlockSizes;
  defaultState?: CodeBlockStates;
  defaultLanguage?: CodeLanguage;
  defaultTheme?: CodeTheme;
  theme?: any;
  parent?: any;
}

// CodeBlock group props for multiple code blocks
export interface CodeBlockGroupProps extends BaseProps {
  codeBlocks: CodeBlockProps[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showGroupActions?: boolean;
  onCodeBlockSelect?: (codeBlockId: string) => void;
}

// Syntax highlighting token interface
export interface SyntaxToken {
  type: string;
  value: string;
  start: number;
  end: number;
  style?: Record<string, any>;
}

// Language configuration interface
export interface LanguageConfig {
  name: string;
  extensions: string[];
  keywords: string[];
  operators: string[];
  delimiters: string[];
  comments: {
    line: string[];
    block: { start: string; end: string }[];
  };
  strings: {
    single: string;
    double: string;
    template?: string;
  };
  numbers: RegExp;
  functions: RegExp;
}