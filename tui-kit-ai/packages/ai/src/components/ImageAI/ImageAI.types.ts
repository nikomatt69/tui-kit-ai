import { z } from 'zod';

// Image Generation Models
export const GenerationModelSchema = z.enum([
  'dall-e-2',
  'dall-e-3',
  'midjourney',
  'stable-diffusion',
  'imagen',
  'parti',
  'firefly',
  'leonardo',
  'custom'
]);

export type GenerationModel = z.infer<typeof GenerationModelSchema>;

// Image Analysis Models
export const AnalysisModelSchema = z.enum([
  'gpt-4-vision',
  'claude-3-vision',
  'gemini-vision',
  'llava',
  'blip-2',
  'instructblip',
  'custom'
]);

export type AnalysisModel = z.infer<typeof AnalysisModelSchema>;

// Image Operations
export const ImageOperationSchema = z.enum([
  'generate',
  'analyze',
  'edit',
  'upscale',
  'enhance',
  'style-transfer',
  'object-detection',
  'face-detection',
  'text-extraction',
  'background-removal',
  'colorize',
  'denoise',
  'super-resolution'
]);

export type ImageOperation = z.infer<typeof ImageOperationSchema>;

// Image Generation Request
export interface ImageGenerationRequest {
  prompt: string;
  model: GenerationModel;
  size: ImageSize;
  quality: ImageQuality;
  style: ImageStyle;
  count: number;
  seed?: number;
  negativePrompt?: string;
  guidanceScale?: number;
  steps?: number;
  customParams?: Record<string, any>;
}

// Image Analysis Request
export interface ImageAnalysisRequest {
  image: string | File | ArrayBuffer;
  model: AnalysisModel;
  task: AnalysisTask;
  prompt?: string;
  maxTokens?: number;
  temperature?: number;
  customParams?: Record<string, any>;
}

// Image Size
export const ImageSizeSchema = z.enum([
  '256x256',
  '512x512',
  '1024x1024',
  '1024x1792',
  '1792x1024',
  'custom'
]);

export type ImageSize = z.infer<typeof ImageSizeSchema>;

// Image Quality
export const ImageQualitySchema = z.enum([
  'standard',
  'hd',
  'ultra-hd'
]);

export type ImageQuality = z.infer<typeof ImageQualitySchema>;

// Image Style
export const ImageStyleSchema = z.enum([
  'natural',
  'vivid',
  'artistic',
  'photorealistic',
  'cartoon',
  'anime',
  'oil-painting',
  'watercolor',
  'sketch',
  'digital-art'
]);

export type ImageStyle = z.infer<typeof ImageStyleSchema>;

// Analysis Task
export const AnalysisTaskSchema = z.enum([
  'describe',
  'caption',
  'objects',
  'faces',
  'text',
  'colors',
  'emotions',
  'scene',
  'brands',
  'custom'
]);

export type AnalysisTask = z.infer<typeof AnalysisTaskSchema>;

// Generated Image
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: GenerationModel;
  size: ImageSize;
  quality: ImageQuality;
  style: ImageStyle;
  seed?: number;
  timestamp: Date;
  metadata: Record<string, any>;
  data?: string; // Base64 data
}

// Analysis Result
export interface AnalysisResult {
  id: string;
  imageId: string;
  model: AnalysisModel;
  task: AnalysisTask;
  result: string;
  confidence: number;
  objects?: DetectedObject[];
  faces?: DetectedFace[];
  text?: ExtractedText[];
  colors?: ColorPalette[];
  emotions?: EmotionAnalysis[];
  timestamp: Date;
  metadata: Record<string, any>;
}

// Detected Object
export interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  bbox: BoundingBox;
  category: string;
  attributes?: Record<string, any>;
}

// Detected Face
export interface DetectedFace {
  id: string;
  confidence: number;
  bbox: BoundingBox;
  landmarks?: FaceLandmarks;
  emotions?: EmotionAnalysis[];
  age?: number;
  gender?: string;
  attributes?: Record<string, any>;
}

// Extracted Text
export interface ExtractedText {
  id: string;
  text: string;
  confidence: number;
  bbox: BoundingBox;
  language?: string;
  font?: string;
  size?: number;
}

// Color Palette
export interface ColorPalette {
  color: string;
  percentage: number;
  name?: string;
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
}

// Emotion Analysis
export interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  intensity: number;
}

// Bounding Box
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Face Landmarks
export interface FaceLandmarks {
  leftEye: [number, number];
  rightEye: [number, number];
  nose: [number, number];
  leftMouth: [number, number];
  rightMouth: [number, number];
}

// Image AI Variants
export const ImageAIVariantSchema = z.enum([
  'default',
  'compact',
  'detailed',
  'minimal',
  'expanded'
]);

export type ImageAIVariant = z.infer<typeof ImageAIVariantSchema>;

// Image AI States
export const ImageAIStateSchema = z.enum([
  'default',
  'loading',
  'error',
  'success',
  'focused',
  'disabled'
]);

export type ImageAIState = z.infer<typeof ImageAIStateSchema>;

// Image AI Props Schema
export const ImageAIPropsSchema = z.object({
  variant: ImageAIVariantSchema.default('default'),
  state: ImageAIStateSchema.default('default'),
  defaultModel: GenerationModelSchema.default('dall-e-3'),
  defaultAnalysisModel: AnalysisModelSchema.default('gpt-4-vision'),
  generatedImages: z.array(z.object({
    id: z.string(),
    url: z.string(),
    prompt: z.string(),
    model: GenerationModelSchema,
    size: ImageSizeSchema,
    quality: ImageQualitySchema,
    style: ImageStyleSchema,
    seed: z.number().optional(),
    timestamp: z.date(),
    metadata: z.record(z.any()),
    data: z.string().optional()
  })).default([]),
  analysisResults: z.array(z.object({
    id: z.string(),
    imageId: z.string(),
    model: AnalysisModelSchema,
    task: AnalysisTaskSchema,
    result: z.string(),
    confidence: z.number(),
    objects: z.array(z.object({
      id: z.string(),
      label: z.string(),
      confidence: z.number(),
      bbox: z.object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number()
      }),
      category: z.string(),
      attributes: z.record(z.any()).optional()
    })).optional(),
    faces: z.array(z.object({
      id: z.string(),
      confidence: z.number(),
      bbox: z.object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number()
      }),
      landmarks: z.object({
        leftEye: z.tuple([z.number(), z.number()]),
        rightEye: z.tuple([z.number(), z.number()]),
        nose: z.tuple([z.number(), z.number()]),
        leftMouth: z.tuple([z.number(), z.number()]),
        rightMouth: z.tuple([z.number(), z.number()])
      }).optional(),
      emotions: z.array(z.object({
        emotion: z.string(),
        confidence: z.number(),
        intensity: z.number()
      })).optional(),
      age: z.number().optional(),
      gender: z.string().optional(),
      attributes: z.record(z.any()).optional()
    })).optional(),
    text: z.array(z.object({
      id: z.string(),
      text: z.string(),
      confidence: z.number(),
      bbox: z.object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number()
      }),
      language: z.string().optional(),
      font: z.string().optional(),
      size: z.number().optional()
    })).optional(),
    colors: z.array(z.object({
      color: z.string(),
      percentage: z.number(),
      name: z.string().optional(),
      hex: z.string(),
      rgb: z.tuple([z.number(), z.number(), z.number()]),
      hsl: z.tuple([z.number(), z.number(), z.number()])
    })).optional(),
    emotions: z.array(z.object({
      emotion: z.string(),
      confidence: z.number(),
      intensity: z.number()
    })).optional(),
    timestamp: z.date(),
    metadata: z.record(z.any())
  })).default([]),
  showPromptEditor: z.boolean().default(true),
  showGallery: z.boolean().default(true),
  showAnalysis: z.boolean().default(true),
  showHistory: z.boolean().default(true),
  showSettings: z.boolean().default(false),
  showMetadata: z.boolean().default(false),
  maxImages: z.number().default(50),
  maxHistoryItems: z.number().default(100),
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
  onImageGenerate: z.function().optional(),
  onImageAnalyze: z.function().optional(),
  onImageEdit: z.function().optional(),
  onImageSelect: z.function().optional(),
  onPromptChange: z.function().optional(),
  onModelChange: z.function().optional(),
  onSettingsChange: z.function().optional()
});

export type ImageAIProps = z.infer<typeof ImageAIPropsSchema>;

// Image AI Events
export interface ImageAIEvents {
  imageGenerate: (request: ImageGenerationRequest) => void;
  imageAnalyze: (request: ImageAnalysisRequest) => void;
  imageEdit: (imageId: string, edits: any) => void;
  imageSelect: (image: GeneratedImage) => void;
  promptChange: (prompt: string) => void;
  modelChange: (model: GenerationModel | AnalysisModel) => void;
  settingsChange: (settings: any) => void;
  export: (data: any) => void;
  refresh: () => void;
}

// Image AI Methods
export interface ImageAIMethods {
  generateImage: (request: ImageGenerationRequest) => Promise<GeneratedImage[]>;
  analyzeImage: (request: ImageAnalysisRequest) => Promise<AnalysisResult>;
  editImage: (imageId: string, edits: any) => Promise<GeneratedImage>;
  getGeneratedImages: () => GeneratedImage[];
  getAnalysisResults: () => AnalysisResult[];
  getImageById: (id: string) => GeneratedImage | null;
  getAnalysisById: (id: string) => AnalysisResult | null;
  deleteImage: (id: string) => void;
  deleteAnalysis: (id: string) => void;
  clearHistory: () => void;
  exportImages: (format: 'json' | 'zip' | 'urls') => string;
  exportAnalysis: (format: 'json' | 'csv' | 'txt') => string;
  setModel: (model: GenerationModel) => void;
  getModel: () => GenerationModel;
  setAnalysisModel: (model: AnalysisModel) => void;
  getAnalysisModel: () => AnalysisModel;
  setPrompt: (prompt: string) => void;
  getPrompt: () => string;
  getImageStats: () => {
    totalGenerated: number;
    totalAnalyzed: number;
    averageGenerationTime: number;
    averageAnalysisTime: number;
    mostUsedModel: GenerationModel;
    mostUsedAnalysisModel: AnalysisModel;
  };
  validatePrompt: (prompt: string) => boolean;
  getPromptSuggestions: (prompt: string) => string[];
  optimizePrompt: (prompt: string) => string;
}

// Image Generator Interface
export interface ImageGenerator {
  generate: (request: ImageGenerationRequest) => Promise<GeneratedImage[]>;
  getSupportedModels: () => GenerationModel[];
  getModelInfo: (model: GenerationModel) => {
    name: string;
    description: string;
    maxSize: ImageSize;
    supportedStyles: ImageStyle[];
    maxImages: number;
    costPerImage: number;
  };
  validateRequest: (request: ImageGenerationRequest) => boolean;
  estimateCost: (request: ImageGenerationRequest) => number;
}

// Image Analyzer Interface
export interface ImageAnalyzer {
  analyze: (request: ImageAnalysisRequest) => Promise<AnalysisResult>;
  getSupportedModels: () => AnalysisModel[];
  getModelInfo: (model: AnalysisModel) => {
    name: string;
    description: string;
    supportedTasks: AnalysisTask[];
    maxImageSize: number;
    costPerAnalysis: number;
  };
  validateRequest: (request: ImageAnalysisRequest) => boolean;
  estimateCost: (request: ImageAnalysisRequest) => number;
}

// Image Editor Interface
export interface ImageEditor {
  edit: (imageId: string, edits: any) => Promise<GeneratedImage>;
  getSupportedEdits: () => string[];
  validateEdit: (edit: any) => boolean;
  previewEdit: (imageId: string, edit: any) => string;
}

// Image Validator Interface
export interface ImageValidator {
  validateImage: (image: string | File | ArrayBuffer) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    info: {
      format: string;
      size: number;
      dimensions: { width: number; height: number };
      colorSpace: string;
    };
  };
  validatePrompt: (prompt: string) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  };
  validateRequest: (request: ImageGenerationRequest | ImageAnalysisRequest) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

// Image Analytics Interface
export interface ImageAnalytics {
  trackGeneration: (request: ImageGenerationRequest, result: GeneratedImage[], duration: number) => void;
  trackAnalysis: (request: ImageAnalysisRequest, result: AnalysisResult, duration: number) => void;
  trackUsage: (feature: string, metadata: any) => void;
  getUsageStats: () => {
    totalGenerations: number;
    totalAnalyses: number;
    averageGenerationTime: number;
    averageAnalysisTime: number;
    mostUsedModels: Record<string, number>;
    mostUsedPrompts: string[];
    costBreakdown: Record<string, number>;
  };
  getTrends: (period: 'daily' | 'weekly' | 'monthly') => {
    generations: number[];
    analyses: number[];
    costs: number[];
  };
}