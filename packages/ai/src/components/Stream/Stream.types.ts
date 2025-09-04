import { BaseProps } from '../../../core/src/components/BaseComponent';

// Stream variants
export type StreamVariants = 
  | 'default'
  | 'realtime'
  | 'buffered'
  | 'chunked'
  | 'minimal';

// Stream sizes
export type StreamSizes = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

// Stream states
export type StreamStates = 
  | 'default'
  | 'connecting'
  | 'streaming'
  | 'paused'
  | 'completed'
  | 'error'
  | 'focused';

// Stream chunk types
export type StreamChunkType = 
  | 'text'
  | 'code'
  | 'json'
  | 'markdown'
  | 'error'
  | 'progress'
  | 'metadata';

// Stream chunk interface
export interface StreamChunk {
  id: string;
  type: StreamChunkType;
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
  progress?: number;
}

// Stream statistics interface
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

// Stream props interface
export interface StreamProps extends BaseProps {
  // Stream configuration
  variant?: StreamVariants;
  size?: StreamSizes;
  state?: StreamStates;
  
  // Stream behavior
  autoStart?: boolean;
  showProgress?: boolean;
  showStats?: boolean;
  showChunkInfo?: boolean;
  bufferSize?: number;
  chunkDelay?: number;
  
  // Display options
  maxChunks?: number;
  scrollToBottom?: boolean;
  highlightSyntax?: boolean;
  showTimestamps?: boolean;
  showChunkTypes?: boolean;
  
  // Stream data
  chunks?: StreamChunk[];
  stats?: StreamStats;
  
  // Event handlers
  onChunk?: (chunk: StreamChunk) => void;
  onComplete?: (stats: StreamStats) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
  onStateChange?: (state: StreamStates) => void;
  
  // Stream methods
  start?: () => void;
  pause?: () => void;
  resume?: () => void;
  stop?: () => void;
  clear?: () => void;
  addChunk?: (chunk: StreamChunk) => void;
}

// Stream configuration interface
export interface StreamConfig {
  variant: StreamVariants;
  size: StreamSizes;
  state: StreamStates;
  autoStart: boolean;
  showProgress: boolean;
  showStats: boolean;
  showChunkInfo: boolean;
  bufferSize: number;
  chunkDelay: number;
  maxChunks: number;
  scrollToBottom: boolean;
  highlightSyntax: boolean;
  showTimestamps: boolean;
  showChunkTypes: boolean;
}

// Stream style configuration
export interface StreamStyleConfig {
  container: Record<string, any>;
  header: Record<string, any>;
  content: Record<string, any>;
  progress: Record<string, any>;
  stats: Record<string, any>;
  chunk: Record<string, any>;
  timestamp: Record<string, any>;
  chunkType: Record<string, any>;
}

// Stream events
export interface StreamChunkEvent {
  type: 'chunk';
  chunk: StreamChunk;
}

export interface StreamCompleteEvent {
  type: 'complete';
  stats: StreamStats;
}

export interface StreamErrorEvent {
  type: 'error';
  error: Error;
}

export interface StreamProgressEvent {
  type: 'progress';
  progress: number;
}

export interface StreamStateChangeEvent {
  type: 'stateChange';
  state: StreamStates;
}

export type StreamEvent = 
  | StreamChunkEvent
  | StreamCompleteEvent
  | StreamErrorEvent
  | StreamProgressEvent
  | StreamStateChangeEvent;

// Stream validation result
export interface StreamValidationResult {
  success: boolean;
  data?: StreamProps;
  errors?: Error;
  warnings?: string[];
}

// Stream factory options
export interface StreamFactoryOptions {
  defaultVariant?: StreamVariants;
  defaultSize?: StreamSizes;
  defaultState?: StreamStates;
  theme?: any;
  parent?: any;
}

// Stream group props for multiple streams
export interface StreamGroupProps extends BaseProps {
  streams: StreamProps[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showGroupStats?: boolean;
  onStreamSelect?: (streamId: string) => void;
}