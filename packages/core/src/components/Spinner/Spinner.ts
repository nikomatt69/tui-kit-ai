import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { SpinnerProps, SpinnerVariants, SpinnerSizes, SpinnerStates } from './Spinner.types';
import { SpinnerStyles } from './Spinner.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Spinner implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: SpinnerProps;
  private validationResult: ValidationResult;
  private isSpinning: boolean = false;
  private currentFrame: number = 0;
  private animationInterval: NodeJS.Timeout | null = null;
  private frames: string[] = [];

  constructor(props: SpinnerProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Spinner', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Spinner validation failed:', this.validationResult.errors);
      throw new Error(`Spinner validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Spinner warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.frames = this.props.frames || this.getDefaultFrames();
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: SpinnerStyles.getStyle(this.props),
      content: this.renderSpinner(),
      align: 'center',
      valign: 'middle',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
    
    // Start spinning if autoStart is enabled
    if (this.props.autoStart) {
      this.start();
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

    // Handle click events
    if (this.props.clickable) {
      this.el.on('click', (event: any) => {
        this.handleClick(event);
      });
    }
  }

  private handleClick(event: any) {
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        isSpinning: this.isSpinning,
        currentFrame: this.currentFrame,
      });
    }
  }

  private getDefaultFrames(): string[] {
    switch (this.props.spinnerType) {
      case 'dots':
        return ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      case 'line':
        return ['|', '/', '-', '\\'];
      case 'pulse':
        return ['●', '○', '●', '○'];
      case 'bounce':
        return ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      case 'bar':
        return ['[    ]', '[=   ]', '[==  ]', '[=== ]', '[====]', '[ ===]', '[  ==]', '[   =]', '[    ]'];
      default:
        return ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    }
  }

  private renderSpinner(): string {
    let content = '';
    
    // Label
    if (this.props.label) {
      content += `${this.props.label}`;
      if (this.props.showSeparator) {
        content += ' ';
      }
    }
    
    // Spinner animation
    if (this.isSpinning) {
      content += this.frames[this.currentFrame];
    } else {
      content += this.props.stoppedFrame || this.frames[0];
    }
    
    // Message
    if (this.props.message) {
      if (this.props.showSeparator) {
        content += ' ';
      }
      content += this.props.message;
    }
    
    return content;
  }

  // Variant system methods
  setVariant(variant: SpinnerVariants) {
    this.props.variant = variant;
    this.el.style = SpinnerStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: SpinnerSizes) {
    this.props.size = size;
    this.el.style = SpinnerStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: SpinnerStates) {
    this.props.state = state;
    this.el.style = SpinnerStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Spinner-specific methods
  setLabel(label: string) {
    this.props.label = label;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
  }

  setMessage(message: string) {
    this.props.message = message;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
  }

  setSpinnerType(type: string) {
    this.props.spinnerType = type;
    this.frames = this.getDefaultFrames();
    this.currentFrame = 0;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
  }

  setFrames(frames: string[]) {
    this.frames = frames;
    this.currentFrame = 0;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
  }

  setSpeed(speed: number) {
    this.props.speed = speed;
    if (this.isSpinning) {
      this.stop();
      this.start();
    }
  }

  setShowSeparator(show: boolean) {
    this.props.showSeparator = show;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
  }

  // Animation control methods
  start() {
    if (!this.isSpinning) {
      this.isSpinning = true;
      this.currentFrame = 0;
      
      this.animationInterval = setInterval(() => {
        this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        this.el.setContent(this.renderSpinner());
        this.el.screen.render();
      }, this.props.speed || 100);
      
      this.el.setContent(this.renderSpinner());
      this.el.screen.render();
      
      if (this.props.onStart) {
        this.props.onStart({
          type: 'start',
          target: this.el,
          frames: this.frames,
          speed: this.props.speed,
        });
      }
    }
  }

  stop() {
    if (this.isSpinning) {
      this.isSpinning = false;
      
      if (this.animationInterval) {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
      }
      
      this.el.setContent(this.renderSpinner());
      this.el.screen.render();
      
      if (this.props.onStop) {
        this.props.onStop({
          type: 'stop',
          target: this.el,
          finalFrame: this.currentFrame,
        });
      }
    }
  }

  toggle() {
    if (this.isSpinning) {
      this.stop();
    } else {
      this.start();
    }
  }

  reset() {
    this.currentFrame = 0;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      label: this.props.label,
      message: this.props.message,
      spinnerType: this.props.spinnerType,
      frames: this.frames,
      currentFrame: this.currentFrame,
      isSpinning: this.isSpinning,
      speed: this.props.speed,
      showSeparator: this.props.showSeparator,
      stoppedFrame: this.props.stoppedFrame,
    };
  }

  // Get spinner properties
  getLabel(): string | undefined {
    return this.props.label;
  }

  getMessage(): string | undefined {
    return this.props.message;
  }

  getSpinnerType(): string {
    return this.props.spinnerType || 'dots';
  }

  getFrames(): string[] {
    return [...this.frames];
  }

  getCurrentFrame(): number {
    return this.currentFrame;
  }

  getCurrentFrameContent(): string {
    return this.frames[this.currentFrame] || '';
  }

  isSpinning(): boolean {
    return this.isSpinning;
  }

  getSpeed(): number {
    return this.props.speed || 100;
  }

  getShowSeparator(): boolean {
    return this.props.showSeparator || false;
  }

  // Update component with new props
  update(newProps: Partial<SpinnerProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Spinner', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Spinner update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = SpinnerStyles.getStyle(this.props);
    
    // Update frames if spinner type changed
    if (newProps.spinnerType !== undefined) {
      this.setSpinnerType(this.props.spinnerType);
    }
    
    // Update content if any display properties changed
    if (newProps.label !== undefined || 
        newProps.message !== undefined ||
        newProps.showSeparator !== undefined) {
      this.el.setContent(this.renderSpinner());
    }
    
    // Update speed if changed and currently spinning
    if (newProps.speed !== undefined && this.isSpinning) {
      this.setSpeed(this.props.speed);
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

  // Cleanup on destroy
  destroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    this.destroy();
  }

  // Get validation result for debugging
  getValidationResult(): ValidationResult {
    return this.validationResult;
  }
}