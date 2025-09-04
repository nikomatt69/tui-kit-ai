# TUI Kit AI 🚀

**shadcn/ui per Terminali** - Un UI Kit completo per terminali con integrazione AI, ispirato a shadcn/ui ma progettato per applicazioni CLI e TUI.

## ✨ Caratteristiche Principali

- **🎨 Componenti TUI Predefiniti**: 40+ componenti terminal pronti all'uso
- **🤖 Integrazione AI**: Supporto nativo per OpenAI, Anthropic, Ollama e altri provider
- **🔧 Sistema di Varianti**: Design system moderno con class-variance-authority
- **📱 Responsive**: Componenti che si adattano alle dimensioni del terminale
- **🎯 CLI Generator**: Crea nuovi componenti, app e agenti con un comando
- **📦 Architettura Modulare**: Usa solo quello che ti serve
- **🔒 TypeScript First**: Tipizzazione completa e IntelliSense
- **🎭 Sistema di Theming**: Temi personalizzabili e design tokens

## 🚀 Quick Start

### Installazione

```bash
# Clona la repository
git clone https://github.com/nikomatt69/tui-kit-ai.git
cd tui-kit-ai

# Installa le dipendenze
npm install

# Build del CLI
npm run cli:build

# Crea la tua prima app
npm run tui-kit create app my-app --template basic-app

# Avvia l'app
cd examples/my-app
npm install
npm run dev
```

### Uso Base

```typescript
import blessed from 'blessed';
import { Box, Text, Button, Flex } from '@tui-kit-ai/core';

// Crea lo schermo
const screen = blessed.screen({ smartCSR: true });

// Crea componenti
const container = new Box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  bg: 'blue',
  fg: 'white',
});

const button = new Button({
  parent: container,
  label: 'Click me!',
  variant: 'primary',
  size: 'lg',
  onClick: () => console.log('Clicked!'),
});

screen.render();
```

## 📦 Pacchetti

| Pacchetto | Descrizione | Status |
|------------|-------------|---------|
| `@tui-kit-ai/core` | Componenti TUI base e primitivi | ✅ Ready |
| `@tui-kit-ai/ai` | Componenti AI e streaming | 🚧 In sviluppo |
| `@tui-kit-ai/agents` | Sistema di agenti AI | 🚧 In sviluppo |
| `@tui-kit-ai/providers` | Integrazioni AI provider | 🚧 In sviluppo |
| `@tui-kit-ai/cli` | CLI generator e tools | ✅ Ready |

## 🎨 Componenti Disponibili

### Layout
- `Box` - Container base con styling
- `Flex` - Layout flexbox
- `Grid` - Layout a griglia
- `Panel` - Pannelli organizzati
- `Card` - Card con ombre e bordi

### Input
- `Button` - Pulsanti con varianti
- `TextInput` - Input di testo
- `Select` - Menu a tendina
- `Checkbox` - Checkbox
- `RadioGroup` - Gruppi di radio button
- `SearchBox` - Ricerca con filtri

### Display
- `Text` - Testo stilizzato
- `Heading` - Titoli multi-livello
- `Badge` - Badge e tag
- `Avatar` - Avatar utente
- `ProgressBar` - Barre di progresso
- `Spinner` - Indicatori di caricamento

### Navigation
- `Menu` - Menu di navigazione
- `Tabs` - Tab organizzati
- `Breadcrumb` - Breadcrumb
- `Tree` - Alberi gerarchici
- `Table` - Tabelle dati

### AI Components
- `ChatInterface` - Interfaccia chat completa
- `MessageList` - Lista messaggi
- `PromptEditor` - Editor prompt
- `StreamingText` - Testo in streaming
- `CodeBlock` - Blocchi codice

## 🎯 CLI Commands

### Creare Componenti

```bash
# Crea un nuovo componente
tui-kit create component MyComponent

# Crea un componente in un pacchetto specifico
tui-kit create component MyComponent --package ai

# Crea un agente AI
tui-kit create agent CodeAssistant

# Crea un hook personalizzato
tui-kit create hook useAI

# Crea un provider AI
tui-kit create provider CustomAI
```

### Creare App

```bash
# App base
tui-kit create app my-app --template basic-app

# App con chat AI
tui-kit create app my-chat --template ai-chat

# Sistema multi-agente
tui-kit create app my-agents --template agent-system
```

### Sviluppo

```bash
# Build tutti i pacchetti
tui-kit build

# Build specifico pacchetto
tui-kit build --package core

# Test
tui-kit test

# Avvia esempi
tui-kit dev --example todo-agent
```

## 🎨 Sistema di Varianti

Ogni componente supporta varianti, dimensioni e stati:

```typescript
const button = new Button({
  label: 'Click me',
  variant: 'primary',     // default, destructive, outline, secondary, ghost, link
  size: 'lg',            // sm, default, lg, icon
  state: 'default',      // default, disabled, loading, active
});
```

### Design Tokens

```typescript
import { tokens } from '@tui-kit-ai/core';

// Colori
tokens.colors.primary[500]    // #3b82f6
tokens.colors.success[500]    // #22c55e
tokens.colors.error[500]      // #ef4444

// Spacing
tokens.spacing[4]             // 4
tokens.spacing[16]            // 16

// Border radius
tokens.borderRadius.lg        // 8
tokens.borderRadius.full      // 9999
```

## 🤖 Integrazione AI

### Chat Interface

```typescript
import { ChatInterface, AIService } from '@tui-kit-ai/ai';

const aiService = new AIService({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
});

const chat = new ChatInterface({
  parent: screen,
  aiService,
  onMessageSubmit: async (content) => {
    const response = await aiService.generateText(content);
    return response.text;
  },
});
```

### Streaming Support

```typescript
const stream = await aiService.streamCompletion([
  { role: 'user', content: 'Explain TypeScript' }
]);

for await (const chunk of stream.textStream) {
  // Aggiorna l'interfaccia in tempo reale
  chat.updateMessage(chunk);
}
```

## 🏗️ Architettura

```
tui-kit-ai/
├── packages/
│   ├── core/           # Componenti base TUI
│   ├── ai/             # Componenti AI
│   ├── agents/         # Sistema agenti
│   ├── providers/      # AI providers
│   └── cli/            # CLI generator
├── examples/            # App di esempio
├── templates/           # Template per nuove app
├── docs/               # Documentazione
└── tools/              # Strumenti di sviluppo
```

## 🧪 Testing

```bash
# Test tutti i pacchetti
npm run test

# Test specifico pacchetto
npm run test --workspace=@tui-kit-ai/core

# Test con coverage
npm run test -- --coverage

# Test in watch mode
npm run test -- --watch
```

## 📚 Documentazione

- [Getting Started](./docs/getting-started.md)
- [Componenti](./docs/components/)
- [Theming](./docs/theming.md)
- [AI Integration](./docs/ai-integration.md)
- [Examples](./docs/examples.md)

## 🤝 Contribuire

1. Fork la repository
2. Crea un branch per la feature (`git checkout -b feature/amazing-feature`)
3. Commit le modifiche (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Apri una Pull Request

## 📄 License

MIT License - vedi [LICENSE](LICENSE) per i dettagli.

## 🙏 Ringraziamenti

- [shadcn/ui](https://github.com/shadcn-ui/ui) per l'ispirazione
- [Blessed](https://github.com/chjj/blessed) per il rendering TUI
- [Vercel AI SDK](https://github.com/vercel/ai) per l'integrazione AI

---

**TUI Kit AI** - Porta la bellezza di shadcn/ui nei tuoi terminali! 🎨✨

