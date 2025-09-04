import { z } from 'zod';
import { BasePropsSchema, CommonVariantSchema, CommonSizeSchema, CommonStateSchema } from './base-schemas';

// Button Component Schema
export const ButtonPropsSchema = BasePropsSchema.extend({
  label: z.string(),
  onClick: z.function().args(z.any()).returns(z.void()).optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  icon: z.string().optional(),
  iconPosition: z.enum(['left', 'right']).optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
  fullWidth: z.boolean().optional(),
  rounded: z.boolean().optional(),
});

// Text Input Schema
export const TextInputPropsSchema = BasePropsSchema.extend({
  value: z.string().optional(),
  placeholder: z.string().optional(),
  type: z.enum(['text', 'password', 'email', 'number', 'url']).optional(),
  maxLength: z.number().optional(),
  minLength: z.number().optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readonly: z.boolean().optional(),
  onInput: z.function().args(z.string()).returns(z.void()).optional(),
  onChange: z.function().args(z.string()).returns(z.void()).optional(),
  onFocus: z.function().args(z.any()).returns(z.void()).optional(),
  onBlur: z.function().args(z.any()).returns(z.void()).optional(),
  onEnter: z.function().args(z.string()).returns(z.void()).optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
  clearable: z.boolean().optional(),
  showCount: z.boolean().optional(),
});

// Select Component Schema
export const SelectPropsSchema = BasePropsSchema.extend({
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
    disabled: z.boolean().optional(),
    icon: z.string().optional(),
  })),
  value: z.string().optional(),
  placeholder: z.string().optional(),
  multiple: z.boolean().optional(),
  searchable: z.boolean().optional(),
  disabled: z.boolean().optional(),
  onSelect: z.function().args(z.string()).returns(z.void()).optional(),
  onDeselect: z.function().args(z.string()).returns(z.void()).optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
  maxItems: z.number().optional(),
  itemHeight: z.number().optional(),
});

// Checkbox Schema
export const CheckboxPropsSchema = BasePropsSchema.extend({
  checked: z.boolean().optional(),
  label: z.string().optional(),
  disabled: z.boolean().optional(),
  indeterminate: z.boolean().optional(),
  onChange: z.function().args(z.boolean()).returns(z.void()).optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
});

// Radio Group Schema
export const RadioGroupPropsSchema = BasePropsSchema.extend({
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
    disabled: z.boolean().optional(),
    icon: z.string().optional(),
  })),
  value: z.string().optional(),
  disabled: z.boolean().optional(),
  onChange: z.function().args(z.string()).returns(z.void()).optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
  direction: z.enum(['horizontal', 'vertical']).optional(),
});

// Progress Bar Schema
export const ProgressBarPropsSchema = BasePropsSchema.extend({
  value: z.number().min(0).max(100),
  max: z.number().optional(),
  showValue: z.boolean().optional(),
  showPercentage: z.boolean().optional(),
  animated: z.boolean().optional(),
  striped: z.boolean().optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
  label: z.string().optional(),
  color: z.string().optional(),
});

// Spinner Schema
export const SpinnerPropsSchema = BasePropsSchema.extend({
  size: CommonSizeSchema.optional(),
  variant: CommonVariantSchema.optional(),
  speed: z.number().optional(),
  label: z.string().optional(),
  color: z.string().optional(),
  type: z.enum(['dots', 'spinner', 'bars', 'pulse']).optional(),
});

// Card Schema
export const CardPropsSchema = BasePropsSchema.extend({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  header: z.any().optional(),
  footer: z.any().optional(),
  padding: z.union([z.number(), z.string()]).optional(),
  shadow: z.boolean().optional(),
  bordered: z.boolean().optional(),
  hoverable: z.boolean().optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
});

// Modal Schema
export const ModalPropsSchema = BasePropsSchema.extend({
  title: z.string().optional(),
  visible: z.boolean().optional(),
  closable: z.boolean().optional(),
  maskClosable: z.boolean().optional(),
  onClose: z.function().args().returns(z.void()).optional(),
  onOk: z.function().args().returns(z.void()).optional(),
  onCancel: z.function().args().returns(z.void()).optional(),
  okText: z.string().optional(),
  cancelText: z.string().optional(),
  width: z.union([z.number(), z.string()]).optional(),
  height: z.union([z.number(), z.string()]).optional(),
  centered: z.boolean().optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
});

// Tabs Schema
export const TabsPropsSchema = BasePropsSchema.extend({
  tabs: z.array(z.object({
    key: z.string(),
    label: z.string(),
    icon: z.string().optional(),
    disabled: z.boolean().optional(),
    content: z.any().optional(),
  })),
  activeKey: z.string().optional(),
  onChange: z.function().args(z.string()).returns(z.void()).optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
  type: z.enum(['line', 'card', 'borderless']).optional(),
});

// Table Schema
export const TablePropsSchema = BasePropsSchema.extend({
  columns: z.array(z.object({
    key: z.string(),
    title: z.string(),
    dataIndex: z.string(),
    width: z.union([z.number(), z.string()]).optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
    sortable: z.boolean().optional(),
    filterable: z.boolean().optional(),
  })),
  dataSource: z.array(z.record(z.any())),
  pagination: z.object({
    current: z.number().optional(),
    pageSize: z.number().optional(),
    total: z.number().optional(),
    showSizeChanger: z.boolean().optional(),
    showQuickJumper: z.boolean().optional(),
  }).optional(),
  loading: z.boolean().optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
  bordered: z.boolean().optional(),
  striped: z.boolean().optional(),
});

// Toast Schema
export const ToastPropsSchema = BasePropsSchema.extend({
  message: z.string(),
  type: z.enum(['success', 'error', 'warning', 'info']).optional(),
  duration: z.number().optional(),
  closable: z.boolean().optional(),
  onClose: z.function().args().returns(z.void()).optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
  position: z.enum(['top', 'bottom', 'top-right', 'top-left', 'bottom-right', 'bottom-left']).optional(),
});

// Badge Schema
export const BadgePropsSchema = BasePropsSchema.extend({
  text: z.string().optional(),
  count: z.union([z.number(), z.string()]).optional(),
  dot: z.boolean().optional(),
  overflowCount: z.number().optional(),
  showZero: z.boolean().optional(),
  variant: CommonVariantSchema.optional(),
  size: CommonSizeSchema.optional(),
  state: CommonStateSchema.optional(),
  color: z.string().optional(),
});

// Avatar Schema
export const AvatarPropsSchema = BasePropsSchema.extend({
  src: z.string().optional(),
  alt: z.string().optional(),
  text: z.string().optional(),
  icon: z.string().optional(),
  size: CommonSizeSchema.optional(),
  shape: z.enum(['circle', 'square']).optional(),
  variant: CommonVariantSchema.optional(),
  state: CommonStateSchema.optional(),
});

// Export all component prop types
export type ButtonProps = z.infer<typeof ButtonPropsSchema>;
export type TextInputProps = z.infer<typeof TextInputPropsSchema>;
export type SelectProps = z.infer<typeof SelectPropsSchema>;
export type CheckboxProps = z.infer<typeof CheckboxPropsSchema>;
export type RadioGroupProps = z.infer<typeof RadioGroupPropsSchema>;
export type ProgressBarProps = z.infer<typeof ProgressBarPropsSchema>;
export type SpinnerProps = z.infer<typeof SpinnerPropsSchema>;
export type CardProps = z.infer<typeof CardPropsSchema>;
export type ModalProps = z.infer<typeof ModalPropsSchema>;
export type TabsProps = z.infer<typeof TabsPropsSchema>;
export type TableProps = z.infer<typeof TablePropsSchema>;
export type ToastProps = z.infer<typeof ToastPropsSchema>;
export type BadgeProps = z.infer<typeof BadgePropsSchema>;
export type AvatarProps = z.infer<typeof AvatarPropsSchema>;