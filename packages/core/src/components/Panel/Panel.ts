import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { PanelProps, PanelVariants, PanelSizes, PanelStates } from './Panel.types';
import { PanelStyles } from './Panel.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Panel implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: PanelProps;
  private validationResult: ValidationResult;
  private children: Widgets.BlessedElement[] = [];

  constructor(props: PanelProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Panel', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Panel validation failed:', this.validationResult.errors);
      throw new Error(`Panel validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Panel warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: PanelStyles.getStyle(this.props),
      content: this.renderPanel(),
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

    // Handle click events
    if (this.props.clickable) {
      this.el.on('click', (event: any) => {
        this.handleClick(event);
      });
    }

    // Handle resize events
    this.el.on('resize', () => {
      this.handleResize();
    });
  }

  private handleClick(event: any) {
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        children: this.children,
      });
    }
  }

  private handleResize() {
    if (this.props.onResize) {
      this.props.onResize({
        type: 'resize',
        target: this.el,
        width: this.el.width,
        height: this.el.height,
      });
    }
  }

  private renderPanel(): string {
    let content = '';
    
    // Header
    if (this.props.header) {
      content += `${this.props.header}\n`;
      content += '─'.repeat(this.props.header.length) + '\n';
    }
    
    // Body content
    if (this.props.content) {
      content += this.props.content;
    }
    
    // Footer
    if (this.props.footer) {
      content += '\n' + '─'.repeat(20) + '\n';
      content += this.props.footer;
    }
    
    return content;
  }

  // Variant system methods
  setVariant(variant: PanelVariants) {
    this.props.variant = variant;
    this.el.style = PanelStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: PanelSizes) {
    this.props.size = size;
    this.el.style = PanelStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: PanelStates) {
    this.props.state = state;
    this.el.style = PanelStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Panel-specific methods
  setHeader(header: string) {
    this.props.header = header;
    this.el.setContent(this.renderPanel());
    this.el.screen.render();
  }

  setContent(content: string) {
    this.props.content = content;
    this.el.setContent(this.renderPanel());
    this.el.screen.render();
  }

  setFooter(footer: string) {
    this.props.footer = footer;
    this.el.setContent(this.renderPanel());
    this.el.screen.render();
  }

  setCollapsible(collapsible: boolean) {
    this.props.collapsible = collapsible;
  }

  setCollapsed(collapsed: boolean) {
    this.props.collapsed = collapsed;
    if (collapsed) {
      this.el.hide();
    } else {
      this.el.show();
    }
    this.el.screen.render();
  }

  setResizable(resizable: boolean) {
    this.props.resizable = resizable;
  }

  setDraggable(draggable: boolean) {
    this.props.draggable = draggable;
  }

  setScrollable(scrollable: boolean) {
    this.props.scrollable = scrollable;
    this.el.scrollable = scrollable;
    this.el.screen.render();
  }

  setShowBorder(show: boolean) {
    this.props.showBorder = show;
    if (show) {
      this.el.style.border = {
        type: 'line',
        fg: this.props.borderColor || 'gray',
        bg: this.el.style.bg,
      };
    } else {
      this.el.style.border = {
        type: 'none',
        fg: 'transparent',
        bg: 'transparent',
      };
    }
    this.el.screen.render();
  }

  setBorderColor(color: string) {
    this.props.borderColor = color;
    if (this.props.showBorder) {
      this.el.style.border = {
        type: 'line',
        fg: color,
        bg: this.el.style.bg,
      };
      this.el.screen.render();
    }
  }

  // Panel visibility methods
  show() {
    this.el.show();
    this.el.screen.render();
    
    if (this.props.onShow) {
      this.props.onShow({
        type: 'show',
        target: this.el,
      });
    }
  }

  hide() {
    this.el.hide();
    this.el.screen.render();
    
    if (this.props.onHide) {
      this.props.onHide({
        type: 'hide',
        target: this.el,
      });
    }
  }

  toggle() {
    if (this.el.hidden) {
      this.show();
    } else {
      this.hide();
    }
  }

  // Panel content methods
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
      header: this.props.header,
      content: this.props.content,
      footer: this.props.footer,
      children: this.children,
      collapsible: this.props.collapsible,
      collapsed: this.props.collapsed,
      resizable: this.props.resizable,
      draggable: this.props.draggable,
      scrollable: this.props.scrollable,
      showBorder: this.props.showBorder,
      borderColor: this.props.borderColor,
    };
  }

  // Get panel properties
  getHeader(): string | undefined {
    return this.props.header;
  }

  getContent(): string | undefined {
    return this.props.content;
  }

  getFooter(): string | undefined {
    return this.props.footer;
  }

  getChildren(): Widgets.BlessedElement[] {
    return [...this.children];
  }

  isCollapsed(): boolean {
    return this.props.collapsed || false;
  }

  isCollapsible(): boolean {
    return this.props.collapsible || false;
  }

  isResizable(): boolean {
    return this.props.resizable || false;
  }

  isDraggable(): boolean {
    return this.props.draggable || false;
  }

  isScrollable(): boolean {
    return this.props.scrollable || false;
  }

  // Update component with new props
  update(newProps: Partial<PanelProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Panel', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Panel update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = PanelStyles.getStyle(this.props);
    
    // Update content if header, content, or footer changed
    if (newProps.header !== undefined || 
        newProps.content !== undefined || 
        newProps.footer !== undefined) {
      this.el.setContent(this.renderPanel());
    }
    
    // Update border settings
    if (newProps.showBorder !== undefined) {
      this.setShowBorder(this.props.showBorder);
    }
    
    if (newProps.borderColor !== undefined) {
      this.setBorderColor(this.props.borderColor);
    }
    
    // Update scrollable setting
    if (newProps.scrollable !== undefined) {
      this.setScrollable(this.props.scrollable);
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