import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { CollapsibleProps, CollapsibleVariants, CollapsibleSizes, CollapsibleStates } from './Collapsible.types';
import { CollapsibleStyles } from './Collapsible.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Collapsible implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: CollapsibleProps;
  private validationResult: ValidationResult;
  private isExpanded: boolean = false;
  private headerElement?: Widgets.BoxElement;
  private contentElement?: Widgets.BoxElement;
  private contentHeight: number = 0;

  constructor(props: CollapsibleProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Collapsible', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Collapsible validation failed:', this.validationResult.errors);
      throw new Error(`Collapsible validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Collapsible warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.isExpanded = this.props.defaultExpanded || false;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: CollapsibleStyles.getStyle(this.props),
      content: '',
      align: 'left',
      valign: 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupCollapsibleStructure();
    this.setupEventHandlers();
  }
  
  private setupCollapsibleStructure() {
    // Create header
    this.headerElement = this.el.children[0] as Widgets.BoxElement;
    if (this.headerElement) {
      this.headerElement.setContent(this.renderHeader());
      this.headerElement.style = CollapsibleStyles.getHeaderStyle(this.props);
    }
    
    // Create content area
    this.contentElement = this.el.children[1] as Widgets.BoxElement;
    if (this.contentElement) {
      this.contentElement.setContent(this.props.children || '');
      this.contentElement.style = CollapsibleStyles.getContentStyle(this.props);
      this.contentHeight = this.contentElement.height as number;
      
      // Set initial collapsed state
      if (!this.isExpanded) {
        this.contentElement.hide();
      }
    }
  }
  
  private renderHeader(): string {
    const icon = this.isExpanded ? '▼' : '▶';
    const title = this.props.title || 'Collapsible';
    const spacing = this.props.iconSpacing || 1;
    
    return `${icon}${' '.repeat(spacing)}${title}`;
  }
  
  private setupEventHandlers() {
    // Handle header click events
    if (this.headerElement) {
      this.headerElement.on('click', (data: any) => {
        this.toggle();
      });
    }

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
    this.isExpanded = !this.isExpanded;
    this.updateDisplay();
    
    // Trigger change callback
    if (this.props.onToggle) {
      this.props.onToggle(this.isExpanded);
    }
  }

  private updateDisplay() {
    if (this.headerElement) {
      this.headerElement.setContent(this.renderHeader());
    }
    
    if (this.contentElement) {
      if (this.isExpanded) {
        this.contentElement.show();
        this.contentElement.height = this.contentHeight;
      } else {
        this.contentElement.hide();
        this.contentElement.height = 0;
      }
    }
    
    this.el.screen.render();
  }

  // Variant system methods
  setVariant(variant: CollapsibleVariants) {
    this.props.variant = variant;
    this.el.style = CollapsibleStyles.getStyle(this.props);
    if (this.headerElement) {
      this.headerElement.style = CollapsibleStyles.getHeaderStyle(this.props);
    }
    if (this.contentElement) {
      this.contentElement.style = CollapsibleStyles.getContentStyle(this.props);
    }
    this.el.screen.render();
  }
  
  setSize(size: CollapsibleSizes) {
    this.props.size = size;
    this.el.style = CollapsibleStyles.getStyle(this.props);
    if (this.headerElement) {
      this.headerElement.style = CollapsibleStyles.getHeaderStyle(this.props);
    }
    if (this.contentElement) {
      this.contentElement.style = CollapsibleStyles.getContentStyle(this.props);
    }
    this.el.screen.render();
  }
  
  setState(state: CollapsibleStates) {
    this.props.state = state;
    this.el.style = CollapsibleStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Collapsible-specific methods
  expand() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.updateDisplay();
    }
  }

  collapse() {
    if (this.isExpanded) {
      this.isExpanded = false;
      this.updateDisplay();
    }
  }

  setTitle(title: string) {
    this.props.title = title;
    if (this.headerElement) {
      this.headerElement.setContent(this.renderHeader());
    }
    this.el.screen.render();
  }

  setContent(content: string) {
    this.props.children = content;
    if (this.contentElement) {
      this.contentElement.setContent(content);
      this.contentHeight = this.contentElement.height as number;
    }
    this.el.screen.render();
  }

  setIconSpacing(spacing: number) {
    this.props.iconSpacing = spacing;
    if (this.headerElement) {
      this.headerElement.setContent(this.renderHeader());
    }
    this.el.screen.render();
  }

  setAnimation(enabled: boolean) {
    this.props.animated = enabled;
    this.el.style = CollapsibleStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      title: this.props.title,
      isExpanded: this.isExpanded,
      animated: this.props.animated,
      iconSpacing: this.props.iconSpacing,
    };
  }

  // Get collapsible state
  isExpanded(): boolean {
    return this.isExpanded;
  }

  // Get content height
  getContentHeight(): number {
    return this.contentHeight;
  }

  // Update component with new props
  update(newProps: Partial<CollapsibleProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Collapsible', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Collapsible update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = CollapsibleStyles.getStyle(this.props);
    
    // Update header if changed
    if (newProps.title !== undefined && this.headerElement) {
      this.headerElement.setContent(this.renderHeader());
      this.headerElement.style = CollapsibleStyles.getHeaderStyle(this.props);
    }
    
    // Update content if changed
    if (newProps.children !== undefined && this.contentElement) {
      this.contentElement.setContent(this.props.children);
      this.contentHeight = this.contentElement.height as number;
    }
    
    // Update icon spacing if changed
    if (newProps.iconSpacing !== undefined && this.headerElement) {
      this.headerElement.setContent(this.renderHeader());
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