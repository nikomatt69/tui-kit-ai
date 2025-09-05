import { Box } from "@tui-kit-ai/core";
import type { Widgets } from "blessed";

export type ToolEvent = {
  tool: string;
  action: string;
  input?: any;
  output?: any;
  status?: "start" | "success" | "error";
};

export class ToolsPanel {
  public el: Widgets.BoxElement;
  private events: ToolEvent[] = [];
  constructor(opts: {
    parent?: Widgets.Node;
    top?: any;
    right?: any;
    width?: any;
    height?: any;
  }) {
    const box = new Box({
      parent: opts.parent,
      top: opts.top,
      right: opts.right,
      width: opts.width,
      height: opts.height,
      label: " Tools ",
      borderStyle: "line",
      padding: [0, 1],
      focusable: true,
      blessedProps: {},
    });
    this.el = box.el;
    this.render();
  }
  log(event: ToolEvent) {
    this.events.push(event);
    this.render();
  }
  clear() {
    this.events = [];
    this.render();
  }
  private render() {
    if (this.events.length === 0) {
      this.el.setContent("{grey-fg}No tool activity{/grey-fg}");
      return;
    }
    const lines = this.events.slice(-50).map((e) => {
      const status =
        e.status === "error"
          ? "{red-fg}error{/red-fg}"
          : e.status === "success"
          ? "{green-fg}ok{/green-fg}"
          : "{yellow-fg}start{/yellow-fg}";
      return `• {bold}${e.tool}{/bold}.{cyan-fg}${e.action}{/cyan-fg} - ${status}`;
    });
    this.el.setContent(lines.join("\n"));
    this.el.screen?.render();
  }
}
