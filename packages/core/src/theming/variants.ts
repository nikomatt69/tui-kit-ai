import { cva, type VariantProps } from 'class-variance-authority';

// Button Variants
export const buttonVariants = cva(
  'base-button-styles',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white border-primary-500',
        destructive: 'bg-red-500 text-white border-red-500',
        outline: 'bg-transparent text-primary-500 border-primary-500',
        secondary: 'bg-gray-100 text-gray-900 border-gray-300',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
        link: 'bg-transparent text-primary-500 underline',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-8 px-3 py-1 text-xs',
        lg: 'h-12 px-6 py-3 text-base',
        icon: 'h-10 w-10 p-0',
      },
      state: {
        default: 'opacity-100',
        disabled: 'opacity-50 cursor-not-allowed',
        loading: 'opacity-75 cursor-wait',
        active: 'opacity-90 scale-95',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

// Input Variants
export const inputVariants = cva(
  'base-input-styles',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-300 text-gray-900',
        filled: 'bg-gray-50 border-gray-300 text-gray-900',
        outline: 'bg-transparent border-gray-300 text-gray-900',
        ghost: 'bg-transparent border-transparent text-gray-900',
      },
      size: {
        default: 'h-10 px-3 py-2 text-sm',
        sm: 'h-8 px-2 py-1 text-xs',
        lg: 'h-12 px-4 py-3 text-base',
      },
      state: {
        default: 'border-gray-300',
        focus: 'border-primary-500 ring-2 ring-primary-200',
        error: 'border-red-500 text-red-900',
        success: 'border-green-500 text-green-900',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

// Card Variants
export const cardVariants = cva(
  'base-card-styles',
  {
    variants: {
      variant: {
        default: 'bg-white border border-gray-200 shadow-sm',
        elevated: 'bg-white border border-gray-200 shadow-lg',
        outline: 'bg-transparent border border-gray-200',
        ghost: 'bg-transparent border-transparent',
      },
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
        none: 'p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Badge Variants
export const badgeVariants = cva(
  'base-badge-styles',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        secondary: 'bg-gray-200 text-gray-800',
        destructive: 'bg-red-100 text-red-800',
        outline: 'bg-transparent text-gray-800 border border-gray-300',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-blue-100 text-blue-800',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Progress Variants
export const progressVariants = cva(
  'base-progress-styles',
  {
    variants: {
      variant: {
        default: 'bg-gray-200',
        primary: 'bg-primary-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
      },
      size: {
        default: 'h-2',
        sm: 'h-1',
        lg: 'h-3',
        xl: 'h-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Export types for component props
export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type InputVariants = VariantProps<typeof inputVariants>;
export type CardVariants = VariantProps<typeof cardVariants>;
export type BadgeVariants = VariantProps<typeof badgeVariants>;
export type ProgressVariants = VariantProps<typeof progressVariants>;

// Utility function to resolve variants
export function resolveVariants<T extends Record<string, any>>(
  baseVariants: T,
  props: Partial<VariantProps<T>>
): string {
  return baseVariants(props);
}