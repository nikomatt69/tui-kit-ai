import { Box } from "@tui-kit-ai/core";
import type { Widgets } from "blessed";
import blessed from "blessed";

export type ProviderOption = {
  id: string; // 'openai', 'anthropic', 'ollama'
  label: string;
  description?: string;
};

export class ProviderSelector {
  public el: Widgets.BoxElement;
  private list: Widgets.ListElement;
  private onChange?: (providerId: string) => void;

  constructor(opts: {
    parent?: Widgets.Node;
    top?: number | string;
    left?: number | string;
    width?: number | string;
    height?: number | string;
    options: ProviderOption[];
    onChange?: (id: string) => void;
  }) {
    this.onChange = opts.onChange;
    const container = new Box({
      parent: opts.parent,
      top: opts.top,
      left: opts.left,
      width: opts.width ?? 24,
      height: opts.height ?? "100%",
      borderStyle: "line",
      label: " Provider ",
      focusable: true,
    });
    this.el = container.el;

    this.list = blessed.list({
      parent: this.el,
      top: 1,
      left: 0,
      right: 0,
      bottom: 0,
      keys: true,
      mouse: true,
      items: opts.options.map((o) => o.label),
      style: {
        selected: { bg: "blue", fg: "white" },
      },
    });

    this.list.on("select", (_item, index) => {
      const opt = opts.options[index];
      if (opt) this.onChange?.(opt.id);
    });
  }
}
