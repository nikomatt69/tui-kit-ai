import { ImageAIProps, ImageGenerationRequest, ImageAnalysisRequest, GeneratedImage, AnalysisResult, ImageAIEvents, ImageAIMethods, GenerationModel, AnalysisModel, ImageSize, ImageQuality, ImageStyle, AnalysisTask } from './ImageAI.types';
import { generateImageAIStyles, getImageAIVariantClass, getImageAIStateClass, getGenerationModelClass, getAnalysisModelClass } from './ImageAI.styles';

export class ImageAI implements ImageAIMethods {
  private props: ImageAIProps;
  private element: HTMLElement | null = null;
  private events: ImageAIEvents;
  private currentPrompt: string = '';
  private currentModel: GenerationModel;
  private currentAnalysisModel: AnalysisModel;
  private selectedImage: GeneratedImage | null = null;
  private generationHistory: string[] = [];

  constructor(props: Partial<ImageAIProps> = {}) {
    this.props = {
      variant: 'default',
      state: 'default',
      defaultModel: 'dall-e-3',
      defaultAnalysisModel: 'gpt-4-vision',
      generatedImages: [],
      analysisResults: [],
      showPromptEditor: true,
      showGallery: true,
      showAnalysis: true,
      showHistory: true,
      showSettings: false,
      showMetadata: false,
      maxImages: 50,
      maxHistoryItems: 100,
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
        border: '#333333',
        accent: '#ff6b6b',
        info: '#4ecdc4'
      },
      ...props
    };

    this.events = {
      imageGenerate: props.onImageGenerate || (() => {}),
      imageAnalyze: props.onImageAnalyze || (() => {}),
      imageEdit: props.onImageEdit || (() => {}),
      imageSelect: props.onImageSelect || (() => {}),
      promptChange: props.onPromptChange || (() => {}),
      modelChange: props.onModelChange || (() => {}),
      settingsChange: props.onSettingsChange || (() => {}),
      export: () => {},
      refresh: () => {}
    };

    this.currentModel = this.props.defaultModel;
    this.currentAnalysisModel = this.props.defaultAnalysisModel;

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
    this.element.className = `imageai-container ${getImageAIVariantClass(this.props.variant)} ${getImageAIStateClass(this.props.state)}`;
    this.element.setAttribute('data-imageai-id', this.generateId());
  }

  private attachEventListeners(): void {
    if (!this.element) return;

    // Focus events
    this.element.addEventListener('focus', () => {
      this.setState('focused');
    });

    this.element.addEventListener('blur', () => {
      if (this.props.state === 'focused') {
        this.setState('default');
      }
    });

    // Click events
    this.element.addEventListener('click', (event) => {
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
    
    if (target.classList.contains('imageai-action')) {
      const actionId = target.getAttribute('data-action-id');
      if (actionId) {
        this.handleAction(actionId);
      }
    } else if (target.classList.contains('imageai-image')) {
      const imageId = target.getAttribute('data-image-id');
      if (imageId) {
        this.selectImage(imageId);
      }
    } else if (target.classList.contains('imageai-prompt-button')) {
      this.generateImage();
    } else if (target.classList.contains('imageai-analyze-button')) {
      this.analyzeImage();
    } else if (target.classList.contains('imageai-history-item')) {
      const prompt = target.getAttribute('data-prompt');
      if (prompt) {
        this.setPrompt(prompt);
      }
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        if (event.target?.classList.contains('imageai-prompt-input')) {
          event.preventDefault();
          this.generateImage();
        }
        break;
      case 'g':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.generateImage();
        }
        break;
      case 'a':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.analyzeImage();
        }
        break;
      case 'Escape':
        this.clearSelection();
        break;
    }
  }

  private handleAction(actionId: string): void {
    switch (actionId) {
      case 'refresh':
        this.refreshStats();
        break;
      case 'export':
        this.exportImages('json');
        break;
      case 'clear-history':
        this.clearHistory();
        break;
      case 'toggle-settings':
        this.props.showSettings = !this.props.showSettings;
        this.render();
        break;
      case 'toggle-analysis':
        this.props.showAnalysis = !this.props.showAnalysis;
        this.render();
        break;
      case 'toggle-history':
        this.props.showHistory = !this.props.showHistory;
        this.render();
        break;
    }
  }

  private selectImage(imageId: string): void {
    const image = this.props.generatedImages.find(img => img.id === imageId);
    if (image) {
      this.selectedImage = image;
      this.events.imageSelect(image);
      this.render();
    }
  }

  private clearSelection(): void {
    this.selectedImage = null;
    this.render();
  }

  private generateId(): string {
    return `imageai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

    const styles = generateImageAIStyles(styleConfig);
    
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

    const { variant, state, showPromptEditor, showGallery, showAnalysis, showHistory, showSettings } = this.props;
    
    this.element.className = `imageai-container ${getImageAIVariantClass(variant)} ${getImageAIStateClass(state)}`;
    
    this.element.innerHTML = `
      <div class="imageai-header">
        <div class="imageai-title">
          <span>Image AI</span>
          <span class="imageai-status">${state}</span>
        </div>
        <div class="imageai-actions">
          <button class="imageai-action" data-action-id="refresh" title="Refresh">🔄</button>
          <button class="imageai-action" data-action-id="export" title="Export">📊</button>
          <button class="imageai-action" data-action-id="toggle-settings" title="Toggle Settings">⚙️</button>
          <button class="imageai-action" data-action-id="toggle-analysis" title="Toggle Analysis">🔍</button>
          <button class="imageai-action" data-action-id="toggle-history" title="Toggle History">📚</button>
        </div>
      </div>
      
      ${showPromptEditor ? this.renderPromptEditor() : ''}
      
      <div class="imageai-content">
        ${this.renderSidebar()}
        <div class="imageai-main">
          ${showGallery ? this.renderGallery() : ''}
        </div>
      </div>
      
      ${showAnalysis ? this.renderAnalysis() : ''}
      ${showSettings ? this.renderSettings() : ''}
      ${showHistory ? this.renderHistory() : ''}
      
      <div class="imageai-footer">
        <div class="imageai-footer-info">
          <div class="imageai-footer-info-item">
            <span>🎨</span>
            <span>${this.props.generatedImages.length} images</span>
          </div>
          <div class="imageai-footer-info-item">
            <span>🔍</span>
            <span>${this.props.analysisResults.length} analyses</span>
          </div>
          <div class="imageai-footer-info-item">
            <span>🤖</span>
            <span>${this.currentModel}</span>
          </div>
        </div>
        <div class="imageai-footer-actions">
          <span>Press Ctrl+G to generate, Ctrl+A to analyze</span>
        </div>
      </div>
    `;
  }

  private renderPromptEditor(): string {
    const models: GenerationModel[] = ['dall-e-2', 'dall-e-3', 'midjourney', 'stable-diffusion', 'imagen'];
    const sizes: ImageSize[] = ['256x256', '512x512', '1024x1024', '1024x1792', '1792x1024'];
    const qualities: ImageQuality[] = ['standard', 'hd', 'ultra-hd'];
    const styles: ImageStyle[] = ['natural', 'vivid', 'artistic', 'photorealistic', 'cartoon', 'anime'];
    
    return `
      <div class="imageai-prompt-editor">
        <div class="imageai-prompt-editor-title">Generate Images with AI</div>
        <textarea 
          class="imageai-prompt-input" 
          placeholder="Describe the image you want to generate..."
          value="${this.currentPrompt}"
        ></textarea>
        <div class="imageai-prompt-controls">
          <select class="imageai-prompt-select" data-setting="model">
            ${models.map(model => `
              <option value="${model}" ${this.currentModel === model ? 'selected' : ''}>${model}</option>
            `).join('')}
          </select>
          <select class="imageai-prompt-select" data-setting="size">
            ${sizes.map(size => `
              <option value="${size}">${size}</option>
            `).join('')}
          </select>
          <select class="imageai-prompt-select" data-setting="quality">
            ${qualities.map(quality => `
              <option value="${quality}">${quality}</option>
            `).join('')}
          </select>
          <select class="imageai-prompt-select" data-setting="style">
            ${styles.map(style => `
              <option value="${style}">${style}</option>
            `).join('')}
          </select>
          <button class="imageai-prompt-button">🎨 Generate</button>
        </div>
      </div>
    `;
  }

  private renderSidebar(): string {
    return `
      <div class="imageai-sidebar">
        <div class="imageai-sidebar-header">
          <h3>Quick Actions</h3>
        </div>
        <div class="imageai-sidebar-actions">
          <button class="imageai-action" data-action-id="generate-random">🎲 Random Prompt</button>
          <button class="imageai-action" data-action-id="analyze-selected">🔍 Analyze Selected</button>
          <button class="imageai-action" data-action-id="clear-history">🗑️ Clear History</button>
        </div>
      </div>
    `;
  }

  private renderGallery(): string {
    if (this.props.generatedImages.length === 0) {
      return '<div class="imageai-empty">No images generated yet. Enter a prompt to create your first image!</div>';
    }
    
    return `
      <div class="imageai-gallery">
        ${this.props.generatedImages.map(image => `
          <div class="imageai-image ${this.selectedImage?.id === image.id ? 'selected' : ''}" data-image-id="${image.id}">
            <div class="imageai-image-preview">
              <img src="${image.url}" alt="${image.prompt}" />
            </div>
            <div class="imageai-image-info">
              <div class="imageai-image-prompt">${image.prompt}</div>
              <div class="imageai-image-meta">
                <span class="imageai-image-model ${getGenerationModelClass(image.model)}">${image.model}</span>
                <span class="imageai-image-date">${this.formatDate(image.timestamp)}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderAnalysis(): string {
    if (this.props.analysisResults.length === 0) {
      return '';
    }
    
    return `
      <div class="imageai-analysis">
        <div class="imageai-analysis-title">Analysis Results</div>
        ${this.props.analysisResults.map(result => `
          <div class="imageai-analysis-result">
            <div class="imageai-analysis-header">
              <span class="imageai-analysis-task">${result.task}</span>
              <span class="imageai-analysis-confidence">${(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <div class="imageai-analysis-text">${result.result}</div>
            ${result.objects ? `
              <div class="imageai-analysis-objects">
                ${result.objects.map(obj => `
                  <span class="imageai-analysis-object">${obj.label} (${(obj.confidence * 100).toFixed(0)}%)</span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderSettings(): string {
    if (!this.props.showSettings) return '';
    
    return `
      <div class="imageai-settings">
        <div class="imageai-settings-title">Settings</div>
        <div class="imageai-settings-grid">
          <div class="imageai-setting">
            <div class="imageai-setting-label">Default Model</div>
            <select class="imageai-setting-select">
              <option value="dall-e-2">DALL-E 2</option>
              <option value="dall-e-3">DALL-E 3</option>
              <option value="midjourney">Midjourney</option>
              <option value="stable-diffusion">Stable Diffusion</option>
            </select>
          </div>
          <div class="imageai-setting">
            <div class="imageai-setting-label">Default Size</div>
            <select class="imageai-setting-select">
              <option value="1024x1024">1024x1024</option>
              <option value="512x512">512x512</option>
              <option value="1024x1792">1024x1792</option>
            </select>
          </div>
          <div class="imageai-setting">
            <div class="imageai-setting-label">Max Images</div>
            <input type="number" class="imageai-setting-input" value="${this.props.maxImages}" min="1" max="100" />
          </div>
          <div class="imageai-setting">
            <div class="imageai-setting-label">Auto-save</div>
            <input type="checkbox" class="imageai-setting-checkbox" />
          </div>
        </div>
      </div>
    `;
  }

  private renderHistory(): string {
    if (!this.props.showHistory || this.generationHistory.length === 0) {
      return '';
    }
    
    return `
      <div class="imageai-history">
        <div class="imageai-history-title">Generation History</div>
        <div class="imageai-history-list">
          ${this.generationHistory.slice(0, 10).map(prompt => `
            <div class="imageai-history-item" data-prompt="${prompt}">
              <div class="imageai-history-prompt">${prompt}</div>
              <div class="imageai-history-meta">
                <span class="imageai-history-model">${this.currentModel}</span>
                <span class="imageai-history-date">${this.formatDate(new Date())}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  private setState(newState: string): void {
    if (this.props.state !== newState) {
      this.props.state = newState as any;
      this.updateStyles();
      this.render();
    }
  }

  private async generateImage(): Promise<void> {
    const promptInput = this.element?.querySelector('.imageai-prompt-input') as HTMLTextAreaElement;
    if (!promptInput) return;
    
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    
    this.currentPrompt = prompt;
    this.setState('loading');
    
    try {
      const request: ImageGenerationRequest = {
        prompt,
        model: this.currentModel,
        size: '1024x1024',
        quality: 'standard',
        style: 'natural',
        count: 1
      };
      
      const images = await this.generateImage(request);
      this.props.generatedImages.unshift(...images);
      
      // Keep only max images
      if (this.props.generatedImages.length > this.props.maxImages) {
        this.props.generatedImages = this.props.generatedImages.slice(0, this.props.maxImages);
      }
      
      // Add to history
      this.generationHistory.unshift(prompt);
      if (this.generationHistory.length > this.props.maxHistoryItems) {
        this.generationHistory = this.generationHistory.slice(0, this.props.maxHistoryItems);
      }
      
      this.setState('success');
      this.events.imageGenerate(request);
      this.render();
    } catch (error) {
      this.setState('error');
      console.error('Generation error:', error);
    }
  }

  private async analyzeImage(): Promise<void> {
    if (!this.selectedImage) return;
    
    this.setState('loading');
    
    try {
      const request: ImageAnalysisRequest = {
        image: this.selectedImage.url,
        model: this.currentAnalysisModel,
        task: 'describe'
      };
      
      const result = await this.analyzeImage(request);
      this.props.analysisResults.unshift(result);
      
      this.setState('success');
      this.events.imageAnalyze(request);
      this.render();
    } catch (error) {
      this.setState('error');
      console.error('Analysis error:', error);
    }
  }

  private refreshStats(): void {
    this.events.refresh();
    this.render();
  }

  // Public Methods
  public async generateImage(request: ImageGenerationRequest): Promise<GeneratedImage[]> {
    // Mock image generation
    const images: GeneratedImage[] = [];
    
    for (let i = 0; i < request.count; i++) {
      const image: GeneratedImage = {
        id: this.generateId(),
        url: `https://picsum.photos/1024/1024?random=${Date.now()}-${i}`,
        prompt: request.prompt,
        model: request.model,
        size: request.size,
        quality: request.quality,
        style: request.style,
        seed: request.seed,
        timestamp: new Date(),
        metadata: {
          generationTime: Math.random() * 5000 + 1000,
          cost: Math.random() * 0.1 + 0.02
        }
      };
      
      images.push(image);
    }
    
    return images;
  }

  public async analyzeImage(request: ImageAnalysisRequest): Promise<AnalysisResult> {
    // Mock image analysis
    const result: AnalysisResult = {
      id: this.generateId(),
      imageId: this.selectedImage?.id || '',
      model: request.model,
      task: request.task,
      result: `This is a mock analysis result for the image. The analysis shows various objects, colors, and characteristics.`,
      confidence: Math.random() * 0.3 + 0.7,
      objects: [
        {
          id: 'obj-1',
          label: 'Object 1',
          confidence: 0.95,
          bbox: { x: 100, y: 100, width: 200, height: 150 },
          category: 'object'
        },
        {
          id: 'obj-2',
          label: 'Object 2',
          confidence: 0.87,
          bbox: { x: 300, y: 200, width: 150, height: 100 },
          category: 'object'
        }
      ],
      colors: [
        { color: 'blue', percentage: 30, hex: '#0000ff', rgb: [0, 0, 255], hsl: [240, 100, 50] },
        { color: 'red', percentage: 25, hex: '#ff0000', rgb: [255, 0, 0], hsl: [0, 100, 50] },
        { color: 'green', percentage: 20, hex: '#00ff00', rgb: [0, 255, 0], hsl: [120, 100, 50] }
      ],
      timestamp: new Date(),
      metadata: {
        analysisTime: Math.random() * 3000 + 500,
        cost: Math.random() * 0.05 + 0.01
      }
    };
    
    return result;
  }

  public async editImage(imageId: string, edits: any): Promise<GeneratedImage> {
    const originalImage = this.getImageById(imageId);
    if (!originalImage) {
      throw new Error('Image not found');
    }
    
    // Mock image editing
    const editedImage: GeneratedImage = {
      ...originalImage,
      id: this.generateId(),
      url: `https://picsum.photos/1024/1024?random=${Date.now()}-edited`,
      timestamp: new Date(),
      metadata: {
        ...originalImage.metadata,
        edited: true,
        edits
      }
    };
    
    return editedImage;
  }

  public getGeneratedImages(): GeneratedImage[] {
    return [...this.props.generatedImages];
  }

  public getAnalysisResults(): AnalysisResult[] {
    return [...this.props.analysisResults];
  }

  public getImageById(id: string): GeneratedImage | null {
    return this.props.generatedImages.find(img => img.id === id) || null;
  }

  public getAnalysisById(id: string): AnalysisResult | null {
    return this.props.analysisResults.find(result => result.id === id) || null;
  }

  public deleteImage(id: string): void {
    this.props.generatedImages = this.props.generatedImages.filter(img => img.id !== id);
    if (this.selectedImage?.id === id) {
      this.selectedImage = null;
    }
    this.render();
  }

  public deleteAnalysis(id: string): void {
    this.props.analysisResults = this.props.analysisResults.filter(result => result.id !== id);
    this.render();
  }

  public clearHistory(): void {
    this.generationHistory = [];
    this.render();
  }

  public exportImages(format: 'json' | 'zip' | 'urls'): string {
    const data = this.props.generatedImages;
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'urls':
        return data.map(img => img.url).join('\n');
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  public exportAnalysis(format: 'json' | 'csv' | 'txt'): string {
    const data = this.props.analysisResults;
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertAnalysisToCSV(data);
      case 'txt':
        return this.convertAnalysisToText(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  private convertAnalysisToCSV(results: AnalysisResult[]): string {
    const headers = ['ID', 'Task', 'Result', 'Confidence', 'Model', 'Timestamp'];
    const rows = results.map(result => [
      result.id,
      result.task,
      result.result,
      result.confidence.toString(),
      result.model,
      result.timestamp.toISOString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertAnalysisToText(results: AnalysisResult[]): string {
    return results.map(result => `
Analysis ID: ${result.id}
Task: ${result.task}
Model: ${result.model}
Confidence: ${(result.confidence * 100).toFixed(1)}%
Result: ${result.result}
Timestamp: ${result.timestamp.toLocaleString()}
    `).join('\n');
  }

  public setModel(model: GenerationModel): void {
    this.currentModel = model;
    this.events.modelChange(model);
    this.render();
  }

  public getModel(): GenerationModel {
    return this.currentModel;
  }

  public setAnalysisModel(model: AnalysisModel): void {
    this.currentAnalysisModel = model;
    this.events.modelChange(model);
    this.render();
  }

  public getAnalysisModel(): AnalysisModel {
    return this.currentAnalysisModel;
  }

  public setPrompt(prompt: string): void {
    this.currentPrompt = prompt;
    this.events.promptChange(prompt);
    this.render();
  }

  public getPrompt(): string {
    return this.currentPrompt;
  }

  public getImageStats(): {
    totalGenerated: number;
    totalAnalyzed: number;
    averageGenerationTime: number;
    averageAnalysisTime: number;
    mostUsedModel: GenerationModel;
    mostUsedAnalysisModel: AnalysisModel;
  } {
    const totalGenerated = this.props.generatedImages.length;
    const totalAnalyzed = this.props.analysisResults.length;
    
    const avgGenTime = this.props.generatedImages.reduce((sum, img) => 
      sum + (img.metadata.generationTime || 0), 0) / totalGenerated || 0;
    
    const avgAnalysisTime = this.props.analysisResults.reduce((sum, result) => 
      sum + (result.metadata.analysisTime || 0), 0) / totalAnalyzed || 0;
    
    const modelCounts = this.props.generatedImages.reduce((counts, img) => {
      counts[img.model] = (counts[img.model] || 0) + 1;
      return counts;
    }, {} as Record<GenerationModel, number>);
    
    const analysisModelCounts = this.props.analysisResults.reduce((counts, result) => {
      counts[result.model] = (counts[result.model] || 0) + 1;
      return counts;
    }, {} as Record<AnalysisModel, number>);
    
    const mostUsedModel = Object.entries(modelCounts).reduce((a, b) => 
      modelCounts[a[0]] > modelCounts[b[0]] ? a : b, ['dall-e-3', 0])[0] as GenerationModel;
    
    const mostUsedAnalysisModel = Object.entries(analysisModelCounts).reduce((a, b) => 
      analysisModelCounts[a[0]] > analysisModelCounts[b[0]] ? a : b, ['gpt-4-vision', 0])[0] as AnalysisModel;
    
    return {
      totalGenerated,
      totalAnalyzed,
      averageGenerationTime: avgGenTime,
      averageAnalysisTime: avgAnalysisTime,
      mostUsedModel,
      mostUsedAnalysisModel
    };
  }

  public validatePrompt(prompt: string): boolean {
    return prompt.trim().length > 0 && prompt.trim().length <= 1000;
  }

  public getPromptSuggestions(prompt: string): string[] {
    const suggestions = [
      `${prompt}, high quality, detailed`,
      `${prompt}, artistic style, vibrant colors`,
      `${prompt}, photorealistic, professional photography`,
      `${prompt}, minimalist, clean design`,
      `${prompt}, futuristic, sci-fi style`
    ];
    
    return suggestions.slice(0, 5);
  }

  public optimizePrompt(prompt: string): string {
    // Simple prompt optimization
    let optimized = prompt.trim();
    
    // Add quality keywords if not present
    if (!optimized.toLowerCase().includes('high quality')) {
      optimized += ', high quality';
    }
    
    // Add style keywords if not present
    if (!optimized.toLowerCase().includes('detailed')) {
      optimized += ', detailed';
    }
    
    return optimized;
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

  public updateProps(newProps: Partial<ImageAIProps>): void {
    this.props = { ...this.props, ...newProps };
    this.updateStyles();
    this.render();
  }

  public getElement(): HTMLElement | null {
    return this.element;
  }

  public destroy(): void {
    this.unmount();
    this.element = null;
  }
}