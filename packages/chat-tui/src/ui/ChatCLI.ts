import blessed from 'blessed';
import type { ChatMessage, ChatProviderLike } from '../types';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ProviderSelector, type ProviderOption } from './ProviderSelector';
import { OpenAIProvider, AnthropicProvider, OllamaProvider } from '@tui-kit-ai/providers';
import { StreamPanel } from './StreamPanel';
import { CodeBlockViewer } from './CodeBlockViewer';
import { ToolsPanel } from './ToolsPanel';

type ProviderId = 'openai' | 'anthropic' | 'ollama';

export interface ChatCLIOptions {
  title?: string;
  provider?: ProviderId;
  model?: string;
  apiKey?: string; // generic for OpenAI/Anthropic
  openaiApiKey?: string;
  anthropicApiKey?: string;
  openaiBaseUrl?: string;
  ollamaBaseUrl?: string;
}

export class ChatCLI {
  private screen: blessed.Widgets.Screen;
  private messages: ChatMessage[] = [];
  private messageList: MessageList;
  private input: ChatInput;
  private selector: ProviderSelector;
  private streamPanel: StreamPanel;
  private codePanel: CodeBlockViewer;
  private toolsPanel: ToolsPanel;
  private providerId: ProviderId;
  private provider: ChatProviderLike;
  private opts: ChatCLIOptions;

  constructor(opts: ChatCLIOptions = {}) {
    this.screen = blessed.screen({ smartCSR: true, title: opts.title ?? 'Chat CLI' });
    this.opts = opts;

    // Provider state
    this.providerId = opts.provider ?? 'openai';
    this.provider = this.createProvider(this.providerId, opts);

    // Sidebar provider selector
    const providerOptions: ProviderOption[] = [
      { id: 'openai', label: 'OpenAI' },
      { id: 'anthropic', label: 'Anthropic' },
      { id: 'ollama', label: 'Ollama (local)' },
    ];
    this.selector = new ProviderSelector({
      parent: this.screen,
      top: 0,
      left: 0,
      width: 24,
      height: '100%',
      options: providerOptions,
      onChange: (id) => this.switchProvider(id as ProviderId),
    });

    // Message list (center column)
    this.messageList = new MessageList({
      parent: this.screen,
      top: 0,
      left: 24,
      right: 40,
      bottom: 3,
    });

    // Input
    this.input = new ChatInput({
      parent: this.screen,
      left: 24,
      right: 40,
      bottom: 0,
      height: 3,
      onSubmit: (text) => this.handleSubmit(text),
    });

    // Right column panels (stream/code/tools)
    this.streamPanel = new StreamPanel({ parent: this.screen, top: 0, right: 0, width: 40, height: '40%' });
    this.codePanel = new CodeBlockViewer({ parent: this.screen, top: '40%', right: 0, width: 40, height: '40%' });
    this.toolsPanel = new ToolsPanel({ parent: this.screen, top: '80%', right: 0, width: 40, height: '20%' });

    // Global keys
    this.screen.key(['C-c', 'q'], () => process.exit(0));
    this.input.focus();
    this.screen.render();
  }

  private createProvider(id: ProviderId, opts: ChatCLIOptions): ChatProviderLike {
    switch (id) {
      case 'anthropic':
        return new AnthropicProvider(opts.anthropicApiKey || opts.apiKey || process.env.ANTHROPIC_API_KEY, opts.model);
      case 'ollama':
        return new OllamaProvider(opts.ollamaBaseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434', opts.model ?? 'llama3');
      case 'openai':
      default:
        return new OpenAIProvider(opts.openaiApiKey || opts.apiKey || process.env.OPENAI_API_KEY, opts.model, opts.openaiBaseUrl || process.env.OPENAI_BASE_URL || 'https://api.openai.com');
    }
  }

  private switchProvider(id: ProviderId) {
    this.providerId = id;
    this.provider = this.createProvider(id, this.opts);
    this.logSystem(`Switched provider: ${id}`);
  }

  private logSystem(text: string) {
    this.messages.push({ role: 'system', content: text });
    this.messageList.setMessages(this.messages);
  }

  private async handleSubmit(text: string) {
    // Add user message
    this.messages.push({ role: 'user', content: text });
    this.messageList.setMessages(this.messages);

    // Start streaming assistant
    this.messageList.beginStreaming('assistant');
    const stream = await this.provider.stream(this.messages);

    let acc = '';
    for await (const ch of stream) {
      acc += ch;
      this.messageList.updateStreaming(acc);
      this.streamPanel.setContent(acc);
      this.codePanel.updateFromContent(acc);
    }

    // Finalize
    this.messageList.finalizeStreaming();
    this.messages.push({ role: 'assistant', content: acc });
    this.codePanel.updateFromContent(acc);
  }

  run() {
    // keep process alive
  }
}
