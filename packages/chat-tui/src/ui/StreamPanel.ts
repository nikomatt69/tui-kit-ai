import { Box } from "@tui-kit-ai/core";
import type { Widgets } from "blessed";

export class StreamPanel {
  public el: Widgets.BoxElement;
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
      label: " Stream ",
      borderStyle: "line",
      padding: [0, 1],
      focusable: true,
      blessedProps: {},
    });
    this.el = box.el;
  }
  setContent(text: string) {
    this.el.setContent(text);
    this.el.screen?.render();
  }
}
