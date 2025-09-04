import { Widgets } from 'blessed';
import { AgentVariants, AgentSizes, AgentStates, AgentStatus } from './Agent.types';
import { Theme, resolveTheme } from '../../../../core/src/theming/theme';
import { ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/theming/design-tokens';

export class AgentStyles {
  static getContainerStyle(
    variant: AgentVariants = 'default',
    size: AgentSizes = 'medium',
    state: AgentStates = 'default',
    status: AgentStatus = 'idle',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agent?.container || {};
    
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

    const statusStyles = {
      idle: {
        borderFg: resolvedTheme.colors.status.idle,
        fg: resolvedTheme.colors.text.primary,
      },
      running: {
        borderFg: resolvedTheme.colors.status.success,
        fg: resolvedTheme.colors.text.success,
      },
      paused: {
        borderFg: resolvedTheme.colors.status.warning,
        fg: resolvedTheme.colors.text.warning,
      },
      error: {
        borderFg: resolvedTheme.colors.status.error,
        fg: resolvedTheme.colors.text.error,
      },
      completed: {
        borderFg: resolvedTheme.colors.status.success,
        fg: resolvedTheme.colors.text.success,
      },
      stopped: {
        borderFg: resolvedTheme.colors.status.error,
        fg: resolvedTheme.colors.text.error,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...stateStyles[state],
      ...statusStyles[status],
    };
  }

  static getHeaderStyle(
    variant: AgentVariants = 'default',
    size: AgentSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agent?.header || {};
    
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

  static getContentStyle(
    variant: AgentVariants = 'default',
    size: AgentSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agent?.content || {};
    
    const sizeStyles = {
      small: { padding: { top: 1, right: 1, bottom: 1, left: 1 } },
      medium: { padding: { top: 1, right: 2, bottom: 1, left: 2 } },
      large: { padding: { top: 2, right: 3, bottom: 2, left: 3 } },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      scrollable: true,
    };
  }

  static getStatusStyle(
    status: AgentStatus = 'idle',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const statusStyles = {
      idle: {
        fg: resolvedTheme.colors.status.idle,
        bg: resolvedTheme.colors.background.idle,
      },
      running: {
        fg: resolvedTheme.colors.status.success,
        bg: resolvedTheme.colors.background.success,
      },
      paused: {
        fg: resolvedTheme.colors.status.warning,
        bg: resolvedTheme.colors.background.warning,
      },
      error: {
        fg: resolvedTheme.colors.status.error,
        bg: resolvedTheme.colors.background.error,
      },
      completed: {
        fg: resolvedTheme.colors.status.success,
        bg: resolvedTheme.colors.background.success,
      },
      stopped: {
        fg: resolvedTheme.colors.status.error,
        bg: resolvedTheme.colors.background.error,
      },
    };

    return {
      ...statusStyles[status],
      border: { type: 'line' },
      borderFg: statusStyles[status].fg,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
    };
  }

  static getMetricsStyle(
    variant: AgentVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.secondary,
      bg: resolvedTheme.colors.background.secondary,
      fg: resolvedTheme.colors.text.secondary,
      padding: { top: 1, right: 1, bottom: 1, left: 1 },
    };
  }

  static getLogsStyle(
    variant: AgentVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.secondary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      scrollable: true,
      alwaysScroll: true,
      padding: { top: 1, right: 1, bottom: 1, left: 1 },
    };
  }

  static getTasksStyle(
    variant: AgentVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.secondary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      scrollable: true,
      alwaysScroll: true,
      padding: { top: 1, right: 1, bottom: 1, left: 1 },
    };
  }

  static getButtonStyle(
    variant: AgentVariants = 'default',
    state: AgentStates = 'default',
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
}