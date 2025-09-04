import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { CheckboxProps, CheckboxVariants, CheckboxSizes, CheckboxStates } from './Checkbox.types';
import { CheckboxStyles } from './Checkbox.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Checkbox implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: CheckboxProps;
  private validationResult: ValidationResult;
  private checked: boolean = false;
  private indeterminate: boolean = false;

  constructor(props: CheckboxProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Checkbox', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Checkbox validation failed:', this.validationResult.errors);
      throw new Error(`Checkbox validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Checkbox warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.checked = this.props.checked || false;
    this.indeterminate = this.props.indeterminate || false;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: CheckboxStyles.getStyle(this.props),
      content: this.renderCheckbox(),
      align: 'left',
      valign: 'middle',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private renderCheckbox(): string {
    const checkbox = this.indeterminate ? '◐' : (this.checked ? '☑' : '☐');
    const label = this.props.label || '';
    const spacing = this.props.labelSpacing || 1;
    
    return `${checkbox}${' '.repeat(spacing)}${label}`;
  }
  
  private setupEventHandlers() {
    // Handle click events
    this.el.on('click', (data: any) => {
      this.toggle();
    });

    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focus');
    });

    this.el.on('blur', () => {
      this.setState('default');
    });

    // Handle keyboard events
    this.el.key(['space', 'enter'], (ch, key) => {
      this.toggle();
    });

    // Handle mouse events
    this.el.on('mouseover', () => {
      this.setState('hover');
    });

    this.el.on('mouseout', () => {
      this.setState('default');
    });
  }

  private toggle() {
    if (this.props.disabled) return;
    
    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }
    
    this.updateDisplay();
    
    // Trigger change callback
    if (this.props.onChange) {
      this.props.onChange(this.checked, this.indeterminate);
    }
  }

  private updateDisplay() {
    this.el.setContent(this.renderCheckbox());
    this.el.style = CheckboxStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Variant system methods
  setVariant(variant: CheckboxVariants) {
    this.props.variant = variant;
    this.el.style = CheckboxStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: CheckboxSizes) {
    this.props.size = size;
    this.el.style = CheckboxStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: CheckboxStates) {
    this.props.state = state;
    this.el.style = CheckboxStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Checkbox-specific methods
  setChecked(checked: boolean) {
    this.checked = checked;
    this.indeterminate = false;
    this.updateDisplay();
  }

  setIndeterminate(indeterminate: boolean) {
    this.indeterminate = indeterminate;
    if (indeterminate) {
      this.checked = false;
    }
    this.updateDisplay();
  }

  setLabel(label: string) {
    this.props.label = label;
    this.updateDisplay();
  }

  setDisabled(disabled: boolean) {
    this.props.disabled = disabled;
    this.el.style = CheckboxStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setRequired(required: boolean) {
    this.props.required = required;
    this.el.style = CheckboxStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      checked: this.checked,
      indeterminate: this.indeterminate,
      label: this.props.label,
      disabled: this.props.disabled,
      required: this.props.required,
    };
  }

  // Get checkbox value
  getValue(): boolean {
    return this.checked;
  }

  // Check if checkbox is checked
  isChecked(): boolean {
    return this.checked;
  }

  // Check if checkbox is indeterminate
  isIndeterminate(): boolean {
    return this.indeterminate;
  }

  // Check if checkbox is disabled
  isDisabled(): boolean {
    return this.props.disabled || false;
  }

  // Check if checkbox is required
  isRequired(): boolean {
    return this.props.required || false;
  }

  // Update component with new props
  update(newProps: Partial<CheckboxProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Checkbox', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Checkbox update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    
    // Update internal state if changed
    if (newProps.checked !== undefined) {
      this.checked = this.props.checked || false;
    }
    if (newProps.indeterminate !== undefined) {
      this.indeterminate = this.props.indeterminate || false;
    }
    
    this.updateDisplay();
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