import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { MultiSelectProps, MultiSelectVariants, MultiSelectSizes, MultiSelectStates, MultiSelectOption } from './MultiSelect.types';
import { MultiSelectStyles } from './MultiSelect.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class MultiSelect implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: MultiSelectProps;
  private validationResult: ValidationResult;
  private options: MultiSelectOption[] = [];
  private selectedValues: any[] = [];
  private isOpen: boolean = false;
  private focusedIndex: number = 0;

  constructor(props: MultiSelectProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('MultiSelect', props);
    
    if (!this.validationResult.success) {
      console.error('❌ MultiSelect validation failed:', this.validationResult.errors);
      throw new Error(`MultiSelect validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ MultiSelect warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.options = this.props.options || [];
    this.selectedValues = this.props.defaultValue || [];
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: MultiSelectStyles.getStyle(this.props),
      content: this.renderMultiSelect(),
      align: 'left',
      valign: 'middle',
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

    // Handle key events for navigation
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
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
        this.toggleSelection();
        break;
      case 'enter':
        this.toggleDropdown();
        break;
      case 'escape':
        this.closeDropdown();
        break;
      case 'home':
        this.focusFirst();
        break;
      case 'end':
        this.focusLast();
        break;
    }
  }

  private handleClick(event: any) {
    this.toggleDropdown();
    
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        selectedValues: this.selectedValues,
        isOpen: this.isOpen,
      });
    }
  }

  private renderMultiSelect(): string {
    if (this.options.length === 0) {
      return this.props.placeholder || 'No options available';
    }

    let content = '';
    
    // Display selected values
    if (this.selectedValues.length > 0) {
      const selectedLabels = this.selectedValues.map(value => {
        const option = this.options.find(opt => opt.value === value);
        return option ? option.label : value;
      });
      
      if (this.props.maxDisplayValues && selectedLabels.length > this.props.maxDisplayValues) {
        const displayed = selectedLabels.slice(0, this.props.maxDisplayValues);
        content += displayed.join(', ') + ` (+${selectedLabels.length - this.props.maxDisplayValues} more)`;
      } else {
        content += selectedLabels.join(', ');
      }
    } else {
      content += this.props.placeholder || 'Select options...';
    }
    
    // Dropdown indicator
    if (this.isOpen) {
      content += ' ▲';
    } else {
      content += ' ▼';
    }
    
    return content;
  }

  // Variant system methods
  setVariant(variant: MultiSelectVariants) {
    this.props.variant = variant;
    this.el.style = MultiSelectStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: MultiSelectSizes) {
    this.props.size = size;
    this.el.style = MultiSelectStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: MultiSelectStates) {
    this.props.state = state;
    this.el.style = MultiSelectStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // MultiSelect-specific methods
  setOptions(options: MultiSelectOption[]) {
    this.options = options;
    this.focusedIndex = 0;
    this.el.setContent(this.renderMultiSelect());
    this.el.screen.render();
  }

  addOption(option: MultiSelectOption) {
    this.options.push(option);
    this.el.setContent(this.renderMultiSelect());
    this.el.screen.render();
  }

  removeOption(value: any) {
    const index = this.options.findIndex(opt => opt.value === value);
    if (index >= 0) {
      this.options.splice(index, 1);
      this.el.setContent(this.renderMultiSelect());
      this.el.screen.render();
    }
  }

  clearOptions() {
    this.options = [];
    this.focusedIndex = 0;
    this.el.setContent(this.renderMultiSelect());
    this.el.screen.render();
  }

  setSelectedValues(values: any[]) {
    this.selectedValues = values;
    this.el.setContent(this.renderMultiSelect());
    this.el.screen.render();
    
    if (this.props.onChange) {
      this.props.onChange({
        type: 'change',
        target: this.el,
        selectedValues: this.selectedValues,
        previousValues: [],
      });
    }
  }

  addSelectedValue(value: any) {
    if (!this.selectedValues.includes(value)) {
      this.selectedValues.push(value);
      this.el.setContent(this.renderMultiSelect());
      this.el.screen.render();
      
      if (this.props.onChange) {
        this.props.onChange({
          type: 'change',
          target: this.el,
          selectedValues: this.selectedValues,
          previousValues: this.selectedValues.filter(v => v !== value),
        });
      }
    }
  }

  removeSelectedValue(value: any) {
    const index = this.selectedValues.indexOf(value);
    if (index >= 0) {
      this.selectedValues.splice(index, 1);
      this.el.setContent(this.renderMultiSelect());
      this.el.screen.render();
      
      if (this.props.onChange) {
        this.props.onChange({
          type: 'change',
          target: this.el,
          selectedValues: this.selectedValues,
          previousValues: this.selectedValues.concat([value]),
        });
      }
    }
  }

  clearSelection() {
    this.selectedValues = [];
    this.el.setContent(this.renderMultiSelect());
    this.el.screen.render();
    
    if (this.props.onChange) {
      this.props.onChange({
        type: 'change',
        target: this.el,
        selectedValues: [],
        previousValues: this.selectedValues,
      });
    }
  }

  setPlaceholder(placeholder: string) {
    this.props.placeholder = placeholder;
    this.el.setContent(this.renderMultiSelect());
    this.el.screen.render();
  }

  setMaxDisplayValues(max: number) {
    this.props.maxDisplayValues = max;
    this.el.setContent(this.renderMultiSelect());
    this.el.screen.render();
  }

  // Navigation methods
  focusNext() {
    if (this.options.length > 0) {
      this.focusedIndex = (this.focusedIndex + 1) % this.options.length;
      this.el.screen.render();
    }
  }

  focusPrevious() {
    if (this.options.length > 0) {
      this.focusedIndex = this.focusedIndex === 0 ? this.options.length - 1 : this.focusedIndex - 1;
      this.el.screen.render();
    }
  }

  focusFirst() {
    if (this.options.length > 0) {
      this.focusedIndex = 0;
      this.el.screen.render();
    }
  }

  focusLast() {
    if (this.options.length > 0) {
      this.focusedIndex = this.options.length - 1;
      this.el.screen.render();
    }
  }

  // Selection methods
  toggleSelection() {
    if (this.options.length > 0) {
      const option = this.options[this.focusedIndex];
      if (option && !option.disabled) {
        if (this.selectedValues.includes(option.value)) {
          this.removeSelectedValue(option.value);
        } else {
          this.addSelectedValue(option.value);
        }
      }
    }
  }

  selectAll() {
    const selectableValues = this.options
      .filter(opt => !opt.disabled)
      .map(opt => opt.value);
    
    this.setSelectedValues(selectableValues);
  }

  deselectAll() {
    this.clearSelection();
  }

  // Dropdown methods
  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.isOpen = true;
    this.setState('active');
    this.el.screen.render();
    
    if (this.props.onDropdownOpen) {
      this.props.onDropdownOpen({
        type: 'dropdownopen',
        target: this.el,
      });
    }
  }

  closeDropdown() {
    this.isOpen = false;
    this.setState('default');
    this.el.screen.render();
    
    if (this.props.onDropdownClose) {
      this.props.onDropdownClose({
        type: 'dropdownclose',
        target: this.el,
      });
    }
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      options: this.options,
      selectedValues: this.selectedValues,
      focusedIndex: this.focusedIndex,
      isOpen: this.isOpen,
      placeholder: this.props.placeholder,
      maxDisplayValues: this.props.maxDisplayValues,
    };
  }

  // Get MultiSelect properties
  getOptions(): MultiSelectOption[] {
    return [...this.options];
  }

  getSelectedValues(): any[] {
    return [...this.selectedValues];
  }

  getFocusedIndex(): number {
    return this.focusedIndex;
  }

  isDropdownOpen(): boolean {
    return this.isOpen;
  }

  // Update component with new props
  update(newProps: Partial<MultiSelectProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('MultiSelect', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ MultiSelect update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = MultiSelectStyles.getStyle(this.props);
    
    // Update content if options, selected values, or display options changed
    if (newProps.options !== undefined || 
        newProps.placeholder !== undefined || 
        newProps.maxDisplayValues !== undefined) {
      this.options = this.props.options || [];
      this.el.setContent(this.renderMultiSelect());
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