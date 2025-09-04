import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { FlexProps, FlexVariants, FlexSizes, FlexStates } from './Flex.types';
import { FlexStyles } from './Flex.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Flex implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: FlexProps;
  private validationResult: ValidationResult;
  private children: Widgets.BoxElement[] = [];

  constructor(props: FlexProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Flex', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Flex validation failed:', this.validationResult.errors);
      throw new Error(`Flex validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Flex warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: FlexStyles.getStyle(this.props),
      content: '',
      align: 'left',
      valign: 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
    this.layoutChildren();
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
  }

  private layoutChildren() {
    const direction = this.props.direction || 'row';
    const justifyContent = this.props.justifyContent || 'flex-start';
    const alignItems = this.props.alignItems || 'stretch';
    const spacing = this.props.spacing || 1;
    
    let currentPosition = 0;
    
    this.children.forEach((child, index) => {
      if (direction === 'row') {
        // Horizontal layout
        child.left = currentPosition;
        child.top = 0;
        
        if (justifyContent === 'space-between' && index < this.children.length - 1) {
          currentPosition += (child.width as number) + spacing;
        } else if (justifyContent === 'space-around') {
          currentPosition += spacing + (child.width as number) + spacing;
        } else {
          currentPosition += (child.width as number) + spacing;
        }
        
        // Align items vertically
        if (alignItems === 'center') {
          child.top = Math.max(0, ((this.el.height as number) - (child.height as number)) / 2);
        } else if (alignItems === 'flex-end') {
          child.top = Math.max(0, (this.el.height as number) - (child.height as number));
        }
      } else {
        // Vertical layout
        child.left = 0;
        child.top = currentPosition;
        
        if (justifyContent === 'space-between' && index < this.children.length - 1) {
          currentPosition += (child.height as number) + spacing;
        } else if (justifyContent === 'space-around') {
          currentPosition += spacing + (child.height as number) + spacing;
        } else {
          currentPosition += (child.height as number) + spacing;
        }
        
        // Align items horizontally
        if (alignItems === 'center') {
          child.left = Math.max(0, ((this.el.width as number) - (child.width as number)) / 2);
        } else if (alignItems === 'flex-end') {
          child.left = Math.max(0, (this.el.width as number) - (child.width as number));
        }
      }
    });
  }

  // Variant system methods
  setVariant(variant: FlexVariants) {
    this.props.variant = variant;
    this.el.style = FlexStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: FlexSizes) {
    this.props.size = size;
    this.el.style = FlexStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: FlexStates) {
    this.props.state = state;
    this.el.style = FlexStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Flex-specific methods
  setDirection(direction: 'row' | 'column') {
    this.props.direction = direction;
    this.layoutChildren();
    this.el.screen.render();
  }

  setJustifyContent(justifyContent: string) {
    this.props.justifyContent = justifyContent as any;
    this.layoutChildren();
    this.el.screen.render();
  }

  setAlignItems(alignItems: string) {
    this.props.alignItems = alignItems as any;
    this.layoutChildren();
    this.el.screen.render();
  }

  setSpacing(spacing: number) {
    this.props.spacing = spacing;
    this.layoutChildren();
    this.el.screen.render();
  }

  setWrap(wrap: boolean) {
    this.props.wrap = wrap;
    this.layoutChildren();
    this.el.screen.render();
  }

  setGap(gap: number) {
    this.props.gap = gap;
    this.layoutChildren();
    this.el.screen.render();
  }

  // Child management
  addChild(child: Widgets.BoxElement) {
    this.children.push(child);
    this.layoutChildren();
    this.el.screen.render();
  }

  removeChild(child: Widgets.BoxElement) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      this.layoutChildren();
      this.el.screen.render();
    }
  }

  getChildren(): Widgets.BoxElement[] {
    return [...this.children];
  }

  clearChildren() {
    this.children = [];
    this.layoutChildren();
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      direction: this.props.direction,
      justifyContent: this.props.justifyContent,
      alignItems: this.props.alignItems,
      spacing: this.props.spacing,
      wrap: this.props.wrap,
      gap: this.props.gap,
      childrenCount: this.children.length,
    };
  }

  // Get flex properties
  getDirection(): 'row' | 'column' {
    return this.props.direction || 'row';
  }

  getJustifyContent(): string {
    return this.props.justifyContent || 'flex-start';
  }

  getAlignItems(): string {
    return this.props.alignItems || 'stretch';
  }

  getSpacing(): number {
    return this.props.spacing || 1;
  }

  // Update component with new props
  update(newProps: Partial<FlexProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Flex', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Flex update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = FlexStyles.getStyle(this.props);
    
    // Relayout if layout properties changed
    if (newProps.direction !== undefined || 
        newProps.justifyContent !== undefined || 
        newProps.alignItems !== undefined || 
        newProps.spacing !== undefined || 
        newProps.wrap !== undefined || 
        newProps.gap !== undefined) {
      this.layoutChildren();
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