import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../core/src/components/BaseComponent';
import { ImageAIProps, ImageAIVariants, ImageAISizes, ImageAIStates, ImageGenerationModel, ImageAnalysisModel, ImageStyle, ImageQuality, GeneratedImage, ImageAnalysisResult, ImageGenerationRequest, ImageAnalysisRequest } from './ImageAI.types';
import { ImageAIStyles } from './ImageAI.styles';
import { validateComponent, ValidationResult } from '../../../core/src/validation/component-validator';

export class ImageAI implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: ImageAIProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private promptEditorElement?: Widgets.BoxElement;
  private imageGalleryElement?: Widgets.BoxElement;
  private analysisResultsElement?: Widgets.BoxElement;
  private generationHistoryElement?: Widgets.BoxElement;
  private modelSelectorElement?: Widgets.BoxElement;
  private styleSelectorElement?: Widgets.BoxElement;
  private qualitySelectorElement?: Widgets.BoxElement;
  private toolbarElement?: Widgets.BoxElement;
  private generatedImages: GeneratedImage[] = [];
  private analysisResults: ImageAnalysisResult[] = [];
  private currentImage?: GeneratedImage;
  private currentAnalysis?: ImageAnalysisResult;
  private currentPrompt: string = '';
  private currentModel: ImageGenerationModel = 'dall-e-3';
  private currentStyle: ImageStyle = 'realistic';
  private currentQuality: ImageQuality = 'high';
  private currentImageIndex: number = 0;
  private isGenerating: boolean = false;
  private isAnalyzing: boolean = false;

  constructor(props: ImageAIProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('ImageAI', props);
    
    if (!this.validationResult.success) {
      console.error('❌ ImageAI validation failed:', this.validationResult.errors);
      throw new Error(`ImageAI validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ ImageAI warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.generatedImages = this.props.generatedImages || [];
    this.analysisResults = this.props.analysisResults || [];
    this.currentImage = this.props.currentImage;
    this.currentAnalysis = this.props.currentAnalysis;
    this.currentModel = this.props.defaultModel || 'dall-e-3';
    this.currentStyle = this.props.defaultStyle || 'realistic';
    this.currentQuality = this.props.defaultQuality || 'high';
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: ImageAIStyles.getStyle(this.props),
      content: '',
      align: 'left',
      valign: 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupImageAIStructure();
    this.setupEventHandlers();
    this.updateDisplay();
  }
  
  private setupImageAIStructure() {
    const { showPromptEditor, showImageGallery, showAnalysisResults, showGenerationHistory, showModelSelector, showStyleSelector, showQualitySelector } = this.props;
    let topOffset = 0;
    
    // Create header
    this.headerElement = this.el.parent?.append({
      type: 'box',
      content: '🎨 Image AI',
      style: ImageAIStyles.getHeaderStyle(this.props),
      top: topOffset,
      left: 0,
      width: '100%',
      height: 3,
    }) as Widgets.BoxElement;
    topOffset += 3;
    
    // Create toolbar
    this.toolbarElement = this.el.parent?.append({
      type: 'box',
      content: this.formatToolbar(),
      style: ImageAIStyles.getToolbarStyle(this.props),
      top: topOffset,
      left: 0,
      width: '100%',
      height: 2,
    }) as Widgets.BoxElement;
    topOffset += 2;
    
    // Create prompt editor if enabled
    if (showPromptEditor) {
      this.promptEditorElement = this.el.parent?.append({
        type: 'box',
        content: this.formatPromptEditor(),
        style: ImageAIStyles.getPromptEditorStyle(this.props),
        top: topOffset,
        left: 0,
        width: '100%',
        height: 4,
      }) as Widgets.BoxElement;
      topOffset += 4;
    }
    
    // Create selectors row
    if (showModelSelector || showStyleSelector || showQualitySelector) {
      const selectorHeight = 3;
      
      if (showModelSelector) {
        this.modelSelectorElement = this.el.parent?.append({
          type: 'box',
          content: this.formatModelSelector(),
          style: ImageAIStyles.getModelSelectorStyle(this.props),
          top: topOffset,
          left: 0,
          width: '33%',
          height: selectorHeight,
        }) as Widgets.BoxElement;
      }
      
      if (showStyleSelector) {
        this.styleSelectorElement = this.el.parent?.append({
          type: 'box',
          content: this.formatStyleSelector(),
          style: ImageAIStyles.getStyleSelectorStyle(this.props),
          top: topOffset,
          left: '33%',
          width: '33%',
          height: selectorHeight,
        }) as Widgets.BoxElement;
      }
      
      if (showQualitySelector) {
        this.qualitySelectorElement = this.el.parent?.append({
          type: 'box',
          content: this.formatQualitySelector(),
          style: ImageAIStyles.getQualitySelectorStyle(this.props),
          top: topOffset,
          left: '66%',
          width: '34%',
          height: selectorHeight,
        }) as Widgets.BoxElement;
      }
      
      topOffset += selectorHeight;
    }
    
    // Create main content area
    const contentHeight = this.calculateContentHeight();
    
    // Create image gallery if enabled
    if (showImageGallery) {
      this.imageGalleryElement = this.el.parent?.append({
        type: 'box',
        content: this.formatImageGallery(),
        style: ImageAIStyles.getImageGalleryStyle(this.props),
        top: topOffset,
        left: 0,
        width: '70%',
        height: contentHeight,
        scrollable: true,
        alwaysScroll: true,
      }) as Widgets.BoxElement;
    }
    
    // Create analysis results if enabled
    if (showAnalysisResults) {
      this.analysisResultsElement = this.el.parent?.append({
        type: 'box',
        content: this.formatAnalysisResults(),
        style: ImageAIStyles.getAnalysisResultsStyle(this.props),
        top: topOffset,
        left: '70%',
        width: '30%',
        height: contentHeight,
        scrollable: true,
        alwaysScroll: true,
      }) as Widgets.BoxElement;
    }
    
    // Create generation history if enabled
    if (showGenerationHistory) {
      this.generationHistoryElement = this.el.parent?.append({
        type: 'box',
        content: this.formatGenerationHistory(),
        style: ImageAIStyles.getGenerationHistoryStyle(this.props),
        top: '100%-3',
        left: 0,
        width: '100%',
        height: 3,
        scrollable: true,
        alwaysScroll: true,
      }) as Widgets.BoxElement;
    }
  }
  
  private calculateContentHeight(): number {
    const { showPromptEditor, showModelSelector, showStyleSelector, showQualitySelector, showGenerationHistory } = this.props;
    let height = 12; // Base content height
    
    if (showPromptEditor) height += 4;
    if (showModelSelector || showStyleSelector || showQualitySelector) height += 3;
    if (showGenerationHistory) height += 3;
    
    return Math.max(height, 8); // Minimum 8 lines
  }
  
  private setupEventHandlers() {
    // Handle keyboard events
    this.el.key(['up'], () => {
      this.navigateUp();
    });
    
    this.el.key(['down'], () => {
      this.navigateDown();
    });
    
    this.el.key(['left'], () => {
      this.previousImage();
    });
    
    this.el.key(['right'], () => {
      this.nextImage();
    });
    
    this.el.key(['enter'], () => {
      this.selectCurrentImage();
    });
    
    this.el.key(['g'], () => {
      this.generateImage();
    });
    
    this.el.key(['a'], () => {
      this.analyzeImage();
    });
    
    this.el.key(['d'], () => {
      this.downloadImage();
    });
    
    this.el.key(['delete'], () => {
      this.deleteImage();
    });
    
    this.el.key(['m'], () => {
      this.cycleModel();
    });
    
    this.el.key(['s'], () => {
      this.cycleStyle();
    });
    
    this.el.key(['q'], () => {
      this.cycleQuality();
    });
    
    this.el.key(['r'], () => {
      this.refreshGallery();
    });
    
    this.el.key(['c'], () => {
      this.clearResults();
    });
    
    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focused');
      this.props.onFocus?.();
    });
    
    this.el.on('blur', () => {
      this.setState('default');
      this.props.onBlur?.();
    });
  }
  
  private formatToolbar(): string {
    const operations = ['[G]enerate', '[A]nalyze', '[D]ownload', '[Delete]', '[M]odel', '[S]tyle', '[Q]uality', '[R]efresh', '[C]lear'];
    return `Tools: ${operations.join(' | ')}`;
  }
  
  private formatPromptEditor(): string {
    return `Prompt: ${this.currentPrompt || 'Enter image generation prompt...'}\n\nExample: "A beautiful sunset over mountains, digital art style"`;
  }
  
  private formatModelSelector(): string {
    const modelStyle = ImageAIStyles.getGenerationModelStyle(this.currentModel);
    return `Model: ${this.currentModel.toUpperCase()}`;
  }
  
  private formatStyleSelector(): string {
    const styleStyle = ImageAIStyles.getImageStyleStyle(this.currentStyle);
    return `Style: ${this.currentStyle}`;
  }
  
  private formatQualitySelector(): string {
    const qualityStyle = ImageAIStyles.getImageQualityStyle(this.currentQuality);
    return `Quality: ${this.currentQuality}`;
  }
  
  private formatImageGallery(): string {
    if (this.isGenerating) {
      return 'Generating image... Please wait.';
    }
    
    if (this.generatedImages.length === 0) {
      return 'No images generated yet.\n\nPress [G] to generate an image.';
    }
    
    return this.generatedImages
      .map((image, index) => {
        const isCurrent = index === this.currentImageIndex;
        const prefix = isCurrent ? '→ ' : '  ';
        const modelStyle = ImageAIStyles.getGenerationModelStyle(image.model);
        const styleStyle = ImageAIStyles.getImageStyleStyle(image.style);
        const qualityStyle = ImageAIStyles.getImageQualityStyle(image.quality);
        
        return `${prefix}${image.prompt.substring(0, 50)}...\n    Model: ${image.model} | Style: ${image.style} | Quality: ${image.quality}`;
      })
      .join('\n\n');
  }
  
  private formatAnalysisResults(): string {
    if (this.isAnalyzing) {
      return 'Analyzing image...\nPlease wait.';
    }
    
    if (!this.currentAnalysis) {
      return 'No analysis results.\n\nSelect an image and\npress [A] to analyze.';
    }
    
    const analysis = this.currentAnalysis;
    return `Description:\n${analysis.description.substring(0, 100)}...\n\nObjects: ${analysis.objects.length}\nText: ${analysis.text.length} items\nTags: ${analysis.tags.slice(0, 3).join(', ')}`;
  }
  
  private formatGenerationHistory(): string {
    if (this.generatedImages.length === 0) {
      return 'No generation history';
    }
    
    return this.generatedImages
      .slice(-5) // Show last 5 generations
      .map((image, index) => {
        const timestamp = new Date(image.timestamp).toLocaleTimeString();
        return `${index + 1}. ${image.prompt.substring(0, 30)}... (${timestamp})`;
      })
      .join('\n');
  }
  
  private navigateUp() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.generatedImages[this.currentImageIndex];
      this.props.onImageSelect?.(this.currentImage);
      this.updateDisplay();
    }
  }
  
  private navigateDown() {
    if (this.currentImageIndex < this.generatedImages.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.generatedImages[this.currentImageIndex];
      this.props.onImageSelect?.(this.currentImage);
      this.updateDisplay();
    }
  }
  
  private previousImage() {
    this.navigateUp();
  }
  
  private nextImage() {
    this.navigateDown();
  }
  
  private selectCurrentImage() {
    if (this.generatedImages.length === 0) return;
    
    const image = this.generatedImages[this.currentImageIndex];
    this.currentImage = image;
    this.props.onImageSelect?.(image);
    this.updateDisplay();
  }
  
  private generateImage() {
    if (!this.currentPrompt.trim()) {
      this.currentPrompt = 'A beautiful landscape with mountains and a lake, digital art style';
    }
    
    this.isGenerating = true;
    this.setState('loading');
    this.updateDisplay();
    
    // Simulate image generation
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: this.currentPrompt,
        model: this.currentModel,
        url: `https://example.com/generated-${Date.now()}.png`,
        data: 'base64-encoded-image-data',
        format: 'png',
        width: 1024,
        height: 1024,
        quality: this.currentQuality,
        style: this.currentStyle,
        timestamp: Date.now(),
        metadata: {
          seed: Math.floor(Math.random() * 1000000),
          steps: 50,
          guidance: 7.5,
          negativePrompt: 'blurry, low quality',
        },
      };
      
      this.generatedImages.push(newImage);
      this.currentImageIndex = this.generatedImages.length - 1;
      this.currentImage = newImage;
      
      this.isGenerating = false;
      this.setState('success');
      
      const request: ImageGenerationRequest = {
        prompt: this.currentPrompt,
        model: this.currentModel,
        size: '1024x1024',
        quality: this.currentQuality,
        style: this.currentStyle,
        count: 1,
        format: 'png',
        negativePrompt: 'blurry, low quality',
        seed: newImage.metadata.seed,
        steps: 50,
        guidance: 7.5,
      };
      
      this.props.onImageGenerate?.(request);
      this.updateDisplay();
    }, 3000);
  }
  
  private analyzeImage() {
    if (!this.currentImage) return;
    
    this.isAnalyzing = true;
    this.setState('loading');
    this.updateDisplay();
    
    // Simulate image analysis
    setTimeout(() => {
      this.currentAnalysis = {
        id: Date.now().toString(),
        imageId: this.currentImage!.id,
        model: 'gpt-4-vision',
        description: 'A beautiful landscape featuring majestic mountains in the background with a serene lake in the foreground. The scene is rendered in a digital art style with vibrant colors and detailed textures.',
        objects: [
          {
            name: 'mountain',
            confidence: 0.95,
            bbox: { x: 100, y: 50, width: 300, height: 200 },
            category: 'landscape',
            attributes: ['snow-capped', 'majestic'],
          },
          {
            name: 'lake',
            confidence: 0.92,
            bbox: { x: 200, y: 400, width: 200, height: 150 },
            category: 'water',
            attributes: ['serene', 'reflective'],
          },
        ],
        text: [],
        colors: [
          { color: '#4A90E2', percentage: 25, name: 'blue' },
          { color: '#7ED321', percentage: 20, name: 'green' },
          { color: '#F5A623', percentage: 15, name: 'orange' },
        ],
        emotions: [
          { emotion: 'peaceful', confidence: 0.88, intensity: 0.7 },
          { emotion: 'awe', confidence: 0.82, intensity: 0.6 },
        ],
        tags: ['landscape', 'mountains', 'lake', 'nature', 'digital art', 'beautiful', 'serene'],
        confidence: 0.89,
        timestamp: Date.now(),
        metadata: {},
      };
      
      this.analysisResults.push(this.currentAnalysis);
      
      this.isAnalyzing = false;
      this.setState('success');
      
      const request: ImageAnalysisRequest = {
        imageId: this.currentImage!.id,
        model: 'gpt-4-vision',
        tasks: ['description', 'objects', 'colors', 'emotions', 'tags'],
      };
      
      this.props.onImageAnalyze?.(request);
      this.updateDisplay();
    }, 2000);
  }
  
  private downloadImage() {
    if (!this.currentImage) return;
    
    this.props.onImageDownload?.(this.currentImage);
    this.updateDisplay();
  }
  
  private deleteImage() {
    if (!this.currentImage) return;
    
    const imageId = this.currentImage.id;
    this.generatedImages = this.generatedImages.filter(img => img.id !== imageId);
    
    if (this.currentImageIndex >= this.generatedImages.length) {
      this.currentImageIndex = Math.max(0, this.generatedImages.length - 1);
    }
    
    this.currentImage = this.generatedImages[this.currentImageIndex];
    this.currentAnalysis = undefined;
    
    this.props.onImageDelete?.(imageId);
    this.updateDisplay();
  }
  
  private cycleModel() {
    const models: ImageGenerationModel[] = ['dall-e-2', 'dall-e-3', 'midjourney', 'stable-diffusion', 'imagen'];
    const currentIndex = models.indexOf(this.currentModel);
    this.currentModel = models[(currentIndex + 1) % models.length];
    
    this.props.onModelChange?.(this.currentModel);
    this.updateDisplay();
  }
  
  private cycleStyle() {
    const styles: ImageStyle[] = ['realistic', 'artistic', 'cartoon', 'anime', 'photographic', 'painting', 'sketch', 'digital-art'];
    const currentIndex = styles.indexOf(this.currentStyle);
    this.currentStyle = styles[(currentIndex + 1) % styles.length];
    
    this.props.onStyleChange?.(this.currentStyle);
    this.updateDisplay();
  }
  
  private cycleQuality() {
    const qualities: ImageQuality[] = ['low', 'medium', 'high', 'ultra'];
    const currentIndex = qualities.indexOf(this.currentQuality);
    this.currentQuality = qualities[(currentIndex + 1) % qualities.length];
    
    this.props.onQualityChange?.(this.currentQuality);
    this.updateDisplay();
  }
  
  private refreshGallery() {
    this.updateDisplay();
  }
  
  private clearResults() {
    this.generatedImages = [];
    this.analysisResults = [];
    this.currentImage = undefined;
    this.currentAnalysis = undefined;
    this.currentImageIndex = 0;
    this.updateDisplay();
  }
  
  private updateDisplay() {
    if (this.promptEditorElement) {
      this.promptEditorElement.setContent(this.formatPromptEditor());
    }
    
    if (this.imageGalleryElement) {
      this.imageGalleryElement.setContent(this.formatImageGallery());
    }
    
    if (this.analysisResultsElement) {
      this.analysisResultsElement.setContent(this.formatAnalysisResults());
    }
    
    if (this.generationHistoryElement) {
      this.generationHistoryElement.setContent(this.formatGenerationHistory());
    }
    
    if (this.modelSelectorElement) {
      this.modelSelectorElement.setContent(this.formatModelSelector());
    }
    
    if (this.styleSelectorElement) {
      this.styleSelectorElement.setContent(this.formatStyleSelector());
    }
    
    if (this.qualitySelectorElement) {
      this.qualitySelectorElement.setContent(this.formatQualitySelector());
    }
    
    if (this.toolbarElement) {
      this.toolbarElement.setContent(this.formatToolbar());
    }
    
    this.render();
  }
  
  private render() {
    this.el.screen?.render();
  }
  
  // Public methods
  setPrompt(prompt: string) {
    this.currentPrompt = prompt;
    this.props.onPromptChange?.(prompt);
    this.updateDisplay();
  }
  
  setModel(model: ImageGenerationModel) {
    this.currentModel = model;
    this.props.onModelChange?.(model);
    this.updateDisplay();
  }
  
  setStyle(style: ImageStyle) {
    this.currentStyle = style;
    this.props.onStyleChange?.(style);
    this.updateDisplay();
  }
  
  setQuality(quality: ImageQuality) {
    this.currentQuality = quality;
    this.props.onQualityChange?.(quality);
    this.updateDisplay();
  }
  
  addGeneratedImage(image: GeneratedImage) {
    this.generatedImages.push(image);
    this.currentImageIndex = this.generatedImages.length - 1;
    this.currentImage = image;
    this.updateDisplay();
  }
  
  addAnalysisResult(result: ImageAnalysisResult) {
    this.analysisResults.push(result);
    this.currentAnalysis = result;
    this.updateDisplay();
  }
  
  setCurrentImage(image: GeneratedImage) {
    this.currentImage = image;
    this.currentImageIndex = this.generatedImages.findIndex(img => img.id === image.id);
    this.props.onImageSelect?.(image);
    this.updateDisplay();
  }
  
  // Implement required methods by delegating to base component
  setVariant = (variant: ImageAIVariants) => {
    this.props.variant = variant;
    this.el.style = ImageAIStyles.getStyle(this.props);
    this.render();
  };
  
  setSize = (size: ImageAISizes) => {
    this.props.size = size;
    this.el.style = ImageAIStyles.getStyle(this.props);
    this.render();
  };
  
  setState = (state: ImageAIStates) => {
    this.props.state = state;
    this.el.style = ImageAIStyles.getStyle(this.props);
    this.render();
  };
  
  getConfig = () => ({
    variant: this.props.variant || 'default',
    size: this.props.size || 'md',
    state: this.props.state || 'default',
    currentModel: this.currentModel,
    currentStyle: this.currentStyle,
    currentQuality: this.currentQuality,
    generatedImagesCount: this.generatedImages.length,
    analysisResultsCount: this.analysisResults.length,
    currentImage: this.currentImage,
    currentAnalysis: this.currentAnalysis,
  });
  
  update = (props: Partial<ImageAIProps>) => {
    this.props = { ...this.props, ...props };
    this.el.style = ImageAIStyles.getStyle(this.props);
    this.render();
  };
  
  // Static method to create image AI with specific configuration
  static create(props: ImageAIProps): ImageAI {
    return new ImageAI(props);
  }
  
  // Utility methods
  getGeneratedImages(): GeneratedImage[] {
    return [...this.generatedImages];
  }
  
  getAnalysisResults(): ImageAnalysisResult[] {
    return [...this.analysisResults];
  }
  
  getCurrentImage(): GeneratedImage | undefined {
    return this.currentImage;
  }
  
  getCurrentAnalysis(): ImageAnalysisResult | undefined {
    return this.currentAnalysis;
  }
  
  getCurrentPrompt(): string {
    return this.currentPrompt;
  }
  
  getCurrentModel(): ImageGenerationModel {
    return this.currentModel;
  }
  
  getCurrentStyle(): ImageStyle {
    return this.currentStyle;
  }
  
  getCurrentQuality(): ImageQuality {
    return this.currentQuality;
  }
  
  isGeneratingState(): boolean {
    return this.isGenerating;
  }
  
  isAnalyzingState(): boolean {
    return this.isAnalyzing;
  }
}