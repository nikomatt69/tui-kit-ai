import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { ProgressSpinnerProps, ProgressSpinnerVariants, ProgressSpinnerSizes, ProgressSpinnerStates } from './ProgressSpinner.types';
import { ProgressSpinnerStyles } from './ProgressSpinner.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class ProgressSpinner implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: ProgressSpinnerProps;
  private validationResult: ValidationResult;
  private animationInterval: NodeJS.Timeout | null = null;
  private animationFrame: number = 0;
  private isSpinning: boolean = false;

  constructor(props: ProgressSpinnerProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('ProgressSpinner', props);
    
    if (!this.validationResult.success) {
      console.error('❌ ProgressSpinner validation failed:', this.validationResult.errors);
      throw new Error(`ProgressSpinner validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ ProgressSpinner warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: ProgressSpinnerStyles.getStyle(this.props),
      content: this.renderSpinner(),
      align: 'center',
      valign: 'middle',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
    
    // Start spinning if enabled
    if (this.props.spinning !== false) {
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

    // Handle key events
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
    });
  }

  private handleClick(event: any) {
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        spinning: this.isSpinning,
      });
    }
  }

  private handleKeyDown(event: any) {
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

  private renderSpinner(): string {
    const spinnerType = this.props.spinnerType || 'dots';
    const size = this.props.size || 'md';
    
    let content = '';
    
    // Prefix
    if (this.props.prefix) {
      content += `${this.props.prefix} `;
    }
    
    // Spinner animation
    if (this.isSpinning) {
      content += this.getSpinnerFrame(spinnerType, size);
    } else {
      content += this.getStaticSpinner(spinnerType, size);
    }
    
    // Suffix
    if (this.props.suffix) {
      content += ` ${this.props.suffix}`;
    }
    
    // Text
    if (this.props.text) {
      content += ` ${this.props.text}`;
    }
    
    return content;
  }

  private getSpinnerFrame(type: string, size: string): string {
    const frames = this.getSpinnerFrames(type, size);
    return frames[this.animationFrame % frames.length];
  }

  private getStaticSpinner(type: string, size: string): string {
    const frames = this.getSpinnerFrames(type, size);
    return frames[0];
  }

  private getSpinnerFrames(type: string, size: string): string[] {
    switch (type) {
      case 'dots':
        return this.getDotsFrames(size);
      case 'bars':
        return this.getBarsFrames(size);
      case 'spinner':
        return this.getSpinnerFrames(size);
      case 'pulse':
        return this.getPulseFrames(size);
      case 'wave':
        return this.getWaveFrames(size);
      case 'bounce':
        return this.getBounceFrames(size);
      default:
        return this.getDotsFrames(size);
    }
  }

  private getDotsFrames(size: string): string[] {
    const dots = size === 'lg' || size === 'xl' ? '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏' : '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
    return dots.split('');
  }

  private getBarsFrames(size: string): string[] {
    const bars = size === 'lg' || size === 'xl' ? '▌▀▐▄' : '▌▀▐▄';
    return bars.split('');
  }

  private getSpinnerFrames(size: string): string[] {
    const spinner = size === 'lg' || size === 'xl' ? '◢◣◤◥' : '◢◣◤◥';
    return spinner.split('');
  }

  private getPulseFrames(size: string): string[] {
    const pulse = size === 'lg' || size === 'xl' ? '●○●○' : '●○●○';
    return pulse.split('');
  }

  private getWaveFrames(size: string): string[] {
    const wave = size === 'lg' || size === 'xl' ? '▁▂▃▄▅▆▇█▇▆▅▄▃▂▁' : '▁▂▃▄▅▆▇█▇▆▅▄▃▂▁';
    return wave.split('');
  }

  private getBounceFrames(size: string): string[] {
    const bounce = size === 'lg' || size === 'xl' ? '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏' : '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
    return bounce.split('');
  }

  // Variant system methods
  setVariant(variant: ProgressSpinnerVariants) {
    this.props.variant = variant;
    this.el.style = ProgressSpinnerStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: ProgressSpinnerSizes) {
    this.props.size = size;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
  }
  
  setState(state: ProgressSpinnerStates) {
    this.props.state = state;
    this.el.style = ProgressSpinnerStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // ProgressSpinner-specific methods
  setSpinnerType(type: string) {
    this.props.spinnerType = type as any;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
  }

  setText(text: string) {
    this.props.text = text;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
  }

  setPrefix(prefix: string) {
    this.props.prefix = prefix;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
  }

  setSuffix(suffix: string) {
    this.props.suffix = suffix;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
  }

  setSpinning(spinning: boolean) {
    this.props.spinning = spinning;
    if (spinning) {
      this.start();
    } else {
      this.stop();
    }
  }

  setAnimationSpeed(speed: number) {
    this.props.animationSpeed = speed;
    if (this.isSpinning) {
      this.start();
    }
  }

  // Animation control methods
  start() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    
    this.isSpinning = true;
    this.animationInterval = setInterval(() => {
      this.animationFrame = (this.animationFrame + 1) % 1000; // Prevent overflow
      this.el.setContent(this.renderSpinner());
      this.el.screen.render();
    }, this.props.animationSpeed || 100);
    
    if (this.props.onStart) {
      this.props.onStart({
        type: 'start',
        target: this.el,
        spinning: true,
      });
    }
  }

  stop() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    
    this.isSpinning = false;
    this.el.setContent(this.renderSpinner());
    this.el.screen.render();
    
    if (this.props.onStop) {
      this.props.onStop({
        type: 'stop',
        target: this.el,
        spinning: false,
      });
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
    this.animationFrame = 0;
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
      spinnerType: this.props.spinnerType,
      text: this.props.text,
      prefix: this.props.prefix,
      suffix: this.props.suffix,
      spinning: this.isSpinning,
      animationSpeed: this.props.animationSpeed,
    };
  }

  // Get progress spinner properties
  getSpinnerType(): string {
    return this.props.spinnerType || 'dots';
  }

  getText(): string | undefined {
    return this.props.text;
  }

  getPrefix(): string | undefined {
    return this.props.prefix;
  }

  getSuffix(): string | undefined {
    return this.props.suffix;
  }

  isSpinning(): boolean {
    return this.isSpinning;
  }

  getAnimationSpeed(): number {
    return this.props.animationSpeed || 100;
  }

  // Update component with new props
  update(newProps: Partial<ProgressSpinnerProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('ProgressSpinner', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ ProgressSpinner update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = ProgressSpinnerStyles.getStyle(this.props);
    
    // Update spinning state if changed
    if (newProps.spinning !== undefined) {
      this.setSpinning(this.props.spinning);
    }
    
    // Update animation speed if changed
    if (newProps.animationSpeed !== undefined) {
      this.setAnimationSpeed(this.props.animationSpeed);
    }
    
    // Update content if any display properties changed
    if (newProps.spinnerType !== undefined || 
        newProps.text !== undefined ||
        newProps.prefix !== undefined ||
        newProps.suffix !== undefined) {
      this.el.setContent(this.renderSpinner());
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

  // Cleanup
  destroy() {
    this.stop();
    this.destroy();
  }

  // Get validation result for debugging
  getValidationResult(): ValidationResult {
    return this.validationResult;
  }
}