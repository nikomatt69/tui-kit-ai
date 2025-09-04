import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { ScrollableProps, ScrollableVariants, ScrollableSizes, ScrollableStates } from './Scrollable.types';
import { ScrollableStyles } from './Scrollable.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Scrollable implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: ScrollableProps;
  private validationResult: ValidationResult;
  private children: Widgets.BlessedElement[] = [];
  private scrollPosition: number = 0;
  private maxScroll: number = 0;

  constructor(props: ScrollableProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Scrollable', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Scrollable validation failed:', this.validationResult.errors);
      throw new Error(`Scrollable validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Scrollable warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: ScrollableStyles.getStyle(this.props),
      content: this.props.content || '',
      align: 'left',
      valign: 'top',
      scrollable: true,
      alwaysScroll: this.props.alwaysScroll || false,
      scrollbar: {
        ch: this.props.scrollbarChar || ' ',
        style: { bg: this.props.scrollbarColor || 'blue' }
      }
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

    // Handle scroll events
    this.el.on('scroll', () => {
      this.handleScroll();
    });

    // Handle key events for navigation
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

  private handleScroll() {
    this.scrollPosition = this.el.scrollTop;
    this.maxScroll = this.el.maxScroll;
    
    if (this.props.onScroll) {
      this.props.onScroll({
        type: 'scroll',
        target: this.el,
        position: this.scrollPosition,
        maxScroll: this.maxScroll,
      });
    }
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'up':
      case 'k':
        this.scrollUp();
        break;
      case 'down':
      case 'j':
        this.scrollDown();
        break;
      case 'home':
        this.scrollToTop();
        break;
      case 'end':
        this.scrollToBottom();
        break;
      case 'pageup':
        this.pageUp();
        break;
      case 'pagedown':
        this.pageDown();
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
        children: this.children,
        scrollPosition: this.scrollPosition,
      });
    }
  }

  // Variant system methods
  setVariant(variant: ScrollableVariants) {
    this.props.variant = variant;
    this.el.style = ScrollableStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: ScrollableSizes) {
    this.props.size = size;
    this.el.style = ScrollableStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: ScrollableStates) {
    this.props.state = state;
    this.el.style = ScrollableStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Scrollable-specific methods
  setContent(content: string) {
    this.props.content = content;
    this.el.setContent(content);
    this.el.screen.render();
  }

  setScrollable(scrollable: boolean) {
    this.props.scrollable = scrollable;
    this.el.scrollable = scrollable;
    this.el.screen.render();
  }

  setAlwaysScroll(alwaysScroll: boolean) {
    this.props.alwaysScroll = alwaysScroll;
    this.el.alwaysScroll = alwaysScroll;
    this.el.screen.render();
  }

  setScrollbarChar(char: string) {
    this.props.scrollbarChar = char;
    this.el.scrollbar = {
      ch: char,
      style: { bg: this.props.scrollbarColor || 'blue' }
    };
    this.el.screen.render();
  }

  setScrollbarColor(color: string) {
    this.props.scrollbarColor = color;
    this.el.scrollbar = {
      ch: this.props.scrollbarChar || ' ',
      style: { bg: color }
    };
    this.el.screen.render();
  }

  // Scroll control methods
  scrollUp(amount: number = 1) {
    this.el.scroll(-amount);
    this.handleScroll();
  }

  scrollDown(amount: number = 1) {
    this.el.scroll(amount);
    this.handleScroll();
  }

  scrollToTop() {
    this.el.scrollTo(0);
    this.handleScroll();
  }

  scrollToBottom() {
    this.el.scrollTo(this.el.maxScroll);
    this.handleScroll();
  }

  scrollTo(position: number) {
    this.el.scrollTo(position);
    this.handleScroll();
  }

  pageUp() {
    const pageSize = Math.floor(this.el.height / 2);
    this.scrollUp(pageSize);
  }

  pageDown() {
    const pageSize = Math.floor(this.el.height / 2);
    this.scrollDown(pageSize);
  }

  // Content management methods
  addChild(child: Widgets.BlessedElement) {
    this.children.push(child);
    this.el.append(child);
    this.el.screen.render();
    
    if (this.props.onChildAdd) {
      this.props.onChildAdd({
        type: 'childadd',
        target: this.el,
        child,
        totalChildren: this.children.length,
      });
    }
  }

  removeChild(child: Widgets.BlessedElement) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
      this.el.remove(child);
      this.el.screen.render();
      
      if (this.props.onChildRemove) {
        this.props.onChildRemove({
          type: 'childremove',
          target: this.el,
          child,
          totalChildren: this.children.length,
        });
      }
    }
  }

  clearChildren() {
    this.children.forEach(child => {
      this.el.remove(child);
    });
    this.children = [];
    this.el.screen.render();
    
    if (this.props.onChildrenClear) {
      this.props.onChildrenClear({
        type: 'childrenclear',
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
      content: this.props.content,
      scrollable: this.props.scrollable,
      alwaysScroll: this.props.alwaysScroll,
      scrollbarChar: this.props.scrollbarChar,
      scrollbarColor: this.props.scrollbarColor,
      children: this.children,
      scrollPosition: this.scrollPosition,
      maxScroll: this.maxScroll,
    };
  }

  // Get scrollable properties
  getContent(): string | undefined {
    return this.props.content;
  }

  getChildren(): Widgets.BlessedElement[] {
    return [...this.children];
  }

  getScrollPosition(): number {
    return this.scrollPosition;
  }

  getMaxScroll(): number {
    return this.maxScroll;
  }

  isScrollable(): boolean {
    return this.props.scrollable || false;
  }

  isAlwaysScroll(): boolean {
    return this.props.alwaysScroll || false;
  }

  getScrollbarChar(): string {
    return this.props.scrollbarChar || ' ';
  }

  getScrollbarColor(): string {
    return this.props.scrollbarColor || 'blue';
  }

  // Update component with new props
  update(newProps: Partial<ScrollableProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Scrollable', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Scrollable update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = ScrollableStyles.getStyle(this.props);
    
    // Update scrollable properties
    if (newProps.scrollable !== undefined) {
      this.setScrollable(this.props.scrollable);
    }
    
    if (newProps.alwaysScroll !== undefined) {
      this.setAlwaysScroll(this.props.alwaysScroll);
    }
    
    if (newProps.scrollbarChar !== undefined) {
      this.setScrollbarChar(this.props.scrollbarChar);
    }
    
    if (newProps.scrollbarColor !== undefined) {
      this.setScrollbarColor(this.props.scrollbarColor);
    }
    
    // Update content if changed
    if (newProps.content !== undefined) {
      this.setContent(this.props.content);
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