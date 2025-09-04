import { z } from "zod";

// Base position and layout schemas
export const PositionSchema = z.object({
  top: z.union([z.number(), z.string()]).optional(),
  left: z.union([z.number(), z.string()]).optional(),
  right: z.union([z.number(), z.string()]).optional(),
  bottom: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  height: z.union([z.number(), z.string()]).optional(),
});

export const PaddingSchema = z
  .union([
    z.number(),
    z.tuple([z.number(), z.number()]),
    z.object({
      top: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
    }),
  ])
  .optional();

// Style and theme schemas
export const ColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$|^[a-zA-Z]+$|^[a-zA-Z]+\.[a-zA-Z]+$/);
export const BorderStyleSchema = z.enum(["line", "bg", "none"]).optional();

export const StylePropsSchema = z.object({
  bg: ColorSchema.optional(),
  fg: ColorSchema.optional(),
  borderStyle: BorderStyleSchema,
  borderColor: ColorSchema.optional(),
  borderRadius: z.string().optional(),
  shadow: z.string().optional(),
  animation: z.string().optional(),
});

// Component variant schemas
export const ComponentVariantSchema = z.enum([
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
  "info",
  "destructive",
  "outline",
  "ghost",
  "link",
]);

export const ComponentSizeSchema = z.enum(["xs", "sm", "md", "lg", "xl"]);

export const ComponentStateSchema = z.enum([
  "default",
  "hover",
  "focus",
  "active",
  "disabled",
  "loading",
  "selected",
]);

// Base component schema
export const BasePropsSchema = StylePropsSchema.extend({
  parent: z.any().optional(), // blessed.Widgets.Node
  label: z.string().optional(),
  keys: z.boolean().optional(),
  mouse: z.boolean().optional(),
  scrollable: z.boolean().optional(),
  variant: ComponentVariantSchema.optional(),
  size: ComponentSizeSchema.optional(),
  state: ComponentStateSchema.optional(),
  padding: PaddingSchema,
  responsive: z.record(z.string(), z.any()).optional(),
  blessedProps: z
    .object({
      style: z.record(z.string(), z.any()).optional(),
    })
    .optional(),
}).merge(PositionSchema);

// Button specific schema
export const ButtonPropsSchema = BasePropsSchema.extend({
  text: z.string(),
  onClick: z.function().args().returns(z.void()).optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  loadingText: z.string().optional(),
  icon: z.string().optional(),
  iconPosition: z.enum(["left", "right"]).optional(),
  fullWidth: z.boolean().optional(),
});

// Box specific schema
export const BoxPropsSchema = BasePropsSchema.extend({
  content: z.string().optional(),
});

// Text specific schema
export const TextPropsSchema = BasePropsSchema.extend({
  content: z.string(),
  align: z.enum(["left", "center", "right"]).optional(),
  wrap: z.boolean().optional(),
});

// Input specific schema
export const InputPropsSchema = BasePropsSchema.extend({
  value: z.string().optional(),
  placeholder: z.string().optional(),
  password: z.boolean().optional(),
  multiline: z.boolean().optional(),
  maxLength: z.number().optional(),
  onChange: z.function().args(z.string()).returns(z.void()).optional(),
  onSubmit: z.function().args(z.string()).returns(z.void()).optional(),
});

// Heading specific schema
export const HeadingPropsSchema = BasePropsSchema.extend({
  text: z.string(),
  level: z.enum(["1", "2", "3", "4", "5", "6"]).optional(),
  align: z.enum(["left", "center", "right"]).optional(),
});

// Progress bar specific schema
export const ProgressBarPropsSchema = BasePropsSchema.extend({
  value: z.number().min(0).max(100),
  max: z.number().optional(),
  label: z.string().optional(),
  showPercentage: z.boolean().optional(),
  animated: z.boolean().optional(),
});

// Badge specific schema
export const BadgePropsSchema = BasePropsSchema.extend({
  text: z.string(),
  variant: ComponentVariantSchema.optional(),
  size: ComponentSizeSchema.optional(),
});

// Spinner specific schema
export const SpinnerPropsSchema = BasePropsSchema.extend({
  type: z.enum(["dots", "bars", "spinner"]).optional(),
  speed: z.number().optional(),
  text: z.string().optional(),
});

// Table specific schema
export const TablePropsSchema = BasePropsSchema.extend({
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  sortable: z.boolean().optional(),
  selectable: z.boolean().optional(),
  onRowSelect: z.function().args(z.number()).returns(z.void()).optional(),
});

// Modal specific schema
export const ModalPropsSchema = BasePropsSchema.extend({
  title: z.string(),
  content: z.string(),
  show: z.boolean().optional(),
  onClose: z.function().args().returns(z.void()).optional(),
  onConfirm: z.function().args().returns(z.void()).optional(),
});

// Form specific schema
export const FormPropsSchema = BasePropsSchema.extend({
  fields: z.array(z.any()), // Will be refined with specific field schemas
  onSubmit: z
    .function()
    .args(z.record(z.string(), z.any()))
    .returns(z.void())
    .optional(),
  onCancel: z.function().args().returns(z.void()).optional(),
});

// Export all schemas
export const ComponentSchemas = {
  base: BasePropsSchema,
  button: ButtonPropsSchema,
  box: BoxPropsSchema,
  text: TextPropsSchema,
  input: InputPropsSchema,
  heading: HeadingPropsSchema,
  progressBar: ProgressBarPropsSchema,
  badge: BadgePropsSchema,
  spinner: SpinnerPropsSchema,
  table: TablePropsSchema,
  modal: ModalPropsSchema,
  form: FormPropsSchema,
} as const;

// Type exports derived from schemas
export type ZodBaseProps = z.infer<typeof BasePropsSchema>;
export type ZodButtonProps = z.infer<typeof ButtonPropsSchema>;
export type ZodBoxProps = z.infer<typeof BoxPropsSchema>;
export type ZodTextProps = z.infer<typeof TextPropsSchema>;
export type ZodInputProps = z.infer<typeof InputPropsSchema>;
export type ZodHeadingProps = z.infer<typeof HeadingPropsSchema>;
export type ZodProgressBarProps = z.infer<typeof ProgressBarPropsSchema>;
export type ZodBadgeProps = z.infer<typeof BadgePropsSchema>;
export type ZodSpinnerProps = z.infer<typeof SpinnerPropsSchema>;
export type ZodTableProps = z.infer<typeof TablePropsSchema>;
export type ZodModalProps = z.infer<typeof ModalPropsSchema>;
export type ZodFormProps = z.infer<typeof FormPropsSchema>;

// Utility types
export type ComponentVariant = z.infer<typeof ComponentVariantSchema>;
export type ComponentSize = z.infer<typeof ComponentSizeSchema>;
export type ComponentState = z.infer<typeof ComponentStateSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type Padding = z.infer<typeof PaddingSchema>;
export type Color = z.infer<typeof ColorSchema>;
export type BorderStyle = z.infer<typeof BorderStyleSchema>;
