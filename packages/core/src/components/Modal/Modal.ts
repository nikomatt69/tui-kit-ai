import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { ModalProps, ModalVariants, ModalSizes, ModalStates } from './Modal.types';
import { ModalStyles } from './Modal.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Modal implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: ModalProps;
  private validationResult: ValidationResult;
  private isVisible: boolean = false;
  private overlay: Widgets.BoxElement | null = null;

  constructor(props: ModalProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Modal', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Modal validation failed:', this.validationResult.errors);
      throw new Error(`Modal validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Modal warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: ModalStyles.getStyle(this.props),
      content: this.renderModal(),
      align: 'center',
      valign: 'middle',
      hidden: true, // Start hidden
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
    this.createOverlay();
  }
  
  private createOverlay() {
    if (this.props.showOverlay) {
      // Create overlay element
      this.overlay = this.el.screen.children.find(child => 
        child.type === 'box' && (child as any).overlay === true
      ) as Widgets.BoxElement;
      
      if (!this.overlay) {
        this.overlay = this.el.screen.children[0] as Widgets.BoxElement;
      }
    }
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

    // Handle key events
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
      case 'escape':
        if (this.props.closeOnEscape) {
          this.close();
        }
        break;
      case 'enter':
        if (this.props.closeOnEnter) {
          this.close();
        }
        break;
    }
  }

  private handleClick(event: any) {
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        isVisible: this.isVisible,
      });
    }
  }

  private renderModal(): string {
    let content = '';
    
    // Header
    if (this.props.title) {
      content += `${this.props.title}\n`;
      content += '─'.repeat(this.props.title.length) + '\n';
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
  setVariant(variant: ModalVariants) {
    this.props.variant = variant;
    this.el.style = ModalStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: ModalSizes) {
    this.props.size = size;
    this.el.style = ModalStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: ModalStates) {
    this.props.state = state;
    this.el.style = ModalStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Modal-specific methods
  setTitle(title: string) {
    this.props.title = title;
    this.el.setContent(this.renderModal());
    this.el.screen.render();
  }

  setContent(content: string) {
    this.props.content = content;
    this.el.setContent(this.renderModal());
    this.el.screen.render();
  }

  setFooter(footer: string) {
    this.props.footer = footer;
    this.el.setContent(this.renderModal());
    this.el.screen.render();
  }

  setShowOverlay(show: boolean) {
    this.props.showOverlay = show;
    if (show && !this.overlay) {
      this.createOverlay();
    }
  }

  setCloseOnEscape(close: boolean) {
    this.props.closeOnEscape = close;
  }

  setCloseOnEnter(close: boolean) {
    this.props.closeOnEnter = close;
  }

  setCloseOnOverlayClick(close: boolean) {
    this.props.closeOnOverlayClick = close;
  }

  // Modal visibility methods
  show() {
    this.isVisible = true;
    this.el.show();
    
    if (this.overlay && this.props.showOverlay) {
      this.overlay.show();
    }
    
    this.el.screen.render();
    
    if (this.props.onShow) {
      this.props.onShow({
        type: 'show',
        target: this.el,
      });
    }
  }

  hide() {
    this.isVisible = false;
    this.el.hide();
    
    if (this.overlay && this.props.showOverlay) {
      this.overlay.hide();
    }
    
    this.el.screen.render();
    
    if (this.props.onHide) {
      this.props.onHide({
        type: 'hide',
        target: this.el,
      });
    }
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  close() {
    this.hide();
    
    if (this.props.onClose) {
      this.props.onClose({
        type: 'close',
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
      title: this.props.title,
      content: this.props.content,
      footer: this.props.footer,
      isVisible: this.isVisible,
      showOverlay: this.props.showOverlay,
      closeOnEscape: this.props.closeOnEscape,
      closeOnEnter: this.props.closeOnEnter,
      closeOnOverlayClick: this.props.closeOnOverlayClick,
    };
  }

  // Get modal properties
  getTitle(): string | undefined {
    return this.props.title;
  }

  getContent(): string | undefined {
    return this.props.content;
  }

  getFooter(): string | undefined {
    return this.props.footer;
  }

  isModalVisible(): boolean {
    return this.isVisible;
  }

  // Update component with new props
  update(newProps: Partial<ModalProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Modal', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Modal update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = ModalStyles.getStyle(this.props);
    
    // Update content if title, content, or footer changed
    if (newProps.title !== undefined || 
        newProps.content !== undefined || 
        newProps.footer !== undefined) {
      this.el.setContent(this.renderModal());
    }
    
    // Update overlay settings
    if (newProps.showOverlay !== undefined) {
      this.setShowOverlay(this.props.showOverlay);
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