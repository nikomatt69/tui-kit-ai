import { Widgets } from 'blessed';
import { AgentConfigVariants, AgentConfigSizes, AgentConfigStates, AgentConfigDisplayMode, AgentConfigEditMode, AgentConfigValidationLevel } from './AgentConfig.types';
import { Theme, resolveTheme } from '../../../../core/src/theming/theme';
import { ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/theming/design-tokens';

export class AgentConfigStyles {
  static getContainerStyle(
    variant: AgentConfigVariants = 'default',
    size: AgentConfigSizes = 'medium',
    state: AgentConfigStates = 'default',
    displayMode: AgentConfigDisplayMode = 'form',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentConfig?.container || {};
    
    const variantStyles = {
      default: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.primary,
        bg: resolvedTheme.colors.background.primary,
      },
      primary: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.accent,
        bg: resolvedTheme.colors.background.accent,
      },
      secondary: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.secondary,
        bg: resolvedTheme.colors.background.secondary,
      },
      success: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.status.success,
        bg: resolvedTheme.colors.background.success,
      },
      warning: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.status.warning,
        bg: resolvedTheme.colors.background.warning,
      },
      error: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.status.error,
        bg: resolvedTheme.colors.background.error,
      },
    };

    const sizeStyles = {
      small: {
        height: 8,
        padding: { top: 1, right: 1, bottom: 1, left: 1 },
      },
      medium: {
        height: 12,
        padding: { top: 1, right: 2, bottom: 1, left: 2 },
      },
      large: {
        height: 16,
        padding: { top: 2, right: 3, bottom: 2, left: 3 },
      },
    };

    const displayModeStyles = {
      form: {
        scrollable: true,
        alwaysScroll: true,
      },
      json: {
        scrollable: true,
        alwaysScroll: true,
      },
      yaml: {
        scrollable: true,
        alwaysScroll: true,
      },
      table: {
        scrollable: true,
        alwaysScroll: true,
      },
      tree: {
        scrollable: true,
        alwaysScroll: true,
      },
    };

    const stateStyles = {
      default: {},
      hover: {
        borderFg: resolvedTheme.colors.border.hover,
        bg: resolvedTheme.colors.background.hover,
      },
      focus: {
        borderFg: resolvedTheme.colors.border.focus,
        bg: resolvedTheme.colors.background.focus,
      },
      disabled: {
        borderFg: resolvedTheme.colors.border.disabled,
        bg: resolvedTheme.colors.background.disabled,
        fg: resolvedTheme.colors.text.disabled,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...displayModeStyles[displayMode],
      ...stateStyles[state],
    };
  }

  static getHeaderStyle(
    variant: AgentConfigVariants = 'default',
    size: AgentConfigSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentConfig?.header || {};
    
    const sizeStyles = {
      small: { height: 2, padding: { top: 0, right: 1, bottom: 0, left: 1 } },
      medium: { height: 3, padding: { top: 0, right: 2, bottom: 0, left: 2 } },
      large: { height: 4, padding: { top: 1, right: 3, bottom: 1, left: 3 } },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.secondary,
      bg: resolvedTheme.colors.background.secondary,
      fg: resolvedTheme.colors.text.primary,
    };
  }

  static getFormStyle(
    variant: AgentConfigVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      scrollable: true,
      alwaysScroll: true,
      padding: { top: 1, right: 2, bottom: 1, left: 2 },
    };
  }

  static getJsonStyle(
    variant: AgentConfigVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      scrollable: true,
      alwaysScroll: true,
      padding: { top: 1, right: 2, bottom: 1, left: 2 },
    };
  }

  static getYamlStyle(
    variant: AgentConfigVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      scrollable: true,
      alwaysScroll: true,
      padding: { top: 1, right: 2, bottom: 1, left: 2 },
    };
  }

  static getTableStyle(
    variant: AgentConfigVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      scrollable: true,
      alwaysScroll: true,
      padding: { top: 1, right: 2, bottom: 1, left: 2 },
    };
  }

  static getTreeStyle(
    variant: AgentConfigVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      scrollable: true,
      alwaysScroll: true,
      padding: { top: 1, right: 2, bottom: 1, left: 2 },
    };
  }

  static getFieldStyle(
    variant: AgentConfigVariants = 'default',
    state: AgentConfigStates = 'default',
    isRequired: boolean = false,
    hasError: boolean = false,
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const baseStyle = {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };

    const requiredStyle = isRequired ? {
      borderFg: resolvedTheme.colors.border.accent,
      fg: resolvedTheme.colors.text.accent,
    } : {};

    const errorStyle = hasError ? {
      borderFg: resolvedTheme.colors.status.error,
      fg: resolvedTheme.colors.text.error,
      bg: resolvedTheme.colors.background.error,
    } : {};

    const stateStyles = {
      default: {},
      hover: {
        borderFg: resolvedTheme.colors.border.hover,
        bg: resolvedTheme.colors.background.hover,
      },
      focus: {
        borderFg: resolvedTheme.colors.border.focus,
        bg: resolvedTheme.colors.background.focus,
      },
      disabled: {
        borderFg: resolvedTheme.colors.border.disabled,
        bg: resolvedTheme.colors.background.disabled,
        fg: resolvedTheme.colors.text.disabled,
      },
    };

    return {
      ...baseStyle,
      ...requiredStyle,
      ...errorStyle,
      ...stateStyles[state],
    };
  }

  static getLabelStyle(
    variant: AgentConfigVariants = 'default',
    isRequired: boolean = false,
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const requiredStyle = isRequired ? {
      fg: resolvedTheme.colors.text.accent,
    } : {
      fg: resolvedTheme.colors.text.primary,
    };

    return {
      ...requiredStyle,
      bg: resolvedTheme.colors.background.primary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getInputStyle(
    variant: AgentConfigVariants = 'default',
    state: AgentConfigStates = 'default',
    hasError: boolean = false,
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const baseStyle = {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };

    const errorStyle = hasError ? {
      borderFg: resolvedTheme.colors.status.error,
      fg: resolvedTheme.colors.text.error,
      bg: resolvedTheme.colors.background.error,
    } : {};

    const stateStyles = {
      default: {},
      hover: {
        borderFg: resolvedTheme.colors.border.hover,
        bg: resolvedTheme.colors.background.hover,
      },
      focus: {
        borderFg: resolvedTheme.colors.border.focus,
        bg: resolvedTheme.colors.background.focus,
      },
      disabled: {
        borderFg: resolvedTheme.colors.border.disabled,
        bg: resolvedTheme.colors.background.disabled,
        fg: resolvedTheme.colors.text.disabled,
      },
    };

    return {
      ...baseStyle,
      ...errorStyle,
      ...stateStyles[state],
    };
  }

  static getValidationStyle(
    variant: AgentConfigVariants = 'default',
    level: 'error' | 'warning' | 'info' = 'info',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const levelStyles = {
      error: {
        fg: resolvedTheme.colors.status.error,
        bg: resolvedTheme.colors.background.error,
        borderFg: resolvedTheme.colors.status.error,
      },
      warning: {
        fg: resolvedTheme.colors.status.warning,
        bg: resolvedTheme.colors.background.warning,
        borderFg: resolvedTheme.colors.status.warning,
      },
      info: {
        fg: resolvedTheme.colors.status.info,
        bg: resolvedTheme.colors.background.info,
        borderFg: resolvedTheme.colors.status.info,
      },
    };

    return {
      ...levelStyles[level],
      border: { type: 'line' },
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getHelpStyle(
    variant: AgentConfigVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      fg: resolvedTheme.colors.text.secondary,
      bg: resolvedTheme.colors.background.secondary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getSectionStyle(
    variant: AgentConfigVariants = 'default',
    isCollapsed: boolean = false,
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const collapsedStyle = isCollapsed ? {
      height: 1,
    } : {
      height: 'auto',
    };

    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.secondary,
      bg: resolvedTheme.colors.background.secondary,
      fg: resolvedTheme.colors.text.primary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      ...collapsedStyle,
    };
  }

  static getControlStyle(
    variant: AgentConfigVariants = 'default',
    state: AgentConfigStates = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const stateStyles = {
      default: {
        bg: resolvedTheme.colors.background.secondary,
        fg: resolvedTheme.colors.text.primary,
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.primary,
      },
      hover: {
        bg: resolvedTheme.colors.background.hover,
        fg: resolvedTheme.colors.text.hover,
        borderFg: resolvedTheme.colors.border.hover,
      },
      focus: {
        bg: resolvedTheme.colors.background.focus,
        fg: resolvedTheme.colors.text.focus,
        borderFg: resolvedTheme.colors.border.focus,
      },
      disabled: {
        bg: resolvedTheme.colors.background.disabled,
        fg: resolvedTheme.colors.text.disabled,
        borderFg: resolvedTheme.colors.border.disabled,
      },
    };

    return {
      ...stateStyles[state],
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getStatsStyle(
    variant: AgentConfigVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.secondary,
      bg: resolvedTheme.colors.background.secondary,
      fg: resolvedTheme.colors.text.secondary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }
}