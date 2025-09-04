import { z } from 'zod';
import { BasePropsSchema } from './base-schemas';
import { 
  ButtonPropsSchema,
  TextInputPropsSchema,
  SelectPropsSchema,
  CheckboxPropsSchema,
  RadioGroupPropsSchema,
  ProgressBarPropsSchema,
  SpinnerPropsSchema,
  CardPropsSchema,
  ModalPropsSchema,
  TabsPropsSchema,
  TablePropsSchema,
  ToastPropsSchema,
  BadgePropsSchema,
  AvatarPropsSchema,
} from './component-schemas';

// Component validation registry
const componentSchemas = {
  Button: ButtonPropsSchema,
  TextInput: TextInputPropsSchema,
  Select: SelectPropsSchema,
  Checkbox: CheckboxPropsSchema,
  RadioGroup: RadioGroupPropsSchema,
  ProgressBar: ProgressBarPropsSchema,
  Spinner: SpinnerPropsSchema,
  Card: CardPropsSchema,
  Modal: ModalPropsSchema,
  Tabs: TabsPropsSchema,
  Table: TablePropsSchema,
  Toast: ToastPropsSchema,
  Badge: BadgePropsSchema,
  Avatar: AvatarPropsSchema,
} as const;

// Validation result type
export interface ValidationResult {
  success: boolean;
  data?: any;
  errors?: z.ZodError;
  warnings?: string[];
}

// Component validator class
export class ComponentValidator {
  private static instance: ComponentValidator;
  private validationCache = new Map<string, any>();

  static getInstance(): ComponentValidator {
    if (!ComponentValidator.instance) {
      ComponentValidator.instance = new ComponentValidator();
    }
    return ComponentValidator.instance;
  }

  /**
   * Validate component props using Zod schema
   */
  validateComponent<T extends keyof typeof componentSchemas>(
    componentName: T,
    props: any
  ): ValidationResult {
    try {
      const schema = componentSchemas[componentName];
      if (!schema) {
        return {
          success: false,
          errors: new z.ZodError([
            {
              code: 'invalid_component',
              message: `Unknown component: ${componentName}`,
              path: [],
            },
          ]),
        };
      }

      // Validate props
      const validatedData = schema.parse(props);
      
      // Check for warnings
      const warnings = this.checkWarnings(componentName, props);

      return {
        success: true,
        data: validatedData,
        warnings,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error,
        };
      }
      
      return {
        success: false,
        errors: new z.ZodError([
          {
            code: 'validation_error',
            message: error instanceof Error ? error.message : 'Unknown validation error',
            path: [],
          },
        ]),
      };
    }
  }

  /**
   * Validate base props for any component
   */
  validateBaseProps(props: any): ValidationResult {
    try {
      const validatedData = BasePropsSchema.parse(props);
      return {
        success: true,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error,
        };
      }
      
      return {
        success: false,
        errors: new z.ZodError([
          {
            code: 'validation_error',
            message: error instanceof Error ? error.message : 'Unknown validation error',
            path: [],
          },
        ]),
      };
    }
  }

  /**
   * Validate component props with warnings
   */
  validateWithWarnings<T extends keyof typeof componentSchemas>(
    componentName: T,
    props: any
  ): ValidationResult {
    const result = this.validateComponent(componentName, props);
    
    if (result.success) {
      const warnings = this.checkWarnings(componentName, props);
      if (warnings.length > 0) {
        result.warnings = warnings;
      }
    }
    
    return result;
  }

  /**
   * Check for potential warnings in component props
   */
  private checkWarnings(componentName: string, props: any): string[] {
    const warnings: string[] = [];

    // Check for deprecated props
    if (props.deprecated) {
      warnings.push(`Prop 'deprecated' is deprecated and will be removed in future versions`);
    }

    // Check for conflicting props
    if (props.variant === 'outline' && props.bg) {
      warnings.push(`Variant 'outline' with background color may cause visual conflicts`);
    }

    // Check for performance issues
    if (props.animation && props.animation.includes('complex')) {
      warnings.push(`Complex animations may impact performance on slower terminals`);
    }

    // Component-specific warnings
    switch (componentName) {
      case 'Button':
        if (props.loading && props.onClick) {
          warnings.push(`Button is loading but has onClick handler - consider disabling during load`);
        }
        break;
      
      case 'TextInput':
        if (props.maxLength && props.maxLength < 1) {
          warnings.push(`maxLength should be greater than 0`);
        }
        break;
      
      case 'ProgressBar':
        if (props.value > 100) {
          warnings.push(`Progress value exceeds 100% - may cause display issues`);
        }
        break;
      
      case 'Table':
        if (props.dataSource && props.dataSource.length > 1000) {
          warnings.push(`Large datasets may impact performance - consider pagination`);
        }
        break;
    }

    return warnings;
  }

  /**
   * Get component schema for a specific component
   */
  getComponentSchema<T extends keyof typeof componentSchemas>(
    componentName: T
  ): typeof componentSchemas[T] | null {
    return componentSchemas[componentName] || null;
  }

  /**
   * Get all available component names
   */
  getAvailableComponents(): string[] {
    return Object.keys(componentSchemas);
  }

  /**
   * Check if a component exists
   */
  hasComponent(componentName: string): boolean {
    return componentName in componentSchemas;
  }

  /**
   * Get component prop types as TypeScript types
   */
  getComponentPropTypes<T extends keyof typeof componentSchemas>(
    componentName: T
  ): z.infer<typeof componentSchemas[T]> | null {
    const schema = this.getComponentSchema(componentName);
    return schema ? schema.shape : null;
  }
}

// Export singleton instance
export const componentValidator = ComponentValidator.getInstance();

// Export validation function for easy use
export function validateComponent<T extends keyof typeof componentSchemas>(
  componentName: T,
  props: any
): ValidationResult {
  return componentValidator.validateComponent(componentName, props);
}

// Export base validation function
export function validateBaseProps(props: any): ValidationResult {
  return componentValidator.validateBaseProps(props);
}

// Export validation with warnings
export function validateWithWarnings<T extends keyof typeof componentSchemas>(
  componentName: T,
  props: any
): ValidationResult {
  return componentValidator.validateWithWarnings(componentName, props);
}
