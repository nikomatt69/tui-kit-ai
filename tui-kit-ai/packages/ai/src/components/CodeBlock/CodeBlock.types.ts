import { z } from 'zod';

// Supported Programming Languages
export const LanguageSchema = z.enum([
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'cpp',
  'c',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'scala',
  'r',
  'matlab',
  'sql',
  'html',
  'css',
  'scss',
  'sass',
  'less',
  'json',
  'yaml',
  'xml',
  'markdown',
  'bash',
  'shell',
  'powershell',
  'dockerfile',
  'makefile',
  'ini',
  'toml',
  'env',
  'gitignore',
  'plaintext'
]);

export type Language = z.infer<typeof LanguageSchema>;

// Code Themes
export const CodeThemeSchema = z.enum([
  'dark',
  'light',
  'monokai',
  'dracula',
  'github',
  'vs-code',
  'atom',
  'solarized',
  'tomorrow',
  'oceanic',
  'material',
  'nord',
  'gruvbox',
  'one-dark',
  'one-light'
]);

export type CodeTheme = z.infer<typeof CodeThemeSchema>;

// Code Block Variants
export const CodeBlockVariantSchema = z.enum([
  'default',
  'compact',
  'expanded',
  'minimal',
  'detailed'
]);

export type CodeBlockVariant = z.infer<typeof CodeBlockVariantSchema>;

// Code Block States
export const CodeBlockStateSchema = z.enum([
  'default',
  'loading',
  'error',
  'success',
  'focused',
  'collapsed',
  'expanded'
]);

export type CodeBlockState = z.infer<typeof CodeBlockStateSchema>;

// Syntax Highlighting Options
export interface SyntaxHighlighting {
  enabled: boolean;
  theme: CodeTheme;
  showLineNumbers: boolean;
  highlightLines?: number[];
  wrapLines: boolean;
  tabSize: number;
  insertSpaces: boolean;
}

// Code Actions
export interface CodeAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  visible: boolean;
  enabled: boolean;
}

// Code Metadata
export interface CodeMetadata {
  language: Language;
  filename?: string;
  lines: number;
  characters: number;
  size: number;
  encoding: string;
  lastModified?: Date;
  author?: string;
  description?: string;
  tags?: string[];
}

// Code Block Props Schema
export const CodeBlockPropsSchema = z.object({
  code: z.string().default(''),
  language: LanguageSchema.default('plaintext'),
  theme: CodeThemeSchema.default('dark'),
  variant: CodeBlockVariantSchema.default('default'),
  state: CodeBlockStateSchema.default('default'),
  syntaxHighlighting: z.object({
    enabled: z.boolean().default(true),
    theme: CodeThemeSchema.default('dark'),
    showLineNumbers: z.boolean().default(true),
    highlightLines: z.array(z.number()).optional(),
    wrapLines: z.boolean().default(false),
    tabSize: z.number().default(2),
    insertSpaces: z.boolean().default(true)
  }).optional(),
  metadata: z.object({
    language: LanguageSchema,
    filename: z.string().optional(),
    lines: z.number().default(0),
    characters: z.number().default(0),
    size: z.number().default(0),
    encoding: z.string().default('utf-8'),
    lastModified: z.date().optional(),
    author: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([])
  }).optional(),
  actions: z.array(z.object({
    id: z.string(),
    label: z.string(),
    icon: z.string(),
    action: z.function(),
    visible: z.boolean().default(true),
    enabled: z.boolean().default(true)
  })).default([]),
  width: z.number().default(80),
  height: z.number().default(20),
  maxHeight: z.number().optional(),
  collapsible: z.boolean().default(false),
  collapsed: z.boolean().default(false),
  copyable: z.boolean().default(true),
  downloadable: z.boolean().default(false),
  searchable: z.boolean().default(true),
  editable: z.boolean().default(false),
  theme: z.object({
    primary: z.string().default('#00ff00'),
    secondary: z.string().default('#0088ff'),
    success: z.string().default('#00ff00'),
    warning: z.string().default('#ffaa00'),
    error: z.string().default('#ff0000'),
    background: z.string().default('#1e1e1e'),
    foreground: z.string().default('#d4d4d4'),
    border: z.string().default('#333333'),
    selection: z.string().default('#264f78'),
    comment: z.string().default('#6a9955'),
    keyword: z.string().default('#569cd6'),
    string: z.string().default('#ce9178'),
    number: z.string().default('#b5cea8'),
    function: z.string().default('#dcdcaa'),
    variable: z.string().default('#9cdcfe'),
    type: z.string().default('#4ec9b0'),
    constant: z.string().default('#4fc1ff')
  }).optional(),
  onCodeChange: z.function().optional(),
  onLanguageChange: z.function().optional(),
  onThemeChange: z.function().optional(),
  onAction: z.function().optional(),
  onCopy: z.function().optional(),
  onDownload: z.function().optional(),
  onSearch: z.function().optional(),
  onFocus: z.function().optional(),
  onBlur: z.function().optional()
});

export type CodeBlockProps = z.infer<typeof CodeBlockPropsSchema>;

// Code Block Events
export interface CodeBlockEvents {
  codeChange: (code: string) => void;
  languageChange: (language: Language) => void;
  themeChange: (theme: CodeTheme) => void;
  action: (actionId: string) => void;
  copy: (code: string) => void;
  download: (filename: string, code: string) => void;
  search: (query: string, results: SearchResult[]) => void;
  focus: () => void;
  blur: () => void;
  collapse: () => void;
  expand: () => void;
}

// Search Result
export interface SearchResult {
  line: number;
  column: number;
  match: string;
  context: string;
}

// Code Block Methods
export interface CodeBlockMethods {
  setCode: (code: string) => void;
  getCode: () => string;
  setLanguage: (language: Language) => void;
  getLanguage: () => Language;
  setTheme: (theme: CodeTheme) => void;
  getTheme: () => CodeTheme;
  highlightSyntax: () => void;
  copyToClipboard: () => void;
  downloadCode: (filename?: string) => void;
  searchCode: (query: string) => SearchResult[];
  toggleCollapse: () => void;
  collapse: () => void;
  expand: () => void;
  isCollapsed: () => boolean;
  isExpanded: () => boolean;
  addAction: (action: CodeAction) => void;
  removeAction: (actionId: string) => void;
  updateMetadata: (metadata: Partial<CodeMetadata>) => void;
  getMetadata: () => CodeMetadata;
  formatCode: () => void;
  validateCode: () => boolean;
  getLineCount: () => number;
  getCharacterCount: () => number;
  getSize: () => number;
}

// Language Detection
export interface LanguageDetection {
  detectLanguage: (code: string, filename?: string) => Language;
  getLanguageFromExtension: (extension: string) => Language;
  getLanguageInfo: (language: Language) => {
    name: string;
    extensions: string[];
    mimeTypes: string[];
    aliases: string[];
  };
}

// Code Formatter
export interface CodeFormatter {
  format: (code: string, language: Language) => string;
  isFormattable: (language: Language) => boolean;
  getSupportedLanguages: () => Language[];
}

// Code Validator
export interface CodeValidator {
  validate: (code: string, language: Language) => {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  };
  getSupportedLanguages: () => Language[];
}

// Validation Error
export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code?: string;
}

// Validation Warning
export interface ValidationWarning {
  line: number;
  column: number;
  message: string;
  severity: 'warning' | 'info';
  code?: string;
}