import { z } from 'zod';

// Base position and layout schemas
export const PositionSchema = z.object({
  top: z.union([z.number(), z.string()]).optional(),
  left: z.union([z.number(), z.string()]).optional(),
  right: z.union([z.number(), z.string()]).optional(),
  bottom: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  height: z.union([z.number(), z.string()]).optional(),
});

// Theme schema
export const ThemeSchema = z.object({
  __base: z.enum(['light', 'dark']).optional(),
  background: z.string().optional(),
  foreground: z.string().optional(),
  accent: z.string().optional(),
  success: z.string().optional(),
  warning: z.string().optional(),
  error: z.string().optional(),
  border: z.string().optional(),
  muted: z.string().optional(),
  secondary: z.string().optional(),
  surface: z.string().optional(),
  hover: z.string().optional(),
  active: z.string().optional(),
  disabled: z.string().optional(),
  borderFocus: z.string().optional(),
  glow: z.string().optional(),
  shadow: z.string().optional(),
  info: z.string().optional(),
});

// Style props schema
export const StylePropsSchema = z.object({
  theme: ThemeSchema.optional(),
  padding: z.union([
    z.number(),
    z.tuple([z.number(), z.number()]),
    z.tuple([z.number(), z.number(), z.number(), z.number()])
  ]).optional(),
  margin: z.union([
    z.number(),
    z.tuple([z.number(), z.number()]),
    z.tuple([z.number(), z.number(), z.number(), z.number()])
  ]).optional(),
  borderStyle: z.enum(['line', 'double', 'round', 'bold', 'classic', 'none']).optional(),
  borderColor: z.string().optional(),
  bg: z.string().optional(),
  fg: z.string().optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  variant: z.string().optional(),
  size: z.string().optional(),
  palette: z.string().optional(),
  glow: z.boolean().optional(),
  shadow: z.boolean().optional(),
  opacity: z.number().min(0).max(1).optional(),
  gradient: z.object({
    from: z.string(),
    to: z.string(),
    direction: z.string().optional(),
  }).optional(),
  borderWidth: z.number().optional(),
});

// Blessed-specific props schema
export const BlessedPropsSchema = z.object({
  style: z.record(z.any()).optional(),
  keys: z.boolean().optional(),
  mouse: z.boolean().optional(),
  scrollable: z.boolean().optional(),
  label: z.string().optional(),
  tags: z.boolean().optional(),
  draggable: z.boolean().optional(),
  focused: z.boolean().optional(),
  hidden: z.boolean().optional(),
  clickable: z.boolean().optional(),
  input: z.boolean().optional(),
  scrollbar: z.object({
    ch: z.string().optional(),
    track: z.object({
      bg: z.string().optional(),
      fg: z.string().optional(),
    }).optional(),
    style: z.object({
      bg: z.string().optional(),
      fg: z.string().optional(),
    }).optional(),
  }).optional(),
});

// Base props schema that all components extend
export const BasePropsSchema = StylePropsSchema
  .merge(PositionSchema)
  .merge(BlessedPropsSchema)
  .extend({
    parent: z.any().optional(), // Blessed element
    responsive: z.record(z.string(), z.any()).optional(),
    animation: z.string().optional(),
    borderRadius: z.string().optional(),
    shadow: z.string().optional(),
  });

// Common variant schemas
export const CommonVariantSchema = z.enum([
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
  'outline',
  'ghost',
  'destructive',
  'link',
]);

export const CommonSizeSchema = z.enum([
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'icon',
]);

export const CommonStateSchema = z.enum([
  'default',
  'hover',
  'active',
  'disabled',
  'loading',
  'focus',
  'error',
  'success',
]);

// Export types
export type PositionProps = z.infer<typeof PositionSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type StyleProps = z.infer<typeof StylePropsSchema>;
export type BlessedProps = z.infer<typeof BlessedPropsSchema>;
export type BaseProps = z.infer<typeof BasePropsSchema>;
export type CommonVariant = z.infer<typeof CommonVariantSchema>;
export type CommonSize = z.infer<typeof CommonSizeSchema>;
export type CommonState = z.infer<typeof CommonStateSchema>;