import { Box, Button, TextInput } from "@tui-kit-ai/core";
import type { Widgets } from "blessed";

export class ChatInput {
  public el: Widgets.BoxElement;
  private input: TextInput;
  private send: Button;
  private onSubmit?: (text: string) => void;

  constructor(opts: {
    parent?: Widgets.Node;
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    height?: number | string;
    onSubmit?: (text: string) => void;
  }) {
    this.onSubmit = opts.onSubmit;

    const container = new Box({
      parent: opts.parent,
      top: opts.top,
      left: opts.left,
      right: opts.right,
      bottom: opts.bottom,
      height: opts.height ?? 3,
      borderStyle: "line",
      padding: [0, 1],
      focusable: true,
    });
    this.el = container.el;

    this.input = new TextInput({
      parent: this.el,
      left: 1,
      top: 0,
      right: 12,
      height: 3,
      label: " Message ",
      keys: true,
      mouse: true,
      onSubmit: (v) => this.submit(v),
    });

    this.send = new Button({
      parent: this.el,
      right: 1,
      top: 0,
      width: 10,
      height: 3,
      text: "Send",
      variant: "primary",
      onClick: () => this.submit(this.input.getValue()),
    });
  }

  focus() {
    this.input.focus();
  }

  clear() {
    this.input.setValue("");
  }

  onSubmitChange(handler: (text: string) => void) {
    this.onSubmit = handler;
  }

  private submit(v: string) {
    const text = (v || "").trim();
    if (!text) return;
    this.onSubmit?.(text);
    this.clear();
    this.focus();
  }
}
