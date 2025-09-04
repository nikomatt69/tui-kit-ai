import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { ButtonProps, ButtonVariants, ButtonSizes, ButtonStates } from './Button.types';
import { ButtonStyles } from './Button.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Button implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: ButtonProps;
  private validationResult: ValidationResult;

  constructor(props: ButtonProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Button', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Button validation failed:', this.validationResult.errors);
      throw new Error(`Button validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Button warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: ButtonStyles.getStyle(this.props),
      content: this.props.label,
      keys: true,
      mouse: true,
      clickable: true,
      input: false,
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
    this.setupKeyboardNavigation();
  }
  
  private setupEventHandlers() {
    // Handle click events
    if (this.props.onClick) {
      this.el.on('click', (data: any) => {
        if (!this.props.disabled && !this.props.loading) {
          this.props.onClick!(data);
        }
      });
    }

    // Handle mouse events for hover effects
    this.el.on('mouseover', () => {
      if (!this.props.disabled) {
        this.setState('hover');
      }
    });

    this.el.on('mouseout', () => {
      if (!this.props.disabled) {
        this.setState('default');
      }
    });

    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focus');
    });

    this.el.on('blur', () => {
      this.setState('default');
    });
  }

  private setupKeyboardNavigation() {
    // Handle Enter key
    this.el.key(['enter', 'space'], () => {
      if (!this.props.disabled && !this.props.loading && this.props.onClick) {
        this.props.onClick({});
      }
    });

    // Handle disabled state
    if (this.props.disabled) {
      this.el.key(['enter', 'space', 'click'], () => {
        // Do nothing when disabled
      });
    }
  }

  // Variant system methods
  setVariant(variant: ButtonVariants) {
    this.props.variant = variant;
    this.el.style = ButtonStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: ButtonSizes) {
    this.props.size = size;
    this.el.style = ButtonStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: ButtonStates) {
    this.props.state = state;
    this.el.style = ButtonStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Button-specific methods
  setLoading(loading: boolean) {
    this.props.loading = loading;
    this.props.state = loading ? 'loading' : 'default';
    
    if (loading) {
      this.el.setContent(`${this.props.label} ⏳`);
    } else {
      this.el.setContent(this.props.label);
    }
    
    this.el.style = ButtonStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setDisabled(disabled: boolean) {
    this.props.disabled = disabled;
    this.props.state = disabled ? 'disabled' : 'default';
    
    if (disabled) {
      this.el.setContent(`[${this.props.label}]`);
    } else {
      this.el.setContent(this.props.label);
    }
    
    this.el.style = ButtonStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setLabel(label: string) {
    this.props.label = label;
    this.el.setContent(label);
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      disabled: this.props.disabled,
      loading: this.props.loading,
    };
  }

  // Update component with new props
  update(newProps: Partial<ButtonProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Button', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Button update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = ButtonStyles.getStyle(this.props);
    
    // Update content if label changed
    if (newProps.label !== undefined) {
      this.el.setContent(this.props.label);
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