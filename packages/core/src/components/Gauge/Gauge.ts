import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { GaugeProps, GaugeVariants, GaugeSizes, GaugeStates } from './Gauge.types';
import { GaugeStyles } from './Gauge.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Gauge implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: GaugeProps;
  private validationResult: ValidationResult;
  private currentValue: number;
  private maxValue: number;
  private minValue: number;

  constructor(props: GaugeProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Gauge', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Gauge validation failed:', this.validationResult.errors);
      throw new Error(`Gauge validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Gauge warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Initialize values
    this.minValue = this.props.minValue || 0;
    this.maxValue = this.props.maxValue || 100;
    this.currentValue = Math.max(this.minValue, Math.min(this.maxValue, this.props.value || 0));
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: GaugeStyles.getStyle(this.props),
      content: this.renderGauge(),
      align: 'center',
      valign: 'middle',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private renderGauge(): string {
    const width = this.props.width || 20;
    const percentage = this.getPercentage();
    const filledWidth = Math.round((percentage / 100) * width);
    const emptyWidth = width - filledWidth;
    
    const filledChar = this.getFilledCharacter();
    const emptyChar = this.getEmptyCharacter();
    
    const filled = filledChar.repeat(filledWidth);
    const empty = emptyChar.repeat(emptyWidth);
    
    let gauge = '';
    
    if (this.props.showValue) {
      gauge += `[${this.currentValue}/${this.maxValue}] `;
    }
    
    gauge += this.props.prefix || '';
    gauge += filled;
    gauge += empty;
    gauge += this.props.suffix || '';
    
    if (this.props.showPercentage) {
      gauge += ` ${percentage.toFixed(1)}%`;
    }
    
    return gauge;
  }
  
  private getFilledCharacter(): string {
    switch (this.props.gaugeStyle) {
      case 'block':
        return '█';
      case 'bar':
        return '▇';
      case 'line':
        return '━';
      case 'dots':
        return '●';
      case 'squares':
        return '■';
      case 'circles':
        return '●';
      default:
        return '█';
    }
  }
  
  private getEmptyCharacter(): string {
    switch (this.props.gaugeStyle) {
      case 'block':
        return '░';
      case 'bar':
        return '▁';
      case 'line':
        return '─';
      case 'dots':
        return '○';
      case 'squares':
        return '□';
      case 'circles':
        return '○';
      default:
        return '░';
    }
  }
  
  private getPercentage(): number {
    if (this.maxValue === this.minValue) return 100;
    return ((this.currentValue - this.minValue) / (this.maxValue - this.minValue)) * 100;
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

    // Handle click events for interactive gauge
    if (this.props.interactive) {
      this.el.on('click', (event: any) => {
        this.handleClick(event);
      });
    }
  }

  private handleClick(event: any) {
    if (!this.props.interactive) return;
    
    const clickX = event.x - (this.el.left as number);
    const gaugeWidth = this.props.width || 20;
    const clickPercentage = Math.max(0, Math.min(100, (clickX / gaugeWidth) * 100));
    
    const newValue = this.minValue + (clickPercentage / 100) * (this.maxValue - this.minValue);
    this.setValue(newValue);
    
    if (this.props.onChange) {
      this.props.onChange({
        type: 'change',
        target: this.el,
        value: newValue,
        percentage: clickPercentage,
      });
    }
  }

  // Variant system methods
  setVariant(variant: GaugeVariants) {
    this.props.variant = variant;
    this.el.style = GaugeStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: GaugeSizes) {
    this.props.size = size;
    this.el.style = GaugeStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: GaugeStates) {
    this.props.state = state;
    this.el.style = GaugeStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Gauge-specific methods
  setValue(value: number) {
    this.currentValue = Math.max(this.minValue, Math.min(this.maxValue, value));
    this.el.setContent(this.renderGauge());
    this.el.screen.render();
  }

  setMinValue(minValue: number) {
    this.minValue = minValue;
    this.currentValue = Math.max(this.minValue, this.currentValue);
    this.el.setContent(this.renderGauge());
    this.el.screen.render();
  }

  setMaxValue(maxValue: number) {
    this.maxValue = maxValue;
    this.currentValue = Math.min(this.maxValue, this.currentValue);
    this.el.setContent(this.renderGauge());
    this.el.screen.render();
  }

  setGaugeStyle(style: string) {
    this.props.gaugeStyle = style as any;
    this.el.setContent(this.renderGauge());
    this.el.screen.render();
  }

  setWidth(width: number) {
    this.props.width = width;
    this.el.setContent(this.renderGauge());
    this.el.screen.render();
  }

  setShowValue(show: boolean) {
    this.props.showValue = show;
    this.el.setContent(this.renderGauge());
    this.el.screen.render();
  }

  setShowPercentage(show: boolean) {
    this.props.showPercentage = show;
    this.el.setContent(this.renderGauge());
    this.el.screen.render();
  }

  setPrefix(prefix: string) {
    this.props.prefix = prefix;
    this.el.setContent(this.renderGauge());
    this.el.screen.render();
  }

  setSuffix(suffix: string) {
    this.props.suffix = suffix;
    this.el.setContent(this.renderGauge());
    this.el.screen.render();
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
      percentage: this.getPercentage(),
      gaugeStyle: this.props.gaugeStyle,
      width: this.props.width,
      showValue: this.props.showValue,
      showPercentage: this.props.showPercentage,
      prefix: this.props.prefix,
      suffix: this.props.suffix,
      interactive: this.props.interactive,
    };
  }

  // Get gauge properties
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
    return this.getPercentage();
  }

  // Update component with new props
  update(newProps: Partial<GaugeProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Gauge', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Gauge update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    
    // Update values if changed
    if (newProps.value !== undefined) {
      this.currentValue = Math.max(this.minValue, Math.min(this.maxValue, newProps.value));
    }
    
    if (newProps.minValue !== undefined) {
      this.minValue = newProps.minValue;
      this.currentValue = Math.max(this.minValue, this.currentValue);
    }
    
    if (newProps.maxValue !== undefined) {
      this.maxValue = newProps.maxValue;
      this.currentValue = Math.min(this.maxValue, this.currentValue);
    }
    
    this.el.style = GaugeStyles.getStyle(this.props);
    this.el.setContent(this.renderGauge());
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