import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { BadgeProps, BadgeVariants, BadgeSizes, BadgeStates } from './Badge.types';
import { BadgeStyles } from './Badge.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Badge implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: BadgeProps;
  private validationResult: ValidationResult;

  constructor(props: BadgeProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Badge', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Badge validation failed:', this.validationResult.errors);
      throw new Error(`Badge validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Badge warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: BadgeStyles.getStyle(this.props),
      content: this.getBadgeContent(),
      align: 'center',
      valign: 'middle',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private getBadgeContent(): string {
    if (this.props.dot) {
      return '●';
    } else if (this.props.count !== undefined) {
      const count = this.props.count;
      if (typeof count === 'number' && count > (this.props.overflowCount || 99)) {
        return `${this.props.overflowCount || 99}+`;
      }
      return count.toString();
    } else if (this.props.text) {
      return this.props.text;
    } else {
      return '';
    }
  }
  
  private setupEventHandlers() {
    // Handle click events
    this.el.on('click', (data: any) => {
      // Badge click handler
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
  setVariant(variant: BadgeVariants) {
    this.props.variant = variant;
    this.el.style = BadgeStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: BadgeSizes) {
    this.props.size = size;
    this.el.style = BadgeStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: BadgeStates) {
    this.props.state = state;
    this.el.style = BadgeStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Badge-specific methods
  setCount(count: number | string) {
    this.props.count = count;
    this.props.dot = false;
    this.props.text = undefined;
    this.el.setContent(this.getBadgeContent());
    this.el.screen.render();
  }

  setText(text: string) {
    this.props.text = text;
    this.props.count = undefined;
    this.props.dot = false;
    this.el.setContent(this.getBadgeContent());
    this.el.screen.render();
  }

  setDot(dot: boolean) {
    this.props.dot = dot;
    this.props.count = undefined;
    this.props.text = undefined;
    this.el.setContent(this.getBadgeContent());
    this.el.screen.render();
  }

  setColor(color: string) {
    this.props.color = color;
    this.el.style = BadgeStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      count: this.props.count,
      text: this.props.text,
      dot: this.props.dot,
      color: this.props.color,
    };
  }

  // Update component with new props
  update(newProps: Partial<BadgeProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Badge', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Badge update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = BadgeStyles.getStyle(this.props);
    
    // Update content if needed
    if (newProps.count !== undefined || newProps.text !== undefined || newProps.dot !== undefined) {
      this.el.setContent(this.getBadgeContent());
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