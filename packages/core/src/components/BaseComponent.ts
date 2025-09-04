import blessed, { Widgets } from 'blessed';
import { StyleProps, Theme, resolveTheme } from '../theming/theme';
import { ComponentVariant, ComponentSize, ComponentState, tokens } from '../theming/design-tokens';
import { getComponentTokens, mergeComponentStyles } from '../utils/variants';
import { BasePropsSchema } from '../validation/base-schemas';
import { validateBaseProps, ValidationResult } from '../validation/component-validator';

export type PositionProps = {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    width?: number | string;
    height?: number | string;
};

export type BaseProps = StyleProps & PositionProps & {
    parent?: Widgets.Node;
    label?: string;
    keys?: boolean;
    mouse?: boolean;
    scrollable?: boolean;
    // New variant system props
    variant?: ComponentVariant;
    size?: ComponentSize;
    state?: ComponentState;
    // Advanced styling props
    borderRadius?: string;
    shadow?: string;
    animation?: string;
    // Responsive props
    responsive?: Record<string, Partial<BaseProps>>;
    // Blessed-specific props
    blessedProps?: {
        style?: Record<string, any>;
        [key: string]: any;
    };
};

export type Component<T extends Widgets.BlessedElement = Widgets.BlessedElement> = {
    el: T;
    theme: Theme;
    destroy: () => void;
    // New methods for variant system
    setVariant: (variant: ComponentVariant) => void;
    setSize: (size: ComponentSize) => void;
    setState: (state: ComponentState) => void;
    getConfig: () => ComponentConfig;
    update: (props: Partial<BaseProps>) => void;
};

export type ComponentConfig = {
    variant: ComponentVariant;
    size: ComponentSize;
    state: ComponentState;
    theme: Theme;
    responsive?: Record<string, Partial<BaseProps>>;
};

// Enhanced style computation with variants and Zod validation
export function computeBlessedStyle(
    theme: Theme,
    props: BaseProps,
    componentName?: string,
    variant?: ComponentVariant,
    size?: ComponentSize
) {
    // Validate props using Zod
    const validationResult = validateBaseProps(props);
    if (!validationResult.success) {
        console.error('❌ BaseComponent validation failed:', validationResult.errors);
        throw new Error(`BaseComponent validation failed: ${validationResult.errors?.message || 'Unknown error'}`);
    }

    const validatedProps = validationResult.data;
    
    const baseStyle: any = {
        bg: validatedProps.bg || theme.background,
        fg: validatedProps.fg || theme.foreground,
        border: {
            fg: validatedProps.borderColor || theme.border,
        },
    };

    // Apply component-specific tokens if available
    if (componentName && variant && size) {
        const componentTokens = getComponentTokens(componentName, variant, size);
        Object.assign(baseStyle, componentTokens);
    }

    // Apply custom styling props
    if (validatedProps.borderRadius) {
        baseStyle.borderRadius = validatedProps.borderRadius;
    }

    if (validatedProps.shadow) {
        baseStyle.shadow = validatedProps.shadow;
    }

    if (validatedProps.animation) {
        baseStyle.animation = validatedProps.animation;
    }

    return baseStyle;
}

// Enhanced padding normalization
export function normalizePadding(p?: number | [number, number] | Record<string, number>) {
    if (!p && p !== 0) return undefined as unknown as Widgets.Padding;
    
    if (typeof p === 'number') {
        return [p, p, p, p];
    }
    
    if (Array.isArray(p)) {
        if (p.length === 2) {
            return [p[0], p[1], p[0], p[1]];
        }
        if (p.length === 4) {
            return p;
        }
    }
    
    if (typeof p === 'object') {
        return [
            p.top || 0,
            p.right || 0,
            p.bottom || 0,
            p.left || 0
        ];
    }
    
    return [0, 0, 0, 0];
}

// Enhanced margin normalization
export function normalizeMargin(m?: number | [number, number] | Record<string, number>) {
    if (!m && m !== 0) return undefined as unknown as Widgets.Margin;
    
    if (typeof m === 'number') {
        return [m, m, m, m];
    }
    
    if (Array.isArray(m)) {
        if (m.length === 2) {
            return [m[0], m[1], m[0], m[1]];
        }
        if (m.length === 4) {
            return m;
        }
    }
    
    if (typeof m === 'object') {
        return [
            m.top || 0,
            m.right || 0,
            m.bottom || 0,
            m.left || 0
        ];
    }
    
    return [0, 0, 0, 0];
}

// Create blessed element with validation
export function createBlessedElement<T extends Widgets.BlessedElement>(
    type: string,
    props: BaseProps,
    theme: Theme
): T {
    // Validate props
    const validationResult = validateBaseProps(props);
    if (!validationResult.success) {
        console.error('❌ Blessed element validation failed:', validationResult.errors);
        throw new Error(`Blessed element validation failed: ${validationResult.errors?.message || 'Unknown error'}`);
    }

    const validatedProps = validationResult.data;
    
    // Normalize padding and margin
    const padding = normalizePadding(validatedProps.padding);
    const margin = normalizeMargin(validatedProps.margin);
    
    // Create blessed element
    const element = blessed[type as keyof typeof blessed]({
        ...validatedProps,
        padding,
        margin,
        style: computeBlessedStyle(theme, validatedProps),
    }) as T;
    
    return element;
}

// Create box base component with full variant system
export function createBoxBase<T extends Widgets.BoxElement>(props: BaseProps): Component<T> {
    const theme = resolveTheme(props.theme);
    const variant = props.variant || 'default';
    const size = props.size || 'md';
    const state = props.state || 'default';
    
    const element = createBlessedElement<Widgets.BoxElement>('box', props, theme);
    
    // Setup basic event handling
    if (props.keys) {
        element.key(['escape', 'q', 'C-c'], () => {
            process.exit(0);
        });
    }
    
    // Setup mouse handling
    if (props.mouse) {
        element.mouse(['click', 'wheelup', 'wheeldown'], (ch, x, y) => {
            // Handle mouse events
        });
    }
    
    // Setup scrolling
    if (props.scrollable) {
        element.setScrollPerc(0);
        element.key(['up', 'down', 'pageup', 'pagedown'], (ch, key) => {
            if (key.name === 'up' || key.name === 'pageup') {
                element.setScrollPerc(Math.max(0, element.getScrollPerc() - 10));
            } else if (key.name === 'down' || key.name === 'pagedown') {
                element.setScrollPerc(Math.min(100, element.getScrollPerc() + 10));
            }
        });
    }
    
    const component: Component<T> = {
        el: element as T,
        theme,
        destroy: () => {
            element.destroy();
        },
        setVariant: (newVariant: ComponentVariant) => {
            const newStyle = computeBlessedStyle(theme, { ...props, variant: newVariant });
            Object.assign(element.style, newStyle);
            element.screen.render();
        },
        setSize: (newSize: ComponentSize) => {
            const newStyle = computeBlessedStyle(theme, { ...props, size: newSize });
            Object.assign(element.style, newStyle);
            element.screen.render();
        },
        setState: (newState: ComponentState) => {
            const stateStyle = getStateStyle(newState, theme);
            Object.assign(element.style, stateStyle);
            element.screen.render();
        },
        getConfig: () => ({
            variant,
            size,
            state,
            theme,
            responsive: props.responsive,
        }),
        update: (newProps: Partial<BaseProps>) => {
            // Update element properties
            if (newProps.width !== undefined) element.width = newProps.width;
            if (newProps.height !== undefined) element.height = newProps.height;
            if (newProps.top !== undefined) element.top = newProps.top;
            if (newProps.left !== undefined) element.left = newProps.left;
            if (newProps.right !== undefined) element.right = newProps.right;
            if (newProps.bottom !== undefined) element.bottom = newProps.bottom;
            if (newProps.label !== undefined) element.setLabel(newProps.label);
            
            // Update styles if variants changed
            if (newProps.variant || newProps.size || newProps.state) {
                const updatedProps = { ...props, ...newProps };
                const newStyle = computeBlessedStyle(theme, updatedProps);
                Object.assign(element.style, newStyle);
            }
            
            element.screen.render();
        },
    };
    
    return component;
}

// State-specific styling
function getStateStyle(state: ComponentState, theme: Theme): Record<string, any> {
    switch (state) {
        case 'hover':
            return {
                bg: theme.accent,
                fg: theme.background,
            };
        case 'focus':
            return {
                border: { fg: theme.accent, type: 'line' },
            };
        case 'active':
            return {
                bg: theme.accent,
                fg: theme.background,
            };
        case 'disabled':
            return {
                bg: theme.muted,
                fg: theme.foreground,
                dim: true,
            };
        case 'loading':
            return {
                bg: theme.muted,
                fg: theme.foreground,
                blink: true,
            };
        default:
            return {};
    }
}

// Utility function to merge component styles
export function mergeComponentStyles(base: any, overrides: any): any {
    return {
        ...base,
        ...overrides,
        border: {
            ...base.border,
            ...overrides.border,
        },
        padding: overrides.padding || base.padding,
        margin: overrides.margin || base.margin,
    };
}

// Utility function to create responsive styles
export function createResponsiveStyles(
    baseProps: BaseProps,
    breakpoints: Record<string, Partial<BaseProps>>
): Record<string, any> {
    const responsiveStyles: Record<string, any> = {};
    
    Object.entries(breakpoints).forEach(([breakpoint, props]) => {
        responsiveStyles[breakpoint] = mergeComponentStyles(baseProps, props);
    });
    
    return responsiveStyles;
}

// Export validation result type
export type { ValidationResult } from '../validation/component-validator';

