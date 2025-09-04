import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { PromptProps, PromptVariants, PromptSizes, PromptStates } from './Prompt.types';
import { PromptStyles } from './Prompt.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Prompt implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: PromptProps;
  private validationResult: ValidationResult;
  private isVisible: boolean = false;
  private inputValue: string = '';
  private selectedOption: number = 0;
  private options: string[] = [];

  constructor(props: PromptProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Prompt', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Prompt validation failed:', this.validationResult.errors);
      throw new Error(`Prompt validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Prompt warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.options = this.props.options || [];
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: PromptStyles.getStyle(this.props),
      content: this.renderPrompt(),
      align: 'center',
      valign: 'middle',
      keys: true,
      vi: true,
      alwaysOnTop: true,
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
    
    // Show prompt if autoShow is enabled
    if (this.props.autoShow) {
      this.show();
    }
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

    // Handle input events
    this.el.on('input', (event: any) => {
      this.handleInput(event);
    });

    // Handle submit events
    this.el.on('submit', (event: any) => {
      this.handleSubmit(event);
    });

    // Handle cancel events
    this.el.on('cancel', (event: any) => {
      this.handleCancel(event);
    });
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'up':
      case 'k':
        this.selectPreviousOption();
        break;
      case 'down':
      case 'j':
        this.selectNextOption();
        break;
      case 'enter':
        this.submit();
        break;
      case 'escape':
      case 'q':
        this.cancel();
        break;
      case 'tab':
        this.toggleInputMode();
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

  private handleInput(event: any) {
    if (this.props.type === 'input' || this.props.type === 'password') {
      this.inputValue = event.value || '';
      this.el.setContent(this.renderPrompt());
      this.el.screen.render();
      
      if (this.props.onInputChange) {
        this.props.onInputChange({
          type: 'inputchange',
          target: this.el,
          value: this.inputValue,
        });
      }
    }
  }

  private handleSubmit(event: any) {
    this.submit();
  }

  private handleCancel(event: any) {
    this.cancel();
  }

  private renderPrompt(): string {
    let content = '';
    
    // Header
    if (this.props.title) {
      content += `${this.props.title}\n`;
      content += '─'.repeat(this.props.title.length) + '\n\n';
    }
    
    // Message
    if (this.props.message) {
      content += `${this.props.message}\n\n`;
    }
    
    // Input field
    if (this.props.type === 'input' || this.props.type === 'password') {
      const placeholder = this.props.placeholder || 'Enter text...';
      const displayValue = this.props.type === 'password' 
        ? '*'.repeat(this.inputValue.length) 
        : this.inputValue;
      
      content += `${this.props.label || 'Input'}: `;
      content += displayValue || placeholder;
      content += '\n';
    }
    
    // Options for select type
    if (this.props.type === 'select' && this.options.length > 0) {
      content += `${this.props.label || 'Select an option'}:\n`;
      this.options.forEach((option, index) => {
        const prefix = index === this.selectedOption ? '▶ ' : '  ';
        content += `${prefix}${option}\n`;
      });
    }
    
    // Buttons
    content += '\n';
    if (this.props.showCancel) {
      content += `[${this.props.cancelText || 'Cancel'}] `;
    }
    content += `[${this.props.confirmText || 'OK'}]`;
    
    return content;
  }

  // Variant system methods
  setVariant(variant: PromptVariants) {
    this.props.variant = variant;
    this.el.style = PromptStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: PromptSizes) {
    this.props.size = size;
    this.el.style = PromptStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: PromptStates) {
    this.props.state = state;
    this.el.style = PromptStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Prompt-specific methods
  setTitle(title: string) {
    this.props.title = title;
    this.el.setContent(this.renderPrompt());
    this.el.screen.render();
  }

  setMessage(message: string) {
    this.props.message = message;
    this.el.setContent(this.renderPrompt());
    this.el.screen.render();
  }

  setLabel(label: string) {
    this.props.label = label;
    this.el.setContent(this.renderPrompt());
    this.el.screen.render();
  }

  setPlaceholder(placeholder: string) {
    this.props.placeholder = placeholder;
    this.el.setContent(this.renderPrompt());
    this.el.screen.render();
  }

  setOptions(options: string[]) {
    this.options = options;
    this.selectedOption = 0;
    this.el.setContent(this.renderPrompt());
    this.el.screen.render();
  }

  setInputValue(value: string) {
    this.inputValue = value;
    this.el.setContent(this.renderPrompt());
    this.el.screen.render();
  }

  setSelectedOption(index: number) {
    if (index >= 0 && index < this.options.length) {
      this.selectedOption = index;
      this.el.setContent(this.renderPrompt());
      this.el.screen.render();
    }
  }

  // Prompt control methods
  show() {
    this.isVisible = true;
    this.el.show();
    this.el.focus();
    this.el.screen.render();
    
    if (this.props.onShow) {
      this.props.onShow({
        type: 'show',
        target: this.el,
      });
    }
  }

  hide() {
    this.isVisible = false;
    this.el.hide();
    this.el.blur();
    this.el.screen.render();
    
    if (this.props.onHide) {
      this.props.onHide({
        type: 'hide',
        target: this.el,
      });
    }
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  // Option selection methods
  selectNextOption() {
    if (this.options.length > 0) {
      this.selectedOption = (this.selectedOption + 1) % this.options.length;
      this.el.setContent(this.renderPrompt());
      this.el.screen.render();
    }
  }

  selectPreviousOption() {
    if (this.options.length > 0) {
      this.selectedOption = this.selectedOption <= 0 
        ? this.options.length - 1 
        : this.selectedOption - 1;
      this.el.setContent(this.renderPrompt());
      this.el.screen.render();
    }
  }

  // Input mode methods
  toggleInputMode() {
    if (this.props.type === 'input' || this.props.type === 'password') {
      // Toggle between input and select mode if applicable
      this.el.setContent(this.renderPrompt());
      this.el.screen.render();
    }
  }

  // Action methods
  submit() {
    let result: any;
    
    switch (this.props.type) {
      case 'input':
      case 'password':
        result = this.inputValue;
        break;
      case 'select':
        result = this.options[this.selectedOption];
        break;
      case 'confirm':
        result = true;
        break;
      default:
        result = this.inputValue || this.options[this.selectedOption];
    }
    
    if (this.props.onSubmit) {
      this.props.onSubmit({
        type: 'submit',
        target: this.el,
        result,
        inputValue: this.inputValue,
        selectedOption: this.selectedOption,
      });
    }
    
    // Auto-hide if enabled
    if (this.props.autoHide) {
      this.hide();
    }
  }

  cancel() {
    if (this.props.onCancel) {
      this.props.onCancel({
        type: 'cancel',
        target: this.el,
      });
    }
    
    // Auto-hide if enabled
    if (this.props.autoHide) {
      this.hide();
    }
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      title: this.props.title,
      message: this.props.message,
      label: this.props.label,
      placeholder: this.props.placeholder,
      type: this.props.type,
      options: this.options,
      inputValue: this.inputValue,
      selectedOption: this.selectedOption,
      isVisible: this.isVisible,
      showCancel: this.props.showCancel,
      confirmText: this.props.confirmText,
      cancelText: this.props.cancelText,
    };
  }

  // Get prompt properties
  getTitle(): string | undefined {
    return this.props.title;
  }

  getMessage(): string | undefined {
    return this.props.message;
  }

  getLabel(): string | undefined {
    return this.props.label;
  }

  getPlaceholder(): string | undefined {
    return this.props.placeholder;
  }

  getOptions(): string[] {
    return [...this.options];
  }

  getInputValue(): string {
    return this.inputValue;
  }

  getSelectedOption(): number {
    return this.selectedOption;
  }

  isVisible(): boolean {
    return this.isVisible;
  }

  // Update component with new props
  update(newProps: Partial<PromptProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Prompt', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Prompt update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = PromptStyles.getStyle(this.props);
    
    // Update options if changed
    if (newProps.options !== undefined) {
      this.options = this.props.options || [];
      this.selectedOption = 0;
    }
    
    // Update content if any display properties changed
    if (newProps.title !== undefined || 
        newProps.message !== undefined ||
        newProps.label !== undefined ||
        newProps.placeholder !== undefined) {
      this.el.setContent(this.renderPrompt());
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

  // Get validation result for debugging
  getValidationResult(): ValidationResult {
    return this.validationResult;
  }
}