# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TUI-Kit-AI is a comprehensive Terminal User Interface (TUI) component library for building AI-powered CLI applications and agents. The project uses a **monorepo architecture** with a workspace-based structure for modular package development.

## Architecture

### Monorepo Structure
- **Root workspace**: Manages shared configuration and cross-package builds
- **packages/**: Core library packages with TypeScript/Blessed.js foundation
- **examples/**: Demonstration applications showing usage patterns

### Core Packages
- `@tui-kit-ai/core`: TUI primitives built on Blessed.js (Box, TextInput, Spinner, etc.)
- `@tui-kit-ai/ai`: AI integration components with streaming support
- `@tui-kit-ai/agents`: Agent system with BaseAgent and specialized agents
- `@tui-kit-ai/providers`: AI provider implementations (OpenAI, Anthropic, Ollama)
- `@tui-kit-ai/cli`: CLI framework and bootstrapping utilities

### Key Technologies
- **Terminal UI**: Blessed.js for cross-platform terminal interfaces
- **AI Integration**: Vercel AI SDK (`ai` package) for provider abstraction
- **Build System**: TypeScript with shared base configuration
- **Package Management**: npm workspaces for monorepo coordination

## Development Commands

### Root Level Commands
```bash
# Build all packages in dependency order
npm run build

# Clean all package build artifacts  
npm run clean

# Generate new components/agents/CLI templates
npm run generate

# Run examples (navigate to specific example first)
npm run dev  # Only works from examples/* directories
```

### Package-Level Commands
Each package supports:
```bash
# Build TypeScript to dist/
npm run build

# Remove build artifacts
npm run clean
```

### Example Applications
```bash
# Todo agent example
cd examples/todo-agent && npm run dev

# Code assistant example  
cd examples/code-assistant && npm run dev

# Multi-agent system example
cd examples/multi-agent && npm run dev
```

### Code Generation
```bash
# Generate new TUI component in packages/core/src/components/
npm run generate -- --type component --name ComponentName

# Generate new agent in packages/agents/src/
npm run generate -- --type agent --name AgentName

# Generate CLI template in packages/cli/src/
npm run generate -- --type cli --name CliName
```

## Component Architecture

### TUI Component Structure
All components follow the BaseComponent pattern with:
- **Props Interface**: TypeScript interface extending BaseProps
- **Component Class**: Implements Component<WidgetType> interface
- **Blessed.js Widget**: Underlying terminal widget (el property)
- **Theme Support**: Integrated theming system
- **Lifecycle Management**: destroy() method for cleanup

### Agent System Design
- **BaseAgent**: Abstract class providing event-driven architecture
- **AgentManager**: Central registry for agent lifecycle and task routing
- **Specialized Agents**: TodoAgent and custom implementations
- **Event Bus**: Inter-agent communication with performance tracking

### AI Service Integration
- **Provider Abstraction**: Unified interface across OpenAI/Anthropic/Ollama
- **Streaming Support**: Real-time response processing with visual feedback
- **ChatContainer**: Pre-built conversation interface with message handling

## Build System Details

### TypeScript Configuration
- **Base config**: `tsconfig.base.json` with ES2020 target and CommonJS modules
- **Package configs**: Each package extends base with package-specific settings
- **Output**: CommonJS modules in dist/ with source maps and declarations

### Package Dependencies
- **Core**: Blessed.js for terminal widgets, type definitions
- **AI**: Vercel AI SDK for provider abstraction, internal package dependencies
- **Agents**: Depends on AI package for service integration
- **Examples**: Use tsx for development execution, depend on relevant packages

## Development Workflow

### Adding New Components
1. Use code generator: `npm run generate -- --type component --name NewComponent`
2. Implement in generated file following BaseComponent pattern
3. Export from appropriate package index.ts
4. Build with `npm run build` from package or root

### Creating New Agents
1. Generate template: `npm run generate -- --type agent --name NewAgent`
2. Extend BaseAgent with specialized functionality
3. Register with AgentManager in applications
4. Test with example applications

### Working with Examples
- Examples use `tsx` for direct TypeScript execution
- Navigate to specific example directory before running `npm run dev`
- Examples import packages using workspace dependencies (*)

## Testing Strategy
- No formal test framework currently configured
- Examples serve as integration tests for package functionality
- Manual testing through example applications recommended

## Package Publishing
All packages configured for npm publishing with:
- MIT license
- TypeScript declarations generated
- CommonJS module format
- Semantic versioning (currently 0.1.0)