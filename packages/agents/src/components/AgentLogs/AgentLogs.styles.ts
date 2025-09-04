import { Widgets } from 'blessed';
import { AgentLogsVariants, AgentLogsSizes, AgentLogsStates, AgentLogsDisplayMode, AgentLogsFilterLevel } from './AgentLogs.types';
import { Theme, resolveTheme } from '../../../../core/src/theming/theme';
import { ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/theming/design-tokens';

export class AgentLogsStyles {
  static getContainerStyle(
    variant: AgentLogsVariants = 'default',
    size: AgentLogsSizes = 'medium',
    state: AgentLogsStates = 'default',
    displayMode: AgentLogsDisplayMode = 'list',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentLogs?.container || {};
    
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
      list: {
        scrollable: true,
        alwaysScroll: true,
      },
      table: {
        scrollable: true,
        alwaysScroll: true,
      },
      compact: {
        scrollable: true,
        alwaysScroll: true,
      },
      detailed: {
        scrollable: true,
        alwaysScroll: true,
      },
      timeline: {
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
    variant: AgentLogsVariants = 'default',
    size: AgentLogsSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentLogs?.header || {};
    
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

  static getSearchStyle(
    variant: AgentLogsVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getListStyle(
    variant: AgentLogsVariants = 'default',
    size: AgentLogsSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentLogs?.list || {};
    
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
      alwaysScroll: true,
    };
  }

  static getTableStyle(
    variant: AgentLogsVariants = 'default',
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
      padding: { top: 1, right: 1, bottom: 1, left: 1 },
    };
  }

  static getCompactStyle(
    variant: AgentLogsVariants = 'default',
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
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
    };
  }

  static getDetailedStyle(
    variant: AgentLogsVariants = 'default',
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

  static getTimelineStyle(
    variant: AgentLogsVariants = 'default',
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

  static getLogEntryStyle(
    variant: AgentLogsVariants = 'default',
    state: AgentLogsStates = 'default',
    level: AgentLogsFilterLevel = 'info',
    isSelected: boolean = false,
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

    const selectedStyle = isSelected ? {
      bg: resolvedTheme.colors.background.accent,
      fg: resolvedTheme.colors.text.accent,
      borderFg: resolvedTheme.colors.border.accent,
    } : {};

    const stateStyles = {
      default: {},
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

    const levelStyles = {
      debug: {
        fg: resolvedTheme.colors.text.secondary,
        bg: resolvedTheme.colors.background.secondary,
      },
      info: {
        fg: resolvedTheme.colors.text.primary,
        bg: resolvedTheme.colors.background.primary,
      },
      warn: {
        fg: resolvedTheme.colors.status.warning,
        bg: resolvedTheme.colors.background.warning,
      },
      error: {
        fg: resolvedTheme.colors.status.error,
        bg: resolvedTheme.colors.background.error,
      },
      all: {
        fg: resolvedTheme.colors.text.primary,
        bg: resolvedTheme.colors.background.primary,
      },
    };

    return {
      ...baseStyle,
      ...selectedStyle,
      ...stateStyles[state],
      ...levelStyles[level],
    };
  }

  static getFilterStyle(
    variant: AgentLogsVariants = 'default',
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

  static getStatsStyle(
    variant: AgentLogsVariants = 'default',
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

  static getControlStyle(
    variant: AgentLogsVariants = 'default',
    state: AgentLogsStates = 'default',
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

  static getEmptyStyle(
    variant: AgentLogsVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.secondary,
      padding: { top: 2, right: 2, bottom: 2, left: 2 },
      align: 'center',
    };
  }

  static getLoadingStyle(
    variant: AgentLogsVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.secondary,
      padding: { top: 2, right: 2, bottom: 2, left: 2 },
      align: 'center',
    };
  }
}