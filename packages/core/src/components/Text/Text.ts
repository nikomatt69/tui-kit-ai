import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { TextProps, TextVariants, TextSizes, TextStates } from './Text.types';
import { TextStyles } from './Text.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Text implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: TextProps;
  private validationResult: ValidationResult;
  private content: string = '';

  constructor(props: TextProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Text', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Text validation failed:', this.validationResult.errors);
      throw new Error(`Text validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Text warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.content = this.props.content || '';
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: TextStyles.getStyle(this.props),
      content: this.renderText(),
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
        text: this.content,
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

  private renderText(): string {
    let renderedText = this.content;
    
    // Apply text transformations
    if (this.props.uppercase) {
      renderedText = renderedText.toUpperCase();
    }
    
    if (this.props.lowercase) {
      renderedText = renderedText.toLowerCase();
    }
    
    if (this.props.capitalize) {
      renderedText = renderedText.replace(/\b\w/g, (char) => char.toUpperCase());
    }
    
    if (this.props.trim) {
      renderedText = renderedText.trim();
    }
    
    // Apply text truncation
    if (this.props.truncate && this.props.maxLength && renderedText.length > this.props.maxLength) {
      const truncateSymbol = this.props.truncateSymbol || '...';
      renderedText = renderedText.substring(0, this.props.maxLength - truncateSymbol.length) + truncateSymbol;
    }
    
    // Apply text wrapping
    if (this.props.wrap && this.props.maxWidth) {
      renderedText = this.wrapText(renderedText, this.props.maxWidth);
    }
    
    // Apply text highlighting
    if (this.props.highlight && this.props.highlightText) {
      renderedText = this.highlightText(renderedText, this.props.highlightText);
    }
    
    return renderedText;
  }

  private wrapText(text: string, maxWidth: number): string {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + word).length <= maxWidth) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines.join('\n');
  }

  private highlightText(text: string, highlightText: string): string {
    const regex = new RegExp(`(${highlightText})`, 'gi');
    return text.replace(regex, `**$1**`);
  }

  // Variant system methods
  setVariant(variant: TextVariants) {
    this.props.variant = variant;
    this.el.style = TextStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: TextSizes) {
    this.props.size = size;
    this.el.style = TextStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: TextStates) {
    this.props.state = state;
    this.el.style = TextStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Text-specific methods
  setContent(content: string) {
    this.content = content;
    this.el.setContent(this.renderText());
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

  appendContent(content: string) {
    const previousContent = this.content;
    this.content += content;
    this.el.setContent(this.renderText());
    this.el.screen.render();
    
    if (this.props.onContentChange) {
      this.props.onContentChange({
        type: 'contentchange',
        target: this.el,
        content: this.content,
        previousContent,
      });
    }
  }

  prependContent(content: string) {
    const previousContent = this.content;
    this.content = content + this.content;
    this.el.setContent(this.renderText());
    this.el.screen.render();
    
    if (this.props.onContentChange) {
      this.props.onContentChange({
        type: 'contentchange',
        target: this.el,
        content: this.content,
        previousContent,
      });
    }
  }

  clearContent() {
    const previousContent = this.content;
    this.content = '';
    this.el.setContent(this.renderText());
    this.el.screen.render();
    
    if (this.props.onContentChange) {
      this.props.onContentChange({
        type: 'contentchange',
        target: this.el,
        content: this.content,
        previousContent,
      });
    }
  }

  // Text formatting methods
  setUppercase(uppercase: boolean) {
    this.props.uppercase = uppercase;
    this.el.setContent(this.renderText());
    this.el.screen.render();
  }

  setLowercase(lowercase: boolean) {
    this.props.lowercase = lowercase;
    this.el.setContent(this.renderText());
    this.el.screen.render();
  }

  setCapitalize(capitalize: boolean) {
    this.props.capitalize = capitalize;
    this.el.setContent(this.renderText());
    this.el.screen.render();
  }

  setTrim(trim: boolean) {
    this.props.trim = trim;
    this.el.setContent(this.renderText());
    this.el.screen.render();
  }

  setTruncate(truncate: boolean) {
    this.props.truncate = truncate;
    this.el.setContent(this.renderText());
    this.el.screen.render();
  }

  setMaxLength(maxLength: number) {
    this.props.maxLength = maxLength;
    this.el.setContent(this.renderText());
    this.el.screen.render();
  }

  setTruncateSymbol(symbol: string) {
    this.props.truncateSymbol = symbol;
    this.el.setContent(this.renderText());
    this.el.screen.render();
  }

  setWrap(wrap: boolean) {
    this.props.wrap = wrap;
    this.el.setContent(this.renderText());
    this.el.screen.render();
  }

  setMaxWidth(maxWidth: number) {
    this.props.maxWidth = maxWidth;
    this.el.setContent(this.renderText());
    this.el.screen.render();
  }

  setHighlight(highlight: boolean) {
    this.props.highlight = highlight;
    this.el.setContent(this.renderText());
    this.el.screen.render();
  }

  setHighlightText(text: string) {
    this.props.highlightText = text;
    this.el.setContent(this.renderText());
    this.el.screen.render();
  }

  // Text alignment methods
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

  // Text styling methods
  setBold(bold: boolean) {
    this.props.bold = bold;
    this.el.style = TextStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setItalic(italic: boolean) {
    this.props.italic = italic;
    this.el.style = TextStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setUnderline(underline: boolean) {
    this.props.underline = underline;
    this.el.style = TextStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setStrikethrough(strikethrough: boolean) {
    this.props.strikethrough = strikethrough;
    this.el.style = TextStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Text color methods
  setColor(color: string) {
    this.props.color = color;
    this.el.style = TextStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setBackgroundColor(backgroundColor: string) {
    this.props.backgroundColor = backgroundColor;
    this.el.style = TextStyles.getStyle(this.props);
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
      align: this.props.align,
      valign: this.props.valign,
      bold: this.props.bold,
      italic: this.props.italic,
      underline: this.props.underline,
      strikethrough: this.props.strikethrough,
      uppercase: this.props.uppercase,
      lowercase: this.props.lowercase,
      capitalize: this.props.capitalize,
      trim: this.props.trim,
      truncate: this.props.truncate,
      maxLength: this.props.maxLength,
      truncateSymbol: this.props.truncateSymbol,
      wrap: this.props.wrap,
      maxWidth: this.props.maxWidth,
      highlight: this.props.highlight,
      highlightText: this.props.highlightText,
    };
  }

  // Get text properties
  getContent(): string {
    return this.content;
  }

  getLength(): number {
    return this.content.length;
  }

  getWordCount(): number {
    return this.content.split(/\s+/).filter(word => word.length > 0).length;
  }

  getLineCount(): number {
    return this.content.split('\n').length;
  }

  getCharacterCount(): number {
    return this.content.replace(/\s/g, '').length;
  }

  // Text utility methods
  hasText(): boolean {
    return this.content.length > 0;
  }

  isEmpty(): boolean {
    return this.content.length === 0;
  }

  contains(searchText: string): boolean {
    return this.content.toLowerCase().includes(searchText.toLowerCase());
  }

  startsWith(prefix: string): boolean {
    return this.content.startsWith(prefix);
  }

  endsWith(suffix: string): boolean {
    return this.content.endsWith(suffix);
  }

  replace(searchValue: string, replaceValue: string): void {
    const previousContent = this.content;
    this.content = this.content.replace(new RegExp(searchValue, 'g'), replaceValue);
    this.el.setContent(this.renderText());
    this.el.screen.render();
    
    if (this.props.onContentChange) {
      this.props.onContentChange({
        type: 'contentchange',
        target: this.el,
        content: this.content,
        previousContent,
      });
    }
  }

  // Update component with new props
  update(newProps: Partial<TextProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Text', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Text update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = TextStyles.getStyle(this.props);
    
    // Update content if changed
    if (newProps.content !== undefined) {
      this.setContent(this.props.content || '');
    }
    
    // Update alignment if changed
    if (newProps.align !== undefined) {
      this.setAlign(this.props.align || 'left');
    }
    
    if (newProps.valign !== undefined) {
      this.setValign(this.props.valign || 'top');
    }
    
    // Update content if any formatting properties changed
    if (newProps.uppercase !== undefined ||
        newProps.lowercase !== undefined ||
        newProps.capitalize !== undefined ||
        newProps.trim !== undefined ||
        newProps.truncate !== undefined ||
        newProps.maxLength !== undefined ||
        newProps.truncateSymbol !== undefined ||
        newProps.wrap !== undefined ||
        newProps.maxWidth !== undefined ||
        newProps.highlight !== undefined ||
        newProps.highlightText !== undefined) {
      this.el.setContent(this.renderText());
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