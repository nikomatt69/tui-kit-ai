import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { ProgressBarProps, ProgressBarVariants, ProgressBarSizes, ProgressBarStates } from './ProgressBar.types';
import { ProgressBarStyles } from './ProgressBar.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class ProgressBar implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: ProgressBarProps;
  private validationResult: ValidationResult;
  private currentValue: number = 0;
  private minValue: number = 0;
  private maxValue: number = 100;

  constructor(props: ProgressBarProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('ProgressBar', props);
    
    if (!this.validationResult.success) {
      console.error('❌ ProgressBar validation failed:', this.validationResult.errors);
      throw new Error(`ProgressBar validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ ProgressBar warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.currentValue = this.props.value || 0;
    this.minValue = this.props.minValue || 0;
    this.maxValue = this.props.maxValue || 100;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: ProgressBarStyles.getStyle(this.props),
      content: this.renderProgressBar(),
      align: 'left',
      valign: 'middle',
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

  private renderProgressBar(): string {
    const percentage = this.getPercentage();
    const width = this.props.width || 20;
    const filledWidth = Math.floor((percentage / 100) * width);
    const emptyWidth = width - filledWidth;
    
    let content = '';
    
    // Progress bar prefix
    if (this.props.prefix) {
      content += `${this.props.prefix} `;
    }
    
    // Progress bar visualization
    const filledChar = this.props.filledCharacter || '█';
    const emptyChar = this.props.emptyCharacter || '░';
    
    content += filledChar.repeat(filledWidth);
    content += emptyChar.repeat(emptyWidth);
    
    // Progress bar suffix
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
  setVariant(variant: ProgressBarVariants) {
    this.props.variant = variant;
    this.el.style = ProgressBarStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: ProgressBarSizes) {
    this.props.size = size;
    this.el.style = ProgressBarStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: ProgressBarStates) {
    this.props.state = state;
    this.el.style = ProgressBarStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // ProgressBar-specific methods
  setValue(value: number) {
    this.currentValue = Math.max(this.minValue, Math.min(this.maxValue, value));
    this.el.setContent(this.renderProgressBar());
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
    this.el.setContent(this.renderProgressBar());
    this.el.screen.render();
  }

  setMaxValue(maxValue: number) {
    this.maxValue = maxValue;
    if (this.currentValue > this.maxValue) {
      this.currentValue = this.maxValue;
    }
    this.el.setContent(this.renderProgressBar());
    this.el.screen.render();
  }

  setWidth(width: number) {
    this.props.width = width;
    this.el.setContent(this.renderProgressBar());
    this.el.screen.render();
  }

  setShowValue(show: boolean) {
    this.props.showValue = show;
    this.el.setContent(this.renderProgressBar());
    this.el.screen.render();
  }

  setShowPercentage(show: boolean) {
    this.props.showPercentage = show;
    this.el.setContent(this.renderProgressBar());
    this.el.screen.render();
  }

  setPrefix(prefix: string) {
    this.props.prefix = prefix;
    this.el.setContent(this.renderProgressBar());
    this.el.screen.render();
  }

  setSuffix(suffix: string) {
    this.props.suffix = suffix;
    this.el.setContent(this.renderProgressBar());
    this.el.screen.render();
  }

  setFilledCharacter(char: string) {
    this.props.filledCharacter = char;
    this.el.setContent(this.renderProgressBar());
    this.el.screen.render();
  }

  setEmptyCharacter(char: string) {
    this.props.emptyCharacter = char;
    this.el.setContent(this.renderProgressBar());
    this.el.screen.render();
  }

  // ProgressBar value methods
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
      width: this.props.width,
      showValue: this.props.showValue,
      showPercentage: this.props.showPercentage,
      prefix: this.props.prefix,
      suffix: this.props.suffix,
      filledCharacter: this.props.filledCharacter,
      emptyCharacter: this.props.emptyCharacter,
    };
  }

  // Get progress bar properties
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

  getWidth(): number | undefined {
    return this.props.width;
  }

  isComplete(): boolean {
    return this.currentValue >= this.maxValue;
  }

  isEmpty(): boolean {
    return this.currentValue <= this.minValue;
  }

  // Update component with new props
  update(newProps: Partial<ProgressBarProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('ProgressBar', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ ProgressBar update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = ProgressBarStyles.getStyle(this.props);
    
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
    
    // Update content if any display properties changed
    if (newProps.width !== undefined || 
        newProps.showValue !== undefined || 
        newProps.showPercentage !== undefined ||
        newProps.prefix !== undefined ||
        newProps.suffix !== undefined ||
        newProps.filledCharacter !== undefined ||
        newProps.emptyCharacter !== undefined) {
      this.el.setContent(this.renderProgressBar());
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

  // Get validation result for debugging
  getValidationResult(): ValidationResult {
    return this.validationResult;
  }
}