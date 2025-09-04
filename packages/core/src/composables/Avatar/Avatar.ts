import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { AvatarProps, AvatarVariants, AvatarSizes, AvatarShapes } from './Avatar.types';
import { AvatarStyles } from './Avatar.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Avatar implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: AvatarProps;
  private validationResult: ValidationResult;

  constructor(props: AvatarProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Avatar', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Avatar validation failed:', this.validationResult.errors);
      throw new Error(`Avatar validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Avatar warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: AvatarStyles.getStyle(this.props),
      content: this.getAvatarContent(),
      align: 'center',
      valign: 'middle',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private getAvatarContent(): string {
    if (this.props.src) {
      return '🖼️'; // Image placeholder
    } else if (this.props.icon) {
      return this.props.icon;
    } else if (this.props.text) {
      return this.props.text.charAt(0).toUpperCase();
    } else {
      return '👤'; // Default user icon
    }
  }
  
  private setupEventHandlers() {
    // Handle click events
    this.el.on('click', (data: any) => {
      // Avatar click handler
    });

    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focus');
    });

    this.el.on('blur', () => {
      this.setState('default');
    });
  }

  // Variant system methods
  setVariant(variant: AvatarVariants) {
    this.props.variant = variant;
    this.el.style = AvatarStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: AvatarSizes) {
    this.props.size = size;
    this.el.style = AvatarStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setShape(shape: AvatarShapes) {
    this.props.shape = shape;
    this.el.style = AvatarStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Avatar-specific methods
  setImage(src: string) {
    this.props.src = src;
    this.el.setContent('🖼️');
    this.el.screen.render();
  }

  setIcon(icon: string) {
    this.props.icon = icon;
    this.props.src = undefined;
    this.el.setContent(icon);
    this.el.screen.render();
  }

  setText(text: string) {
    this.props.text = text;
    this.props.src = undefined;
    this.props.icon = undefined;
    this.el.setContent(text.charAt(0).toUpperCase());
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      shape: this.props.shape,
      theme: this.theme,
      src: this.props.src,
      icon: this.props.icon,
      text: this.props.text,
    };
  }

  // Update component with new props
  update(newProps: Partial<AvatarProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Avatar', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Avatar update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = AvatarStyles.getStyle(this.props);
    
    // Update content if needed
    if (newProps.src !== undefined || newProps.icon !== undefined || newProps.text !== undefined) {
      this.el.setContent(this.getAvatarContent());
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