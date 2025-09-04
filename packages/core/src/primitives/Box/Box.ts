import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { BoxProps, BoxVariants, BoxSizes, BoxStates } from './Box.types';
import { BoxStyles } from './Box.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Box implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: BoxProps;
  private validationResult: ValidationResult;

  constructor(props: BoxProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Box', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Box validation failed:', this.validationResult.errors);
      throw new Error(`Box validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Box warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: BoxStyles.getStyle(this.props),
      content: this.props.content || '',
      align: this.props.align || 'left',
      valign: this.props.valign || 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    // Handle click events
    this.el.on('click', (data: any) => {
      if (this.props.onClick) {
        this.props.onClick(data);
      }
    });

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
  setVariant(variant: BoxVariants) {
    this.props.variant = variant;
    this.el.style = BoxStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: BoxSizes) {
    this.props.size = size;
    this.el.style = BoxStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: BoxStates) {
    this.props.state = state;
    this.el.style = BoxStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Box-specific methods
  setContent(content: string) {
    this.props.content = content;
    this.el.setContent(content);
    this.el.screen.render();
  }

  setBorder(borderType: string, borderColor?: string) {
    this.props.borderStyle = borderType as any;
    if (borderColor) {
      this.props.borderColor = borderColor;
    }
    this.el.style = BoxStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setPadding(padding: number | [number, number] | Record<string, number>) {
    this.props.padding = padding;
    this.el.style = BoxStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setMargin(margin: number | [number, number] | Record<string, number>) {
    this.props.margin = margin;
    this.el.style = BoxStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      content: this.props.content,
      borderStyle: this.props.borderStyle,
      padding: this.props.padding,
      margin: this.props.margin,
    };
  }

  // Update component with new props
  update(newProps: Partial<BoxProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Box', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Box update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = BoxStyles.getStyle(this.props);
    
    // Update content if changed
    if (newProps.content !== undefined) {
      this.el.setContent(this.props.content);
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