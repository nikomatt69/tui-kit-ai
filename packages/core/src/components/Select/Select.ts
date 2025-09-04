import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { SelectProps, SelectVariants, SelectSizes, SelectStates } from './Select.types';
import { SelectStyles } from './Select.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export interface SelectOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

export class Select implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: SelectProps;
  private validationResult: ValidationResult;
  private options: SelectOption[] = [];
  private selectedValue: any = null;
  private selectedIndex: number = -1;
  private isOpen: boolean = false;
  private focusedIndex: number = -1;

  constructor(props: SelectProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Select', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Select validation failed:', this.validationResult.errors);
      throw new Error(`Select validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Select warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.options = this.props.options || [];
    this.selectedValue = this.props.defaultValue || (this.options.length > 0 ? this.options[0].value : null);
    
    // Find initial selected index
    if (this.selectedValue) {
      this.selectedIndex = this.options.findIndex(option => option.value === this.selectedValue);
    }
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: SelectStyles.getStyle(this.props),
      content: this.renderSelect(),
      align: 'left',
      valign: 'middle',
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
        if (this.isOpen) {
          this.focusPrevious();
        } else {
          this.open();
        }
        break;
      case 'down':
      case 'j':
        if (this.isOpen) {
          this.focusNext();
        } else {
          this.open();
        }
        break;
      case 'space':
      case 'enter':
        if (this.isOpen) {
          this.selectFocused();
        } else {
          this.open();
        }
        break;
      case 'escape':
        this.close();
        break;
      case 'tab':
        if (this.isOpen) {
          this.selectFocused();
        }
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
        isOpen: this.isOpen,
      });
    }
  }

  private renderSelect(): string {
    let content = '';
    
    // Label
    if (this.props.label) {
      content += `${this.props.label}`;
      if (this.props.required) {
        content += ' *';
      }
      content += ': ';
    }
    
    // Selected value display
    if (this.selectedValue !== null) {
      const selectedOption = this.options.find(option => option.value === this.selectedValue);
      if (selectedOption) {
        content += selectedOption.label;
      }
    } else {
      content += this.props.placeholder || 'Select an option...';
    }
    
    // Dropdown indicator
    content += ` ${this.isOpen ? '▲' : '▼'}`;
    
    // Dropdown options
    if (this.isOpen && this.options.length > 0) {
      content += '\n';
      this.options.forEach((option, index) => {
        const isSelected = option.value === this.selectedValue;
        const isFocused = index === this.focusedIndex;
        const isDisabled = option.disabled;
        
        let line = '';
        
        // Selection indicator
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
    }
    
    return content;
  }

  // Variant system methods
  setVariant(variant: SelectVariants) {
    this.props.variant = variant;
    this.el.style = SelectStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: SelectSizes) {
    this.props.size = size;
    this.el.style = SelectStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: SelectStates) {
    this.props.state = state;
    this.el.style = SelectStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Select-specific methods
  setLabel(label: string) {
    this.props.label = label;
    this.el.setContent(this.renderSelect());
    this.el.screen.render();
  }

  setPlaceholder(placeholder: string) {
    this.props.placeholder = placeholder;
    this.el.setContent(this.renderSelect());
    this.el.screen.render();
  }

  setOptions(options: SelectOption[]) {
    this.options = options;
    this.focusedIndex = -1;
    
    // Update selected value if current selection is no longer valid
    if (this.selectedValue && !this.options.find(opt => opt.value === this.selectedValue)) {
      this.selectedValue = this.options.length > 0 ? this.options[0].value : null;
      this.selectedIndex = 0;
    } else if (this.selectedValue) {
      this.selectedIndex = this.options.findIndex(opt => opt.value === this.selectedValue);
    }
    
    this.el.setContent(this.renderSelect());
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

  addOption(option: SelectOption) {
    this.options.push(option);
    this.el.setContent(this.renderSelect());
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
        this.selectedIndex = 0;
      } else if (this.selectedIndex > index) {
        this.selectedIndex--;
      }
      
      this.el.setContent(this.renderSelect());
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

  updateOption(id: string, updates: Partial<SelectOption>) {
    const index = this.options.findIndex(option => option.id === id);
    if (index >= 0) {
      const previousOption = { ...this.options[index] };
      this.options[index] = { ...this.options[index], ...updates };
      
      this.el.setContent(this.renderSelect());
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
    this.selectedIndex = -1;
    this.focusedIndex = -1;
    this.el.setContent(this.renderSelect());
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
      this.selectedIndex = this.options.findIndex(option => option.value === value);
      this.el.setContent(this.renderSelect());
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

  // Dropdown control methods
  open() {
    if (!this.isOpen && this.options.length > 0) {
      this.isOpen = true;
      this.focusedIndex = this.selectedIndex >= 0 ? this.selectedIndex : 0;
      this.el.setContent(this.renderSelect());
      this.el.screen.render();
      
      if (this.props.onOpen) {
        this.props.onOpen({
          type: 'open',
          target: this.el,
          options: this.options,
        });
      }
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.focusedIndex = -1;
      this.el.setContent(this.renderSelect());
      this.el.screen.render();
      
      if (this.props.onClose) {
        this.props.onClose({
          type: 'close',
          target: this.el,
        });
      }
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // Focus methods
  focusOption(index: number) {
    if (index >= 0 && index < this.options.length) {
      this.focusedIndex = index;
      this.el.setContent(this.renderSelect());
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
      this.close();
    }
  }

  // Validation methods
  setRequired(required: boolean) {
    this.props.required = required;
    this.el.setContent(this.renderSelect());
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
      placeholder: this.props.placeholder,
      options: this.options,
      selectedValue: this.selectedValue,
      selectedIndex: this.selectedIndex,
      isOpen: this.isOpen,
      focusedIndex: this.focusedIndex,
      required: this.props.required,
      disabled: this.props.disabled,
    };
  }

  // Get select properties
  getLabel(): string | undefined {
    return this.props.label;
  }

  getPlaceholder(): string | undefined {
    return this.props.placeholder;
  }

  getOptions(): SelectOption[] {
    return [...this.options];
  }

  getSelectedValue(): any {
    return this.selectedValue;
  }

  getSelectedOption(): SelectOption | undefined {
    return this.options.find(option => option.value === this.selectedValue);
  }

  getSelectedIndex(): number {
    return this.selectedIndex;
  }

  getFocusedIndex(): number {
    return this.focusedIndex;
  }

  getFocusedOption(): SelectOption | undefined {
    return this.focusedIndex >= 0 ? this.options[this.focusedIndex] : undefined;
  }

  isOpen(): boolean {
    return this.isOpen;
  }

  isRequired(): boolean {
    return this.props.required || false;
  }

  isDisabled(): boolean {
    return this.props.disabled || false;
  }

  // Update component with new props
  update(newProps: Partial<SelectProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Select', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Select update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = SelectStyles.getStyle(this.props);
    
    // Update options if changed
    if (newProps.options !== undefined) {
      this.setOptions(this.props.options || []);
    }
    
    // Update content if any display properties changed
    if (newProps.label !== undefined || 
        newProps.placeholder !== undefined ||
        newProps.required !== undefined) {
      this.el.setContent(this.renderSelect());
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