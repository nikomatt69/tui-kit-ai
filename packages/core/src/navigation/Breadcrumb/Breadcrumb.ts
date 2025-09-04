import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { BreadcrumbProps, BreadcrumbVariants, BreadcrumbSizes, BreadcrumbStates } from './Breadcrumb.types';
import { BreadcrumbStyles } from './Breadcrumb.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Breadcrumb implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: BreadcrumbProps;
  private validationResult: ValidationResult;
  private items: Array<{ label: string; path: string; active?: boolean }> = [];

  constructor(props: BreadcrumbProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Breadcrumb', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Breadcrumb validation failed:', this.validationResult.errors);
      throw new Error(`Breadcrumb validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Breadcrumb warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.items = this.props.items || [];
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: BreadcrumbStyles.getStyle(this.props),
      content: this.renderBreadcrumb(),
      align: 'left',
      valign: 'middle',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private renderBreadcrumb(): string {
    if (this.items.length === 0) return '';
    
    const separator = this.props.separator || ' / ';
    return this.items
      .map((item, index) => {
        if (item.active) {
          return `[${item.label}]`;
        }
        return item.label;
      })
      .join(separator);
  }
  
  private setupEventHandlers() {
    // Handle click events
    this.el.on('click', (data: any) => {
      // Breadcrumb click handler
    });

    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focus');
    });

    this.el.on('blur', () => {
      this.setState('default');
    });

    // Handle keyboard navigation
    this.el.key(['left', 'right', 'home', 'end'], (ch, key) => {
      this.handleKeyboardNavigation(key.name);
    });
  }

  private handleKeyboardNavigation(key: string) {
    const currentIndex = this.items.findIndex(item => item.active);
    
    switch (key) {
      case 'left':
        if (currentIndex > 0) {
          this.navigateToItem(currentIndex - 1);
        }
        break;
      case 'right':
        if (currentIndex < this.items.length - 1) {
          this.navigateToItem(currentIndex + 1);
        }
        break;
      case 'home':
        this.navigateToItem(0);
        break;
      case 'end':
        this.navigateToItem(this.items.length - 1);
        break;
    }
  }

  private navigateToItem(index: number) {
    if (index >= 0 && index < this.items.length) {
      // Update active state
      this.items.forEach((item, i) => {
        item.active = i === index;
      });
      
      // Update display
      this.el.setContent(this.renderBreadcrumb());
      
      // Trigger navigation callback
      if (this.props.onNavigate) {
        this.props.onNavigate(this.items[index].path, index);
      }
      
      this.el.screen.render();
    }
  }

  // Variant system methods
  setVariant(variant: BreadcrumbVariants) {
    this.props.variant = variant;
    this.el.style = BreadcrumbStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: BreadcrumbSizes) {
    this.props.size = size;
    this.el.style = BreadcrumbStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: BreadcrumbStates) {
    this.props.state = state;
    this.el.style = BreadcrumbStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Breadcrumb-specific methods
  setItems(items: Array<{ label: string; path: string; active?: boolean }>) {
    this.items = items;
    this.el.setContent(this.renderBreadcrumb());
    this.el.screen.render();
  }

  addItem(label: string, path: string, active: boolean = false) {
    this.items.push({ label, path, active });
    this.el.setContent(this.renderBreadcrumb());
    this.el.screen.render();
  }

  removeItem(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.el.setContent(this.renderBreadcrumb());
      this.el.screen.render();
    }
  }

  setActiveItem(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.items.forEach((item, i) => {
        item.active = i === index;
      });
      this.el.setContent(this.renderBreadcrumb());
      this.el.screen.render();
    }
  }

  setSeparator(separator: string) {
    this.props.separator = separator;
    this.el.setContent(this.renderBreadcrumb());
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      items: this.items,
      separator: this.props.separator,
      maxItems: this.props.maxItems,
    };
  }

  // Update component with new props
  update(newProps: Partial<BreadcrumbProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Breadcrumb', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Breadcrumb update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = BreadcrumbStyles.getStyle(this.props);
    
    // Update items if changed
    if (newProps.items !== undefined) {
      this.items = this.props.items || [];
      this.el.setContent(this.renderBreadcrumb());
    }
    
    // Update separator if changed
    if (newProps.separator !== undefined) {
      this.el.setContent(this.renderBreadcrumb());
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