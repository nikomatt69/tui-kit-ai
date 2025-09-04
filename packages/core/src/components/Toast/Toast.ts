import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { ToastProps, ToastVariants, ToastSizes, ToastStates } from './Toast.types';
import { ToastStyles } from './Toast.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Toast implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: ToastProps;
  private validationResult: ValidationResult;
  private content: string = '';
  private title: string = '';
  private icon: string = '';
  private isVisible: boolean = false;
  private autoHideTimeout: NodeJS.Timeout | null = null;
  private progressInterval: NodeJS.Timeout | null = null;
  private progress: number = 0;

  constructor(props: ToastProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Toast', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Toast validation failed:', this.validationResult.errors);
      throw new Error(`Toast validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Toast warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.content = this.props.content || '';
    this.title = this.props.title || '';
    this.icon = this.props.icon || '';
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: ToastStyles.getStyle(this.props),
      content: this.renderToast(),
      align: 'center',
      valign: 'middle',
      shadow: true,
      zIndex: 1000,
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
    
    // Auto-hide if enabled
    if (this.props.autoHide && this.props.duration) {
      this.startAutoHide();
    }
    
    // Start progress if enabled
    if (this.props.showProgress && this.props.duration) {
      this.startProgress();
    }
  }
  
  private setupEventHandlers() {
    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focus');
    });

    this.el.on('blur', () => {
      this.setState('default');
    });

    // Handle mouse events
    this.el.on('mouseover', () => {
      this.setState('hover');
    });

    this.el.on('mouseout', () => {
      this.setState('default');
    });

    // Handle click events
    if (this.props.clickable) {
      this.el.on('click', (event: any) => {
        this.handleClick(event);
      });
    }

    // Handle key events
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
    });
  }

  private handleClick(event: any) {
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        content: this.content,
        title: this.title,
        icon: this.icon,
      });
    }
    
    // Auto-hide on click if enabled
    if (this.props.autoHideOnClick) {
      this.hide();
    }
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'escape':
        this.hide();
        break;
      case 'enter':
      case 'space':
        this.handleClick(event);
        break;
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown({
        type: 'keydown',
        target: this.el,
        key: event.key,
        ctrl: event.ctrl,
        shift: event.shift,
        alt: event.alt,
      });
    }
  }

  private renderToast(): string {
    let toastContent = '';
    
    // Icon
    if (this.icon && this.props.showIcon) {
      toastContent += `${this.icon} `;
    }
    
    // Title
    if (this.title && this.props.showTitle) {
      toastContent += `**${this.title}**\n`;
    }
    
    // Content
    if (this.content) {
      toastContent += this.content;
    }
    
    // Progress bar
    if (this.props.showProgress && this.props.duration) {
      toastContent += '\n' + this.renderProgressBar();
    }
    
    return toastContent;
  }

  private renderProgressBar(): string {
    const width = 20;
    const filledWidth = Math.floor((this.progress / 100) * width);
    const emptyWidth = width - filledWidth;
    
    const filled = '█'.repeat(filledWidth);
    const empty = '░'.repeat(emptyWidth);
    
    return `[${filled}${empty}] ${this.progress.toFixed(0)}%`;
  }

  private startAutoHide() {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
    
    this.autoHideTimeout = setTimeout(() => {
      this.hide();
    }, this.props.duration || 5000);
  }

  private startProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    const interval = (this.props.duration || 5000) / 100;
    
    this.progressInterval = setInterval(() => {
      this.progress += 1;
      
      if (this.progress >= 100) {
        this.progress = 100;
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
          this.progressInterval = null;
        }
      }
      
      this.el.setContent(this.renderToast());
      this.el.screen.render();
    }, interval);
  }

  private stopProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  // Variant system methods
  setVariant(variant: ToastVariants) {
    this.props.variant = variant;
    this.el.style = ToastStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: ToastSizes) {
    this.props.size = size;
    this.el.style = ToastStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: ToastStates) {
    this.props.state = state;
    this.el.style = ToastStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Toast-specific methods
  setContent(content: string) {
    this.content = content;
    this.el.setContent(this.renderToast());
    this.el.screen.render();
    
    if (this.props.onContentChange) {
      this.props.onContentChange({
        type: 'contentchange',
        target: this.el,
        content: this.content,
        previousContent: '',
      });
    }
  }

  setTitle(title: string) {
    this.title = title;
    this.el.setContent(this.renderToast());
    this.el.screen.render();
  }

  setIcon(icon: string) {
    this.icon = icon;
    this.el.setContent(this.renderToast());
    this.el.screen.render();
  }

  setDuration(duration: number) {
    this.props.duration = duration;
    
    // Restart auto-hide if enabled
    if (this.props.autoHide) {
      this.startAutoHide();
    }
    
    // Restart progress if enabled
    if (this.props.showProgress) {
      this.startProgress();
    }
  }

  setAutoHide(autoHide: boolean) {
    this.props.autoHide = autoHide;
    
    if (autoHide && this.props.duration) {
      this.startAutoHide();
    } else if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
      this.autoHideTimeout = null;
    }
  }

  setShowProgress(showProgress: boolean) {
    this.props.showProgress = showProgress;
    
    if (showProgress && this.props.duration) {
      this.startProgress();
    } else {
      this.stopProgress();
    }
    
    this.el.setContent(this.renderToast());
    this.el.screen.render();
  }

  setShowIcon(showIcon: boolean) {
    this.props.showIcon = showIcon;
    this.el.setContent(this.renderToast());
    this.el.screen.render();
  }

  setShowTitle(showTitle: boolean) {
    this.props.showTitle = showTitle;
    this.el.setContent(this.renderToast());
    this.el.screen.render();
  }

  setPosition(position: 'top' | 'center' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') {
    this.props.position = position;
    
    // Update position based on new setting
    switch (position) {
      case 'top':
        this.el.top = 1;
        this.el.left = 'center';
        break;
      case 'center':
        this.el.top = 'center';
        this.el.left = 'center';
        break;
      case 'bottom':
        this.el.top = '100%-3';
        this.el.left = 'center';
        break;
      case 'top-left':
        this.el.top = 1;
        this.el.left = 1;
        break;
      case 'top-right':
        this.el.top = 1;
        this.el.right = 1;
        break;
      case 'bottom-left':
        this.el.top = '100%-3';
        this.el.left = 1;
        break;
      case 'bottom-right':
        this.el.top = '100%-3';
        this.el.right = 1;
        break;
    }
    
    this.el.screen.render();
  }

  // Toast visibility methods
  show() {
    this.isVisible = true;
    this.el.show();
    this.el.screen.render();
    
    if (this.props.onShow) {
      this.props.onShow({
        type: 'show',
        target: this.el,
        content: this.content,
        title: this.title,
        icon: this.icon,
      });
    }
    
    // Start auto-hide if enabled
    if (this.props.autoHide && this.props.duration) {
      this.startAutoHide();
    }
    
    // Start progress if enabled
    if (this.props.showProgress && this.props.duration) {
      this.startProgress();
    }
  }

  hide() {
    this.isVisible = false;
    this.el.hide();
    this.el.screen.render();
    
    // Clear timeouts
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
      this.autoHideTimeout = null;
    }
    
    this.stopProgress();
    
    if (this.props.onHide) {
      this.props.onHide({
        type: 'hide',
        target: this.el,
        content: this.content,
        title: this.title,
        icon: this.icon,
      });
    }
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  // Toast animation methods
  slideIn(direction: 'left' | 'right' | 'up' | 'down' = 'up') {
    // Simple slide animation
    this.show();
    
    if (this.props.onSlideIn) {
      this.props.onSlideIn({
        type: 'slidein',
        target: this.el,
        direction,
        content: this.content,
        title: this.title,
        icon: this.icon,
      });
    }
  }

  slideOut(direction: 'left' | 'right' | 'up' | 'down' = 'down') {
    if (this.props.onSlideOut) {
      this.props.onSlideOut({
        type: 'slideout',
        target: this.el,
        direction,
        content: this.content,
        title: this.title,
        icon: this.icon,
      });
    }
    
    this.hide();
  }

  fadeIn() {
    this.show();
    
    if (this.props.onFadeIn) {
      this.props.onFadeIn({
        type: 'fadein',
        target: this.el,
        content: this.content,
        title: this.title,
        icon: this.icon,
      });
    }
  }

  fadeOut() {
    if (this.props.onFadeOut) {
      this.props.onFadeOut({
        type: 'fadeout',
        target: this.el,
        content: this.content,
        title: this.title,
        icon: this.icon,
      });
    }
    
    this.hide();
  }

  // Toast progress methods
  setProgress(progress: number) {
    this.progress = Math.max(0, Math.min(100, progress));
    this.el.setContent(this.renderToast());
    this.el.screen.render();
    
    if (this.props.onProgressChange) {
      this.props.onProgressChange({
        type: 'progresschange',
        target: this.el,
        progress: this.progress,
      });
    }
  }

  resetProgress() {
    this.progress = 0;
    this.el.setContent(this.renderToast());
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      content: this.content,
      title: this.title,
      icon: this.icon,
      isVisible: this.isVisible,
      progress: this.progress,
      position: this.props.position,
      autoHide: this.props.autoHide,
      duration: this.props.duration,
      showProgress: this.props.showProgress,
      showIcon: this.props.showIcon,
      showTitle: this.props.showTitle,
    };
  }

  // Get toast properties
  getContent(): string {
    return this.content;
  }

  getTitle(): string {
    return this.title;
  }

  getIcon(): string {
    return this.icon;
  }

  getProgress(): number {
    return this.progress;
  }

  isToastVisible(): boolean {
    return this.isVisible;
  }

  // Toast utility methods
  hasContent(): boolean {
    return this.content.length > 0;
  }

  hasTitle(): boolean {
    return this.title.length > 0;
  }

  hasIcon(): boolean {
    return this.icon.length > 0;
  }

  // Update component with new props
  update(newProps: Partial<ToastProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Toast', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Toast update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = ToastStyles.getStyle(this.props);
    
    // Update content if changed
    if (newProps.content !== undefined) {
      this.setContent(this.props.content || '');
    }
    
    // Update title if changed
    if (newProps.title !== undefined) {
      this.setTitle(this.props.title || '');
    }
    
    // Update icon if changed
    if (newProps.icon !== undefined) {
      this.setIcon(this.props.icon || '');
    }
    
    // Update duration if changed
    if (newProps.duration !== undefined) {
      this.setDuration(this.props.duration || 5000);
    }
    
    // Update auto-hide if changed
    if (newProps.autoHide !== undefined) {
      this.setAutoHide(this.props.autoHide || false);
    }
    
    // Update show progress if changed
    if (newProps.showProgress !== undefined) {
      this.setShowProgress(this.props.showProgress || false);
    }
    
    // Update show icon if changed
    if (newProps.showIcon !== undefined) {
      this.setShowIcon(this.props.showIcon || false);
    }
    
    // Update show title if changed
    if (newProps.showTitle !== undefined) {
      this.setShowTitle(this.props.showTitle || false);
    }
    
    // Update position if changed
    if (newProps.position !== undefined) {
      this.setPosition(this.props.position || 'top');
    }
    
    this.el.screen.render();
  }

  // Focus management
  focus() {
    this.el.focus();
  }

  blur() {
    this.el.blur();
  }

  // Get validation result for debugging
  getValidationResult(): ValidationResult {
    return this.validationResult;
  }
}