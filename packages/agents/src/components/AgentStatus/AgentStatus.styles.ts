import { Widgets } from 'blessed';
import { AgentStatusVariants, AgentStatusSizes, AgentStatusStates, AgentStatusDisplayMode, AgentStatusAnimation, AgentStatusType } from './AgentStatus.types';
import { Theme, resolveTheme } from '../../../../core/src/theming/theme';
import { ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/theming/design-tokens';

export class AgentStatusStyles {
  static getContainerStyle(
    variant: AgentStatusVariants = 'default',
    size: AgentStatusSizes = 'medium',
    state: AgentStatusStates = 'default',
    status: AgentStatusType = 'idle',
    displayMode: AgentStatusDisplayMode = 'both',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentStatus?.container || {};
    
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
        height: 1,
        width: 8,
        padding: { top: 0, right: 1, bottom: 0, left: 1 },
      },
      medium: {
        height: 2,
        width: 12,
        padding: { top: 0, right: 1, bottom: 0, left: 1 },
      },
      large: {
        height: 3,
        width: 16,
        padding: { top: 0, right: 2, bottom: 0, left: 2 },
      },
    };

    const displayModeStyles = {
      icon: {
        width: 3,
        height: 1,
      },
      text: {
        width: 8,
        height: 1,
      },
      both: {
        width: 12,
        height: 1,
      },
      progress: {
        width: 16,
        height: 2,
      },
      detailed: {
        width: 20,
        height: 3,
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
        fg: resolvedTheme.colors.status.idle,
        bg: resolvedTheme.colors.background.idle,
        borderFg: resolvedTheme.colors.status.idle,
      },
      running: {
        fg: resolvedTheme.colors.status.success,
        bg: resolvedTheme.colors.background.success,
        borderFg: resolvedTheme.colors.status.success,
      },
      paused: {
        fg: resolvedTheme.colors.status.warning,
        bg: resolvedTheme.colors.background.warning,
        borderFg: resolvedTheme.colors.status.warning,
      },
      error: {
        fg: resolvedTheme.colors.status.error,
        bg: resolvedTheme.colors.background.error,
        borderFg: resolvedTheme.colors.status.error,
      },
      completed: {
        fg: resolvedTheme.colors.status.success,
        bg: resolvedTheme.colors.background.success,
        borderFg: resolvedTheme.colors.status.success,
      },
      stopped: {
        fg: resolvedTheme.colors.status.error,
        bg: resolvedTheme.colors.background.error,
        borderFg: resolvedTheme.colors.status.error,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...displayModeStyles[displayMode],
      ...stateStyles[state],
      ...statusStyles[status],
    };
  }

  static getIconStyle(
    status: AgentStatusType = 'idle',
    animation: AgentStatusAnimation = 'none',
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

    const animationStyles = {
      none: {},
      pulse: {
        // Animation will be handled by JavaScript
      },
      blink: {
        // Animation will be handled by JavaScript
      },
      rotate: {
        // Animation will be handled by JavaScript
      },
      bounce: {
        // Animation will be handled by JavaScript
      },
    };

    return {
      ...statusStyles[status],
      ...animationStyles[animation],
      border: { type: 'line' },
      borderFg: statusStyles[status].fg,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      height: 1,
      width: 3,
    };
  }

  static getTextStyle(
    status: AgentStatusType = 'idle',
    size: AgentStatusSizes = 'medium',
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

    const sizeStyles = {
      small: {
        height: 1,
        padding: { top: 0, right: 1, bottom: 0, left: 1 },
      },
      medium: {
        height: 1,
        padding: { top: 0, right: 1, bottom: 0, left: 1 },
      },
      large: {
        height: 1,
        padding: { top: 0, right: 2, bottom: 0, left: 2 },
      },
    };

    return {
      ...statusStyles[status],
      ...sizeStyles[size],
      border: { type: 'line' },
      borderFg: statusStyles[status].fg,
    };
  }

  static getProgressStyle(
    status: AgentStatusType = 'idle',
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

  static getDetailsStyle(
    status: AgentStatusType = 'idle',
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
      bg: resolvedTheme.colors.background.primary,
      fg: resolvedTheme.colors.text.secondary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getTimestampStyle(
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      fg: resolvedTheme.colors.text.secondary,
      bg: resolvedTheme.colors.background.primary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getDurationStyle(
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      fg: resolvedTheme.colors.text.secondary,
      bg: resolvedTheme.colors.background.primary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }

  static getMessageStyle(
    status: AgentStatusType = 'idle',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    const statusStyles = {
      idle: {
        fg: resolvedTheme.colors.text.primary,
      },
      running: {
        fg: resolvedTheme.colors.text.success,
      },
      paused: {
        fg: resolvedTheme.colors.text.warning,
      },
      error: {
        fg: resolvedTheme.colors.text.error,
      },
      completed: {
        fg: resolvedTheme.colors.text.success,
      },
      stopped: {
        fg: resolvedTheme.colors.text.error,
      },
    };

    return {
      ...statusStyles[status],
      bg: resolvedTheme.colors.background.primary,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      height: 1,
    };
  }
}