// Core TUI Components
export * from "./components/Box";
export * from "./components/Button";
export * from "./components/Card";
export * from "./components/Divider";
export * from "./components/Heading";
export * from "./components/ProgressBar";
export * from "./components/Spinner";
export * from "./components/StatusIndicator";
export * from "./components/Text";
export * from "./components/TextInput";

// Base Component System
export * from "./components/BaseComponent";

// Configuration System
export * from "./config/tui-config";
export type { TuiConfig, TuiTokens, TuiVariants } from "./config/tui-config";

// Design System
export * from "./theming/theme";
export * from "./types/schemas";

// Utility Functions
export { resolveBlessedColor, resolveVariants } from "./lib/utils";
export {
  cn,
  createCompoundVariants,
  createContextVariants,
  createResponsiveVariants,
  createVariants,
  getComponentTokens,
  mergeComponentStyles,
  variants,
} from "./utils/variants";
export type { VariantProps } from "./utils/variants";

// Zod Schemas and Validation

export * from "./validation/component-validator";

// Terminal Utilities
export * from "./terminal/useTerminal";

// Theming
// Removed duplicate theme export
