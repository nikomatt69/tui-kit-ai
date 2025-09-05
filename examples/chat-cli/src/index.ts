import { ChatCLI } from '@tui-kit-ai/chat-tui';

// Simple Chat CLI demo using the prebuilt TUI components
const app = new ChatCLI({ provider: 'openai', model: 'gpt-4o-mini',apiKey: process.env.OPENAI_API_KEY });
app.run();

