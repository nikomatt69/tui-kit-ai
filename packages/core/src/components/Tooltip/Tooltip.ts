import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { TooltipProps, TooltipVariants, TooltipSizes, TooltipStates } from './Tooltip.types';
import { TooltipStyles } from './Tooltip.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Tooltip implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: TooltipProps;
  private validationResult: ValidationResult;
  private content: string = '';
  private title: string = '';
  private icon: string = '';
  private isVisible: boolean = false;
  private showTimeout: NodeJS.Timeout | null = null;
  private hideTimeout: NodeJS.Timeout | null = null;
  private targetElement: any = null;
  private position: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top';

  constructor(props: TooltipProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Tooltip', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Tooltip validation failed:', this.validationResult.errors);
      throw new Error(`Tooltip validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Tooltip warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.content = this.props.content || '';
    this.title = this.props.title || '';
    this.icon = this.props.icon || '';
    this.position = this.props.position || 'top';
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: TooltipStyles.getStyle(this.props),
      content: this.renderTooltip(),
      align: 'center',
      valign: 'middle',
      shadow: true,
      zIndex: 2000,
      hidden: true,
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
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

    // Handle key events
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
    });
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'escape':
        this.hide();
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

  private renderTooltip(): string {
    let tooltipContent = '';
    
    // Icon
    if (this.icon && this.props.showIcon) {
      tooltipContent += `${this.icon} `;
    }
    
    // Title
    if (this.title && this.props.showTitle) {
      tooltipContent += `**${this.title}**\n`;
    }
    
    // Content
    if (this.content) {
      tooltipContent += this.content;
    }
    
    return tooltipContent;
  }

  private calculatePosition(targetElement: any): { top: number | string; left: number | string } {
    if (!targetElement) {
      return { top: 1, left: 1 };
    }

    const targetCoords = targetElement.getCoords();
    const targetWidth = targetElement.width || 10;
    const targetHeight = targetElement.height || 3;
    const tooltipWidth = this.el.width || 20;
    const tooltipHeight = this.el.height || 5;

    let top: number | string;
    let left: number | string;

    switch (this.position) {
      case 'top':
        top = Math.max(0, targetCoords.yi - tooltipHeight - 1);
        left = targetCoords.xi + (targetWidth / 2) - (tooltipWidth / 2);
        break;
      
      case 'bottom':
        top = targetCoords.yi + targetHeight + 1;
        left = targetCoords.xi + (targetWidth / 2) - (tooltipWidth / 2);
        break;
      
      case 'left':
        top = targetCoords.yi + (targetHeight / 2) - (tooltipHeight / 2);
        left = Math.max(0, targetCoords.xi - tooltipWidth - 1);
        break;
      
      case 'right':
        top = targetCoords.yi + (targetHeight / 2) - (tooltipHeight / 2);
        left = targetCoords.xi + targetWidth + 1;
        break;
      
      case 'top-left':
        top = Math.max(0, targetCoords.yi - tooltipHeight - 1);
        left = targetCoords.xi;
        break;
      
      case 'top-right':
        top = Math.max(0, targetCoords.yi - tooltipHeight - 1);
        left = targetCoords.xi + targetWidth - tooltipWidth;
        break;
      
      case 'bottom-left':
        top = targetCoords.yi + targetHeight + 1;
        left = targetCoords.xi;
        break;
      
      case 'bottom-right':
        top = targetCoords.yi + targetHeight + 1;
        left = targetCoords.xi + targetWidth - tooltipWidth;
        break;
      
      default:
        top = Math.max(0, targetCoords.yi - tooltipHeight - 1);
        left = targetCoords.xi + (targetWidth / 2) - (tooltipWidth / 2);
    }

    // Ensure tooltip stays within screen bounds
    if (typeof left === 'number') {
      left = Math.max(0, Math.min(left, 80 - tooltipWidth));
    }
    
    if (typeof top === 'number') {
      top = Math.max(0, Math.min(top, 24 - tooltipHeight));
    }

    return { top, left };
  }

  private startShowTimeout() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    
    this.showTimeout = setTimeout(() => {
      this.show();
    }, this.props.showDelay || 500);
  }

  private startHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, this.props.hideDelay || 100);
  }

  // Variant system methods
  setVariant(variant: TooltipVariants) {
    this.props.variant = variant;
    this.el.style = TooltipStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: TooltipSizes) {
    this.props.size = size;
    this.el.style = TooltipStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: TooltipStates) {
    this.props.state = state;
    this.el.style = TooltipStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Tooltip-specific methods
  setContent(content: string) {
    this.content = content;
    this.el.setContent(this.renderTooltip());
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
    this.el.setContent(this.renderTooltip());
    this.el.screen.render();
  }

  setIcon(icon: string) {
    this.icon = icon;
    this.el.setContent(this.renderTooltip());
    this.el.screen.render();
  }

  setPosition(position: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') {
    this.position = position;
    this.props.position = position;
    
    if (this.targetElement && this.isVisible) {
      const coords = this.calculatePosition(this.targetElement);
      this.el.top = coords.top;
      this.el.left = coords.left;
      this.el.screen.render();
    }
  }

  setShowDelay(delay: number) {
    this.props.showDelay = delay;
  }

  setHideDelay(delay: number) {
    this.props.hideDelay = delay;
  }

  setShowIcon(showIcon: boolean) {
    this.props.showIcon = showIcon;
    this.el.setContent(this.renderTooltip());
    this.el.screen.render();
  }

  setShowTitle(showTitle: boolean) {
    this.props.showTitle = showTitle;
    this.el.setContent(this.renderTooltip());
    this.el.screen.render();
  }

  setFollowCursor(followCursor: boolean) {
    this.props.followCursor = followCursor;
  }

  // Tooltip visibility methods
  show(targetElement?: any) {
    if (targetElement) {
      this.targetElement = targetElement;
    }
    
    if (!this.targetElement) {
      return;
    }

    this.isVisible = true;
    
    // Calculate position
    const coords = this.calculatePosition(this.targetElement);
    this.el.top = coords.top;
    this.el.left = coords.left;
    
    this.el.show();
    this.el.screen.render();
    
    if (this.props.onShow) {
      this.props.onShow({
        type: 'show',
        target: this.el,
        content: this.content,
        title: this.title,
        icon: this.icon,
        position: this.position,
      });
    }
  }

  hide() {
    this.isVisible = false;
    this.el.hide();
    this.el.screen.render();
    
    // Clear timeouts
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    
    if (this.props.onHide) {
      this.props.onHide({
        type: 'hide',
        target: this.el,
        content: this.content,
        title: this.title,
        icon: this.icon,
        position: this.position,
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

  // Tooltip trigger methods
  triggerShow(targetElement: any) {
    this.targetElement = targetElement;
    this.startShowTimeout();
  }

  triggerHide() {
    this.startHideTimeout();
  }

  cancelShow() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }

  cancelHide() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  // Tooltip update methods
  updatePosition(targetElement?: any) {
    if (targetElement) {
      this.targetElement = targetElement;
    }
    
    if (this.targetElement && this.isVisible) {
      const coords = this.calculatePosition(this.targetElement);
      this.el.top = coords.top;
      this.el.left = coords.left;
      this.el.screen.render();
    }
  }

  // Tooltip animation methods
  fadeIn() {
    this.show();
    
    if (this.props.onFadeIn) {
      this.props.onFadeIn({
        type: 'fadein',
        target: this.el,
        content: this.content,
        title: this.title,
        icon: this.icon,
        position: this.position,
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
        position: this.position,
      });
    }
    
    this.hide();
  }

  slideIn(direction: 'left' | 'right' | 'up' | 'down' = 'up') {
    this.show();
    
    if (this.props.onSlideIn) {
      this.props.onSlideIn({
        type: 'slidein',
        target: this.el,
        direction,
        content: this.content,
        title: this.title,
        icon: this.icon,
        position: this.position,
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
        position: this.position,
      });
    }
    
    this.hide();
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
      position: this.position,
      targetElement: this.targetElement,
      showDelay: this.props.showDelay,
      hideDelay: this.props.hideDelay,
      showIcon: this.props.showIcon,
      showTitle: this.props.showTitle,
      followCursor: this.props.followCursor,
    };
  }

  // Get tooltip properties
  getContent(): string {
    return this.content;
  }

  getTitle(): string {
    return this.title;
  }

  getIcon(): string {
    return this.icon;
  }

  getPosition(): string {
    return this.position;
  }

  isTooltipVisible(): boolean {
    return this.isVisible;
  }

  getTargetElement(): any {
    return this.targetElement;
  }

  // Tooltip utility methods
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
  update(newProps: Partial<TooltipProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Tooltip', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Tooltip update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = TooltipStyles.getStyle(this.props);
    
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
    
    // Update position if changed
    if (newProps.position !== undefined) {
      this.setPosition(this.props.position || 'top');
    }
    
    // Update show delay if changed
    if (newProps.showDelay !== undefined) {
      this.setShowDelay(this.props.showDelay || 500);
    }
    
    // Update hide delay if changed
    if (newProps.hideDelay !== undefined) {
      this.setHideDelay(this.props.hideDelay || 100);
    }
    
    // Update show icon if changed
    if (newProps.showIcon !== undefined) {
      this.setShowIcon(this.props.showIcon || false);
    }
    
    // Update show title if changed
    if (newProps.showTitle !== undefined) {
      this.setShowTitle(this.props.showTitle || false);
    }
    
    // Update follow cursor if changed
    if (newProps.followCursor !== undefined) {
      this.setFollowCursor(this.props.followCursor || false);
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