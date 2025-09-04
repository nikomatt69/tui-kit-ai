import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../core/src/components/BaseComponent';
import { StreamProps, StreamVariants, StreamSizes, StreamStates, StreamChunk, StreamStats, StreamEvent } from './Stream.types';
import { StreamStyles } from './Stream.styles';
import { validateComponent, ValidationResult } from '../../../core/src/validation/component-validator';

export class Stream implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: StreamProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private contentElement?: Widgets.BoxElement;
  private progressElement?: Widgets.BoxElement;
  private statsElement?: Widgets.BoxElement;
  private chunks: StreamChunk[] = [];
  private stats: StreamStats;
  private isStreaming: boolean = false;
  private isPaused: boolean = false;
  private currentState: StreamStates = 'default';

  constructor(props: StreamProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Stream', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Stream validation failed:', this.validationResult.errors);
      throw new Error(`Stream validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Stream warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Initialize stats
    this.stats = {
      totalChunks: 0,
      totalBytes: 0,
      chunksPerSecond: 0,
      bytesPerSecond: 0,
      averageChunkSize: 0,
      startTime: Date.now(),
    };
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: StreamStyles.getStyle(this.props),
      content: '',
      align: 'left',
      valign: 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupStreamStructure();
    this.setupEventHandlers();
    
    // Auto-start if configured
    if (this.props.autoStart) {
      this.start();
    }
  }
  
  private setupStreamStructure() {
    const { showProgress, showStats, showChunkInfo } = this.props;
    
    // Create header if needed
    if (this.props.label) {
      this.headerElement = this.el.parent?.append({
        type: 'box',
        content: this.props.label,
        style: StreamStyles.getHeaderStyle(this.props),
        top: 0,
        left: 0,
        width: '100%',
        height: 3,
      }) as Widgets.BoxElement;
    }
    
    // Create content area
    this.contentElement = this.el.parent?.append({
      type: 'box',
      content: '',
      style: StreamStyles.getContentStyle(this.props),
      top: this.headerElement ? 3 : 0,
      left: 0,
      width: '100%',
      height: showProgress || showStats ? '100%-6' : '100%',
      scrollable: true,
      alwaysScroll: true,
    }) as Widgets.BoxElement;
    
    // Create progress bar if enabled
    if (showProgress) {
      this.progressElement = this.el.parent?.append({
        type: 'box',
        content: '',
        style: StreamStyles.getProgressStyle(this.props),
        top: '100%-3',
        left: 0,
        width: '100%',
        height: 1,
      }) as Widgets.BoxElement;
    }
    
    // Create stats display if enabled
    if (showStats) {
      this.statsElement = this.el.parent?.append({
        type: 'box',
        content: this.formatStats(),
        style: StreamStyles.getStatsStyle(this.props),
        top: '100%-2',
        left: 0,
        width: '100%',
        height: 2,
      }) as Widgets.BoxElement;
    }
  }
  
  private setupEventHandlers() {
    // Handle keyboard events
    this.el.key(['space'], () => {
      if (this.isStreaming) {
        this.pause();
      } else if (this.isPaused) {
        this.resume();
      } else {
        this.start();
      }
    });
    
    this.el.key(['c'], () => {
      this.clear();
    });
    
    this.el.key(['s'], () => {
      this.stop();
    });
    
    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focused');
    });
    
    this.el.on('blur', () => {
      this.setState('default');
    });
  }
  
  // Stream control methods
  start() {
    if (this.isStreaming) return;
    
    this.isStreaming = true;
    this.isPaused = false;
    this.setState('streaming');
    this.stats.startTime = Date.now();
    
    this.props.onStateChange?.('streaming');
    this.render();
  }
  
  pause() {
    if (!this.isStreaming || this.isPaused) return;
    
    this.isPaused = true;
    this.setState('paused');
    
    this.props.onStateChange?.('paused');
    this.render();
  }
  
  resume() {
    if (!this.isStreaming || !this.isPaused) return;
    
    this.isPaused = false;
    this.setState('streaming');
    
    this.props.onStateChange?.('streaming');
    this.render();
  }
  
  stop() {
    this.isStreaming = false;
    this.isPaused = false;
    this.setState('completed');
    this.stats.endTime = Date.now();
    this.stats.duration = this.stats.endTime - this.stats.startTime;
    
    this.props.onStateChange?.('completed');
    this.props.onComplete?.(this.stats);
    this.render();
  }
  
  clear() {
    this.chunks = [];
    this.stats = {
      totalChunks: 0,
      totalBytes: 0,
      chunksPerSecond: 0,
      bytesPerSecond: 0,
      averageChunkSize: 0,
      startTime: Date.now(),
    };
    
    this.updateContent();
    this.updateStats();
    this.render();
  }
  
  addChunk(chunk: StreamChunk) {
    this.chunks.push(chunk);
    this.stats.totalChunks++;
    this.stats.totalBytes += chunk.content.length;
    this.stats.averageChunkSize = this.stats.totalBytes / this.stats.totalChunks;
    
    // Calculate rates
    const now = Date.now();
    const elapsed = (now - this.stats.startTime) / 1000;
    this.stats.chunksPerSecond = this.stats.totalChunks / elapsed;
    this.stats.bytesPerSecond = this.stats.totalBytes / elapsed;
    
    // Limit chunks if maxChunks is set
    if (this.props.maxChunks && this.chunks.length > this.props.maxChunks) {
      this.chunks = this.chunks.slice(-this.props.maxChunks);
    }
    
    this.props.onChunk?.(chunk);
    this.updateContent();
    this.updateStats();
    this.updateProgress();
    this.render();
  }
  
  private updateContent() {
    if (!this.contentElement) return;
    
    let content = '';
    
    this.chunks.forEach((chunk, index) => {
      if (index > 0) content += '\n';
      
      // Add timestamp if enabled
      if (this.props.showTimestamps) {
        const timestamp = new Date(chunk.timestamp).toLocaleTimeString();
        content += `[${timestamp}] `;
      }
      
      // Add chunk type if enabled
      if (this.props.showChunkTypes) {
        content += `[${chunk.type.toUpperCase()}] `;
      }
      
      // Add chunk content
      content += chunk.content;
      
      // Add metadata if present
      if (chunk.metadata && Object.keys(chunk.metadata).length > 0) {
        content += `\n  Metadata: ${JSON.stringify(chunk.metadata)}`;
      }
    });
    
    this.contentElement.setContent(content);
    
    // Scroll to bottom if enabled
    if (this.props.scrollToBottom) {
      this.contentElement.setScrollPerc(100);
    }
  }
  
  private updateStats() {
    if (!this.statsElement) return;
    
    this.statsElement.setContent(this.formatStats());
  }
  
  private updateProgress() {
    if (!this.progressElement) return;
    
    const progress = this.stats.totalChunks > 0 ? 
      Math.min(100, (this.stats.totalChunks / (this.props.maxChunks || 100)) * 100) : 0;
    
    const progressBar = '█'.repeat(Math.floor(progress / 2)) + 
                       '░'.repeat(50 - Math.floor(progress / 2));
    
    this.progressElement.setContent(`Progress: [${progressBar}] ${progress.toFixed(1)}%`);
  }
  
  private formatStats(): string {
    const duration = this.stats.duration || (Date.now() - this.stats.startTime);
    const durationSeconds = duration / 1000;
    
    return `Chunks: ${this.stats.totalChunks} | ` +
           `Bytes: ${this.stats.totalBytes} | ` +
           `Rate: ${this.stats.chunksPerSecond.toFixed(1)} chunks/s | ` +
           `Speed: ${(this.stats.bytesPerSecond / 1024).toFixed(1)} KB/s | ` +
           `Duration: ${durationSeconds.toFixed(1)}s`;
  }
  
  // Implement required methods by delegating to base component
  setVariant = (variant: StreamVariants) => {
    this.props.variant = variant;
    this.el.style = StreamStyles.getStyle(this.props);
    this.render();
  };
  
  setSize = (size: StreamSizes) => {
    this.props.size = size;
    this.el.style = StreamStyles.getStyle(this.props);
    this.render();
  };
  
  setState = (state: StreamStates) => {
    this.currentState = state;
    this.props.state = state;
    this.el.style = StreamStyles.getStyle(this.props);
    this.render();
  };
  
  getConfig = () => ({
    variant: this.props.variant || 'default',
    size: this.props.size || 'md',
    state: this.currentState,
    chunks: this.chunks.length,
    stats: this.stats,
  });
  
  update = (props: Partial<StreamProps>) => {
    this.props = { ...this.props, ...props };
    this.el.style = StreamStyles.getStyle(this.props);
    this.render();
  };
  
  private render() {
    this.el.screen?.render();
  }
  
  // Static method to create stream with specific configuration
  static create(props: StreamProps): Stream {
    return new Stream(props);
  }
  
  // Utility methods
  getChunks(): StreamChunk[] {
    return [...this.chunks];
  }
  
  getStats(): StreamStats {
    return { ...this.stats };
  }
  
  getCurrentState(): StreamStates {
    return this.currentState;
  }
  
  isActive(): boolean {
    return this.isStreaming && !this.isPaused;
  }
}