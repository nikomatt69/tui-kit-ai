import { Widgets } from 'blessed';
import { AgentSelectorVariants, AgentSelectorSizes, AgentSelectorStates, AgentSelectorMode, AgentSelectorDisplayMode, AgentStatus } from './AgentSelector.types';
import { Theme, resolveTheme } from '../../../../core/src/theming/theme';
import { ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/theming/design-tokens';

export class AgentSelectorStyles {
  static getContainerStyle(
    variant: AgentSelectorVariants = 'default',
    size: AgentSelectorSizes = 'medium',
    state: AgentSelectorStates = 'default',
    mode: AgentSelectorMode = 'single',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentSelector?.container || {};
    
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

    const modeStyles = {
      single: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.primary,
      },
      multiple: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.accent,
      },
      dropdown: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.secondary,
      },
      radio: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.primary,
      },
      checkbox: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.accent,
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
      ...modeStyles[mode],
      ...stateStyles[state],
      scrollable: true,
      alwaysScroll: true,
    };
  }

  static getHeaderStyle(
    variant: AgentSelectorVariants = 'default',
    size: AgentSelectorSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentSelector?.header || {};
    
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
    variant: AgentSelectorVariants = 'default',
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
    variant: AgentSelectorVariants = 'default',
    size: AgentSelectorSizes = 'medium',
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    const baseStyle = resolvedTheme.components.agentSelector?.list || {};
    
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

  static getOptionStyle(
    variant: AgentSelectorVariants = 'default',
    state: AgentSelectorStates = 'default',
    mode: AgentSelectorMode = 'single',
    isSelected: boolean = false,
    isEnabled: boolean = true,
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

    const selectedStyle = isSelected ? {
      bg: resolvedTheme.colors.background.accent,
      fg: resolvedTheme.colors.text.accent,
      borderFg: resolvedTheme.colors.border.accent,
    } : {};

    const disabledStyle = !isEnabled ? {
      bg: resolvedTheme.colors.background.disabled,
      fg: resolvedTheme.colors.text.disabled,
      borderFg: resolvedTheme.colors.border.disabled,
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

    const modeStyles = {
      single: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.primary,
      },
      multiple: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.accent,
      },
      dropdown: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.secondary,
      },
      radio: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.primary,
      },
      checkbox: {
        border: { type: 'line' },
        borderFg: resolvedTheme.colors.border.accent,
      },
    };

    return {
      ...baseStyle,
      ...selectedStyle,
      ...disabledStyle,
      ...stateStyles[state],
      ...statusStyles[status],
      ...modeStyles[mode],
    };
  }

  static getGridStyle(
    variant: AgentSelectorVariants = 'default',
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
    variant: AgentSelectorVariants = 'default',
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

  static getCardsStyle(
    variant: AgentSelectorVariants = 'default',
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

  static getEmptyStyle(
    variant: AgentSelectorVariants = 'default',
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
    variant: AgentSelectorVariants = 'default',
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
    variant: AgentSelectorVariants = 'default',
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
    variant: AgentSelectorVariants = 'default',
    state: AgentSelectorStates = 'default',
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

  static getRadioStyle(
    isSelected: boolean = false,
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      fg: isSelected ? resolvedTheme.colors.status.success : resolvedTheme.colors.text.secondary,
      bg: resolvedTheme.colors.background.primary,
    };
  }

  static getCheckboxStyle(
    isSelected: boolean = false,
    theme: Theme
  ): any {
    const resolvedTheme = resolveTheme(theme);
    
    return {
      fg: isSelected ? resolvedTheme.colors.status.success : resolvedTheme.colors.text.secondary,
      bg: resolvedTheme.colors.background.primary,
    };
  }
}