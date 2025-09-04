import { resolveBlessedColor } from "@tui-kit-ai/core";
import type { Message } from "ai";
import blessed from "blessed";

export interface MessageListProps {
  parent?: blessed.Widgets.Node;
  messages?: Message[];

  // Layout
  top?: string | number;
  left?: string | number;
  width?: string | number;
  height?: string | number;
  right?: string | number;
  bottom?: string | number;

  // Styling
  bg?: string;
  fg?: string;
  border?: boolean;
  borderColor?: string;

  // Behavior
  scrollable?: boolean;
  streaming?: boolean;
  currentStreamingMessage?: string;

  // Customization
  avatars?: {
    user?: string;
    assistant?: string;
    system?: string;
  };

  timestampFormat?: "short" | "long" | "none";
  groupSimilarRoles?: boolean; // Group consecutive messages from same role
  maxMessageLength?: number; // Truncate long messages

  // Events
  onMessageClick?: (message: Message) => void;
}

export class MessageList {
  public el: blessed.Widgets.BoxElement;
  private messages: Message[] = [];
  private options: MessageListProps;

  constructor(props: MessageListProps) {
    this.options = {
      scrollable: true,
      avatars: {
        user: "👤",
        assistant: "🤖",
        system: "ℹ️",
      },
      timestampFormat: "short",
      groupSimilarRoles: false,
      maxMessageLength: 500,
      ...props,
    };

    const {
      parent,
      bg,
      fg,
      border = true,
      borderColor,
      scrollable,
      ...restProps
    } = this.options;

    this.el = blessed.box({
      parent,
      scrollable,

      style: {
        bg: bg ? resolveBlessedColor(bg, {}) : undefined,
        fg: fg ? resolveBlessedColor(fg, {}) : "#ffffff",
      },

      border: border
        ? {
            type: "line",
            fg: borderColor
              ? resolveBlessedColor(borderColor, {})
              : ("#14b8a6" as any),
          }
        : undefined,

      // Enable mouse scrolling
      mouse: true,
      keys: true,

      // Padding for better text display
      padding: {
        left: 1,
        right: 1,
        top: 0,
        bottom: 0,
      },

      ...restProps,
    });

    // Set initial messages
    if (props.messages) {
      this.setMessages(props.messages);
    }

    // Handle streaming updates
    if (props.streaming && props.currentStreamingMessage) {
      this.updateStreamingMessage(props.currentStreamingMessage);
    }
  }

  // Update messages
  setMessages(messages: Message[]): void {
    this.messages = [...messages];
    this.render();
  }

  // Add a single message
  addMessage(message: Message): void {
    this.messages.push(message);
    this.render();
    this.scrollToBottom();
  }

  // Update streaming message
  updateStreamingMessage(content: string): void {
    const tempMessage: Message = {
      id: "streaming",
      role: "assistant",
      content,
      createdAt: new Date(),
    };

    // Replace or add streaming message
    const messagesWithoutStreaming = this.messages.filter(
      (m) => m.id !== "streaming"
    );
    this.setMessages([...messagesWithoutStreaming, tempMessage]);
  }

  // Clear all messages
  clear(): void {
    this.messages = [];
    this.render();
  }

  // Scroll to bottom
  scrollToBottom(): void {
    this.el.setScrollPerc(100);
    this.el.screen?.render();
  }

  // Private render method
  private render(): void {
    const content = this.generateContent();
    this.el.setContent(content);

    if (this.el.screen) {
      this.el.screen.render();
    }
  }

  private generateContent(): string {
    if (this.messages.length === 0) {
      return "{center}No messages yet. Start a conversation!{/center}";
    }

    const lines: string[] = [];
    let lastRole: string | null = null;
    let lastTimestamp: Date | null = null;

    for (let i = 0; i < this.messages.length; i++) {
      const message = this.messages[i];
      const avatar =
        this.options.avatars![
          message.role as keyof typeof this.options.avatars
        ] || "•";
      const timestamp = message.createdAt
        ? new Date(message.createdAt)
        : new Date();

      // Group similar roles if enabled
      const shouldGroup =
        this.options.groupSimilarRoles &&
        message.role === lastRole &&
        lastTimestamp &&
        timestamp.getTime() - lastTimestamp.getTime() < 60000; // 1 minute

      if (!shouldGroup) {
        // Add role header
        const roleColor = this.getRoleColor(message.role);
        const timestampStr = this.formatTimestamp(timestamp);

        const header = `{${roleColor}}${avatar} ${message.role.toUpperCase()}{/}`;

        lines.push(header);
      }

      // Process message content
      let content = message.content;

      // Truncate if too long
      if (
        this.options.maxMessageLength &&
        content.length > this.options.maxMessageLength
      ) {
        content = content.substring(0, this.options.maxMessageLength) + "...";
      }

      // Word wrap for long lines
      const wrappedLines = this.wrapText(
        content,
        (this.el.width as number) - 4
      );

      // Add content with proper indentation
      const isStreaming = message.id === "streaming";
      const contentColor = isStreaming ? "yellow-fg" : "white-fg";

      wrappedLines.forEach((line) => {
        lines.push(`  {${contentColor}}${line}{/}`);
      });

      // Add spacing between different roles
      if (!shouldGroup && i < this.messages.length - 1) {
        lines.push("");
      }

      lastRole = message.role;
      lastTimestamp = timestamp;
    }

    return lines.join("\\n");
  }

  private getRoleColor(role: string): string {
    const colors = {
      user: "blue-fg",
      assistant: "green-fg",
      system: "yellow-fg",
      function: "magenta-fg",
      tool: "cyan-fg",
    };
    return colors[role as keyof typeof colors] || "white-fg";
  }

  private formatTimestamp(date: Date): string {
    switch (this.options.timestampFormat) {
      case "short":
        return date.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
      case "long":
        return date.toLocaleString();
      case "none":
        return "";
      default:
        return "";
    }
  }

  private wrapText(text: string, width: number): string[] {
    if (width <= 0) return [text];

    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= width) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [""];
  }

  // Utility methods
  focus(): void {
    this.el.focus();
  }

  getLastMessage(): Message | undefined {
    return this.messages[this.messages.length - 1];
  }

  // Export messages for saving
  exportMessages(): Message[] {
    return [...this.messages];
  }

  // Get message count
  getMessageCount(): number {
    return this.messages.length;
  }
}

export default MessageList;
