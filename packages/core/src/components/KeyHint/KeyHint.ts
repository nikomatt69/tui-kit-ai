import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { KeyHintProps, KeyHintVariants, KeyHintSizes, KeyHintStates } from './KeyHint.types';
import { KeyHintStyles } from './KeyHint.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class KeyHint implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: KeyHintProps;
  private validationResult: ValidationResult;

  constructor(props: KeyHintProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('KeyHint', props);
    
    if (!this.validationResult.success) {
      console.error('❌ KeyHint validation failed:', this.validationResult.errors);
      throw new Error(`KeyHint validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ KeyHint warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: KeyHintStyles.getStyle(this.props),
      content: this.renderKeyHint(),
      align: 'center',
      valign: 'middle',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private renderKeyHint(): string {
    const key = this.props.key || '';
    const description = this.props.description || '';
    const separator = this.props.separator || ' ';
    
    if (!key && !description) return '';
    
    let content = '';
    
    if (key) {
      content += `[${key}]`;
    }
    
    if (description) {
      if (key) {
        content += separator;
      }
      content += description;
    }
    
    return content;
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
            key: this.props.key,
            description: this.props.description,
          });
        }
      });
    }
  }

  // Variant system methods
  setVariant(variant: KeyHintVariants) {
    this.props.variant = variant;
    this.el.style = KeyHintStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: KeyHintSizes) {
    this.props.size = size;
    this.el.style = KeyHintStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: KeyHintStates) {
    this.props.state = state;
    this.el.style = KeyHintStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // KeyHint-specific methods
  setKey(key: string) {
    this.props.key = key;
    this.el.setContent(this.renderKeyHint());
    this.el.screen.render();
  }

  setDescription(description: string) {
    this.props.description = description;
    this.el.setContent(this.renderKeyHint());
    this.el.screen.render();
  }

  setSeparator(separator: string) {
    this.props.separator = separator;
    this.el.setContent(this.renderKeyHint());
    this.el.screen.render();
  }

  setColor(color: string) {
    this.props.color = color;
    this.el.style = KeyHintStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setKeyStyle(style: string) {
    this.props.keyStyle = style as any;
    this.el.style = KeyHintStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setShowKey(show: boolean) {
    this.props.showKey = show;
    this.el.setContent(this.renderKeyHint());
    this.el.screen.render();
  }

  setShowDescription(show: boolean) {
    this.props.showDescription = show;
    this.el.setContent(this.renderKeyHint());
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      key: this.props.key,
      description: this.props.description,
      separator: this.props.separator,
      color: this.props.color,
      keyStyle: this.props.keyStyle,
      showKey: this.props.showKey,
      showDescription: this.props.showDescription,
      clickable: this.props.clickable,
    };
  }

  // Get key hint properties
  getKey(): string {
    return this.props.key || '';
  }

  getDescription(): string {
    return this.props.description || '';
  }

  getSeparator(): string {
    return this.props.separator || ' ';
  }

  getColor(): string | undefined {
    return this.props.color;
  }

  // Update component with new props
  update(newProps: Partial<KeyHintProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('KeyHint', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ KeyHint update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = KeyHintStyles.getStyle(this.props);
    
    // Update content if key, description, or separator changed
    if (newProps.key !== undefined || 
        newProps.description !== undefined || 
        newProps.separator !== undefined ||
        newProps.showKey !== undefined ||
        newProps.showDescription !== undefined) {
      this.el.setContent(this.renderKeyHint());
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