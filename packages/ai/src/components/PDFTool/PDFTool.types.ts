import { BaseProps } from '../../../core/src/components/BaseComponent';

// PDFTool variants
export type PDFToolVariants = 
  | 'default'
  | 'compact'
  | 'detailed'
  | 'minimal'
  | 'expanded';

// PDFTool sizes
export type PDFToolSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// PDFTool states
export type PDFToolStates = 
  | 'default'
  | 'loading'
  | 'error'
  | 'success'
  | 'focused'
  | 'disabled';

// PDF operations
export type PDFOperation = 
  | 'load'
  | 'extract-text'
  | 'extract-tables'
  | 'extract-images'
  | 'search'
  | 'summarize'
  | 'translate'
  | 'analyze'
  | 'convert'
  | 'merge'
  | 'split'
  | 'compress';

// PDF document interface
export interface PDFDocument {
  id: string;
  name: string;
  path: string;
  size: number;
  pages: number;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  keywords?: string[];
  metadata?: Record<string, any>;
  loaded: boolean;
  content?: PDFContent;
}

// PDF content interface
export interface PDFContent {
  text: string;
  pages: PDFPage[];
  tables: PDFTable[];
  images: PDFImage[];
  bookmarks: PDFBookmark[];
  annotations: PDFAnnotation[];
}

// PDF page interface
export interface PDFPage {
  number: number;
  text: string;
  width: number;
  height: number;
  rotation: number;
  images: PDFImage[];
  tables: PDFTable[];
  annotations: PDFAnnotation[];
}

// PDF table interface
export interface PDFTable {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rows: number;
  columns: number;
  data: string[][];
  headers?: string[];
  confidence: number;
}

// PDF image interface
export interface PDFImage {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  data: string; // Base64 encoded image data
  format: 'png' | 'jpeg' | 'gif' | 'bmp';
  size: number;
}

// PDF bookmark interface
export interface PDFBookmark {
  title: string;
  page: number;
  level: number;
  children: PDFBookmark[];
}

// PDF annotation interface
export interface PDFAnnotation {
  id: string;
  type: 'text' | 'highlight' | 'note' | 'link' | 'stamp';
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  author?: string;
  date?: Date;
}

// PDF search result interface
export interface PDFSearchResult {
  page: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  context: string;
  relevance: number;
}

// PDF analysis result interface
export interface PDFAnalysisResult {
  documentType: string;
  language: string;
  topics: string[];
  entities: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  keyPoints: string[];
  statistics: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    averageWordsPerSentence: number;
    readabilityScore: number;
  };
}

// PDFTool props interface
export interface PDFToolProps extends BaseProps {
  // Display configuration
  variant?: PDFToolVariants;
  size?: PDFToolSizes;
  state?: PDFToolStates;
  
  // PDF data
  documents?: PDFDocument[];
  currentDocument?: PDFDocument;
  currentPage?: number;
  searchResults?: PDFSearchResult[];
  analysisResult?: PDFAnalysisResult;
  
  // Display options
  showDocumentList?: boolean;
  showPageViewer?: boolean;
  showSearchResults?: boolean;
  showAnalysisResults?: boolean;
  showMetadata?: boolean;
  showBookmarks?: boolean;
  showAnnotations?: boolean;
  
  // Operations
  enableTextExtraction?: boolean;
  enableTableExtraction?: boolean;
  enableImageExtraction?: boolean;
  enableSearch?: boolean;
  enableAnalysis?: boolean;
  enableTranslation?: boolean;
  
  // Search configuration
  searchTerm?: string;
  caseSensitive?: boolean;
  wholeWords?: boolean;
  regex?: boolean;
  
  // Event handlers
  onDocumentLoad?: (document: PDFDocument) => void;
  onDocumentSelect?: (document: PDFDocument) => void;
  onPageChange?: (page: number) => void;
  onSearch?: (term: string, results: PDFSearchResult[]) => void;
  onAnalysis?: (result: PDFAnalysisResult) => void;
  onTextExtract?: (text: string) => void;
  onTableExtract?: (tables: PDFTable[]) => void;
  onImageExtract?: (images: PDFImage[]) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// PDFTool configuration interface
export interface PDFToolConfig {
  variant: PDFToolVariants;
  size: PDFToolSizes;
  state: PDFToolStates;
  showDocumentList: boolean;
  showPageViewer: boolean;
  showSearchResults: boolean;
  showAnalysisResults: boolean;
  showMetadata: boolean;
  showBookmarks: boolean;
  showAnnotations: boolean;
  enableTextExtraction: boolean;
  enableTableExtraction: boolean;
  enableImageExtraction: boolean;
  enableSearch: boolean;
  enableAnalysis: boolean;
  enableTranslation: boolean;
  caseSensitive: boolean;
  wholeWords: boolean;
  regex: boolean;
}

// PDFTool style configuration
export interface PDFToolStyleConfig {
  container: Record<string, any>;
  header: Record<string, any>;
  documentList: Record<string, any>;
  pageViewer: Record<string, any>;
  searchResults: Record<string, any>;
  analysisResults: Record<string, any>;
  metadata: Record<string, any>;
  bookmarks: Record<string, any>;
  annotations: Record<string, any>;
  toolbar: Record<string, any>;
}

// PDFTool events
export interface PDFToolDocumentLoadEvent {
  type: 'documentLoad';
  document: PDFDocument;
}

export interface PDFToolDocumentSelectEvent {
  type: 'documentSelect';
  document: PDFDocument;
}

export interface PDFToolPageChangeEvent {
  type: 'pageChange';
  page: number;
}

export interface PDFToolSearchEvent {
  type: 'search';
  term: string;
  results: PDFSearchResult[];
}

export interface PDFToolAnalysisEvent {
  type: 'analysis';
  result: PDFAnalysisResult;
}

export interface PDFToolTextExtractEvent {
  type: 'textExtract';
  text: string;
}

export interface PDFToolTableExtractEvent {
  type: 'tableExtract';
  tables: PDFTable[];
}

export interface PDFToolImageExtractEvent {
  type: 'imageExtract';
  images: PDFImage[];
}

export interface PDFToolFocusEvent {
  type: 'focus';
}

export interface PDFToolBlurEvent {
  type: 'blur';
}

export type PDFToolEvent = 
  | PDFToolDocumentLoadEvent
  | PDFToolDocumentSelectEvent
  | PDFToolPageChangeEvent
  | PDFToolSearchEvent
  | PDFToolAnalysisEvent
  | PDFToolTextExtractEvent
  | PDFToolTableExtractEvent
  | PDFToolImageExtractEvent
  | PDFToolFocusEvent
  | PDFToolBlurEvent;

// PDFTool validation result
export interface PDFToolValidationResult {
  success: boolean;
  data?: PDFToolProps;
  errors?: Error;
  warnings?: string[];
}

// PDFTool factory options
export interface PDFToolFactoryOptions {
  defaultVariant?: PDFToolVariants;
  defaultSize?: PDFToolSizes;
  defaultState?: PDFToolStates;
  theme?: any;
  parent?: any;
}

// PDFTool group props for multiple PDF tools
export interface PDFToolGroupProps extends BaseProps {
  pdfTools: PDFToolProps[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showGroupOperations?: boolean;
  onPDFToolSelect?: (pdfToolId: string) => void;
}

// PDF operation result interface
export interface PDFOperationResult {
  operation: PDFOperation;
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
  timestamp: number;
}

// PDF extraction options interface
export interface PDFExtractionOptions {
  extractText: boolean;
  extractTables: boolean;
  extractImages: boolean;
  extractBookmarks: boolean;
  extractAnnotations: boolean;
  imageFormat: 'png' | 'jpeg' | 'gif' | 'bmp';
  imageQuality: number;
  tableDetectionConfidence: number;
  ocrEnabled: boolean;
  ocrLanguage: string;
}

// PDF conversion options interface
export interface PDFConversionOptions {
  format: 'text' | 'html' | 'docx' | 'rtf' | 'odt';
  includeImages: boolean;
  includeTables: boolean;
  includeMetadata: boolean;
  pageRange?: { start: number; end: number };
  quality: 'low' | 'medium' | 'high';
}

// PDF merge options interface
export interface PDFMergeOptions {
  documents: PDFDocument[];
  outputName: string;
  preserveBookmarks: boolean;
  preserveAnnotations: boolean;
  pageOrder: 'sequential' | 'custom';
  customOrder?: number[];
}

// PDF split options interface
export interface PDFSplitOptions {
  document: PDFDocument;
  splitBy: 'pages' | 'bookmarks' | 'size';
  pageRanges?: { start: number; end: number }[];
  bookmarkLevel?: number;
  maxSize?: number;
  outputPrefix: string;
}