import blessed, { Widgets } from "blessed";
import { resolveTheme } from "../theming/theme";
import { BaseProps, Component, computeBlessedStyle } from "./BaseComponent";

export type TextInputProps = BaseProps & {
  value?: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
  secret?: boolean;
};

export class TextInput implements Component<Widgets.TextboxElement> {
  el: Widgets.TextboxElement;
  theme: any;
  destroy: () => void;

  constructor(props: TextInputProps) {
    const theme = resolveTheme(props.theme);
    const el = blessed.textbox({
      parent: props.parent,
      inputOnFocus: true,
      value: props.value || "",
      secret: props.secret ?? false,
      style: computeBlessedStyle(theme, props),
      border:
        props.borderStyle && props.borderStyle !== "none" ? "line" : undefined,
      top: props.top,
      left: props.left,
      right: props.right,
      bottom: props.bottom,
      width: props.width,
      height: props.height,
      keys: props.keys ?? true,
      mouse: props.mouse ?? true,
      padding: undefined,
      label: props.label,
    });

    if (props.placeholder && !props.value) {
      el.setValue(props.placeholder);
      el.style.fg = "gray";
      el.on("focus", () => {
        if (el.getValue() === props.placeholder) {
          el.setValue("");
          el.style.fg = theme.foreground;
          el.screen.render();
        }
      });
      el.on("blur", () => {
        if (!el.getValue()) {
          el.setValue(props.placeholder!);
          el.style.fg = "gray";
        }
      });
    }

    if (props.onChange) {
      el.on("keypress", () => props.onChange!(el.getValue() || ""));
    }

    if (props.onSubmit) {
      el.on("submit", () => props.onSubmit!(el.getValue() || ""));
    }

    this.el = el;
    this.theme = theme;
    this.destroy = () => el.destroy();
  }

  // Required Component interface methods
  setVariant(variant: any): void {
    // Update variant styling if needed
  }

  setSize(size: any): void {
    // Update size if needed
  }

  setState(state: any): void {
    // Update state if needed
  }

  getConfig(): any {
    return {
      theme: this.theme,
    };
  }

  update(newProps: Partial<BaseProps>): void {
    // Update component properties
    if (newProps.width !== undefined) this.el.width = newProps.width;
    if (newProps.height !== undefined) this.el.height = newProps.height;
    if (newProps.top !== undefined) this.el.top = newProps.top;
    if (newProps.left !== undefined) this.el.left = newProps.left;
    if (newProps.right !== undefined) this.el.right = newProps.right;
    if (newProps.bottom !== undefined) this.el.bottom = newProps.bottom;
    if (newProps.label !== undefined) this.el.setLabel(newProps.label);

    this.el.screen.render();
  }

  // Utility methods
  getValue(): string {
    return this.el.getValue();
  }

  setValue(value: string): void {
    this.el.setValue(value);
    this.el.screen.render();
  }

  focus(): void {
    this.el.focus();
  }
}
