import { z } from 'zod';

// Stream Variants
export const StreamVariantSchema = z.enum([
  'default',
  'realtime',
  'buffered',
  'chunked',
  'minimal'
]);

export type StreamVariant = z.infer<typeof StreamVariantSchema>;

// Stream States
export const StreamStateSchema = z.enum([
  'idle',
  'connecting',
  'streaming',
  'paused',
  'completed',
  'error',
  'focused'
]);

export type StreamState = z.infer<typeof StreamStateSchema>;

// Chunk Types
export const ChunkTypeSchema = z.enum([
  'text',
  'code',
  'data',
  'error',
  'metadata',
  'progress',
  'complete'
]);

export type ChunkType = z.infer<typeof ChunkTypeSchema>;

// Stream Chunk Interface
export interface StreamChunk {
  id: string;
  type: ChunkType;
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Stream Statistics
export interface StreamStats {
  totalChunks: number;
  totalBytes: number;
  chunksPerSecond: number;
  bytesPerSecond: number;
  averageChunkSize: number;
  startTime: number;
  endTime?: number;
  duration?: number;
}

// Stream Progress
export interface StreamProgress {
  current: number;
  total?: number;
  percentage?: number;
  estimatedTimeRemaining?: number;
  speed?: number;
}

// Stream Configuration
export interface StreamConfig {
  bufferSize: number;
  chunkSize: number;
  maxRetries: number;
  retryDelay: number;
  autoReconnect: boolean;
  showProgress: boolean;
  showStats: boolean;
  showTimestamps: boolean;
}

// Stream Props Schema
export const StreamPropsSchema = z.object({
  variant: StreamVariantSchema.default('default'),
  state: StreamStateSchema.default('idle'),
  chunks: z.array(z.object({
    id: z.string(),
    type: ChunkTypeSchema,
    content: z.string(),
    timestamp: z.number(),
    metadata: z.record(z.any()).optional()
  })).default([]),
  stats: z.object({
    totalChunks: z.number().default(0),
    totalBytes: z.number().default(0),
    chunksPerSecond: z.number().default(0),
    bytesPerSecond: z.number().default(0),
    averageChunkSize: z.number().default(0),
    startTime: z.number().default(0),
    endTime: z.number().optional(),
    duration: z.number().optional()
  }).optional(),
  progress: z.object({
    current: z.number().default(0),
    total: z.number().optional(),
    percentage: z.number().optional(),
    estimatedTimeRemaining: z.number().optional(),
    speed: z.number().optional()
  }).optional(),
  config: z.object({
    bufferSize: z.number().default(1024),
    chunkSize: z.number().default(512),
    maxRetries: z.number().default(3),
    retryDelay: z.number().default(1000),
    autoReconnect: z.boolean().default(true),
    showProgress: z.boolean().default(true),
    showStats: z.boolean().default(false),
    showTimestamps: z.boolean().default(false)
  }).optional(),
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
    border: z.string().default('#333333')
  }).optional(),
  onChunk: z.function().optional(),
  onStateChange: z.function().optional(),
  onProgress: z.function().optional(),
  onStats: z.function().optional(),
  onError: z.function().optional(),
  onComplete: z.function().optional()
});

export type StreamProps = z.infer<typeof StreamPropsSchema>;

// Stream Events
export interface StreamEvents {
  chunk: (chunk: StreamChunk) => void;
  stateChange: (state: StreamState) => void;
  progress: (progress: StreamProgress) => void;
  stats: (stats: StreamStats) => void;
  error: (error: Error) => void;
  complete: (stats: StreamStats) => void;
}

// Stream Methods
export interface StreamMethods {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  clear: () => void;
  addChunk: (chunk: Omit<StreamChunk, 'id' | 'timestamp'>) => void;
  getStats: () => StreamStats;
  getProgress: () => StreamProgress;
  isActive: () => boolean;
  isPaused: () => boolean;
  isCompleted: () => boolean;
  hasError: () => boolean;
}