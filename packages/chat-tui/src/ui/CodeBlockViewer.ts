import { Box } from "@tui-kit-ai/core";
import type { Widgets } from "blessed";
import { highlightCode } from "../utils/highlight";
import { parseMarkdownBlocks } from "../utils/markdown";

export class CodeBlockViewer {
  public el: Widgets.BoxElement;
  private lang?: string;
  private code: string = "";
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
      label: " Code ",
      borderStyle: "line",
      padding: [0, 1],
      focusable: true,
      blessedProps: {},
    });
    this.el = box.el;
  }
  updateFromContent(content: string) {
    const parts = parseMarkdownBlocks(content);
    const lastCode = [...parts].reverse().find((p) => p.type === "code") as any;
    if (lastCode) {
      this.lang = lastCode.lang;
      this.code = lastCode.code;
      const title = this.lang ? `{grey-fg}${this.lang}{/grey-fg}` : "";
      const body = highlightCode(this.lang || "text", this.code);
      this.el.setLabel(` Code ${title} ` as any);
      this.el.setContent(body);
    } else {
      this.el.setLabel(" Code " as any);
      this.el.setContent("");
    }
    this.el.screen?.render();
  }
}
