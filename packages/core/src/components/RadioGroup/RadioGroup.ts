import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { RadioGroupProps, RadioGroupVariants, RadioGroupSizes, RadioGroupStates } from './RadioGroup.types';
import { RadioGroupStyles } from './RadioGroup.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export interface RadioOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

export class RadioGroup implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: RadioGroupProps;
  private validationResult: ValidationResult;
  private options: RadioOption[] = [];
  private selectedValue: any = null;
  private focusedIndex: number = -1;

  constructor(props: RadioGroupProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('RadioGroup', props);
    
    if (!this.validationResult.success) {
      console.error('❌ RadioGroup validation failed:', this.validationResult.errors);
      throw new Error(`RadioGroup validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ RadioGroup warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.options = this.props.options || [];
    this.selectedValue = this.props.defaultValue || (this.options.length > 0 ? this.options[0].value : null);
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: RadioGroupStyles.getStyle(this.props),
      content: this.renderRadioGroup(),
      align: 'left',
      valign: 'top',
      keys: true,
      vi: true,
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

    // Handle key events
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
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
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'up':
      case 'k':
        this.focusPrevious();
        break;
      case 'down':
      case 'j':
        this.focusNext();
        break;
      case 'space':
      case 'enter':
        this.selectFocused();
        break;
      case 'home':
        this.focusFirst();
        break;
      case 'end':
        this.focusLast();
        break;
    }

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

  private handleClick(event: any) {
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        selectedValue: this.selectedValue,
        options: this.options,
      });
    }
  }

  private renderRadioGroup(): string {
    if (this.options.length === 0) {
      return this.props.emptyMessage || 'No options available';
    }

    let content = '';
    
    // Header
    if (this.props.label) {
      content += `${this.props.label}\n`;
      if (this.props.required) {
        content += ' *\n';
      }
      content += '\n';
    }
    
    // Options
    this.options.forEach((option, index) => {
      const isSelected = option.value === this.selectedValue;
      const isFocused = index === this.focusedIndex;
      const isDisabled = option.disabled;
      
      let line = '';
      
      // Radio button
      if (isSelected) {
        line += '● '; // Filled circle
      } else {
        line += '○ '; // Empty circle
      }
      
      // Option label
      if (isDisabled) {
        line += `[${option.label}]`; // Brackets for disabled
      } else {
        line += option.label;
      }
      
      // Description
      if (option.description) {
        line += ` - ${option.description}`;
      }
      
      // Focus indicator
      if (isFocused) {
        line = `▶ ${line}`;
      }
      
      content += line + '\n';
    });
    
    // Help text
    if (this.props.helpText) {
      content += `\n${this.props.helpText}`;
    }
    
    return content;
  }

  // Variant system methods
  setVariant(variant: RadioGroupVariants) {
    this.props.variant = variant;
    this.el.style = RadioGroupStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: RadioGroupSizes) {
    this.props.size = size;
    this.el.style = RadioGroupStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: RadioGroupStates) {
    this.props.state = state;
    this.el.style = RadioGroupStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // RadioGroup-specific methods
  setLabel(label: string) {
    this.props.label = label;
    this.el.setContent(this.renderRadioGroup());
    this.el.screen.render();
  }

  setHelpText(helpText: string) {
    this.props.helpText = helpText;
    this.el.setContent(this.renderRadioGroup());
    this.el.screen.render();
  }

  setOptions(options: RadioOption[]) {
    this.options = options;
    this.focusedIndex = -1;
    
    // Update selected value if current selection is no longer valid
    if (this.selectedValue && !this.options.find(opt => opt.value === this.selectedValue)) {
      this.selectedValue = this.options.length > 0 ? this.options[0].value : null;
    }
    
    this.el.setContent(this.renderRadioGroup());
    this.el.screen.render();
    
    if (this.props.onOptionsChange) {
      this.props.onOptionsChange({
        type: 'optionschange',
        target: this.el,
        options: this.options,
        previousOptions: [],
      });
    }
  }

  addOption(option: RadioOption) {
    this.options.push(option);
    this.el.setContent(this.renderRadioGroup());
    this.el.screen.render();
    
    if (this.props.onOptionAdd) {
      this.props.onOptionAdd({
        type: 'optionadd',
        target: this.el,
        option,
        totalOptions: this.options.length,
      });
    }
  }

  removeOption(id: string) {
    const index = this.options.findIndex(option => option.id === id);
    if (index >= 0) {
      const removedOption = this.options.splice(index, 1)[0];
      
      // Adjust focused index if needed
      if (this.focusedIndex === index) {
        this.focusedIndex = -1;
      } else if (this.focusedIndex > index) {
        this.focusedIndex--;
      }
      
      // Update selected value if removed option was selected
      if (removedOption.value === this.selectedValue) {
        this.selectedValue = this.options.length > 0 ? this.options[0].value : null;
      }
      
      this.el.setContent(this.renderRadioGroup());
      this.el.screen.render();
      
      if (this.props.onOptionRemove) {
        this.props.onOptionRemove({
          type: 'optionremove',
          target: this.el,
          option: removedOption,
          totalOptions: this.options.length,
        });
      }
    }
  }

  updateOption(id: string, updates: Partial<RadioOption>) {
    const index = this.options.findIndex(option => option.id === id);
    if (index >= 0) {
      const previousOption = { ...this.options[index] };
      this.options[index] = { ...this.options[index], ...updates };
      
      this.el.setContent(this.renderRadioGroup());
      this.el.screen.render();
      
      if (this.props.onOptionUpdate) {
        this.props.onOptionUpdate({
          type: 'optionupdate',
          target: this.el,
          option: this.options[index],
          previousOption,
        });
      }
    }
  }

  clearOptions() {
    this.options = [];
    this.selectedValue = null;
    this.focusedIndex = -1;
    this.el.setContent(this.renderRadioGroup());
    this.el.screen.render();
    
    if (this.props.onOptionsClear) {
      this.props.onOptionsClear({
        type: 'optionsclear',
        target: this.el,
      });
    }
  }

  // Selection methods
  setValue(value: any) {
    if (this.options.find(option => option.value === value)) {
      this.selectedValue = value;
      this.el.setContent(this.renderRadioGroup());
      this.el.screen.render();
      
      if (this.props.onChange) {
        this.props.onChange({
          type: 'change',
          target: this.el,
          value: this.selectedValue,
          previousValue: value,
        });
      }
    }
  }

  selectOption(index: number) {
    if (index >= 0 && index < this.options.length) {
      const option = this.options[index];
      if (!option.disabled) {
        this.setValue(option.value);
      }
    }
  }

  // Focus methods
  focusOption(index: number) {
    if (index >= 0 && index < this.options.length) {
      this.focusedIndex = index;
      this.el.setContent(this.renderRadioGroup());
      this.el.screen.render();
    }
  }

  focusNext() {
    if (this.options.length > 0) {
      this.focusOption((this.focusedIndex + 1) % this.options.length);
    }
  }

  focusPrevious() {
    if (this.options.length > 0) {
      this.focusOption(this.focusedIndex <= 0 ? this.options.length - 1 : this.focusedIndex - 1);
    }
  }

  focusFirst() {
    if (this.options.length > 0) {
      this.focusOption(0);
    }
  }

  focusLast() {
    if (this.options.length > 0) {
      this.focusOption(this.options.length - 1);
    }
  }

  selectFocused() {
    if (this.focusedIndex >= 0 && this.focusedIndex < this.options.length) {
      this.selectOption(this.focusedIndex);
    }
  }

  // Validation methods
  setRequired(required: boolean) {
    this.props.required = required;
    this.el.setContent(this.renderRadioGroup());
    this.el.screen.render();
  }

  validate(): boolean {
    if (this.props.required && this.selectedValue === null) {
      return false;
    }
    return true;
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      label: this.props.label,
      helpText: this.props.helpText,
      options: this.options,
      selectedValue: this.selectedValue,
      focusedIndex: this.focusedIndex,
      required: this.props.required,
      disabled: this.props.disabled,
    };
  }

  // Get radio group properties
  getLabel(): string | undefined {
    return this.props.label;
  }

  getHelpText(): string | undefined {
    return this.props.helpText;
  }

  getOptions(): RadioOption[] {
    return [...this.options];
  }

  getSelectedValue(): any {
    return this.selectedValue;
  }

  getSelectedOption(): RadioOption | undefined {
    return this.options.find(option => option.value === this.selectedValue);
  }

  getFocusedIndex(): number {
    return this.focusedIndex;
  }

  getFocusedOption(): RadioOption | undefined {
    return this.focusedIndex >= 0 ? this.options[this.focusedIndex] : undefined;
  }

  isRequired(): boolean {
    return this.props.required || false;
  }

  isDisabled(): boolean {
    return this.props.disabled || false;
  }

  // Update component with new props
  update(newProps: Partial<RadioGroupProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('RadioGroup', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ RadioGroup update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = RadioGroupStyles.getStyle(this.props);
    
    // Update options if changed
    if (newProps.options !== undefined) {
      this.setOptions(this.props.options || []);
    }
    
    // Update content if any display properties changed
    if (newProps.label !== undefined || 
        newProps.helpText !== undefined ||
        newProps.required !== undefined) {
      this.el.setContent(this.renderRadioGroup());
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