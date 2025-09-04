import { Widgets } from 'blessed';
import { AgentDashboardVariants, AgentDashboardSizes, AgentDashboardStates, AgentDashboardLayout, AgentDashboardViewMode, AgentDashboardRefreshMode } from './AgentDashboard.types';
import { Theme, resolveTheme } from '../../../../core/src/theming/theme';
import { ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/theming/design-tokens';

export class AgentDashboardStyles {
  static getContainerStyle(
    variant: AgentDashboardVariants = 'default',
    size: AgentDashboardSizes = 'medium',
    state: AgentDashboardStates = 'default',
    layout: AgentDashboardLayout = 'grid',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentDashboard?.container || {};
    
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
        height: 12,
        padding: { top: 1, right: 1, bottom: 1, left: 1 },
      },
      medium: {
        height: 16,
        padding: { top: 1, right: 2, bottom: 1, left: 2 },
      },
      large: {
        height: 20,
        padding: { top: 2, right: 3, bottom: 2, left: 3 },
      },
    };

    const layoutStyles = {
      grid: {
        // Grid layout styling
      },
      rows: {
        // Row layout styling
      },
      columns: {
        // Column layout styling
      },
      tabs: {
        // Tab layout styling
      },
      split: {
        // Split layout styling
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
      ...layoutStyles[layout],
      ...stateStyles[state],
    };
  }

  static getHeaderStyle(
    variant: AgentDashboardVariants = 'default',
    size: AgentDashboardSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentDashboard?.header || {};
    
    const sizeStyles = {
      small: { height: 3, padding: { top: 0, right: 1, bottom: 0, left: 1 } },
      medium: { height: 4, padding: { top: 0, right: 2, bottom: 0, left: 2 } },
      large: { height: 5, padding: { top: 1, right: 3, bottom: 1, left: 3 } },
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

  static getPanelStyle(
    variant: AgentDashboardVariants = 'default',
    size: AgentDashboardSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
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

    return {
      ...sizeStyles[size],
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
    };
  }

  static getGridStyle(
    variant: AgentDashboardVariants = 'default',
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

  static getTabStyle(
    variant: AgentDashboardVariants = 'default',
    state: AgentDashboardStates = 'default',
    isActive: boolean = false,
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

    const activeStyle = isActive ? {
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

    return {
      ...baseStyle,
      ...activeStyle,
      ...stateStyles[state],
    };
  }

  static getStatsStyle(
    variant: AgentDashboardVariants = 'default',
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

  static getAlertStyle(
    variant: AgentDashboardVariants = 'default',
    alertType: 'info' | 'warning' | 'error' | 'success' = 'info',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const alertTypeStyles = {
      info: {
        fg: resolvedTheme.colors.status.info,
        bg: resolvedTheme.colors.background.info,
        borderFg: resolvedTheme.colors.status.info,
      },
      warning: {
        fg: resolvedTheme.colors.status.warning,
        bg: resolvedTheme.colors.background.warning,
        borderFg: resolvedTheme.colors.status.warning,
      },
      error: {
        fg: resolvedTheme.colors.status.error,
        bg: resolvedTheme.colors.background.error,
        borderFg: resolvedTheme.colors.status.error,
      },
      success: {
        fg: resolvedTheme.colors.status.success,
        bg: resolvedTheme.colors.background.success,
        borderFg: resolvedTheme.colors.status.success,
      },
    };

    return {
      ...alertTypeStyles[alertType],
      border: { type: 'line' },
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getNotificationStyle(
    variant: AgentDashboardVariants = 'default',
    notificationType: 'info' | 'warning' | 'error' | 'success' = 'info',
    isRead: boolean = false,
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const notificationTypeStyles = {
      info: {
        fg: resolvedTheme.colors.status.info,
        bg: resolvedTheme.colors.background.info,
        borderFg: resolvedTheme.colors.status.info,
      },
      warning: {
        fg: resolvedTheme.colors.status.warning,
        bg: resolvedTheme.colors.background.warning,
        borderFg: resolvedTheme.colors.status.warning,
      },
      error: {
        fg: resolvedTheme.colors.status.error,
        bg: resolvedTheme.colors.background.error,
        borderFg: resolvedTheme.colors.status.error,
      },
      success: {
        fg: resolvedTheme.colors.status.success,
        bg: resolvedTheme.colors.background.success,
        borderFg: resolvedTheme.colors.status.success,
      },
    };

    const readStyle = isRead ? {
      fg: resolvedTheme.colors.text.secondary,
      bg: resolvedTheme.colors.background.secondary,
      borderFg: resolvedTheme.colors.border.secondary,
    } : {};

    return {
      ...notificationTypeStyles[notificationType],
      ...readStyle,
      border: { type: 'line' },
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getControlStyle(
    variant: AgentDashboardVariants = 'default',
    state: AgentDashboardStates = 'default',
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

  static getSystemStatsStyle(
    variant: AgentDashboardVariants = 'default',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      padding: { top: 1, right: 2, bottom: 1, left: 2 },
    };
  }

  static getRefreshIndicatorStyle(
    variant: AgentDashboardVariants = 'default',
    refreshMode: AgentDashboardRefreshMode = 'manual',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const refreshModeStyles = {
      manual: {
        fg: resolvedTheme.colors.text.secondary,
        bg: resolvedTheme.colors.background.secondary,
      },
      auto: {
        fg: resolvedTheme.colors.status.success,
        bg: resolvedTheme.colors.background.success,
      },
      realtime: {
        fg: resolvedTheme.colors.status.info,
        bg: resolvedTheme.colors.background.info,
      },
    };

    return {
      ...refreshModeStyles[refreshMode],
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }
}