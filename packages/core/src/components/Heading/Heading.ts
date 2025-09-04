import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { HeadingProps, HeadingVariants, HeadingSizes, HeadingStates } from './Heading.types';
import { HeadingStyles } from './Heading.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Heading implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: HeadingProps;
  private validationResult: ValidationResult;

  constructor(props: HeadingProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Heading', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Heading validation failed:', this.validationResult.errors);
      throw new Error(`Heading validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Heading warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: HeadingStyles.getStyle(this.props),
      content: this.props.text || '',
      align: this.props.align || 'left',
      valign: this.props.valign || 'top',
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
        if (this.props.onClick) {
          this.props.onClick({
            type: 'click',
            target: this.el,
            text: this.props.text,
            level: this.props.level,
          });
        }
      });
    }
  }

  // Variant system methods
  setVariant(variant: HeadingVariants) {
    this.props.variant = variant;
    this.el.style = HeadingStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: HeadingSizes) {
    this.props.size = size;
    this.el.style = HeadingStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: HeadingStates) {
    this.props.state = state;
    this.el.style = HeadingStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Heading-specific methods
  setText(text: string) {
    this.props.text = text;
    this.el.setContent(text);
    this.el.screen.render();
  }

  setLevel(level: number) {
    this.props.level = level;
    this.el.style = HeadingStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setColor(color: string) {
    this.props.color = color;
    this.el.style = HeadingStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setAlign(align: 'left' | 'center' | 'right') {
    this.props.align = align;
    this.el.align = align;
    this.el.screen.render();
  }

  setValign(valign: 'top' | 'middle' | 'bottom') {
    this.props.valign = valign;
    this.el.valign = valign;
    this.el.screen.render();
  }

  setTruncate(truncate: boolean) {
    this.props.truncate = truncate;
    this.el.style = HeadingStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setEllipsis(ellipsis: boolean) {
    this.props.ellipsis = ellipsis;
    this.el.style = HeadingStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      text: this.props.text,
      level: this.props.level,
      color: this.props.color,
      align: this.props.align,
      valign: this.props.valign,
      truncate: this.props.truncate,
      ellipsis: this.props.ellipsis,
      clickable: this.props.clickable,
    };
  }

  // Get heading properties
  getText(): string {
    return this.props.text || '';
  }

  getLevel(): number {
    return this.props.level || 1;
  }

  getColor(): string | undefined {
    return this.props.color;
  }

  getAlign(): 'left' | 'center' | 'right' {
    return this.props.align || 'left';
  }

  getValign(): 'top' | 'middle' | 'bottom' {
    return this.props.valign || 'top';
  }

  // Update component with new props
  update(newProps: Partial<HeadingProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Heading', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Heading update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = HeadingStyles.getStyle(this.props);
    
    // Update content if text changed
    if (newProps.text !== undefined) {
      this.el.setContent(newProps.text);
    }
    
    // Update alignment if changed
    if (newProps.align !== undefined) {
      this.el.align = newProps.align;
    }
    
    if (newProps.valign !== undefined) {
      this.el.valign = newProps.valign;
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