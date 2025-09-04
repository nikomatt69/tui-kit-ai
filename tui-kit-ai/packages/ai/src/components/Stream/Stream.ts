import { StreamProps, StreamChunk, StreamState, StreamStats, StreamProgress, StreamEvents, StreamMethods } from './Stream.types';
import { generateStreamStyles, getStreamVariantClass, getStreamStateClass, getChunkTypeClass } from './Stream.styles';

export class Stream implements StreamMethods {
  private props: StreamProps;
  private element: HTMLElement | null = null;
  private events: StreamEvents;
  private stats: StreamStats;
  private progress: StreamProgress;
  private isActive: boolean = false;
  private isPaused: boolean = false;
  private retryCount: number = 0;
  private lastChunkTime: number = 0;
  private chunkBuffer: StreamChunk[] = [];
  private animationFrame: number | null = null;

  constructor(props: Partial<StreamProps> = {}) {
    this.props = {
      variant: 'default',
      state: 'idle',
      chunks: [],
      width: 80,
      height: 20,
      theme: {
        primary: '#00ff00',
        secondary: '#0088ff',
        success: '#00ff00',
        warning: '#ffaa00',
        error: '#ff0000',
        background: '#000000',
        foreground: '#ffffff',
        border: '#333333'
      },
      config: {
        bufferSize: 1024,
        chunkSize: 512,
        maxRetries: 3,
        retryDelay: 1000,
        autoReconnect: true,
        showProgress: true,
        showStats: false,
        showTimestamps: false
      },
      ...props
    };

    this.events = {
      chunk: props.onChunk || (() => {}),
      stateChange: props.onStateChange || (() => {}),
      progress: props.onProgress || (() => {}),
      stats: props.onStats || (() => {}),
      error: props.onError || (() => {}),
      complete: props.onComplete || (() => {})
    };

    this.stats = {
      totalChunks: 0,
      totalBytes: 0,
      chunksPerSecond: 0,
      bytesPerSecond: 0,
      averageChunkSize: 0,
      startTime: 0
    };

    this.progress = {
      current: 0,
      total: 0,
      percentage: 0
    };

    this.initialize();
  }

  private initialize(): void {
    this.createElement();
    this.attachEventListeners();
    this.updateStyles();
    this.render();
  }

  private createElement(): void {
    this.element = document.createElement('div');
    this.element.className = `stream-container ${getStreamVariantClass(this.props.variant)} ${getStreamStateClass(this.props.state)}`;
    this.element.setAttribute('data-stream-id', this.generateId());
  }

  private attachEventListeners(): void {
    if (!this.element) return;

    // Focus events
    this.element.addEventListener('focus', () => {
      this.setState('focused');
    });

    this.element.addEventListener('blur', () => {
      if (this.props.state === 'focused') {
        this.setState('idle');
      }
    });

    // Click events for interaction
    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      this.handleClick(event);
    });

    // Keyboard events
    this.element.addEventListener('keydown', (event) => {
      this.handleKeydown(event);
    });

    // Make element focusable
    this.element.setAttribute('tabindex', '0');
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    if (target.classList.contains('stream-chunk')) {
      this.handleChunkClick(target);
    } else if (target.classList.contains('stream-progress-bar')) {
      this.handleProgressClick(event);
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case ' ':
        event.preventDefault();
        this.togglePause();
        break;
      case 'Escape':
        this.stop();
        break;
      case 'r':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.start();
        }
        break;
    }
  }

  private handleChunkClick(chunkElement: HTMLElement): void {
    const chunkId = chunkElement.getAttribute('data-chunk-id');
    if (chunkId) {
      const chunk = this.props.chunks.find(c => c.id === chunkId);
      if (chunk) {
        this.events.chunk(chunk);
      }
    }
  }

  private handleProgressClick(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    if (this.progress.total) {
      this.progress.current = Math.round((percentage / 100) * this.progress.total);
      this.progress.percentage = percentage;
      this.events.progress(this.progress);
      this.render();
    }
  }

  private generateId(): string {
    return `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateStyles(): void {
    if (!this.element) return;

    const styleConfig = {
      variant: this.props.variant,
      state: this.props.state,
      width: this.props.width,
      height: this.props.height,
      theme: this.props.theme
    };

    const styles = generateStreamStyles(styleConfig);
    
    // Remove existing styles
    const existingStyle = this.element.querySelector('style');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new styles
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    this.element.appendChild(styleElement);
  }

  private render(): void {
    if (!this.element) return;

    const { variant, state, chunks, config, showProgress, showStats, showTimestamps } = this.props;
    
    this.element.className = `stream-container ${getStreamVariantClass(variant)} ${getStreamStateClass(state)}`;
    
    this.element.innerHTML = `
      <div class="stream-header">
        <div class="stream-title">Stream ${variant}</div>
        <div class="stream-status">${state}</div>
      </div>
      
      ${showProgress ? this.renderProgress() : ''}
      
      <div class="stream-content">
        ${this.renderChunks()}
      </div>
      
      ${showStats ? this.renderStats() : ''}
      
      <div class="stream-footer">
        ${this.renderFooter()}
      </div>
    `;
  }

  private renderProgress(): string {
    const { current, total, percentage } = this.progress;
    const progressWidth = total ? (current / total) * 100 : 0;
    
    return `
      <div class="stream-progress">
        <div class="stream-progress-bar" style="width: ${progressWidth}%"></div>
      </div>
      <div class="stream-progress-info">
        ${current}${total ? ` / ${total}` : ''} ${percentage ? `(${percentage.toFixed(1)}%)` : ''}
      </div>
    `;
  }

  private renderChunks(): string {
    return this.props.chunks.map(chunk => {
      const timestamp = this.props.config?.showTimestamps ? 
        new Date(chunk.timestamp).toLocaleTimeString() : '';
      
      return `
        <div class="stream-chunk ${getChunkTypeClass(chunk.type)}" data-chunk-id="${chunk.id}">
          <div class="stream-chunk-content">
            <span class="stream-chunk-${chunk.type}">${this.escapeHtml(chunk.content)}</span>
            ${chunk.metadata ? `<div class="stream-chunk-metadata">${JSON.stringify(chunk.metadata)}</div>` : ''}
          </div>
          ${timestamp ? `<div class="stream-chunk-timestamp">${timestamp}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  private renderStats(): string {
    const { totalChunks, totalBytes, chunksPerSecond, bytesPerSecond, averageChunkSize } = this.stats;
    
    return `
      <div class="stream-stats">
        <div class="stream-stat">
          <div class="stream-stat-value">${totalChunks}</div>
          <div class="stream-stat-label">Chunks</div>
        </div>
        <div class="stream-stat">
          <div class="stream-stat-value">${this.formatBytes(totalBytes)}</div>
          <div class="stream-stat-label">Bytes</div>
        </div>
        <div class="stream-stat">
          <div class="stream-stat-value">${chunksPerSecond.toFixed(1)}</div>
          <div class="stream-stat-label">Chunks/s</div>
        </div>
        <div class="stream-stat">
          <div class="stream-stat-value">${this.formatBytes(bytesPerSecond)}/s</div>
          <div class="stream-stat-label">Speed</div>
        </div>
        <div class="stream-stat">
          <div class="stream-stat-value">${this.formatBytes(averageChunkSize)}</div>
          <div class="stream-stat-label">Avg Size</div>
        </div>
      </div>
    `;
  }

  private renderFooter(): string {
    const { state } = this.props;
    const duration = this.stats.duration ? `${(this.stats.duration / 1000).toFixed(1)}s` : '';
    
    return `
      <div class="stream-footer-content">
        ${state === 'streaming' ? 'Streaming...' : ''}
        ${state === 'paused' ? 'Paused - Press SPACE to resume' : ''}
        ${state === 'completed' ? `Completed in ${duration}` : ''}
        ${state === 'error' ? 'Error occurred - Press R to retry' : ''}
      </div>
    `;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private updateStats(): void {
    const now = Date.now();
    const duration = now - this.stats.startTime;
    
    this.stats.totalChunks = this.props.chunks.length;
    this.stats.totalBytes = this.props.chunks.reduce((sum, chunk) => sum + chunk.content.length, 0);
    this.stats.chunksPerSecond = duration > 0 ? (this.stats.totalChunks / duration) * 1000 : 0;
    this.stats.bytesPerSecond = duration > 0 ? (this.stats.totalBytes / duration) * 1000 : 0;
    this.stats.averageChunkSize = this.stats.totalChunks > 0 ? this.stats.totalBytes / this.stats.totalChunks : 0;
    this.stats.duration = duration;
    
    this.events.stats(this.stats);
  }

  private updateProgress(): void {
    if (this.progress.total) {
      this.progress.percentage = (this.progress.current / this.progress.total) * 100;
    }
    
    this.events.progress(this.progress);
  }

  private setState(newState: StreamState): void {
    if (this.props.state !== newState) {
      this.props.state = newState;
      this.events.stateChange(newState);
      this.updateStyles();
      this.render();
    }
  }

  private togglePause(): void {
    if (this.isActive) {
      if (this.isPaused) {
        this.resume();
      } else {
        this.pause();
      }
    }
  }

  // Public Methods
  public start(): void {
    this.isActive = true;
    this.isPaused = false;
    this.retryCount = 0;
    this.stats.startTime = Date.now();
    this.setState('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      if (this.isActive) {
        this.setState('streaming');
      }
    }, 500);
  }

  public pause(): void {
    if (this.isActive && !this.isPaused) {
      this.isPaused = true;
      this.setState('paused');
    }
  }

  public resume(): void {
    if (this.isActive && this.isPaused) {
      this.isPaused = false;
      this.setState('streaming');
    }
  }

  public stop(): void {
    this.isActive = false;
    this.isPaused = false;
    this.stats.endTime = Date.now();
    this.setState('completed');
    this.events.complete(this.stats);
  }

  public clear(): void {
    this.props.chunks = [];
    this.stats = {
      totalChunks: 0,
      totalBytes: 0,
      chunksPerSecond: 0,
      bytesPerSecond: 0,
      averageChunkSize: 0,
      startTime: 0
    };
    this.progress = {
      current: 0,
      total: 0,
      percentage: 0
    };
    this.render();
  }

  public addChunk(chunk: Omit<StreamChunk, 'id' | 'timestamp'>): void {
    const newChunk: StreamChunk = {
      ...chunk,
      id: this.generateId(),
      timestamp: Date.now()
    };

    this.props.chunks.push(newChunk);
    
    // Update buffer
    this.chunkBuffer.push(newChunk);
    if (this.chunkBuffer.length > (this.props.config?.bufferSize || 1024)) {
      this.chunkBuffer.shift();
    }

    this.updateStats();
    this.updateProgress();
    this.events.chunk(newChunk);
    this.render();
  }

  public getStats(): StreamStats {
    return { ...this.stats };
  }

  public getProgress(): StreamProgress {
    return { ...this.progress };
  }

  public isActive(): boolean {
    return this.isActive;
  }

  public isPaused(): boolean {
    return this.isPaused;
  }

  public isCompleted(): boolean {
    return this.props.state === 'completed';
  }

  public hasError(): boolean {
    return this.props.state === 'error';
  }

  // DOM Methods
  public mount(container: HTMLElement): void {
    if (this.element && container) {
      container.appendChild(this.element);
    }
  }

  public unmount(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  public updateProps(newProps: Partial<StreamProps>): void {
    this.props = { ...this.props, ...newProps };
    this.updateStyles();
    this.render();
  }

  public getElement(): HTMLElement | null {
    return this.element;
  }

  public destroy(): void {
    this.stop();
    this.unmount();
    this.element = null;
  }
}