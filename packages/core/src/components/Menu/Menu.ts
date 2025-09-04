import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { MenuProps, MenuVariants, MenuSizes, MenuStates, MenuItem } from './Menu.types';
import { MenuStyles } from './Menu.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Menu implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: MenuProps;
  private validationResult: ValidationResult;
  private items: MenuItem[] = [];
  private selectedIndex: number = 0;
  private isOpen: boolean = false;

  constructor(props: MenuProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Menu', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Menu validation failed:', this.validationResult.errors);
      throw new Error(`Menu validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Menu warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.items = this.props.items || [];
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: MenuStyles.getStyle(this.props),
      content: this.renderMenu(),
      align: 'left',
      valign: 'top',
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
        this.selectPrevious();
        break;
      case 'down':
      case 'j':
        this.selectNext();
        break;
      case 'enter':
      case 'space':
        this.selectCurrentItem();
        break;
      case 'home':
        this.selectFirst();
        break;
      case 'end':
        this.selectLast();
        break;
      case 'escape':
        this.close();
        break;
    }
  }

  private handleClick(event: any) {
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        selectedItem: this.items[this.selectedIndex],
        selectedIndex: this.selectedIndex,
      });
    }
  }

  private renderMenu(): string {
    if (this.items.length === 0) {
      return this.props.emptyMessage || 'No menu items';
    }

    let content = '';
    
    if (this.props.title) {
      content += `${this.props.title}\n`;
      content += '─'.repeat(this.props.title.length) + '\n';
    }

    this.items.forEach((item, index) => {
      const isSelected = index === this.selectedIndex;
      const isDisabled = item.disabled || false;
      
      let line = '';
      
      // Selection indicator
      if (isSelected) {
        line += this.props.selectionIndicator || '▶ ';
      } else {
        line += '  ';
      }
      
      // Item content
      if (isDisabled) {
        line += `[${item.label}]`;
      } else {
        line += item.label;
      }
      
      // Submenu indicator
      if (item.items && item.items.length > 0) {
        line += ` ${this.props.submenuIndicator || '▶'}`;
      }
      
      // Separator
      if (index < this.items.length - 1) {
        line += '\n';
      }
      
      content += line;
    });

    return content;
  }

  // Variant system methods
  setVariant(variant: MenuVariants) {
    this.props.variant = variant;
    this.el.style = MenuStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: MenuSizes) {
    this.props.size = size;
    this.el.style = MenuStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: MenuStates) {
    this.props.state = state;
    this.el.style = MenuStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Menu-specific methods
  setItems(items: MenuItem[]) {
    this.items = items;
    this.selectedIndex = 0;
    this.el.setContent(this.renderMenu());
    this.el.screen.render();
  }

  addItem(item: MenuItem) {
    this.items.push(item);
    this.el.setContent(this.renderMenu());
    this.el.screen.render();
  }

  removeItem(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      if (this.selectedIndex >= this.items.length) {
        this.selectedIndex = Math.max(0, this.items.length - 1);
      }
      this.el.setContent(this.renderMenu());
      this.el.screen.render();
    }
  }

  clearItems() {
    this.items = [];
    this.selectedIndex = 0;
    this.el.setContent(this.renderMenu());
    this.el.screen.render();
  }

  setSelectedIndex(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.selectedIndex = index;
      this.el.setContent(this.renderMenu());
      this.el.screen.render();
    }
  }

  setTitle(title: string) {
    this.props.title = title;
    this.el.setContent(this.renderMenu());
    this.el.screen.render();
  }

  setSelectionIndicator(indicator: string) {
    this.props.selectionIndicator = indicator;
    this.el.setContent(this.renderMenu());
    this.el.screen.render();
  }

  setSubmenuIndicator(indicator: string) {
    this.props.submenuIndicator = indicator;
    this.el.setContent(this.renderMenu());
    this.el.screen.render();
  }

  // Navigation methods
  selectNext() {
    if (this.items.length > 0) {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
      this.el.setContent(this.renderMenu());
      this.el.screen.render();
    }
  }

  selectPrevious() {
    if (this.items.length > 0) {
      this.selectedIndex = this.selectedIndex === 0 ? this.items.length - 1 : this.selectedIndex - 1;
      this.el.setContent(this.renderMenu());
      this.el.screen.render();
    }
  }

  selectFirst() {
    if (this.items.length > 0) {
      this.selectedIndex = 0;
      this.el.setContent(this.renderMenu());
      this.el.screen.render();
    }
  }

  selectLast() {
    if (this.items.length > 0) {
      this.selectedIndex = this.items.length - 1;
      this.el.setContent(this.renderMenu());
      this.el.screen.render();
    }
  }

  selectCurrentItem() {
    if (this.items.length > 0) {
      const item = this.items[this.selectedIndex];
      if (!item.disabled) {
        if (this.props.onItemSelect) {
          this.props.onItemSelect({
            type: 'itemselect',
            target: this.el,
            item,
            index: this.selectedIndex,
          });
        }
      }
    }
  }

  open() {
    this.isOpen = true;
    this.el.show();
    this.el.screen.render();
  }

  close() {
    this.isOpen = false;
    this.el.hide();
    this.el.screen.render();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      items: this.items,
      selectedIndex: this.selectedIndex,
      isOpen: this.isOpen,
      title: this.props.title,
      selectionIndicator: this.props.selectionIndicator,
      submenuIndicator: this.props.submenuIndicator,
    };
  }

  // Get menu properties
  getItems(): MenuItem[] {
    return [...this.items];
  }

  getSelectedIndex(): number {
    return this.selectedIndex;
  }

  getSelectedItem(): MenuItem | undefined {
    return this.items[this.selectedIndex];
  }

  isMenuOpen(): boolean {
    return this.isOpen;
  }

  // Update component with new props
  update(newProps: Partial<MenuProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Menu', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Menu update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = MenuStyles.getStyle(this.props);
    
    // Update content if items or display options changed
    if (newProps.items !== undefined || 
        newProps.title !== undefined || 
        newProps.selectionIndicator !== undefined ||
        newProps.submenuIndicator !== undefined) {
      this.items = this.props.items || [];
      this.el.setContent(this.renderMenu());
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