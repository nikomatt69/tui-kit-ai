import blessed from 'blessed';
import { StreamProps, StreamChunk, StreamState, StreamStats, StreamProgress, StreamEvents, StreamMethods } from './Stream.types';

export class Stream implements StreamMethods {
  private screen: blessed.Widgets.Screen;
  private container: blessed.Widgets.BoxElement;
  private header: blessed.Widgets.BoxElement;
  private progressBar: blessed.Widgets.ProgressBarElement | null = null;
  private content: blessed.Widgets.Log;
  private stats: blessed.Widgets.BoxElement | null = null;
  private footer: blessed.Widgets.BoxElement;
  
  private props: StreamProps;
  private events: StreamEvents;
  private statsData: StreamStats;
  private progress: StreamProgress;
  private isActive: boolean = false;
  private isPaused: boolean = false;
  private retryCount: number = 0;
  private lastChunkTime: number = 0;
  private chunkBuffer: StreamChunk[] = [];
  private interval: NodeJS.Timeout | null = null;

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

    this.statsData = {
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
    this.createScreen();
    this.createContainer();
    this.createHeader();
    this.createProgressBar();
    this.createContent();
    this.createStats();
    this.createFooter();
    this.setupEventHandlers();
  }

  private createScreen(): void {
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Stream Component',
      fullUnicode: true
    });
  }

  private createContainer(): void {
    this.container = blessed.box({
      parent: this.screen,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: this.getThemeColor('border')
        }
      }
    });
  }

  private createHeader(): void {
    this.header = blessed.box({
      parent: this.container,
      top: 0,
      left: 0,
      width: '100%',
      height: 3,
      content: `Stream ${this.props.variant} - ${this.props.state}`,
      tags: true,
      style: {
        bg: 'blue',
        fg: 'white'
      }
    });
  }

  private createProgressBar(): void {
    if (!this.props.config?.showProgress) return;
    
    this.progressBar = blessed.progressbar({
      parent: this.container,
      top: 3,
      left: 0,
      width: '100%',
      height: 1,
      border: {
        type: 'line'
      },
      style: {
        bar: {
          bg: this.getThemeColor('success')
        },
        border: {
          fg: this.getThemeColor('border')
        }
      },
      filled: 0
    });
  }

  private createContent(): void {
    this.content = blessed.log({
      parent: this.container,
      top: this.props.config?.showProgress ? 4 : 3,
      left: 0,
      width: '100%',
      height: this.props.config?.showStats ? '70%' : '80%',
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: this.getThemeColor('border')
        }
      },
      scrollable: true,
      alwaysScroll: true,
      mouse: true,
      keys: true,
      vi: true
    });
  }

  private createStats(): void {
    if (!this.props.config?.showStats) return;
    
    this.stats = blessed.box({
      parent: this.container,
      top: this.props.config?.showProgress ? '75%' : '85%',
      left: 0,
      width: '100%',
      height: 5,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: this.getThemeColor('border')
        }
      }
    });
  }

  private createFooter(): void {
    this.footer = blessed.box({
      parent: this.container,
      bottom: 0,
      left: 0,
      width: '100%',
      height: 1,
      content: 'Press q to quit, SPACE to pause/resume, r to reset, s to start',
      style: {
        bg: 'black',
        fg: 'white'
      }
    });
  }

  private setupEventHandlers(): void {
    this.screen.key(['q', 'C-c'], () => {
      this.stop();
      process.exit(0);
    });
    
    this.screen.key(['space'], () => {
      if (this.isActive) {
        if (this.isPaused) {
          this.resume();
        } else {
          this.pause();
        }
      }
    });
    
    this.screen.key(['r'], () => {
      this.clear();
    });
    
    this.screen.key(['s'], () => {
      if (!this.isActive) {
        this.start();
      }
    });
  }

  private getThemeColor(color: keyof StreamProps['theme']): string {
    const colorMap = {
      primary: 'green',
      secondary: 'blue',
      success: 'green',
      warning: 'yellow',
      error: 'red',
      background: 'black',
      foreground: 'white',
      border: 'white'
    };
    return colorMap[color] || 'white';
  }

  private updateHeader(): void {
    const stateColor = this.getStateColor(this.props.state);
    this.header.setContent(
      `{white-fg}Stream {cyan-fg}${this.props.variant} {white-fg}- {${stateColor}-fg}${this.props.state}`
    );
  }

  private getStateColor(state: StreamState): string {
    const colors = {
      idle: 'white',
      connecting: 'yellow',
      streaming: 'green',
      paused: 'yellow',
      completed: 'green',
      error: 'red',
      focused: 'cyan'
    };
    return colors[state] || 'white';
  }

  private updateContent(): void {
    const recentChunks = this.props.chunks.slice(-20); // Show last 20 chunks
    const content = recentChunks.map(chunk => {
      const timestamp = this.props.config?.showTimestamps ? 
        new Date(chunk.timestamp).toLocaleTimeString() : '';
      const typeColor = this.getChunkTypeColor(chunk.type);
      const timeStr = timestamp ? `[${timestamp}] ` : '';
      return `{${typeColor}-fg}${timeStr}{white-fg}${chunk.content}`;
    }).join('\n');
    
    this.content.setContent(content);
    this.content.setScrollPerc(100);
  }

  private getChunkTypeColor(type: string): string {
    const colors = {
      text: 'white',
      code: 'blue',
      data: 'green',
      error: 'red',
      warning: 'yellow',
      info: 'cyan'
    };
    return colors[type] || 'white';
  }

  private updateStats(): void {
    const now = Date.now();
    const duration = now - this.statsData.startTime;
    
    this.statsData.totalChunks = this.props.chunks.length;
    this.statsData.totalBytes = this.props.chunks.reduce((sum, chunk) => sum + chunk.content.length, 0);
    this.statsData.chunksPerSecond = duration > 0 ? (this.statsData.totalChunks / duration) * 1000 : 0;
    this.statsData.bytesPerSecond = duration > 0 ? (this.statsData.totalBytes / duration) * 1000 : 0;
    this.statsData.averageChunkSize = this.statsData.totalChunks > 0 ? this.statsData.totalBytes / this.statsData.totalChunks : 0;
    
    if (this.stats) {
      this.stats.setContent(
        `{green-fg}Chunks: {white-fg}${this.statsData.totalChunks} | ` +
        `{blue-fg}Bytes: {white-fg}${this.formatBytes(this.statsData.totalBytes)} | ` +
        `{yellow-fg}Speed: {white-fg}${this.statsData.chunksPerSecond.toFixed(1)} chunks/s | ` +
        `{cyan-fg}${this.formatBytes(this.statsData.bytesPerSecond)}/s`
      );
    }
    
    this.events.stats(this.statsData);
  }

  private updateProgress(): void {
    if (this.progress.total) {
      this.progress.percentage = (this.progress.current / this.progress.total) * 100;
    }
    
    if (this.progressBar) {
      this.progressBar.setProgress(this.progress.percentage);
    }
    
    this.events.progress(this.progress);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private setState(newState: StreamState): void {
    if (this.props.state !== newState) {
      this.props.state = newState;
      this.events.stateChange(newState);
      this.updateHeader();
    }
  }

  // Public Methods
  public start(): void {
    this.isActive = true;
    this.isPaused = false;
    this.retryCount = 0;
    this.statsData.startTime = Date.now();
    this.setState('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      if (this.isActive) {
        this.setState('streaming');
        this.startMockStreaming();
      }
    }, 500);
  }

  private startMockStreaming(): void {
    this.interval = setInterval(() => {
      if (this.isActive && !this.isPaused) {
        this.addMockChunk();
      }
    }, 1000);
  }

  private addMockChunk(): void {
    const types = ['text', 'code', 'data'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const chunks = {
      text: [
        'Processing user request...',
        'Analyzing data patterns...',
        'Generating response...',
        'Validating results...',
        'Finalizing output...'
      ],
      code: [
        'function processData(data) { return data.map(x => x * 2); }',
        'const result = await api.call(endpoint, params);',
        'if (condition) { return success; } else { return error; }',
        'for (let i = 0; i < items.length; i++) { process(items[i]); }'
      ],
      data: [
        '{"status": "processing", "progress": 45}',
        '{"items": [1, 2, 3], "total": 3}',
        '{"error": null, "result": "success"}',
        `{"timestamp": "${new Date().toISOString()}"}`
      ]
    };
    
    const content = chunks[type][Math.floor(Math.random() * chunks[type].length)];
    
    this.addChunk({
      type,
      content,
      metadata: { source: 'mock', timestamp: Date.now() }
    });
    
    // Update progress
    this.progress.current = Math.min(this.progress.current + 5, this.progress.total || 100);
    this.updateProgress();
    
    // Check if completed
    if (this.progress.current >= (this.progress.total || 100)) {
      this.stop();
    }
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
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.setState('completed');
    this.events.complete(this.statsData);
  }

  public clear(): void {
    this.props.chunks = [];
    this.statsData = {
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
    this.setState('idle');
    this.updateContent();
    this.updateStats();
    this.updateProgress();
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
    this.updateContent();
    this.events.chunk(newChunk);
  }

  private generateId(): string {
    return `chunk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public getStats(): StreamStats {
    return { ...this.statsData };
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

  public updateProps(newProps: Partial<StreamProps>): void {
    this.props = { ...this.props, ...newProps };
    this.updateHeader();
    this.updateContent();
    this.updateStats();
  }

  public render(): void {
    this.screen.render();
  }

  public destroy(): void {
    this.stop();
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}