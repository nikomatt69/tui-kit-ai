import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { TextInputProps, TextInputVariants, TextInputSizes, TextInputStates } from './TextInput.types';
import { TextInputStyles } from './TextInput.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class TextInput implements Component<Widgets.TextareaElement> {
  el: Widgets.TextareaElement;
  theme: any;
  destroy: () => void;
  private props: TextInputProps;
  private validationResult: ValidationResult;
  private value: string = '';
  private placeholder: string = '';
  private cursorPosition: number = 0;
  private isFocused: boolean = false;
  private isTyping: boolean = false;
  private typingTimeout: NodeJS.Timeout | null = null;

  constructor(props: TextInputProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('TextInput', props);
    
    if (!this.validationResult.success) {
      console.error('❌ TextInput validation failed:', this.validationResult.errors);
      throw new Error(`TextInput validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ TextInput warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.value = this.props.value || '';
    this.placeholder = this.props.placeholder || '';
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.TextareaElement>({
      ...this.props,
      style: TextInputStyles.getStyle(this.props),
      content: this.renderTextInput(),
      inputOnFocus: true,
      keys: true,
      vi: true,
      alwaysScroll: true,
      scrollable: true,
      scrollbar: {
        ch: ' ',
        track: {
          bg: 'cyan'
        },
        style: {
          bg: 'blue'
        }
      }
    });
    
    this.el = comp.el as Widgets.TextareaElement;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    // Handle focus events
    this.el.on('focus', () => {
      this.isFocused = true;
      this.setState('focus');
    });

    this.el.on('blur', () => {
      this.isFocused = false;
      this.setState('default');
    });

    // Handle input events
    this.el.on('input', (event: any) => {
      this.handleInput(event);
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

    // Handle submit events
    this.el.on('submit', () => {
      this.handleSubmit();
    });

    // Handle cancel events
    this.el.on('cancel', () => {
      this.handleCancel();
    });
  }

  private handleInput(event: any) {
    const newValue = event.value || '';
    const previousValue = this.value;
    this.value = newValue;
    
    // Update cursor position
    this.cursorPosition = newValue.length;
    
    // Set typing state
    this.isTyping = true;
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
      if (this.props.onTypingEnd) {
        this.props.onTypingEnd({
          type: 'typingend',
          target: this.el,
          value: this.value,
        });
      }
    }, this.props.typingDelay || 500);
    
    // Trigger change event
    if (this.props.onChange) {
      this.props.onChange({
        type: 'change',
        target: this.el,
        value: this.value,
        previousValue,
      });
    }
    
    // Trigger typing event
    if (this.props.onTyping) {
      this.props.onTyping({
        type: 'typing',
        target: this.el,
        value: this.value,
      });
    }
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'enter':
        if (this.props.multiline) {
          // Insert newline in multiline mode
          this.insertText('\n');
        } else {
          // Submit in single line mode
          this.handleSubmit();
        }
        break;
      case 'escape':
        this.handleCancel();
        break;
      case 'tab':
        if (event.shift) {
          // Shift+Tab: focus previous element
          this.el.emit('keypress', { key: 'S-tab', ctrl: false, shift: true, alt: false });
        } else {
          // Tab: focus next element
          this.el.emit('keypress', { key: 'tab', ctrl: false, shift: false, alt: false });
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
        value: this.value,
        cursorPosition: this.cursorPosition,
      });
    }
  }

  private handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit({
        type: 'submit',
        target: this.el,
        value: this.value,
      });
    }
  }

  private handleCancel() {
    if (this.props.onCancel) {
      this.props.onCancel({
        type: 'cancel',
        target: this.el,
        value: this.value,
      });
    }
  }

  private renderTextInput(): string {
    if (this.value.length === 0 && this.placeholder) {
      return this.placeholder;
    }
    return this.value;
  }

  // Variant system methods
  setVariant(variant: TextInputVariants) {
    this.props.variant = variant;
    this.el.style = TextInputStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: TextInputSizes) {
    this.props.size = size;
    this.el.style = TextInputStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: TextInputStates) {
    this.props.state = state;
    this.el.style = TextInputStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // TextInput-specific methods
  setValue(value: string) {
    const previousValue = this.value;
    this.value = value;
    this.cursorPosition = value.length;
    
    this.el.setValue(value);
    this.el.screen.render();
    
    if (this.props.onChange) {
      this.props.onChange({
        type: 'change',
        target: this.el,
        value: this.value,
        previousValue,
      });
    }
  }

  setPlaceholder(placeholder: string) {
    this.placeholder = placeholder;
    this.el.setContent(this.renderTextInput());
    this.el.screen.render();
  }

  setLabel(label: string) {
    this.props.label = label;
    this.el.screen.render();
  }

  setIcon(icon: string) {
    this.props.icon = icon;
    this.el.screen.render();
  }

  setRequired(required: boolean) {
    this.props.required = required;
    this.el.screen.render();
  }

  setDisabled(disabled: boolean) {
    this.props.disabled = disabled;
    if (disabled) {
      this.el.disable();
    } else {
      this.el.enable();
    }
    this.el.screen.render();
  }

  setReadOnly(readOnly: boolean) {
    this.props.readOnly = readOnly;
    if (readOnly) {
      this.el.disable();
    } else {
      this.el.enable();
    }
    this.el.screen.render();
  }

  setMultiline(multiline: boolean) {
    this.props.multiline = multiline;
    this.el.screen.render();
  }

  setMaxLength(maxLength: number) {
    this.props.maxLength = maxLength;
    this.el.screen.render();
  }

  setMinLength(minLength: number) {
    this.props.minLength = minLength;
    this.el.screen.render();
  }

  setPattern(pattern: string) {
    this.props.pattern = pattern;
    this.el.screen.render();
  }

  setAutoComplete(autoComplete: boolean) {
    this.props.autoComplete = autoComplete;
    this.el.screen.render();
  }

  setAutoFocus(autoFocus: boolean) {
    this.props.autoFocus = autoFocus;
    if (autoFocus) {
      this.el.focus();
    }
  }

  setSpellCheck(spellCheck: boolean) {
    this.props.spellCheck = spellCheck;
    this.el.screen.render();
  }

  setTypingDelay(delay: number) {
    this.props.typingDelay = delay;
  }

  // Text manipulation methods
  insertText(text: string) {
    const previousValue = this.value;
    const beforeCursor = this.value.substring(0, this.cursorPosition);
    const afterCursor = this.value.substring(this.cursorPosition);
    
    this.value = beforeCursor + text + afterCursor;
    this.cursorPosition += text.length;
    
    this.el.setValue(this.value);
    this.el.screen.render();
    
    if (this.props.onChange) {
      this.props.onChange({
        type: 'change',
        target: this.el,
        value: this.value,
        previousValue,
      });
    }
  }

  deleteText(start: number, end: number) {
    const previousValue = this.value;
    const beforeStart = this.value.substring(0, start);
    const afterEnd = this.value.substring(end);
    
    this.value = beforeStart + afterEnd;
    this.cursorPosition = Math.min(this.cursorPosition, start);
    
    this.el.setValue(this.value);
    this.el.screen.render();
    
    if (this.props.onChange) {
      this.props.onChange({
        type: 'change',
        target: this.el,
        value: this.value,
        previousValue,
      });
    }
  }

  selectText(start: number, end: number) {
    this.cursorPosition = start;
    // Note: Text selection in blessed is limited, this is a basic implementation
    this.el.screen.render();
  }

  selectAll() {
    this.cursorPosition = 0;
    // Note: Text selection in blessed is limited, this is a basic implementation
    this.el.screen.render();
  }

  // Cursor management
  setCursorPosition(position: number) {
    this.cursorPosition = Math.max(0, Math.min(position, this.value.length));
    this.el.screen.render();
  }

  moveCursorToStart() {
    this.cursorPosition = 0;
    this.el.screen.render();
  }

  moveCursorToEnd() {
    this.cursorPosition = this.value.length;
    this.el.screen.render();
  }

  moveCursorLeft() {
    this.cursorPosition = Math.max(0, this.cursorPosition - 1);
    this.el.screen.render();
  }

  moveCursorRight() {
    this.cursorPosition = Math.min(this.value.length, this.cursorPosition + 1);
    this.el.screen.render();
  }

  // Validation methods
  validate(): boolean {
    if (this.props.required && this.value.length === 0) {
      return false;
    }
    
    if (this.props.minLength && this.value.length < this.props.minLength) {
      return false;
    }
    
    if (this.props.maxLength && this.value.length > this.props.maxLength) {
      return false;
    }
    
    if (this.props.pattern) {
      const regex = new RegExp(this.props.pattern);
      if (!regex.test(this.value)) {
        return false;
      }
    }
    
    return true;
  }

  getValidationMessage(): string {
    if (this.props.required && this.value.length === 0) {
      return this.props.requiredMessage || 'This field is required';
    }
    
    if (this.props.minLength && this.value.length < this.props.minLength) {
      return this.props.minLengthMessage || `Minimum length is ${this.props.minLength} characters`;
    }
    
    if (this.props.maxLength && this.value.length > this.props.maxLength) {
      return this.props.maxLengthMessage || `Maximum length is ${this.props.maxLength} characters`;
    }
    
    if (this.props.pattern && !new RegExp(this.props.pattern).test(this.value)) {
      return this.props.patternMessage || 'Invalid format';
    }
    
    return '';
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      value: this.value,
      placeholder: this.placeholder,
      label: this.props.label,
      icon: this.props.icon,
      required: this.props.required,
      disabled: this.props.disabled,
      readOnly: this.props.readOnly,
      multiline: this.props.multiline,
      maxLength: this.props.maxLength,
      minLength: this.props.minLength,
      pattern: this.props.pattern,
      autoComplete: this.props.autoComplete,
      autoFocus: this.props.autoFocus,
      spellCheck: this.props.spellCheck,
      typingDelay: this.props.typingDelay,
      cursorPosition: this.cursorPosition,
      isFocused: this.isFocused,
      isTyping: this.isTyping,
    };
  }

  // Get text input properties
  getValue(): string {
    return this.value;
  }

  getPlaceholder(): string {
    return this.placeholder;
  }

  getLabel(): string | undefined {
    return this.props.label;
  }

  getIcon(): string | undefined {
    return this.props.icon;
  }

  getCursorPosition(): number {
    return this.cursorPosition;
  }

  getLength(): number {
    return this.value.length;
  }

  getWordCount(): number {
    return this.value.split(/\s+/).filter(word => word.length > 0).length;
  }

  getLineCount(): number {
    return this.value.split('\n').length;
  }

  // Text input utility methods
  hasValue(): boolean {
    return this.value.length > 0;
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  contains(searchText: string): boolean {
    return this.value.toLowerCase().includes(searchText.toLowerCase());
  }

  startsWith(prefix: string): boolean {
    return this.value.startsWith(prefix);
  }

  endsWith(suffix: string): boolean {
    return this.value.endsWith(suffix);
  }

  replace(searchValue: string, replaceValue: string): void {
    const previousValue = this.value;
    this.value = this.value.replace(new RegExp(searchValue, 'g'), replaceValue);
    this.cursorPosition = Math.min(this.cursorPosition, this.value.length);
    
    this.el.setValue(this.value);
    this.el.screen.render();
    
    if (this.props.onChange) {
      this.props.onChange({
        type: 'change',
        target: this.el,
        value: this.value,
        previousValue,
      });
    }
  }

  clear() {
    this.setValue('');
  }

  // Update component with new props
  update(newProps: Partial<TextInputProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('TextInput', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ TextInput update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = TextInputStyles.getStyle(this.props);
    
    // Update value if changed
    if (newProps.value !== undefined) {
      this.setValue(this.props.value || '');
    }
    
    // Update placeholder if changed
    if (newProps.placeholder !== undefined) {
      this.setPlaceholder(this.props.placeholder || '');
    }
    
    // Update disabled state if changed
    if (newProps.disabled !== undefined) {
      this.setDisabled(this.props.disabled || false);
    }
    
    // Update read-only state if changed
    if (newProps.readOnly !== undefined) {
      this.setReadOnly(this.props.readOnly || false);
    }
    
    // Update auto-focus if changed
    if (newProps.autoFocus !== undefined) {
      this.setAutoFocus(this.props.autoFocus || false);
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