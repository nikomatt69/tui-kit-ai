import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { NotificationProps, NotificationVariants, NotificationSizes, NotificationStates } from './Notification.types';
import { NotificationStyles } from './Notification.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Notification implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: NotificationProps;
  private validationResult: ValidationResult;
  private isVisible: boolean = false;
  private autoHideTimeout: NodeJS.Timeout | null = null;

  constructor(props: NotificationProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Notification', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Notification validation failed:', this.validationResult.errors);
      throw new Error(`Notification validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Notification warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: NotificationStyles.getStyle(this.props),
      content: this.renderNotification(),
      align: 'center',
      valign: 'top',
      hidden: true, // Start hidden
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
      case 'space':
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
    
    if (this.props.closeOnClick) {
      this.close();
    }
  }

  private renderNotification(): string {
    let content = '';
    
    // Icon
    if (this.props.icon) {
      content += `${this.props.icon} `;
    }
    
    // Title
    if (this.props.title) {
      content += `${this.props.title}`;
      if (this.props.message) {
        content += '\n';
      }
    }
    
    // Message
    if (this.props.message) {
      content += this.props.message;
    }
    
    // Close button
    if (this.props.showCloseButton) {
      content += ` [${this.props.closeButtonText || '×'}]`;
    }
    
    return content;
  }

  // Variant system methods
  setVariant(variant: NotificationVariants) {
    this.props.variant = variant;
    this.el.style = NotificationStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: NotificationSizes) {
    this.props.size = size;
    this.el.style = NotificationStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: NotificationStates) {
    this.props.state = state;
    this.el.style = NotificationStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Notification-specific methods
  setTitle(title: string) {
    this.props.title = title;
    this.el.setContent(this.renderNotification());
    this.el.screen.render();
  }

  setMessage(message: string) {
    this.props.message = message;
    this.el.setContent(this.renderNotification());
    this.el.screen.render();
  }

  setIcon(icon: string) {
    this.props.icon = icon;
    this.el.setContent(this.renderNotification());
    this.el.screen.render();
  }

  setShowCloseButton(show: boolean) {
    this.props.showCloseButton = show;
    this.el.setContent(this.renderNotification());
    this.el.screen.render();
  }

  setCloseButtonText(text: string) {
    this.props.closeButtonText = text;
    this.el.setContent(this.renderNotification());
    this.el.screen.render();
  }

  setAutoHide(duration: number) {
    this.props.autoHide = duration;
  }

  setCloseOnEscape(close: boolean) {
    this.props.closeOnEscape = close;
  }

  setCloseOnEnter(close: boolean) {
    this.props.closeOnEnter = close;
  }

  setCloseOnClick(close: boolean) {
    this.props.closeOnClick = close;
  }

  // Notification visibility methods
  show() {
    this.isVisible = true;
    this.el.show();
    this.el.screen.render();
    
    // Auto-hide if enabled
    if (this.props.autoHide && this.props.autoHide > 0) {
      this.autoHideTimeout = setTimeout(() => {
        this.close();
      }, this.props.autoHide);
    }
    
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
    
    // Clear auto-hide timeout
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
      this.autoHideTimeout = null;
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
      message: this.props.message,
      icon: this.props.icon,
      isVisible: this.isVisible,
      showCloseButton: this.props.showCloseButton,
      closeButtonText: this.props.closeButtonText,
      autoHide: this.props.autoHide,
      closeOnEscape: this.props.closeOnEscape,
      closeOnEnter: this.props.closeOnEnter,
      closeOnClick: this.props.closeOnClick,
    };
  }

  // Get notification properties
  getTitle(): string | undefined {
    return this.props.title;
  }

  getMessage(): string | undefined {
    return this.props.message;
  }

  getIcon(): string | undefined {
    return this.props.icon;
  }

  isNotificationVisible(): boolean {
    return this.isVisible;
  }

  // Update component with new props
  update(newProps: Partial<NotificationProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Notification', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Notification update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = NotificationStyles.getStyle(this.props);
    
    // Update content if title, message, icon, or close button changed
    if (newProps.title !== undefined || 
        newProps.message !== undefined || 
        newProps.icon !== undefined ||
        newProps.showCloseButton !== undefined ||
        newProps.closeButtonText !== undefined) {
      this.el.setContent(this.renderNotification());
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