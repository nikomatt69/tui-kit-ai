import { ToolOutput, ToolProgress, ToolSelector } from "@tui-kit-ai/ai";
import MessageList from "@tui-kit-ai/ai/src/components/MessageList";
import PromptEditor from "@tui-kit-ai/ai/src/components/PromptEditor";

import blessed from "blessed";

// Simple AI Chat App demo (simulated streaming)
const screen = blessed.screen({ smartCSR: true, title: "AI Chat App" });
screen.key(["C-c", "q"], () => process.exit(0));

// Layout: left conversation, bottom prompt, right tools
const msgList = new MessageList({
  parent: screen,
  top: 0,
  left: 0,
  right: 40,
  height: "80%",
});

const prompt = new PromptEditor({
  parent: screen,
  top: "80%",
  left: 0,
  right: 40,
  height: "20%",
  multiline: true,
  onSubmit: (text: string) => submit(text),
});

// Right column: tools/output/progress panels

const tools = new ToolSelector({
  parent: screen,
  top: "30%",
  right: 0,
  width: 40,
  height: "20%",
} as any);

const toolOut = new ToolOutput({
  parent: screen,
  top: "50%",
  right: 0,
  width: 40,
  height: "30%",
} as any);

const toolProg = new ToolProgress({
  parent: screen,
  top: "80%",
  right: 0,
  width: 40,
  height: "20%",
} as any);

// Initial messages
(msgList as any).setMessages?.([
  { id: "1", role: "system", content: "Welcome. Ask me anything." },
]);

async function submit(text: string) {
  // Append user message
  (msgList as any).append?.({
    id: Date.now().toString(),
    role: "user",
    content: text,
  });
  prompt.setValue?.("");
  // Simulated streaming reply
  const reply = `Here is some code:\n\n\
\`\`\`ts\nexport const add = (a:number,b:number)=>a+b;\n\`\`\``;
  let acc = "";
  for (const ch of reply) {
    acc += ch;
    (msgList as any).updateStreamingMessage?.(acc);
    await new Promise((r) => setTimeout(r, 2));
  }
  (msgList as any).append?.({
    id: (Date.now() + 1).toString(),
    role: "assistant",
    content: reply,
  });
  // Simulate tool activity
  (toolOut as any).append?.({ name: "websearch", output: "Found 3 results" });
  (toolProg as any).setProgress?.(60);
}

screen.render();
