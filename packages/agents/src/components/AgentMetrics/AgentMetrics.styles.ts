import { Widgets } from 'blessed';
import { AgentMetricsVariants, AgentMetricsSizes, AgentMetricsStates, AgentMetricsDisplayMode, AgentMetricsChartType } from './AgentMetrics.types';
import { Theme, resolveTheme } from '../../../../core/src/theming/theme';
import { ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/theming/design-tokens';

export class AgentMetricsStyles {
  static getContainerStyle(
    variant: AgentMetricsVariants = 'default',
    size: AgentMetricsSizes = 'medium',
    state: AgentMetricsStates = 'default',
    displayMode: AgentMetricsDisplayMode = 'table',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentMetrics?.container || {};
    
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
      table: {
        scrollable: true,
        alwaysScroll: true,
      },
      cards: {
        scrollable: true,
        alwaysScroll: true,
      },
      charts: {
        scrollable: true,
        alwaysScroll: true,
      },
      summary: {
        height: 6,
      },
      detailed: {
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
    variant: AgentMetricsVariants = 'default',
    size: AgentMetricsSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentMetrics?.header || {};
    
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

  static getTableStyle(
    variant: AgentMetricsVariants = 'default',
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

  static getCardStyle(
    variant: AgentMetricsVariants = 'default',
    size: AgentMetricsSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const sizeStyles = {
      small: {
        height: 4,
        width: 15,
        padding: { top: 1, right: 1, bottom: 1, left: 1 },
      },
      medium: {
        height: 6,
        width: 20,
        padding: { top: 1, right: 2, bottom: 1, left: 2 },
      },
      large: {
        height: 8,
        width: 25,
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

  static getChartStyle(
    variant: AgentMetricsVariants = 'default',
    chartType: AgentMetricsChartType = 'line',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const chartTypeStyles = {
      line: {
        height: 8,
        width: 30,
      },
      bar: {
        height: 8,
        width: 30,
      },
      pie: {
        height: 8,
        width: 20,
      },
      gauge: {
        height: 6,
        width: 15,
      },
      sparkline: {
        height: 3,
        width: 20,
      },
    };

    return {
      ...chartTypeStyles[chartType],
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.primary,
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      padding: { top: 1, right: 1, bottom: 1, left: 1 },
    };
  }

  static getSummaryStyle(
    variant: AgentMetricsVariants = 'default',
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

  static getDetailedStyle(
    variant: AgentMetricsVariants = 'default',
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

  static getMetricStyle(
    variant: AgentMetricsVariants = 'default',
    value: number,
    threshold?: number,
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    let fg = resolvedTheme.colors.text.primary;
    let bg = resolvedTheme.colors.background.primary;
    
    if (threshold !== undefined) {
      if (value > threshold * 1.2) {
        fg = resolvedTheme.colors.status.error;
        bg = resolvedTheme.colors.background.error;
      } else if (value > threshold) {
        fg = resolvedTheme.colors.status.warning;
        bg = resolvedTheme.colors.background.warning;
      } else {
        fg = resolvedTheme.colors.status.success;
        bg = resolvedTheme.colors.background.success;
      }
    }

    return {
      fg,
      bg,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getAlertStyle(
    variant: AgentMetricsVariants = 'default',
    alertType: 'warning' | 'error' | 'info' | 'success' = 'info',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const alertTypeStyles = {
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
      info: {
        fg: resolvedTheme.colors.status.info,
        bg: resolvedTheme.colors.background.info,
        borderFg: resolvedTheme.colors.status.info,
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

  static getTrendStyle(
    variant: AgentMetricsVariants = 'default',
    direction: 'up' | 'down' | 'stable' = 'stable',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const directionStyles = {
      up: {
        fg: resolvedTheme.colors.status.success,
        bg: resolvedTheme.colors.background.success,
      },
      down: {
        fg: resolvedTheme.colors.status.error,
        bg: resolvedTheme.colors.background.error,
      },
      stable: {
        fg: resolvedTheme.colors.text.secondary,
        bg: resolvedTheme.colors.background.primary,
      },
    };

    return {
      ...directionStyles[direction],
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getComparisonStyle(
    variant: AgentMetricsVariants = 'default',
    better: boolean = true,
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const comparisonStyles = {
      better: {
        fg: resolvedTheme.colors.status.success,
        bg: resolvedTheme.colors.background.success,
      },
      worse: {
        fg: resolvedTheme.colors.status.error,
        bg: resolvedTheme.colors.background.error,
      },
    };

    return {
      ...comparisonStyles[better ? 'better' : 'worse'],
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getControlStyle(
    variant: AgentMetricsVariants = 'default',
    state: AgentMetricsStates = 'default',
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
    variant: AgentMetricsVariants = 'default',
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