import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { ProgressListProps, ProgressListVariants, ProgressListSizes, ProgressListStates } from './ProgressList.types';
import { ProgressListStyles } from './ProgressList.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export interface ProgressItem {
  id: string;
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
  status?: 'pending' | 'in-progress' | 'completed' | 'error' | 'warning';
  description?: string;
  metadata?: Record<string, any>;
}

export class ProgressList implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: ProgressListProps;
  private validationResult: ValidationResult;
  private items: ProgressItem[] = [];
  private selectedIndex: number = -1;

  constructor(props: ProgressListProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('ProgressList', props);
    
    if (!this.validationResult.success) {
      console.error('❌ ProgressList validation failed:', this.validationResult.errors);
      throw new Error(`ProgressList validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ ProgressList warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.items = this.props.items || [];
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: ProgressListStyles.getStyle(this.props),
      content: this.renderProgressList(),
      align: 'left',
      valign: 'top',
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: ' ',
        style: { bg: 'blue' }
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

    // Handle key events for navigation
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
    });

    // Handle scroll events
    this.el.on('scroll', () => {
      this.handleScroll();
    });
  }

  private handleClick(event: any) {
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        items: this.items,
        selectedIndex: this.selectedIndex,
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
      case 'home':
        this.selectFirst();
        break;
      case 'end':
        this.selectLast();
        break;
      case 'enter':
      case 'space':
        this.selectCurrent();
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

  private handleScroll() {
    if (this.props.onScroll) {
      this.props.onScroll({
        type: 'scroll',
        target: this.el,
        position: this.el.scrollTop,
        maxScroll: this.el.maxScroll,
      });
    }
  }

  private renderProgressList(): string {
    if (this.items.length === 0) {
      return this.props.emptyMessage || 'No progress items available';
    }

    let content = '';
    
    // Header
    if (this.props.showHeader) {
      content += this.renderHeader();
      content += '\n';
    }

    // Items
    this.items.forEach((item, index) => {
      content += this.renderProgressItem(item, index);
      if (index < this.items.length - 1) {
        content += '\n';
      }
    });

    // Footer
    if (this.props.showFooter) {
      content += '\n' + this.renderFooter();
    }

    return content;
  }

  private renderHeader(): string {
    const header = this.props.header || 'Progress List';
    const separator = '─'.repeat(header.length);
    return `${header}\n${separator}`;
  }

  private renderFooter(): string {
    const totalItems = this.items.length;
    const completedItems = this.items.filter(item => item.status === 'completed').length;
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    return `Total: ${totalItems} | Completed: ${completedItems} | Progress: ${percentage}%`;
  }

  private renderProgressItem(item: ProgressItem, index: number): string {
    const isSelected = index === this.selectedIndex;
    const prefix = isSelected ? '▶ ' : '  ';
    
    let content = '';
    
    // Item prefix and label
    content += `${prefix}${item.label}`;
    
    // Progress bar
    if (this.props.showProgressBars) {
      const percentage = item.maxValue > item.minValue 
        ? Math.round(((item.value - item.minValue) / (item.maxValue - item.minValue)) * 100)
        : 100;
      
      const barWidth = this.props.progressBarWidth || 20;
      const filledWidth = Math.floor((percentage / 100) * barWidth);
      const emptyWidth = barWidth - filledWidth;
      
      const filledChar = this.props.filledCharacter || '█';
      const emptyChar = this.props.emptyCharacter || '░';
      
      content += ` [${filledChar.repeat(filledWidth)}${emptyChar.repeat(emptyWidth)}] ${percentage}%`;
    }
    
    // Status indicator
    if (this.props.showStatus) {
      const statusSymbol = this.getStatusSymbol(item.status);
      content += ` ${statusSymbol}`;
    }
    
    // Value display
    if (this.props.showValues) {
      content += ` (${item.value}/${item.maxValue})`;
    }
    
    // Description
    if (this.props.showDescriptions && item.description) {
      content += ` - ${item.description}`;
    }

    return content;
  }

  private getStatusSymbol(status?: string): string {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '⟳';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'pending':
      default:
        return '○';
    }
  }

  // Variant system methods
  setVariant(variant: ProgressListVariants) {
    this.props.variant = variant;
    this.el.style = ProgressListStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: ProgressListSizes) {
    this.props.size = size;
    this.el.style = ProgressListStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: ProgressListStates) {
    this.props.state = state;
    this.el.style = ProgressListStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // ProgressList-specific methods
  setItems(items: ProgressItem[]) {
    this.items = items;
    this.selectedIndex = -1;
    this.el.setContent(this.renderProgressList());
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

  addItem(item: ProgressItem) {
    this.items.push(item);
    this.el.setContent(this.renderProgressList());
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
      
      // Adjust selected index if needed
      if (this.selectedIndex === index) {
        this.selectedIndex = -1;
      } else if (this.selectedIndex > index) {
        this.selectedIndex--;
      }
      
      this.el.setContent(this.renderProgressList());
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

  updateItem(id: string, updates: Partial<ProgressItem>) {
    const index = this.items.findIndex(item => item.id === id);
    if (index >= 0) {
      const previousItem = { ...this.items[index] };
      this.items[index] = { ...this.items[index], ...updates };
      
      this.el.setContent(this.renderProgressList());
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
    this.selectedIndex = -1;
    this.el.setContent(this.renderProgressList());
    this.el.screen.render();
    
    if (this.props.onItemsClear) {
      this.props.onItemsClear({
        type: 'itemsclear',
        target: this.el,
      });
    }
  }

  // Selection methods
  selectItem(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.selectedIndex = index;
      this.el.setContent(this.renderProgressList());
      this.el.screen.render();
      
      if (this.props.onItemSelect) {
        this.props.onItemSelect({
          type: 'itemselect',
          target: this.el,
          item: this.items[index],
          index,
        });
      }
    }
  }

  selectNext() {
    if (this.items.length > 0) {
      this.selectItem((this.selectedIndex + 1) % this.items.length);
    }
  }

  selectPrevious() {
    if (this.items.length > 0) {
      this.selectItem(this.selectedIndex <= 0 ? this.items.length - 1 : this.selectedIndex - 1);
    }
  }

  selectFirst() {
    if (this.items.length > 0) {
      this.selectItem(0);
    }
  }

  selectLast() {
    if (this.items.length > 0) {
      this.selectItem(this.items.length - 1);
    }
  }

  selectCurrent() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.items.length) {
      this.selectItem(this.selectedIndex);
    }
  }

  // Display options
  setShowHeader(show: boolean) {
    this.props.showHeader = show;
    this.el.setContent(this.renderProgressList());
    this.el.screen.render();
  }

  setShowFooter(show: boolean) {
    this.props.showFooter = show;
    this.el.setContent(this.renderProgressList());
    this.el.screen.render();
  }

  setShowProgressBars(show: boolean) {
    this.props.showProgressBars = show;
    this.el.setContent(this.renderProgressList());
    this.el.screen.render();
  }

  setShowStatus(show: boolean) {
    this.props.showStatus = show;
    this.el.setContent(this.renderProgressList());
    this.el.screen.render();
  }

  setShowValues(show: boolean) {
    this.props.showValues = show;
    this.el.setContent(this.renderProgressList());
    this.el.screen.render();
  }

  setShowDescriptions(show: boolean) {
    this.props.showDescriptions = show;
    this.el.setContent(this.renderProgressList());
    this.el.screen.render();
  }

  setProgressBarWidth(width: number) {
    this.props.progressBarWidth = width;
    this.el.setContent(this.renderProgressList());
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
      selectedIndex: this.selectedIndex,
      showHeader: this.props.showHeader,
      showFooter: this.props.showFooter,
      showProgressBars: this.props.showProgressBars,
      showStatus: this.props.showStatus,
      showValues: this.props.showValues,
      showDescriptions: this.props.showDescriptions,
      progressBarWidth: this.props.progressBarWidth,
      filledCharacter: this.props.filledCharacter,
      emptyCharacter: this.props.emptyCharacter,
    };
  }

  // Get progress list properties
  getItems(): ProgressItem[] {
    return [...this.items];
  }

  getSelectedItem(): ProgressItem | undefined {
    return this.selectedIndex >= 0 ? this.items[this.selectedIndex] : undefined;
  }

  getSelectedIndex(): number {
    return this.selectedIndex;
  }

  getTotalItems(): number {
    return this.items.length;
  }

  getCompletedItems(): number {
    return this.items.filter(item => item.status === 'completed').length;
  }

  getProgressPercentage(): number {
    if (this.items.length === 0) return 0;
    return Math.round((this.getCompletedItems() / this.items.length) * 100);
  }

  // Update component with new props
  update(newProps: Partial<ProgressListProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('ProgressList', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ ProgressList update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = ProgressListStyles.getStyle(this.props);
    
    // Update items if changed
    if (newProps.items !== undefined) {
      this.items = this.props.items || [];
    }
    
    // Update content if any display properties changed
    if (newProps.showHeader !== undefined || 
        newProps.showFooter !== undefined ||
        newProps.showProgressBars !== undefined ||
        newProps.showStatus !== undefined ||
        newProps.showValues !== undefined ||
        newProps.showDescriptions !== undefined ||
        newProps.progressBarWidth !== undefined ||
        newProps.filledCharacter !== undefined ||
        newProps.emptyCharacter !== undefined) {
      this.el.setContent(this.renderProgressList());
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