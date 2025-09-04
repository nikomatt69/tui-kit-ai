import { Widgets } from 'blessed';
import { AgentCardVariants, AgentCardSizes, AgentCardStates, AgentCardLayout, AgentCardDisplayMode, AgentStatus } from './AgentCard.types';
import { Theme, resolveTheme } from '../../../../core/src/theming/theme';
import { ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/theming/design-tokens';

export class AgentCardStyles {
  static getContainerStyle(
    variant: AgentCardVariants = 'default',
    size: AgentCardSizes = 'medium',
    state: AgentCardStates = 'default',
    layout: AgentCardLayout = 'vertical',
    isSelected: boolean = false,
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentCard?.container || {};
    
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
        height: 6,
        width: 20,
        padding: { top: 1, right: 1, bottom: 1, left: 1 },
      },
      medium: {
        height: 10,
        width: 30,
        padding: { top: 1, right: 2, bottom: 1, left: 2 },
      },
      large: {
        height: 14,
        width: 40,
        padding: { top: 2, right: 3, bottom: 2, left: 3 },
      },
    };

    const layoutStyles = {
      horizontal: {
        height: sizeStyles[size].height,
        width: sizeStyles[size].width * 1.5,
      },
      vertical: {
        height: sizeStyles[size].height,
        width: sizeStyles[size].width,
      },
      compact: {
        height: 4,
        width: 25,
        padding: { top: 0, right: 1, bottom: 0, left: 1 },
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

    const selectedStyle = isSelected ? {
      borderFg: resolvedTheme.colors.border.accent,
      bg: resolvedTheme.colors.background.accent,
      fg: resolvedTheme.colors.text.accent,
    } : {};

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...layoutStyles[layout],
      ...stateStyles[state],
      ...selectedStyle,
    };
  }

  static getHeaderStyle(
    variant: AgentCardVariants = 'default',
    size: AgentCardSizes = 'medium',
    layout: AgentCardLayout = 'vertical',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentCard?.header || {};
    
    const sizeStyles = {
      small: { height: 2, padding: { top: 0, right: 1, bottom: 0, left: 1 } },
      medium: { height: 3, padding: { top: 0, right: 2, bottom: 0, left: 2 } },
      large: { height: 4, padding: { top: 1, right: 3, bottom: 1, left: 3 } },
    };

    const layoutStyles = {
      horizontal: { height: sizeStyles[size].height },
      vertical: { height: sizeStyles[size].height },
      compact: { height: 1, padding: { top: 0, right: 1, bottom: 0, left: 1 } },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...layoutStyles[layout],
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.secondary,
      bg: resolvedTheme.colors.background.secondary,
      fg: resolvedTheme.colors.text.primary,
    };
  }

  static getContentStyle(
    variant: AgentCardVariants = 'default',
    size: AgentCardSizes = 'medium',
    layout: AgentCardLayout = 'vertical',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentCard?.content || {};
    
    const sizeStyles = {
      small: { padding: { top: 1, right: 1, bottom: 1, left: 1 } },
      medium: { padding: { top: 1, right: 2, bottom: 1, left: 2 } },
      large: { padding: { top: 2, right: 3, bottom: 2, left: 3 } },
    };

    const layoutStyles = {
      horizontal: { padding: { top: 1, right: 2, bottom: 1, left: 2 } },
      vertical: { padding: sizeStyles[size].padding },
      compact: { padding: { top: 0, right: 1, bottom: 0, left: 1 } },
    };

    return {
      ...baseStyle,
      ...layoutStyles[layout],
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
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
      height: 1,
    };
  }

  static getMetricsStyle(
    variant: AgentCardVariants = 'default',
    size: AgentCardSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const sizeStyles = {
      small: { padding: { top: 0, right: 1, bottom: 0, left: 1 } },
      medium: { padding: { top: 0, right: 1, bottom: 0, left: 1 } },
      large: { padding: { top: 0, right: 1, bottom: 0, left: 1 } },
    };

    return {
      ...sizeStyles[size],
      border: { type: 'line' },
      borderFg: resolvedTheme.colors.border.secondary,
      bg: resolvedTheme.colors.background.secondary,
      fg: resolvedTheme.colors.text.secondary,
      height: 1,
    };
  }

  static getControlsStyle(
    variant: AgentCardVariants = 'default',
    state: AgentCardStates = 'default',
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

  static getInfoStyle(
    variant: AgentCardVariants = 'default',
    size: AgentCardSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const sizeStyles = {
      small: { padding: { top: 0, right: 1, bottom: 0, left: 1 } },
      medium: { padding: { top: 0, right: 1, bottom: 0, left: 1 } },
      large: { padding: { top: 0, right: 1, bottom: 0, left: 1 } },
    };

    return {
      ...sizeStyles[size],
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.primary,
      height: 1,
    };
  }

  static getCapabilitiesStyle(
    variant: AgentCardVariants = 'default',
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

  static getButtonStyle(
    variant: AgentCardVariants = 'default',
    state: AgentCardStates = 'default',
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
      width: 8,
    };
  }
}