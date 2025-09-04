import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { CardProps, CardVariants, CardSizes, CardStates } from './Card.types';
import { CardStyles } from './Card.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Card implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: CardProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private bodyElement?: Widgets.BoxElement;
  private footerElement?: Widgets.BoxElement;

  constructor(props: CardProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Card', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Card validation failed:', this.validationResult.errors);
      throw new Error(`Card validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Card warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: CardStyles.getStyle(this.props),
      content: '',
      align: 'left',
      valign: 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupCardStructure();
    this.setupEventHandlers();
  }
  
  private setupCardStructure() {
    // Create header if specified
    if (this.props.header) {
      this.headerElement = this.el.children[0] as Widgets.BoxElement;
      if (this.headerElement) {
        this.headerElement.setContent(this.props.header);
        this.headerElement.style = CardStyles.getHeaderStyle(this.props);
      }
    }
    
    // Create body
    this.bodyElement = this.el.children[1] as Widgets.BoxElement;
    if (this.bodyElement && this.props.content) {
      this.bodyElement.setContent(this.props.content);
      this.bodyElement.style = CardStyles.getBodyStyle(this.props);
    }
    
    // Create footer if specified
    if (this.props.footer) {
      this.footerElement = this.el.children[2] as Widgets.BoxElement;
      if (this.footerElement) {
        this.footerElement.setContent(this.props.footer);
        this.footerElement.style = CardStyles.getFooterStyle(this.props);
      }
    }
  }
  
  private setupEventHandlers() {
    // Handle click events
    this.el.on('click', (data: any) => {
      if (this.props.onClick) {
        this.props.onClick(data);
      }
    });

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
  }

  // Variant system methods
  setVariant(variant: CardVariants) {
    this.props.variant = variant;
    this.el.style = CardStyles.getStyle(this.props);
    if (this.headerElement) {
      this.headerElement.style = CardStyles.getHeaderStyle(this.props);
    }
    if (this.bodyElement) {
      this.bodyElement.style = CardStyles.getBodyStyle(this.props);
    }
    if (this.footerElement) {
      this.footerElement.style = CardStyles.getFooterStyle(this.props);
    }
    this.el.screen.render();
  }
  
  setSize(size: CardSizes) {
    this.props.size = size;
    this.el.style = CardStyles.getStyle(this.props);
    if (this.headerElement) {
      this.headerElement.style = CardStyles.getHeaderStyle(this.props);
    }
    if (this.bodyElement) {
      this.bodyElement.style = CardStyles.getBodyStyle(this.props);
    }
    if (this.footerElement) {
      this.footerElement.style = CardStyles.getFooterStyle(this.props);
    }
    this.el.screen.render();
  }
  
  setState(state: CardStates) {
    this.props.state = state;
    this.el.style = CardStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Card-specific methods
  setHeader(header: string) {
    this.props.header = header;
    if (this.headerElement) {
      this.headerElement.setContent(header);
    }
    this.el.screen.render();
  }

  setContent(content: string) {
    this.props.content = content;
    if (this.bodyElement) {
      this.bodyElement.setContent(content);
    }
    this.el.screen.render();
  }

  setFooter(footer: string) {
    this.props.footer = footer;
    if (this.footerElement) {
      this.footerElement.setContent(footer);
    }
    this.el.screen.render();
  }

  setElevation(elevation: boolean) {
    this.props.elevated = elevation;
    this.el.style = CardStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setRounded(rounded: boolean) {
    this.props.rounded = rounded;
    this.el.style = CardStyles.getStyle(this.props);
    this.el.screen.render();
  }

  setShadow(shadow: boolean) {
    this.props.shadow = shadow;
    this.el.style = CardStyles.getStyle(this.props);
    this.el.screen.render();
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
      elevated: this.props.elevated,
      rounded: this.props.rounded,
      shadow: this.props.shadow,
    };
  }

  // Update component with new props
  update(newProps: Partial<CardProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Card', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Card update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = CardStyles.getStyle(this.props);
    
    // Update header if changed
    if (newProps.header !== undefined && this.headerElement) {
      this.headerElement.setContent(this.props.header);
      this.headerElement.style = CardStyles.getHeaderStyle(this.props);
    }
    
    // Update content if changed
    if (newProps.content !== undefined && this.bodyElement) {
      this.bodyElement.setContent(this.props.content);
      this.bodyElement.style = CardStyles.getBodyStyle(this.props);
    }
    
    // Update footer if changed
    if (newProps.footer !== undefined && this.footerElement) {
      this.footerElement.setContent(this.props.footer);
      this.footerElement.style = CardStyles.getFooterStyle(this.props);
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