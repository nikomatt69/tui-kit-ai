import { addCommand } from "./add";

interface PresetOptions {
  force?: boolean;
}

// Predefined component presets
const PRESETS = {
  minimal: {
    name: "Minimal",
    description: "Essential components for basic TUI apps",
    components: ["box", "text", "button", "input"],
  },

  pro: {
    name: "Pro",
    description: "Professional components for advanced TUI apps",
    components: [
      "box",
      "stack",
      "text",
      "heading",
      "button",
      "input",
      "textarea",
      "badge",
      "spinner",
      "progress",
    ],
  },

  dashboard: {
    name: "Dashboard",
    description: "Components for dashboard and monitoring UIs",
    components: [
      "box",
      "stack",
      "text",
      "heading",
      "badge",
      "progress",
      "spinner",
      "table",
      "chart",
      "status-bar",
    ],
  },

  ai: {
    name: "AI Components",
    description: "AI-specific components for chat and streaming",
    components: [
      "chat-layout",
      "message-list",
      "prompt-editor",
      "stream-view",
      "tool-call-view",
      "model-picker",
    ],
  },

  form: {
    name: "Form",
    description: "Complete form components",
    components: [
      "input",
      "textarea",
      "select",
      "checkbox",
      "radio-group",
      "button",
      "form",
      "field",
      "label",
    ],
  },
};

export async function presetCommand(
  action: string,
  presetName?: string,
  options: PresetOptions = {}
) {
  if (action === "list") {
    console.log("📋 Available presets:\\n");

    Object.entries(PRESETS).forEach(([key, preset]) => {
      console.log(`  ${key.padEnd(12)} ${preset.name}`);
      console.log(`               ${preset.description}`);
      console.log(`               Components: ${preset.components.join(", ")}`);
      console.log("");
    });

    console.log("Usage:");
    console.log("  tui preset add minimal    # Add minimal preset");
    console.log("  tui preset add pro        # Add professional preset");
    console.log("  tui preset add ai         # Add AI components preset");

    return;
  }

  if (action === "add" && presetName) {
    const preset = PRESETS[presetName as keyof typeof PRESETS];

    if (!preset) {
      console.error(`❌ Unknown preset: ${presetName}`);
      console.log("Available presets:", Object.keys(PRESETS).join(", "));
      process.exit(1);
    }

    console.log(`🎯 Adding ${preset.name} preset...`);
    console.log(`📝 ${preset.description}`);
    console.log(`📦 Components: ${preset.components.join(", ")}`);
    console.log("");

    // Use the add command to install all components
    await addCommand(preset.components, {
      force: options.force,
    });

    console.log(`\n🎉 Successfully added ${preset.name} preset!`);

    // Show usage examples for the preset
    showPresetExamples(presetName);

    return;
  }

  console.error("❌ Invalid preset command");
  console.log("Usage:");
  console.log("  tui preset list           # List all available presets");
  console.log("  tui preset add <name>     # Add a preset");
  console.log("  tui preset add minimal    # Add minimal preset");
}

function showPresetExamples(presetName: string) {
  const examples = {
    minimal: `
📚 Minimal Preset Examples:

Basic layout:

import { Box, Text, Button, Input } from './components/ui';

const app = new Box({
  parent: screen,
  width: '100%',
  height: '100%',
  border: 'line'
});

const title = new Text({
  parent: app.el,
  top: 1,
  left: 2,
  content: 'Welcome to TUI-Kit-AI',
  fg: 'accent.400'
});
`,

    pro: `
📚 Pro Preset Examples:

Professional layout:
\`\`\`tsx
import { Box, Stack, Heading, Badge, Progress } from './components/ui';

const header = new Box({
  parent: screen,
  height: 5,
  border: 'line',
  borderColor: 'accent.500'
});

const title = new Heading({
  parent: header.el,
  top: 1,
  left: 2,
  level: 1,
  text: 'Dashboard',
  fg: 'accent.400'
});

const status = new Badge({
  parent: header.el,
  top: 1,
  right: 2,
  variant: 'success',
  text: 'Online'
});
\`\`\`
`,

    ai: `
📚 AI Preset Examples:

Chat interface:
\`\`\`tsx
import { ChatLayout, MessageList, PromptEditor } from './components/ui';
import { useChatTUI } from '@tui-kit-ai/ai';

const chat = useChatTUI({
  model: openai('gpt-4o-mini'),
  tools: []
});

const chatLayout = new ChatLayout({
  parent: screen,
  messages: chat.messages,
  onSubmit: chat.submit
});
\`\`\`
`,

    dashboard: `
📚 Dashboard Preset Examples:

Monitoring interface:
\`\`\`tsx
import { Box, Badge, Progress, StatusBar } from './components/ui';

const metrics = new Box({
  parent: screen,
  top: 0,
  height: 10,
  border: 'line'
});

const cpuProgress = new Progress({
  parent: metrics.el,
  top: 2,
  left: 2,
  width: 30,
  value: 75,
  label: 'CPU Usage'
});
\`\`\`
`,
  };

  const example = examples[presetName as keyof typeof examples];
  if (example) {
    console.log(example);
  }
}
