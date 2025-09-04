import { z } from 'zod';

// PDF Operations
export const PDFOperationSchema = z.enum([
  'load',
  'view',
  'extract-text',
  'extract-tables',
  'extract-images',
  'search',
  'annotate',
  'merge',
  'split',
  'compress',
  'convert',
  'sign',
  'protect',
  'unlock'
]);

export type PDFOperation = z.infer<typeof PDFOperationSchema>;

// PDF Document
export interface PDFDocument {
  id: string;
  name: string;
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
  language?: string;
  isEncrypted: boolean;
  isPasswordProtected: boolean;
  permissions: PDFPermissions;
  metadata: Record<string, any>;
  filePath?: string;
  url?: string;
  data?: ArrayBuffer;
}

// PDF Permissions
export interface PDFPermissions {
  print: boolean;
  modify: boolean;
  copy: boolean;
  addAnnotations: boolean;
  fillForms: boolean;
  extractForAccessibility: boolean;
  assemble: boolean;
  printHighRes: boolean;
}

// PDF Page
export interface PDFPage {
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
  textContent: string;
  images: PDFImage[];
  annotations: PDFAnnotation[];
  bookmarks: PDFBookmark[];
  thumbnails?: string; // Base64 thumbnail
}

// PDF Image
export interface PDFImage {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  data: string; // Base64 image data
  format: string;
  compression: string;
  colorspace: string;
}

// PDF Annotation
export interface PDFAnnotation {
  id: string;
  type: 'text' | 'highlight' | 'underline' | 'strikethrough' | 'note' | 'link' | 'stamp' | 'ink' | 'freeText';
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  author?: string;
  date?: Date;
  color?: string;
  opacity?: number;
}

// PDF Bookmark
export interface PDFBookmark {
  id: string;
  title: string;
  pageNumber: number;
  level: number;
  children: PDFBookmark[];
}

// PDF Table
export interface PDFTable {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rows: number;
  columns: number;
  data: string[][];
  headers?: string[];
}

// PDF Search Result
export interface PDFSearchResult {
  pageNumber: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  context: string;
  matchIndex: number;
  totalMatches: number;
}

// PDF Tool Variants
export const PDFToolVariantSchema = z.enum([
  'default',
  'compact',
  'detailed',
  'minimal',
  'expanded'
]);

export type PDFToolVariant = z.infer<typeof PDFToolVariantSchema>;

// PDF Tool States
export const PDFToolStateSchema = z.enum([
  'default',
  'loading',
  'error',
  'success',
  'focused',
  'disabled'
]);

export type PDFToolState = z.infer<typeof PDFToolStateSchema>;

// PDF Tool Props Schema
export const PDFToolPropsSchema = z.object({
  variant: PDFToolVariantSchema.default('default'),
  state: PDFToolStateSchema.default('default'),
  documents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    size: z.number(),
    pages: z.number(),
    title: z.string().optional(),
    author: z.string().optional(),
    subject: z.string().optional(),
    creator: z.string().optional(),
    producer: z.string().optional(),
    creationDate: z.date().optional(),
    modificationDate: z.date().optional(),
    keywords: z.array(z.string()).default([]),
    language: z.string().optional(),
    isEncrypted: z.boolean().default(false),
    isPasswordProtected: z.boolean().default(false),
    permissions: z.object({
      print: z.boolean().default(true),
      modify: z.boolean().default(true),
      copy: z.boolean().default(true),
      addAnnotations: z.boolean().default(true),
      fillForms: z.boolean().default(true),
      extractForAccessibility: z.boolean().default(true),
      assemble: z.boolean().default(true),
      printHighRes: z.boolean().default(true)
    }).optional(),
    metadata: z.record(z.any()).default({}),
    filePath: z.string().optional(),
    url: z.string().optional(),
    data: z.any().optional()
  })).default([]),
  currentDocument: z.string().optional(),
  currentPage: z.number().default(1),
  searchQuery: z.string().default(''),
  searchResults: z.array(z.object({
    pageNumber: z.number(),
    text: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    context: z.string(),
    matchIndex: z.number(),
    totalMatches: z.number()
  })).default([]),
  showDocumentList: z.boolean().default(true),
  showPageViewer: z.boolean().default(true),
  showSearchResults: z.boolean().default(true),
  showMetadata: z.boolean().default(false),
  showAnnotations: z.boolean().default(true),
  showBookmarks: z.boolean().default(true),
  showThumbnails: z.boolean().default(true),
  zoomLevel: z.number().default(1.0),
  pageMode: z.enum(['single', 'continuous', 'two-page']).default('single'),
  width: z.number().default(80),
  height: z.number().default(20),
  theme: z.object({
    primary: z.string().default('#00ff00'),
    secondary: z.string().default('#0088ff'),
    success: z.string().default('#00ff00'),
    warning: z.string().default('#ffaa00'),
    error: z.string().default('#ff0000'),
    background: z.string().default('#000000'),
    foreground: z.string().default('#ffffff'),
    border: z.string().default('#333333'),
    accent: z.string().default('#ff6b6b'),
    info: z.string().default('#4ecdc4')
  }).optional(),
  onDocumentLoad: z.function().optional(),
  onDocumentChange: z.function().optional(),
  onPageChange: z.function().optional(),
  onSearch: z.function().optional(),
  onTextExtract: z.function().optional(),
  onTableExtract: z.function().optional(),
  onImageExtract: z.function().optional(),
  onAnnotationAdd: z.function().optional(),
  onBookmarkClick: z.function().optional()
});

export type PDFToolProps = z.infer<typeof PDFToolPropsSchema>;

// PDF Tool Events
export interface PDFToolEvents {
  documentLoad: (document: PDFDocument) => void;
  documentChange: (document: PDFDocument) => void;
  pageChange: (pageNumber: number) => void;
  search: (query: string, results: PDFSearchResult[]) => void;
  textExtract: (text: string) => void;
  tableExtract: (tables: PDFTable[]) => void;
  imageExtract: (images: PDFImage[]) => void;
  annotationAdd: (annotation: PDFAnnotation) => void;
  bookmarkClick: (bookmark: PDFBookmark) => void;
  export: (data: any) => void;
  refresh: () => void;
}

// PDF Tool Methods
export interface PDFToolMethods {
  loadDocument: (file: File | string | ArrayBuffer) => Promise<PDFDocument>;
  getDocument: (id: string) => PDFDocument | null;
  getCurrentDocument: () => PDFDocument | null;
  setCurrentDocument: (id: string) => void;
  getPage: (pageNumber: number) => PDFPage | null;
  getCurrentPage: () => number;
  setCurrentPage: (pageNumber: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  search: (query: string) => PDFSearchResult[];
  extractText: (pageNumbers?: number[]) => string;
  extractTables: (pageNumbers?: number[]) => PDFTable[];
  extractImages: (pageNumbers?: number[]) => PDFImage[];
  addAnnotation: (annotation: Omit<PDFAnnotation, 'id'>) => void;
  removeAnnotation: (annotationId: string) => void;
  getAnnotations: (pageNumber?: number) => PDFAnnotation[];
  getBookmarks: () => PDFBookmark[];
  setZoom: (level: number) => void;
  getZoom: () => number;
  setPageMode: (mode: 'single' | 'continuous' | 'two-page') => void;
  getPageMode: () => 'single' | 'continuous' | 'two-page';
  exportDocument: (format: 'pdf' | 'text' | 'html' | 'json') => string;
  exportPage: (pageNumber: number, format: 'image' | 'text' | 'json') => string;
  getDocumentStats: () => {
    totalDocuments: number;
    totalPages: number;
    totalSize: number;
    averagePages: number;
    averageSize: number;
  };
  validateDocument: (document: PDFDocument) => boolean;
  getDocumentInfo: (document: PDFDocument) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    info: Record<string, any>;
  };
}

// PDF Parser Interface
export interface PDFParser {
  parse: (data: ArrayBuffer) => Promise<PDFDocument>;
  getPage: (document: PDFDocument, pageNumber: number) => Promise<PDFPage>;
  extractText: (page: PDFPage) => string;
  extractImages: (page: PDFPage) => PDFImage[];
  extractTables: (page: PDFPage) => PDFTable[];
  extractAnnotations: (page: PDFPage) => PDFAnnotation[];
  extractBookmarks: (document: PDFDocument) => PDFBookmark[];
  search: (document: PDFDocument, query: string) => PDFSearchResult[];
  getMetadata: (document: PDFDocument) => Record<string, any>;
  validate: (data: ArrayBuffer) => boolean;
}

// PDF Renderer Interface
export interface PDFRenderer {
  renderPage: (page: PDFPage, options: RenderOptions) => string;
  renderThumbnail: (page: PDFPage, size: { width: number; height: number }) => string;
  renderSearchHighlight: (page: PDFPage, results: PDFSearchResult[]) => string;
  renderAnnotations: (page: PDFPage, annotations: PDFAnnotation[]) => string;
  exportToImage: (page: PDFPage, format: 'png' | 'jpeg' | 'svg') => string;
  exportToText: (page: PDFPage) => string;
  exportToHTML: (page: PDFPage) => string;
}

// Render Options
export interface RenderOptions {
  width?: number;
  height?: number;
  zoom?: number;
  rotation?: number;
  backgroundColor?: string;
  textColor?: string;
  showAnnotations?: boolean;
  showBookmarks?: boolean;
  showSearchHighlights?: boolean;
}

// PDF Validator Interface
export interface PDFValidator {
  validate: (data: ArrayBuffer) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    info: Record<string, any>;
  };
  validateDocument: (document: PDFDocument) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  validatePage: (page: PDFPage) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  validateAnnotation: (annotation: PDFAnnotation) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

// PDF Analytics Interface
export interface PDFAnalytics {
  trackDocumentLoad: (document: PDFDocument) => void;
  trackPageView: (pageNumber: number) => void;
  trackSearch: (query: string, resultCount: number) => void;
  trackExtraction: (type: 'text' | 'table' | 'image', pageCount: number) => void;
  trackAnnotation: (type: string) => void;
  getUsageStats: () => {
    totalDocuments: number;
    totalPages: number;
    totalSearches: number;
    totalExtractions: number;
    totalAnnotations: number;
    averagePagesPerDocument: number;
    mostUsedFeatures: string[];
  };
  getTrends: (period: 'daily' | 'weekly' | 'monthly') => {
    documents: number[];
    pages: number[];
    searches: number[];
    extractions: number[];
  };
}