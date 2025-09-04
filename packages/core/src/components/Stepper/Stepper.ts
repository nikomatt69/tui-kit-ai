import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { StepperProps, StepperVariants, StepperSizes, StepperStates } from './Stepper.types';
import { StepperStyles } from './Stepper.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'error' | 'skipped';
  icon?: string;
  metadata?: Record<string, any>;
}

export class Stepper implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: StepperProps;
  private validationResult: ValidationResult;
  private steps: StepperStep[] = [];
  private currentStepIndex: number = 0;
  private focusedStepIndex: number = -1;

  constructor(props: StepperProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Stepper', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Stepper validation failed:', this.validationResult.errors);
      throw new Error(`Stepper validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Stepper warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.steps = this.props.steps || [];
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: StepperStyles.getStyle(this.props),
      content: this.renderStepper(),
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
      case 'up':
      case 'k':
        this.focusPreviousStep();
        break;
      case 'down':
      case 'j':
        this.focusNextStep();
        break;
      case 'left':
      case 'h':
        this.previousStep();
        break;
      case 'right':
      case 'l':
        this.nextStep();
        break;
      case 'enter':
      case 'space':
        this.activateCurrentStep();
        break;
      case 'home':
        this.goToFirstStep();
        break;
      case 'end':
        this.goToLastStep();
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
        steps: this.steps,
        currentStepIndex: this.currentStepIndex,
        focusedStepIndex: this.focusedStepIndex,
      });
    }
  }

  private renderStepper(): string {
    if (this.steps.length === 0) {
      return this.props.emptyMessage || 'No steps defined';
    }

    let content = '';
    
    // Title
    if (this.props.title) {
      content += `${this.props.title}\n`;
    }
    
    // Steps
    this.steps.forEach((step, index) => {
      content += this.renderStep(step, index);
      if (index < this.steps.length - 1) {
        content += '\n';
      }
    });
    
    return content;
  }

  private renderStep(step: StepperStep, index: number): string {
    let stepContent = '';
    
    // Step number and status
    const stepNumber = index + 1;
    const isCurrent = index === this.currentStepIndex;
    const isFocused = index === this.focusedStepIndex;
    const isCompleted = step.status === 'completed';
    const isError = step.status === 'error';
    const isSkipped = step.status === 'skipped';
    
    // Step indicator
    if (this.props.showStepNumbers) {
      if (isCompleted) {
        stepContent += `${this.props.completedIcon || '✓'} `;
      } else if (isError) {
        stepContent += `${this.props.errorIcon || '✗'} `;
      } else if (isSkipped) {
        stepContent += `${this.props.skippedIcon || '○'} `;
      } else if (isCurrent) {
        stepContent += `${this.props.currentIcon || '●'} `;
      } else {
        stepContent += `${this.props.pendingIcon || '○'} `;
      }
      
      stepContent += `${stepNumber}. `;
    }
    
    // Step icon
    if (step.icon && this.props.showStepIcons) {
      stepContent += `${step.icon} `;
    }
    
    // Step label
    if (isCurrent) {
      stepContent += `**${step.label}**`;
    } else if (isFocused) {
      stepContent += `_${step.label}_`;
    } else {
      stepContent += step.label;
    }
    
    // Step description
    if (step.description && this.props.showStepDescriptions) {
      stepContent += ` - ${step.description}`;
    }
    
    // Step status
    if (this.props.showStepStatus) {
      stepContent += ` [${step.status}]`;
    }
    
    // Step metadata
    if (step.metadata && this.props.showStepMetadata) {
      const metadataStr = Object.entries(step.metadata)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      stepContent += ` (${metadataStr})`;
    }
    
    return stepContent;
  }

  // Variant system methods
  setVariant(variant: StepperVariants) {
    this.props.variant = variant;
    this.el.style = StepperStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: StepperSizes) {
    this.props.size = size;
    this.el.style = StepperStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: StepperStates) {
    this.props.state = state;
    this.el.style = StepperStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Stepper-specific methods
  setTitle(title: string) {
    this.props.title = title;
    this.el.setContent(this.renderStepper());
    this.el.screen.render();
  }

  setSteps(steps: StepperStep[]) {
    this.steps = steps;
    this.currentStepIndex = 0;
    this.focusedStepIndex = -1;
    this.el.setContent(this.renderStepper());
    this.el.screen.render();
    
    if (this.props.onStepsChange) {
      this.props.onStepsChange({
        type: 'stepschange',
        target: this.el,
        steps: this.steps,
        previousSteps: [],
      });
    }
  }

  addStep(step: StepperStep) {
    this.steps.push(step);
    this.el.setContent(this.renderStepper());
    this.el.screen.render();
    
    if (this.props.onStepAdd) {
      this.props.onStepAdd({
        type: 'stepadd',
        target: this.el,
        step,
        totalSteps: this.steps.length,
      });
    }
  }

  removeStep(id: string) {
    const index = this.steps.findIndex(step => step.id === id);
    if (index >= 0) {
      const removedStep = this.steps.splice(index, 1)[0];
      
      // Adjust current and focused indices
      if (this.currentStepIndex >= index) {
        this.currentStepIndex = Math.max(0, this.currentStepIndex - 1);
      }
      if (this.focusedStepIndex >= index) {
        this.focusedStepIndex = Math.max(-1, this.focusedStepIndex - 1);
      }
      
      this.el.setContent(this.renderStepper());
      this.el.screen.render();
      
      if (this.props.onStepRemove) {
        this.props.onStepRemove({
          type: 'stepremove',
          target: this.el,
          step: removedStep,
          totalSteps: this.steps.length,
        });
      }
    }
  }

  updateStep(id: string, updates: Partial<StepperStep>) {
    const index = this.steps.findIndex(step => step.id === id);
    if (index >= 0) {
      const previousStep = { ...this.steps[index] };
      this.steps[index] = { ...this.steps[index], ...updates };
      
      this.el.setContent(this.renderStepper());
      this.el.screen.render();
      
      if (this.props.onStepUpdate) {
        this.props.onStepUpdate({
          type: 'stepupdate',
          target: this.el,
          step: this.steps[index],
          previousStep,
        });
      }
    }
  }

  clearSteps() {
    this.steps = [];
    this.currentStepIndex = 0;
    this.focusedStepIndex = -1;
    this.el.setContent(this.renderStepper());
    this.el.screen.render();
    
    if (this.props.onStepsClear) {
      this.props.onStepsClear({
        type: 'stepsclear',
        target: this.el,
      });
    }
  }

  // Display options
  setShowStepNumbers(show: boolean) {
    this.props.showStepNumbers = show;
    this.el.setContent(this.renderStepper());
    this.el.screen.render();
  }

  setShowStepIcons(show: boolean) {
    this.props.showStepIcons = show;
    this.el.setContent(this.renderStepper());
    this.el.screen.render();
  }

  setShowStepDescriptions(show: boolean) {
    this.props.showStepDescriptions = show;
    this.el.setContent(this.renderStepper());
    this.el.screen.render();
  }

  setShowStepStatus(show: boolean) {
    this.props.showStepStatus = show;
    this.el.setContent(this.renderStepper());
    this.el.screen.render();
  }

  setShowStepMetadata(show: boolean) {
    this.props.showStepMetadata = show;
    this.el.setContent(this.renderStepper());
    this.el.screen.render();
  }

  // Step navigation methods
  goToStep(index: number) {
    if (index >= 0 && index < this.steps.length) {
      const previousIndex = this.currentStepIndex;
      this.currentStepIndex = index;
      
      this.el.setContent(this.renderStepper());
      this.el.screen.render();
      
      if (this.props.onStepChange) {
        this.props.onStepChange({
          type: 'stepchange',
          target: this.el,
          previousStepIndex: previousIndex,
          currentStepIndex: this.currentStepIndex,
          step: this.steps[this.currentStepIndex],
        });
      }
    }
  }

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.goToStep(this.currentStepIndex + 1);
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.goToStep(this.currentStepIndex - 1);
    }
  }

  goToFirstStep() {
    this.goToStep(0);
  }

  goToLastStep() {
    this.goToStep(this.steps.length - 1);
  }

  // Step focus methods
  focusStep(index: number) {
    if (index >= 0 && index < this.steps.length) {
      this.focusedStepIndex = index;
      this.el.setContent(this.renderStepper());
      this.el.screen.render();
      
      if (this.props.onStepFocus) {
        this.props.onStepFocus({
          type: 'stepfocus',
          target: this.el,
          stepIndex: this.focusedStepIndex,
          step: this.steps[this.focusedStepIndex],
        });
      }
    }
  }

  focusNextStep() {
    if (this.focusedStepIndex < this.steps.length - 1) {
      this.focusStep(this.focusedStepIndex + 1);
    } else {
      this.focusStep(0);
    }
  }

  focusPreviousStep() {
    if (this.focusedStepIndex > 0) {
      this.focusStep(this.focusedStepIndex - 1);
    } else {
      this.focusStep(this.steps.length - 1);
    }
  }

  clearFocus() {
    this.focusedStepIndex = -1;
    this.el.setContent(this.renderStepper());
    this.el.screen.render();
  }

  activateCurrentStep() {
    if (this.focusedStepIndex >= 0 && this.focusedStepIndex < this.steps.length) {
      const step = this.steps[this.focusedStepIndex];
      if (step.status === 'pending' || step.status === 'active') {
        this.goToStep(this.focusedStepIndex);
        
        if (this.props.onStepActivate) {
          this.props.onStepActivate({
            type: 'stepactivate',
            target: this.el,
            stepIndex: this.focusedStepIndex,
            step,
          });
        }
      }
    }
  }

  // Step status methods
  completeStep(id: string) {
    this.updateStep(id, { status: 'completed' });
  }

  activateStep(id: string) {
    this.updateStep(id, { status: 'active' });
  }

  errorStep(id: string) {
    this.updateStep(id, { status: 'error' });
  }

  skipStep(id: string) {
    this.updateStep(id, { status: 'skipped' });
  }

  resetStep(id: string) {
    this.updateStep(id, { status: 'pending' });
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      title: this.props.title,
      steps: this.steps,
      currentStepIndex: this.currentStepIndex,
      focusedStepIndex: this.focusedStepIndex,
      showStepNumbers: this.props.showStepNumbers,
      showStepIcons: this.props.showStepIcons,
      showStepDescriptions: this.props.showStepDescriptions,
      showStepStatus: this.props.showStepStatus,
      showStepMetadata: this.props.showStepMetadata,
    };
  }

  // Get stepper properties
  getTitle(): string | undefined {
    return this.props.title;
  }

  getSteps(): StepperStep[] {
    return [...this.steps];
  }

  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  getCurrentStep(): StepperStep | undefined {
    return this.steps[this.currentStepIndex];
  }

  getFocusedStepIndex(): number {
    return this.focusedStepIndex;
  }

  getFocusedStep(): StepperStep | undefined {
    return this.focusedStepIndex >= 0 ? this.steps[this.focusedStepIndex] : undefined;
  }

  getStepCount(): number {
    return this.steps.length;
  }

  getStepById(id: string): StepperStep | undefined {
    return this.steps.find(step => step.id === id);
  }

  getStepByIndex(index: number): StepperStep | undefined {
    return this.steps[index];
  }

  // Update component with new props
  update(newProps: Partial<StepperProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Stepper', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Stepper update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = StepperStyles.getStyle(this.props);
    
    // Update steps if changed
    if (newProps.steps !== undefined) {
      this.setSteps(this.props.steps || []);
    }
    
    // Update content if any display properties changed
    if (newProps.title !== undefined ||
        newProps.showStepNumbers !== undefined ||
        newProps.showStepIcons !== undefined ||
        newProps.showStepDescriptions !== undefined ||
        newProps.showStepStatus !== undefined ||
        newProps.showStepMetadata !== undefined) {
      this.el.setContent(this.renderStepper());
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