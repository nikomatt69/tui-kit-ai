import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { TabsProps, TabsVariants, TabsSizes, TabsStates } from './Tabs.types';
import { TabsStyles } from './Tabs.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export interface TabItem {
  id: string;
  label: string;
  content: string;
  icon?: string;
  disabled?: boolean;
  closable?: boolean;
  metadata?: Record<string, any>;
}

export class Tabs implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: TabsProps;
  private validationResult: ValidationResult;
  private tabs: TabItem[] = [];
  private activeTabId: string | null = null;
  private focusedTabIndex: number = -1;

  constructor(props: TabsProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Tabs', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Tabs validation failed:', this.validationResult.errors);
      throw new Error(`Tabs validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Tabs warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.tabs = this.props.tabs || [];
    
    // Set active tab
    if (this.tabs.length > 0) {
      this.activeTabId = this.props.defaultActiveTab || this.tabs[0].id;
    }
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: TabsStyles.getStyle(this.props),
      content: this.renderTabs(),
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
        this.focusPreviousTab();
        break;
      case 'right':
      case 'l':
        this.focusNextTab();
        break;
      case 'enter':
      case 'space':
        this.activateFocusedTab();
        break;
      case 'home':
        this.focusFirstTab();
        break;
      case 'end':
        this.focusLastTab();
        break;
      case 'w':
        if (event.ctrl && this.props.closable) {
          this.closeActiveTab();
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
        tabs: this.tabs,
        activeTabId: this.activeTabId,
        focusedTabIndex: this.focusedTabIndex,
      });
    }
  }

  private renderTabs(): string {
    if (this.tabs.length === 0) {
      return this.props.emptyMessage || 'No tabs defined';
    }

    let content = '';
    
    // Title
    if (this.props.title) {
      content += `${this.props.title}\n`;
    }
    
    // Tab headers
    content += this.renderTabHeaders();
    content += '\n';
    
    // Separator
    if (this.props.showSeparators) {
      content += this.renderSeparator();
      content += '\n';
    }
    
    // Tab content
    const activeTab = this.tabs.find(tab => tab.id === this.activeTabId);
    if (activeTab) {
      content += activeTab.content;
    } else {
      content += this.props.noActiveTabMessage || 'No active tab';
    }
    
    return content;
  }

  private renderTabHeaders(): string {
    let headers = '';
    
    this.tabs.forEach((tab, index) => {
      const isActive = tab.id === this.activeTabId;
      const isFocused = index === this.focusedTabIndex;
      const isDisabled = tab.disabled;
      
      let tabHeader = '';
      
      // Tab icon
      if (tab.icon && this.props.showTabIcons) {
        tabHeader += `${tab.icon} `;
      }
      
      // Tab label
      if (isActive) {
        tabHeader += `**${tab.label}**`;
      } else if (isFocused) {
        tabHeader += `_${tab.label}_`;
      } else {
        tabHeader += tab.label;
      }
      
      // Tab status indicators
      if (isDisabled) {
        tabHeader += ' [disabled]';
      }
      
      if (tab.closable && this.props.closable) {
        tabHeader += ' [x]';
      }
      
      // Tab separator
      if (index < this.tabs.length - 1) {
        tabHeader += ' | ';
      }
      
      headers += tabHeader;
    });
    
    return headers;
  }

  private renderSeparator(): string {
    const totalWidth = this.tabs.reduce((width, tab) => {
      return width + tab.label.length + (tab.icon ? 2 : 0) + (tab.closable ? 4 : 0);
    }, 0) + (this.tabs.length - 1) * 3; // Account for separators
    
    return '-'.repeat(Math.max(totalWidth, 20));
  }

  // Variant system methods
  setVariant(variant: TabsVariants) {
    this.props.variant = variant;
    this.el.style = TabsStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: TabsSizes) {
    this.props.size = size;
    this.el.style = TabsStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: TabsStates) {
    this.props.state = state;
    this.el.style = TabsStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Tabs-specific methods
  setTitle(title: string) {
    this.props.title = title;
    this.el.setContent(this.renderTabs());
    this.el.screen.render();
  }

  setTabs(tabs: TabItem[]) {
    this.tabs = tabs;
    
    // Reset active tab if current one doesn't exist
    if (this.activeTabId && !this.tabs.find(tab => tab.id === this.activeTabId)) {
      this.activeTabId = this.tabs.length > 0 ? this.tabs[0].id : null;
    }
    
    // Reset focused tab
    this.focusedTabIndex = -1;
    
    this.el.setContent(this.renderTabs());
    this.el.screen.render();
    
    if (this.props.onTabsChange) {
      this.props.onTabsChange({
        type: 'tabschange',
        target: this.el,
        tabs: this.tabs,
        previousTabs: [],
      });
    }
  }

  addTab(tab: TabItem) {
    this.tabs.push(tab);
    
    // Set as active if it's the first tab
    if (this.tabs.length === 1) {
      this.activeTabId = tab.id;
    }
    
    this.el.setContent(this.renderTabs());
    this.el.screen.render();
    
    if (this.props.onTabAdd) {
      this.props.onTabAdd({
        type: 'tabadd',
        target: this.el,
        tab,
        totalTabs: this.tabs.length,
      });
    }
  }

  removeTab(id: string) {
    const index = this.tabs.findIndex(tab => tab.id === id);
    if (index >= 0) {
      const removedTab = this.tabs.splice(index, 1)[0];
      
      // Handle active tab removal
      if (this.activeTabId === id) {
        if (this.tabs.length > 0) {
          this.activeTabId = this.tabs[Math.min(index, this.tabs.length - 1)].id;
        } else {
          this.activeTabId = null;
        }
      }
      
      // Adjust focused tab index
      if (this.focusedTabIndex >= index) {
        this.focusedTabIndex = Math.max(-1, this.focusedTabIndex - 1);
      }
      
      this.el.setContent(this.renderTabs());
      this.el.screen.render();
      
      if (this.props.onTabRemove) {
        this.props.onTabRemove({
          type: 'tabremove',
          target: this.el,
          tab: removedTab,
          totalTabs: this.tabs.length,
        });
      }
    }
  }

  updateTab(id: string, updates: Partial<TabItem>) {
    const index = this.tabs.findIndex(tab => tab.id === id);
    if (index >= 0) {
      const previousTab = { ...this.tabs[index] };
      this.tabs[index] = { ...this.tabs[index], ...updates };
      
      this.el.setContent(this.renderTabs());
      this.el.screen.render();
      
      if (this.props.onTabUpdate) {
        this.props.onTabUpdate({
          type: 'tabupdate',
          target: this.el,
          tab: this.tabs[index],
          previousTab,
        });
      }
    }
  }

  clearTabs() {
    this.tabs = [];
    this.activeTabId = null;
    this.focusedTabIndex = -1;
    this.el.setContent(this.renderTabs());
    this.el.screen.render();
    
    if (this.props.onTabsClear) {
      this.props.onTabsClear({
        type: 'tabsclear',
        target: this.el,
      });
    }
  }

  // Display options
  setShowTabIcons(show: boolean) {
    this.props.showTabIcons = show;
    this.el.setContent(this.renderTabs());
    this.el.screen.render();
  }

  setShowSeparators(show: boolean) {
    this.props.showSeparators = show;
    this.el.setContent(this.renderTabs());
    this.el.screen.render();
  }

  // Tab activation methods
  activateTab(id: string) {
    const tab = this.tabs.find(tab => tab.id === id);
    if (tab && !tab.disabled) {
      const previousActiveTab = this.activeTabId;
      this.activeTabId = id;
      
      this.el.setContent(this.renderTabs());
      this.el.screen.render();
      
      if (this.props.onTabActivate) {
        this.props.onTabActivate({
          type: 'tabactivate',
          target: this.el,
          tabId: id,
          tab,
          previousActiveTab,
        });
      }
    }
  }

  activateNextTab() {
    if (this.activeTabId) {
      const currentIndex = this.tabs.findIndex(tab => tab.id === this.activeTabId);
      const nextIndex = (currentIndex + 1) % this.tabs.length;
      const nextTab = this.tabs[nextIndex];
      
      if (!nextTab.disabled) {
        this.activateTab(nextTab.id);
      }
    }
  }

  activatePreviousTab() {
    if (this.activeTabId) {
      const currentIndex = this.tabs.findIndex(tab => tab.id === this.activeTabId);
      const prevIndex = currentIndex <= 0 ? this.tabs.length - 1 : currentIndex - 1;
      const prevTab = this.tabs[prevIndex];
      
      if (!prevTab.disabled) {
        this.activateTab(prevTab.id);
      }
    }
  }

  activateFirstTab() {
    if (this.tabs.length > 0) {
      const firstTab = this.tabs[0];
      if (!firstTab.disabled) {
        this.activateTab(firstTab.id);
      }
    }
  }

  activateLastTab() {
    if (this.tabs.length > 0) {
      const lastTab = this.tabs[this.tabs.length - 1];
      if (!lastTab.disabled) {
        this.activateTab(lastTab.id);
      }
    }
  }

  // Tab focus methods
  focusTab(index: number) {
    if (index >= 0 && index < this.tabs.length) {
      this.focusedTabIndex = index;
      this.el.setContent(this.renderTabs());
      this.el.screen.render();
      
      if (this.props.onTabFocus) {
        this.props.onTabFocus({
          type: 'tabfocus',
          target: this.el,
          tabIndex: this.focusedTabIndex,
          tab: this.tabs[this.focusedTabIndex],
        });
      }
    }
  }

  focusNextTab() {
    if (this.focusedTabIndex < this.tabs.length - 1) {
      this.focusTab(this.focusedTabIndex + 1);
    } else {
      this.focusTab(0);
    }
  }

  focusPreviousTab() {
    if (this.focusedTabIndex > 0) {
      this.focusTab(this.focusedTabIndex - 1);
    } else {
      this.focusTab(this.tabs.length - 1);
    }
  }

  focusFirstTab() {
    this.focusTab(0);
  }

  focusLastTab() {
    this.focusTab(this.tabs.length - 1);
  }

  clearFocus() {
    this.focusedTabIndex = -1;
    this.el.setContent(this.renderTabs());
    this.el.screen.render();
  }

  activateFocusedTab() {
    if (this.focusedTabIndex >= 0 && this.focusedTabIndex < this.tabs.length) {
      const tab = this.tabs[this.focusedTabIndex];
      if (!tab.disabled) {
        this.activateTab(tab.id);
      }
    }
  }

  // Tab management methods
  closeTab(id: string) {
    if (this.props.closable) {
      this.removeTab(id);
    }
  }

  closeActiveTab() {
    if (this.activeTabId && this.props.closable) {
      this.closeTab(this.activeTabId);
    }
  }

  closeFocusedTab() {
    if (this.focusedTabIndex >= 0 && this.focusedTabIndex < this.tabs.length) {
      const tab = this.tabs[this.focusedTabIndex];
      if (tab.closable && this.props.closable) {
        this.closeTab(tab.id);
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
      tabs: this.tabs,
      activeTabId: this.activeTabId,
      focusedTabIndex: this.focusedTabIndex,
      showTabIcons: this.props.showTabIcons,
      showSeparators: this.props.showSeparators,
      closable: this.props.closable,
    };
  }

  // Get tabs properties
  getTitle(): string | undefined {
    return this.props.title;
  }

  getTabs(): TabItem[] {
    return [...this.tabs];
  }

  getActiveTabId(): string | null {
    return this.activeTabId;
  }

  getActiveTab(): TabItem | undefined {
    return this.tabs.find(tab => tab.id === this.activeTabId);
  }

  getFocusedTabIndex(): number {
    return this.focusedTabIndex;
  }

  getFocusedTab(): TabItem | undefined {
    return this.focusedTabIndex >= 0 ? this.tabs[this.focusedTabIndex] : undefined;
  }

  getTabCount(): number {
    return this.tabs.length;
  }

  getTabById(id: string): TabItem | undefined {
    return this.tabs.find(tab => tab.id === id);
  }

  getTabByIndex(index: number): TabItem | undefined {
    return this.tabs[index];
  }

  // Update component with new props
  update(newProps: Partial<TabsProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Tabs', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Tabs update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = TabsStyles.getStyle(this.props);
    
    // Update tabs if changed
    if (newProps.tabs !== undefined) {
      this.setTabs(this.props.tabs || []);
    }
    
    // Update content if any display properties changed
    if (newProps.title !== undefined ||
        newProps.showTabIcons !== undefined ||
        newProps.showSeparators !== undefined) {
      this.el.setContent(this.renderTabs());
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