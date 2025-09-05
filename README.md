# TUI-Kit-AI

A comprehensive Terminal User Interface (TUI) component library for building AI-powered CLI applications and agents. Built with TypeScript, designed for modern AI copilots like Claude Code.

## 🚀 Features

- **Rich TUI Components**: Pre-built terminal components with unified shadcn-style API
- **AI Integration**: Seamless integration with AI providers (OpenAI, Anthropic, Ollama)
- **Robust Streaming**: Real-time AI response streaming with backpressure and abort support
- **Agent System**: Modular agent architecture with lifecycle management and type safety
- **CLI Framework**: Professional CLI applications with standard flags and error handling
- **Performance Optimized**: 60fps rendering with throttling and safe updates
- **TypeScript First**: Full type safety with discriminated unions and strong typing
- **Modular Architecture**: Use only what you need, when you need it

## 📦 Packages

|Package                |Description                         |
|-----------------------|------------------------------------|
|`@tui-kit-ai/core`     |Core TUI components and primitives  |
|`@tui-kit-ai/ai`       |AI-specific components and streaming|
|`@tui-kit-ai/agents`   |Agent system and specialized agents |
|`@tui-kit-ai/providers`|AI provider implementations         |
|`@tui-kit-ai/cli`      |CLI framework and bootstrapping     |

## 🔧 Quick Start

### Installation

```bash
npm i @tui-kit-ai/core @tui-kit-ai/ai @tui-kit-ai/agents
```

### Basic Chat Application

```typescript
import { useTerminal, Box, TextInput, KEY, safeRender } from '@tui-kit-ai/core';
import { ChatContainer, AIService, ProviderClient } from '@tui-kit-ai/ai';
import { OpenAIProvider } from '@tui-kit-ai/providers';

// Create unified provider client
const client: ProviderClient = new OpenAIProvider(
  process.env.OPENAI_API_KEY,
  'gpt-4'
);

const aiService = new AIService({
  provider: 'openai',
  model: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY
}, undefined, client);

const { screen, render } = useTerminal();

const chatContainer = new ChatContainer({
  parent: screen,
  messages: [],
  ai: aiService,
  systemPrompt: 'You are a helpful coding assistant.',
  onError: (error) => console.error('Chat error:', error)
});

// Abort streaming with Ctrl+C
screen.key([KEY.ctrlC], () => {
  chatContainer.destroy();
  process.exit(0);
});
```

### Agent-Based Application

```typescript
import { AgentManager, TodoAgent, AgentTask, CreateTask } from '@tui-kit-ai/agents';

const agentManager = new AgentManager();

const todoAgent = new TodoAgent({
  name: 'todo-agent',
  description: 'Manages development tasks',
});

agentManager.registerAgent(todoAgent);
await agentManager.startAllAgents();

// Type-safe task creation with discriminated unions
const createTask: CreateTask = {
  type: 'create',
  data: { title: 'Implement user authentication' }
};

await todoAgent.handleTask(createTask);

// Or use the simplified API
await todoAgent.addTask('Implement user authentication');

// Lifecycle management
agentManager.on('agentRegistered', (name) => {
  console.log(`Agent ${name} registered`);
});

// Clean shutdown
process.on('SIGINT', async () => {
  await agentManager.stopAllAgents();
  agentManager.destroy();
  process.exit(0);
});
```

## 🏗️ Architecture

### Unified Component API (shadcn-style)

All components support consistent props for predictable behavior:

```typescript
interface ComponentProps {
  variant?: 'default' | 'muted' | 'ghost' | 'destructive' | 'primary' | 'secondary' | 'outline' | 'link' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'error';
  padding?: number | [number, number];
  radius?: number;
  focus?: boolean;
  disabled?: boolean;
}
```

### Core Components

- **Layout**: `Box`, `Flex`, `Grid`, `Panel`
- **Input**: `TextInput`, `Select`, `Checkbox`, `MultiSelect`, `Button`, `RadioGroup`, `Prompt`, `SearchBox`
- **Display**: `Text`, `Heading`, `Paragraph`, `Badge`, `Avatar`, `Divider`
- **Feedback**: `Spinner`, `ProgressBar`, `Gauge`, `StatusIndicator`, `Toast`, `Notification`, `ProgressSpinner`, `ProgressDots`, `ProgressList`, `StatusBar`
- **Navigation**: `Menu`, `Tabs`, `Breadcrumb`, `Tree`, `Table`
- **Containers**: `Scrollable`, `Modal`, `HelpOverlay`, `Tooltip`, `Collapsible`, `LogViewer`, `Stepper`

### AI Components

- **Chat**: `ChatContainer` with abort support and status indicators
- **Streaming**: `AIService` with unified `ProviderClient` interface
- **Providers**: `OpenAIProvider`, `AnthropicProvider`, `OllamaProvider` with retry logic

### Agent System

- **Base**: `BaseAgent` with lifecycle management and timer cleanup
- **Manager**: `AgentManager` with event handling and graceful shutdown
- **Specialized**: `TodoAgent` with discriminated union types

## 📋 Examples

### Simple Todo CLI

```bash
cd examples/todo-agent
npm install
npm run dev
```

### Code Assistant

```bash
cd examples/code-assistant
npm install
npm run dev
```

### Multi-Agent System

```bash
cd examples/multi-agent
npm install
npm run dev
```

## 🛠️ Development

```bash
# Install root deps
npm install

# Build all packages
npm run build

# Run examples
npm run start:chat-cli
npm run start:core-gallery
npm run start:ai-chat-app
```

## 🚀 CLI Usage

The TUI-Kit-AI CLI provides standard flags and robust error handling:

```bash
# Global options
tui --model gpt-4 --provider openai --debug --no-color

# Initialize project
tui init --renderer blessed --force

# Add components
tui add button input chat-layout --force

# Environment variables
export OPENAI_API_KEY=your_key_here
export ANTHROPIC_API_KEY=your_key_here
export OLLAMA_BASE_URL=http://localhost:11434
export TUI_AI_DEBUG=1
export TUI_AI_TIMEOUT_MS=30000
export TUI_AI_MAX_RETRIES=2
```

## 📚 Documentation

- [Getting Started](./docs/getting-started.md)

## 🔌 AI Provider Support

- **OpenAI**: via `OpenAIProvider`
- **Anthropic**: via `AnthropicProvider`
- **Local Models**: via `OllamaProvider`

## 🎨 Theming

Use `darkTheme` or `lightTheme` and override any token via `theme` prop on components.

## 📄 Changelog

### v0.1.1 - "shadcn for Terminal" Release

#### ✨ New Features
- **Unified Component API**: All components now support consistent shadcn-style props (`variant`, `size`, `tone`, `padding`, `radius`, `focus`, `disabled`)
- **Performance Optimized**: 60fps rendering with `safeRender()` throttling and `KEY` constants
- **Robust AI Streaming**: Backpressure handling, abort support, and token budget management
- **Type-Safe Agents**: Discriminated union types for tasks and lifecycle management
- **Provider Retry Logic**: Exponential backoff with jitter for transient errors
- **Enhanced CLI**: Standard flags (`--model`, `--provider`, `--debug`, `--no-color`) and API key validation

#### 🔧 Improvements
- **Token System**: Unified design tokens for consistent theming across all components
- **Focus Management**: Standardized focus/blur handling with visual indicators
- **Error Handling**: Comprehensive error boundaries and graceful degradation
- **Documentation**: Updated examples and API documentation

#### 🐛 Bug Fixes
- Fixed render flickering with throttled updates
- Improved placeholder handling in TextInput
- Better cleanup of timers and intervals in agents
- Enhanced abort signal propagation

## 📄 License

MIT

