import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { HelpOverlayProps, HelpOverlayVariants, HelpOverlaySizes, HelpOverlayStates } from './HelpOverlay.types';
import { HelpOverlayStyles } from './HelpOverlay.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class HelpOverlay implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: HelpOverlayProps;
  private validationResult: ValidationResult;
  private isVisible: boolean = false;
  private helpItems: any[] = [];

  constructor(props: HelpOverlayProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('HelpOverlay', props);
    
    if (!this.validationResult.success) {
      console.error('❌ HelpOverlay validation failed:', this.validationResult.errors);
      throw new Error(`HelpOverlay validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ HelpOverlay warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: HelpOverlayStyles.getStyle(this.props),
      content: this.renderHelpContent(),
      align: 'center',
      valign: 'middle',
      hidden: true, // Start hidden
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
    this.setupHelpItems();
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

    // Handle keyboard events for help navigation
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
    });
  }

  private setupHelpItems() {
    this.helpItems = this.props.helpItems || [
      { key: 'h', description: 'Show/hide help' },
      { key: 'q', description: 'Quit' },
      { key: 'ESC', description: 'Close help' },
      { key: '↑↓', description: 'Navigate help items' },
      { key: 'Enter', description: 'Select help item' },
    ];
  }

  private renderHelpContent(): string {
    if (!this.isVisible) return '';
    
    let content = '';
    
    if (this.props.title) {
      content += `${this.props.title}\n`;
      content += '─'.repeat(this.props.title.length) + '\n\n';
    }
    
    this.helpItems.forEach((item, index) => {
      const key = item.key.padEnd(8);
      const description = item.description || '';
      content += `${key} ${description}\n`;
    });
    
    if (this.props.footer) {
      content += '\n' + this.props.footer;
    }
    
    return content;
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'h':
      case 'H':
        this.toggle();
        break;
      case 'escape':
      case 'ESC':
        this.hide();
        break;
      case 'q':
      case 'Q':
        this.hide();
        if (this.props.onQuit) {
          this.props.onQuit();
        }
        break;
    }
  }

  // Variant system methods
  setVariant(variant: HelpOverlayVariants) {
    this.props.variant = variant;
    this.el.style = HelpOverlayStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: HelpOverlaySizes) {
    this.props.size = size;
    this.el.style = HelpOverlayStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: HelpOverlayStates) {
    this.props.state = state;
    this.el.style = HelpOverlayStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // HelpOverlay-specific methods
  show() {
    this.isVisible = true;
    this.el.setContent(this.renderHelpContent());
    this.el.show();
    this.el.screen.render();
    
    if (this.props.onShow) {
      this.props.onShow();
    }
  }

  hide() {
    this.isVisible = false;
    this.el.hide();
    this.el.screen.render();
    
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  setHelpItems(items: any[]) {
    this.helpItems = items;
    if (this.isVisible) {
      this.el.setContent(this.renderHelpContent());
      this.el.screen.render();
    }
  }

  addHelpItem(item: any) {
    this.helpItems.push(item);
    if (this.isVisible) {
      this.el.setContent(this.renderHelpContent());
      this.el.screen.render();
    }
  }

  removeHelpItem(key: string) {
    const index = this.helpItems.findIndex(item => item.key === key);
    if (index > -1) {
      this.helpItems.splice(index, 1);
      if (this.isVisible) {
        this.el.setContent(this.renderHelpContent());
        this.el.screen.render();
      }
    }
  }

  setTitle(title: string) {
    this.props.title = title;
    if (this.isVisible) {
      this.el.setContent(this.renderHelpContent());
      this.el.screen.render();
    }
  }

  setFooter(footer: string) {
    this.props.footer = footer;
    if (this.isVisible) {
      this.el.setContent(this.renderHelpContent());
      this.el.screen.render();
    }
  }

  setPosition(x: number, y: number) {
    this.el.left = x;
    this.el.top = y;
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      isVisible: this.isVisible,
      title: this.props.title,
      footer: this.props.footer,
      helpItems: this.helpItems,
      position: {
        left: this.el.left,
        top: this.el.top,
      },
    };
  }

  // Get help overlay properties
  isHelpVisible(): boolean {
    return this.isVisible;
  }

  getHelpItems(): any[] {
    return [...this.helpItems];
  }

  getTitle(): string | undefined {
    return this.props.title;
  }

  getFooter(): string | undefined {
    return this.props.footer;
  }

  // Update component with new props
  update(newProps: Partial<HelpOverlayProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('HelpOverlay', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ HelpOverlay update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = HelpOverlayStyles.getStyle(this.props);
    
    // Update help items if changed
    if (newProps.helpItems !== undefined) {
      this.setupHelpItems();
    }
    
    // Update content if visible
    if (this.isVisible) {
      this.el.setContent(this.renderHelpContent());
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
    this.show();
  }

  hide() {
    this.hide();
  }

  // Get validation result for debugging
  getValidationResult(): ValidationResult {
    return this.validationResult;
  }
}