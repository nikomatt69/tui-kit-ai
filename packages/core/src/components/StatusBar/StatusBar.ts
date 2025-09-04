import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { StatusBarProps, StatusBarVariants, StatusBarSizes, StatusBarStates } from './StatusBar.types';
import { StatusBarStyles } from './StatusBar.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export interface StatusItem {
  id: string;
  label: string;
  value: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  icon?: string;
  clickable?: boolean;
  metadata?: Record<string, any>;
}

export class StatusBar implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: StatusBarProps;
  private validationResult: ValidationResult;
  private items: StatusItem[] = [];
  private activeItem: string | null = null;

  constructor(props: StatusBarProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('StatusBar', props);
    
    if (!this.validationResult.success) {
      console.error('❌ StatusBar validation failed:', this.validationResult.errors);
      throw new Error(`StatusBar validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ StatusBar warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.items = this.props.items || [];
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: StatusBarStyles.getStyle(this.props),
      content: this.renderStatusBar(),
      align: 'left',
      valign: 'bottom',
      height: 1,
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
      case 'left':
      case 'h':
        this.selectPreviousItem();
        break;
      case 'right':
      case 'l':
        this.selectNextItem();
        break;
      case 'enter':
      case 'space':
        this.activateCurrentItem();
        break;
      case 'home':
        this.selectFirstItem();
        break;
      case 'end':
        this.selectLastItem();
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
        items: this.items,
        activeItem: this.activeItem,
      });
    }
  }

  private renderStatusBar(): string {
    if (this.items.length === 0) {
      return this.props.emptyMessage || 'No status items';
    }

    let content = '';
    
    // Left section
    if (this.props.showLeftSection) {
      content += this.renderLeftSection();
    }
    
    // Center section
    if (this.props.showCenterSection) {
      if (content) content += ' | ';
      content += this.renderCenterSection();
    }
    
    // Right section
    if (this.props.showRightSection) {
      if (content) content += ' | ';
      content += this.renderRightSection();
    }
    
    return content;
  }

  private renderLeftSection(): string {
    const leftItems = this.items.filter(item => item.type === 'info' || item.type === 'neutral');
    return this.renderItems(leftItems);
  }

  private renderCenterSection(): string {
    const centerItems = this.items.filter(item => item.type === 'success' || item.type === 'warning');
    return this.renderItems(centerItems);
  }

  private renderRightSection(): string {
    const rightItems = this.items.filter(item => item.type === 'error' || item.type === 'neutral');
    return this.renderItems(rightItems);
  }

  private renderItems(items: StatusItem[]): string {
    return items.map(item => {
      let display = '';
      
      // Icon
      if (item.icon) {
        display += `${item.icon} `;
      }
      
      // Label and value
      if (this.props.showLabels) {
        display += `${item.label}: ${item.value}`;
      } else {
        display += item.value;
      }
      
      // Active indicator
      if (item.id === this.activeItem) {
        display = `▶ ${display}`;
      }
      
      return display;
    }).join(' | ');
  }

  // Variant system methods
  setVariant(variant: StatusBarVariants) {
    this.props.variant = variant;
    this.el.style = StatusBarStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: StatusBarSizes) {
    this.props.size = size;
    this.el.style = StatusBarStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: StatusBarStates) {
    this.props.state = state;
    this.el.style = StatusBarStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // StatusBar-specific methods
  setTitle(title: string) {
    this.props.title = title;
    this.el.setContent(this.renderStatusBar());
    this.el.screen.render();
  }

  setItems(items: StatusItem[]) {
    this.items = items;
    this.activeItem = null;
    this.el.setContent(this.renderStatusBar());
    this.el.screen.render();
    
    if (this.props.onItemsChange) {
      this.props.onItemsChange({
        type: 'itemschange',
        target: this.el,
        items: this.items,
        previousItems: [],
      });
    }
  }

  addItem(item: StatusItem) {
    this.items.push(item);
    this.el.setContent(this.renderStatusBar());
    this.el.screen.render();
    
    if (this.props.onItemAdd) {
      this.props.onItemAdd({
        type: 'itemadd',
        target: this.el,
        item,
        totalItems: this.items.length,
      });
    }
  }

  removeItem(id: string) {
    const index = this.items.findIndex(item => item.id === id);
    if (index >= 0) {
      const removedItem = this.items.splice(index, 1)[0];
      
      // Clear active item if it was removed
      if (this.activeItem === id) {
        this.activeItem = null;
      }
      
      this.el.setContent(this.renderStatusBar());
      this.el.screen.render();
      
      if (this.props.onItemRemove) {
        this.props.onItemRemove({
          type: 'itemremove',
          target: this.el,
          item: removedItem,
          totalItems: this.items.length,
        });
      }
    }
  }

  updateItem(id: string, updates: Partial<StatusItem>) {
    const index = this.items.findIndex(item => item.id === id);
    if (index >= 0) {
      const previousItem = { ...this.items[index] };
      this.items[index] = { ...this.items[index], ...updates };
      
      this.el.setContent(this.renderStatusBar());
      this.el.screen.render();
      
      if (this.props.onItemUpdate) {
        this.props.onItemUpdate({
          type: 'itemupdate',
          target: this.el,
          item: this.items[index],
          previousItem,
        });
      }
    }
  }

  clearItems() {
    this.items = [];
    this.activeItem = null;
    this.el.setContent(this.renderStatusBar());
    this.el.screen.render();
    
    if (this.props.onItemsClear) {
      this.props.onItemsClear({
        type: 'itemsclear',
        target: this.el,
      });
    }
  }

  // Display options
  setShowLeftSection(show: boolean) {
    this.props.showLeftSection = show;
    this.el.setContent(this.renderStatusBar());
    this.el.screen.render();
  }

  setShowCenterSection(show: boolean) {
    this.props.showCenterSection = show;
    this.el.setContent(this.renderStatusBar());
    this.el.screen.render();
  }

  setShowRightSection(show: boolean) {
    this.props.showRightSection = show;
    this.el.setContent(this.renderStatusBar());
    this.el.screen.render();
  }

  setShowLabels(show: boolean) {
    this.props.showLabels = show;
    this.el.setContent(this.renderStatusBar());
    this.el.screen.render();
  }

  setShowSeparators(show: boolean) {
    this.props.showSeparators = show;
    this.el.setContent(this.renderStatusBar());
    this.el.screen.render();
  }

  // Item selection methods
  selectItem(id: string) {
    if (this.items.find(item => item.id === id)) {
      this.activeItem = id;
      this.el.setContent(this.renderStatusBar());
      this.el.screen.render();
      
      if (this.props.onItemSelect) {
        this.props.onItemSelect({
          type: 'itemselect',
          target: this.el,
          item: this.items.find(item => item.id === id)!,
        });
      }
    }
  }

  selectNextItem() {
    if (this.items.length > 0) {
      if (this.activeItem) {
        const currentIndex = this.items.findIndex(item => item.id === this.activeItem);
        const nextIndex = (currentIndex + 1) % this.items.length;
        this.selectItem(this.items[nextIndex].id);
      } else {
        this.selectItem(this.items[0].id);
      }
    }
  }

  selectPreviousItem() {
    if (this.items.length > 0) {
      if (this.activeItem) {
        const currentIndex = this.items.findIndex(item => item.id === this.activeItem);
        const prevIndex = currentIndex <= 0 ? this.items.length - 1 : currentIndex - 1;
        this.selectItem(this.items[prevIndex].id);
      } else {
        this.selectItem(this.items[this.items.length - 1].id);
      }
    }
  }

  selectFirstItem() {
    if (this.items.length > 0) {
      this.selectItem(this.items[0].id);
    }
  }

  selectLastItem() {
    if (this.items.length > 0) {
      this.selectItem(this.items[this.items.length - 1].id);
    }
  }

  activateCurrentItem() {
    if (this.activeItem) {
      const item = this.items.find(item => item.id === this.activeItem);
      if (item && item.clickable) {
        if (this.props.onItemActivate) {
          this.props.onItemActivate({
            type: 'itemactivate',
            target: this.el,
            item,
          });
        }
      }
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
      items: this.items,
      activeItem: this.activeItem,
      showLeftSection: this.props.showLeftSection,
      showCenterSection: this.props.showCenterSection,
      showRightSection: this.props.showRightSection,
      showLabels: this.props.showLabels,
      showSeparators: this.props.showSeparators,
    };
  }

  // Get status bar properties
  getTitle(): string | undefined {
    return this.props.title;
  }

  getItems(): StatusItem[] {
    return [...this.items];
  }

  getActiveItem(): string | null {
    return this.activeItem;
  }

  getActiveItemData(): StatusItem | undefined {
    return this.activeItem ? this.items.find(item => item.id === this.activeItem) : undefined;
  }

  getItemCount(): number {
    return this.items.length;
  }

  getItemsByType(type: string): StatusItem[] {
    return this.items.filter(item => item.type === type);
  }

  // Update component with new props
  update(newProps: Partial<StatusBarProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('StatusBar', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ StatusBar update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = StatusBarStyles.getStyle(this.props);
    
    // Update items if changed
    if (newProps.items !== undefined) {
      this.setItems(this.props.items || []);
    }
    
    // Update content if any display properties changed
    if (newProps.title !== undefined ||
        newProps.showLeftSection !== undefined ||
        newProps.showCenterSection !== undefined ||
        newProps.showRightSection !== undefined ||
        newProps.showLabels !== undefined ||
        newProps.showSeparators !== undefined) {
      this.el.setContent(this.renderStatusBar());
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