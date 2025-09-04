// Stream Component
export { Stream } from './Stream';
export type { 
  StreamProps, 
  StreamChunk, 
  StreamState, 
  StreamVariant, 
  StreamStats, 
  StreamProgress, 
  StreamEvents, 
  StreamMethods,
  ChunkType,
  StreamConfig
} from './Stream';

// CodeBlock Component
export { CodeBlock } from './CodeBlock';
export type { 
  CodeBlockProps, 
  CodeAction, 
  CodeMetadata, 
  SearchResult, 
  CodeBlockEvents, 
  CodeBlockMethods,
  Language,
  CodeTheme,
  CodeBlockVariant,
  CodeBlockState,
  SyntaxHighlighting,
  LanguageDetection,
  CodeFormatter,
  CodeValidator,
  ValidationError,
  ValidationWarning
} from './CodeBlock';

// TokenInfo Component
export { TokenInfo } from './TokenInfo';
export type { 
  TokenInfoProps, 
  TokenStats, 
  CostInfo, 
  TokenLimits, 
  TokenBreakdown, 
  TokenUsage, 
  TokenType,
  TokenInfoVariant,
  TokenInfoState,
  TokenInfoEvents, 
  TokenInfoMethods,
  TokenCalculator,
  TokenFormatter,
  TokenValidator,
  TokenAnalytics
} from './TokenInfo';

// ModelSelector Component
export { ModelSelector } from './ModelSelector';
export type { 
  ModelSelectorProps, 
  ModelInfo, 
  ModelFilter, 
  ModelComparison, 
  ModelSelectorEvents, 
  ModelSelectorMethods,
  Provider,
  Capability,
  PerformanceLevel,
  Availability,
  ModelSelectorVariant,
  ModelSelectorState,
  ModelRepository,
  ModelValidator,
  ModelComparator,
  ModelAnalytics
} from './ModelSelector';

// WebSearchTool Component
export { WebSearchTool } from './WebSearchTool';
export type { 
  WebSearchToolProps, 
  SearchQuery, 
  SearchResult, 
  SearchHistory, 
  SearchStats, 
  SearchFilter, 
  WebSearchToolEvents, 
  WebSearchToolMethods,
  SearchEngine,
  SearchResultType,
  WebSearchToolVariant,
  WebSearchToolState,
  SearchEngineInterface,
  SearchResultProcessor,
  SearchAnalytics,
  SearchCache,
  SearchValidator
} from './WebSearchTool';

// PDFTool Component
export { PDFTool } from './PDFTool';
export type { 
  PDFToolProps, 
  PDFDocument, 
  PDFPage, 
  PDFSearchResult, 
  PDFTable, 
  PDFImage, 
  PDFAnnotation, 
  PDFBookmark, 
  PDFToolEvents, 
  PDFToolMethods,
  PDFOperation,
  PDFPermissions,
  PDFToolVariant,
  PDFToolState,
  PDFParser,
  PDFRenderer,
  RenderOptions,
  PDFValidator,
  PDFAnalytics
} from './PDFTool';

// ImageAI Component
export { ImageAI } from './ImageAI';
export type { 
  ImageAIProps, 
  ImageGenerationRequest, 
  ImageAnalysisRequest, 
  GeneratedImage, 
  AnalysisResult, 
  ImageAIEvents, 
  ImageAIMethods,
  GenerationModel,
  AnalysisModel,
  ImageSize,
  ImageQuality,
  ImageStyle,
  AnalysisTask,
  ImageOperation,
  DetectedObject,
  DetectedFace,
  ExtractedText,
  ColorPalette,
  EmotionAnalysis,
  BoundingBox,
  FaceLandmarks,
  ImageAIVariant,
  ImageAIState,
  ImageGenerator,
  ImageAnalyzer,
  ImageEditor,
  ImageValidator,
  ImageAnalytics
} from './ImageAI';

// Re-export all styling utilities
export {
  // Stream styles
  generateStreamStyles,
  getStreamVariantClass,
  getStreamStateClass,
  getChunkTypeClass,
  generateResponsiveStreamStyles,
  
  // CodeBlock styles
  generateCodeBlockStyles,
  getCodeBlockVariantClass,
  getCodeBlockStateClass,
  getCodeBlockThemeClass,
  generateResponsiveCodeBlockStyles,
  
  // TokenInfo styles
  generateTokenInfoStyles,
  getTokenInfoVariantClass,
  getTokenInfoStateClass,
  generateResponsiveTokenInfoStyles,
  
  // ModelSelector styles
  generateModelSelectorStyles,
  getModelSelectorVariantClass,
  getModelSelectorStateClass,
  getProviderClass,
  getCapabilityClass,
  getPerformanceClass,
  getAvailabilityClass,
  generateResponsiveModelSelectorStyles,
  
  // WebSearchTool styles
  generateWebSearchToolStyles,
  getWebSearchToolVariantClass,
  getWebSearchToolStateClass,
  getEngineClass,
  getResultTypeClass,
  generateResponsiveWebSearchToolStyles,
  
  // PDFTool styles
  generatePDFToolStyles,
  getPDFToolVariantClass,
  getPDFToolStateClass,
  generateResponsivePDFToolStyles,
  
  // ImageAI styles
  generateImageAIStyles,
  getImageAIVariantClass,
  getImageAIStateClass,
  getGenerationModelClass,
  getAnalysisModelClass,
  generateResponsiveImageAIStyles
} from './Stream';

// Common types and utilities
export interface AIComponentBase {
  mount(container: HTMLElement): void;
  unmount(): void;
  updateProps(newProps: any): void;
  getElement(): HTMLElement | null;
  destroy(): void;
}

export interface AIComponentTheme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  foreground: string;
  border: string;
  accent?: string;
  info?: string;
}

export interface AIComponentSize {
  width: number;
  height: number;
}

export interface AIComponentVariant {
  variant: string;
  state: string;
}

// Utility functions for common operations
export function createAIComponent<T extends AIComponentBase>(
  ComponentClass: new (props: any) => T,
  props: any,
  container: HTMLElement
): T {
  const component = new ComponentClass(props);
  component.mount(container);
  return component;
}

export function destroyAIComponent(component: AIComponentBase): void {
  component.destroy();
}

export function updateAIComponentTheme(component: AIComponentBase, theme: AIComponentTheme): void {
  component.updateProps({ theme });
}

export function resizeAIComponent(component: AIComponentBase, size: AIComponentSize): void {
  component.updateProps(size);
}

// Default theme configuration
export const defaultAITheme: AIComponentTheme = {
  primary: '#00ff00',
  secondary: '#0088ff',
  success: '#00ff00',
  warning: '#ffaa00',
  error: '#ff0000',
  background: '#000000',
  foreground: '#ffffff',
  border: '#333333',
  accent: '#ff6b6b',
  info: '#4ecdc4'
};

// Component registry for dynamic loading
export const AIComponentRegistry = {
  Stream: () => import('./Stream'),
  CodeBlock: () => import('./CodeBlock'),
  TokenInfo: () => import('./TokenInfo'),
  ModelSelector: () => import('./ModelSelector'),
  WebSearchTool: () => import('./WebSearchTool'),
  PDFTool: () => import('./PDFTool'),
  ImageAI: () => import('./ImageAI')
} as const;

export type AIComponentName = keyof typeof AIComponentRegistry;