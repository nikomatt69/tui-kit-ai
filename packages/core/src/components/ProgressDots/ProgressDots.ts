import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { ProgressDotsProps, ProgressDotsVariants, ProgressDotsSizes, ProgressDotsStates } from './ProgressDots.types';
import { ProgressDotsStyles } from './ProgressDots.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class ProgressDots implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: ProgressDotsProps;
  private validationResult: ValidationResult;
  private currentValue: number = 0;
  private minValue: number = 0;
  private maxValue: number = 100;
  private animationInterval: NodeJS.Timeout | null = null;
  private animationFrame: number = 0;

  constructor(props: ProgressDotsProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('ProgressDots', props);
    
    if (!this.validationResult.success) {
      console.error('❌ ProgressDots validation failed:', this.validationResult.errors);
      throw new Error(`ProgressDots validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ ProgressDots warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.currentValue = this.props.value || 0;
    this.minValue = this.props.minValue || 0;
    this.maxValue = this.props.maxValue || 100;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: ProgressDotsStyles.getStyle(this.props),
      content: this.renderProgressDots(),
      align: 'center',
      valign: 'middle',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
    
    // Start animation if enabled
    if (this.props.animated) {
      this.startAnimation();
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
        value: this.currentValue,
        percentage: this.getPercentage(),
      });
    }
  }

  private handleKeyDown(event: any) {
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

  private renderProgressDots(): string {
    const percentage = this.getPercentage();
    const totalDots = this.props.totalDots || 10;
    const filledDots = Math.floor((percentage / 100) * totalDots);
    const emptyDots = totalDots - filledDots;
    
    let content = '';
    
    // Progress dots prefix
    if (this.props.prefix) {
      content += `${this.props.prefix} `;
    }
    
    // Progress dots visualization
    const filledChar = this.props.filledCharacter || '●';
    const emptyChar = this.props.emptyCharacter || '○';
    const animatedChar = this.props.animatedCharacter || '◐';
    
    for (let i = 0; i < totalDots; i++) {
      if (i < filledDots) {
        content += filledChar;
      } else if (this.props.animated && i === filledDots) {
        content += animatedChar;
      } else {
        content += emptyChar;
      }
      
      // Add spacing between dots
      if (i < totalDots - 1) {
        content += this.props.dotSpacing || ' ';
      }
    }
    
    // Progress dots suffix
    if (this.props.suffix) {
      content += ` ${this.props.suffix}`;
    }
    
    // Show value if enabled
    if (this.props.showValue) {
      content += ` ${this.currentValue}`;
    }
    
    // Show percentage if enabled
    if (this.props.showPercentage) {
      content += ` (${percentage}%)`;
    }
    
    return content;
  }

  // Variant system methods
  setVariant(variant: ProgressDotsVariants) {
    this.props.variant = variant;
    this.el.style = ProgressDotsStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: ProgressDotsSizes) {
    this.props.size = size;
    this.el.style = ProgressDotsStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: ProgressDotsStates) {
    this.props.state = state;
    this.el.style = ProgressDotsStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // ProgressDots-specific methods
  setValue(value: number) {
    this.currentValue = Math.max(this.minValue, Math.min(this.maxValue, value));
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
    
    if (this.props.onChange) {
      this.props.onChange({
        type: 'change',
        target: this.el,
        value: this.currentValue,
        percentage: this.getPercentage(),
        previousValue: value,
      });
    }
  }

  setMinValue(minValue: number) {
    this.minValue = minValue;
    if (this.currentValue < this.minValue) {
      this.currentValue = this.minValue;
    }
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
  }

  setMaxValue(maxValue: number) {
    this.maxValue = maxValue;
    if (this.currentValue > this.maxValue) {
      this.currentValue = this.maxValue;
    }
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
  }

  setTotalDots(totalDots: number) {
    this.props.totalDots = totalDots;
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
  }

  setDotSpacing(spacing: string) {
    this.props.dotSpacing = spacing;
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
  }

  setFilledCharacter(char: string) {
    this.props.filledCharacter = char;
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
  }

  setEmptyCharacter(char: string) {
    this.props.emptyCharacter = char;
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
  }

  setAnimatedCharacter(char: string) {
    this.props.animatedCharacter = char;
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
  }

  setShowValue(show: boolean) {
    this.props.showValue = show;
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
  }

  setShowPercentage(show: boolean) {
    this.props.showPercentage = show;
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
  }

  setPrefix(prefix: string) {
    this.props.prefix = prefix;
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
  }

  setSuffix(suffix: string) {
    this.props.suffix = suffix;
    this.el.setContent(this.renderProgressDots());
    this.el.screen.render();
  }

  // ProgressDots value methods
  increment(amount: number = 1) {
    this.setValue(this.currentValue + amount);
  }

  decrement(amount: number = 1) {
    this.setValue(this.currentValue - amount);
  }

  reset() {
    this.setValue(this.minValue);
  }

  complete() {
    this.setValue(this.maxValue);
  }

  // Animation methods
  startAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    
    this.animationInterval = setInterval(() => {
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.el.setContent(this.renderProgressDots());
      this.el.screen.render();
    }, this.props.animationSpeed || 500);
  }

  stopAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  setAnimated(animated: boolean) {
    this.props.animated = animated;
    if (animated) {
      this.startAnimation();
    } else {
      this.stopAnimation();
    }
  }

  setAnimationSpeed(speed: number) {
    this.props.animationSpeed = speed;
    if (this.props.animated) {
      this.startAnimation();
    }
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      value: this.currentValue,
      minValue: this.minValue,
      maxValue: this.maxValue,
      totalDots: this.props.totalDots,
      dotSpacing: this.props.dotSpacing,
      filledCharacter: this.props.filledCharacter,
      emptyCharacter: this.props.emptyCharacter,
      animatedCharacter: this.props.animatedCharacter,
      showValue: this.props.showValue,
      showPercentage: this.props.showPercentage,
      prefix: this.props.prefix,
      suffix: this.props.suffix,
      animated: this.props.animated,
      animationSpeed: this.props.animationSpeed,
    };
  }

  // Get progress dots properties
  getValue(): number {
    return this.currentValue;
  }

  getMinValue(): number {
    return this.minValue;
  }

  getMaxValue(): number {
    return this.maxValue;
  }

  getPercentage(): number {
    if (this.maxValue === this.minValue) return 100;
    return Math.round(((this.currentValue - this.minValue) / (this.maxValue - this.minValue)) * 100);
  }

  getTotalDots(): number {
    return this.props.totalDots || 10;
  }

  isComplete(): boolean {
    return this.currentValue >= this.maxValue;
  }

  isEmpty(): boolean {
    return this.currentValue <= this.minValue;
  }

  isAnimated(): boolean {
    return this.props.animated || false;
  }

  // Update component with new props
  update(newProps: Partial<ProgressDotsProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('ProgressDots', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ ProgressDots update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = ProgressDotsStyles.getStyle(this.props);
    
    // Update values if changed
    if (newProps.value !== undefined) {
      this.currentValue = this.props.value || 0;
    }
    
    if (newProps.minValue !== undefined) {
      this.minValue = this.props.minValue || 0;
    }
    
    if (newProps.maxValue !== undefined) {
      this.maxValue = this.props.maxValue || 100;
    }
    
    // Update animation if changed
    if (newProps.animated !== undefined) {
      this.setAnimated(this.props.animated);
    }
    
    if (newProps.animationSpeed !== undefined) {
      this.setAnimationSpeed(this.props.animationSpeed);
    }
    
    // Update content if any display properties changed
    if (newProps.totalDots !== undefined || 
        newProps.dotSpacing !== undefined || 
        newProps.filledCharacter !== undefined ||
        newProps.emptyCharacter !== undefined ||
        newProps.animatedCharacter !== undefined ||
        newProps.showValue !== undefined || 
        newProps.showPercentage !== undefined ||
        newProps.prefix !== undefined ||
        newProps.suffix !== undefined) {
      this.el.setContent(this.renderProgressDots());
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

  // Visibility management
  show() {
    this.el.show();
    this.el.screen.render();
  }

  hide() {
    this.el.hide();
    this.el.screen.render();
  }

  // Cleanup
  destroy() {
    this.stopAnimation();
    this.destroy();
  }

  // Get validation result for debugging
  getValidationResult(): ValidationResult {
    return this.validationResult;
  }
}