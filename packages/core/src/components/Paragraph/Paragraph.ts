import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { ParagraphProps, ParagraphVariants, ParagraphSizes, ParagraphStates } from './Paragraph.types';
import { ParagraphStyles } from './Paragraph.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Paragraph implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: ParagraphProps;
  private validationResult: ValidationResult;

  constructor(props: ParagraphProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Paragraph', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Paragraph validation failed:', this.validationResult.errors);
      throw new Error(`Paragraph validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Paragraph warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: ParagraphStyles.getStyle(this.props),
      content: this.props.text || '',
      align: 'left',
      valign: 'top',
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
        text: this.props.text,
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

  // Variant system methods
  setVariant(variant: ParagraphVariants) {
    this.props.variant = variant;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: ParagraphSizes) {
    this.props.size = size;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: ParagraphStates) {
    this.props.state = state;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Paragraph-specific methods
  setText(text: string) {
    this.props.text = text;
    this.el.setContent(text);
    this.el.screen.render();
  }

  setColor(color: string) {
    this.props.color = color;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setBackgroundColor(backgroundColor: string) {
    this.props.backgroundColor = backgroundColor;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setAlign(align: 'left' | 'center' | 'right') {
    this.props.align = align;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setValign(valign: 'top' | 'middle' | 'bottom') {
    this.props.valign = valign;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setTruncate(truncate: boolean) {
    this.props.truncate = truncate;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setEllipsis(ellipsis: boolean) {
    this.props.ellipsis = ellipsis;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setWrap(wrap: boolean) {
    this.props.wrap = wrap;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setBold(bold: boolean) {
    this.props.bold = bold;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setItalic(italic: boolean) {
    this.props.italic = italic;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setUnderline(underline: boolean) {
    this.props.underline = underline;
    this.el.style = ParagraphStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setMonospace(monospace: boolean) {
    this.props.monospace = monospace;
    this.el.style = ParagraphStyles.getStyle(this.props);
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
      color: this.props.color,
      backgroundColor: this.props.backgroundColor,
      align: this.props.align,
      valign: this.props.valign,
      truncate: this.props.truncate,
      ellipsis: this.props.ellipsis,
      wrap: this.props.wrap,
      bold: this.props.bold,
      italic: this.props.italic,
      underline: this.props.underline,
      monospace: this.props.monospace,
    };
  }

  // Get paragraph properties
  getText(): string | undefined {
    return this.props.text;
  }

  getColor(): string | undefined {
    return this.props.color;
  }

  getBackgroundColor(): string | undefined {
    return this.props.backgroundColor;
  }

  getAlign(): 'left' | 'center' | 'right' | undefined {
    return this.props.align;
  }

  getValign(): 'top' | 'middle' | 'bottom' | undefined {
    return this.props.valign;
  }

  isTruncated(): boolean {
    return this.props.truncate || false;
  }

  hasEllipsis(): boolean {
    return this.props.ellipsis || false;
  }

  isWrapped(): boolean {
    return this.props.wrap || false;
  }

  isBold(): boolean {
    return this.props.bold || false;
  }

  isItalic(): boolean {
    return this.props.italic || false;
  }

  isUnderlined(): boolean {
    return this.props.underline || false;
  }

  isMonospace(): boolean {
    return this.props.monospace || false;
  }

  // Update component with new props
  update(newProps: Partial<ParagraphProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Paragraph', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Paragraph update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = ParagraphStyles.getStyle(this.props);
    
    // Update content if text changed
    if (newProps.text !== undefined) {
      this.el.setContent(this.props.text || '');
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