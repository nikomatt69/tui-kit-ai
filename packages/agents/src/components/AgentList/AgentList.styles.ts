import { Widgets } from 'blessed';
import { AgentListVariants, AgentListSizes, AgentListStates, AgentListViewMode, AgentStatus } from './AgentList.types';
import { Theme, resolveTheme } from '../../../../core/src/theming/theme';
import { ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/theming/design-tokens';

export class AgentListStyles {
  static getContainerStyle(
    variant: AgentListVariants = 'default',
    size: AgentListSizes = 'medium',
    state: AgentListStates = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentList?.container || {};
    
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
        height: 10,
        padding: { top: 1, right: 1, bottom: 1, left: 1 },
      },
      medium: {
        height: 15,
        padding: { top: 1, right: 2, bottom: 1, left: 2 },
      },
      large: {
        height: 20,
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

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...stateStyles[state],
      scrollable: true,
      alwaysScroll: true,
    };
  }

  static getHeaderStyle(
    variant: AgentListVariants = 'default',
    size: AgentListSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentList?.header || {};
    
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
    variant: AgentListVariants = 'default',
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
    variant: AgentListVariants = 'default',
    size: AgentListSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentList?.list || {};
    
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

  static getItemStyle(
    variant: AgentListVariants = 'default',
    state: AgentListStates = 'default',
    isSelected: boolean = false,
    status: AgentStatus = 'idle',
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

    const selectedStyle = {
      bg: resolvedTheme.colors.background.accent,
      fg: resolvedTheme.colors.text.accent,
      borderFg: resolvedTheme.colors.border.accent,
    };

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

    const statusStyles = {
      idle: {
        fg: resolvedTheme.colors.status.idle,
      },
      running: {
        fg: resolvedTheme.colors.status.success,
      },
      paused: {
        fg: resolvedTheme.colors.status.warning,
      },
      error: {
        fg: resolvedTheme.colors.status.error,
      },
      completed: {
        fg: resolvedTheme.colors.status.success,
      },
      stopped: {
        fg: resolvedTheme.colors.status.error,
      },
    };

    return {
      ...baseStyle,
      ...(isSelected ? selectedStyle : {}),
      ...stateStyles[state],
      ...statusStyles[status],
    };
  }

  static getGridStyle(
    variant: AgentListVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      padding: { top: 1, right: 1, bottom: 1, left: 1 },
    };
  }

  static getCompactStyle(
    variant: AgentListVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.secondary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getEmptyStyle(
    variant: AgentListVariants = 'default',
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
    variant: AgentListVariants = 'default',
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

  static getStatsStyle(
    variant: AgentListVariants = 'default',
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
    variant: AgentListVariants = 'default',
    state: AgentListStates = 'default',
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