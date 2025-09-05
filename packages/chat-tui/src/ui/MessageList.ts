import { Box } from "@tui-kit-ai/core";
import type { Widgets } from "blessed";
import type { ChatMessage } from "../types";
import { highlightCode } from "../utils/highlight";
import { parseMarkdownBlocks } from "../utils/markdown";

export class MessageList {
  public el: Widgets.BoxElement;
  private container: Box;
  private messages: ChatMessage[] = [];
  private streamingIndex: number | null = null;

  constructor(opts: {
    parent?: Widgets.Node;
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    width?: number | string;
    height?: number | string;
  }) {
    this.container = new Box({
      parent: opts.parent,
      top: opts.top,
      left: opts.left,
      right: opts.right,
      bottom: opts.bottom,
      width: opts.width,
      height: opts.height,
      scrollable: true,
      borderStyle: "line",
      padding: [0, 1],
      focusable: true,
      blessedProps: {
        
        
       
      },
    });
    this.el = this.container.el;
  }

  setMessages(messages: ChatMessage[]) {
    this.messages = messages.slice();
    this.streamingIndex = null;
    this.render();
  }

  append(msg: ChatMessage) {
    this.messages.push(msg);
    this.streamingIndex = null;
    this.render();
    this.scrollToBottom();
  }

  beginStreaming(role: ChatMessage["role"] = "assistant") {
    this.streamingIndex = this.messages.length;
    this.messages.push({ role, content: "" });
    this.render();
    this.scrollToBottom();
  }

  updateStreaming(chunk: string) {
    if (this.streamingIndex == null) return;
    this.messages[this.streamingIndex].content = chunk;
    this.render();
    this.scrollToBottom();
  }

  finalizeStreaming() {
    this.streamingIndex = null;
    this.render();
    this.scrollToBottom();
  }

  private render() {
    const blocks: string[] = [];
    for (const m of this.messages) {
      const prefix =
        m.role === "user"
          ? "{bold}👤 User{/bold}"
          : m.role === "assistant"
          ? "{bold}🤖 Assistant{/bold}"
          : "{bold}ℹ️ System{/bold}";
      blocks.push(`{cyan-fg}${prefix}{/cyan-fg}`);

      const parts = parseMarkdownBlocks(m.content || "");
      for (const part of parts) {
        if (part.type === "text") {
          blocks.push(part.text);
        } else if (part.type === "code") {
          const title = part.lang
            ? `{grey-fg}┌─ code:${part.lang}{/grey-fg}`
            : "{grey-fg}┌─ code{/grey-fg}";
          const body = highlightCode(part.lang || "text", part.code)
            .split("\n")
            .map((l) => `│ ${l}`)
            .join("\n");
          const footer =
            "{grey-fg}└────────────────────────────────────{/grey-fg}";
          blocks.push(`${title}\n${body}\n${footer}`);
        }
      }
      blocks.push("");
    }
    this.el.setContent(blocks.join("\n"));
    this.el.screen?.render();
  }

  private scrollToBottom() {
    const scrollable: any = this.el as any;
    if (typeof scrollable.scrollTo === "function") {
      scrollable.scrollTo(999999);
    } else {
      this.el.setScrollPerc(100);
    }
  }
}
