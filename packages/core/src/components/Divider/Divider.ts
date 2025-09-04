import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { DividerProps, DividerVariants, DividerSizes, DividerStates } from './Divider.types';
import { DividerStyles } from './Divider.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Divider implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: DividerProps;
  private validationResult: ValidationResult;

  constructor(props: DividerProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Divider', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Divider validation failed:', this.validationResult.errors);
      throw new Error(`Divider validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Divider warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: DividerStyles.getStyle(this.props),
      content: this.renderDivider(),
      align: 'center',
      valign: 'middle',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private renderDivider(): string {
    const orientation = this.props.orientation || 'horizontal';
    const style = this.props.dividerStyle || 'solid';
    const length = this.props.length || 20;
    
    if (orientation === 'vertical') {
      return this.renderVerticalDivider(style, length);
    } else {
      return this.renderHorizontalDivider(style, length);
    }
  }
  
  private renderHorizontalDivider(style: string, length: number): string {
    switch (style) {
      case 'solid':
        return '─'.repeat(length);
      case 'dashed':
        return '┄'.repeat(length);
      case 'dotted':
        return '┈'.repeat(length);
      case 'double':
        return '═'.repeat(length);
      case 'thick':
        return '━'.repeat(length);
      case 'thin':
        return '─'.repeat(length);
      default:
        return '─'.repeat(length);
    }
  }
  
  private renderVerticalDivider(style: string, length: number): string {
    switch (style) {
      case 'solid':
        return '│'.repeat(length);
      case 'dashed':
        return '┆'.repeat(length);
      case 'dotted':
        return '┊'.repeat(length);
      case 'double':
        return '║'.repeat(length);
      case 'thick':
        return '┃'.repeat(length);
      case 'thin':
        return '│'.repeat(length);
      default:
        return '│'.repeat(length);
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
  }

  // Variant system methods
  setVariant(variant: DividerVariants) {
    this.props.variant = variant;
    this.el.style = DividerStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: DividerSizes) {
    this.props.size = size;
    this.el.style = DividerStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: DividerStates) {
    this.props.state = state;
    this.el.style = DividerStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Divider-specific methods
  setOrientation(orientation: 'horizontal' | 'vertical') {
    this.props.orientation = orientation;
    this.el.setContent(this.renderDivider());
    this.el.screen.render();
  }

  setDividerStyle(style: string) {
    this.props.dividerStyle = style as any;
    this.el.setContent(this.renderDivider());
    this.el.screen.render();
  }

  setLength(length: number) {
    this.props.length = length;
    this.el.setContent(this.renderDivider());
    this.el.screen.render();
  }

  setColor(color: string) {
    this.props.color = color;
    this.el.style = DividerStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setSpacing(spacing: number) {
    this.props.spacing = spacing;
    this.el.style = DividerStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      orientation: this.props.orientation,
      dividerStyle: this.props.dividerStyle,
      length: this.props.length,
      color: this.props.color,
      spacing: this.props.spacing,
    };
  }

  // Get divider properties
  getOrientation(): 'horizontal' | 'vertical' {
    return this.props.orientation || 'horizontal';
  }

  getDividerStyle(): string {
    return this.props.dividerStyle || 'solid';
  }

  getLength(): number {
    return this.props.length || 20;
  }

  // Update component with new props
  update(newProps: Partial<DividerProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Divider', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Divider update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = DividerStyles.getStyle(this.props);
    
    // Update content if orientation, style, or length changed
    if (newProps.orientation !== undefined || newProps.dividerStyle !== undefined || newProps.length !== undefined) {
      this.el.setContent(this.renderDivider());
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