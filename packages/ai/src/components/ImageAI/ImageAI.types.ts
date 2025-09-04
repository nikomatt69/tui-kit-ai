import { BaseProps } from '../../../core/src/components/BaseComponent';

// ImageAI variants
export type ImageAIVariants = 
  | 'default'
  | 'compact'
  | 'detailed'
  | 'minimal'
  | 'expanded';

// ImageAI sizes
export type ImageAISizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// ImageAI states
export type ImageAIStates = 
  | 'default'
  | 'loading'
  | 'error'
  | 'success'
  | 'focused'
  | 'disabled';

// Image generation models
export type ImageGenerationModel = 
  | 'dall-e-2'
  | 'dall-e-3'
  | 'midjourney'
  | 'stable-diffusion'
  | 'imagen'
  | 'parti'
  | 'firefly'
  | 'custom';

// Image analysis models
export type ImageAnalysisModel = 
  | 'gpt-4-vision'
  | 'claude-3-vision'
  | 'gemini-vision'
  | 'llava'
  | 'blip'
  | 'custom';

// Image formats
export type ImageFormat = 
  | 'png'
  | 'jpeg'
  | 'jpg'
  | 'gif'
  | 'webp'
  | 'bmp'
  | 'svg';

// Image quality levels
export type ImageQuality = 
  | 'low'
  | 'medium'
  | 'high'
  | 'ultra';

// Image style presets
export type ImageStyle = 
  | 'realistic'
  | 'artistic'
  | 'cartoon'
  | 'anime'
  | 'photographic'
  | 'painting'
  | 'sketch'
  | 'digital-art'
  | 'vintage'
  | 'modern';

// Generated image interface
export interface GeneratedImage {
  id: string;
  prompt: string;
  model: ImageGenerationModel;
  url: string;
  data: string; // Base64 encoded image data
  format: ImageFormat;
  width: number;
  height: number;
  quality: ImageQuality;
  style: ImageStyle;
  timestamp: number;
  metadata: {
    seed?: number;
    steps?: number;
    guidance?: number;
    negativePrompt?: string;
    parameters?: Record<string, any>;
  };
}

// Image analysis result interface
export interface ImageAnalysisResult {
  id: string;
  imageId: string;
  model: ImageAnalysisModel;
  description: string;
  objects: ImageObject[];
  text: string[];
  colors: ImageColor[];
  emotions: ImageEmotion[];
  tags: string[];
  confidence: number;
  timestamp: number;
  metadata: Record<string, any>;
}

// Image object interface
export interface ImageObject {
  name: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  category: string;
  attributes?: string[];
}

// Image color interface
export interface ImageColor {
  color: string; // Hex color code
  percentage: number;
  name: string;
}

// Image emotion interface
export interface ImageEmotion {
  emotion: string;
  confidence: number;
  intensity: number;
}

// Image generation request interface
export interface ImageGenerationRequest {
  prompt: string;
  model: ImageGenerationModel;
  size: string;
  quality: ImageQuality;
  style: ImageStyle;
  count: number;
  format: ImageFormat;
  negativePrompt?: string;
  seed?: number;
  steps?: number;
  guidance?: number;
  parameters?: Record<string, any>;
}

// Image analysis request interface
export interface ImageAnalysisRequest {
  imageId: string;
  model: ImageAnalysisModel;
  tasks: ('description' | 'objects' | 'text' | 'colors' | 'emotions' | 'tags')[];
  parameters?: Record<string, any>;
}

// ImageAI props interface
export interface ImageAIProps extends BaseProps {
  // Display configuration
  variant?: ImageAIVariants;
  size?: ImageAISizes;
  state?: ImageAIStates;
  
  // Image data
  generatedImages?: GeneratedImage[];
  analysisResults?: ImageAnalysisResult[];
  currentImage?: GeneratedImage;
  currentAnalysis?: ImageAnalysisResult;
  
  // Display options
  showPromptEditor?: boolean;
  showImageGallery?: boolean;
  showAnalysisResults?: boolean;
  showGenerationHistory?: boolean;
  showModelSelector?: boolean;
  showStyleSelector?: boolean;
  showQualitySelector?: boolean;
  
  // Generation configuration
  defaultModel?: ImageGenerationModel;
  defaultStyle?: ImageStyle;
  defaultQuality?: ImageQuality;
  defaultFormat?: ImageFormat;
  maxImages?: number;
  
  // Analysis configuration
  analysisModel?: ImageAnalysisModel;
  enableObjectDetection?: boolean;
  enableTextRecognition?: boolean;
  enableColorAnalysis?: boolean;
  enableEmotionAnalysis?: boolean;
  
  // Event handlers
  onImageGenerate?: (request: ImageGenerationRequest) => void;
  onImageAnalyze?: (request: ImageAnalysisRequest) => void;
  onImageSelect?: (image: GeneratedImage) => void;
  onImageDownload?: (image: GeneratedImage) => void;
  onImageDelete?: (imageId: string) => void;
  onPromptChange?: (prompt: string) => void;
  onModelChange?: (model: ImageGenerationModel | ImageAnalysisModel) => void;
  onStyleChange?: (style: ImageStyle) => void;
  onQualityChange?: (quality: ImageQuality) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// ImageAI configuration interface
export interface ImageAIConfig {
  variant: ImageAIVariants;
  size: ImageAISizes;
  state: ImageAIStates;
  showPromptEditor: boolean;
  showImageGallery: boolean;
  showAnalysisResults: boolean;
  showGenerationHistory: boolean;
  showModelSelector: boolean;
  showStyleSelector: boolean;
  showQualitySelector: boolean;
  defaultModel: ImageGenerationModel;
  defaultStyle: ImageStyle;
  defaultQuality: ImageQuality;
  defaultFormat: ImageFormat;
  maxImages: number;
  analysisModel: ImageAnalysisModel;
  enableObjectDetection: boolean;
  enableTextRecognition: boolean;
  enableColorAnalysis: boolean;
  enableEmotionAnalysis: boolean;
}

// ImageAI style configuration
export interface ImageAIStyleConfig {
  container: Record<string, any>;
  header: Record<string, any>;
  promptEditor: Record<string, any>;
  imageGallery: Record<string, any>;
  analysisResults: Record<string, any>;
  generationHistory: Record<string, any>;
  modelSelector: Record<string, any>;
  styleSelector: Record<string, any>;
  qualitySelector: Record<string, any>;
  toolbar: Record<string, any>;
}

// ImageAI events
export interface ImageAIImageGenerateEvent {
  type: 'imageGenerate';
  request: ImageGenerationRequest;
}

export interface ImageAIImageAnalyzeEvent {
  type: 'imageAnalyze';
  request: ImageAnalysisRequest;
}

export interface ImageAIImageSelectEvent {
  type: 'imageSelect';
  image: GeneratedImage;
}

export interface ImageAIImageDownloadEvent {
  type: 'imageDownload';
  image: GeneratedImage;
}

export interface ImageAIImageDeleteEvent {
  type: 'imageDelete';
  imageId: string;
}

export interface ImageAIPromptChangeEvent {
  type: 'promptChange';
  prompt: string;
}

export interface ImageAIModelChangeEvent {
  type: 'modelChange';
  model: ImageGenerationModel | ImageAnalysisModel;
}

export interface ImageAIStyleChangeEvent {
  type: 'styleChange';
  style: ImageStyle;
}

export interface ImageAIQualityChangeEvent {
  type: 'qualityChange';
  quality: ImageQuality;
}

export interface ImageAIFocusEvent {
  type: 'focus';
}

export interface ImageAIBlurEvent {
  type: 'blur';
}

export type ImageAIEvent = 
  | ImageAIImageGenerateEvent
  | ImageAIImageAnalyzeEvent
  | ImageAIImageSelectEvent
  | ImageAIImageDownloadEvent
  | ImageAIImageDeleteEvent
  | ImageAIPromptChangeEvent
  | ImageAIModelChangeEvent
  | ImageAIStyleChangeEvent
  | ImageAIQualityChangeEvent
  | ImageAIFocusEvent
  | ImageAIBlurEvent;

// ImageAI validation result
export interface ImageAIValidationResult {
  success: boolean;
  data?: ImageAIProps;
  errors?: Error;
  warnings?: string[];
}

// ImageAI factory options
export interface ImageAIFactoryOptions {
  defaultVariant?: ImageAIVariants;
  defaultSize?: ImageAISizes;
  defaultState?: ImageAIStates;
  defaultModel?: ImageGenerationModel;
  theme?: any;
  parent?: any;
}

// ImageAI group props for multiple image AI tools
export interface ImageAIGroupProps extends BaseProps {
  imageAIs: ImageAIProps[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showGroupGallery?: boolean;
  onImageAISelect?: (imageAIId: string) => void;
}

// Image generation history item interface
export interface ImageGenerationHistoryItem {
  id: string;
  prompt: string;
  model: ImageGenerationModel;
  timestamp: number;
  images: GeneratedImage[];
  success: boolean;
  error?: string;
}

// Image batch operation interface
export interface ImageBatchOperation {
  operation: 'generate' | 'analyze' | 'delete' | 'download';
  images: string[];
  parameters?: Record<string, any>;
}

// Image filter interface
export interface ImageFilter {
  model?: ImageGenerationModel[];
  style?: ImageStyle[];
  quality?: ImageQuality[];
  format?: ImageFormat[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

// Image search result interface
export interface ImageSearchResult {
  images: GeneratedImage[];
  totalCount: number;
  filteredCount: number;
  filters: ImageFilter;
  searchTerm: string;
}

// Image statistics interface
export interface ImageStatistics {
  totalImages: number;
  totalGenerations: number;
  totalAnalyses: number;
  averageGenerationTime: number;
  averageAnalysisTime: number;
  mostUsedModel: ImageGenerationModel;
  mostUsedStyle: ImageStyle;
  mostUsedQuality: ImageQuality;
  successRate: number;
  errorRate: number;
}